import { useState } from 'react';
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
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Switch } from './ui/switch';
import { Checkbox } from './ui/checkbox';

// Mock data
const mockUsers = [
  {
    id: 1,
    username: 'admin',
    name: 'Administrador Sistema',
    email: 'admin@ontime.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-01-22 14:30',
    createdAt: '2023-01-15',
    permissions: ['all']
  },
  {
    id: 2,
    username: 'vendedor01',
    name: 'João Vendedor',
    email: 'joao@ontime.com',
    role: 'seller',
    status: 'active',
    lastLogin: '2024-01-22 09:15',
    createdAt: '2023-03-20',
    permissions: ['pos', 'customers', 'reports_view']
  },
  {
    id: 3,
    username: 'estoque01',
    name: 'Maria Estoque',
    email: 'maria@ontime.com',
    role: 'stock',
    status: 'active',
    lastLogin: '2024-01-21 16:45',
    createdAt: '2023-02-10',
    permissions: ['inventory', 'products', 'reports_view']
  },
  {
    id: 4,
    username: 'financeiro01',
    name: 'Pedro Financeiro',
    email: 'pedro@ontime.com',
    role: 'financial',
    status: 'inactive',
    lastLogin: '2024-01-20 11:20',
    createdAt: '2023-04-05',
    permissions: ['financial', 'reports', 'customers_view']
  }
];

const roles = [
  {
    value: 'admin',
    label: 'Administrador',
    description: 'Acesso total ao sistema',
    color: 'bg-red-500',
    icon: Shield
  },
  {
    value: 'seller',
    label: 'Vendedor',
    description: 'Acesso ao PDV e clientes',
    color: 'bg-green-500',
    icon: User
  },
  {
    value: 'stock',
    label: 'Estoquista',
    description: 'Gestão de produtos e estoque',
    color: 'bg-blue-500',
    icon: Users
  },
  {
    value: 'financial',
    label: 'Financeiro',
    description: 'Controle financeiro e relatórios',
    color: 'bg-purple-500',
    icon: UserCog
  }
];

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
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    role: 'seller',
    status: 'active',
    permissions: [] as string[]
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const resetForm = () => {
    setFormData({
      username: '',
      name: '',
      email: '',
      password: '',
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

  const handleEditUser = (user: any) => {
    setFormData({
      username: user.username,
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      status: user.status,
      permissions: user.permissions
    });
    setEditingUser(user);
    setIsAddDialogOpen(true);
  };

  const handleSaveUser = () => {
    if (!formData.username || !formData.name || !formData.email) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    if (!editingUser && !formData.password) {
      alert('Senha é obrigatória para novos usuários');
      return;
    }

    const userData = {
      ...formData,
      id: editingUser ? editingUser.id : Date.now(),
      createdAt: editingUser ? editingUser.createdAt : new Date().toISOString().split('T')[0],
      lastLogin: editingUser ? editingUser.lastLogin : null
    };

    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? userData : u));
    } else {
      setUsers([...users, userData]);
    }

    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleDeleteUser = (userId: number) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  const toggleUserStatus = (userId: number) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  const getRoleInfo = (roleValue: string): { label: string; color: string } => {
    return roles.find(role => role.value === roleValue) || roles[1];
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
        <Button onClick={handleAddUser} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Novo Usuário
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Usuários</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
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
                  {users.filter(u => u.status === 'active').length}
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
                  {users.filter(u => u.role === 'admin').length}
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
                  {users.filter(u => u.role === 'seller').length}
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
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Nome, usuário ou e-mail..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
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
                  {roles.map(role => (
                    <SelectItem key={role.value} value={role.value}>
                      <div className="flex items-center gap-2">
                        <role.icon className="h-4 w-4" />
                        <span>{role.label}</span>
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
                {filteredUsers.map((user) => {
                  const roleInfo = getRoleInfo(user.role);
                  // const RoleIcon = roleInfo.icon;
                  
                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">@{user.username}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {/* <RoleIcon className="h-4 w-4" /> */}
                          <div>
                            <Badge className={`${roleInfo.color} text-white`}>
                              {roleInfo.label}
                            </Badge>
                            {/* <p className="text-xs text-gray-500 mt-1">{roleInfo.description}</p> */}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getStatusColor(user.status)} text-white`}>
                            {user.status === 'active' ? 'Ativo' : 'Inativo'}
                          </Badge>
                          <Switch
                            checked={user.status === 'active'}
                            onCheckedChange={() => toggleUserStatus(user.id)}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">
                          {user.lastLogin ? formatDateTime(user.lastLogin) : 'Nunca'}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{formatDate(user.createdAt)}</p>
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
                            disabled={user.role === 'admin' && users.filter(u => u.role === 'admin').length === 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
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
                    {roles.map(role => {
                      const RoleIcon = role.icon;
                      return (
                        <SelectItem key={role.value} value={role.value}>
                          <div className="flex items-center gap-2">
                            <RoleIcon className="h-4 w-4" />
                            <div>
                              <div>{role.label}</div>
                              <div className="text-xs text-gray-500">{role.description}</div>
                            </div>
                          </div>
                        </SelectItem>
                      );
                    })}
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