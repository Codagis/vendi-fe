import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { 
  Store, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  RefreshCw,
  MapPin,
  Phone,
  Building2,
  Calendar,
  FileText,
  Hash,
  Menu
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Switch } from './ui/switch';
import { ConfirmationDialog } from './ui/confirmation-dialog';
import { FormField, FormInput, FormSelect } from './ui/form-field';
import { apiService } from '../services/api';
import { notificationService } from '../services/notificationService';
import { Loja, LojaStats, Empresa } from '../types';
import { 
  formatPhone, 
  formatCEP, 
  removeMask,
  validatePhone,
  validateCEP
} from '../utils/masks';
import { ESTADOS_BRASILEIROS } from '../utils/estados';

interface LojaManagementProps {
  onToggleSidebar?: () => void;
}

export function LojaManagement({ onToggleSidebar }: LojaManagementProps) {
  const [lojas, setLojas] = useState<Loja[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [stats, setStats] = useState<LojaStats | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedEmpresa, setSelectedEmpresa] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingLoja, setEditingLoja] = useState<Loja | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [lojaToDelete, setLojaToDelete] = useState<Loja | null>(null);

  const [formData, setFormData] = useState({
    nome: '',
    codigo: '',
    descricao: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: '',
    cep: '',
    telefone: '',
    empresaId: 0,
    ativo: true
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadStats();
    loadEmpresas();
    loadLojas();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() || selectedStatus !== 'all' || selectedEmpresa !== 'all') {
      const timeoutId = setTimeout(() => {
        loadLojas();
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      loadLojas();
    }
  }, [searchTerm, selectedStatus, selectedEmpresa]);

  const loadStats = async () => {
    try {
      const statsData = await apiService.getLojaStats();
      setStats(statsData);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      setStats({
        totalLojas: 0,
        lojasAtivas: 0,
        lojasInativas: 0,
        totalUsuarios: 0,
        totalEmpresas: 0
      });
    }
  };

  const loadEmpresas = async () => {
    try {
      const empresasData = await apiService.getEmpresas();
      setEmpresas(empresasData);
    } catch (error) {
      console.error('Erro ao carregar empresas:', error);
      setEmpresas([]);
    }
  };

  const loadLojas = async () => {
    setIsLoading(true);
    try {
      let filters: any = undefined;
      
      // Só criar filtros se houver busca, status ou empresa específica
      if (searchTerm.trim() || selectedStatus !== 'all' || selectedEmpresa !== 'all') {
        filters = {};
        
        if (searchTerm.trim()) {
          filters.nome = searchTerm;
          filters.codigo = searchTerm;
        }
        
        if (selectedStatus !== 'all') {
          filters.ativo = selectedStatus === 'active';
        }

        if (selectedEmpresa !== 'all') {
          filters.empresaId = parseInt(selectedEmpresa);
        }
      }

      const lojasData = await apiService.getLojas(filters);
      setLojas(lojasData);
      
      if (!searchTerm.trim() && selectedStatus === 'all' && selectedEmpresa === 'all') {
        loadStats();
      }
    } catch (error) {
      console.error('Erro ao carregar lojas:', error);
      setLojas([]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      codigo: '',
      descricao: '',
      endereco: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      uf: '',
      cep: '',
      telefone: '',
      empresaId: 0,
      ativo: true
    });
    setEditingLoja(null);
    setValidationErrors({});
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Validação de campos obrigatórios
    if (!formData.nome.trim()) {
      errors.nome = 'Nome da loja é obrigatório';
    }

    if (!formData.codigo.trim()) {
      errors.codigo = 'Código da loja é obrigatório';
    }

    if (formData.empresaId === 0) {
      errors.empresaId = 'Empresa é obrigatória';
    }

    // Validação de telefone se preenchido
    if (formData.telefone.trim() && !validatePhone(formData.telefone)) {
      errors.telefone = 'Telefone inválido';
    }

    // Validação de CEP se preenchido
    if (formData.cep.trim() && !validateCEP(formData.cep)) {
      errors.cep = 'CEP inválido';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const clearFieldError = (fieldName: string) => {
    if (validationErrors[fieldName]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const handleAddLoja = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const handleEditLoja = (loja: Loja) => {
    setFormData({
      nome: loja.nome,
      codigo: loja.codigo,
      descricao: loja.descricao || '',
      endereco: loja.endereco || '',
      numero: loja.numero || '',
      complemento: loja.complemento || '',
      bairro: loja.bairro || '',
      cidade: loja.cidade || '',
      uf: loja.uf || '',
      cep: loja.cep ? formatCEP(loja.cep) : '',
      telefone: loja.telefone ? formatPhone(loja.telefone) : '',
      empresaId: loja.empresaId,
      ativo: loja.ativo
    });
    setEditingLoja(loja);
    setValidationErrors({});
    setIsAddDialogOpen(true);
  };

  const handleDeleteLoja = (loja: Loja) => {
    setLojaToDelete(loja);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteLoja = async () => {
    if (!lojaToDelete) return;

    try {
      await apiService.deleteLoja(lojaToDelete.id);
      notificationService.showSuccess('Loja excluída com sucesso!');
      loadLojas();
      loadStats();
    } catch (error) {
      console.error('Erro ao excluir loja:', error);
      notificationService.showError('Erro ao excluir loja');
    } finally {
      setIsDeleteDialogOpen(false);
      setLojaToDelete(null);
    }
  };

  const cancelDeleteLoja = () => {
    setIsDeleteDialogOpen(false);
    setLojaToDelete(null);
  };

  const handleSaveLoja = async () => {
    if (!validateForm()) {
      notificationService.showError('Por favor, corrija os erros nos campos obrigatórios');
      return;
    }

    try {
      // Preparar dados para envio (remover máscaras)
      const dadosParaEnvio = {
        ...formData,
        telefone: removeMask(formData.telefone),
        cep: removeMask(formData.cep)
      };

      if (editingLoja) {
        await apiService.updateLoja(editingLoja.id, dadosParaEnvio);
      } else {
        await apiService.createLoja(dadosParaEnvio);
      }

      await loadLojas();
      setIsAddDialogOpen(false);
      resetForm();
      notificationService.showSuccess('Loja salva com sucesso!');
    } catch (error: any) {
      console.error('Erro ao salvar loja:', error);
      notificationService.showError(error.response?.data?.message || 'Erro ao salvar loja');
    }
  };

  const toggleLojaStatus = async (lojaId: number) => {
    try {
      const loja = lojas.find(l => l.id === lojaId);
      if (loja) {
        await apiService.alterarStatusLoja(lojaId, !loja.ativo);
        await loadLojas();
        notificationService.showSuccess(`Loja ${!loja.ativo ? 'ativada' : 'desativada'} com sucesso!`);
      }
    } catch (error: any) {
      console.error('Erro ao alterar status da loja:', error);
      notificationService.showError('Erro ao alterar status da loja');
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCEP = (cep: string): string => {
    return cep.replace(/^(\d{5})(\d{3})$/, '$1-$2');
  };

  const formatPhone = (phone: string): string => {
    if (phone.length === 11) {
      return phone.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    } else if (phone.length === 10) {
      return phone.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
    }
    return phone;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onToggleSidebar && (
            <Button
              variant="outline"
              size="icon"
              onClick={onToggleSidebar}
              className="h-10 w-10"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestão de Lojas</h1>
            <p className="text-gray-600">Gerencie as lojas/filiais do sistema</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={loadLojas} 
            variant="outline" 
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button onClick={handleAddLoja} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Nova Loja
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Store className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Lojas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.totalLojas ?? 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Store className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Lojas Ativas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.lojasAtivas ?? 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Store className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Lojas Inativas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.lojasInativas ?? 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Empresas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.totalEmpresas ?? 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Usuários</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.totalUsuarios ?? 0}
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Buscar</Label>
              <div className="relative">
                {isLoading ? (
                  <div className="absolute left-3 top-3 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
                ) : (
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                )}
                <Input
                  placeholder="Buscar por nome ou código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Empresa</Label>
              <Select value={selectedEmpresa} onValueChange={setSelectedEmpresa}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as empresas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as empresas</SelectItem>
                  {empresas.map((empresa) => (
                    <SelectItem key={empresa.id} value={empresa.id.toString()}>
                      {empresa.razaoSocial}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" onClick={() => { 
                setSearchTerm(''); 
                setSelectedStatus('all'); 
                setSelectedEmpresa('all'); 
              }}>
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lojas Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Lojas ({lojas.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Loja</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Cadastrado em</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                        <span>Carregando lojas...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : !Array.isArray(lojas) || lojas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      Nenhuma loja encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  Array.isArray(lojas) && lojas.map((loja) => (
                    <TableRow key={loja.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Store className="w-6 h-6 text-gray-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{loja.nome}</p>
                            {loja.descricao && (
                              <p className="text-sm text-gray-500">{loja.descricao}</p>
                            )}
                            {loja.enderecoCompleto && (
                              <p className="text-sm text-gray-500 flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {loja.enderecoCompleto}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Hash className="h-3 w-3 text-gray-400" />
                          <p className="font-mono text-sm">{loja.codigo}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-gray-900">{loja.empresaRazaoSocial}</p>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {loja.telefone && (
                            <p className="text-sm flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {formatPhone(loja.telefone)}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge className={`${loja.ativo ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                            {loja.ativo ? 'Ativo' : 'Inativo'}
                          </Badge>
                          <Switch
                            checked={loja.ativo}
                            onCheckedChange={() => toggleLojaStatus(loja.id)}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {loja.createdAt ? formatDate(loja.createdAt) : 'N/A'}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditLoja(loja)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteLoja(loja)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )) || null
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Loja Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="!max-w-4xl max-h-[90vh] overflow-y-auto custom-scroll sm:!max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {editingLoja ? 'Editar Loja' : 'Nova Loja'}
            </DialogTitle>
            <DialogDescription>
              Preencha as informações da loja
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-8">
            {/* Seção de Informações Básicas */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Informações Básicas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <FormInput
                    label="Nome da Loja"
                    required
                    placeholder="Digite o nome da loja"
                    value={formData.nome}
                    onChange={(e) => {
                      clearFieldError('nome');
                      setFormData({ ...formData, nome: e.target.value });
                    }}
                    error={validationErrors.nome}
                  />
                  
                  <FormInput
                    label="Código da Loja"
                    required
                    placeholder="Ex: 001, MATRIZ, etc."
                    value={formData.codigo}
                    onChange={(e) => {
                      clearFieldError('codigo');
                      setFormData({ ...formData, codigo: e.target.value });
                    }}
                    error={validationErrors.codigo}
                  />
                  
                  <FormField label="Empresa" required>
                    <Select 
                      value={formData.empresaId.toString()} 
                      onValueChange={(value) => {
                        clearFieldError('empresaId');
                        setFormData({ ...formData, empresaId: parseInt(value) });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a empresa" />
                      </SelectTrigger>
                      <SelectContent>
                        {empresas.map((empresa) => (
                          <SelectItem key={empresa.id} value={empresa.id.toString()}>
                            {empresa.razaoSocial}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {validationErrors.empresaId && (
                      <p className="text-sm text-red-600 mt-1">{validationErrors.empresaId}</p>
                    )}
                  </FormField>
                </div>
                
                <div className="space-y-6">
                  <FormInput
                    label="Descrição"
                    placeholder="Descrição da loja (opcional)"
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  />
                  
                  <FormInput
                    label="Telefone"
                    placeholder="(00) 00000-0000"
                    value={formData.telefone}
                    onChange={(e) => {
                      clearFieldError('telefone');
                      const formatted = formatPhone(e.target.value);
                      setFormData({ ...formData, telefone: formatted });
                    }}
                    maxLength={15}
                    error={validationErrors.telefone}
                  />
                  
                  <FormSelect
                    label="Status"
                    value={formData.ativo ? 'active' : 'inactive'}
                    onValueChange={(value) => setFormData({ ...formData, ativo: value === 'active' })}
                    placeholder="Selecione o status"
                  >
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                  </FormSelect>
                </div>
              </div>
            </div>

            {/* Seção de Endereço */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Endereço</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <FormInput
                    label="Endereço"
                    placeholder="Digite o endereço"
                    value={formData.endereco}
                    onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      label="Número"
                      placeholder="Nº"
                      value={formData.numero}
                      onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                    />
                    <FormInput
                      label="Complemento"
                      placeholder="Complemento"
                      value={formData.complemento}
                      onChange={(e) => setFormData({ ...formData, complemento: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="space-y-6">
                  <FormInput
                    label="Bairro"
                    placeholder="Bairro"
                    value={formData.bairro}
                    onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      label="Cidade"
                      placeholder="Cidade"
                      value={formData.cidade}
                      onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                    />
                    <FormField label="Estado">
                      <Select value={formData.uf} onValueChange={(value) => setFormData({ ...formData, uf: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o estado" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 overflow-y-auto custom-scroll">
                          {ESTADOS_BRASILEIROS.map((estado) => (
                            <SelectItem key={estado.codigo} value={estado.uf}>
                              {estado.uf} - {estado.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormField>
                  </div>
                  
                  <FormInput
                    label="CEP"
                    placeholder="00000-000"
                    value={formData.cep}
                    onChange={(e) => {
                      clearFieldError('cep');
                      const formatted = formatCEP(e.target.value);
                      setFormData({ ...formData, cep: formatted });
                    }}
                    maxLength={9}
                    error={validationErrors.cep}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveLoja}>
              {editingLoja ? 'Salvar Alterações' : 'Criar Loja'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog for Delete */}
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={cancelDeleteLoja}
        onConfirm={confirmDeleteLoja}
        title="Confirmar Exclusão"
        description={`Tem certeza que deseja excluir a loja "${lojaToDelete?.nome}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="destructive"
      />
    </div>
  );
}
