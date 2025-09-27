import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  validateUserIntegrity, 
  validatePermission, 
  validateModuleAccess,
  validateTokenIntegrity,
  logSecurityEvent,
  SecurityValidation,
  UserIntegrityCheck
} from '../utils/securityUtils';

export function useSecurity() {
  const { user, token } = useAuth();
  const [integrityCheck, setIntegrityCheck] = useState<UserIntegrityCheck>({
    isAuthenticated: false,
    hasValidToken: false,
    permissionsMatch: false,
    rootStatusValid: false,
    lastValidation: new Date()
  });
  const [securityWarnings, setSecurityWarnings] = useState<string[]>([]);
  const [securityErrors, setSecurityErrors] = useState<string[]>([]);

  const validateUserSecurity = useCallback((): SecurityValidation => {
    const userValidation = validateUserIntegrity(user);
    
    const tokenValidation = token ? validateTokenIntegrity(token) : { isValid: true, errors: [], warnings: [] };
    
    const criticalErrors = userValidation.errors.filter(error => 
      !error.includes('Token não fornecido') && 
      !error.includes('Token deve ser uma string')
    );
    
    const allErrors = [...criticalErrors, ...tokenValidation.errors];
    const allWarnings = [...userValidation.warnings, ...tokenValidation.warnings];

    setIntegrityCheck({
      isAuthenticated: !!user,
      hasValidToken: token ? tokenValidation.isValid : true,
      permissionsMatch: userValidation.isValid,
      rootStatusValid: user?.root !== undefined,
      lastValidation: new Date()
    });

    setSecurityErrors(allErrors);
    setSecurityWarnings(allWarnings);

    if (allErrors.length > 0) {
      logSecurityEvent('SECURITY_VALIDATION_FAILED', {
        errors: allErrors,
        user: user?.username
      }, user);
    }

    if (allWarnings.length > 0) {
      logSecurityEvent('SECURITY_WARNING', {
        warnings: allWarnings,
        user: user?.username
      }, user);
    }

    return {
      isValid: userValidation.isValid && (token ? tokenValidation.isValid : true),
      errors: allErrors,
      warnings: allWarnings
    };
  }, [user, token]);

  const hasPermission = useCallback((permission: string): boolean => {
    const validation = validatePermission(user, permission);
    
    if (!validation.isValid) {
      logSecurityEvent('PERMISSION_DENIED', {
        permission,
        user: user?.username
      }, user);
    }

    return validation.isValid;
  }, [user]);

  const canAccessModule = useCallback((module: string): boolean => {
    const validation = validateModuleAccess(user, module);
    
    if (!validation.isValid) {
      logSecurityEvent('MODULE_ACCESS_DENIED', {
        module,
        user: user?.username
      }, user);
    }

    return validation.isValid;
  }, [user]);

  const isRoot = useCallback((): boolean => {
    if (!user) return false;
    
    const isUserRoot = user.root === true;
    
    if (isUserRoot) {
      logSecurityEvent('ROOT_ACCESS', {
        user: user.username
      }, user);
    }

    return isUserRoot;
  }, [user]);

  const hasAnyPermission = useCallback((permissions: string[]): boolean => {
    if (!user || !user.permissions) return false;
    if (isRoot()) return true;

    const hasAny = user.permissions.includes('all') || 
                  permissions.some(p => user.permissions.includes(p));
    
    if (!hasAny) {
      logSecurityEvent('PERMISSION_DENIED', {
        permissions,
        user: user.username
      }, user);
    }

    return hasAny;
  }, [user, isRoot]);

  const hasAllPermissions = useCallback((permissions: string[]): boolean => {
    if (!user || !user.permissions) return false;
    if (isRoot()) return true;

    const hasAll = user.permissions.includes('all') || 
                  permissions.every(p => user.permissions.includes(p));
    
    if (!hasAll) {
      logSecurityEvent('PERMISSION_DENIED', {
        permissions,
        user: user.username
      }, user);
    }

    return hasAll;
  }, [user, isRoot]);

  const revalidateSecurity = useCallback(() => {
    return validateUserSecurity();
  }, [validateUserSecurity]);

  const clearSecurityAlerts = useCallback(() => {
    setSecurityWarnings([]);
    setSecurityErrors([]);
  }, []);

  const hasCriticalSecurityIssues = useCallback((): boolean => {
    const criticalErrors = securityErrors.filter(error => 
      !error.includes('Token não fornecido') && 
      !error.includes('Token deve ser uma string') &&
      !error.includes('Token inválido')
    );
    
    return criticalErrors.length > 0 || !integrityCheck.isAuthenticated;
  }, [securityErrors, integrityCheck]);

  const getSecurityStatus = useCallback(() => {
    return {
      isSecure: !hasCriticalSecurityIssues(),
      integrityCheck,
      warnings: securityWarnings,
      errors: securityErrors,
      lastValidation: integrityCheck.lastValidation
    };
  }, [hasCriticalSecurityIssues, integrityCheck, securityWarnings, securityErrors]);

  useEffect(() => {
    if (user || token) {
      validateUserSecurity();
    }
  }, [user, token, validateUserSecurity]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (user) {
        validateUserSecurity();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user, validateUserSecurity]);

  return {
    hasPermission,
    canAccessModule,
    isRoot,
    hasAnyPermission,
    hasAllPermissions,
    
    integrityCheck,
    securityWarnings,
    securityErrors,
    hasCriticalSecurityIssues,
    getSecurityStatus,
    
    revalidateSecurity,
    clearSecurityAlerts,
    validateUserSecurity
  };
}
