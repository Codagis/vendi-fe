import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { POSSystem } from './components/POSSystem';
import { ProductManagement } from './components/ProductManagement';
import { CustomerManagement } from './components/CustomerManagement';
import { InventoryManagement } from './components/InventoryManagement';
import { FinancialManagement } from './components/FinancialManagement';
import { Reports } from './components/Reports';
import { Navigation } from './components/Navigation';
import { EmpresaManagement } from './components/EmpresaManagement';
import { LojaManagement } from './components/LojaManagement';
import { UserManagement } from './components/UserManagement';
import { PerfilManagement } from './components/PerfilManagement';
import { PermissaoManagement } from './components/PermissaoManagement';
import { PermissionTest } from './components/PermissionTest';
import { Settings } from './components/Settings';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Footer } from './components/Footer';
import { useAuth } from './contexts/AuthContext';
import { Toaster } from './components/ui/sonner';

export default function App(): JSX.Element {
  const [activeModule, setActiveModule] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const { user, logout } = useAuth();

  const handleLogout = (): void => {
    logout();
    setActiveModule('dashboard');
  };

  const toggleSidebar = (): void => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderActiveModule = (): JSX.Element => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard onToggleSidebar={toggleSidebar} />;
      case 'pos':
        return <POSSystem onToggleSidebar={toggleSidebar} />;
      case 'products':
        return <ProductManagement onToggleSidebar={toggleSidebar} />;
      case 'customers':
        return <CustomerManagement onToggleSidebar={toggleSidebar} />;
      case 'inventory':
        return <InventoryManagement onToggleSidebar={toggleSidebar} />;
      case 'financial':
        return <FinancialManagement onToggleSidebar={toggleSidebar} />;
      case 'reports':
        return <Reports onToggleSidebar={toggleSidebar} />;
      case 'empresas':
        return <EmpresaManagement onToggleSidebar={toggleSidebar} />;
      case 'lojas':
        return <LojaManagement onToggleSidebar={toggleSidebar} />;
      case 'users':
        return <UserManagement onToggleSidebar={toggleSidebar} />;
      case 'perfis':
        return <PerfilManagement onToggleSidebar={toggleSidebar} />;
      case 'permissoes':
        return <PermissaoManagement onToggleSidebar={toggleSidebar} />;
      case 'test':
        return <PermissionTest onToggleSidebar={toggleSidebar} />;
      case 'settings':
        return <Settings onToggleSidebar={toggleSidebar} />;
      default:
        return <Dashboard onToggleSidebar={toggleSidebar} />;
    }
  };

  return (
    <>
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex relative">
          {/* Sidebar com animação */}
          <div className={`fixed left-0 top-0 h-full z-30 transition-all duration-300 ease-in-out transform ${
            isSidebarOpen 
              ? 'translate-x-0 w-64' 
              : '-translate-x-full w-64'
          }`}>
            <Navigation 
              activeModule={activeModule}
              setActiveModule={setActiveModule}
              currentUser={user}
              onLogout={handleLogout}
            />
          </div>
          
          {/* Overlay para mobile */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
              onClick={toggleSidebar}
            />
          )}
          
          {/* Conteúdo principal */}
          <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out main-content-scroll overflow-y-auto ${
            isSidebarOpen ? 'lg:ml-64' : 'ml-0'
          }`}>
            <div className="flex-1 p-6 pb-20">
              {renderActiveModule()}
            </div>
          </div>
          
          {/* Footer fixado */}
          <Footer isSidebarOpen={isSidebarOpen} />
        </div>
      </ProtectedRoute>
      <Toaster position="top-right" richColors />
    </>
  );
}