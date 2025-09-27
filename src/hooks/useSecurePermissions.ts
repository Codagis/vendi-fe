import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { securityService } from '../services/securityService';
import { extractUserData, isTokenValid } from '../services/jwtService';
import { authUtils } from '../services/api';

export function useSecurePermissions() {
  const { user } = useAuth();
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateUserIntegrity = useCallback(async (): Promise<boolean> => {
    if (!user || !user.id) {
      return false;
    }

    setIsValidating(true);
    setValidationError(null);

    try {
      const result = await securityService.validateUserIntegrity(user.id, user.root);
      
      if (!result.isValid) {
        setValidationError(result.reason || 'Validação falhou');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro na validação de integridade:', error);
      setValidationError('Erro na validação');
      return false;
    } finally {
      setIsValidating(false);
    }
  }, [user]);

  const hasPermission = useCallback(async (permission: string): Promise<boolean> => {
    if (!user || !user.id) {
      return false;
    }

    const token = authUtils.getToken();
    if (token && isTokenValid(token)) {
      const userData = extractUserData(token);
      if (userData && userData.permissoes) {
        if (userData.root) {
          return true;
        }
        return userData.permissoes.includes(permission);
      }
    }

    try {
      return await securityService.validatePermission(user.id, permission);
    } catch (error) {
      console.error('Erro na validação de permissão:', error);
      return false;
    }
  }, [user]);

  const canAccessModule = useCallback(async (module: string): Promise<boolean> => {
    if (!user || !user.id) {
      return false;
    }

    try {
      return await securityService.validateModuleAccess(user.id, module);
    } catch (error) {
      console.error('Erro na validação de acesso ao módulo:', error);
      return false;
    }
  }, [user]);

  const isRoot = useCallback(async (): Promise<boolean> => {
    if (!user || !user.id) {
      return false;
    }

    const token = authUtils.getToken();
    if (token && isTokenValid(token)) {
      const userData = extractUserData(token);
      if (userData) {
        return userData.root === true;
      }
    }

    try {
      const result = await securityService.validateUserIntegrity(user.id, user.root);
      return result.isValid && result.userData?.root === true;
    } catch (error) {
      console.error('Erro na validação de root:', error);
      return false;
    }
  }, [user]);

  const hasAnyPermission = useCallback(async (permissions: string[]): Promise<boolean> => {
    if (!user || !user.id) {
      return false;
    }

    const token = authUtils.getToken();
    if (token && isTokenValid(token)) {
      const userData = extractUserData(token);
      if (userData && userData.permissoes) {
        if (userData.root) {
          return true;
        }
        return permissions.some(permission => userData.permissoes.includes(permission));
      }
    }

    try {
      const rootResult = await securityService.validateUserIntegrity(user.id, user.root);
      if (rootResult.isValid && rootResult.userData?.root === true) {
        return true;
      }

      for (const permission of permissions) {
        const hasPermission = await securityService.validatePermission(user.id, permission);
        if (hasPermission) {
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Erro na validação de permissões:', error);
      return false;
    }
  }, [user]);

  const hasAllPermissions = useCallback(async (permissions: string[]): Promise<boolean> => {
    if (!user || !user.id) {
      return false;
    }

    try {
      const rootResult = await securityService.validateUserIntegrity(user.id, user.root);
      if (rootResult.isValid && rootResult.userData?.root === true) {
        return true;
      }

      for (const permission of permissions) {
        const hasPermission = await securityService.validatePermission(user.id, permission);
        if (!hasPermission) {
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Erro na validação de permissões:', error);
      return false;
    }
  }, [user]);

  const validateDataConsistency = useCallback(async (): Promise<boolean> => {
    if (!user) {
      return false;
    }

    try {
      return await securityService.validateDataConsistency(user);
    } catch (error) {
      console.error('Erro na validação de consistência:', error);
      return false;
    }
  }, [user]);

  const revalidateIntegrity = useCallback(async (): Promise<boolean> => {
    securityService.clearCache();
    return await validateUserIntegrity();
  }, [validateUserIntegrity]);

  useEffect(() => {
    if (user) {
      validateUserIntegrity();
    }
  }, [user, validateUserIntegrity]);

  return {
    hasPermission,
    canAccessModule,
    isRoot,
    hasAnyPermission,
    hasAllPermissions,
    
    validateUserIntegrity,
    validateDataConsistency,
    revalidateIntegrity,
    
    isValidating,
    validationError,
    user
  };
}
