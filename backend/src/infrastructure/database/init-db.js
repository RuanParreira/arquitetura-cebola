
const dbConnection = require('./sqlite-connection');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

async function initializeDatabase() {
  try {
    await dbConnection.connect();
    const db = dbConnection.getDatabase();

    // Create tables
    await createTables(db);
    
    // Insert initial data
    await insertInitialData(db);

    console.log('Database initialized successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

function createTables(db) {
  return new Promise((resolve, reject) => {
    const queries = [
      `CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('admin', 'colaborador')),
        client_id TEXT UNIQUE NOT NULL,
        client_secret TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        owner_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (owner_id) REFERENCES users (id)
      )`,
      `CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        project_id TEXT NOT NULL,
        assigned_to TEXT,
        status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'in_progress', 'completed')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects (id),
        FOREIGN KEY (assigned_to) REFERENCES users (id)
      )`
    ];

    let completed = 0;
    queries.forEach((query) => {
      db.run(query, (err) => {
        if (err) {
          reject(err);
        } else {
          completed++;
          if (completed === queries.length) {
            resolve();
          }
        }
      });
    });
  });
}

async function insertInitialData(db) {
  const hashedPassword = await bcrypt.hash('123456', 10);
  
  const adminId = uuidv4();
  const colaboradorId = uuidv4();
  const projectId = uuidv4();

  return new Promise((resolve, reject) => {
    const users = [
      {
        id: adminId,
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        client_id: 'admin_client',
        client_secret: 'admin_secret_123'
      },
      {
        id: colaboradorId,
        name: 'João Silva',
        email: 'joao@example.com',
        password: hashedPassword,
        role: 'colaborador',
        client_id: 'colaborador_client',
        client_secret: 'colaborador_secret_123'
      }
    ];

    const projects = [
      {
        id: projectId,
        name: 'Sistema de Gestão',
        description: 'Projeto piloto para gerenciamento de tarefas',
        owner_id: adminId
      }
    ];

    const tasks = [
      {
        id: uuidv4(),
        title: 'Configurar ambiente de desenvolvimento',
        description: 'Instalar e configurar todas as dependências necessárias',
        project_id: projectId,
        assigned_to: colaboradorId,
        status: 'completed'
      },
      {
        id: uuidv4(),
        title: 'Implementar autenticação JWT',
        description: 'Criar sistema de autenticação usando JWT',
        project_id: projectId,
        assigned_to: adminId,
        status: 'in_progress'
      },
      {
        id: uuidv4(),
        title: 'Desenvolver interface do usuário',
        description: 'Criar telas para login e dashboard',
        project_id: projectId,
        assigned_to: colaboradorId,
        status: 'pending'
      }
    ];

    let completed = 0;
    const totalInserts = users.length + projects.length + tasks.length;

    // Insert users
    users.forEach(user => {
      db.run(
        'INSERT INTO users (id, name, email, password, role, client_id, client_secret) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [user.id, user.name, user.email, user.password, user.role, user.client_id, user.client_secret],
        (err) => {
          if (err && !err.message.includes('UNIQUE constraint failed')) {
            reject(err);
          } else {
            completed++;
            if (completed === totalInserts) resolve();
          }
        }
      );
    });

    // Insert projects
    projects.forEach(project => {
      db.run(
        'INSERT INTO projects (id, name, description, owner_id) VALUES (?, ?, ?, ?)',
        [project.id, project.name, project.description, project.owner_id],
        (err) => {
          if (err && !err.message.includes('UNIQUE constraint failed')) {
            reject(err);
          } else {
            completed++;
            if (completed === totalInserts) resolve();
          }
        }
      );
    });

    // Insert tasks
    tasks.forEach(task => {
      db.run(
        'INSERT INTO tasks (id, title, description, project_id, assigned_to, status) VALUES (?, ?, ?, ?, ?, ?)',
        [task.id, task.title, task.description, task.project_id, task.assigned_to, task.status],
        (err) => {
          if (err && !err.message.includes('UNIQUE constraint failed')) {
            reject(err);
          } else {
            completed++;
            if (completed === totalInserts) resolve();
          }
        }
      );
    });
  });
}

if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase };
