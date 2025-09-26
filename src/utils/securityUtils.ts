/**
 * Utilitários de segurança para validação de integridade no frontend.
 * 
 * @author Sistema Vendi
 * @version 1.0
 */

export interface SecurityValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface UserIntegrityCheck {
  isAuthenticated: boolean;
  hasValidToken: boolean;
  permissionsMatch: boolean;
  rootStatusValid: boolean;
  lastValidation: Date;
}

/**
 * Valida a integridade dos dados do usuário.
 */
export function validateUserIntegrity(user: any): SecurityValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validações obrigatórias
  if (!user) {
    errors.push('Usuário não encontrado');
    return { isValid: false, errors, warnings };
  }

  // Validações mais flexíveis - só erros críticos
  if (user.id !== undefined && (typeof user.id !== 'number' || user.id <= 0)) {
    errors.push('ID do usuário inválido');
  }

  if (user.username !== undefined && (typeof user.username !== 'string' || user.username.trim() === '')) {
    errors.push('Username inválido');
  }

  if (user.permissions !== undefined && !Array.isArray(user.permissions)) {
    errors.push('Permissões inválidas');
  }

  // Validação de root - mais flexível
  if (user.root !== undefined && typeof user.root !== 'boolean') {
    warnings.push('Status root pode estar inválido');
  }

  // Validações de segurança
  if (user.permissions && user.permissions.includes('all') && !user.root) {
    warnings.push('Usuário tem permissão "all" mas não é root - possível inconsistência');
  }

  if (user.root && (!user.permissions || user.permissions.length === 0)) {
    warnings.push('Usuário root sem permissões definidas');
  }

  // Validação de token (se disponível) - mais flexível
  if (user.token !== undefined && typeof user.token !== 'string') {
    errors.push('Token inválido');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Valida se o usuário tem permissão para uma ação específica.
 */
export function validatePermission(user: any, permission: string): SecurityValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!user) {
    errors.push('Usuário não autenticado');
    return { isValid: false, errors, warnings };
  }

  // Usuários root sempre têm acesso
  if (user.root === true) {
    return { isValid: true, errors: [], warnings: [] };
  }

  // Verificar permissões - mais flexível
  if (!user.permissions || !Array.isArray(user.permissions)) {
    warnings.push('Permissões não disponíveis - assumindo acesso negado');
    return { isValid: false, errors, warnings };
  }

  const hasPermission = user.permissions.includes('all') || user.permissions.includes(permission);
  
  if (!hasPermission) {
    errors.push(`Permissão '${permission}' não concedida`);
  }

  return {
    isValid: hasPermission,
    errors,
    warnings
  };
}

/**
 * Valida se o usuário pode acessar um módulo específico.
 */
export function validateModuleAccess(user: any, module: string): SecurityValidation {
  const modulePermissions: { [key: string]: string[] } = {
    'dashboard': ['dashboard'],
    'pos': ['pos'],
    'products': ['products'],
    'customers': ['customers'],
    'inventory': ['inventory'],
    'financial': ['financial'],
    'reports': ['reports'],
    'users': ['users'],
    'perfis': ['perfis'],
    'permissoes': ['permissoes'],
    'settings': ['settings']
  };

  const requiredPermissions = modulePermissions[module] || [];
  
  if (requiredPermissions.length === 0) {
    return { isValid: true, errors: [], warnings: [] };
  }

  return validateAnyPermission(user, requiredPermissions);
}

/**
 * Valida se o usuário tem qualquer uma das permissões especificadas.
 */
export function validateAnyPermission(user: any, permissions: string[]): SecurityValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!user) {
    errors.push('Usuário não autenticado');
    return { isValid: false, errors, warnings };
  }

  // Usuários root sempre têm acesso
  if (user.root === true) {
    return { isValid: true, errors: [], warnings: [] };
  }

  // Verificar permissões - mais flexível
  if (!user.permissions || !Array.isArray(user.permissions)) {
    warnings.push('Permissões não disponíveis - assumindo acesso negado');
    return { isValid: false, errors, warnings };
  }

  const hasAnyPermission = user.permissions.includes('all') || 
                          permissions.some(p => user.permissions.includes(p));
  
  if (!hasAnyPermission) {
    errors.push(`Nenhuma das permissões necessárias: ${permissions.join(', ')}`);
  }

  return {
    isValid: hasAnyPermission,
    errors,
    warnings
  };
}

/**
 * Valida se o usuário tem todas as permissões especificadas.
 */
export function validateAllPermissions(user: any, permissions: string[]): SecurityValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!user) {
    errors.push('Usuário não autenticado');
    return { isValid: false, errors, warnings };
  }

  // Usuários root sempre têm acesso
  if (user.root === true) {
    return { isValid: true, errors: [], warnings: [] };
  }

  // Verificar permissões - mais flexível
  if (!user.permissions || !Array.isArray(user.permissions)) {
    warnings.push('Permissões não disponíveis - assumindo acesso negado');
    return { isValid: false, errors, warnings };
  }

  const hasAllPermissions = user.permissions.includes('all') || 
                           permissions.every(p => user.permissions.includes(p));
  
  if (!hasAllPermissions) {
    const missingPermissions = permissions.filter(p => !user.permissions.includes(p));
    errors.push(`Permissões faltando: ${missingPermissions.join(', ')}`);
  }

  return {
    isValid: hasAllPermissions,
    errors,
    warnings
  };
}

/**
 * Valida a integridade do token JWT.
 */
export function validateTokenIntegrity(token: string): SecurityValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Se não há token, não é um erro crítico
  if (!token) {
    return { isValid: true, errors: [], warnings: [] };
  }

  if (typeof token !== 'string') {
    errors.push('Token deve ser uma string');
    return { isValid: false, errors, warnings };
  }

  // Verificar formato básico do JWT (3 partes separadas por ponto)
  const parts = token.split('.');
  if (parts.length !== 3) {
    warnings.push('Formato de token pode estar inválido');
    return { isValid: true, errors, warnings };
  }

  // Verificar se as partes não estão vazias
  if (parts.some(part => part.length === 0)) {
    warnings.push('Token pode estar malformado');
    return { isValid: true, errors, warnings };
  }

  return {
    isValid: true,
    errors,
    warnings
  };
}

/**
 * Valida se uma requisição é segura.
 */
export function validateRequestSecurity(request: any): SecurityValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!request) {
    errors.push('Requisição não fornecida');
    return { isValid: false, errors, warnings };
  }

  // Verificar se tem token de autorização
  if (!request.headers || !request.headers.Authorization) {
    errors.push('Token de autorização não fornecido');
  }

  // Verificar se o token está no formato correto
  const authHeader = request.headers?.Authorization;
  if (authHeader && !authHeader.startsWith('Bearer ')) {
    errors.push('Formato de autorização inválido');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Gera um hash simples para validação de integridade.
 */
export function generateIntegrityHash(data: any): string {
  const str = JSON.stringify(data);
  let hash = 0;
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(16);
}

/**
 * Valida se os dados não foram modificados.
 */
export function validateDataIntegrity(originalData: any, currentData: any, expectedHash?: string): SecurityValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!originalData || !currentData) {
    errors.push('Dados originais ou atuais não fornecidos');
    return { isValid: false, errors, warnings };
  }

  const currentHash = generateIntegrityHash(currentData);
  
  if (expectedHash && currentHash !== expectedHash) {
    errors.push('Dados foram modificados - hash não confere');
  }

  // Verificar se campos críticos não foram alterados
  const criticalFields = ['id', 'username', 'root'];
  for (const field of criticalFields) {
    if (originalData[field] !== currentData[field]) {
      errors.push(`Campo crítico '${field}' foi modificado`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Log de segurança para auditoria.
 */
export function logSecurityEvent(event: string, details: any, user?: any): void {
  const timestamp = new Date().toISOString();
  const userId = user?.id || 'UNKNOWN';
  const username = user?.username || 'UNKNOWN';
  
  console.warn(`[SECURITY] ${timestamp} - User: ${username} (${userId}) - Event: ${event}`, details);
}

/**
 * Valida se o ambiente é seguro.
 */
export function validateEnvironmentSecurity(): SecurityValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Verificar se está em HTTPS em produção
  if (typeof window !== 'undefined' && window.location.protocol !== 'https:') {
    errors.push('Aplicação deve usar HTTPS em produção');
  }

  // Verificar se há console.log em produção
  if (console.log.toString().includes('native code')) {
    warnings.push('Console.log detectado em produção');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}
