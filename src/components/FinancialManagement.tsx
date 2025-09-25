import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { 
  DollarSign, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  CreditCard,
  Receipt,
  AlertCircle,
  Filter
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data
const mockReceivables = [
  {
    id: 1,
    customerName: 'João Silva',
    description: 'Venda #001234',
    amount: 1250.00,
    dueDate: '2024-01-25',
    status: 'pending',
    installments: '1/3',
    saleDate: '2023-12-25'
  },
  {
    id: 2,
    customerName: 'Maria Santos',
    description: 'Venda #001235',
    amount: 850.00,
    dueDate: '2024-01-20',
    status: 'overdue',
    installments: '2/2',
    saleDate: '2023-11-20'
  },
  {
    id: 3,
    customerName: 'Pedro Oliveira',
    description: 'Venda #001236',
    amount: 2100.00,
    dueDate: '2024-02-15',
    status: 'paid',
    installments: '1/1',
    saleDate: '2024-01-15',
    paidDate: '2024-01-18'
  }
];

const mockPayables = [
  {
    id: 1,
    supplier: 'Samsung Electronics',
    description: 'Compra de smartphones',
    amount: 15000.00,
    dueDate: '2024-01-28',
    status: 'pending',
    category: 'Fornecedores',
    type: 'variable'
  },
  {
    id: 2,
    supplier: 'Energia Elétrica',
    description: 'Conta de luz - Jan/2024',
    amount: 450.00,
    dueDate: '2024-01-30',
    status: 'pending',
    category: 'Utilities',
    type: 'fixed'
  },
  {
    id: 3,
    supplier: 'Dell Technologies',
    description: 'Compra de notebooks',
    amount: 8500.00,
    dueDate: '2024-01-15',
    status: 'paid',
    category: 'Fornecedores',
    type: 'variable',
    paidDate: '2024-01-14'
  }
];

const mockCashFlow = [
  { date: '2024-01-15', income: 3200, expenses: 1800, balance: 1400 },
  { date: '2024-01-16', income: 2800, expenses: 2200, balance: 600 },
  { date: '2024-01-17', income: 4100, expenses: 1500, balance: 2600 },
  { date: '2024-01-18', income: 1900, expenses: 3200, balance: -1300 },
  { date: '2024-01-19', income: 3500, expenses: 2100, balance: 1400 },
  { date: '2024-01-20', income: 5200, expenses: 1800, balance: 3400 },
  { date: '2024-01-21', income: 2700, expenses: 2900, balance: -200 }
];

const categories = ['Fornecedores', 'Utilities', 'Marketing', 'Funcionários', 'Impostos', 'Outros'];

export function FinancialManagement() {
  const [receivables, setReceivables] = useState(mockReceivables);
  const [payables, setPayables] = useState(mockPayables);
  const [isReceivableDialogOpen, setIsReceivableDialogOpen] = useState(false);
  const [isPayableDialogOpen, setIsPayableDialogOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  const [receivableData, setReceivableData] = useState({
    customerName: '',
    description: '',
    amount: '',
    dueDate: '',
    installments: '1'
  });

  const [payableData, setPayableData] = useState({
    supplier: '',
    description: '',
    amount: '',
    dueDate: '',
    category: '',
    type: 'variable'
  });

  const getStatusBadge = (status: string): { label: string; color: string } => {
    switch (status) {
      case 'paid':
        return { label: 'Pago', color: 'bg-green-500' };
      case 'pending':
        return { label: 'Pendente', color: 'bg-yellow-500' };
      case 'overdue':
        return { label: 'Vencido', color: 'bg-red-500' };
      default:
        return { label: 'Desconhecido', color: 'bg-gray-500' };
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getTotalReceivables = (status = 'all') => {
    const filtered = status === 'all' ? receivables : receivables.filter(r => r.status === status);
    return filtered.reduce((sum, r) => sum + r.amount, 0);
  };

  const getTotalPayables = (status = 'all') => {
    const filtered = status === 'all' ? payables : payables.filter(p => p.status === status);
    return filtered.reduce((sum, p) => sum + p.amount, 0);
  };

  const getOverdueReceivables = () => {
    return receivables.filter(r => r.status === 'overdue' || (r.status === 'pending' && new Date(r.dueDate) < new Date()));
  };

  const getOverduePayables = () => {
    return payables.filter(p => p.status === 'overdue' || (p.status === 'pending' && new Date(p.dueDate) < new Date()));
  };

  const handleAddReceivable = () => {
    if (!receivableData.customerName || !receivableData.amount || !receivableData.dueDate) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    const newReceivable = {
      id: Date.now(),
      ...receivableData,
      amount: parseFloat(receivableData.amount),
      status: 'pending',
      saleDate: new Date().toISOString().split('T')[0]
    };

    setReceivables([...receivables, newReceivable]);
    setIsReceivableDialogOpen(false);
    setReceivableData({ customerName: '', description: '', amount: '', dueDate: '', installments: '1' });
  };

  const handleAddPayable = () => {
    if (!payableData.supplier || !payableData.amount || !payableData.dueDate) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    const newPayable = {
      id: Date.now(),
      ...payableData,
      amount: parseFloat(payableData.amount),
      status: 'pending'
    };

    setPayables([...payables, newPayable]);
    setIsPayableDialogOpen(false);
    setPayableData({ supplier: '', description: '', amount: '', dueDate: '', category: '', type: 'variable' });
  };

  const markAsPaid = (id: number, type: string): void => {
    const today = new Date().toISOString().split('T')[0];
    
    if (type === 'receivable') {
      setReceivables(receivables.map(r => 
        r.id === id ? { ...r, status: 'paid', paidDate: today } : r
      ));
    } else {
      setPayables(payables.map(p => 
        p.id === id ? { ...p, status: 'paid', paidDate: today } : p
      ));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão Financeira</h1>
          <p className="text-gray-600">Controle suas contas a receber e pagar</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsReceivableDialogOpen(true)} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Conta a Receber
          </Button>
          <Button onClick={() => setIsPayableDialogOpen(true)} className="bg-red-600 hover:bg-red-700">
            <Plus className="h-4 w-4 mr-2" />
            Conta a Pagar
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8" />
              <div className="ml-4">
                <p className="text-sm font-medium opacity-90">A Receber (Total)</p>
                <p className="text-2xl font-bold">{formatCurrency(getTotalReceivables())}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingDown className="h-8 w-8" />
              <div className="ml-4">
                <p className="text-sm font-medium opacity-90">A Pagar (Total)</p>
                <p className="text-2xl font-bold">{formatCurrency(getTotalPayables())}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8" />
              <div className="ml-4">
                <p className="text-sm font-medium opacity-90">Saldo Projetado</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(getTotalReceivables('pending') - getTotalPayables('pending'))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8" />
              <div className="ml-4">
                <p className="text-sm font-medium opacity-90">Vencidos</p>
                <p className="text-2xl font-bold">
                  {getOverdueReceivables().length + getOverduePayables().length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cash Flow Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Fluxo de Caixa (Últimos 7 dias)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockCashFlow}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} />
              <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(1)}k`} />
              <Tooltip 
                formatter={(value, name) => [
                  formatCurrency(Number(value)), 
                  name === 'income' ? 'Receitas' : name === 'expenses' ? 'Despesas' : 'Saldo'
                ]}
                labelFormatter={(date) => formatDate(date)}
              />
              <Bar dataKey="income" fill="#10B981" name="income" />
              <Bar dataKey="expenses" fill="#EF4444" name="expenses" />
              <Bar dataKey="balance" fill="#3B82F6" name="balance" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Tabs defaultValue="receivables" className="space-y-4">
        <TabsList>
          <TabsTrigger value="receivables">Contas a Receber</TabsTrigger>
          <TabsTrigger value="payables">Contas a Pagar</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="receivables" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pending">Pendentes</SelectItem>
                    <SelectItem value="paid">Pagos</SelectItem>
                    <SelectItem value="overdue">Vencidos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Receivables Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Contas a Receber
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead>Parcela</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {receivables
                      .filter(r => selectedFilter === 'all' || r.status === selectedFilter)
                      .map((receivable) => {
                        const status = getStatusBadge(receivable.status);
                        // const StatusIcon = status.icon;
                        const isOverdue = receivable.status === 'pending' && new Date(receivable.dueDate) < new Date();
                        
                        return (
                          <TableRow key={receivable.id}>
                            <TableCell>
                              <p className="font-medium">{receivable.customerName}</p>
                            </TableCell>
                            <TableCell>
                              <p className="text-sm">{receivable.description}</p>
                              <p className="text-xs text-gray-500">Venda em: {formatDate(receivable.saleDate)}</p>
                            </TableCell>
                            <TableCell>
                              <p className="font-bold text-green-600">{formatCurrency(receivable.amount)}</p>
                            </TableCell>
                            <TableCell>
                              <p className={isOverdue ? 'text-red-600 font-medium' : ''}>
                                {formatDate(receivable.dueDate)}
                              </p>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{receivable.installments}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={`${isOverdue && receivable.status === 'pending' ? 'bg-red-500' : status.color} text-white`}>
                                {/* <StatusIcon className="h-3 w-3 mr-1" /> */}
                                {isOverdue && receivable.status === 'pending' ? 'Vencido' : status.label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {receivable.status === 'pending' && (
                                <Button
                                  size="sm"
                                  onClick={() => markAsPaid(receivable.id, 'receivable')}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Marcar como Pago
                                </Button>
                              )}
                              {receivable.status === 'paid' && (
                                <span className="text-xs text-gray-500">
                                  Pago em: {receivable.paidDate ? formatDate(receivable.paidDate) : 'N/A'}
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payables" className="space-y-4">
          {/* Payables Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Contas a Pagar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fornecedor</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payables.map((payable) => {
                      const status = getStatusBadge(payable.status);
                      // const StatusIcon = status.icon;
                      const isOverdue = payable.status === 'pending' && new Date(payable.dueDate) < new Date();
                      
                      return (
                        <TableRow key={payable.id}>
                          <TableCell>
                            <p className="font-medium">{payable.supplier}</p>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm">{payable.description}</p>
                          </TableCell>
                          <TableCell>
                            <p className="font-bold text-red-600">{formatCurrency(payable.amount)}</p>
                          </TableCell>
                          <TableCell>
                            <p className={isOverdue ? 'text-red-600 font-medium' : ''}>
                              {formatDate(payable.dueDate)}
                            </p>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{payable.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={payable.type === 'fixed' ? 'default' : 'secondary'}>
                              {payable.type === 'fixed' ? 'Fixa' : 'Variável'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${isOverdue && payable.status === 'pending' ? 'bg-red-500' : status.color} text-white`}>
                              {/* <StatusIcon className="h-3 w-3 mr-1" /> */}
                              {isOverdue && payable.status === 'pending' ? 'Vencido' : status.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {payable.status === 'pending' && (
                              <Button
                                size="sm"
                                onClick={() => markAsPaid(payable.id, 'payable')}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Marcar como Pago
                              </Button>
                            )}
                            {payable.status === 'paid' && (
                              <span className="text-xs text-gray-500">
                                Pago em: {payable.paidDate ? formatDate(payable.paidDate) : 'N/A'}
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumo Mensal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                  <span>Total Recebido</span>
                  <span className="font-bold text-green-600">{formatCurrency(getTotalReceivables('paid'))}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                  <span>Total Pago</span>
                  <span className="font-bold text-red-600">{formatCurrency(getTotalPayables('paid'))}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                  <span>Saldo Realizado</span>
                  <span className="font-bold text-blue-600">
                    {formatCurrency(getTotalReceivables('paid') - getTotalPayables('paid'))}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Próximos Vencimentos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...receivables, ...payables]
                    .filter(item => item.status === 'pending')
                    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                    .slice(0, 5)
                    .map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 border rounded">
                        <div>
                          <p className="text-sm font-medium">
                            {(item as any).customerName || (item as any).supplier}
                          </p>
                          <p className="text-xs text-gray-500">{formatDate(item.dueDate)}</p>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${(item as any).customerName ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(item.amount)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(item as any).customerName ? 'Receber' : 'Pagar'}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Receivable Dialog */}
      <Dialog open={isReceivableDialogOpen} onOpenChange={setIsReceivableDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Conta a Receber</DialogTitle>
            <DialogDescription>Cadastre uma nova conta a receber</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nome do Cliente *</Label>
              <Input
                placeholder="Nome do cliente"
                value={receivableData.customerName}
                onChange={(e) => setReceivableData({ ...receivableData, customerName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Valor *</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={receivableData.amount}
                onChange={(e) => setReceivableData({ ...receivableData, amount: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Data de Vencimento *</Label>
              <Input
                type="date"
                value={receivableData.dueDate}
                onChange={(e) => setReceivableData({ ...receivableData, dueDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Parcela</Label>
              <Input
                placeholder="1/1"
                value={receivableData.installments}
                onChange={(e) => setReceivableData({ ...receivableData, installments: e.target.value })}
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Descrição</Label>
              <Textarea
                placeholder="Descrição da conta a receber"
                value={receivableData.description}
                onChange={(e) => setReceivableData({ ...receivableData, description: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsReceivableDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddReceivable}>
              Cadastrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Payable Dialog */}
      <Dialog open={isPayableDialogOpen} onOpenChange={setIsPayableDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Conta a Pagar</DialogTitle>
            <DialogDescription>Cadastre uma nova conta a pagar</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fornecedor *</Label>
              <Input
                placeholder="Nome do fornecedor"
                value={payableData.supplier}
                onChange={(e) => setPayableData({ ...payableData, supplier: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Valor *</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={payableData.amount}
                onChange={(e) => setPayableData({ ...payableData, amount: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Data de Vencimento *</Label>
              <Input
                type="date"
                value={payableData.dueDate}
                onChange={(e) => setPayableData({ ...payableData, dueDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={payableData.category} onValueChange={(value) => setPayableData({ ...payableData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={payableData.type} onValueChange={(value) => setPayableData({ ...payableData, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Despesa Fixa</SelectItem>
                  <SelectItem value="variable">Despesa Variável</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Descrição</Label>
              <Textarea
                placeholder="Descrição da conta a pagar"
                value={payableData.description}
                onChange={(e) => setPayableData({ ...payableData, description: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsPayableDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddPayable}>
              Cadastrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}