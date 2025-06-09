
const express = require('express');
const ProjectUseCase = require('../../application/usecases/ProjectUseCase');
const { authMiddleware, adminMiddleware } = require('../../infrastructure/middleware/authMiddleware');
const { v4: uuidv4 } = require('uuid');

const createProjectRoutes = (projectRepository, userRepository) => {
  const router = express.Router();
  const projectUseCase = new ProjectUseCase(projectRepository, userRepository);

  router.get('/', authMiddleware, async (req, res) => {
    try {
      const projects = await projectUseCase.getAllProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/:id', authMiddleware, async (req, res) => {
    try {
      const project = await projectUseCase.getProjectById(req.params.id);
      res.json(project);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  });

  router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const projectData = {
        id: uuidv4(),
        ...req.body
      };
      
      const project = await projectUseCase.createProject(
        projectData, 
        req.user.userId, 
        req.user.role
      );
      
      res.status(201).json(project);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  router.put('/:id', authMiddleware, async (req, res) => {
    try {
      const result = await projectUseCase.updateProject(
        req.params.id, 
        req.body, 
        req.user.userId, 
        req.user.role
      );
      
      if (result) {
        res.json({ message: 'Project updated successfully' });
      } else {
        res.status(404).json({ error: 'Project not found' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const result = await projectUseCase.deleteProject(
        req.params.id, 
        req.user.userId, 
        req.user.role
      );
      
      if (result) {
        res.json({ message: 'Project deleted successfully' });
      } else {
        res.status(404).json({ error: 'Project not found' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  return router;
};

module.exports = createProjectRoutes;
