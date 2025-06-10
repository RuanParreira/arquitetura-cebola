
const IUserRepository = require('../../domain/interfaces/IUserRepository');
const User = require('../../domain/entities/User');

class SupabaseUserRepository extends IUserRepository {
  constructor(supabaseClient) {
    super();
    this.supabase = supabaseClient;
  }

  async create(userData) {
    const { data, error } = await this.supabase
      .from('users')
      .insert({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role,
        client_id: userData.clientId,
        client_secret: userData.clientSecret
      })
      .select()
      .single();

    if (error) throw error;
    
    return new User(data.id, data.name, data.email, data.password, data.role, data.client_id, data.client_secret);
  }

  async findById(id) {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    
    return new User(data.id, data.name, data.email, data.password, data.role, data.client_id, data.client_secret);
  }

  async findByClientCredentials(clientId, clientSecret) {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('client_id', clientId)
      .eq('client_secret', clientSecret)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    
    return new User(data.id, data.name, data.email, data.password, data.role, data.client_id, data.client_secret);
  }

  async findAll() {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data.map(row => 
      new User(row.id, row.name, row.email, row.password, row.role, row.client_id, row.client_secret)
    );
  }

  async update(id, userData) {
    const updateData = {};
    if (userData.name) updateData.name = userData.name;
    if (userData.email) updateData.email = userData.email;
    if (userData.password) updateData.password = userData.password;
    if (userData.role) updateData.role = userData.role;

    const { error } = await this.supabase
      .from('users')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  async delete(id) {
    const { error } = await this.supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
}

module.exports = SupabaseUserRepository;
