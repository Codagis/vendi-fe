import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiService, authUtils, type LoginResponse } from '../services/api';
import { notificationService } from '../services/notificationService';
import { extractUserData, isTokenValid } from '../services/jwtService';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      
      const token = authUtils.getToken();
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      if (!isTokenValid(token)) {
        await tryRefreshToken();
        return;
      }
      const userData = extractUserData(token);
      if (!userData) {
        authUtils.removeToken();
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      const user: User = {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        nome: userData.nome,
        root: userData.root,
        ativo: userData.ativo,
        contaBloqueada: userData.contaBloqueada,
        perfil: {
          id: 0,
          nome: userData.perfilNome,
          codigo: '',           ativo: true,
          permissoes: userData.permissoes.map(chave => ({
            id: 0,
            chave,
            nome: chave,             descricao: '',             ativa: true
          }))
        },
        empresa: {
          id: userData.empresaId,
          razaoSocial: userData.empresaNome,
          nomeFantasia: userData.empresaNome,
          cnpj: '',           ativa: true
        },
        loja: userData.lojaId ? {
          id: userData.lojaId,
          nome: userData.lojaNome || '',
          ativa: true
        } : null,
        ultimoLogin: null,         tentativasFalhadas: 0,         deleted: false
      };

      setIsAuthenticated(true);
      setUser(user);
      
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      authUtils.removeToken();
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const tryRefreshToken = async () => {
    try {
      const refreshToken = authUtils.getRefreshToken();
      if (!refreshToken) {
        authUtils.removeToken();
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      const response = await apiService.refreshToken(refreshToken);
      
      authUtils.setToken(response.accessToken);
      authUtils.setRefreshToken(response.refreshToken);
      
      await checkAuth();
      
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      authUtils.removeToken();
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      
      const loginRequest = {
        username,
        password
      };

      const response: LoginResponse = await apiService.login(loginRequest);
      
      authUtils.setToken(response.token);
      authUtils.setRefreshToken(response.refreshToken);
      
      const userData = extractUserData(response.token);
      if (!userData) {
        throw new Error('Erro ao extrair dados do usuário do token');
      }

      const user: User = {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        nome: userData.nome,
        root: userData.root,
        ativo: userData.ativo,
        contaBloqueada: userData.contaBloqueada,
        perfil: {
          id: 0,
          nome: userData.perfilNome,
          codigo: '',           ativo: true,
          permissoes: userData.permissoes.map(chave => ({
            id: 0,
            chave,
            nome: chave,             descricao: '',             ativa: true
          }))
        },
        empresa: {
          id: userData.empresaId,
          razaoSocial: userData.empresaNome,
          nomeFantasia: userData.empresaNome,
          cnpj: '',           ativa: true
        },
        loja: userData.lojaId ? {
          id: userData.lojaId,
          nome: userData.lojaNome || '',
          ativa: true
        } : null,
        ultimoLogin: null,         tentativasFalhadas: 0,         deleted: false
      };

      setUser(user);
      setIsAuthenticated(true);
      
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('authTimestamp', Date.now().toString());
      
      notificationService.showSuccess('Login realizado com sucesso!');
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authUtils.removeToken();
    setUser(null);
    setIsAuthenticated(false);
    
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('authTimestamp');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    sessionStorage.clear();
    
    notificationService.showInfo('Logout realizado com sucesso!');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
