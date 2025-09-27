import { usePermissions } from '../hooks/usePermissions';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Shield, Key, User, Settings } from 'lucide-react';

export function PermissionTest() {
  const { hasPermission, hasAnyPermission, hasAllPermissions, isRoot, user } = usePermissions();

  const permissions = [
    'dashboard', 'pos', 'products', 'customers', 'inventory', 
    'financial', 'reports', 'users', 'perfis', 'permissoes', 'settings'
  ];

  const testPermissions = ['dashboard', 'pos', 'products'];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Teste de Permissões
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Informações do usuário */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Informações do Usuário</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Nome:</span> {user?.name}
              </div>
              <div>
                <span className="font-medium">Username:</span> {user?.username}
              </div>
              <div>
                <span className="font-medium">Role:</span> {user?.role}
              </div>
              <div>
                <span className="font-medium">Root:</span> 
                <Badge className={`ml-2 ${isRoot() ? 'bg-red-500' : 'bg-gray-500'} text-white`}>
                  {isRoot() ? 'Sim' : 'Não'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Permissões individuais */}
          <div>
            <h3 className="font-medium mb-2">Permissões Individuais</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {permissions.map(permission => (
                <div key={permission} className="flex items-center gap-2">
                  <Badge className={hasPermission(permission) ? 'bg-green-500' : 'bg-red-500'}>
                    {hasPermission(permission) ? '✓' : '✗'}
                  </Badge>
                  <span className="text-sm">{permission}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Testes de permissões múltiplas */}
          <div>
            <h3 className="font-medium mb-2">Testes de Permissões Múltiplas</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className={hasAnyPermission(testPermissions) ? 'bg-green-500' : 'bg-red-500'}>
                  {hasAnyPermission(testPermissions) ? '✓' : '✗'}
                </Badge>
                <span className="text-sm">Tem alguma das permissões: {testPermissions.join(', ')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={hasAllPermissions(testPermissions) ? 'bg-green-500' : 'bg-red-500'}>
                  {hasAllPermissions(testPermissions) ? '✓' : '✗'}
                </Badge>
                <span className="text-sm">Tem todas as permissões: {testPermissions.join(', ')}</span>
              </div>
            </div>
          </div>

          {/* Lista de permissões do usuário */}
          <div>
            <h3 className="font-medium mb-2">Permissões do Usuário</h3>
            <div className="flex flex-wrap gap-1">
              {user?.permissions?.map(permission => (
                <Badge key={permission} className="bg-blue-500 text-white">
                  {permission}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

