import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiService, authUtils, type LoginResponse } from '../services/api';
import { notificationService } from '../services/notificationService';
import type { User, UserRole } from '../types';

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

  // Verificar autenticação ao carregar a aplicação
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      
      // Verificar se há token no localStorage
      const token = authUtils.getToken();
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      // Verificar se o token é válido
      const isValid = await apiService.validateToken();
      if (!isValid) {
        // Token inválido, limpar dados
        authUtils.removeToken();
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      // Token válido, recuperar dados do usuário do localStorage
      const savedUser = authUtils.getUser();
      if (savedUser) {
        setUser(savedUser);
        setIsAuthenticated(true);
      } else {
        // Se não há dados salvos, fazer logout
        authUtils.removeToken();
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      authUtils.removeToken();
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
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
      
      // Salvar token e dados do usuário
      authUtils.setToken(response.token);
      authUtils.setUser(response);

      // Converter para formato esperado
      const userData: User = {
        id: response.id,
        username: response.username,
        name: response.nome,
        role: response.role as UserRole,
        permissions: response.permissions,
        store: response.lojaId ? {
          id: response.lojaId,
          name: response.lojaNome || '',
          address: ''
        } : undefined
      };

      setUser(userData);
      setIsAuthenticated(true);
      notificationService.showSuccess('Login realizado com sucesso!');
    } catch (error) {
      console.error('Erro no login:', error);
      // O erro já foi tratado pelo interceptor da API
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authUtils.removeToken();
    setUser(null);
    setIsAuthenticated(false);
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
