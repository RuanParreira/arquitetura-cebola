
class TaskUseCase {
  constructor(taskRepository, projectRepository) {
    this.taskRepository = taskRepository;
    this.projectRepository = projectRepository;
  }

  async getAllTasks() {
    return await this.taskRepository.findAll();
  }

  async getTaskById(id) {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new Error('Task not found');
    }
    return task;
  }

  async createTask(taskData, userId, userRole) {
    if (userRole !== 'admin') {
      throw new Error('Only admins can create tasks');
    }

    const project = await this.projectRepository.findById(taskData.projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    return await this.taskRepository.create(taskData);
  }

  async updateTask(id, taskData, userId, userRole) {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new Error('Task not found');
    }

    if (userRole !== 'admin' && task.assignedTo !== userId) {
      throw new Error('Unauthorized to update this task');
    }

    return await this.taskRepository.update(id, taskData);
  }

  async deleteTask(id, userId, userRole) {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new Error('Task not found');
    }

    if (userRole !== 'admin') {
      throw new Error('Only admins can delete tasks');
    }

    return await this.taskRepository.delete(id);
  }

  async getTasksByProject(projectId) {
    return await this.taskRepository.findByProjectId(projectId);
  }

  async getTasksByUser(userId) {
    return await this.taskRepository.findByAssignedTo(userId);
  }
}

module.exports = TaskUseCase;
