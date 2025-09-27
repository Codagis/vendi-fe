export interface User {
  id: number;
  username: string;
  email: string;
  nome: string;
  password?: string;
  root: boolean;
  ativo: boolean;
  contaBloqueada: boolean;
  perfil: {
    id: number;
    nome: string;
    codigo: string;
    ativo: boolean;
    permissoes: {
      id: number;
      chave: string;
      nome: string;
      descricao: string;
      ativa: boolean;
    }[];
  };
  empresa: {
    id: number;
    razaoSocial: string;
    nomeFantasia: string;
    cnpj: string;
    ativa: boolean;
  };
  loja: {
    id: number;
    nome: string;
    ativa: boolean;
  } | null;
  ultimoLogin: Date | null;
  tentativasFalhadas: number;
  deleted: boolean;
}

export type UserRole = 'admin' | 'seller' | 'stock' | 'financial';

export interface Store {
  id: number;
  name: string;
  address: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  description?: string;
  barcode?: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Customer {
  id: number;
  name: string;
  cpf: string;
  phone: string;
  email?: string;
  address?: string;
  birthDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Sale {
  id: string;
  customerId?: number;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  cashReceived?: number;
  change?: number;
  date: Date;
  userId: number;
  storeId: number;
}

export type PaymentMethod = 'cash' | 'debit' | 'credit' | 'pix';

export interface InventoryItem {
  id: string;
  productId: string;
  quantity: number;
  minimumQuantity: number;
  maximumQuantity: number;
  location?: string;
  lastUpdated: Date;
}

export interface FinancialTransaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  date: Date;
  reference?: string;
}

export interface DashboardStats {
  todaySales: number;
  transactions: number;
  products: number;
  customers: number;
}

export interface SalesData {
  name: string;
  vendas: number;
  meta: number;
}

export interface CategoryData {
  name: string;
  value: number;
  color: string;
}

export interface TopProduct {
  id: number;
  name: string;
  sold: number;
  revenue: string;
  trend: 'up' | 'down';
}

export interface LowStockProduct {
  id: number;
  name: string;
  current: number;
  minimum: number;
  status: 'critical' | 'warning';
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  permissions?: string[];
}

export interface NavigationProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
  currentUser: User | null;
  onLogout: () => void;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Empresa {
  id: number;
  razaoSocial: string;
  nomeFantasia?: string;
  cnpj: string;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  cep?: string;
  telefone?: string;
  email?: string;
  site?: string;
  ativo: boolean;
  urlLogo?: string;
  enderecoCompleto?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmpresaStats {
  totalEmpresas: number;
  empresasAtivas: number;
  empresasInativas: number;
  totalLojas: number;
  totalUsuarios: number;
}

export interface Loja {
  id: number;
  nome: string;
  codigo: string;
  descricao?: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  cep?: string;
  telefone?: string;
  ativo: boolean;
  enderecoCompleto?: string;
  empresaId: number;
  empresaRazaoSocial: string;
  createdAt: string;
  updatedAt: string;
}

export interface LojaStats {
  totalLojas: number;
  lojasAtivas: number;
  lojasInativas: number;
  totalUsuarios: number;
  totalEmpresas: number;
}
