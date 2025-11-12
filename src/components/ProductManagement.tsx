import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Barcode,
  Image as ImageIcon,
  Filter
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { MenuButton } from './ui/menu-button';

const mockProducts = [
  {
    id: '7891234567890',
    name: 'Smartphone Galaxy S24',
    description: 'Smartphone com tela de 6.1 polegadas, 128GB de armazenamento',
    category: 'Eletrônicos',
    unit: 'UN',
    costPrice: 650.00,
    salePrice: 899.99,
    stock: 15,
    minStock: 5,
    supplier: 'Samsung Electronics',
    image: null
  },
  {
    id: '7891234567891',
    name: 'Notebook Dell Inspiron',
    description: 'Notebook com processador Intel i5, 8GB RAM, 256GB SSD',
    category: 'Eletrônicos',
    unit: 'UN',
    costPrice: 1800.00,
    salePrice: 2499.90,
    stock: 8,
    minStock: 3,
    supplier: 'Dell Technologies',
    image: null
  },
  {
    id: '7891234567892',
    name: 'Fone Bluetooth JBL',
    description: 'Fone de ouvido sem fio com cancelamento de ruído',
    category: 'Eletrônicos',
    unit: 'UN',
    costPrice: 80.00,
    salePrice: 129.90,
    stock: 25,
    minStock: 10,
    supplier: 'JBL Audio',
    image: null
  },
  {
    id: '7891234567893',
    name: 'Camiseta Polo Básica',
    description: 'Camiseta polo 100% algodão, disponível em várias cores',
    category: 'Roupas',
    unit: 'UN',
    costPrice: 35.00,
    salePrice: 79.90,
    stock: 50,
    minStock: 20,
    supplier: 'Confecções ABC',
    image: null
  }
];

const categories = ['Eletrônicos', 'Roupas', 'Casa', 'Alimentação', 'Esportes', 'Livros'];
const units = ['UN', 'KG', 'L', 'M', 'PC', 'CX'];

interface ProductManagementProps {
  onToggleSidebar?: () => void;
}

export function ProductManagement({ onToggleSidebar }: ProductManagementProps) {
  const [products, setProducts] = useState(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    category: '',
    unit: 'UN',
    costPrice: '',
    salePrice: '',
    stock: '',
    minStock: '',
    supplier: '',
    image: null
  });

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.id.includes(searchTerm) ||
                         product.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      description: '',
      category: '',
      unit: 'UN',
      costPrice: '',
      salePrice: '',
      stock: '',
      minStock: '',
      supplier: '',
      image: null
    });
    setEditingProduct(null);
  };

  const handleAddProduct = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const handleEditProduct = (product: any) => {
    setFormData({
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.category,
      unit: product.unit,
      costPrice: product.costPrice.toString(),
      salePrice: product.salePrice.toString(),
      stock: product.stock.toString(),
      minStock: product.minStock.toString(),
      supplier: product.supplier,
      image: product.image
    });
    setEditingProduct(product);
    setIsAddDialogOpen(true);
  };

  const handleSaveProduct = () => {
    if (!formData.name || !formData.category || !formData.salePrice) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    const productData = {
      ...formData,
      costPrice: parseFloat(formData.costPrice) || 0,
      salePrice: parseFloat(formData.salePrice),
      stock: parseInt(formData.stock) || 0,
      minStock: parseInt(formData.minStock) || 0,
      id: formData.id || `789${Date.now()}`
    };

    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? productData : p));
    } else {
      setProducts([...products, productData]);
    }

    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  const getStockStatus = (stock: number, minStock: number): { label: string; color: string } => {
    if (stock === 0) return { label: 'Sem Estoque', color: 'bg-red-500' };
    if (stock <= minStock) return { label: 'Estoque Baixo', color: 'bg-orange-500' };
    return { label: 'Normal', color: 'bg-green-500' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <MenuButton onToggleSidebar={onToggleSidebar} />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestão de Produtos</h1>
            <p className="text-gray-600">Cadastre e gerencie produtos do seu estoque</p>
          </div>
        </div>
        <Button onClick={handleAddProduct} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Novo Produto
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Nome, código ou fornecedor..."
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
                  {categories.map(category => (
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
                  <TableHead>Código</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Estoque</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product.stock, product.minStock);
                  const profit = product.salePrice - product.costPrice;
                  const profitMargin = product.costPrice > 0 ? (profit / product.costPrice) * 100 : 0;
                  
                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            {product.image ? (
                              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                <ImageIcon className="h-5 w-5 text-gray-400" />
                              </div>
                            ) : (
                              <ImageIcon className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-500">{product.supplier}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Barcode className="h-4 w-4 text-gray-400" />
                          <span className="font-mono text-sm">{product.id}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">R$ {product.salePrice.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">
                            Custo: R$ {product.costPrice.toFixed(2)}
                          </p>
                          <p className="text-xs text-green-600">
                            Margem: {profitMargin.toFixed(1)}%
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{product.stock} {product.unit}</p>
                          <p className="text-xs text-gray-500">Mín: {product.minStock}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${stockStatus.color} text-white`}>
                          {stockStatus.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteProduct(product.id)}
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

      {/* Add/Edit Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto custom-scroll">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Editar Produto' : 'Novo Produto'}
            </DialogTitle>
            <DialogDescription>
              Preencha as informações do produto
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nome do Produto *</Label>
              <Input
                placeholder="Digite o nome do produto"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Código de Barras</Label>
              <Input
                placeholder="Deixe em branco para gerar automaticamente"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label>Descrição</Label>
              <Textarea
                placeholder="Descrição detalhada do produto"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Categoria *</Label>
              <Select value={formData.category} onValueChange={(value: string) => setFormData({ ...formData, category: value })}>
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
              <Label>Unidade</Label>
              <Select value={formData.unit} onValueChange={(value: string) => setFormData({ ...formData, unit: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {units.map(unit => (
                    <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Preço de Custo</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.costPrice}
                onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Preço de Venda *</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.salePrice}
                onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Estoque Atual</Label>
              <Input
                type="number"
                placeholder="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Estoque Mínimo</Label>
              <Input
                type="number"
                placeholder="0"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label>Fornecedor</Label>
              <Input
                placeholder="Nome do fornecedor"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveProduct}>
              {editingProduct ? 'Salvar Alterações' : 'Cadastrar Produto'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}