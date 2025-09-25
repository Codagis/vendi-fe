import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Phone,
  Mail,
  CreditCard,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

// Mock data
const mockCustomers = [
  {
    id: 1,
    name: 'João Silva',
    cpf: '123.456.789-00',
    phone: '(11) 99999-1234',
    email: 'joao.silva@email.com',
    address: 'Rua das Flores, 123, Centro, São Paulo - SP',
    creditLimit: 1000.00,
    usedCredit: 250.00,
    category: 'VIP',
    birthDate: '1985-03-15',
    registrationDate: '2023-01-15',
    totalPurchases: 15420.50,
    lastPurchase: '2024-01-20'
  },
  {
    id: 2,
    name: 'Maria Santos',
    cpf: '987.654.321-00',
    phone: '(11) 99999-5678',
    email: 'maria.santos@email.com',
    address: 'Av. Paulista, 456, Bela Vista, São Paulo - SP',
    creditLimit: 500.00,
    usedCredit: 0.00,
    category: 'Regular',
    birthDate: '1990-07-22',
    registrationDate: '2023-03-10',
    totalPurchases: 3250.80,
    lastPurchase: '2024-01-18'
  },
  {
    id: 3,
    name: 'Pedro Oliveira',
    cpf: '456.789.123-00',
    phone: '(11) 99999-9012',
    email: 'pedro.oliveira@email.com',
    address: 'Rua Augusta, 789, Consolação, São Paulo - SP',
    creditLimit: 2000.00,
    usedCredit: 750.00,
    category: 'Premium',
    birthDate: '1978-12-05',
    registrationDate: '2022-11-20',
    totalPurchases: 28750.00,
    lastPurchase: '2024-01-22'
  },
  {
    id: 4,
    name: 'Ana Costa',
    cpf: '321.654.987-00',
    phone: '(11) 99999-3456',
    email: 'ana.costa@email.com',
    address: 'Alameda Santos, 321, Jardins, São Paulo - SP',
    creditLimit: 0.00,
    usedCredit: 0.00,
    category: 'Novo',
    birthDate: '1995-09-18',
    registrationDate: '2024-01-05',
    totalPurchases: 150.00,
    lastPurchase: '2024-01-15'
  }
];

const customerCategories = ['Novo', 'Regular', 'VIP', 'Premium'];

export function CustomerManagement() {
  const [customers, setCustomers] = useState(mockCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    phone: '',
    email: '',
    address: '',
    creditLimit: '',
    category: 'Regular',
    birthDate: ''
  });

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.cpf.includes(searchTerm) ||
                         customer.phone.includes(searchTerm) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === 'all' || customer.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const resetForm = () => {
    setFormData({
      name: '',
      cpf: '',
      phone: '',
      email: '',
      address: '',
      creditLimit: '',
      category: 'Regular',
      birthDate: ''
    });
    setEditingCustomer(null);
  };

  const handleAddCustomer = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const handleEditCustomer = (customer: any) => {
    setFormData({
      name: customer.name,
      cpf: customer.cpf,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
      creditLimit: customer.creditLimit.toString(),
      category: customer.category,
      birthDate: customer.birthDate
    });
    setEditingCustomer(customer);
    setIsAddDialogOpen(true);
  };

  const handleSaveCustomer = () => {
    if (!formData.name || !formData.cpf || !formData.phone) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    const customerData = {
      ...formData,
      creditLimit: parseFloat(formData.creditLimit) || 0,
      usedCredit: editingCustomer ? editingCustomer.usedCredit : 0,
      registrationDate: editingCustomer ? editingCustomer.registrationDate : new Date().toISOString().split('T')[0],
      totalPurchases: editingCustomer ? editingCustomer.totalPurchases : 0,
      lastPurchase: editingCustomer ? editingCustomer.lastPurchase : null,
      id: editingCustomer ? editingCustomer.id : Date.now()
    };

    if (editingCustomer) {
      setCustomers(customers.map(c => c.id === editingCustomer.id ? customerData : c));
    } else {
      setCustomers([...customers, customerData]);
    }

    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleDeleteCustomer = (customerId: number) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      setCustomers(customers.filter(c => c.id !== customerId));
    }
  };

  const getCategoryBadgeColor = (category: string): string => {
    switch (category) {
      case 'VIP': return 'bg-purple-500';
      case 'Premium': return 'bg-yellow-500';
      case 'Regular': return 'bg-blue-500';
      case 'Novo': return 'bg-green-500';
      default: return 'bg-gray-500';
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Clientes</h1>
          <p className="text-gray-600">Cadastre e gerencie seus clientes</p>
        </div>
        <Button onClick={handleAddCustomer} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Clientes</p>
                <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Crédito Disponível</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(customers.reduce((sum, c) => sum + (c.creditLimit - c.usedCredit), 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Clientes VIP/Premium</p>
                <p className="text-2xl font-bold text-gray-900">
                  {customers.filter(c => c.category === 'VIP' || c.category === 'Premium').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Novos este Mês</p>
                <p className="text-2xl font-bold text-gray-900">
                  {customers.filter(c => {
                    const regDate = new Date(c.registrationDate);
                    const now = new Date();
                    return regDate.getMonth() === now.getMonth() && regDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Nome, CPF, telefone ou e-mail..."
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
                  {customerCategories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
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

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Clientes ({filteredCustomers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Crédito</TableHead>
                  <TableHead>Total Compras</TableHead>
                  <TableHead>Última Compra</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => {
                  const availableCredit = customer.creditLimit - customer.usedCredit;
                  
                  return (
                    <TableRow key={customer.id} className="cursor-pointer hover:bg-gray-50">
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">{customer.name}</p>
                          <p className="text-sm text-gray-500">{customer.cpf}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3 text-gray-400" />
                            <span>{customer.phone}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3 text-gray-400" />
                            <span className="truncate max-w-40">{customer.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getCategoryBadgeColor(customer.category)} text-white`}>
                          {customer.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{formatCurrency(availableCredit)}</p>
                          <p className="text-xs text-gray-500">
                            Limite: {formatCurrency(customer.creditLimit)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{formatCurrency(customer.totalPurchases)}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">
                          {customer.lastPurchase ? formatDate(customer.lastPurchase) : 'Nunca'}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedCustomer(customer)}
                          >
                            Ver
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditCustomer(customer)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteCustomer(customer.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Customer Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCustomer ? 'Editar Cliente' : 'Novo Cliente'}
            </DialogTitle>
            <DialogDescription>
              Preencha as informações do cliente
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nome Completo *</Label>
              <Input
                placeholder="Digite o nome completo"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>CPF/CNPJ *</Label>
              <Input
                placeholder="000.000.000-00"
                value={formData.cpf}
                onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Telefone *</Label>
              <Input
                placeholder="(11) 99999-9999"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input
                type="email"
                placeholder="cliente@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Data de Nascimento</Label>
              <Input
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {customerCategories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Limite de Crédito</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.creditLimit}
                onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label>Endereço</Label>
              <Input
                placeholder="Rua, número, bairro, cidade - UF"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveCustomer}>
              {editingCustomer ? 'Salvar Alterações' : 'Cadastrar Cliente'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Customer Details Dialog */}
      {selectedCustomer && (
        <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {selectedCustomer.name}
              </DialogTitle>
              <DialogDescription>
                Informações detalhadas do cliente
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">Informações</TabsTrigger>
                <TabsTrigger value="purchases">Compras</TabsTrigger>
                <TabsTrigger value="credit">Crédito</TabsTrigger>
              </TabsList>
              <TabsContent value="info" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">CPF/CNPJ</Label>
                    <p className="mt-1">{selectedCustomer.cpf}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Categoria</Label>
                    <p className="mt-1">
                      <Badge className={`${getCategoryBadgeColor(selectedCustomer.category)} text-white`}>
                        {selectedCustomer.category}
                      </Badge>
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Telefone</Label>
                    <p className="mt-1">{selectedCustomer.phone}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">E-mail</Label>
                    <p className="mt-1">{selectedCustomer.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Data de Nascimento</Label>
                    <p className="mt-1">{formatDate(selectedCustomer.birthDate)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Cliente Desde</Label>
                    <p className="mt-1">{formatDate(selectedCustomer.registrationDate)}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-sm font-medium text-gray-500">Endereço</Label>
                    <p className="mt-1">{selectedCustomer.address}</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="purchases" className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                          {formatCurrency(selectedCustomer.totalPurchases)}
                        </p>
                        <p className="text-sm text-gray-500">Total em Compras</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">
                          {selectedCustomer.lastPurchase ? formatDate(selectedCustomer.lastPurchase) : 'Nunca'}
                        </p>
                        <p className="text-sm text-gray-500">Última Compra</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">
                          {formatCurrency(selectedCustomer.totalPurchases / Math.max(1, 
                            Math.floor((new Date().getTime() - new Date(selectedCustomer.registrationDate).getTime()) / (1000 * 60 * 60 * 24 * 30))
                          ))}
                        </p>
                        <p className="text-sm text-gray-500">Ticket Médio/Mês</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="credit" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">
                          {formatCurrency(selectedCustomer.creditLimit)}
                        </p>
                        <p className="text-sm text-gray-500">Limite Total</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-red-600">
                          {formatCurrency(selectedCustomer.usedCredit)}
                        </p>
                        <p className="text-sm text-gray-500">Crédito Utilizado</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                          {formatCurrency(selectedCustomer.creditLimit - selectedCustomer.usedCredit)}
                        </p>
                        <p className="text-sm text-gray-500">Crédito Disponível</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-orange-600">
                          {selectedCustomer.creditLimit > 0 
                            ? `${((selectedCustomer.usedCredit / selectedCustomer.creditLimit) * 100).toFixed(1)}%`
                            : '0%'
                          }
                        </p>
                        <p className="text-sm text-gray-500">% Utilizado</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}