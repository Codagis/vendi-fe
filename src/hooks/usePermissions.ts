import { useAuth } from '../contexts/AuthContext';
import { useSecurity } from './useSecurity';

/**
 * Hook personalizado para verificar permissões do usuário
 * Considera usuários root que têm acesso a tudo
 * Integrado com sistema de segurança robusto
 */
export function usePermissions() {
  const { user } = useAuth();
  const security = useSecurity();

  const hasPermission = (permission: string): boolean => {
    return security.hasPermission(permission);
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    return security.hasAnyPermission(permissions);
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    return security.hasAllPermissions(permissions);
  };

  const isRoot = (): boolean => {
    return security.isRoot();
  };

  const canAccessModule = (module: string): boolean => {
    return security.canAccessModule(module);
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isRoot,
    canAccessModule,
    user,
    // Expor funcionalidades de segurança
    securityStatus: security.getSecurityStatus(),
    hasSecurityIssues: security.hasCriticalSecurityIssues(),
    revalidateSecurity: security.revalidateSecurity
  };
}
