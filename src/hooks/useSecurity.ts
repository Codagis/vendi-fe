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

/**
 * Hook de segurança para validação contínua e proteção de integridade.
 * 
 * @author Sistema Vendi
 * @version 1.0
 */
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

  /**
   * Valida a integridade completa do usuário.
   */
  const validateUserSecurity = useCallback((): SecurityValidation => {
    const userValidation = validateUserIntegrity(user);
    
    // Validação de token mais flexível - só valida se o token existir
    const tokenValidation = token ? validateTokenIntegrity(token) : { isValid: true, errors: [], warnings: [] };
    
    // Filtrar erros críticos - remover validações desnecessárias
    const criticalErrors = userValidation.errors.filter(error => 
      !error.includes('Token não fornecido') && 
      !error.includes('Token deve ser uma string')
    );
    
    const allErrors = [...criticalErrors, ...tokenValidation.errors];
    const allWarnings = [...userValidation.warnings, ...tokenValidation.warnings];

    // Atualizar estado de integridade
    setIntegrityCheck({
      isAuthenticated: !!user,
      hasValidToken: token ? tokenValidation.isValid : true, // Se não há token, considerar válido
      permissionsMatch: userValidation.isValid,
      rootStatusValid: user?.root !== undefined,
      lastValidation: new Date()
    });

    setSecurityErrors(allErrors);
    setSecurityWarnings(allWarnings);

    // Log de eventos de segurança apenas para erros críticos
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

  /**
   * Verifica se o usuário tem permissão para uma ação específica.
   */
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

  /**
   * Verifica se o usuário pode acessar um módulo específico.
   */
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

  /**
   * Verifica se o usuário é root.
   */
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

  /**
   * Verifica se o usuário tem qualquer uma das permissões especificadas.
   */
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

  /**
   * Verifica se o usuário tem todas as permissões especificadas.
   */
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

  /**
   * Força uma nova validação de segurança.
   */
  const revalidateSecurity = useCallback(() => {
    return validateUserSecurity();
  }, [validateUserSecurity]);

  /**
   * Limpa os warnings e erros de segurança.
   */
  const clearSecurityAlerts = useCallback(() => {
    setSecurityWarnings([]);
    setSecurityErrors([]);
  }, []);

  /**
   * Verifica se há problemas de segurança críticos.
   */
  const hasCriticalSecurityIssues = useCallback((): boolean => {
    // Filtrar erros não críticos
    const criticalErrors = securityErrors.filter(error => 
      !error.includes('Token não fornecido') && 
      !error.includes('Token deve ser uma string') &&
      !error.includes('Token inválido')
    );
    
    return criticalErrors.length > 0 || !integrityCheck.isAuthenticated;
  }, [securityErrors, integrityCheck]);

  /**
   * Obtém o status de segurança atual.
   */
  const getSecurityStatus = useCallback(() => {
    return {
      isSecure: !hasCriticalSecurityIssues(),
      integrityCheck,
      warnings: securityWarnings,
      errors: securityErrors,
      lastValidation: integrityCheck.lastValidation
    };
  }, [hasCriticalSecurityIssues, integrityCheck, securityWarnings, securityErrors]);

  // Validação automática quando o usuário ou token mudam
  useEffect(() => {
    if (user || token) {
      validateUserSecurity();
    }
  }, [user, token, validateUserSecurity]);

  // Validação periódica de segurança (a cada 5 minutos)
  useEffect(() => {
    const interval = setInterval(() => {
      if (user) {
        validateUserSecurity();
      }
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval);
  }, [user, validateUserSecurity]);

  return {
    // Validações
    hasPermission,
    canAccessModule,
    isRoot,
    hasAnyPermission,
    hasAllPermissions,
    
    // Estado de segurança
    integrityCheck,
    securityWarnings,
    securityErrors,
    hasCriticalSecurityIssues,
    getSecurityStatus,
    
    // Ações
    revalidateSecurity,
    clearSecurityAlerts,
    validateUserSecurity
  };
}
