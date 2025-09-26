import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Store, Shield, User as UserIcon, Users } from 'lucide-react';
import type { User, UserRole, Store as StoreType, LoginScreenProps } from '../src/types';

const mockUsers: User[] = [
  { id: 1, username: 'admin', password: 'admin123', name: 'Administrador', role: 'admin', permissions: ['all'] },
  { id: 2, username: 'vendedor', password: 'vend123', name: 'João Vendedor', role: 'seller', permissions: ['pos', 'customers'] },
  { id: 3, username: 'estoque', password: 'est123', name: 'Maria Estoque', role: 'stock', permissions: ['inventory', 'products'] },
  { id: 4, username: 'financeiro', password: 'fin123', name: 'Pedro Financeiro', role: 'financial', permissions: ['financial', 'reports'] }
];

const stores: StoreType[] = [
  { id: 1, name: 'Loja Centro', address: 'Rua Principal, 123' },
  { id: 2, name: 'Loja Shopping', address: 'Shopping Center, Loja 45' },
  { id: 3, name: 'Loja Bairro', address: 'Av. Secundária, 789' }
];

const getRoleIcon = (role: UserRole): JSX.Element => {
  switch (role) {
    case 'admin': return <Shield className="w-4 h-4" />;
    case 'seller': return <UserIcon className="w-4 h-4" />;
    case 'stock': return <Store className="w-4 h-4" />;
    case 'financial': return <Users className="w-4 h-4" />;
    default: return <UserIcon className="w-4 h-4" />;
  }
};

const getRoleLabel = (role: UserRole): string => {
  switch (role) {
    case 'admin': return 'Administrador';
    case 'seller': return 'Vendedor';
    case 'stock': return 'Estoquista';
    case 'financial': return 'Financeiro';
    default: return 'Usuário';
  }
};

export function LoginScreen({ onLogin }: LoginScreenProps): JSX.Element {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [selectedStore, setSelectedStore] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simular delay de autenticação
    setTimeout(() => {
      const user = mockUsers.find(u => u.username === username && u.password === password);
      
      if (user && selectedStore) {
        const store = stores.find(s => s.id === parseInt(selectedStore));
        onLogin({ ...user, store });
      } else {
        setError('Usuário, senha ou loja inválidos');
      }
      setLoading(false);
    }, 1000);
  };

  const handleDemoUserClick = (user: User): void => {
    setUsername(user.username);
    setPassword(user.password || '');
    // Auto-selecionar a primeira loja se não houver nenhuma selecionada
    if (!selectedStore) {
      setSelectedStore(stores[0].id.toString());
    }
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Store className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendi</h1>
          <p className="text-gray-600">Sistema de Ponto de Venda</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Entrar no Sistema</CardTitle>
            <CardDescription className="text-center">
              Faça login para acessar o PDV
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Usuário</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Digite seu usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="store">Loja / Filial</Label>
                <Select value={selectedStore} onValueChange={setSelectedStore} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a loja" />
                  </SelectTrigger>
                  <SelectContent>
                    {stores.map((store) => (
                      <SelectItem key={store.id} value={store.id.toString()}>
                        <div className="flex items-center gap-2">
                          <Store className="w-4 h-4" />
                          <div>
                            <div>{store.name}</div>
                            <div className="text-xs text-gray-500">{store.address}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {error && (
                <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Usuários de Demonstração:</h4>
              <p className="text-xs text-gray-600 mb-3">Clique em um usuário para preencher automaticamente</p>
              <div className="space-y-2">
                {mockUsers.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleDemoUserClick(user)}
                    className="w-full flex items-center justify-between text-xs bg-gray-50 hover:bg-blue-50 hover:border-blue-200 border border-gray-200 p-3 rounded-lg transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 text-gray-600 group-hover:text-blue-600 transition-colors">
                        {getRoleIcon(user.role)}
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900 group-hover:text-blue-900">{user.username}</div>
                        <div className="text-gray-500 group-hover:text-blue-600">{getRoleLabel(user.role)}</div>
                      </div>
                    </div>
                    <div className="text-gray-600 group-hover:text-blue-700 font-mono bg-white group-hover:bg-blue-100 px-2 py-1 rounded border">
                      {user.password}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}