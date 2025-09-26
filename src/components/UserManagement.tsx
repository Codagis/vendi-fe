import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { 
  UserCog, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Shield,
  User,
  Users,
  Eye,
  EyeOff,
  RefreshCw,
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Switch } from './ui/switch';
import { Checkbox } from './ui/checkbox';
import { apiService, type Usuario, type Perfil, type UsuarioStats } from '../services/api';
import { notificationService } from '../services/notificationService';

// Dados mockados removidos - usando apenas dados do backend

const allPermissions = [
  { id: 'dashboard', label: 'Dashboard', category: 'Sistema' },
  { id: 'pos', label: 'PDV - Vendas', category: 'Vendas' },
  { id: 'products', label: 'Produtos', category: 'Cadastros' },
  { id: 'customers', label: 'Clientes', category: 'Cadastros' },
  { id: 'customers_view', label: 'Clientes (Apenas Visualizar)', category: 'Cadastros' },
  { id: 'inventory', label: 'Estoque', category: 'Operações' },
  { id: 'financial', label: 'Financeiro', category: 'Financeiro' },
  { id: 'reports', label: 'Relatórios', category: 'Relatórios' },
  { id: 'reports_view', label: 'Relatórios (Apenas Visualizar)', category: 'Relatórios' },
  { id: 'users', label: 'Usuários', category: 'Sistema' },
  { id: 'settings', label: 'Configurações', category: 'Sistema' }
];

export function UserManagement() {
  const [users, setUsers] = useState<Usuario[]>([]);
  const [perfis, setPerfis] = useState<Perfil[]>([]);
  const [stats, setStats] = useState<UsuarioStats | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    cracha: '',
    role: 'seller',
    status: 'active',
    permissions: [] as string[]
  });

  // Carregar perfis e estatísticas ao montar o componente
  useEffect(() => {
    loadPerfis();
    loadStats();
  }, []);

  // Carregar usuários quando os perfis estiverem carregados ou quando os filtros mudarem
  useEffect(() => {
    if (perfis.length > 0) {
      loadUsers();
    }
  }, [perfis, selectedRole]);

  // Debounce para busca por texto
  useEffect(() => {
    if (perfis.length > 0) {
      const timeoutId = setTimeout(() => {
        loadUsers();
      }, 300); // 300ms de delay

      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm]);

  const loadPerfis = async () => {
    try {
      const perfisData = await apiService.getPerfis();
      setPerfis(perfisData);
    } catch (error) {
      console.error('Erro ao carregar perfis:', error);
      // Fallback para perfis mockados
      const perfisMock = [
        { id: 1, nome: 'Administrador', codigo: 'admin', ativo: true, sistema: true, deleted: false, createdAt: '', updatedAt: '' },
        { id: 2, nome: 'Vendedor', codigo: 'seller', ativo: true, sistema: true, deleted: false, createdAt: '', updatedAt: '' },
        { id: 3, nome: 'Estoquista', codigo: 'stock', ativo: true, sistema: true, deleted: false, createdAt: '', updatedAt: '' },
        { id: 4, nome: 'Financeiro', codigo: 'financial', ativo: true, sistema: true, deleted: false, createdAt: '', updatedAt: '' }
      ];
      setPerfis(perfisMock);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await apiService.getUsuarioStats();
      setStats(statsData);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      // Fallback para estatísticas zeradas
      setStats({
        totalUsuarios: 0,
        usuariosAtivos: 0,
        usuariosInativos: 0,
        administradores: 0,
        vendedores: 0,
        outrosPerfis: 0
      });
    }
  };

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      // Preparar filtros para o backend
      const filters: any = {};
      
      if (searchTerm.trim()) {
        // Enviar o termo de busca para todos os campos: nome, username e email
        filters.nome = searchTerm;
        filters.username = searchTerm;
        filters.email = searchTerm;
      }
      
      if (selectedRole !== 'all') {
        // Encontrar o perfilId baseado no código do perfil selecionado
        const perfilSelecionado = perfis.find(p => p.codigo === selectedRole);
        if (perfilSelecionado) {
          filters.perfilId = perfilSelecionado.id;
        }
      }

      const usuarios = await apiService.getUsuarios(filters);
      setUsers(usuarios);
      
      // Recarregar estatísticas se não há filtros ativos (mostra dados gerais)
      if (!searchTerm.trim() && selectedRole === 'all') {
        loadStats();
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      // Em caso de erro, manter lista vazia
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Os usuários já vêm filtrados do backend
  const filteredUsers = users;

  const resetForm = () => {
    setFormData({
      username: '',
      name: '',
      email: '',
      password: '',
      cracha: '',
      role: 'seller',
      status: 'active',
      permissions: []
    });
    setEditingUser(null);
  };

  const handleAddUser = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const handleEditUser = (user: Usuario) => {
    // Encontrar o perfil do usuário
    let perfilCodigo = 'seller'; // default
    if (user.perfilNome) {
      // Primeiro tentar encontrar por código
      let perfil = perfis.find(p => p.codigo === user.perfilNome);
      
      // Se não encontrar por código, tentar por nome
      if (!perfil) {
        perfil = perfis.find(p => p.nome.toLowerCase() === user.perfilNome.toLowerCase());
      }
      
      if (perfil) {
        perfilCodigo = perfil.codigo;
      }
    }
    
    setFormData({
      username: user.username,
      name: user.nome,
      email: user.email,
      password: '',
      cracha: user.cracha || '',
      role: perfilCodigo,
      status: user.ativo ? 'active' : 'inactive',
      permissions: user.permissions || []
    });
    setEditingUser(user);
    setIsAddDialogOpen(true);
  };

  const handleSaveUser = async () => {
    if (!formData.username || !formData.name || !formData.email) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    if (!editingUser && !formData.password) {
      alert('Senha é obrigatória para novos usuários');
      return;
    }

        try {
          // Encontrar o perfilId baseado no código do perfil selecionado
          const perfilSelecionado = perfis.find(p => p.codigo === formData.role);
          if (!perfilSelecionado) {
            alert('Perfil selecionado não encontrado');
            return;
          }

          const userData: any = {
            username: formData.username,
            nome: formData.name,
            email: formData.email,
            cracha: formData.cracha || null,
            perfilId: perfilSelecionado.id,
            ativo: formData.status === 'active',
            empresaId: 1, // Empresa padrão - em uma implementação real, você teria um dropdown
            lojaId: 1, // Loja padrão - em uma implementação real, você teria um dropdown
            permissions: formData.permissions // Incluir permissões na criação e atualização
          };

      // Só incluir senha se não estiver vazia
      if (formData.password && formData.password.trim() !== '') {
        userData.senha = formData.password;
      }

      if (editingUser) {
        await apiService.updateUsuario(editingUser.id, userData);
      } else {
        await apiService.createUsuario(userData);
      }

      // Recarregar lista de usuários
      await loadUsers();
      setIsAddDialogOpen(false);
      resetForm();
      notificationService.showSuccess('Usuário salvo com sucesso!');
    } catch (error: any) {
      // O erro já foi tratado pelo interceptor da API
      console.error('Erro ao salvar usuário:', error);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await apiService.deleteUsuario(userId);
        await loadUsers(); // Recarregar lista
        notificationService.showSuccess('Usuário excluído com sucesso!');
      } catch (error: any) {
        // O erro já foi tratado pelo interceptor da API
        console.error('Erro ao deletar usuário:', error);
      }
    }
  };

  const toggleUserStatus = async (userId: number) => {
    try {
      const user = users.find(u => u.id === userId);
      if (user) {
        await apiService.alterarStatusUsuario(userId, !user.ativo);
        await loadUsers(); // Recarregar lista
        notificationService.showSuccess(`Usuário ${!user.ativo ? 'ativado' : 'desativado'} com sucesso!`);
      }
    } catch (error: any) {
      // O erro já foi tratado pelo interceptor da API
      console.error('Erro ao alterar status do usuário:', error);
    }
  };

  const getRoleInfo = (perfilNome: string): { label: string; color: string } => {
    // Primeiro, tentar encontrar por código
    let perfil = perfis.find(p => p.codigo === perfilNome);
    
    // Se não encontrar por código, tentar por nome
    if (!perfil) {
      perfil = perfis.find(p => p.nome.toLowerCase() === perfilNome.toLowerCase());
    }
    
    if (perfil) {
      return {
        label: perfil.nome,
        color: getRoleColor(perfil.codigo)
      };
    }
    
    return { label: perfilNome || 'Desconhecido', color: 'bg-gray-500' };
  };

  const getRoleColor = (roleValue: string): string => {
    const colorMap: { [key: string]: string } = {
      'admin': 'bg-red-500',
      'seller': 'bg-green-500',
      'stock': 'bg-blue-500',
      'financial': 'bg-purple-500'
    };
    return colorMap[roleValue] || 'bg-gray-500';
  };

  const getStatusColor = (status: string): string => {
    return status === 'active' ? 'bg-green-500' : 'bg-red-500';
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        permissions: [...formData.permissions, permissionId]
      });
    } else {
      setFormData({
        ...formData,
        permissions: formData.permissions.filter(p => p !== permissionId)
      });
    }
  };

  const getDefaultPermissions = (role: string): string[] => {
    switch (role) {
      case 'admin':
        return ['all'];
      case 'seller':
        return ['dashboard', 'pos', 'customers', 'reports_view'];
      case 'stock':
        return ['dashboard', 'inventory', 'products', 'reports_view'];
      case 'financial':
        return ['dashboard', 'financial', 'reports', 'customers_view'];
      default:
        return ['dashboard'];
    }
  };

  const handleRoleChange = (newRole: string) => {
    setFormData({
      ...formData,
      role: newRole,
      permissions: getDefaultPermissions(newRole)
    });
  };

  // Group permissions by category
  const permissionsByCategory = allPermissions.reduce((acc: any, permission: any) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Usuários</h1>
          <p className="text-gray-600">Gerencie usuários e permissões do sistema</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={loadUsers} 
            variant="outline" 
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button onClick={handleAddUser} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Novo Usuário
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Usuários</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.totalUsuarios ?? 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Usuários Ativos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.usuariosAtivos ?? 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Administradores</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.administradores ?? 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <UserCog className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Vendedores</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.vendedores ?? 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Buscar</Label>
              <div className="relative">
                {isLoading ? (
                  <div className="absolute left-3 top-3 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
                ) : (
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                )}
                <Input
                  placeholder="Buscar por nome, usuário ou e-mail..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>
            <div>
              <Label>Papel</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os papéis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os papéis</SelectItem>
                  {perfis.map(perfil => (
                    <SelectItem key={perfil.codigo} value={perfil.codigo}>
                      <div className="flex items-center gap-2">
                        <span>{perfil.nome}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" onClick={() => { setSearchTerm(''); setSelectedRole('all'); }}>
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Usuários ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Papel</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Último Acesso</TableHead>
                  <TableHead>Cadastrado em</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                        <span>Carregando usuários...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Nenhum usuário encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => {
                    const roleInfo = getRoleInfo(user.perfilNome || 'seller');
                    
                    return (
                      <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">{user.nome}</p>
                          <p className="text-sm text-gray-500">@{user.username}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          {user.cracha && (
                            <p className="text-sm text-blue-600">Crachá: {user.cracha}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div>
                            <Badge className={`${roleInfo.color} text-white`}>
                              {roleInfo.label}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getStatusColor(user.ativo ? 'active' : 'inactive')} text-white`}>
                            {user.ativo ? 'Ativo' : 'Inativo'}
                          </Badge>
                          <Switch
                            checked={user.ativo}
                            onCheckedChange={() => toggleUserStatus(user.id)}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">
                          {user.ultimoLogin ? formatDateTime(user.ultimoLogin) : 'Nunca'}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{user.createdAt ? formatDate(user.createdAt) : 'N/A'}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-700"
                            disabled={user.root && users.filter(u => u.root).length === 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit User Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
            </DialogTitle>
            <DialogDescription>
              Preencha as informações do usuário e defina suas permissões
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label>Nome Completo *</Label>
                <Input
                  placeholder="Digite o nome completo"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              
              <div>
                <Label>Nome de Usuário *</Label>
                <Input
                  placeholder="Digite o nome de usuário"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
              
              <div>
                <Label>E-mail *</Label>
                <Input
                  type="email"
                  placeholder="usuario@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              
              <div>
                <Label>Crachá</Label>
                <Input
                  placeholder="Digite o número do crachá (opcional)"
                  value={formData.cracha}
                  onChange={(e) => setFormData({ ...formData, cracha: e.target.value })}
                />
              </div>
              
              <div>
                <Label>Senha {!editingUser && '*'}</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={editingUser ? 'Deixe em branco para manter atual' : 'Digite a senha'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div>
                <Label>Papel *</Label>
                <Select value={formData.role} onValueChange={handleRoleChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {perfis.map(perfil => (
                      <SelectItem key={perfil.codigo} value={perfil.codigo}>
                        <div className="flex items-center gap-2">
                          <div>
                            <div>{perfil.nome}</div>
                            {perfil.descricao && (
                              <div className="text-xs text-gray-500">{perfil.descricao}</div>
                            )}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Permissões</Label>
                <p className="text-sm text-gray-500 mb-4">
                  Selecione as funcionalidades que este usuário poderá acessar
                </p>
                
                {formData.role === 'admin' ? (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 text-red-700">
                      <Shield className="h-5 w-5" />
                      <span className="font-medium">Acesso Total</span>
                    </div>
                    <p className="text-sm text-red-600 mt-1">
                      Administradores têm acesso a todas as funcionalidades do sistema.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {Object.entries(permissionsByCategory).map(([category, permissions]) => (
                      <div key={category} className="space-y-2">
                        <h4 className="font-medium text-gray-900 text-sm">{category}</h4>
                        <div className="space-y-2 pl-4">
                          {(permissions as any[]).map((permission: any) => (
                            <div key={permission.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={permission.id}
                                checked={formData.permissions.includes(permission.id)}
                                onCheckedChange={(checked: any) => handlePermissionChange(permission.id, checked)}
                              />
                              <Label 
                                htmlFor={permission.id}
                                className="text-sm font-normal cursor-pointer"
                              >
                                {permission.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveUser}>
              {editingUser ? 'Salvar Alterações' : 'Criar Usuário'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}