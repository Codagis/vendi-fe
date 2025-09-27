
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
  sub: string;
  userData: UserTokenData;
  iat: number;
  exp: number;
}

export function decodeJWT(token: string): JwtPayload | null {
  try {
    if (!token) {
      return null;
    }

    const cleanToken = token.replace(/^Bearer\s+/, '');
    
    const parts = cleanToken.split('.');
    if (parts.length !== 3) {
      console.error('Token JWT inválido: formato incorreto');
      return null;
    }

    const payload = parts[1];
    const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    
    return JSON.parse(decodedPayload) as JwtPayload;
  } catch (error) {
    console.error('Erro ao decodificar token JWT:', error);
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload) {
    return true;
  }

  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
}

export function extractUserData(token: string): UserTokenData | null {
  const payload = decodeJWT(token);
  return payload?.userData || null;
}

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

export function getTokenTimeRemaining(token: string): number {
  const payload = decodeJWT(token);
  if (!payload) {
    return 0;
  }

  const now = Math.floor(Date.now() / 1000);
  const remaining = payload.exp - now;
  return Math.max(0, remaining);
}

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

