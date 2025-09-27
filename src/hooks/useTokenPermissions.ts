import { useAuth } from '../contexts/AuthContext';
import { extractUserData, isTokenValid as checkTokenValid } from '../services/jwtService';
import { authUtils } from '../services/api';

export function useTokenPermissions() {
  const { user } = useAuth();

  const hasPermission = (permission: string): boolean => {
    if (!user) {
      return false;
    }

    if (user.root) {
      return true;
    }

    return user.perfil.permissoes.some(p => p.chave === permission && p.ativa);
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!user) {
      return false;
    }

    if (user.root) {
      return true;
    }

    return permissions.some(permission => 
      user.perfil.permissoes.some(p => p.chave === permission && p.ativa)
    );
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    if (!user) {
      return false;
    }

    if (user.root) {
      return true;
    }

    return permissions.every(permission => 
      user.perfil.permissoes.some(p => p.chave === permission && p.ativa)
    );
  };

  const isRoot = (): boolean => {
    return user?.root === true;
  };

  const canAccessModule = (module: string): boolean => {
    if (!user) {
      return false;
    }

    if (user.root) {
      return true;
    }

    const modulePermissions: Record<string, string[]> = {
      'dashboard': ['dashboard'],
      'usuarios': ['users'],
      'perfis': ['perfis'],
      'permissoes': ['permissoes'],
      'produtos': ['products'],
      'vendas': ['sales'],
      'relatorios': ['reports'],
      'configuracoes': ['settings']
    };

    const requiredPermissions = modulePermissions[module] || [module];
    return hasAnyPermission(requiredPermissions);
  };

  const isTokenValid = (): boolean => {
    const token = authUtils.getToken();
    return token ? checkTokenValid(token) : false;
  };

  const getUserDataFromToken = () => {
    const token = authUtils.getToken();
    if (!token) {
      return null;
    }
    return extractUserData(token);
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isRoot,
    canAccessModule,
    isTokenValid,
    getUserDataFromToken,
    user,
    isLoading: false
  };
}
