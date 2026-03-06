# Test SPS Server

API REST em Node.js + TypeScript para cadastro de usuários, com autenticação JWT e CRUD completo. Desenvolvida como parte do teste técnico SPS Group.

## Funcionalidades

- Autenticação com JWT
- CRUD completo de usuários
- Validação de entrada com Zod
- Senhas criptografadas com bcrypt
- Rate limiting (proteção contra brute force)
- Health check endpoint para monitoramento

## Pré-requisitos

- **Node.js** 18+ (recomendado LTS)
- **npm** ou **yarn**

## Como rodar o projeto

### 1. Instalar dependências

```bash
npm install
```

ou, se usar yarn:

```bash
yarn install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo de exemplo e preencha as variáveis:

```bash
cp .env
```

Edite o `.env`. Exemplo mínimo para desenvolvimento:

```env
PORT=3000
JWT_SECRET=sua-chave-secreta-aqui-use-algo-forte-em-producao
```

- **PORT** – porta em que o servidor sobe (padrão: 3000).
- **JWT_SECRET** – chave para assinar e validar os tokens JWT. Em produção use uma string longa e aleatória.

### 3. Subir o servidor

**Modo desenvolvimento** (com hot reload e debug na porta 7000):

```bash
npm run dev
```

ou:

```bash
yarn dev
```

**Modo produção** (compilar e rodar o build):

```bash
npm run build
npm start
```

ou:

```bash
yarn build
yarn start
```

O servidor estará em **[http://localhost:3000](http://localhost:3000)** (ou na porta definida em `PORT`).

## Testando a API

### Usuário admin (pré-cadastrado)


| Campo  | Valor                   |
| ------ | ----------------------- |
| E-mail | `admin@spsgroup.com.br` |
| Senha  | `1234`                  |


### Obter token (login)

```bash
curl -X POST http://localhost:3000/auth \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@spsgroup.com.br","password":"1234"}'
```

Na resposta você recebe um `token`. Use-o no header das próximas requisições:

```
Authorization: Bearer <seu-token>
```

### Exemplos com token

Listar usuários:

```bash
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer <seu-token>"
```

## Endpoints da API


| Método | Rota         | Autenticação | Descrição                           |
| ------ | ------------ | ------------ | ----------------------------------- |
| GET    | `/`          | Não          | Hello World                         |
| GET    | `/health`    | Não          | Health check (`{ "status": "ok" }`) |
| POST   | `/auth`      | Não          | Login (retorna token JWT)           |
| GET    | `/users`     | Sim          | Listar todos os usuários            |
| GET    | `/users/:id` | Sim          | Buscar usuário por ID               |
| POST   | `/users`     | Sim          | Cadastrar novo usuário              |
| PUT    | `/users/:id` | Sim          | Atualizar usuário                   |
| DELETE | `/users/:id` | Sim          | Remover usuário                     |


### Códigos de erro

A API retorna erros no formato `{ "error": "error.codigo" }`:


| Código                                      | HTTP | Descrição                                    |
| ------------------------------------------- | ---- | -------------------------------------------- |
| `error.validationFailed`                    | 400  | Dados inválidos (inclui `details` por campo) |
| `error.invalidCredentials`                  | 401  | Email ou senha incorretos                    |
| `error.missingOrInvalidAuthorizationHeader` | 401  | Header Authorization ausente ou inválido     |
| `error.invalidOrExpiredToken`               | 401  | Token JWT inválido ou expirado               |
| `error.userNotFound`                        | 404  | Usuário não encontrado                       |
| `error.emailAlreadyRegistered`              | 400  | Email já cadastrado                          |
| `error.emailAlreadyInUse`                   | 400  | Email em uso por outro usuário               |
| `error.tooManyRequests`                     | 429  | Limite de requisições excedido               |


## Testes

O projeto inclui testes unitários e de integração usando Jest.

```bash
npm test
```

Scripts de teste disponíveis:


| Comando                 | Descrição                               |
| ----------------------- | --------------------------------------- |
| `npm test`              | Roda todos os testes (modo sequencial). |
| `npm run test:watch`    | Roda testes em modo watch.              |
| `npm run test:coverage` | Roda testes com relatório de cobertura. |


## Scripts disponíveis


| Comando         | Descrição                                                    |
| --------------- | ------------------------------------------------------------ |
| `npm run dev`   | Sobe o servidor em modo desenvolvimento (nodemon + ts-node). |
| `npm run build` | Compila o TypeScript para `dist/`.                           |
| `npm start`     | Roda o servidor a partir de `dist/` (uso após `build`).      |
| `npm test`      | Roda os testes automatizados.                                |


## Estrutura do projeto

- `src/` – Código fonte (TypeScript)
  - `controllers/` – Handlers das rotas
  - `services/` – Lógica de negócio
  - `repository/` – Acesso aos dados (store em memória)
  - `routes/` – Definição das rotas
  - `middlewares/` – Autenticação JWT
  - `schemas/` – Validação (Zod)
  - `data/` – Store inicial de usuários
- `dist/` – Saída do build (gerado por `npm run build`)
- `docs/` – Documentação da API

## Licença

MIT