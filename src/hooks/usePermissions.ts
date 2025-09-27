import { useAuth } from '../contexts/AuthContext';
import { useSecurity } from './useSecurity';

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
    securityStatus: security.getSecurityStatus(),
    hasSecurityIssues: security.hasCriticalSecurityIssues(),
    revalidateSecurity: security.revalidateSecurity
  };
}
