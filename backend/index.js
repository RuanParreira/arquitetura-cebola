
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dbConnection = require('./src/infrastructure/database/sqlite-connection');
const SQLiteUserRepository = require('./src/infrastructure/repositories/SQLiteUserRepository');
const SQLiteProjectRepository = require('./src/infrastructure/repositories/SQLiteProjectRepository');
const SQLiteTaskRepository = require('./src/infrastructure/repositories/SQLiteTaskRepository');

// Routes
const createAuthRoutes = require('./src/presentation/routes/authRoutes');
const createUserRoutes = require('./src/presentation/routes/userRoutes');
const createProjectRoutes = require('./src/presentation/routes/projectRoutes');
const createTaskRoutes = require('./src/presentation/routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database and repositories
let userRepository, projectRepository, taskRepository;

const initializeApp = async () => {
  try {
    await dbConnection.connect();
    const db = dbConnection.getDatabase();
    
    // Initialize repositories
    userRepository = new SQLiteUserRepository(db);
    projectRepository = new SQLiteProjectRepository(db);
    taskRepository = new SQLiteTaskRepository(db);

    // Setup routes
    app.use('/api/auth', createAuthRoutes(userRepository));
    app.use('/api/users', createUserRoutes(userRepository));
    app.use('/api/projects', createProjectRoutes(projectRepository, userRepository));
    app.use('/api/tasks', createTaskRoutes(taskRepository, projectRepository));

    // Health check
    app.get('/api/health', (req, res) => {
      res.json({ status: 'OK', message: 'Project Management API is running' });
    });

    // 404 handler
    app.use('*', (req, res) => {
      res.status(404).json({ error: 'Route not found' });
    });

    // Error handler
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ error: 'Something went wrong!' });
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
      console.log('\nAvailable credentials:');
      console.log('Admin: client_id=admin_client, client_secret=admin_secret_123');
      console.log('Colaborador: client_id=colaborador_client, client_secret=colaborador_secret_123');
    });
  } catch (error) {
    console.error('Failed to initialize application:', error);
    process.exit(1);
  }
};

initializeApp();

process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await dbConnection.close();
  process.exit(0);
});
