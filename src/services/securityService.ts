/**
 * Serviço de segurança para validação de integridade no frontend.
 * 
 * @author Sistema Vendi
 * @version 1.0
 */

import { apiService } from './api';

export interface SecurityValidationResult {
  isValid: boolean;
  reason?: string;
  timestamp: string;
  userData?: {
    id: number;
    username: string;
    root: boolean;
    ativo: boolean;
    permissions: string[];
  };
}

export interface PermissionValidationResult {
  hasPermission: boolean;
  userId: number;
  permission: string;
  timestamp: number;
}

export interface ModuleAccessResult {
  canAccess: boolean;
  userId: number;
  module: string;
  timestamp: number;
}

class SecurityService {
  private validationCache = new Map<string, { result: any; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

  /**
   * Valida a integridade do usuário atual.
   */
  async validateUserIntegrity(userId: number, rootStatus?: boolean): Promise<SecurityValidationResult> {
    const cacheKey = `integrity_${userId}_${rootStatus}`;
    
    // Verificar cache
    const cached = this.validationCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.result;
    }

    try {
      const response = await apiService.post('/security/validate-integrity', null, {
        params: {
          userId,
          rootStatus
        }
      });

      const result: SecurityValidationResult = response.data;
      
      // Armazenar no cache
      this.validationCache.set(cacheKey, {
        result,
        timestamp: Date.now()
      });

      return result;
    } catch (error) {
      console.error('Erro na validação de integridade:', error);
      return {
        isValid: false,
        reason: 'Erro na validação',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Valida se o usuário tem uma permissão específica.
   */
  async validatePermission(userId: number, permission: string): Promise<boolean> {
    const cacheKey = `permission_${userId}_${permission}`;
    
    // Verificar cache
    const cached = this.validationCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.result.hasPermission;
    }

    try {
      const response = await apiService.post('/security/validate-permission', null, {
        params: {
          userId,
          permission
        }
      });

      const result: PermissionValidationResult = response.data;
      
      // Armazenar no cache
      this.validationCache.set(cacheKey, {
        result,
        timestamp: Date.now()
      });

      return result.hasPermission;
    } catch (error) {
      console.error('Erro na validação de permissão:', error);
      return false;
    }
  }

  /**
   * Valida se o usuário pode acessar um módulo específico.
   */
  async validateModuleAccess(userId: number, module: string): Promise<boolean> {
    const cacheKey = `module_${userId}_${module}`;
    
    // Verificar cache
    const cached = this.validationCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.result.canAccess;
    }

    try {
      const response = await apiService.post('/security/validate-module-access', null, {
        params: {
          userId,
          module
        }
      });

      const result: ModuleAccessResult = response.data;
      
      // Armazenar no cache
      this.validationCache.set(cacheKey, {
        result,
        timestamp: Date.now()
      });

      return result.canAccess;
    } catch (error) {
      console.error('Erro na validação de acesso ao módulo:', error);
      return false;
    }
  }

  /**
   * Obtém dados seguros do usuário do backend.
   */
  async getUserData(userId: number): Promise<any> {
    try {
      const response = await apiService.get(`/security/user-data/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter dados do usuário:', error);
      return null;
    }
  }

  /**
   * Limpa o cache de validações.
   */
  clearCache(): void {
    this.validationCache.clear();
  }

  /**
   * Valida se os dados locais são consistentes com o backend.
   */
  async validateDataConsistency(localUser: any): Promise<boolean> {
    if (!localUser || !localUser.id) {
      return false;
    }

    try {
      const backendData = await this.getUserData(localUser.id);
      if (!backendData) {
        return false;
      }

      // Verificar consistência dos dados críticos
      const isConsistent = 
        backendData.id === localUser.id &&
        backendData.username === localUser.username &&
        backendData.root === localUser.root;

      if (!isConsistent) {
        console.warn('Inconsistência de dados detectada:', {
          local: localUser,
          backend: backendData
        });
      }

      return isConsistent;
    } catch (error) {
      console.error('Erro na validação de consistência:', error);
      return false;
    }
  }
}

export const securityService = new SecurityService();
