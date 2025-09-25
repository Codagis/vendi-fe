// User and Authentication Types
export interface User {
  id: number;
  username: string;
  password?: string;
  name: string;
  role: UserRole;
  permissions: string[];
  store?: Store;
}

export type UserRole = 'admin' | 'seller' | 'stock' | 'financial';

export interface Store {
  id: number;
  name: string;
  address: string;
}

// Product Types
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

// Customer Types
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

// Sale and Transaction Types
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

// Inventory Types
export interface InventoryItem {
  id: string;
  productId: string;
  quantity: number;
  minimumQuantity: number;
  maximumQuantity: number;
  location?: string;
  lastUpdated: Date;
}

// Financial Types
export interface FinancialTransaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  date: Date;
  reference?: string;
}

// Dashboard Types
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

// Navigation Types
export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  permissions?: string[];
}

// Component Props Types
export interface LoginScreenProps {
  onLogin: (user: User) => void;
}

export interface NavigationProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
  currentUser: User | null;
  onLogout: () => void;
}

// API Response Types
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
