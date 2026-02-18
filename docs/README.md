# Helpdesk Lite API

API REST simples de Helpdesk com autenticação JWT, controle de roles e persistência em **PostgreSQL** via **Prisma**.

## Stack
- Node.js + Express
- PostgreSQL
- Prisma ORM
- JWT (auth)
- Error handler global (AppError)
- REST Client (arquivos `.http` para testes)

---

## Requisitos
- Node.js **(recomendado: v22 LTS)**  
- npm
- PostgreSQL **ou** Docker + Docker Compose
- (Opcional) Extensão **REST Client** no VS Code

---

## Setup (WSL/Windows)

### 1) Instalar dependências
```bash
npm install
````

### 2) Variáveis de ambiente

Crie um arquivo `.env` baseado no `.env.example`.

Exemplo mínimo:

```env
JWT_SECRET="uma-chave-bem-segura"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/helpdesk_lite?schema=public"
```
```
> **Dica (WSL):** mantenha o projeto dentro do filesystem do Linux (`/home/...`) para evitar problemas de performance/permissão.

---

## 3) Banco de dados (escolha 1 opção)

### Opção A — PostgreSQL via Docker (recomendado)

#### 3.1) `docker-compose.yml` (exemplo)

Crie um `docker-compose.yml` na raiz do projeto:

```yml
services:
  postgres:
    image: postgres:16
    container_name: helpdesk_postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: helpdesk_lite
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

#### 3.2) Subir o banco

```bash
docker compose up -d
```

#### 3.3) Ver logs (opcional)

```bash
docker compose logs -f postgres
```

#### 3.4) Parar o banco

```bash
docker compose down
```

> Se quiser remover **também** os dados persistidos:

```bash
docker compose down -v
```

#### 3.5) `.env` para Docker

Use:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/helpdesk_lite?schema=public"
```

---

### Opção B — PostgreSQL instalado localmente (sem Docker)

#### 3.1) Criar o banco e usuário (exemplo)

No seu Postgres local, crie:

* database: `helpdesk_lite`
* user: `postgres` (ou outro que você preferir)

#### 3.2) `.env` para Postgres local

Ajuste host/porta/credenciais:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/helpdesk_lite?schema=public"
```

#### 3.3) Confirmar conexão

* Confirme que o Postgres está rodando na porta `5432`
* Se estiver diferente, ajuste a URL

---

## 4) Prisma (generate + migrate + seed)

### 4.1) Gerar Prisma Client

```bash
npx prisma generate
```

### 4.2) Rodar migrations

```bash
npx prisma migrate dev
```

### 4.3) Rodar seed (popular usuários iniciais)

```bash
npx prisma db seed
```

### 4.4) Prisma Studio (opcional)

```bash
npx prisma studio
```

---

## 5) Rodar a API

```bash
node src/server.js
```

Servidor padrão:

* `http://localhost:3000`

---

## Rotas principais

### Auth

* `POST /login` *(retorna `{ token }`)*
* `GET /me` *(auth)*
* `GET /admin/ping` *(auth + admin)*

### Users

* `POST /users` *(cria client)*

### Tickets

* `POST /tickets` *(auth)*
* `GET /tickets` *(auth; paginação e filtro: `page/limit/status`)*
* `GET /tickets/:id` *(auth; client vê apenas próprio)*
* `PATCH /tickets/:id/status` *(auth; admin/agent; valida transições)*
* `PATCH /tickets/:id/assign` *(auth; admin/agent; atribui agent/admin)*

---

## Contratos de resposta

### Padrão (controllers)

* **Recurso único**

  * `200 -> { data }`
* **Create**

  * `201 -> { data }`
* **Listagens**

  * `200 -> { meta, data }`
* **Erro**

  * `{ error: "mensagem" }`

### Exceção intencional

* `POST /login`

  * `200 -> { token }`

---

## REST Client (testes)

Arquivos:

* `rest/auth.http`
* `rest/users.http`
* `rest/tickets.http`

> Use a extensão **REST Client** do VS Code para executar as requests diretamente.

---

## Arquitetura

* Visão detalhada da arquitetura em camadas e relacionamentos do Prisma:

  * `ARCHITECTURE.md`

---

## Notas

* Se você alterar o `schema.prisma`, rode:

  * `npx prisma migrate dev` (se mudou estrutura)
  * `npx prisma generate` (para atualizar o client)
* Se quebrar algo relacionado ao Prisma Client, normalmente resolve com:

  * `rm -rf node_modules package-lock.json && npm install`
  * `npx prisma generate`

