import { } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Users, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  BarChart3
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { SalesData, CategoryData, TopProduct, LowStockProduct } from '../types';

// Mock data para o dashboard
const salesData: SalesData[] = [
  { name: 'Seg', vendas: 2400, meta: 3000 },
  { name: 'Ter', vendas: 1398, meta: 3000 },
  { name: 'Qua', vendas: 9800, meta: 3000 },
  { name: 'Qui', vendas: 3908, meta: 3000 },
  { name: 'Sex', vendas: 4800, meta: 3000 },
  { name: 'Sáb', vendas: 3800, meta: 3000 },
  { name: 'Dom', vendas: 4300, meta: 3000 }
];

const categoryData: CategoryData[] = [
  { name: 'Eletrônicos', value: 35, color: '#3B82F6' },
  { name: 'Roupas', value: 25, color: '#EF4444' },
  { name: 'Casa', value: 20, color: '#10B981' },
  { name: 'Alimentação', value: 15, color: '#F59E0B' },
  { name: 'Outros', value: 5, color: '#8B5CF6' }
];

const topProducts: TopProduct[] = [
  { id: 1, name: 'Smartphone XYZ', sold: 45, revenue: 'R$ 13.500,00', trend: 'up' },
  { id: 2, name: 'Notebook ABC', sold: 23, revenue: 'R$ 34.500,00', trend: 'up' },
  { id: 3, name: 'Fone Bluetooth', sold: 67, revenue: 'R$ 6.700,00', trend: 'down' },
  { id: 4, name: 'Carregador USB-C', sold: 89, revenue: 'R$ 2.670,00', trend: 'up' },
  { id: 5, name: 'Cabo HDMI', sold: 34, revenue: 'R$ 1.020,00', trend: 'down' }
];

const lowStockProducts: LowStockProduct[] = [
  { id: 1, name: 'Smartphone XYZ', current: 3, minimum: 10, status: 'critical' },
  { id: 2, name: 'Tablet Pro', current: 7, minimum: 15, status: 'warning' },
  { id: 3, name: 'Carregador Wireless', current: 12, minimum: 20, status: 'warning' },
  { id: 4, name: 'Cabo Lightning', current: 1, minimum: 25, status: 'critical' }
];

export function Dashboard(): JSX.Element {
  const today = new Date().toLocaleDateString('pt-BR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 capitalize">{today}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            ● Sistema Online
          </Badge>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas Hoje</CardTitle>
            <DollarSign className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 15.231,40</div>
            <p className="text-xs text-blue-100 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +12% em relação a ontem
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transações</CardTitle>
            <ShoppingCart className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">143</div>
            <p className="text-xs text-green-100 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +8% esta semana
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos</CardTitle>
            <Package className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.847</div>
            <p className="text-xs text-purple-100">Total em estoque</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
            <Users className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.284</div>
            <p className="text-xs text-orange-100">+23 novos este mês</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Vendas da Semana
            </CardTitle>
            <CardDescription>Comparativo entre vendas e metas diárias</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`R$ ${value.toLocaleString()}`, 'Vendas']} />
                <Bar dataKey="vendas" fill="#3B82F6" radius={4} />
                <Bar dataKey="meta" fill="#E5E7EB" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Vendas por Categoria</CardTitle>
            <CardDescription>Distribuição percentual das vendas</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Participação']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {categoryData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Produtos Mais Vendidos</CardTitle>
            <CardDescription>Ranking dos produtos com melhor performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.sold} unidades vendidas</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{product.revenue}</p>
                    <div className="flex items-center gap-1">
                      {product.trend === 'up' ? (
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      )}
                      <span className={`text-xs ${product.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                        {product.trend === 'up' ? 'Subindo' : 'Descendo'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Alertas de Estoque
            </CardTitle>
            <CardDescription>Produtos com estoque baixo que precisam de reposição</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{product.name}</h4>
                    <Badge 
                      variant={product.status === 'critical' ? 'destructive' : 'secondary'}
                      className={product.status === 'critical' ? '' : 'bg-orange-100 text-orange-700'}
                    >
                      {product.status === 'critical' ? 'Crítico' : 'Atenção'}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Estoque atual: {product.current}</span>
                      <span>Mínimo: {product.minimum}</span>
                    </div>
                    <Progress 
                      value={(product.current / product.minimum) * 100} 
                      className="h-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}