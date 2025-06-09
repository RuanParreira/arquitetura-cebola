
const IProjectRepository = require('../../domain/interfaces/IProjectRepository');
const Project = require('../../domain/entities/Project');

class SQLiteProjectRepository extends IProjectRepository {
  constructor(database) {
    super();
    this.db = database;
  }

  async create(projectData) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO projects (id, name, description, owner_id) VALUES (?, ?, ?, ?)',
        [projectData.id, projectData.name, projectData.description, projectData.ownerId],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(new Project(projectData.id, projectData.name, projectData.description, projectData.ownerId));
          }
        }
      );
    });
  }

  async findById(id) {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM projects WHERE id = ?',
        [id],
        (err, row) => {
          if (err) {
            reject(err);
          } else if (row) {
            resolve(new Project(row.id, row.name, row.description, row.owner_id));
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
        'SELECT p.*, u.name as owner_name FROM projects p LEFT JOIN users u ON p.owner_id = u.id ORDER BY p.created_at DESC',
        [],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            const projects = rows.map(row => {
              const project = new Project(row.id, row.name, row.description, row.owner_id);
              project.ownerName = row.owner_name;
              return project;
            });
            resolve(projects);
          }
        }
      );
    });
  }

  async findByOwnerId(ownerId) {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT * FROM projects WHERE owner_id = ? ORDER BY created_at DESC',
        [ownerId],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            const projects = rows.map(row => 
              new Project(row.id, row.name, row.description, row.owner_id)
            );
            resolve(projects);
          }
        }
      );
    });
  }

  async update(id, projectData) {
    return new Promise((resolve, reject) => {
      const fields = [];
      const values = [];

      if (projectData.name) {
        fields.push('name = ?');
        values.push(projectData.name);
      }
      if (projectData.description !== undefined) {
        fields.push('description = ?');
        values.push(projectData.description);
      }

      values.push(id);

      this.db.run(
        `UPDATE projects SET ${fields.join(', ')} WHERE id = ?`,
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
        'DELETE FROM projects WHERE id = ?',
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

module.exports = SQLiteProjectRepository;
