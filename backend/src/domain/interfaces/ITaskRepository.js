
class ITaskRepository {
  async create(task) {
    throw new Error('Method not implemented');
  }

  async findById(id) {
    throw new Error('Method not implemented');
  }

  async findByProjectId(projectId) {
    throw new Error('Method not implemented');
  }

  async findByAssignedTo(userId) {
    throw new Error('Method not implemented');
  }

  async findAll() {
    throw new Error('Method not implemented');
  }

  async update(id, taskData) {
    throw new Error('Method not implemented');
  }

  async delete(id) {
    throw new Error('Method not implemented');
  }
}

module.exports = ITaskRepository;
