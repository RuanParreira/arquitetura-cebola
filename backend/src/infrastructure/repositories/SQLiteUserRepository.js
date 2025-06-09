
const IUserRepository = require('../../domain/interfaces/IUserRepository');
const User = require('../../domain/entities/User');
const bcrypt = require('bcryptjs');

class SQLiteUserRepository extends IUserRepository {
  constructor(database) {
    super();
    this.db = database;
  }

  async create(userData) {
    return new Promise((resolve, reject) => {
      const hashedPassword = bcrypt.hashSync(userData.password, 10);
      
      this.db.run(
        'INSERT INTO users (id, name, email, password, role, client_id, client_secret) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [userData.id, userData.name, userData.email, hashedPassword, userData.role, userData.clientId, userData.clientSecret],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(new User(userData.id, userData.name, userData.email, hashedPassword, userData.role, userData.clientId, userData.clientSecret));
          }
        }
      );
    });
  }

  async findById(id) {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM users WHERE id = ?',
        [id],
        (err, row) => {
          if (err) {
            reject(err);
          } else if (row) {
            resolve(new User(row.id, row.name, row.email, row.password, row.role, row.client_id, row.client_secret));
          } else {
            resolve(null);
          }
        }
      );
    });
  }

  async findByClientCredentials(clientId, clientSecret) {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM users WHERE client_id = ? AND client_secret = ?',
        [clientId, clientSecret],
        (err, row) => {
          if (err) {
            reject(err);
          } else if (row) {
            resolve(new User(row.id, row.name, row.email, row.password, row.role, row.client_id, row.client_secret));
          } else {
            resolve(null);
          }
        }
      );
    });
  }

  async findAll() {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT * FROM users ORDER BY created_at DESC',
        [],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            const users = rows.map(row => 
              new User(row.id, row.name, row.email, row.password, row.role, row.client_id, row.client_secret)
            );
            resolve(users);
          }
        }
      );
    });
  }

  async update(id, userData) {
    return new Promise((resolve, reject) => {
      const fields = [];
      const values = [];

      if (userData.name) {
        fields.push('name = ?');
        values.push(userData.name);
      }
      if (userData.email) {
        fields.push('email = ?');
        values.push(userData.email);
      }
      if (userData.password) {
        fields.push('password = ?');
        values.push(bcrypt.hashSync(userData.password, 10));
      }
      if (userData.role) {
        fields.push('role = ?');
        values.push(userData.role);
      }

      values.push(id);

      this.db.run(
        `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
        values,
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.changes > 0);
          }
        }
      );
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'DELETE FROM users WHERE id = ?',
        [id],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.changes > 0);
          }
        }
      );
    });
  }
}

module.exports = SQLiteUserRepository;
