
class Task {
  constructor(id, title, description, projectId, assignedTo, status = 'pending') {
    this.id = id;
    this.title = title;
    this.description = description;
    this.projectId = projectId;
    this.assignedTo = assignedTo;
    this.status = status; // 'pending', 'in_progress', 'completed'
    this.createdAt = new Date();
  }
}

module.exports = Task;
