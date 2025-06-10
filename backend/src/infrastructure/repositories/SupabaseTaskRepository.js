
const ITaskRepository = require('../../domain/interfaces/ITaskRepository');
const Task = require('../../domain/entities/Task');

class SupabaseTaskRepository extends ITaskRepository {
  constructor(supabaseClient) {
    super();
    this.supabase = supabaseClient;
  }

  async create(taskData) {
    const { data, error } = await this.supabase
      .from('tasks')
      .insert({
        id: taskData.id,
        title: taskData.title,
        description: taskData.description,
        project_id: taskData.projectId,
        assigned_to: taskData.assignedTo,
        status: taskData.status
      })
      .select()
      .single();

    if (error) throw error;
    
    return new Task(data.id, data.title, data.description, data.project_id, data.assigned_to, data.status);
  }

  async findById(id) {
    const { data, error } = await this.supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    
    return new Task(data.id, data.title, data.description, data.project_id, data.assigned_to, data.status);
  }

  async findByProjectId(projectId) {
    const { data, error } = await this.supabase
      .from('tasks')
      .select(`
        *,
        users!tasks_assigned_to_fkey(name),
        projects!tasks_project_id_fkey(name)
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data.map(row => {
      const task = new Task(row.id, row.title, row.description, row.project_id, row.assigned_to, row.status);
      task.assignedName = row.users?.name;
      task.projectName = row.projects?.name;
      return task;
    });
  }

  async findByAssignedTo(userId) {
    const { data, error } = await this.supabase
      .from('tasks')
      .select(`
        *,
        projects!tasks_project_id_fkey(name)
      `)
      .eq('assigned_to', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data.map(row => {
      const task = new Task(row.id, row.title, row.description, row.project_id, row.assigned_to, row.status);
      task.projectName = row.projects?.name;
      return task;
    });
  }

  async findAll() {
    const { data, error } = await this.supabase
      .from('tasks')
      .select(`
        *,
        users!tasks_assigned_to_fkey(name),
        projects!tasks_project_id_fkey(name)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data.map(row => {
      const task = new Task(row.id, row.title, row.description, row.project_id, row.assigned_to, row.status);
      task.assignedName = row.users?.name;
      task.projectName = row.projects?.name;
      return task;
    });
  }

  async update(id, taskData) {
    const updateData = {};
    if (taskData.title) updateData.title = taskData.title;
    if (taskData.description !== undefined) updateData.description = taskData.description;
    if (taskData.assignedTo !== undefined) updateData.assigned_to = taskData.assignedTo;
    if (taskData.status) updateData.status = taskData.status;

    const { error } = await this.supabase
      .from('tasks')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  async delete(id) {
    const { error } = await this.supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
}

module.exports = SupabaseTaskRepository;
