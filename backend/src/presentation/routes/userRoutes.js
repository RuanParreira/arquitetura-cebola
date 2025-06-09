
const express = require('express');
const UserUseCase = require('../../application/usecases/UserUseCase');
const { authMiddleware, adminMiddleware } = require('../../infrastructure/middleware/authMiddleware');

const createUserRoutes = (userRepository) => {
  const router = express.Router();
  const userUseCase = new UserUseCase(userRepository);

  router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const users = await userUseCase.getAllUsers();
      res.json(users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      })));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/:id', authMiddleware, async (req, res) => {
    try {
      const user = await userUseCase.getUserById(req.params.id);
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  });

  return router;
};

module.exports = createUserRoutes;
