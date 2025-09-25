import { useState } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { Dashboard } from './components/Dashboard';
import { POSSystem } from './components/POSSystem';
import { ProductManagement } from './components/ProductManagement';
import { CustomerManagement } from './components/CustomerManagement';
import { InventoryManagement } from './components/InventoryManagement';
import { FinancialManagement } from './components/FinancialManagement';
import { Reports } from './components/Reports';
import { Navigation } from './components/Navigation';
import { UserManagement } from './components/UserManagement';
import { Settings } from './components/Settings';
import type { User } from './types';

export default function App(): JSX.Element {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeModule, setActiveModule] = useState<string>('dashboard');

  const handleLogin = (user: User): void => {
    setCurrentUser(user);
    setIsLoggedIn(true);
  };

  const handleLogout = (): void => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setActiveModule('dashboard');
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

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
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Navigation 
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-6">
          {renderActiveModule()}
        </div>
      </div>
    </div>
  );
}