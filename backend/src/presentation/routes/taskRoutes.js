
const express = require('express');
const TaskUseCase = require('../../application/usecases/TaskUseCase');
const { authMiddleware, adminMiddleware } = require('../../infrastructure/middleware/authMiddleware');
const { v4: uuidv4 } = require('uuid');

const createTaskRoutes = (taskRepository, projectRepository) => {
  const router = express.Router();
  const taskUseCase = new TaskUseCase(taskRepository, projectRepository);

  router.get('/', authMiddleware, async (req, res) => {
    try {
      let tasks;
      if (req.user.role === 'admin') {
        tasks = await taskUseCase.getAllTasks();
      } else {
        tasks = await taskUseCase.getTasksByUser(req.user.userId);
      }
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/my-tasks', authMiddleware, async (req, res) => {
    try {
      const tasks = await taskUseCase.getTasksByUser(req.user.userId);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/project/:projectId', authMiddleware, async (req, res) => {
    try {
      const tasks = await taskUseCase.getTasksByProject(req.params.projectId);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/:id', authMiddleware, async (req, res) => {
    try {
      const task = await taskUseCase.getTaskById(req.params.id);
      res.json(task);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  });

  router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const taskData = {
        id: uuidv4(),
        ...req.body
      };
      
      const task = await taskUseCase.createTask(
        taskData, 
        req.user.userId, 
        req.user.role
      );
      
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  router.put('/:id', authMiddleware, async (req, res) => {
    try {
      const result = await taskUseCase.updateTask(
        req.params.id, 
        req.body, 
        req.user.userId, 
        req.user.role
      );
      
      if (result) {
        res.json({ message: 'Task updated successfully' });
      } else {
        res.status(404).json({ error: 'Task not found' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const result = await taskUseCase.deleteTask(
        req.params.id, 
        req.user.userId, 
        req.user.role
      );
      
      if (result) {
        res.json({ message: 'Task deleted successfully' });
      } else {
        res.status(404).json({ error: 'Task not found' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  return router;
};

module.exports = createTaskRoutes;
