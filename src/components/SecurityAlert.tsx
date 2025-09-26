import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { Shield, AlertTriangle, X, RefreshCw } from 'lucide-react';

interface SecurityAlertProps {
  type: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  onDismiss?: () => void;
  onRetry?: () => void;
  showRetry?: boolean;
}

export function SecurityAlert({ 
  type, 
  title, 
  message, 
  onDismiss, 
  onRetry, 
  showRetry = false 
}: SecurityAlertProps) {
  const getIcon = () => {
    switch (type) {
      case 'error':
        return <Shield className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getVariant = () => {
    switch (type) {
      case 'error':
        return 'destructive';
      case 'warning':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Alert variant={getVariant()} className="mb-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-2">
          {getIcon()}
          <div className="flex-1">
            <h4 className="font-semibold">{title}</h4>
            <AlertDescription className="mt-1">
              {message}
            </AlertDescription>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {showRetry && onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="h-8 px-2"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Revalidar
            </Button>
          )}
          {onDismiss && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="h-8 px-2"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    </Alert>
  );
}

interface SecurityStatusProps {
  securityStatus: {
    isSecure: boolean;
    integrityCheck: {
      isAuthenticated: boolean;
      hasValidToken: boolean;
      permissionsMatch: boolean;
      rootStatusValid: boolean;
      lastValidation: Date;
    };
    warnings: string[];
    errors: string[];
  };
  onRevalidate?: () => void;
  onDismissWarnings?: () => void;
  onDismissErrors?: () => void;
}

export function SecurityStatus({ 
  securityStatus, 
  onRevalidate, 
  onDismissWarnings, 
  onDismissErrors 
}: SecurityStatusProps) {
  const { isSecure, integrityCheck, warnings, errors } = securityStatus;

  // Filtrar erros e warnings desnecessários
  const criticalErrors = errors.filter(error => 
    !error.includes('Token não fornecido') && 
    !error.includes('Token deve ser uma string') &&
    !error.includes('Token inválido')
  );

  const criticalWarnings = warnings.filter(warning => 
    !warning.includes('Formato de token pode estar inválido') &&
    !warning.includes('Token pode estar malformado')
  );

  // Só mostrar se há problemas realmente críticos
  if (isSecure && criticalWarnings.length === 0 && criticalErrors.length === 0) {
    return null; // Não mostrar nada se tudo estiver seguro
  }

  return (
    <div className="space-y-2">
      {/* Erros críticos */}
      {criticalErrors.map((error, index) => (
        <SecurityAlert
          key={`error-${index}`}
          type="error"
          title="Erro de Segurança Crítico"
          message={error}
          onDismiss={onDismissErrors}
          showRetry={true}
          onRetry={onRevalidate}
        />
      ))}

      {/* Warnings críticos */}
      {criticalWarnings.map((warning, index) => (
        <SecurityAlert
          key={`warning-${index}`}
          type="warning"
          title="Aviso de Segurança"
          message={warning}
          onDismiss={onDismissWarnings}
          showRetry={true}
          onRetry={onRevalidate}
        />
      ))}

      {/* Status de integridade - só mostrar se realmente houver problemas críticos */}
      {!isSecure && criticalErrors.length > 0 && (
        <SecurityAlert
          type="error"
          title="Problemas de Integridade Detectados"
          message={`Autenticação: ${integrityCheck.isAuthenticated ? 'OK' : 'FALHA'} | Permissões: ${integrityCheck.permissionsMatch ? 'OK' : 'FALHA'}`}
          onRetry={onRevalidate}
          showRetry={true}
        />
      )}
    </div>
  );
}
