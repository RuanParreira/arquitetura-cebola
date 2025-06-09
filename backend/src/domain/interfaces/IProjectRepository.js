
class IProjectRepository {
  async create(project) {
    throw new Error('Method not implemented');
  }

  async findById(id) {
    throw new Error('Method not implemented');
  }

  async findAll() {
    throw new Error('Method not implemented');
  }

  async findByOwnerId(ownerId) {
    throw new Error('Method not implemented');
  }

  async update(id, projectData) {
    throw new Error('Method not implemented');
  }

  async delete(id) {
    throw new Error('Method not implemented');
  }
}

module.exports = IProjectRepository;
