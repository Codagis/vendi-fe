import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { useTokenPermissions } from '../hooks/useTokenPermissions';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  Warehouse, 
  DollarSign, 
  FileText, 
  UserCog, 
  Settings, 
  LogOut,
  Store,
  Shield,
  Key,
  User,
  Mail,
  Phone,
  Building2,
  Calendar,
  X
} from 'lucide-react';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'bg-blue-500', permission: 'dashboard', userTypes: ['ROOT', 'ADMIN', 'USER'] },
  { id: 'pos', label: 'PDV - Vendas', icon: ShoppingCart, color: 'bg-green-500', permission: 'pos', userTypes: ['ROOT', 'ADMIN', 'USER'] },
  { id: 'products', label: 'Produtos', icon: Package, color: 'bg-purple-500', permission: 'products', userTypes: ['ROOT', 'ADMIN', 'USER'] },
  { id: 'customers', label: 'Clientes', icon: Users, color: 'bg-orange-500', permission: 'customers', userTypes: ['ROOT', 'ADMIN', 'USER'] },
  { id: 'inventory', label: 'Estoque', icon: Warehouse, color: 'bg-yellow-500', permission: 'inventory', userTypes: ['ROOT', 'ADMIN', 'USER'] },
  { id: 'financial', label: 'Financeiro', icon: DollarSign, color: 'bg-emerald-500', permission: 'financial', userTypes: ['ROOT', 'ADMIN', 'USER'] },
  { id: 'reports', label: 'Relatórios', icon: FileText, color: 'bg-blue-600', permission: 'reports', userTypes: ['ROOT', 'ADMIN', 'USER'] },
  { id: 'empresas', label: 'Empresas', icon: Store, color: 'bg-teal-500', permission: 'empresas', userTypes: ['ROOT'] },
  { id: 'lojas', label: 'Lojas', icon: Store, color: 'bg-cyan-500', permission: 'lojas', userTypes: ['ROOT', 'ADMIN'] },
  { id: 'users', label: 'Usuários', icon: UserCog, color: 'bg-gray-500', permission: 'users', userTypes: ['ROOT', 'ADMIN', 'USER'] },
  { id: 'perfis', label: 'Perfis', icon: Shield, color: 'bg-indigo-500', permission: 'perfis', userTypes: ['ROOT', 'ADMIN', 'USER'] },
  { id: 'permissoes', label: 'Permissões', icon: Key, color: 'bg-rose-500', permission: 'permissoes', userTypes: ['ROOT'] },
  { id: 'settings', label: 'Configurações', icon: Settings, color: 'bg-slate-500', permission: 'settings', userTypes: ['ROOT', 'ADMIN', 'USER'] }
];

const getRoleLabel = (role: string): string => {
  switch (role) {
    case 'admin': return 'Administrador';
    case 'seller': return 'Vendedor';
    case 'stock': return 'Estoquista';
    case 'financial': return 'Financeiro';
    default: return 'Usuário';
  }
};

const getRoleBadgeColor = (role: string): string => {
  switch (role) {
    case 'admin': return 'bg-red-500';
    case 'seller': return 'bg-green-500';
    case 'stock': return 'bg-blue-500';
    case 'financial': return 'bg-purple-500';
    default: return 'bg-gray-500';
  }
};

export function Navigation({ activeModule, setActiveModule, currentUser, onLogout }: {
  activeModule: string;
  setActiveModule: (module: string) => void;
  currentUser: any;
  onLogout: () => void;
}) {
  const { hasPermission, isRoot, isAdmin, isMaster } = useTokenPermissions();
  const [filteredMenuItems, setFilteredMenuItems] = useState(menuItems);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  useEffect(() => {
    const filtered = menuItems.filter(item => {
      // Verificar se tem a permissão específica primeiro
      const hasSpecificPermission = hasPermission(item.permission);
      
      if (!hasSpecificPermission) {
        return false;
      }

      // Determinar o tipo de usuário atual
      let userType = 'USER';
      if (isRoot()) {
        userType = 'ROOT';
      } else if (isAdmin()) {
        userType = 'ADMIN';
      }

      // Verificar se o item do menu é permitido para este tipo de usuário
      const isAllowedForUserType = item.userTypes.includes(userType);
      
      return isAllowedForUserType;
    });
    setFilteredMenuItems(filtered);
  }, [isRoot, isAdmin, hasPermission]);

  return (
    <div className="w-full h-full bg-white shadow-lg border-r border-gray-200 flex flex-col sidebar-scroll overflow-y-auto">
      
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Store className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900">Vendi</h1>
            <p className="text-xs text-gray-500">Sistema PDV</p>
          </div>
        </div>
        
        {/* User Info - Clicável */}
        <div 
          className="bg-gray-50 rounded-lg p-3 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
          onClick={() => setIsUserModalOpen(true)}
        >
          <div className="flex items-start gap-3 mb-3">
            {/* Avatar do Usuário */}
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            
            {/* Informações do Usuário */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="font-medium text-gray-900 text-sm truncate">
                  {currentUser?.nome || currentUser?.username || 'Usuário'}
                </p>
                <Badge className={`${getRoleBadgeColor(currentUser?.role)} text-white text-xs ml-2 flex-shrink-0`}>
                  {getRoleLabel(currentUser?.role)}
                </Badge>
              </div>
              <p className="text-xs text-gray-500 truncate mb-2">
                <span className="font-medium">Perfil:</span> {currentUser?.perfil?.nome || 'Não definido'}
              </p>
            </div>
          </div>
          
          {/* Informações da Empresa/Loja */}
          <div className="space-y-1 pl-13">
            {currentUser?.empresa && (
              <p className="text-xs text-gray-600 truncate">
                <span className="font-medium">Empresa:</span> {currentUser.empresa.nomeFantasia}
              </p>
            )}
            {currentUser?.loja && (
              <p className="text-xs text-gray-600 truncate">
                <span className="font-medium">Loja:</span> {currentUser.loja.nome}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-200' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isActive ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-600'}`} />
                </div>
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <Button
          onClick={onLogout}
          variant="outline"
          className="w-full flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
        >
          <LogOut className="w-4 h-4" />
          Sair do Sistema
        </Button>
      </div>

      {/* Modal de Informações do Usuário */}
      <Dialog open={isUserModalOpen} onOpenChange={setIsUserModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações do Usuário
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Avatar e Nome Principal */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {currentUser?.nome || currentUser?.username || 'Usuário'}
                </h3>
                <p className="text-sm text-gray-500">
                  {currentUser?.email || 'Email não informado'}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={`${getRoleBadgeColor(currentUser?.role)} text-white text-xs`}>
                    {getRoleLabel(currentUser?.role)}
                  </Badge>
                  {isRoot() && (
                    <Badge className="bg-red-600 text-white text-xs">
                      ROOT
                    </Badge>
                  )}
                  {isAdmin() && !isRoot() && (
                    <Badge className="bg-blue-600 text-white text-xs">
                      ADMIN
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Informações Detalhadas */}
            <div className="space-y-4">
              {/* Perfil */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Shield className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Perfil</p>
                  <p className="text-sm text-gray-600">{currentUser?.perfil?.nome || 'Não definido'}</p>
                </div>
              </div>

              {/* Empresa */}
              {currentUser?.empresa && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Building2 className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Empresa</p>
                    <p className="text-sm text-gray-600">{currentUser.empresa.nomeFantasia}</p>
                    {currentUser.empresa.cnpj && (
                      <p className="text-xs text-gray-500">CNPJ: {currentUser.empresa.cnpj}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Loja */}
              {currentUser?.loja && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Store className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Loja</p>
                    <p className="text-sm text-gray-600">{currentUser.loja.nome}</p>
                  </div>
                </div>
              )}

              {/* Status da Conta */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-3 h-3 rounded-full ${currentUser?.ativo ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Status da Conta</p>
                  <p className="text-sm text-gray-600">
                    {currentUser?.ativo ? 'Ativa' : 'Inativa'}
                    {currentUser?.contaBloqueada && ' (Bloqueada)'}
                  </p>
                </div>
              </div>

              {/* Último Login */}
              {currentUser?.ultimoLogin && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Último Login</p>
                    <p className="text-sm text-gray-600">
                      {new Date(currentUser.ultimoLogin).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Botões de Ação */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setIsUserModalOpen(false)}
                className="flex-1"
              >
                <X className="h-4 w-4 mr-2" />
                Fechar
              </Button>
              <Button
                onClick={() => {
                  setIsUserModalOpen(false);
                  onLogout();
                }}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}