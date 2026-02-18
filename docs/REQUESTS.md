# REST Client — Requests (Helpdesk Lite API)

Este repositório inclui arquivos `.http` para testar a API diretamente pelo **VS Code** usando a extensão **REST Client**.

## Pré-requisitos
- API rodando em `http://localhost:3000`
- Extensão **REST Client** instalada no VS Code
- Banco + Prisma configurados (migrate + seed)

Arquivos:
- `rest/auth.http`
- `rest/users.http`
- `rest/tickets.http`

---

## Como usar (sem copiar/colar token)

1) Abra o arquivo desejado (ex: `rest/tickets.http`)  
2) Execute a request **de login** (ela tem `# @name loginAdmin/loginClient/...`)  
3) Execute as requests seguintes que reutilizam automaticamente:
   - `Authorization: Bearer {{loginAdmin.response.body.token}}`

> Observação: em variáveis de resposta, **não use `@`** no template.  
✅ `{{loginAdmin.response.body.token}}`  
❌ `{{@loginAdmin.response.body.token}}`

---

## Fluxo recomendado de testes

### 1) Auth e permissões (rest/auth.http)
- Login admin → pega token
- `/me` com token
- `/admin/ping` como admin (200)
- Login agent → `/admin/ping` deve falhar (403)
- Login inválido (401)
- `/me` sem token (401)

---

### 2) Criar usuário client (rest/users.http)
- Criar user novo (200/201 dependendo do controller)
- Criar com email duplicado (409)
- Criar sem campos obrigatórios (400)

> A rota de users cria **client por padrão** (role = `client`).

---

### 3) Tickets (rest/tickets.http)

#### 3.1) Criar tickets
- Criar ticket como admin (201)
- Criar ticket como client (201)
- Criar sem título (400)
- Criar sem token (401)

#### 3.2) Listar tickets (com paginação + filtros)
- Listar como admin → vê todos (200)
- Listar como client → vê apenas próprios (200)
- `page/limit` válidos (200)
- `page=0` (400)
- `limit=999` (400)
- `status=open|in_progress|closed` (200)
- `status=paused` (400)

Retorno esperado:
```json
{
  "meta": { "page": 1, "limit": 10, "total": 42, "totalPages": 5 },
  "data": []
}
````

#### 3.3) Buscar por id

* Dono (client) acessa o próprio ticket (200)
* Admin acessa ticket de qualquer um (200)
* Client acessa ticket de outro → (403)
* Ticket inexistente → (404)

Retorno esperado:

```bash
{ "data": { "...": "..." } }
```
```

#### 3.4) Alterar status (PATCH /tickets/:id/status)

* Admin/agent muda status seguindo regras (200)
* Status inválido (400)
* Transição inválida (400)
* Client tentando mudar status (403)
* Ticket inexistente (404)

> Toda mudança de status gera um **TicketLog** via transação (ticket + log).

#### 3.5) Atribuir responsável (PATCH /tickets/:id/assign)

* Admin/agent atribui para `u-101` (200)
* Sem `assignedToId` (400)
* Usuário inexistente (404)
* Client tentando atribuir (403)
* Ticket inexistente (404)

---

## Dicas de debug rápido

* Se as variáveis `{{loginAdmin.response.body.token}}` não funcionarem:

  * garanta que você executou o login com `# @name ...` **antes**
  * confira se o login retorna exatamente `{ "token": "..." }`

* Se mudar schema/migration:

  * `npx prisma migrate dev`
  * `npx prisma generate`

---

## Seeds (usuários padrão)

Exemplos usados nos testes:

* Admin: `admin@helpdesk.com` / `Admin@123`
* Agent: `bruno.agent@helpdesk.com` / `Agent@123`
* Client: `pedro.client@helpdesk.com` / `Client@123`
