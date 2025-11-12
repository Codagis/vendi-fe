import { Code, Github, Mail, Phone, Wifi, WifiOff, Clock } from 'lucide-react';

interface FooterProps {
  isSidebarOpen: boolean;
}

export function Footer({ isSidebarOpen }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const version = "1.0.0";
  const systemName = "Vendi PDV";
  const buildDate = "2024-09-30";
  const isOnline = navigator.onLine;

  return (
    <footer className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-6 z-10 footer-transition footer-shadow ${
      isSidebarOpen ? 'lg:ml-64' : 'ml-0'
    }`}>
      <div className="max-w-full mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3 text-sm text-gray-600">
          {/* Informações do Sistema */}
          <div className="flex items-center gap-4 order-1 lg:order-1">
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-gray-900">{systemName}</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                v{version}
              </span>
            </div>
            
            {/* Status de Conexão */}
            <div className="hidden sm:flex items-center gap-1 text-xs">
              {isOnline ? (
                <>
                  <Wifi className="h-3 w-3 text-green-500" />
                  <span className="text-green-600">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3 text-red-500" />
                  <span className="text-red-600">Offline</span>
                </>
              )}
            </div>
          </div>

          {/* Informações de Contato - Oculto em telas pequenas */}
          <div className="hidden md:flex items-center gap-4 text-xs order-2 lg:order-2">
            <div className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              <span>suporte@vendi.com</span>
            </div>
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              <span>(11) 99999-9999</span>
            </div>
          </div>

          {/* Copyright e Build Info */}
          <div className="flex flex-col sm:flex-row items-center gap-1 text-xs order-3 lg:order-3">
            <div className="flex items-center gap-1">
              <span>© {currentYear} Desenvolvido pela equipe Vendi</span>
            </div>
            <div className="hidden lg:flex items-center gap-1 text-gray-400">
              <Clock className="h-3 w-3" />
              <span>Build {buildDate}</span>
            </div>
          </div>
        </div>

        {/* Informações de Contato - Visível apenas em telas pequenas */}
        <div className="md:hidden mt-2 pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                <span>suporte@vendi.com</span>
              </div>
              <div className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                <span>(11) 99999-9999</span>
              </div>
            </div>
            
            {/* Status de Conexão Mobile */}
            <div className="flex items-center gap-1">
              {isOnline ? (
                <>
                  <Wifi className="h-3 w-3 text-green-500" />
                  <span className="text-green-600">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3 text-red-500" />
                  <span className="text-red-600">Offline</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
