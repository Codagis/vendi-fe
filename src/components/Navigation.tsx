import { } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
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
  Store
} from 'lucide-react';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'bg-blue-500' },
  { id: 'pos', label: 'PDV - Vendas', icon: ShoppingCart, color: 'bg-green-500' },
  { id: 'products', label: 'Produtos', icon: Package, color: 'bg-purple-500' },
  { id: 'customers', label: 'Clientes', icon: Users, color: 'bg-orange-500' },
  { id: 'inventory', label: 'Estoque', icon: Warehouse, color: 'bg-yellow-500' },
  { id: 'financial', label: 'Financeiro', icon: DollarSign, color: 'bg-emerald-500' },
  { id: 'reports', label: 'Relatórios', icon: FileText, color: 'bg-blue-600' },
  { id: 'users', label: 'Usuários', icon: UserCog, color: 'bg-gray-500' },
  { id: 'settings', label: 'Configurações', icon: Settings, color: 'bg-slate-500' }
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
  const hasPermission = (moduleId: string): boolean => {
    if (!currentUser || !currentUser.permissions) return false;
    return currentUser.permissions.includes('all') || currentUser.permissions.includes(moduleId);
  };

  const filteredMenuItems = menuItems.filter(item => hasPermission(item.id));

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
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
        
        {/* User Info */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="font-medium text-gray-900 text-sm">{currentUser?.name}</p>
              <p className="text-xs text-gray-500">{currentUser?.store?.name}</p>
            </div>
            <Badge className={`${getRoleBadgeColor(currentUser?.role)} text-white text-xs`}>
              {getRoleLabel(currentUser?.role)}
            </Badge>
          </div>
          <p className="text-xs text-gray-600">{currentUser?.store?.address}</p>
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
    </div>
  );
}