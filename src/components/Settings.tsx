import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { 
  Settings as SettingsIcon,
  Store,
  Printer,
  Database,
  Bell,
  Globe,
  Receipt,
  Shield,
  Download,
  Upload,
  Save
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';

export function Settings() {
  const [settings, setSettings] = useState({
    storeName: 'Loja Centro - Ontime Sales',
    storeAddress: 'Rua Principal, 123, Centro, São Paulo - SP',
    storePhone: '(11) 3456-7890',
    storeEmail: 'contato@loja.com',
    storeCNPJ: '12.345.678/0001-90',
    
    currency: 'BRL',
    language: 'pt-BR',
    timezone: 'America/Sao_Paulo',
    dateFormat: 'dd/MM/yyyy',
    
    printerName: 'Epson TM-T20II',
    printerPort: 'USB001',
    receiptFooter: 'Obrigado pela preferência!',
    showProductImages: true,
    playNotificationSounds: true,
    
    enableNFCe: false,
    nfceEnvironment: 'homologacao',
    certificatePath: '',
    certificatePassword: '',
    
    lowStockAlert: true,
    lowStockThreshold: 5,
    emailNotifications: true,
    smsNotifications: false,
    
    sessionTimeout: 60,
    requirePasswordChange: false,
    enableTwoFactor: false,
    
    autoBackup: true,
    backupFrequency: 'daily',
    backupRetention: 30
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = (section: string) => {
    alert(`Configurações de ${section} salvas com sucesso!`);
  };

  const handleBackup = () => {
    alert('Backup iniciado! Você será notificado quando concluído.');
  };

  const handleRestore = () => {
    if (confirm('Tem certeza que deseja restaurar um backup? Esta ação substituirá todos os dados atuais.')) {
      alert('Selecione o arquivo de backup para restaurar.');
    }
  };

  const testPrinter = () => {
    alert('Enviando página de teste para a impressora...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações do Sistema</h1>
          <p className="text-gray-600">Personalize o sistema de acordo com suas necessidades</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleBackup} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Backup
          </Button>
          <Button onClick={handleRestore} variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Restaurar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="store" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="store">Loja</TabsTrigger>
          <TabsTrigger value="pos">PDV</TabsTrigger>
          <TabsTrigger value="fiscal">Fiscal</TabsTrigger>
          <TabsTrigger value="notifications">Alertas</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
        </TabsList>

        <TabsContent value="store" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Informações da Loja
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Nome da Loja</Label>
                  <Input
                    value={settings.storeName}
                    onChange={(e) => handleSettingChange('storeName', e.target.value)}
                  />
                </div>
                <div>
                  <Label>CNPJ</Label>
                  <Input
                    value={settings.storeCNPJ}
                    onChange={(e) => handleSettingChange('storeCNPJ', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Telefone</Label>
                  <Input
                    value={settings.storePhone}
                    onChange={(e) => handleSettingChange('storePhone', e.target.value)}
                  />
                </div>
                <div>
                  <Label>E-mail</Label>
                  <Input
                    type="email"
                    value={settings.storeEmail}
                    onChange={(e) => handleSettingChange('storeEmail', e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Endereço Completo</Label>
                  <Textarea
                    value={settings.storeAddress}
                    onChange={(e) => handleSettingChange('storeAddress', e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => handleSave('loja')}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Configurações
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Configurações Regionais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Moeda</Label>
                  <Select value={settings.currency} onValueChange={(value) => handleSettingChange('currency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BRL">Real Brasileiro (R$)</SelectItem>
                      <SelectItem value="USD">Dólar Americano ($)</SelectItem>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Idioma</Label>
                  <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es-ES">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Fuso Horário</Label>
                  <Select value={settings.timezone} onValueChange={(value) => handleSettingChange('timezone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                      <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
                      <SelectItem value="Europe/London">London (GMT+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Formato de Data</Label>
                  <Select value={settings.dateFormat} onValueChange={(value) => handleSettingChange('dateFormat', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd/MM/yyyy">DD/MM/AAAA</SelectItem>
                      <SelectItem value="MM/dd/yyyy">MM/DD/AAAA</SelectItem>
                      <SelectItem value="yyyy-MM-dd">AAAA-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => handleSave('regional')}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Configurações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Printer className="h-5 w-5" />
                Configurações de Impressão
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Nome da Impressora</Label>
                  <Input
                    value={settings.printerName}
                    onChange={(e) => handleSettingChange('printerName', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Porta</Label>
                  <Select value={settings.printerPort} onValueChange={(value) => handleSettingChange('printerPort', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USB001">USB001</SelectItem>
                      <SelectItem value="COM1">COM1</SelectItem>
                      <SelectItem value="COM2">COM2</SelectItem>
                      <SelectItem value="TCP/IP">TCP/IP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label>Rodapé do Cupom</Label>
                  <Textarea
                    placeholder="Mensagem que aparecerá no final do cupom"
                    value={settings.receiptFooter}
                    onChange={(e) => handleSettingChange('receiptFooter', e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={testPrinter}>
                  <Printer className="h-4 w-4 mr-2" />
                  Testar Impressora
                </Button>
                <Button onClick={() => handleSave('impressao')}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Configurações
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                Interface do PDV
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Mostrar Imagens dos Produtos</Label>
                    <p className="text-sm text-gray-500">Exibe miniaturas dos produtos no PDV</p>
                  </div>
                  <Switch
                    checked={settings.showProductImages}
                    onCheckedChange={(checked: boolean) => handleSettingChange('showProductImages', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Sons de Notificação</Label>
                    <p className="text-sm text-gray-500">Reproduz sons para ações importantes</p>
                  </div>
                  <Switch
                    checked={settings.playNotificationSounds}
                    onCheckedChange={(checked: boolean) => handleSettingChange('playNotificationSounds', checked)}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => handleSave('interface')}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Configurações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fiscal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Configurações Fiscais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Habilitar NFC-e</Label>
                    <p className="text-sm text-gray-500">Emitir Nota Fiscal do Consumidor Eletrônica</p>
                  </div>
                  <Switch
                    checked={settings.enableNFCe}
                    onCheckedChange={(checked: boolean) => handleSettingChange('enableNFCe', checked)}
                  />
                </div>

                {settings.enableNFCe && (
                  <>
                    <Separator />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Ambiente</Label>
                        <Select value={settings.nfceEnvironment} onValueChange={(value) => handleSettingChange('nfceEnvironment', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="homologacao">Homologação</SelectItem>
                            <SelectItem value="producao">Produção</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Caminho do Certificado</Label>
                        <Input
                          placeholder="C:\certificado.pfx"
                          value={settings.certificatePath}
                          onChange={(e) => handleSettingChange('certificatePath', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Senha do Certificado</Label>
                        <Input
                          type="password"
                          placeholder="Digite a senha"
                          value={settings.certificatePassword}
                          onChange={(e) => handleSettingChange('certificatePassword', e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="flex justify-end">
                <Button onClick={() => handleSave('fiscal')}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Configurações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Alertas e Notificações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Alerta de Estoque Baixo</Label>
                    <p className="text-sm text-gray-500">Notificar quando produtos atingirem estoque mínimo</p>
                  </div>
                  <Switch
                    checked={settings.lowStockAlert}
                    onCheckedChange={(checked: boolean) => handleSettingChange('lowStockAlert', checked)}
                  />
                </div>

                {settings.lowStockAlert && (
                  <div>
                    <Label>Limite para Alerta</Label>
                    <Input
                      type="number"
                      value={settings.lowStockThreshold}
                      onChange={(e) => handleSettingChange('lowStockThreshold', parseInt(e.target.value))}
                      className="w-32"
                    />
                    <p className="text-sm text-gray-500 mt-1">Alertar quando estoque for menor ou igual a este valor</p>
                  </div>
                )}

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Notificações por E-mail</Label>
                    <p className="text-sm text-gray-500">Enviar alertas importantes por e-mail</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked: boolean) => handleSettingChange('emailNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Notificações por SMS</Label>
                    <p className="text-sm text-gray-500">Enviar alertas críticos por SMS</p>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked: boolean) => handleSettingChange('smsNotifications', checked)}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => handleSave('notificacoes')}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Configurações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Configurações de Segurança
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Timeout de Sessão (minutos)</Label>
                  <Input
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                  />
                  <p className="text-sm text-gray-500 mt-1">Usuário será deslogado após este período de inatividade</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Exigir Troca de Senha</Label>
                    <p className="text-sm text-gray-500">Usuários devem trocar senha periodicamente</p>
                  </div>
                  <Switch
                    checked={settings.requirePasswordChange}
                    onCheckedChange={(checked: boolean) => handleSettingChange('requirePasswordChange', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Autenticação de Dois Fatores</Label>
                    <p className="text-sm text-gray-500">Aumenta a segurança com verificação adicional</p>
                  </div>
                  <Switch
                    checked={settings.enableTwoFactor}
                    onCheckedChange={(checked: boolean) => handleSettingChange('enableTwoFactor', checked)}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => handleSave('seguranca')}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Configurações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Backup e Restauração
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Backup Automático</Label>
                    <p className="text-sm text-gray-500">Realizar backup dos dados automaticamente</p>
                  </div>
                  <Switch
                    checked={settings.autoBackup}
                    onCheckedChange={(checked: boolean) => handleSettingChange('autoBackup', checked)}
                  />
                </div>

                {settings.autoBackup && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Frequência do Backup</Label>
                        <Select value={settings.backupFrequency} onValueChange={(value) => handleSettingChange('backupFrequency', value)}>
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
                      <div>
                        <Label>Retenção (dias)</Label>
                        <Input
                          type="number"
                          value={settings.backupRetention}
                          onChange={(e) => handleSettingChange('backupRetention', parseInt(e.target.value))}
                        />
                        <p className="text-sm text-gray-500 mt-1">Manter backups por quantos dias</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              <Separator />
              
              <div className="flex gap-4">
                <Button onClick={handleBackup} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Fazer Backup Agora
                </Button>
                <Button onClick={handleRestore} variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Restaurar Backup
                </Button>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={() => handleSave('sistema')}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Configurações
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações do Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-gray-50 rounded">
                  <strong>Versão do Sistema:</strong>
                  <p>Vendi v2.1.0</p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <strong>Última Atualização:</strong>
                  <p>15 de Janeiro de 2024</p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <strong>Banco de Dados:</strong>
                  <p>MySQL 8.0.35</p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <strong>Espaço Usado:</strong>
                  <p>245 MB de 2 GB</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}