
const ITaskRepository = require('../../domain/interfaces/ITaskRepository');
const Task = require('../../domain/entities/Task');

class SQLiteTaskRepository extends ITaskRepository {
  constructor(database) {
    super();
    this.db = database;
  }

  async create(taskData) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO tasks (id, title, description, project_id, assigned_to, status) VALUES (?, ?, ?, ?, ?, ?)',
        [taskData.id, taskData.title, taskData.description, taskData.projectId, taskData.assignedTo, taskData.status],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(new Task(taskData.id, taskData.title, taskData.description, taskData.projectId, taskData.assignedTo, taskData.status));
          }
        }
      );
    });
  }

  async findById(id) {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM tasks WHERE id = ?',
        [id],
        (err, row) => {
          if (err) {
            reject(err);
          } else if (row) {
            resolve(new Task(row.id, row.title, row.description, row.project_id, row.assigned_to, row.status));
          } else {
            resolve(null);
          }
        }
      );
    });
  }

  async findByProjectId(projectId) {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT t.*, u.name as assigned_name, p.name as project_name 
         FROM tasks t 
         LEFT JOIN users u ON t.assigned_to = u.id 
         LEFT JOIN projects p ON t.project_id = p.id 
         WHERE t.project_id = ? 
         ORDER BY t.created_at DESC`,
        [projectId],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            const tasks = rows.map(row => {
              const task = new Task(row.id, row.title, row.description, row.project_id, row.assigned_to, row.status);
              task.assignedName = row.assigned_name;
              task.projectName = row.project_name;
              return task;
            });
            resolve(tasks);
          }
        }
      );
    });
  }

  async findByAssignedTo(userId) {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT t.*, p.name as project_name 
         FROM tasks t 
         LEFT JOIN projects p ON t.project_id = p.id 
         WHERE t.assigned_to = ? 
         ORDER BY t.created_at DESC`,
        [userId],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            const tasks = rows.map(row => {
              const task = new Task(row.id, row.title, row.description, row.project_id, row.assigned_to, row.status);
              task.projectName = row.project_name;
              return task;
            });
            resolve(tasks);
          }
        }
      );
    });
  }

  async findAll() {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT t.*, u.name as assigned_name, p.name as project_name 
         FROM tasks t 
         LEFT JOIN users u ON t.assigned_to = u.id 
         LEFT JOIN projects p ON t.project_id = p.id 
         ORDER BY t.created_at DESC`,
        [],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            const tasks = rows.map(row => {
              const task = new Task(row.id, row.title, row.description, row.project_id, row.assigned_to, row.status);
              task.assignedName = row.assigned_name;
              task.projectName = row.project_name;
              return task;
            });
            resolve(tasks);
          }
        }
      );
    });
  }

  async update(id, taskData) {
    return new Promise((resolve, reject) => {
      const fields = [];
      const values = [];

      if (taskData.title) {
        fields.push('title = ?');
        values.push(taskData.title);
      }
      if (taskData.description !== undefined) {
        fields.push('description = ?');
        values.push(taskData.description);
      }
      if (taskData.assignedTo !== undefined) {
        fields.push('assigned_to = ?');
        values.push(taskData.assignedTo);
      }
      if (taskData.status) {
        fields.push('status = ?');
        values.push(taskData.status);
      }

      values.push(id);

      this.db.run(
        `UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`,
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
        'DELETE FROM tasks WHERE id = ?',
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

module.exports = SQLiteTaskRepository;
