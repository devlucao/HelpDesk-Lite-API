# Helpdesk Lite API

API REST de helpdesk com autenticação JWT, controle de acesso por roles e segurança real de senha (bcrypt). Projeto desenvolvido para demonstrar padrões de arquitetura backend (routes/controllers/services/middlewares), error handler global e preparação para banco real via repository.

## ✨ Features
- Login com JWT (expiração configurada)
- Middleware de autenticação (`Authorization: Bearer <token>`)
- Controle de acesso por role (ex: rotas admin)
- Error Handler Global (respostas padronizadas)
- Cadastro de usuário com senha hasheada (bcrypt)
- Endpoint `/me` retorna dados completos do usuário autenticado
- Repository para isolar acesso ao “db fake” (preparação para SQL/ORM)

## 🧱 Arquitetura
- **routes/**: mapeamento de endpoints
- **controllers/**: camada HTTP (thin controllers)
- **services/**: regras de negócio + DTO mental (input/output)
- **middlewares/**: autenticação/autorização e pipeline
- **errors/**: `AppError` para erros esperados
- **database/**: db fake + repository

## ✅ Regras e padrões
- Senha nunca é armazenada em texto (somente `passwordHash`)
- Senha nunca é retornada em respostas (nem hash)
- Erros esperados usam `AppError(statusCode, message)`
- Erros inesperados retornam `500 Internal server error`

## 📌 Endpoints
### Auth
- `POST /login` → retorna `{ token }`

### Users
- `POST /users` → cria usuário **client** (público)
- `GET /me` → retorna usuário autenticado (sem hash)

### Admin
- `GET /admin/ping` → rota protegida (role `admin`)

## 🔐 Autenticação
Envie o header:
Authorization: Bearer token


## ⚙️ Como rodar
1. Instale dependências:
   - `npm install`
2. Crie `.env`:
   - `JWT_SECRET=seu_segredo`
3. Suba o servidor:
   - `node src/server.js`

## 🧪 Testes manuais
Os testes estão em `requests/` usando a extensão **REST Client** do VS Code.
- Execute `login` e em seguida chame `/me` e `/admin/ping`.

## 🗺️ Próximos passos (Roadmap)
- Migrar db fake para PostgreSQL
- ORM + migrations
- Tickets + relacionamentos
- Paginação, filtros e ordenação
- Docker + Deploy + CI/CD

## 📄 Licença
MIT
