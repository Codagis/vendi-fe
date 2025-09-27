import { useToast } from '../hooks/useToast';

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  details?: Record<string, string>;
}

export class NotificationService {
  private static instance: NotificationService;
  private toast = useToast();

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  public showSuccess(message: string, description?: string) {
    this.toast.showSuccess(message, { description });
  }

  public showError(message: string, description?: string) {
    this.toast.showError(message, { description });
  }

  public showWarning(message: string, description?: string) {
    this.toast.showWarning(message, { description });
  }

  public showInfo(message: string, description?: string) {
    this.toast.showInfo(message, { description });
  }

  public handleApiError(error: any) {
    console.error('API Error:', error);

    if (error.response?.data) {
      const apiError: ApiError = error.response.data;
      
      const statusMessages: Record<number, string> = {
        400: 'Dados inválidos fornecidos',
        401: 'Credenciais inválidas',
        403: 'Conta inativa ou bloqueada',
        404: 'Usuário não encontrado',
        409: 'Conflito de dados',
        422: 'Dados inválidos',
        500: 'Erro interno do servidor',
      };

      const friendlyMessage = statusMessages[apiError.status] || apiError.message || 'Erro inesperado';
      
      let description = '';
      if (apiError.details && Object.keys(apiError.details).length > 0) {
        const firstError = Object.values(apiError.details)[0];
        description = firstError;
      }

      this.showError(friendlyMessage, description);
    } else if (error.message) {
      this.showError('Erro de conexão', error.message);
    } else {
      this.showError('Erro inesperado', 'Tente novamente mais tarde');
    }
  }

  public handleValidationError(errors: Record<string, string>) {
    const firstError = Object.values(errors)[0];
    this.showError('Dados inválidos', firstError);
  }

  public handleNetworkError() {
    this.showError('Erro de conexão', 'Verifique sua conexão com a internet');
  }

  public handleTimeoutError() {
    this.showError('Tempo limite excedido', 'A operação demorou muito para responder');
  }
}

export const notificationService = NotificationService.getInstance();
