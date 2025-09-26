import { useAuth } from '../contexts/AuthContext';
import { extractUserData, isTokenValid as checkTokenValid } from '../services/jwtService';
import { authUtils } from '../services/api';

/**
 * Hook simplificado para verificar permissões usando apenas dados do token.
 * NÃO faz validações no backend - usa apenas dados do token JWT.
 * 
 * @author Sistema Vendi
 * @version 1.0
 */
export function useTokenPermissions() {
  const { user } = useAuth();

  /**
   * Verifica se o usuário tem permissão usando dados do token.
   */
  const hasPermission = (permission: string): boolean => {
    if (!user) {
      return false;
    }

    // Se for root, tem todas as permissões
    if (user.root) {
      return true;
    }

    // Verificar se tem a permissão específica
    return user.perfil.permissoes.some(p => p.chave === permission && p.ativa);
  };

  /**
   * Verifica se o usuário tem qualquer uma das permissões.
   */
  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!user) {
      return false;
    }

    // Se for root, tem todas as permissões
    if (user.root) {
      return true;
    }

    // Verificar se tem qualquer uma das permissões
    return permissions.some(permission => 
      user.perfil.permissoes.some(p => p.chave === permission && p.ativa)
    );
  };

  /**
   * Verifica se o usuário tem todas as permissões.
   */
  const hasAllPermissions = (permissions: string[]): boolean => {
    if (!user) {
      return false;
    }

    // Se for root, tem todas as permissões
    if (user.root) {
      return true;
    }

    // Verificar se tem todas as permissões
    return permissions.every(permission => 
      user.perfil.permissoes.some(p => p.chave === permission && p.ativa)
    );
  };

  /**
   * Verifica se o usuário é root.
   */
  const isRoot = (): boolean => {
    return user?.root === true;
  };

  /**
   * Verifica se o usuário pode acessar um módulo.
   */
  const canAccessModule = (module: string): boolean => {
    if (!user) {
      return false;
    }

    // Se for root, pode acessar qualquer módulo
    if (user.root) {
      return true;
    }

    // Mapear módulos para permissões
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

  /**
   * Verifica se o token é válido.
   */
  const isTokenValid = (): boolean => {
    const token = authUtils.getToken();
    return token ? checkTokenValid(token) : false;
  };

  /**
   * Obtém os dados do usuário do token.
   */
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
    isLoading: false // Sempre false pois não faz validações assíncronas
  };
}
