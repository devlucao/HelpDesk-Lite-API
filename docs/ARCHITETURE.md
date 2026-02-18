# Architecture — Helpdesk Lite API

Este documento descreve a arquitetura atual da **Helpdesk Lite API**, explicando:
- camadas do projeto (routes → controllers → services → repositories → prisma/db)
- fluxo de autenticação (JWT + `req.user`)
- padrão de erros (`AppError` + `errorHandler`)
- contratos de resposta (`data` / `meta`)
- modelos e relacionamentos no Prisma (User, Ticket, TicketLog)
- onde ficam as requests de teste (REST Client)

---

## 1) Visão geral da arquitetura

A aplicação segue uma arquitetura em camadas para separar responsabilidades:

1. **Routes**: definem URLs, métodos HTTP e middlewares por rota.
2. **Middlewares**: autenticação/autorização e validações transversais.
3. **Controllers**: recebem `req`, chamam services e retornam resposta HTTP.
4. **Services**: regras de negócio, validações e orquestração (incluindo transações).
5. **Repositories**: acesso a dados (Prisma). Não contém regra de negócio.
6. **Prisma/Database**: schema, migrations, seed e Prisma Client.

Objetivo prático:
- trocar o banco (fake → Prisma/Postgres) sem refatorar a aplicação inteira
- manter a lógica de negócio no service e o acesso a dados no repository
- padronizar retornos e erros

---

## 2) Estrutura de pastas (visão recomendada)

> Pode variar no seu repo, mas a ideia é esta:

```

src/
controllers/
auth.controller.js
users.controller.js
tickets.controller.js
services/
auth.service.js
users.service.js
tickets.service.js
database/
prisma.js
users.repository.js
tickets.repository.js
ticketLogs.repository.js
middlewares/
auth.middleware.js
requireRole.middleware.js (se existir)
errors/
AppError.js
utils/
httpResponse.js
routes/
auth.routes.js
users.routes.js
tickets.routes.js
server.js

prisma/
schema.prisma
migrations/
seed.js (ou prisma/seed.js)

rest/
auth.http
users.http
tickets.http

````

---

## 3) Fluxo de uma requisição (end-to-end)

Exemplo: `PATCH /tickets/:id/status`

### 1) Route
- declara a rota e aplica `validateToken` antes do controller.

### 2) Middleware `validateToken`
- lê `Authorization: Bearer <token>`
- valida token via `jwt.verify`
- popula `req.user = { userId, role }`
- se falhar, dispara erro (AppError) e o `errorHandler` responde

### 3) Controller
- extrai dados de `req.params`, `req.body`, `req.user`
- chama o service
- retorna via helper `ok(res, data)` (padrão)

### 4) Service
- valida regra de negócio (status permitido, transição válida, role permitida)
- busca ticket no repositório
- executa uma transação com:
  - update do ticket
  - criação do log (TicketLog)
- retorna o ticket atualizado

### 5) Repository (Prisma)
- executa `prisma.ticket.update(...)`
- executa `prisma.ticketLog.create(...)` (com o mesmo `tx` dentro da transaction)

---

## 4) Autenticação e autorização

### JWT
- A rota `POST /login` valida as credenciais e retorna um token JWT.
- O token contém no payload ao menos:
  - `userId`
  - `role`

### Middleware `validateToken`
Responsabilidade:
- validar token
- extrair payload
- colocar no `req.user`

Formato esperado após o middleware:
```js
req.user = {
  userId: "u-001",
  role: "admin"
}
```
```

### Autorização por role

As regras por role ficam **no service** (regra de negócio), por exemplo:

* `client` não pode alterar status nem atribuir ticket
* `admin/agent` podem fazer determinadas ações

---

## 5) Erros: AppError + errorHandler global

### AppError

Classe custom para erros controlados:

```js
class AppError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}
```

### errorHandler

Middleware global que fica **depois** das rotas no `server.js`.
Responsabilidade:

* converter exceções em respostas HTTP padronizadas
* responder com `statusCode` + `message` para `AppError`
* responder `500` para erros inesperados

Saída típica:

```json
{ "error": "Mensagem do erro" }
```

---

## 6) Contratos de resposta (padrão `data` / `meta`)

Para padronizar respostas, existe `utils/httpResponse.js`:

* `ok(res, data)` → `200 { data }`
* `created(res, data)` → `201 { data }`
* `okList(res, data, meta)` → `200 { meta, data }`

### Exemplo: listagem com paginação

`GET /tickets?page=1&limit=10&status=open`

Resposta:

```json
{
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 32,
    "totalPages": 4
  },
  "data": [
    { "...ticket" }
  ]
}
```

> `meta` não é “front-end”. É um padrão útil para qualquer consumidor da API (frontend, mobile, integração, etc.).

---

## 7) Prisma: models e relacionamentos

### User

* possui tickets criados (`tickets`)
* possui tickets atribuídos (`assignedTickets`) via relação nomeada
* possui logs (`ticketLogs`)

### Ticket

* pertence a um criador (`createdById`)
* pode ter um agente/admin atribuído (`assignedToId`)

### TicketLog

* pertence a um ticket (`ticketId`)
* registra quem fez a ação (`performedById`)
* registra metadados opcionais em JSON (`metadata`)

### Relação nomeada: "TicketAssignee"

Usamos um nome de relação porque existem **duas relações Ticket → User**:

* `createdBy` (criador)
* `assignedTo` (atribuído)

Sem nomear, o Prisma não sabe diferenciar.

---

## 8) Transações (Ticket + TicketLog)

Objetivo:

* se atualizar o ticket, deve criar o log
* se falhar o log, deve desfazer o update
* tudo deve ser atômico

### Como funciona no Prisma

* `prisma.$transaction(async (tx) => { ... })`
* dentro dela, você usa `tx.ticket...` e `tx.ticketLog...`
* `tx` é um “Prisma Client de transação” (conectado à mesma transação)

Exemplo de fluxo (conceitual):

```js
const result = await prisma.$transaction(async (tx) => {
  const updatedTicket = await updateTicket(tx, ticketId, newStatus);
  await createLog(tx, logModel);
  return updatedTicket;
});
```

---

## 9) Padrão repository com `db` (prisma ou tx)

Para permitir transação, alguns repositories recebem `db`:

* fora de transação: `db = prisma`
* dentro da transação: `db = tx`

Exemplo:

```js
const updateTicket = (db, id, status) => {
  return db.ticket.update({ where: { id }, data: { status } });
};
```

---

## 10) Rotas principais implementadas

### Auth / User

* `POST /login`
* `GET /me`
* `POST /users`

### Tickets

* `POST /tickets`
* `GET /tickets` (paginação + filtro `status`)
* `GET /tickets/:id`
* `PATCH /tickets/:id/status`
* `PATCH /tickets/:id/assign`

---

## 11) REST Client (testes manuais)

Arquivos de teste ficam em:

* `rest/auth.http`
* `rest/users.http`
* `rest/tickets.http`

Esses arquivos:

* fazem login e capturam token automaticamente
* testam cenários de sucesso e erro
* testam regras de role (client vs admin/agent)

---

## 12) Decisões e convenções do projeto

* **Service decide o “shape” do retorno** (o que a API responde).
* **Repository não “pensa”**: apenas busca/salva dados.
* **Controllers são finos**: só fazem ponte entre HTTP e services.
* **Erros são centralizados**: `AppError` + `errorHandler`.
* **Padronização de retorno**: `data` / `meta`.
* **Transações** quando operações são codependentes (Ticket + Log).

---

## 13) Próximos passos recomendados (evolução)

* criar enums no Prisma para `role` e `status` (em vez de String solta)
* padronizar todas as rotas (inclusive login) para `{ data }`
* adicionar validação de DTO (Ajv/Zod) para inputs
* criar endpoints de leitura de logs:

  * `GET /tickets/:id/logs`
* melhorar observabilidade:

  * logs estruturados
  * request id

