
const express = require('express');
const AuthUseCase = require('../../application/usecases/AuthUseCase');

const createAuthRoutes = (userRepository) => {
  const router = express.Router();
  const authUseCase = new AuthUseCase(userRepository);

  router.post('/login', async (req, res) => {
    try {
      const { client_id, client_secret } = req.body;

      if (!client_id || !client_secret) {
        return res.status(400).json({ error: 'Client ID and Client Secret are required' });
      }

      const result = await authUseCase.authenticate(client_id, client_secret);
      
      res.json({
        message: 'Authentication successful',
        ...result
      });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  });

  router.post('/verify', async (req, res) => {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({ error: 'Token is required' });
      }

      const decoded = authUseCase.verifyToken(token);
      res.json({ valid: true, user: decoded });
    } catch (error) {
      res.status(401).json({ error: error.message, valid: false });
    }
  });

  return router;
};

module.exports = createAuthRoutes;
