
# Sistema de Gestão de Projetos - Backend

Backend desenvolvido com arquitetura Onion (Clean Architecture) usando Node.js, Express e SQLite.

## 🚀 Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **SQLite** - Banco de dados local
- **JWT** - Autenticação
- **bcryptjs** - Hash de senhas
- **uuid** - Geração de IDs únicos

## 📁 Estrutura do Projeto

```
backend/
├── src/
│   ├── domain/                 # Camada de Domínio
│   │   ├── entities/          # Entidades de negócio
│   │   └── interfaces/        # Contratos/Interfaces
│   ├── application/           # Camada de Aplicação
│   │   └── usecases/         # Casos de uso
│   ├── infrastructure/        # Camada de Infraestrutura
│   │   ├── database/         # Configuração do banco
│   │   ├── repositories/     # Implementação dos repositórios
│   │   └── middleware/       # Middlewares
│   └── presentation/          # Camada de Apresentação
│       └── routes/           # Rotas da API
├── index.js                  # Ponto de entrada
├── .env                      # Variáveis de ambiente
└── package.json
```

## 🛠️ Instalação e Configuração

1. **Instalar dependências:**
```bash
cd backend
npm install
```

2. **Configurar variáveis de ambiente:**
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

3. **Inicializar banco de dados:**
```bash
npm run init-db
```

4. **Iniciar servidor:**
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

O servidor estará rodando em `http://localhost:3001`

## 🔐 Autenticação

O sistema utiliza autenticação via JWT com client_id e client_secret.

### Credenciais padrão:

**Administrador:**
- client_id: `admin_client`
- client_secret: `admin_secret_123`

**Colaborador:**
- client_id: `colaborador_client`
- client_secret: `colaborador_secret_123`

## 📊 Entidades

### User
- id (string)
- name (string)
- email (string)
- password (string) - hash bcrypt
- role (string) - 'admin' ou 'colaborador'
- client_id (string)
- client_secret (string)

### Project
- id (string)
- name (string)
- description (string)
- owner_id (string) - referência ao User

### Task
- id (string)
- title (string)
- description (string)
- project_id (string) - referência ao Project
- assigned_to (string) - referência ao User
- status (string) - 'pending', 'in_progress', 'completed'

## 🛡️ Permissões

### Admin
- CRUD completo em projetos
- CRUD completo em tarefas
- Visualizar todos os usuários
- Atribuir tarefas a qualquer usuário

### Colaborador
- Visualizar projetos
- Visualizar tarefas atribuídas
- Atualizar status das próprias tarefas

## 🔗 Endpoints da API

### Autenticação
- `POST /api/auth/login` - Login com client_id/client_secret
- `POST /api/auth/verify` - Verificar token JWT

### Usuários
- `GET /api/users` - Listar usuários (admin)
- `GET /api/users/:id` - Buscar usuário por ID

### Projetos
- `GET /api/projects` - Listar projetos
- `GET /api/projects/:id` - Buscar projeto por ID
- `POST /api/projects` - Criar projeto (admin)
- `PUT /api/projects/:id` - Atualizar projeto
- `DELETE /api/projects/:id` - Deletar projeto (admin)

### Tarefas
- `GET /api/tasks` - Listar tarefas
- `GET /api/tasks/my-tasks` - Tarefas do usuário logado
- `GET /api/tasks/project/:projectId` - Tarefas de um projeto
- `GET /api/tasks/:id` - Buscar tarefa por ID
- `POST /api/tasks` - Criar tarefa (admin)
- `PUT /api/tasks/:id` - Atualizar tarefa
- `DELETE /api/tasks/:id` - Deletar tarefa (admin)

## 📝 Scripts Disponíveis

- `npm start` - Inicia o servidor em produção
- `npm run dev` - Inicia o servidor em desenvolvimento com nodemon
- `npm run init-db` - Inicializa o banco de dados com dados de exemplo

## 🏗️ Arquitetura Onion

A arquitetura segue os princípios da Clean Architecture:

1. **Domain** - Regras de negócio e entidades
2. **Application** - Casos de uso da aplicação
3. **Infrastructure** - Detalhes técnicos (banco, JWT, etc.)
4. **Presentation** - Interface com o mundo externo (rotas HTTP)

As dependências apontam sempre para dentro, garantindo baixo acoplamento e alta testabilidade.
