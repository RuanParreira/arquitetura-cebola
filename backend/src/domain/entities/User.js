
class User {
  constructor(id, name, email, password, role, clientId, clientSecret) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role; // 'admin' or 'colaborador'
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.createdAt = new Date();
  }

  isAdmin() {
    return this.role === 'admin';
  }

  isColaborador() {
    return this.role === 'colaborador';
  }
}

module.exports = User;
