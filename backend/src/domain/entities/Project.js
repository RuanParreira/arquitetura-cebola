
class Project {
  constructor(id, name, description, ownerId) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.ownerId = ownerId;
    this.createdAt = new Date();
  }
}

module.exports = Project;
