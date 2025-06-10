
const IProjectRepository = require('../../domain/interfaces/IProjectRepository');
const Project = require('../../domain/entities/Project');

class SupabaseProjectRepository extends IProjectRepository {
  constructor(supabaseClient) {
    super();
    this.supabase = supabaseClient;
  }

  async create(projectData) {
    const { data, error } = await this.supabase
      .from('projects')
      .insert({
        id: projectData.id,
        name: projectData.name,
        description: projectData.description,
        owner_id: projectData.ownerId
      })
      .select()
      .single();

    if (error) throw error;
    
    return new Project(data.id, data.name, data.description, data.owner_id);
  }

  async findById(id) {
    const { data, error } = await this.supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    
    return new Project(data.id, data.name, data.description, data.owner_id);
  }

  async findAll() {
    const { data, error } = await this.supabase
      .from('projects')
      .select(`
        *,
        users!projects_owner_id_fkey(name)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data.map(row => {
      const project = new Project(row.id, row.name, row.description, row.owner_id);
      project.ownerName = row.users?.name;
      return project;
    });
  }

  async findByOwnerId(ownerId) {
    const { data, error } = await this.supabase
      .from('projects')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data.map(row => 
      new Project(row.id, row.name, row.description, row.owner_id)
    );
  }

  async update(id, projectData) {
    const updateData = {};
    if (projectData.name) updateData.name = projectData.name;
    if (projectData.description !== undefined) updateData.description = projectData.description;

    const { error } = await this.supabase
      .from('projects')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  async delete(id) {
    const { error } = await this.supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
}

module.exports = SupabaseProjectRepository;
