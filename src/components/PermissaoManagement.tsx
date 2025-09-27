import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { 
  Key, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  RefreshCw,
  Filter,
  Eye,
  EyeOff
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Switch } from './ui/switch';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { apiService, type Permissao } from '../services/api';
import { notificationService } from '../services/notificationService';
import { useTokenPermissions } from '../hooks/useTokenPermissions';

export function PermissaoManagement() {
  const { hasPermission } = useTokenPermissions();
  const [permissoes, setPermissoes] = useState<Permissao[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPermissao, setEditingPermissao] = useState<Permissao | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    chave: '',
    nome: '',
    descricao: '',
    categoria: '',
    ativo: true
  });

  if (!hasPermission('permissoes')) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Key className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Acesso Negado</h3>
          <p className="text-gray-500">Você não tem permissão para acessar esta funcionalidade.</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    loadPermissoes();
    loadCategorias();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadPermissoes();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCategory]);

  const loadPermissoes = async () => {
    setIsLoading(true);
    try {
      let permissoesData: Permissao[];
      
      if (selectedCategory === 'all') {
        permissoesData = await apiService.getPermissoes();
      } else {
        permissoesData = await apiService.getPermissoesPorCategoria(selectedCategory);
      }
      
      setPermissoes(permissoesData);
    } catch (error) {
      console.error('Erro ao carregar permissões:', error);
      setPermissoes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategorias = async () => {
    try {
      const categoriasData = await apiService.getCategoriasPermissoes();
      setCategorias(categoriasData);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      setCategorias([]);
    }
  };

  const filteredPermissoes = permissoes.filter(permissao => 
    permissao.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    permissao.chave.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (permissao.descricao && permissao.descricao.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const resetForm = () => {
    setFormData({
      chave: '',
      nome: '',
      descricao: '',
      categoria: '',
      ativo: true
    });
    setEditingPermissao(null);
  };

  const handleAddPermissao = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const handleEditPermissao = (permissao: Permissao) => {
    setFormData({
      chave: permissao.chave,
      nome: permissao.nome,
      descricao: permissao.descricao || '',
      categoria: permissao.categoria,
      ativo: permissao.ativo
    });
    setEditingPermissao(permissao);
    setIsAddDialogOpen(true);
  };

  const handleSavePermissao = async () => {
    if (!formData.chave || !formData.nome || !formData.categoria) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      const permissaoData: any = {
        chave: formData.chave,
        nome: formData.nome,
        descricao: formData.descricao,
        categoria: formData.categoria,
        ativo: formData.ativo
      };

      if (editingPermissao) {
        await apiService.updatePermissao(editingPermissao.id, permissaoData);
      } else {
        await apiService.createPermissao(permissaoData);
      }

      await loadPermissoes();
      await loadCategorias();
      setIsAddDialogOpen(false);
      resetForm();
      notificationService.showSuccess('Permissão salva com sucesso!');
    } catch (error: any) {
      console.error('Erro ao salvar permissão:', error);
    }
  };

  const handleDeletePermissao = async (permissaoId: number) => {
    if (confirm('Tem certeza que deseja excluir esta permissão?')) {
      try {
        await apiService.deletePermissao(permissaoId);
        await loadPermissoes();
        await loadCategorias();
        notificationService.showSuccess('Permissão excluída com sucesso!');
      } catch (error: any) {
        console.error('Erro ao deletar permissão:', error);
      }
    }
  };

  const togglePermissaoStatus = async (permissaoId: number) => {
    try {
      const permissao = permissoes.find(p => p.id === permissaoId);
      if (permissao) {
        await apiService.alterarStatusPermissao(permissaoId, !permissao.ativo);
        await loadPermissoes();
        notificationService.showSuccess(`Permissão ${!permissao.ativo ? 'ativada' : 'desativada'} com sucesso!`);
      }
    } catch (error: any) {
      console.error('Erro ao alterar status da permissão:', error);
    }
  };

  const getStatusColor = (ativo: boolean): string => {
    return ativo ? 'bg-green-500' : 'bg-red-500';
  };

  const getCategoryColor = (categoria: string): string => {
    const colors: { [key: string]: string } = {
      'Sistema': 'bg-blue-500',
      'Vendas': 'bg-green-500',
      'Cadastros': 'bg-purple-500',
      'Operações': 'bg-orange-500',
      'Financeiro': 'bg-yellow-500',
      'Relatórios': 'bg-pink-500'
    };
    return colors[categoria] || 'bg-gray-500';
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Permissões</h1>
          <p className="text-gray-600">Gerencie as permissões do sistema</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={loadPermissoes} 
            variant="outline" 
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button onClick={handleAddPermissao} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Nova Permissão
          </Button>
        </div>
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
                {isLoading ? (
                  <div className="absolute left-3 top-3 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
                ) : (
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                )}
                <Input
                  placeholder="Buscar por nome, chave ou descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  disabled={isLoading}
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
                  {categorias.map(categoria => (
                    <SelectItem key={categoria} value={categoria}>
                      {categoria}
                    </SelectItem>
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

      {/* Permissões Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Permissões ({filteredPermissoes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Permissão</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Criada em</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                        <span>Carregando permissões...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredPermissoes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      Nenhuma permissão encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPermissoes.map((permissao) => (
                    <TableRow key={permissao.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">{permissao.nome}</p>
                          <p className="text-sm text-gray-500">{permissao.chave}</p>
                          {permissao.descricao && (
                            <p className="text-sm text-gray-500">{permissao.descricao}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getCategoryColor(permissao.categoria)} text-white`}>
                          {permissao.categoria}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getStatusColor(permissao.ativo)} text-white`}>
                            {permissao.ativo ? 'Ativa' : 'Inativa'}
                          </Badge>
                          <Switch
                            checked={permissao.ativo}
                            onCheckedChange={() => togglePermissaoStatus(permissao.id)}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{formatDate(permissao.createdAt)}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditPermissao(permissao)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeletePermissao(permissao.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Permissão Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingPermissao ? 'Editar Permissão' : 'Nova Permissão'}
            </DialogTitle>
            <DialogDescription>
              Preencha as informações da permissão
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Chave *</Label>
                <Input
                  placeholder="Ex: dashboard, pos, products"
                  value={formData.chave}
                  onChange={(e) => setFormData({ ...formData, chave: e.target.value })}
                />
              </div>
              
              <div>
                <Label>Nome *</Label>
                <Input
                  placeholder="Ex: Dashboard, PDV - Vendas, Produtos"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
              </div>
            </div>
            
            <div>
              <Label>Categoria *</Label>
              <Select value={formData.categoria} onValueChange={(value) => setFormData({ ...formData, categoria: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map(categoria => (
                    <SelectItem key={categoria} value={categoria}>
                      {categoria}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Descrição</Label>
              <Textarea
                placeholder="Descreva o que esta permissão permite fazer"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                rows={3}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="ativo"
                checked={formData.ativo}
                onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
              />
              <Label htmlFor="ativo">Ativa</Label>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSavePermissao}>
              {editingPermissao ? 'Salvar Alterações' : 'Criar Permissão'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
