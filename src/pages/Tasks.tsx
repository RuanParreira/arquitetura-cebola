import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { 
  CheckSquare, 
  Plus, 
  ArrowLeft, 
  User, 
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  FolderOpen
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Project {
  id: string;
  name: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  projectId: string;
  projectName: string;
  assignedTo: string;
  assignedName?: string;
  createdAt: string;
}

interface TaskUser {
  id: string;
  name: string;
  role: string;
}

const Tasks = () => {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<TaskUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const selectedProjectId = searchParams.get('project');
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    projectId: selectedProjectId || '',
    assignedTo: '',
    status: 'pending'
  });

  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userData || !token) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(userData));
    fetchData(token);
  }, [navigate]);

  const fetchData = async (token: string) => {
    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const [tasksRes, projectsRes, usersRes] = await Promise.all([
        fetch('http://localhost:3001/api/tasks', { headers }),
        fetch('http://localhost:3001/api/projects', { headers }),
        fetch('http://localhost:3001/api/users', { headers })
          .then(response => response)
          .catch(() => null)
      ]);

      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        setTasks(tasksData);
      }

      if (projectsRes.ok) {
        const projectsData = await projectsRes.json();
        setProjects(projectsData);
      }

      if (usersRes && usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }
    } catch (error) {
      toast({
        title: 'Erro ao carregar dados',
        description: 'Não foi possível carregar os dados',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:3001/api/tasks', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        toast({
          title: 'Tarefa criada com sucesso!',
          description: `A tarefa "${newTask.title}" foi criada.`,
        });
        
        setNewTask({
          title: '',
          description: '',
          projectId: selectedProjectId || '',
          assignedTo: '',
          status: 'pending'
        });
        setIsDialogOpen(false);
        fetchData(token);
      } else {
        const data = await response.json();
        toast({
          title: 'Erro ao criar tarefa',
          description: data.error || 'Não foi possível criar a tarefa',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erro de conexão',
        description: 'Não foi possível conectar ao servidor',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, newStatus: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:3001/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast({
          title: 'Status atualizado!',
          description: 'O status da tarefa foi atualizado com sucesso.',
        });
        fetchData(token);
      } else {
        toast({
          title: 'Erro ao atualizar status',
          description: 'Não foi possível atualizar o status da tarefa',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erro de conexão',
        description: 'Não foi possível conectar ao servidor',
        variant: 'destructive',
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'bg-green-100 text-green-800',
      in_progress: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };

    const labels = {
      completed: 'Concluída',
      in_progress: 'Em Progresso',
      pending: 'Pendente'
    };

    return (
      <Badge className={variants[status as keyof typeof variants] || variants.pending}>
        {labels[status as keyof typeof labels] || 'Pendente'}
      </Badge>
    );
  };

  const filteredTasks = selectedProjectId 
    ? tasks.filter(task => task.projectId === selectedProjectId)
    : tasks;

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando tarefas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <CheckSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {selectedProject ? `Tarefas - ${selectedProject.name}` : 'Tarefas'}
                  </h1>
                  <p className="text-gray-600">
                    {user?.role === 'admin' ? 'Gerencie todas as tarefas' : 'Suas tarefas atribuídas'}
                  </p>
                </div>
              </div>
            </div>
            
            {user?.role === 'admin' && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Nova Tarefa
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Criar Nova Tarefa</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateTask} className="space-y-4">
                    <div>
                      <Label htmlFor="title">Título da Tarefa</Label>
                      <Input
                        id="title"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        placeholder="Digite o título da tarefa"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea
                        id="description"
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        placeholder="Digite a descrição da tarefa"
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="project">Projeto</Label>
                      <Select
                        value={newTask.projectId}
                        onValueChange={(value) => setNewTask({ ...newTask, projectId: value })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um projeto" />
                        </SelectTrigger>
                        <SelectContent>
                          {projects.map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="assignedTo">Atribuir para</Label>
                      <Select
                        value={newTask.assignedTo}
                        onValueChange={(value) => setNewTask({ ...newTask, assignedTo: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um usuário" />
                        </SelectTrigger>
                        <SelectContent>
                          {users.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.name} ({user.role})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit">Criar Tarefa</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredTasks.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <CheckSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma tarefa encontrada
              </h3>
              <p className="text-gray-600 mb-6">
                {selectedProject 
                  ? `Não há tarefas no projeto "${selectedProject.name}".`
                  : user?.role === 'admin' 
                    ? 'Comece criando sua primeira tarefa.' 
                    : 'Não há tarefas atribuídas a você no momento.'
                }
              </p>
              {user?.role === 'admin' && (
                <Button 
                  onClick={() => setIsDialogOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Criar Primeira Tarefa
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <Card key={task.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(task.status)}
                      <span className="truncate">{task.title}</span>
                    </div>
                    {getStatusBadge(task.status)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {task.description || 'Sem descrição'}
                  </p>
                  
                  <div className="space-y-2 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="w-4 h-4" />
                      <span>{task.projectName}</span>
                    </div>
                    {task.assignedName && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>Atribuído para: {task.assignedName}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(task.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                  
                  {(user?.role === 'admin' || task.assignedTo === user?.id) && (
                    <div className="pt-4 border-t">
                      <Label className="text-xs text-gray-500 mb-2 block">
                        Atualizar Status:
                      </Label>
                      <Select
                        value={task.status}
                        onValueChange={(value) => handleUpdateTaskStatus(task.id, value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pendente</SelectItem>
                          <SelectItem value="in_progress">Em Progresso</SelectItem>
                          <SelectItem value="completed">Concluída</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Tasks;
