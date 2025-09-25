import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { 
  Warehouse, 
  Plus, 
  Minus, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Package,
  ArrowUpDown,
  FileText,
  Calendar
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

// Mock data
const mockProducts = [
  {
    id: '7891234567890',
    name: 'Smartphone Galaxy S24',
    category: 'Eletrônicos',
    currentStock: 15,
    minStock: 5,
    maxStock: 50,
    unit: 'UN',
    averageCost: 650.00,
    lastEntry: '2024-01-15',
    lastExit: '2024-01-22'
  },
  {
    id: '7891234567891',
    name: 'Notebook Dell Inspiron',
    category: 'Eletrônicos',
    currentStock: 3,
    minStock: 5,
    maxStock: 20,
    unit: 'UN',
    averageCost: 1800.00,
    lastEntry: '2024-01-10',
    lastExit: '2024-01-20'
  },
  {
    id: '7891234567892',
    name: 'Fone Bluetooth JBL',
    category: 'Eletrônicos',
    currentStock: 25,
    minStock: 10,
    maxStock: 100,
    unit: 'UN',
    averageCost: 80.00,
    lastEntry: '2024-01-18',
    lastExit: '2024-01-21'
  }
];

const mockMovements = [
  {
    id: 1,
    productId: '7891234567890',
    productName: 'Smartphone Galaxy S24',
    type: 'exit',
    quantity: 2,
    reason: 'Venda',
    date: '2024-01-22',
    user: 'João Vendedor',
    notes: 'Venda para cliente premium'
  },
  {
    id: 2,
    productId: '7891234567891',
    productName: 'Notebook Dell Inspiron',
    type: 'entry',
    quantity: 5,
    reason: 'Compra',
    date: '2024-01-20',
    user: 'Maria Estoque',
    notes: 'Reposição de estoque'
  },
  {
    id: 3,
    productId: '7891234567892',
    productName: 'Fone Bluetooth JBL',
    type: 'adjustment',
    quantity: -3,
    reason: 'Ajuste de Inventário',
    date: '2024-01-19',
    user: 'Pedro Admin',
    notes: 'Produtos danificados'
  },
  {
    id: 4,
    productId: '7891234567890',
    productName: 'Smartphone Galaxy S24',
    type: 'entry',
    quantity: 10,
    reason: 'Compra',
    date: '2024-01-15',
    user: 'Maria Estoque',
    notes: 'Nova remessa do fornecedor'
  }
];

const movementTypes = [
  { value: 'entry', label: 'Entrada', icon: Plus, color: 'text-green-600' },
  { value: 'exit', label: 'Saída', icon: Minus, color: 'text-red-600' },
  { value: 'adjustment', label: 'Ajuste', icon: ArrowUpDown, color: 'text-blue-600' },
  { value: 'transfer', label: 'Transferência', icon: ArrowUpDown, color: 'text-purple-600' }
];

const movementReasons = {
  entry: ['Compra', 'Devolução', 'Transferência Recebida', 'Ajuste de Inventário'],
  exit: ['Venda', 'Devolução ao Fornecedor', 'Transferência Enviada', 'Perda/Avaria'],
  adjustment: ['Ajuste de Inventário', 'Correção de Erro', 'Produtos Vencidos', 'Produtos Danificados'],
  transfer: ['Transferência entre Filiais', 'Remanejamento Interno']
};

export function InventoryManagement() {
  const [products, setProducts] = useState(mockProducts);
  const [movements, setMovements] = useState(mockMovements);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isMovementDialogOpen, setIsMovementDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [movementData, setMovementData] = useState({
    type: 'entry',
    quantity: '',
    reason: '',
    notes: ''
  });

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.id.includes(searchTerm);
    const matchesCategory = !selectedCategory || selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (current: number, min: number, max: number): { label: string; color: string } => {
    if (current === 0) return { label: 'Sem Estoque', color: 'bg-red-500' };
    if (current <= min) return { label: 'Estoque Baixo', color: 'bg-orange-500' };
    if (current >= max) return { label: 'Estoque Alto', color: 'bg-blue-500' };
    return { label: 'Normal', color: 'bg-green-500' };
  };

  const handleMovement = () => {
    if (!selectedProduct || !movementData.quantity || !movementData.reason) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    const quantity = parseInt(movementData.quantity);
    const movement = {
      id: Date.now(),
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      type: movementData.type,
      quantity: movementData.type === 'exit' || movementData.type === 'adjustment' && quantity > 0 ? quantity : Math.abs(quantity),
      reason: movementData.reason,
      date: new Date().toISOString().split('T')[0],
      user: 'Usuário Atual',
      notes: movementData.notes
    };

    // Update product stock
    const updatedProducts = products.map(product => {
      if (product.id === selectedProduct.id) {
        let newStock = product.currentStock;
        if (movementData.type === 'entry') {
          newStock += Math.abs(quantity);
        } else if (movementData.type === 'exit') {
          newStock -= Math.abs(quantity);
        } else if (movementData.type === 'adjustment') {
          newStock = quantity; // For adjustments, quantity is the new total
        }
        return { ...product, currentStock: Math.max(0, newStock) };
      }
      return product;
    });

    setProducts(updatedProducts);
    setMovements([movement, ...movements]);
    setIsMovementDialogOpen(false);
    setSelectedProduct(null);
    setMovementData({ type: 'entry', quantity: '', reason: '', notes: '' });
  };

  const getTotalValue = () => {
    return products.reduce((total, product) => total + (product.currentStock * product.averageCost), 0);
  };

  const getLowStockCount = () => {
    return products.filter(product => product.currentStock <= product.minStock).length;
  };

  const getMovementIcon = (type: string): JSX.Element => {
    const movementType = movementTypes.find(mt => mt.value === type);
    return movementType ? <movementType.icon className="h-4 w-4" /> : <Package className="h-4 w-4" />;
  };

  const getMovementColor = (type: string): string => {
    const movementType = movementTypes.find(mt => mt.value === type);
    return movementType ? movementType.color : 'text-gray-600';
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Estoque</h1>
          <p className="text-gray-600">Controle entradas, saídas e movimentações</p>
        </div>
        <Button onClick={() => setIsMovementDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <ArrowUpDown className="h-4 w-4 mr-2" />
          Nova Movimentação
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Warehouse className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Valor Total do Estoque</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(getTotalValue())}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Produtos</p>
                <p className="text-2xl font-bold text-gray-900">{products.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Estoque Baixo</p>
                <p className="text-2xl font-bold text-gray-900">{getLowStockCount()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <ArrowUpDown className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Movimentações Hoje</p>
                <p className="text-2xl font-bold text-gray-900">
                  {movements.filter(m => m.date === new Date().toISOString().split('T')[0]).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Produtos em Estoque</TabsTrigger>
          <TabsTrigger value="movements">Movimentações</TabsTrigger>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Buscar Produto</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Nome ou código..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label>Categoria</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as categorias" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as categorias</SelectItem>
                      <SelectItem value="Eletrônicos">Eletrônicos</SelectItem>
                      <SelectItem value="Roupas">Roupas</SelectItem>
                      <SelectItem value="Casa">Casa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button variant="outline" onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}>
                    Limpar Filtros
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Produtos ({filteredProducts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead>Estoque Atual</TableHead>
                      <TableHead>Min/Max</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Valor Médio</TableHead>
                      <TableHead>Última Movimentação</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => {
                      const status = getStockStatus(product.currentStock, product.minStock, product.maxStock);
                      
                      return (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-gray-900">{product.name}</p>
                              <p className="text-sm text-gray-500">{product.category}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold">{product.currentStock}</span>
                              <span className="text-sm text-gray-500">{product.unit}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>Mín: {product.minStock}</div>
                              <div>Máx: {product.maxStock}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${status.color} text-white`}>
                              {status.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p>{formatCurrency(product.averageCost)}</p>
                              <p className="text-xs text-gray-500">
                                Total: {formatCurrency(product.currentStock * product.averageCost)}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="flex items-center gap-1 text-green-600">
                                <TrendingUp className="h-3 w-3" />
                                <span>Entrada: {formatDate(product.lastEntry)}</span>
                              </div>
                              <div className="flex items-center gap-1 text-red-600">
                                <TrendingDown className="h-3 w-3" />
                                <span>Saída: {formatDate(product.lastExit)}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedProduct(product);
                                setIsMovementDialogOpen(true);
                              }}
                            >
                              Movimentar
                            </Button>
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

        <TabsContent value="movements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Histórico de Movimentações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Produto</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Quantidade</TableHead>
                      <TableHead>Motivo</TableHead>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Observações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {movements.map((movement) => {
                      // const Icon = getMovementIcon(movement.type);
                      const colorClass = getMovementColor(movement.type);
                      
                      return (
                        <TableRow key={movement.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span>{formatDate(movement.date)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium">{movement.productName}</p>
                          </TableCell>
                          <TableCell>
                            <div className={`flex items-center gap-2 ${colorClass}`}>
                              {getMovementIcon(movement.type)}
                              <span className="capitalize">{movementTypes.find(mt => mt.value === movement.type)?.label}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={`font-bold ${colorClass}`}>
                              {movement.type === 'entry' ? '+' : movement.type === 'exit' ? '-' : '±'}{movement.quantity}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{movement.reason}</Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">{movement.user}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-600">{movement.notes || '-'}</span>
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

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Alertas de Estoque
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products.filter(p => p.currentStock <= p.minStock).map((product) => {
                  const status = getStockStatus(product.currentStock, product.minStock, product.maxStock);
                  
                  return (
                    <div key={product.id} className="p-4 border rounded-lg bg-orange-50 border-orange-200">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{product.name}</h4>
                        <Badge className={status.color}>
                          {status.label}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Estoque atual:</span>
                          <p className="font-bold text-orange-600">{product.currentStock} {product.unit}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Estoque mínimo:</span>
                          <p>{product.minStock} {product.unit}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Sugerido repor:</span>
                          <p className="font-bold text-green-600">{product.maxStock - product.currentStock} {product.unit}</p>
                        </div>
                        <div>
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedProduct(product);
                              setMovementData({ ...movementData, type: 'entry', quantity: (product.maxStock - product.currentStock).toString() });
                              setIsMovementDialogOpen(true);
                            }}
                          >
                            Repor Estoque
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {products.filter(p => p.currentStock <= p.minStock).length === 0 && (
                  <div className="text-center py-8 text-green-600">
                    <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhum alerta de estoque no momento!</p>
                    <p className="text-sm">Todos os produtos estão com estoque adequado.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Movement Dialog */}
      <Dialog open={isMovementDialogOpen} onOpenChange={setIsMovementDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Movimentação</DialogTitle>
            <DialogDescription>
              {selectedProduct ? `Produto: ${selectedProduct.name}` : 'Selecione um produto'}
            </DialogDescription>
          </DialogHeader>
          
          {!selectedProduct ? (
            <div className="space-y-4">
              <Label>Selecionar Produto</Label>
              <Select onValueChange={(productId) => {
                const product = products.find(p => p.id === productId);
                setSelectedProduct(product);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha um produto" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} (Estoque: {product.currentStock})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label>Tipo de Movimentação</Label>
                <Select value={movementData.type} onValueChange={(value) => setMovementData({ ...movementData, type: value, reason: '' })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {movementTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <SelectItem key={type.value} value={type.value}>
                          <div className={`flex items-center gap-2 ${type.color}`}>
                            <Icon className="h-4 w-4" />
                            <span>{type.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>
                  {movementData.type === 'adjustment' ? 'Nova Quantidade Total' : 'Quantidade'}
                </Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={movementData.quantity}
                  onChange={(e) => setMovementData({ ...movementData, quantity: e.target.value })}
                />
                {selectedProduct && movementData.type !== 'adjustment' && (
                  <p className="text-xs text-gray-500 mt-1">
                    Estoque atual: {selectedProduct.currentStock} {selectedProduct.unit}
                  </p>
                )}
              </div>

              <div>
                <Label>Motivo</Label>
                <Select value={movementData.reason} onValueChange={(value) => setMovementData({ ...movementData, reason: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o motivo" />
                  </SelectTrigger>
                  <SelectContent>
                    {((movementReasons as any)[movementData.type] || []).map((reason: string) => (
                      <SelectItem key={reason} value={reason}>
                        {reason}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Observações (Opcional)</Label>
                <Textarea
                  placeholder="Adicione observações sobre esta movimentação..."
                  value={movementData.notes}
                  onChange={(e) => setMovementData({ ...movementData, notes: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => {
                  setIsMovementDialogOpen(false);
                  setSelectedProduct(null);
                  setMovementData({ type: 'entry', quantity: '', reason: '', notes: '' });
                }}>
                  Cancelar
                </Button>
                <Button onClick={handleMovement}>
                  Confirmar Movimentação
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}