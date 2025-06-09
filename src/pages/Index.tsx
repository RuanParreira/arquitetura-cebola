
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FolderOpen, CheckSquare, Users, ArrowRight, Shield, Zap } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FolderOpen className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Sistema de Gestão
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  de Projetos
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Organize seus projetos, gerencie tarefas e colabore com sua equipe de forma eficiente. 
                Uma solução completa para aumentar a produtividade da sua organização.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => navigate('/login')}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-lg px-8 py-3"
                >
                  Acessar Sistema
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-lg px-8 py-3"
                >
                  Conhecer Recursos
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Recursos Principais
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tudo que você precisa para gerenciar projetos e tarefas de forma eficiente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent>
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FolderOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Gestão de Projetos
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Crie, organize e acompanhe todos os seus projetos em um só lugar. 
                  Tenha controle total sobre o progresso de cada iniciativa.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent>
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckSquare className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Controle de Tarefas
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Atribua tarefas, defina prazos e acompanhe o status de cada atividade. 
                  Mantenha sua equipe sempre produtiva e organizada.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent>
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Colaboração em Equipe
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Trabalhe em conjunto com sua equipe de forma eficiente. 
                  Comunicação clara e distribuição inteligente de responsabilidades.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tecnologia de Ponta
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Construído com as melhores tecnologias para garantir performance e segurança
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Autenticação Segura
                  </h3>
                  <p className="text-gray-600">
                    Sistema de autenticação JWT com client_id e client_secret para máxima segurança dos dados.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Arquitetura Robusta
                  </h3>
                  <p className="text-gray-600">
                    Backend construído com arquitetura Onion (Clean Architecture) garantindo escalabilidade e manutenibilidade.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Interface Moderna
                  </h3>
                  <p className="text-gray-600">
                    Frontend React com design responsivo e componentes modernos para uma experiência excepcional.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-4 font-mono text-sm">
                    <div className="text-blue-600">// Arquitetura Onion</div>
                    <div className="text-gray-800">📁 domain/</div>
                    <div className="text-gray-800 ml-4">📄 entities/</div>
                    <div className="text-gray-800 ml-4">📄 interfaces/</div>
                    <div className="text-gray-800">📁 application/</div>
                    <div className="text-gray-800 ml-4">📄 usecases/</div>
                    <div className="text-gray-800">📁 infrastructure/</div>
                    <div className="text-gray-800">📁 presentation/</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Pronto para começar?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Experimente nosso sistema de gestão de projetos e transforme a produtividade da sua equipe.
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/login')}
            className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3"
          >
            Acessar Sistema Agora
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          
          <div className="mt-8 pt-8 border-t border-blue-500">
            <p className="text-blue-100 text-sm">
              Credenciais de demonstração disponíveis na tela de login
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
