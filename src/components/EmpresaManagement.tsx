import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { 
  Building2, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Upload,
  Image,
  RefreshCw,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  FileText
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Switch } from './ui/switch';
import { ConfirmationDialog } from './ui/confirmation-dialog';
import { FormField, FormInput, FormSelect } from './ui/form-field';
import { apiService } from '../services/api';
import { notificationService } from '../services/notificationService';
import { MenuButton } from './ui/menu-button';
import { Empresa, EmpresaStats } from '../types';
import { 
  formatCNPJ, 
  formatPhone, 
  formatCEP, 
  removeMask,
  validateCNPJ,
  validateEmail,
  validatePhone,
  validateCEP
} from '../utils/masks';
import { ESTADOS_BRASILEIROS } from '../utils/estados';

interface EmpresaManagementProps {
  onToggleSidebar?: () => void;
}

export function EmpresaManagement({ onToggleSidebar }: EmpresaManagementProps) {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [stats, setStats] = useState<EmpresaStats | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingEmpresa, setEditingEmpresa] = useState<Empresa | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [empresaToDelete, setEmpresaToDelete] = useState<Empresa | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    razaoSocial: '',
    nomeFantasia: '',
    cnpj: '',
    inscricaoEstadual: '',
    inscricaoMunicipal: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: '',
    cep: '',
    telefone: '',
    email: '',
    site: '',
    ativo: true
  });

  const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadStats();
    loadEmpresas();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() || selectedStatus !== 'all') {
      const timeoutId = setTimeout(() => {
        loadEmpresas();
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      loadEmpresas();
    }
  }, [searchTerm, selectedStatus]);

  const loadStats = async () => {
    try {
      const statsData = await apiService.getEmpresaStats();
      setStats(statsData);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      setStats({
        totalEmpresas: 0,
        empresasAtivas: 0,
        empresasInativas: 0,
        totalLojas: 0,
        totalUsuarios: 0
      });
    }
  };

  const loadEmpresas = async () => {
    setIsLoading(true);
    try {
      let filters: any = undefined;
      
      // Só criar filtros se houver busca ou status específico
      if (searchTerm.trim() || selectedStatus !== 'all') {
        filters = {};
        
        if (searchTerm.trim()) {
          filters.razaoSocial = searchTerm;
          filters.nomeFantasia = searchTerm;
          filters.cnpj = searchTerm;
          filters.email = searchTerm;
        }
        
        if (selectedStatus !== 'all') {
          filters.ativo = selectedStatus === 'active';
        }
      }

      const empresasData = await apiService.getEmpresas(filters);
      setEmpresas(empresasData);
      
      if (!searchTerm.trim() && selectedStatus === 'all') {
        loadStats();
      }
    } catch (error) {
      console.error('Erro ao carregar empresas:', error);
      setEmpresas([]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      razaoSocial: '',
      nomeFantasia: '',
      cnpj: '',
      inscricaoEstadual: '',
      inscricaoMunicipal: '',
      endereco: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      uf: '',
      cep: '',
      telefone: '',
      email: '',
      site: '',
      ativo: true
    });
    setSelectedLogoFile(null);
    setLogoPreview(null);
    setEditingEmpresa(null);
    setValidationErrors({});
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Validação de campos obrigatórios
    if (!formData.razaoSocial.trim()) {
      errors.razaoSocial = 'Razão Social é obrigatória';
    }

    if (!formData.cnpj.trim()) {
      errors.cnpj = 'CNPJ é obrigatório';
    } else if (!validateCNPJ(formData.cnpj)) {
      errors.cnpj = 'CNPJ inválido';
    }

    // Validação de email se preenchido
    if (formData.email.trim() && !validateEmail(formData.email)) {
      errors.email = 'Email inválido';
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

  const handleAddEmpresa = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const handleEditEmpresa = (empresa: Empresa) => {
    setFormData({
      razaoSocial: empresa.razaoSocial,
      nomeFantasia: empresa.nomeFantasia || '',
      cnpj: formatCNPJ(empresa.cnpj || ''),
      inscricaoEstadual: empresa.inscricaoEstadual || '',
      inscricaoMunicipal: empresa.inscricaoMunicipal || '',
      endereco: empresa.endereco || '',
      numero: empresa.numero || '',
      complemento: empresa.complemento || '',
      bairro: empresa.bairro || '',
      cidade: empresa.cidade || '',
      uf: empresa.uf || '',
      cep: empresa.cep ? formatCEP(empresa.cep) : '',
      telefone: empresa.telefone ? formatPhone(empresa.telefone) : '',
      email: empresa.email || '',
      site: empresa.site || '',
      ativo: empresa.ativo
    });
    setSelectedLogoFile(null);
    setLogoPreview(null);
    setEditingEmpresa(empresa);
    setValidationErrors({});
    setIsAddDialogOpen(true);
  };

  const handleDeleteEmpresa = (empresa: Empresa) => {
    setEmpresaToDelete(empresa);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteEmpresa = async () => {
    if (!empresaToDelete) return;

    try {
      await apiService.deleteEmpresa(empresaToDelete.id);
      notificationService.showSuccess('Empresa excluída com sucesso!');
      loadEmpresas();
      loadStats();
    } catch (error) {
      console.error('Erro ao excluir empresa:', error);
      notificationService.showError('Erro ao excluir empresa');
    } finally {
      setIsDeleteDialogOpen(false);
      setEmpresaToDelete(null);
    }
  };

  const cancelDeleteEmpresa = () => {
    setIsDeleteDialogOpen(false);
    setEmpresaToDelete(null);
  };

  const handleSaveEmpresa = async () => {
    if (!validateForm()) {
      notificationService.showError('Por favor, corrija os erros nos campos obrigatórios');
      return;
    }

    try {
      // Preparar dados para envio (remover máscaras)
      const dadosParaEnvio = {
        ...formData,
        cnpj: removeMask(formData.cnpj),
        telefone: removeMask(formData.telefone),
        cep: removeMask(formData.cep)
      };

      let empresaSalva;
      if (editingEmpresa) {
        empresaSalva = await apiService.updateEmpresa(editingEmpresa.id, dadosParaEnvio);
      } else {
        empresaSalva = await apiService.createEmpresa(dadosParaEnvio);
      }

      // Upload da logo se foi selecionada
      if (selectedLogoFile && empresaSalva) {
        await handleLogoUpload(empresaSalva.id, selectedLogoFile);
      }

      await loadEmpresas();
      setIsAddDialogOpen(false);
      resetForm();
      notificationService.showSuccess('Empresa salva com sucesso!');
    } catch (error: any) {
      console.error('Erro ao salvar empresa:', error);
      notificationService.showError(error.response?.data?.message || 'Erro ao salvar empresa');
    }
  };

  const toggleEmpresaStatus = async (empresaId: number) => {
    try {
      const empresa = empresas.find(e => e.id === empresaId);
      if (empresa) {
        await apiService.alterarStatusEmpresa(empresaId, !empresa.ativo);
        await loadEmpresas();
        notificationService.showSuccess(`Empresa ${!empresa.ativo ? 'ativada' : 'desativada'} com sucesso!`);
      }
    } catch (error: any) {
      console.error('Erro ao alterar status da empresa:', error);
      notificationService.showError('Erro ao alterar status da empresa');
    }
  };

  const handleLogoUpload = async (empresaId: number, file: File) => {
    setUploadingLogo(empresaId);
    try {
      const urlLogo = await apiService.uploadLogoEmpresa(empresaId, file);
      await loadEmpresas();
      notificationService.showSuccess('Logo enviada com sucesso!');
    } catch (error: any) {
      console.error('Erro ao enviar logo:', error);
      notificationService.showError('Erro ao enviar logo');
    } finally {
      setUploadingLogo(null);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const formatCNPJ = (cnpj: string): string => {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
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
          <MenuButton onToggleSidebar={onToggleSidebar} />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestão de Empresas</h1>
            <p className="text-gray-600">Gerencie as empresas do sistema</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={loadEmpresas} 
            variant="outline" 
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button onClick={handleAddEmpresa} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Nova Empresa
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600" />
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
              <Building2 className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Empresas Ativas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.empresasAtivas ?? 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Empresas Inativas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.empresasInativas ?? 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-purple-600" />
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
                  placeholder="Buscar por razão social, nome fantasia, CNPJ ou e-mail..."
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
            <div className="flex items-end">
              <Button variant="outline" onClick={() => { setSearchTerm(''); setSelectedStatus('all'); }}>
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Empresas Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Empresas ({empresas.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empresa</TableHead>
                  <TableHead>CNPJ</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Cadastrado em</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                        <span>Carregando empresas...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : empresas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Nenhuma empresa encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  empresas.map((empresa) => (
                    <TableRow key={empresa.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                            {empresa.urlLogo ? (
                              <img 
                                src={empresa.urlLogo} 
                                alt={`Logo ${empresa.razaoSocial}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Building2 className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{empresa.razaoSocial}</p>
                            {empresa.nomeFantasia && (
                              <p className="text-sm text-gray-500">{empresa.nomeFantasia}</p>
                            )}
                            {empresa.enderecoCompleto && (
                              <p className="text-sm text-gray-500 flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {empresa.enderecoCompleto}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-mono text-sm">{formatCNPJ(empresa.cnpj)}</p>
                        {empresa.inscricaoEstadual && (
                          <p className="text-xs text-gray-500">IE: {empresa.inscricaoEstadual}</p>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {empresa.telefone && (
                            <p className="text-sm flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {formatPhone(empresa.telefone)}
                            </p>
                          )}
                          {empresa.email && (
                            <p className="text-sm flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {empresa.email}
                            </p>
                          )}
                          {empresa.site && (
                            <p className="text-sm flex items-center gap-1">
                              <Globe className="h-3 w-3" />
                              {empresa.site}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge className={`${empresa.ativo ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                            {empresa.ativo ? 'Ativo' : 'Inativo'}
                          </Badge>
                          <Switch
                            checked={empresa.ativo}
                            onCheckedChange={() => toggleEmpresaStatus(empresa.id)}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {empresa.createdAt ? formatDate(empresa.createdAt) : 'N/A'}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleLogoUpload(empresa.id, file);
                              }
                            }}
                            className="hidden"
                            id={`logo-upload-${empresa.id}`}
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => document.getElementById(`logo-upload-${empresa.id}`)?.click()}
                            disabled={uploadingLogo === empresa.id}
                            className="flex items-center gap-1"
                          >
                            <Upload className="h-3 w-3" />
                            Logo
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditEmpresa(empresa)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteEmpresa(empresa)}
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

      {/* Add/Edit Empresa Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="!max-w-[60vw] !w-[60vw] max-h-[90vh] overflow-y-auto custom-scroll" style={{ width: '60vw', maxWidth: '60vw' }}>
          <DialogHeader>
            <DialogTitle>
              {editingEmpresa ? 'Editar Empresa' : 'Nova Empresa'}
            </DialogTitle>
            <DialogDescription>
              Preencha as informações da empresa
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-8">
            {/* Seção de Informações Básicas */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Informações Básicas</h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="space-y-6">
                  <FormInput
                    label="Razão Social"
                    required
                    placeholder="Digite a razão social"
                    value={formData.razaoSocial}
                    onChange={(e) => {
                      clearFieldError('razaoSocial');
                      setFormData({ ...formData, razaoSocial: e.target.value });
                    }}
                    error={validationErrors.razaoSocial}
                  />
                  
                  <FormInput
                    label="Nome Fantasia"
                    placeholder="Digite o nome fantasia"
                    value={formData.nomeFantasia}
                    onChange={(e) => setFormData({ ...formData, nomeFantasia: e.target.value })}
                  />
                  
                  <FormInput
                    label="CNPJ"
                    required
                    placeholder="00.000.000/0000-00"
                    value={formData.cnpj}
                    onChange={(e) => {
                      clearFieldError('cnpj');
                      const formatted = formatCNPJ(e.target.value);
                      setFormData({ ...formData, cnpj: formatted });
                    }}
                    maxLength={18}
                    error={validationErrors.cnpj}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      label="Inscrição Estadual"
                      placeholder="IE"
                      value={formData.inscricaoEstadual}
                      onChange={(e) => setFormData({ ...formData, inscricaoEstadual: e.target.value })}
                    />
                    <FormInput
                      label="Inscrição Municipal"
                      placeholder="IM"
                      value={formData.inscricaoMunicipal}
                      onChange={(e) => setFormData({ ...formData, inscricaoMunicipal: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="space-y-6">
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
                  
                  <FormInput
                    label="E-mail"
                    type="email"
                    placeholder="email@empresa.com"
                    value={formData.email}
                    onChange={(e) => {
                      clearFieldError('email');
                      setFormData({ ...formData, email: e.target.value });
                    }}
                    error={validationErrors.email}
                  />
                  
                  <FormInput
                    label="Site"
                    placeholder="https://www.empresa.com"
                    value={formData.site}
                    onChange={(e) => setFormData({ ...formData, site: e.target.value })}
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
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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

            {/* Seção de Logo */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Logo da Empresa</h3>
              <div className="flex items-start gap-6">
                {/* Preview da Logo */}
                <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                  {logoPreview ? (
                    <img 
                      src={logoPreview} 
                      alt="Preview da logo"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : editingEmpresa?.urlLogo ? (
                    <img 
                      src={editingEmpresa.urlLogo} 
                      alt="Logo atual"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center">
                      <Image className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-500">Nenhuma logo</p>
                    </div>
                  )}
                </div>
                
                {/* Upload de Logo */}
                <div className="flex-1 space-y-4">
                  <div>
                    <Label>Upload da Logo</Label>
                    <p className="text-sm text-gray-500 mt-1 mb-3">
                      Faça upload da logo da empresa. Formatos aceitos: JPG, PNG, GIF, WEBP (máx. 10MB)
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 10 * 1024 * 1024) {
                            notificationService.showError('Arquivo muito grande. Máximo 10MB.');
                            return;
                          }
                          
                          // Criar preview da imagem
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setLogoPreview(event.target?.result as string);
                          };
                          reader.readAsDataURL(file);
                          
                          // Salvar arquivo para upload posterior
                          setSelectedLogoFile(file);
                        }
                      }}
                      className="hidden"
                      id="logo-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('logo-upload')?.click()}
                      className="w-auto px-6"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {selectedLogoFile ? 'Alterar Logo Selecionada' : 'Selecionar Logo'}
                    </Button>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    <p>• Selecione uma imagem para fazer upload da logo</p>
                    <p>• A logo será salva após salvar a empresa</p>
                    <p>• Recomendamos imagens quadradas (1:1) para melhor visualização</p>
                    {selectedLogoFile && (
                      <p className="text-green-600 font-medium">
                        ✓ Logo selecionada: {selectedLogoFile.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEmpresa}>
              {editingEmpresa ? 'Salvar Alterações' : 'Criar Empresa'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog for Delete */}
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={cancelDeleteEmpresa}
        onConfirm={confirmDeleteEmpresa}
        title="Confirmar Exclusão"
        description={`Tem certeza que deseja excluir a empresa "${empresaToDelete?.razaoSocial}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="destructive"
      />
    </div>
  );
}
