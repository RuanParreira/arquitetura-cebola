
class ProjectUseCase {
  constructor(projectRepository, userRepository) {
    this.projectRepository = projectRepository;
    this.userRepository = userRepository;
  }

  async getAllProjects() {
    return await this.projectRepository.findAll();
  }

  async getProjectById(id) {
    const project = await this.projectRepository.findById(id);
    if (!project) {
      throw new Error('Project not found');
    }
    return project;
  }

  async createProject(projectData, userId, userRole) {
    if (userRole !== 'admin') {
      throw new Error('Only admins can create projects');
    }
    return await this.projectRepository.create({
      ...projectData,
      ownerId: userId
    });
  }

  async updateProject(id, projectData, userId, userRole) {
    const project = await this.projectRepository.findById(id);
    if (!project) {
      throw new Error('Project not found');
    }

    if (userRole !== 'admin' && project.ownerId !== userId) {
      throw new Error('Unauthorized to update this project');
    }

    return await this.projectRepository.update(id, projectData);
  }

  async deleteProject(id, userId, userRole) {
    const project = await this.projectRepository.findById(id);
    if (!project) {
      throw new Error('Project not found');
    }

    if (userRole !== 'admin' && project.ownerId !== userId) {
      throw new Error('Unauthorized to delete this project');
    }

    return await this.projectRepository.delete(id);
  }

  async getProjectsByOwner(ownerId) {
    return await this.projectRepository.findByOwnerId(ownerId);
  }
}

module.exports = ProjectUseCase;
