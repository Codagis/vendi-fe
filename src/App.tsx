import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { POSSystem } from './components/POSSystem';
import { ProductManagement } from './components/ProductManagement';
import { CustomerManagement } from './components/CustomerManagement';
import { InventoryManagement } from './components/InventoryManagement';
import { FinancialManagement } from './components/FinancialManagement';
import { Reports } from './components/Reports';
import { Navigation } from './components/Navigation';
import { UserManagement } from './components/UserManagement';
import { PerfilManagement } from './components/PerfilManagement';
import { PermissaoManagement } from './components/PermissaoManagement';
import { PermissionTest } from './components/PermissionTest';
import { Settings } from './components/Settings';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';
import { Toaster } from './components/ui/sonner';

export default function App(): JSX.Element {
  const [activeModule, setActiveModule] = useState<string>('dashboard');
  const { user, logout } = useAuth();

  const handleLogout = (): void => {
    logout();
    setActiveModule('dashboard');
  };

  const renderActiveModule = (): JSX.Element => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard />;
      case 'pos':
        return <POSSystem />;
      case 'products':
        return <ProductManagement />;
      case 'customers':
        return <CustomerManagement />;
      case 'inventory':
        return <InventoryManagement />;
      case 'financial':
        return <FinancialManagement />;
      case 'reports':
        return <Reports />;
      case 'users':
        return <UserManagement />;
      case 'perfis':
        return <PerfilManagement />;
      case 'permissoes':
        return <PermissaoManagement />;
      case 'test':
        return <PermissionTest />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex">
          <Navigation 
            activeModule={activeModule}
            setActiveModule={setActiveModule}
            currentUser={user}
            onLogout={handleLogout}
          />
          <div className="flex-1 flex flex-col">
            <div className="flex-1 p-6">
              {renderActiveModule()}
            </div>
          </div>
        </div>
      </ProtectedRoute>
      <Toaster position="top-right" richColors />
    </>
  );
}