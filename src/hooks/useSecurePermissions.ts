import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { securityService } from '../services/securityService';
import { extractUserData, isTokenValid } from '../services/jwtService';
import { authUtils } from '../services/api';

/**
 * Hook de permissões com validação de segurança no backend.
 * NÃO confia em dados do frontend - sempre valida no backend.
 * 
 * @author Sistema Vendi
 * @version 1.0
 */
export function useSecurePermissions() {
  const { user } = useAuth();
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  /**
   * Valida a integridade do usuário no backend.
   */
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

  /**
   * Verifica se o usuário tem permissão (usando dados do token quando possível).
   */
  const hasPermission = useCallback(async (permission: string): Promise<boolean> => {
    if (!user || !user.id) {
      return false;
    }

    // Primeiro, tentar verificar usando dados do token
    const token = authUtils.getToken();
    if (token && isTokenValid(token)) {
      const userData = extractUserData(token);
      if (userData && userData.permissoes) {
        // Se for root, tem todas as permissões
        if (userData.root) {
          return true;
        }
        // Verificar se tem a permissão específica
        return userData.permissoes.includes(permission);
      }
    }

    // Fallback: validar no backend
    try {
      return await securityService.validatePermission(user.id, permission);
    } catch (error) {
      console.error('Erro na validação de permissão:', error);
      return false;
    }
  }, [user]);

  /**
   * Verifica se o usuário pode acessar um módulo (validação no backend).
   */
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

  /**
   * Verifica se o usuário é root (usando dados do token quando possível).
   */
  const isRoot = useCallback(async (): Promise<boolean> => {
    if (!user || !user.id) {
      return false;
    }

    // Primeiro, tentar verificar usando dados do token
    const token = authUtils.getToken();
    if (token && isTokenValid(token)) {
      const userData = extractUserData(token);
      if (userData) {
        return userData.root === true;
      }
    }

    // Fallback: validar no backend
    try {
      const result = await securityService.validateUserIntegrity(user.id, user.root);
      return result.isValid && result.userData?.root === true;
    } catch (error) {
      console.error('Erro na validação de root:', error);
      return false;
    }
  }, [user]);

  /**
   * Verifica se o usuário tem qualquer uma das permissões (usando dados do token quando possível).
   */
  const hasAnyPermission = useCallback(async (permissions: string[]): Promise<boolean> => {
    if (!user || !user.id) {
      return false;
    }

    // Primeiro, tentar verificar usando dados do token
    const token = authUtils.getToken();
    if (token && isTokenValid(token)) {
      const userData = extractUserData(token);
      if (userData && userData.permissoes) {
        // Se for root, tem todas as permissões
        if (userData.root) {
          return true;
        }
        // Verificar se tem qualquer uma das permissões
        return permissions.some(permission => userData.permissoes.includes(permission));
      }
    }

    // Fallback: validar no backend
    try {
      // Verificar se é root primeiro
      const rootResult = await securityService.validateUserIntegrity(user.id, user.root);
      if (rootResult.isValid && rootResult.userData?.root === true) {
        return true;
      }

      // Verificar cada permissão
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

  /**
   * Verifica se o usuário tem todas as permissões (validação no backend).
   */
  const hasAllPermissions = useCallback(async (permissions: string[]): Promise<boolean> => {
    if (!user || !user.id) {
      return false;
    }

    try {
      // Verificar se é root primeiro
      const rootResult = await securityService.validateUserIntegrity(user.id, user.root);
      if (rootResult.isValid && rootResult.userData?.root === true) {
        return true;
      }

      // Verificar todas as permissões
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

  /**
   * Valida a consistência dos dados locais com o backend.
   */
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

  /**
   * Força uma nova validação de integridade.
   */
  const revalidateIntegrity = useCallback(async (): Promise<boolean> => {
    securityService.clearCache();
    return await validateUserIntegrity();
  }, [validateUserIntegrity]);

  // Validação automática quando o usuário muda
  useEffect(() => {
    if (user) {
      validateUserIntegrity();
    }
  }, [user, validateUserIntegrity]);

  return {
    // Validações assíncronas (sempre no backend)
    hasPermission,
    canAccessModule,
    isRoot,
    hasAnyPermission,
    hasAllPermissions,
    
    // Validações de integridade
    validateUserIntegrity,
    validateDataConsistency,
    revalidateIntegrity,
    
    // Estado
    isValidating,
    validationError,
    user
  };
}
