/**
 * Serviço para decodificação e manipulação de tokens JWT.
 * 
 * @author Sistema Vendi
 * @version 1.0
 */

export interface UserTokenData {
  id: number;
  username: string;
  email: string;
  nome: string;
  root: boolean;
  ativo: boolean;
  contaBloqueada: boolean;
  perfilNome: string;
  permissoes: string[];
  empresaId: number;
  empresaNome: string;
  lojaId: number | null;
  lojaNome: string | null;
}

export interface JwtPayload {
  sub: string; // username
  userData: UserTokenData;
  iat: number; // issued at
  exp: number; // expiration
}

/**
 * Decodifica um token JWT e retorna o payload.
 */
export function decodeJWT(token: string): JwtPayload | null {
  try {
    if (!token) {
      return null;
    }

    // Remove o prefixo "Bearer " se presente
    const cleanToken = token.replace(/^Bearer\s+/, '');
    
    // Decodifica o JWT (base64url)
    const parts = cleanToken.split('.');
    if (parts.length !== 3) {
      console.error('Token JWT inválido: formato incorreto');
      return null;
    }

    // Decodifica o payload (parte do meio)
    const payload = parts[1];
    const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    
    return JSON.parse(decodedPayload) as JwtPayload;
  } catch (error) {
    console.error('Erro ao decodificar token JWT:', error);
    return null;
  }
}

/**
 * Verifica se o token está expirado.
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload) {
    return true;
  }

  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
}

/**
 * Extrai os dados do usuário do token.
 */
export function extractUserData(token: string): UserTokenData | null {
  const payload = decodeJWT(token);
  return payload?.userData || null;
}

/**
 * Verifica se o token é válido (não expirado e com dados válidos).
 */
export function isTokenValid(token: string): boolean {
  if (!token) {
    return false;
  }

  if (isTokenExpired(token)) {
    return false;
  }

  const userData = extractUserData(token);
  return userData !== null && userData.id > 0;
}

/**
 * Obtém o tempo restante do token em segundos.
 */
export function getTokenTimeRemaining(token: string): number {
  const payload = decodeJWT(token);
  if (!payload) {
    return 0;
  }

  const now = Math.floor(Date.now() / 1000);
  const remaining = payload.exp - now;
  return Math.max(0, remaining);
}

/**
 * Obtém o tempo restante do token em formato legível.
 */
export function getTokenTimeRemainingFormatted(token: string): string {
  const remaining = getTokenTimeRemaining(token);
  
  if (remaining === 0) {
    return 'Expirado';
  }

  const hours = Math.floor(remaining / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}
