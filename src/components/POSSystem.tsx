import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  ScanLine, 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  DollarSign, 
  User,
  Search
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import type { Product, Customer, CartItem, PaymentMethod } from '../types';

// Mock products data
const mockProducts: Product[] = [
  { id: '7891234567890', name: 'Smartphone Galaxy', price: 899.99, stock: 15, category: 'Eletrônicos' },
  { id: '7891234567891', name: 'Notebook Dell', price: 2499.90, stock: 8, category: 'Eletrônicos' },
  { id: '7891234567892', name: 'Fone Bluetooth', price: 129.90, stock: 25, category: 'Eletrônicos' },
  { id: '7891234567893', name: 'Camiseta Polo', price: 79.90, stock: 50, category: 'Roupas' },
  { id: '7891234567894', name: 'Tênis Esportivo', price: 249.90, stock: 12, category: 'Roupas' },
  { id: '7891234567895', name: 'Cafeteira Elétrica', price: 199.90, stock: 6, category: 'Casa' }
];

const mockCustomers: Customer[] = [
  { id: 1, name: 'João Silva', cpf: '123.456.789-00', phone: '(11) 99999-1234' },
  { id: 2, name: 'Maria Santos', cpf: '987.654.321-00', phone: '(11) 99999-5678' },
  { id: 3, name: 'Pedro Oliveira', cpf: '456.789.123-00', phone: '(11) 99999-9012' }
];

export function POSSystem(): JSX.Element {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [barcode, setBarcode] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | ''>('');
  const [cashReceived, setCashReceived] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState<boolean>(false);

  const filteredProducts = mockProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.id.includes(searchTerm)
  );

  const addToCart = (product: Product): void => {
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      updateQuantity(product.id, existingItem.quantity + 1);
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId: string, newQuantity: number): void => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(cartItems.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeFromCart = (productId: string): void => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  const clearCart = (): void => {
    setCartItems([]);
    setSelectedCustomer(null);
    setDiscount(0);
  };

  const handleBarcodeSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const product = mockProducts.find(p => p.id === barcode);
    if (product) {
      addToCart(product);
      setBarcode('');
    } else {
      alert('Produto não encontrado!');
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = subtotal * (discount / 100);
  const total = subtotal - discountAmount;
  const change = cashReceived ? Math.max(0, parseFloat(cashReceived) - total) : 0;

  const handlePayment = (): void => {
    if (!paymentMethod) {
      alert('Selecione uma forma de pagamento');
      return;
    }
    if (paymentMethod === 'cash' && (!cashReceived || parseFloat(cashReceived) < total)) {
      alert('Valor recebido insuficiente');
      return;
    }

    // Simulate payment processing
    alert(`Venda realizada com sucesso!\nTotal: R$ ${total.toFixed(2)}\nTroco: R$ ${change.toFixed(2)}`);
    clearCart();
    setPaymentMethod('');
    setCashReceived('');
    setIsPaymentDialogOpen(false);
  };

  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Products and Search */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">PDV - Ponto de Venda</h1>
          <Badge className="bg-green-100 text-green-800">Caixa Aberto</Badge>
        </div>

        {/* Barcode Scanner */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ScanLine className="h-5 w-5" />
              Código de Barras
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleBarcodeSubmit} className="flex gap-2">
              <Input
                placeholder="Digite ou escaneie o código de barras"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                className="flex-1"
                autoComplete="off"
              />
              <Button type="submit">
                <Plus className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Product Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Buscar Produtos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Digite o nome do produto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => addToCart(product)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900 text-sm leading-tight">{product.name}</h4>
                    <Badge variant="outline" className="text-xs ml-2">{product.category}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-green-600">R$ {product.price.toFixed(2)}</span>
                    <span className="text-xs text-gray-500">Estoque: {product.stock}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cart and Checkout */}
      <div className="space-y-4">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Carrinho ({cartItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Customer Selection */}
            <div>
              <Label className="text-sm font-medium">Cliente (Opcional)</Label>
              <Select value={selectedCustomer?.id?.toString() || ''} onValueChange={(value: string) => {
                const customer = mockCustomers.find(c => c.id.toString() === value);
                setSelectedCustomer(customer || null);
              }}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecionar cliente" />
                </SelectTrigger>
                <SelectContent>
                  {mockCustomers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id.toString()}>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <div>
                          <div>{customer.name}</div>
                          <div className="text-xs text-gray-500">{customer.cpf}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Cart Items */}
            <div className="max-h-64 overflow-y-auto space-y-2">
              {cartItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Carrinho vazio</p>
                  <p className="text-xs">Escaneie ou busque produtos</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">R$ {item.price.toFixed(2)} cada</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-6 w-6 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-6 w-6 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeFromCart(item.id)}
                        className="h-6 w-6 p-0 ml-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <>
                <Separator />
                
                {/* Discount */}
                <div className="space-y-2">
                  <Label className="text-sm">Desconto (%)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={discount}
                    onChange={(e) => setDiscount(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                    className="text-center"
                  />
                </div>

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>R$ {subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Desconto ({discount}%):</span>
                      <span>-R$ {discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total:</span>
                    <span>R$ {total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Finalizar Venda
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Finalizar Pagamento</DialogTitle>
                        <DialogDescription>
                          Total: R$ {total.toFixed(2)}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Forma de Pagamento</Label>
                          <Select value={paymentMethod} onValueChange={(value: string) => setPaymentMethod(value as PaymentMethod)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a forma de pagamento" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cash">💵 Dinheiro</SelectItem>
                              <SelectItem value="debit">💳 Cartão de Débito</SelectItem>
                              <SelectItem value="credit">💳 Cartão de Crédito</SelectItem>
                              <SelectItem value="pix">📱 PIX</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {paymentMethod === 'cash' && (
                          <div>
                            <Label>Valor Recebido</Label>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              value={cashReceived}
                              onChange={(e) => setCashReceived(e.target.value)}
                            />
                            {cashReceived && (
                              <p className="text-sm mt-1">
                                Troco: <span className="font-bold">R$ {change.toFixed(2)}</span>
                              </p>
                            )}
                          </div>
                        )}

                        <Button onClick={handlePayment} className="w-full">
                          Confirmar Pagamento
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button variant="outline" onClick={clearCart} className="w-full">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Limpar Carrinho
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}