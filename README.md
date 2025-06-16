
# Sistema de Gestão de Projetos

Sistema fullstack completo para gerenciamento de projetos e tarefas, desenvolvido com arquitetura Onion no backend e React no frontend.

## 🌟 Características Principais

- **Autenticação JWT** com client_id e client_secret
- **Controle de Acesso** baseado em roles (admin/colaborador)
- **Gestão Completa** de projetos e tarefas
- **Interface Moderna** e responsiva
- **Arquitetura Limpa** e escalável

## 🚀 Tecnologias

### Backend
- **Node.js** + **Express.js**
- **SQLite** para persistência local
- **JWT** para autenticação
- **Arquitetura Onion** (Clean Architecture)

### Frontend
- **React** + **TypeScript**
- **Tailwind CSS** para estilização
- **Shadcn/UI** para componentes
- **React Router** para navegação

## 📋 Funcionalidades

### 👨‍💼 Administrador
- ✅ CRUD completo de projetos
- ✅ CRUD completo de tarefas
- ✅ Atribuição de tarefas a usuários
- ✅ Visualização de todos os dados

### 👨‍💻 Colaborador
- ✅ Visualização de projetos
- ✅ Visualização de tarefas atribuídas
- ✅ Atualização de status das próprias tarefas

## 🛠️ Como Executar

### 1. Backend

```bash
cd backend
npm install
npm run init-db
npm run dev
```

O backend estará rodando em `http://localhost:3001`

### 2. Frontend

```bash
npm install
npm run dev
```

O frontend estará rodando em `http://localhost:8080`

## 🔐 Credenciais de Acesso

### Administrador
- **Client ID:** `admin_client`
- **Client Secret:** `admin_secret_123`

### Colaborador
- **Client ID:** `colaborador_client`
- **Client Secret:** `colaborador_secret_123`

## 📁 Estrutura do Projeto

```
projeto/
├── backend/                   # API Node.js
│   ├── src/
│   │   ├── domain/           # Entidades e interfaces
│   │   ├── application/      # Casos de uso
│   │   ├── infrastructure/   # Repositórios e serviços
│   │   └── presentation/     # Rotas e middlewares
│   ├── index.js
│   └── package.json
├── src/                      # Frontend React
│   ├── pages/               # Páginas da aplicação
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Projects.tsx
│   │   └── Tasks.tsx
│   └── components/          # Componentes reutilizáveis
├── package.json
└── README.md
```

## 🎯 Entidades do Sistema

### User
- ID, nome, email, role
- Client ID e Client Secret para autenticação

### Project
- ID, nome, descrição
- Proprietário (owner_id)

### Task
- ID, título, descrição
- Projeto associado, usuário atribuído
- Status (pendente, em progresso, concluída)

## 📱 Páginas da Aplicação

1. **Login** - Autenticação com credenciais
2. **Dashboard** - Visão geral com estatísticas
3. **Projetos** - Gestão de projetos
4. **Tarefas** - Gestão de tarefas

## 🎨 Design

- **Tema:** Moderno com gradientes azuis
- **Layout:** Responsivo e intuitivo
- **Componentes:** Cards, badges, dialogs
- **Animações:** Transições suaves

## 🔄 Fluxo de Trabalho

1. **Login** com client_id/client_secret
2. **Dashboard** com visão geral dos dados
3. **Criação de Projetos** (admin)
4. **Atribuição de Tarefas** (admin)
5. **Acompanhamento** do progresso
6. **Atualização de Status** pelos colaboradores

## 🛡️ Segurança

- Tokens JWT com expiração
- Middleware de autenticação
- Controle de acesso baseado em roles
- Validação de dados de entrada

## 📊 Banco de Dados

O sistema utiliza SQLite com as seguintes tabelas:

- `users` - Usuários do sistema
- `projects` - Projetos cadastrados
- `tasks` - Tarefas dos projetos

Dados iniciais são criados automaticamente com o comando `npm run init-db`.

---

**Desenvolvido com ❤️ por Ruan, Leandro, Walysson**
