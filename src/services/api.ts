import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { notificationService } from './notificationService';

// Configuração base da API
const API_BASE_URL = 'http://localhost:8080/api';

// Interface para resposta da API
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

// Interface para login
export interface LoginRequest {
  username: string;
  password: string;
  lojaId?: number;
}

export interface LoginResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  nome: string;
  email: string;
  role: string;
  permissions: string[];
  empresaId: number;
  empresaNome: string;
  lojaId?: number;
  lojaNome?: string;
  ultimoLogin: string;
  expiresAt: string;
}

// Interface para usuário
export interface Usuario {
  id: number;
  nome: string;
  username: string;
  cracha: string;
  email: string;
  perfilId: number;
  perfilNome: string;
  fotoPerfil?: string;
  urlFotoPerfil?: string;
  ativo: boolean;
  ultimoLogin?: string;
  tentativasLoginFalhadas: number;
  contaBloqueada: boolean;
  root: boolean;
  empresaId: number;
  empresaNome: string;
  lojaId?: number;
  lojaNome?: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Perfil {
  id: number;
  nome: string;
  codigo: string;
  descricao?: string;
  ativo: boolean;
  sistema: boolean;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// Interface para loja
export interface Loja {
  id: number;
  nome: string;
  codigo: string;
  descricao?: string;
  endereco?: string;
  ativo: boolean;
  empresaId: number;
}

export interface UsuarioStats {
  totalUsuarios: number;
  usuariosAtivos: number;
  usuariosInativos: number;
  administradores: number;
  vendedores: number;
  outrosPerfis: number;
}

// Classe para gerenciar a API
class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para adicionar token de autorização
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: any) => {
        return Promise.reject(error);
      }
    );

    // Interceptor para tratar respostas
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: any) => {
        // Sempre tratar erros com notificação
        notificationService.handleApiError(error);
        
        // Se for 401 e não for erro de login, redirecionar
        if (error.response?.status === 401 && !error.config?.url?.includes('/auth/login')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        
        return Promise.reject(error);
      }
    );
  }

  // Métodos de autenticação
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  }

  async validateToken(): Promise<boolean> {
    try {
      const response = await this.api.get<boolean>('/auth/validate');
      return response.data;
    } catch (error) {
      return false;
    }
  }

  // Métodos de usuários
  async getUsuarios(filters?: {
    nome?: string;
    username?: string;
    email?: string;
    perfilId?: number;
    empresaId?: number;
    lojaId?: number;
    ativo?: boolean;
  }): Promise<Usuario[]> {
    const response = await this.api.get<Usuario[]>('/usuarios', { params: filters });
    return response.data;
  }

  async getPerfis(): Promise<Perfil[]> {
    const response = await this.api.get<Perfil[]>('/perfis/ativos');
    return response.data;
  }

  async getUsuarioStats(): Promise<UsuarioStats> {
    const response = await this.api.get<UsuarioStats>('/usuarios/stats');
    return response.data;
  }

  async getUsuario(id: number): Promise<Usuario> {
    const response = await this.api.get<Usuario>(`/usuarios/${id}`);
    return response.data;
  }

  async createUsuario(usuario: Partial<Usuario>): Promise<Usuario> {
    const response = await this.api.post<Usuario>('/usuarios', usuario);
    return response.data;
  }

  async updateUsuario(id: number, usuario: Partial<Usuario>): Promise<Usuario> {
    const response = await this.api.put<Usuario>(`/usuarios/${id}`, usuario);
    return response.data;
  }

  async deleteUsuario(id: number): Promise<void> {
    await this.api.delete(`/usuarios/${id}`);
  }

  async alterarStatusUsuario(id: number, ativo: boolean): Promise<void> {
    await this.api.patch(`/usuarios/${id}/status`, null, { params: { ativo } });
  }

  // Métodos para lojas (mock por enquanto)
  async getLojas(): Promise<Loja[]> {
    // Por enquanto, retorna dados mockados
    // Em uma implementação real, você criaria endpoints para lojas
    return [
      { id: 1, nome: 'Loja Matriz', codigo: '001', ativo: true, empresaId: 1 },
      { id: 2, nome: 'Loja Shopping', codigo: '002', ativo: true, empresaId: 1 },
      { id: 3, nome: 'Loja Bairro', codigo: '003', ativo: true, empresaId: 1 }
    ];
  }
}

// Instância singleton do serviço
export const apiService = new ApiService();

// Funções auxiliares para gerenciar autenticação
export const authUtils = {
  setToken: (token: string) => {
    localStorage.setItem('token', token);
  },
  
  getToken: () => {
    return localStorage.getItem('token');
  },
  
  removeToken: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  setUser: (user: any) => {
    localStorage.setItem('user', JSON.stringify(user));
  },
  
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};
