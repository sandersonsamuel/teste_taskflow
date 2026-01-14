# Teste TaskFlow

API de gerenciamento de tarefas desenvolvida com Fastify e Prisma.

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- pnpm
- Docker e Docker Compose (para o banco de dados PostgreSQL)

## 🚀 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/sandersonsamuel/teste_taskflow.git
cd teste_taskflow
```

2. Instale as dependências:
```bash
pnpm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

## 🔧 Variáveis de Ambiente

Edite o arquivo `.env` com as seguintes variáveis:

```env
PORT=3333

POSTGRES_DB=root
POSTGRES_USER=root
POSTGRES_PASSWORD=root
DATABASE_URL=postgresql://root:root@localhost:5432/root

JWT_SECRET=asdfghjkl
COOKIE_SECRET=qwertyuiop
```

## 🏃 Execução

1. Inicie o banco de dados PostgreSQL:
```bash
docker-compose up -d
```

2. Execute as migrations do Prisma:
```bash
pnpm prisma migrate dev
```

3. Inicie o servidor de desenvolvimento:
```bash
pnpm dev
```

O servidor estará disponível em `http://localhost:3333`

## 🧪 Testes

Para executar os testes:
```bash
pnpm test
```

## 📚 Decisões Técnicas

### Fastify
O Fastify foi escolhido por sua alta performance, facilidade de uso e rapidez no desenvolvimento de APIs REST.

### Prisma
O Prisma foi escolhido por sua facilidade de uso, modelagem de dados intuitiva, rapidez no desenvolvimento, segurança e pela experiência prévia com este ORM.

### Zod (fastify-type-provider-zod)
Utilizei o Zod pela facilidade de tipagem e validação de dados integrada ao Fastify, além da experiência prévia com a biblioteca.

### Vitest
Utilizei o Vitest pela sua facilidade na criação de testes e análise de cobertura de código.

### PostgreSQL
Utilizei o PostgreSQL pela sua robustez, facilidade de uso e experiência prévia com este banco de dados relacional.

## 📁 Estrutura do Projeto

```
src/
├── controllers/    # Controladores das rotas
├── services/       # Lógica de negócio
├── routes/         # Definição de rotas
└── server.ts       # Configuração do servidor

tests/              # Testes de integração
prisma/             # Schema e migrations do Prisma
```
