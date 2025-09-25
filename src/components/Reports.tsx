import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  FileText, 
  Download, 
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  Package,
  DollarSign,
  Filter,
  Eye
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

// Mock data for reports
const salesByPeriod = [
  { period: '2024-01-15', sales: 15420.50, transactions: 87, customers: 45 },
  { period: '2024-01-16', sales: 12350.80, transactions: 72, customers: 38 },
  { period: '2024-01-17', sales: 18750.30, transactions: 95, customers: 52 },
  { period: '2024-01-18', sales: 21450.90, transactions: 103, customers: 61 },
  { period: '2024-01-19', sales: 16890.40, transactions: 89, customers: 47 },
  { period: '2024-01-20', sales: 23150.70, transactions: 118, customers: 68 },
  { period: '2024-01-21', sales: 19320.60, transactions: 97, customers: 54 }
];

const salesByCategory = [
  { name: 'Eletrônicos', value: 45350.80, percentage: 45, color: '#3B82F6' },
  { name: 'Roupas', value: 25420.50, percentage: 25, color: '#EF4444' },
  { name: 'Casa', value: 18750.30, percentage: 19, color: '#10B981' },
  { name: 'Alimentação', value: 11230.40, percentage: 11, color: '#F59E0B' }
];

const topProducts = [
  { name: 'Smartphone Galaxy S24', sales: 45, revenue: 40455.00, profit: 13636.50 },
  { name: 'Notebook Dell Inspiron', sales: 23, revenue: 57497.70, profit: 23599.10 },
  { name: 'Fone Bluetooth JBL', sales: 67, revenue: 8703.30, profit: 3351.30 },
  { name: 'Camiseta Polo Básica', sales: 89, revenue: 7111.10, profit: 3955.60 },
  { name: 'Tênis Esportivo', sales: 34, revenue: 8496.60, profit: 3738.40 }
];

const topCustomers = [
  { name: 'Pedro Oliveira', purchases: 15, revenue: 28750.00, lastPurchase: '2024-01-22' },
  { name: 'João Silva', purchases: 12, revenue: 15420.50, lastPurchase: '2024-01-21' },
  { name: 'Maria Santos', purchases: 8, revenue: 9250.80, lastPurchase: '2024-01-20' },
  { name: 'Ana Costa', purchases: 6, revenue: 6150.00, lastPurchase: '2024-01-19' },
  { name: 'Carlos Mendes', purchases: 5, revenue: 4820.30, lastPurchase: '2024-01-18' }
];

const inventoryMovements = [
  { product: 'Smartphone Galaxy S24', entries: 25, exits: 20, current: 15 },
  { product: 'Notebook Dell Inspiron', entries: 15, exits: 12, current: 8 },
  { product: 'Fone Bluetooth JBL', entries: 50, exits: 25, current: 25 },
  { product: 'Camiseta Polo Básica', entries: 100, exits: 50, current: 50 }
];

const financialSummary = {
  totalRevenue: 125430.90,
  totalExpenses: 78250.40,
  grossProfit: 47180.50,
  netProfit: 25680.30,
  receivables: 15420.80,
  payables: 23150.70
};

export function Reports() {
  const [dateFrom, setDateFrom] = useState('2024-01-15');
  const [dateTo, setDateTo] = useState('2024-01-21');
  // const [reportType] = useState('sales');
  const [selectedPeriod, setSelectedPeriod] = useState('daily');

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const exportReport = (format: string): void => {
    // Simulate export functionality
    alert(`Exportando relatório em formato ${format.toUpperCase()}...`);
  };

  const generatePeriodLabel = (period: string): string => {
    return new Date(period).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Relatórios e Análises</h1>
          <p className="text-gray-600">Visualize dados e exporte relatórios</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => exportReport('excel')} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar Excel
          </Button>
          <Button onClick={() => exportReport('pdf')} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros de Período
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Data Inicial</Label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div>
              <Label>Data Final</Label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            <div>
              <Label>Período</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Diário</SelectItem>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="monthly">Mensal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button className="w-full">
                <Eye className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sales">Vendas</TabsTrigger>
          <TabsTrigger value="products">Produtos</TabsTrigger>
          <TabsTrigger value="customers">Clientes</TabsTrigger>
          <TabsTrigger value="financial">Financeiro</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-6">
          {/* Sales Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total de Vendas</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(salesByPeriod.reduce((sum, item) => sum + item.sales, 0))}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Transações</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {salesByPeriod.reduce((sum, item) => sum + item.transactions, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Clientes Ativos</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {Math.max(...salesByPeriod.map(item => item.customers))}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Ticket Médio</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(
                        salesByPeriod.reduce((sum, item) => sum + item.sales, 0) /
                        salesByPeriod.reduce((sum, item) => sum + item.transactions, 0)
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sales Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Vendas por Período</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesByPeriod}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" tickFormatter={generatePeriodLabel} />
                    <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                    <Tooltip 
                      formatter={(value: any) => [formatCurrency(Number(value)), 'Vendas']}
                      labelFormatter={(period) => formatDate(period)}
                    />
                    <Bar dataKey="sales" fill="#3B82F6" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vendas por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={salesByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {salesByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => [formatCurrency(Number(value)), 'Vendas']} />
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {salesByCategory.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span>{item.name}</span>
                      </div>
                      <div className="text-right">
                        <div>{formatCurrency(item.value)}</div>
                        <div className="text-xs text-gray-500">{item.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Products */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Produtos Mais Vendidos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.sales} unidades</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{formatCurrency(product.revenue)}</p>
                        <p className="text-sm text-green-600">Lucro: {formatCurrency(product.profit)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Inventory Movements */}
            <Card>
              <CardHeader>
                <CardTitle>Movimentação de Estoque</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inventoryMovements.map((item, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">{item.product}</h4>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <p className="text-green-600 font-bold">{item.entries}</p>
                          <p className="text-gray-500">Entradas</p>
                        </div>
                        <div className="text-center">
                          <p className="text-red-600 font-bold">{item.exits}</p>
                          <p className="text-gray-500">Saídas</p>
                        </div>
                        <div className="text-center">
                          <p className="text-blue-600 font-bold">{item.current}</p>
                          <p className="text-gray-500">Atual</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Top Clientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Posição</th>
                      <th className="text-left p-2">Cliente</th>
                      <th className="text-left p-2">Compras</th>
                      <th className="text-left p-2">Total Gasto</th>
                      <th className="text-left p-2">Última Compra</th>
                      <th className="text-left p-2">Ticket Médio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topCustomers.map((customer, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                          </div>
                        </td>
                        <td className="p-2 font-medium">{customer.name}</td>
                        <td className="p-2">{customer.purchases}</td>
                        <td className="p-2 font-bold text-green-600">{formatCurrency(customer.revenue)}</td>
                        <td className="p-2">{formatDate(customer.lastPurchase)}</td>
                        <td className="p-2 font-medium">{formatCurrency(customer.revenue / customer.purchases)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          {/* Financial Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Demonstrativo de Resultados</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                  <span>Receita Total</span>
                  <span className="font-bold text-green-600">{formatCurrency(financialSummary.totalRevenue)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                  <span>Despesas Totais</span>
                  <span className="font-bold text-red-600">-{formatCurrency(financialSummary.totalExpenses)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                  <span>Lucro Bruto</span>
                  <span className="font-bold text-blue-600">{formatCurrency(financialSummary.grossProfit)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded border-2 border-purple-200">
                  <span className="font-medium">Lucro Líquido</span>
                  <span className="font-bold text-purple-600">{formatCurrency(financialSummary.netProfit)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">Contas a Receber</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">{formatCurrency(financialSummary.receivables)}</p>
                  <p className="text-sm text-gray-500">Total pendente</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Em dia</span>
                    <span className="text-green-600">{formatCurrency(financialSummary.receivables * 0.7)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Vencidos</span>
                    <span className="text-red-600">{formatCurrency(financialSummary.receivables * 0.3)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">Contas a Pagar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-red-600">{formatCurrency(financialSummary.payables)}</p>
                  <p className="text-sm text-gray-500">Total pendente</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Em dia</span>
                    <span className="text-yellow-600">{formatCurrency(financialSummary.payables * 0.8)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Vencidos</span>
                    <span className="text-red-600">{formatCurrency(financialSummary.payables * 0.2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cash Flow Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Fluxo de Caixa - Últimos 7 dias</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesByPeriod}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" tickFormatter={generatePeriodLabel} />
                  <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                  <Tooltip 
                    formatter={(value: any) => [formatCurrency(Number(value)), 'Valor']}
                    labelFormatter={(period) => formatDate(period)}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    name="Receitas"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-16 flex flex-col gap-2">
              <FileText className="h-6 w-6" />
              <span>Relatório Completo</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col gap-2">
              <BarChart3 className="h-6 w-6" />
              <span>Análise de Vendas</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col gap-2">
              <PieChart className="h-6 w-6" />
              <span>Desempenho Produtos</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col gap-2">
              <DollarSign className="h-6 w-6" />
              <span>Balanço Financeiro</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}