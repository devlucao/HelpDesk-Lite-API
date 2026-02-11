# Requests (REST Client)

Este projeto utiliza a extensão **REST Client** no VS Code para executar chamadas HTTP diretamente pelo editor.

## ✅ Como usar
1. Inicie a API (`node src/server.js`)
2. Abra os arquivos `.http` em `requests/`
3. Execute primeiro o request de login (`Send Request`)
4. Em seguida, execute os requests protegidos (`/me`, `/admin/ping`)

## Variáveis
Os tokens são capturados automaticamente via:
- `{{loginAdmin.response.body.token}}`
- `{{loginClient.response.body.token}}`

## Cenários cobertos
- Login válido
- Login inválido (401)
- Acesso sem token (401)
- Acesso sem permissão (403)
- Cadastro de usuário (201)
- Cadastro duplicado (409)
