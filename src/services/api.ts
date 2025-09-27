import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { notificationService } from './notificationService';

const API_BASE_URL = 'http://localhost:8080/api';

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
  lojaId?: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  type: string;
  id: number;
  username: string;
  nome: string;
  email: string;
  role: string;
  permissions: string[];
  root?: boolean;
  empresaId: number;
  empresaNome: string;
  lojaId?: number;
  lojaNome?: string;
  ultimoLogin: string;
  expiresAt: string;
}

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
  permissoes?: Permissao[];
  permissaoChaves?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Permissao {
  id: number;
  chave: string;
  nome: string;
  descricao?: string;
  categoria: string;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

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

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

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

    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: any) => {
        notificationService.handleApiError(error);
        
        if (error.response?.status === 401 && !error.config?.url?.includes('/auth/login')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        
        return Promise.reject(error);
      }
    );
  }

  async post<T>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> {
    return await this.api.post<T>(url, data, config);
  }

  async get<T>(url: string, config?: any): Promise<AxiosResponse<T>> {
    return await this.api.get<T>(url, config);
  }

  async put<T>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> {
    return await this.api.put<T>(url, data, config);
  }

  async delete<T>(url: string, config?: any): Promise<AxiosResponse<T>> {
    return await this.api.delete<T>(url, config);
  }

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

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const response = await this.api.post<RefreshTokenResponse>('/auth/refresh', { refreshToken });
    return response.data;
  }

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

  async validarExclusaoUsuario(id: number): Promise<{ canDelete: boolean; reasons?: string[] }> {
    const response = await this.api.get<{ canDelete: boolean; reasons?: string[] }>(`/usuarios/${id}/can-delete`);
    return response.data;
  }

  async getPerfis(): Promise<Perfil[]> {
    const response = await this.api.get<Perfil[]>('/perfis');
    return response.data;
  }

  async getPerfisAtivos(): Promise<Perfil[]> {
    const response = await this.api.get<Perfil[]>('/perfis/ativos');
    return response.data;
  }

  async getPerfil(id: number): Promise<Perfil> {
    const response = await this.api.get<Perfil>(`/perfis/${id}`);
    return response.data;
  }

  async createPerfil(perfil: Partial<Perfil>): Promise<Perfil> {
    const response = await this.api.post<Perfil>('/perfis', perfil);
    return response.data;
  }

  async updatePerfil(id: number, perfil: Partial<Perfil>): Promise<Perfil> {
    const response = await this.api.put<Perfil>(`/perfis/${id}`, perfil);
    return response.data;
  }

  async deletePerfil(id: number): Promise<void> {
    await this.api.delete(`/perfis/${id}`);
  }

  async alterarStatusPerfil(id: number, ativo: boolean): Promise<void> {
    await this.api.patch(`/perfis/${id}/status`, null, { params: { ativo } });
  }

  async getPermissoes(): Promise<Permissao[]> {
    const response = await this.api.get<Permissao[]>('/permissoes');
    return response.data;
  }

  async getPermissoesAtivas(): Promise<Permissao[]> {
    const response = await this.api.get<Permissao[]>('/permissoes/ativas');
    return response.data;
  }

  async getPermissoesPorCategoria(categoria: string): Promise<Permissao[]> {
    const response = await this.api.get<Permissao[]>(`/permissoes/categoria/${categoria}`);
    return response.data;
  }

  async getPermissoesPorPerfil(perfilId: number): Promise<Permissao[]> {
    const response = await this.api.get<Permissao[]>(`/permissoes/perfil/${perfilId}`);
    return response.data;
  }

  async getCategoriasPermissoes(): Promise<string[]> {
    const response = await this.api.get<string[]>('/permissoes/categorias');
    return response.data;
  }

  async getPermissao(id: number): Promise<Permissao> {
    const response = await this.api.get<Permissao>(`/permissoes/${id}`);
    return response.data;
  }

  async createPermissao(permissao: Partial<Permissao>): Promise<Permissao> {
    const response = await this.api.post<Permissao>('/permissoes', permissao);
    return response.data;
  }

  async updatePermissao(id: number, permissao: Partial<Permissao>): Promise<Permissao> {
    const response = await this.api.put<Permissao>(`/permissoes/${id}`, permissao);
    return response.data;
  }

  async deletePermissao(id: number): Promise<void> {
    await this.api.delete(`/permissoes/${id}`);
  }

  async alterarStatusPermissao(id: number, ativo: boolean): Promise<void> {
    await this.api.patch(`/permissoes/${id}/status`, null, { params: { ativo } });
  }

  async getLojas(): Promise<Loja[]> {
    return [
      { id: 1, nome: 'Loja Matriz', codigo: '001', ativo: true, empresaId: 1 },
      { id: 2, nome: 'Loja Shopping', codigo: '002', ativo: true, empresaId: 1 },
      { id: 3, nome: 'Loja Bairro', codigo: '003', ativo: true, empresaId: 1 }
    ];
  }
}

export const apiService = new ApiService();

export const authUtils = {
  setToken: (token: string) => {
    localStorage.setItem('token', token);
  },
  
  getToken: () => {
    return localStorage.getItem('token');
  },
  
  removeToken: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  setRefreshToken: (refreshToken: string) => {
    localStorage.setItem('refreshToken', refreshToken);
  },
  
  getRefreshToken: () => {
    return localStorage.getItem('refreshToken');
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
