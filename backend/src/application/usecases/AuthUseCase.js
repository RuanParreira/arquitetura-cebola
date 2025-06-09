
const jwt = require('jsonwebtoken');

class AuthUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async authenticate(clientId, clientSecret) {
    try {
      const user = await this.userRepository.findByClientCredentials(clientId, clientSecret);
      
      if (!user) {
        throw new Error('Invalid credentials');
      }

      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          role: user.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );

      return {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      };
    } catch (error) {
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}

module.exports = AuthUseCase;
