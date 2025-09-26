import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { 
  Shield, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  RefreshCw
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Switch } from './ui/switch';
import { Checkbox } from './ui/checkbox';
import { Textarea } from './ui/textarea';
import { apiService, type Perfil, type Permissao } from '../services/api';
import { notificationService } from '../services/notificationService';
import { useTokenPermissions } from '../hooks/useTokenPermissions';

export function PerfilManagement() {
  const { hasPermission } = useTokenPermissions();
  const [perfis, setPerfis] = useState<Perfil[]>([]);
  const [permissoes, setPermissoes] = useState<Permissao[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPerfil, setEditingPerfil] = useState<Perfil | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    codigo: '',
    descricao: '',
    ativo: true,
    sistema: false,
    permissaoIds: [] as number[]
  });

  // Verificar se o usuário tem permissão para acessar esta tela
  if (!hasPermission('perfis')) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Acesso Negado</h3>
          <p className="text-gray-500">Você não tem permissão para acessar esta funcionalidade.</p>
        </div>
      </div>
    );
  }

  // Carregar dados ao montar o componente
  useEffect(() => {
    loadPerfis();
    loadPermissoes();
  }, []);

  // Debounce para busca por texto
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadPerfis();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const loadPerfis = async () => {
    setIsLoading(true);
    try {
      const perfisData = await apiService.getPerfis();
      setPerfis(perfisData);
    } catch (error) {
      console.error('Erro ao carregar perfis:', error);
      setPerfis([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPermissoes = async () => {
    try {
      const permissoesData = await apiService.getPermissoesAtivas();
      setPermissoes(permissoesData);
    } catch (error) {
      console.error('Erro ao carregar permissões:', error);
      setPermissoes([]);
    }
  };


  // Filtrar perfis por termo de busca
  const filteredPerfis = perfis.filter(perfil => 
    perfil.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    perfil.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (perfil.descricao && perfil.descricao.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const resetForm = () => {
    setFormData({
      nome: '',
      codigo: '',
      descricao: '',
      ativo: true,
      sistema: false,
      permissaoIds: []
    });
    setEditingPerfil(null);
  };

  const handleAddPerfil = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const handleEditPerfil = (perfil: Perfil) => {
    setFormData({
      nome: perfil.nome,
      codigo: perfil.codigo,
      descricao: perfil.descricao || '',
      ativo: perfil.ativo,
      sistema: perfil.sistema,
      permissaoIds: perfil.permissoes?.map(p => p.id) || []
    });
    setEditingPerfil(perfil);
    setIsAddDialogOpen(true);
  };

  const handleSavePerfil = async () => {
    if (!formData.nome || !formData.codigo) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      const perfilData: any = {
        nome: formData.nome,
        codigo: formData.codigo,
        descricao: formData.descricao,
        ativo: formData.ativo,
        sistema: formData.sistema,
        permissaoIds: formData.permissaoIds
      };

      if (editingPerfil) {
        await apiService.updatePerfil(editingPerfil.id, perfilData);
      } else {
        await apiService.createPerfil(perfilData);
      }

      await loadPerfis();
      setIsAddDialogOpen(false);
      resetForm();
      notificationService.showSuccess('Perfil salvo com sucesso!');
    } catch (error: any) {
      console.error('Erro ao salvar perfil:', error);
    }
  };

  const handleDeletePerfil = async (perfilId: number) => {
    if (confirm('Tem certeza que deseja excluir este perfil?')) {
      try {
        await apiService.deletePerfil(perfilId);
        await loadPerfis();
        notificationService.showSuccess('Perfil excluído com sucesso!');
      } catch (error: any) {
        console.error('Erro ao deletar perfil:', error);
      }
    }
  };

  const togglePerfilStatus = async (perfilId: number) => {
    try {
      const perfil = perfis.find(p => p.id === perfilId);
      if (perfil) {
        await apiService.alterarStatusPerfil(perfilId, !perfil.ativo);
        await loadPerfis();
        notificationService.showSuccess(`Perfil ${!perfil.ativo ? 'ativado' : 'desativado'} com sucesso!`);
      }
    } catch (error: any) {
      console.error('Erro ao alterar status do perfil:', error);
    }
  };

  const handlePermissionChange = (permissaoId: number, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        permissaoIds: [...formData.permissaoIds, permissaoId]
      });
    } else {
      setFormData({
        ...formData,
        permissaoIds: formData.permissaoIds.filter(id => id !== permissaoId)
      });
    }
  };

  const getStatusColor = (ativo: boolean): string => {
    return ativo ? 'bg-green-500' : 'bg-red-500';
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Group permissions by category
  const permissionsByCategory = permissoes.reduce((acc: any, permissao: Permissao) => {
    if (!acc[permissao.categoria]) {
      acc[permissao.categoria] = [];
    }
    acc[permissao.categoria].push(permissao);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Perfis</h1>
          <p className="text-gray-600">Gerencie perfis e suas permissões no sistema</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={loadPerfis} 
            variant="outline" 
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button onClick={handleAddPerfil} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Novo Perfil
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label>Buscar</Label>
              <div className="relative">
                {isLoading ? (
                  <div className="absolute left-3 top-3 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
                ) : (
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                )}
                <Input
                  placeholder="Buscar por nome, código ou descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="flex items-end">
              <Button variant="outline" onClick={() => setSearchTerm('')}>
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Perfis Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Perfis ({filteredPerfis.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Perfil</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Permissões</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                        <span>Carregando perfis...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredPerfis.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      Nenhum perfil encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPerfis.map((perfil) => (
                    <TableRow key={perfil.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">{perfil.nome}</p>
                          <p className="text-sm text-gray-500">{perfil.codigo}</p>
                          {perfil.descricao && (
                            <p className="text-sm text-gray-500">{perfil.descricao}</p>
                          )}
                          {perfil.sistema && (
                            <Badge className="bg-red-500 text-white text-xs mt-1">
                              Sistema
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getStatusColor(perfil.ativo)} text-white`}>
                            {perfil.ativo ? 'Ativo' : 'Inativo'}
                          </Badge>
                          <Switch
                            checked={perfil.ativo}
                            onCheckedChange={() => togglePerfilStatus(perfil.id)}
                            disabled={perfil.sistema}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {perfil.permissoes?.length || 0} permissões
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{formatDate(perfil.createdAt)}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditPerfil(perfil)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeletePerfil(perfil.id)}
                            className="text-red-600 hover:text-red-700"
                            disabled={perfil.sistema}
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

      {/* Add/Edit Perfil Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPerfil ? 'Editar Perfil' : 'Novo Perfil'}
            </DialogTitle>
            <DialogDescription>
              Preencha as informações do perfil e defina suas permissões
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label>Nome do Perfil *</Label>
                <Input
                  placeholder="Digite o nome do perfil"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
              </div>
              
              <div>
                <Label>Código *</Label>
                <Input
                  placeholder="Digite o código do perfil"
                  value={formData.codigo}
                  onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                />
              </div>
              
              <div>
                <Label>Descrição</Label>
                <Textarea
                  placeholder="Digite a descrição do perfil"
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
                <Label htmlFor="ativo">Ativo</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="sistema"
                  checked={formData.sistema}
                  onCheckedChange={(checked) => setFormData({ ...formData, sistema: checked })}
                />
                <Label htmlFor="sistema">Perfil do Sistema</Label>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Permissões</Label>
                <p className="text-sm text-gray-500 mb-4">
                  Selecione as permissões que este perfil terá acesso
                </p>
                
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {Object.entries(permissionsByCategory).map(([category, permissions]) => (
                    <div key={category} className="space-y-2">
                      <h4 className="font-medium text-gray-900 text-sm">{category}</h4>
                      <div className="space-y-2 pl-4">
                        {(permissions as Permissao[]).map((permissao) => (
                          <div key={permissao.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={permissao.id.toString()}
                              checked={formData.permissaoIds.includes(permissao.id)}
                              onCheckedChange={(checked: any) => handlePermissionChange(permissao.id, checked)}
                            />
                            <Label 
                              htmlFor={permissao.id.toString()}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {permissao.nome}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSavePerfil}>
              {editingPerfil ? 'Salvar Alterações' : 'Criar Perfil'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
