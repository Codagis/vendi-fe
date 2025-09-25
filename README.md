# Ontime Sales - Sistema PDV

Sistema de Ponto de Venda (PDV) desenvolvido em React TypeScript com interface moderna e funcionalidades completas para gestão de vendas.

## 🚀 Tecnologias Utilizadas

- **React 18** - Biblioteca principal
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS
- **Radix UI** - Componentes acessíveis
- **Lucide React** - Ícones
- **Recharts** - Gráficos e visualizações

## 📁 Estrutura do Projeto

```
src/
├── components/           # Componentes principais
│   ├── ui/              # Componentes de UI (Radix UI + Tailwind)
│   ├── figma/           # Componentes específicos do Figma
│   ├── Dashboard.tsx    # Painel principal
│   ├── POSSystem.tsx    # Sistema de vendas
│   ├── LoginScreen.tsx  # Tela de login
│   └── ...
├── types/               # Definições de tipos TypeScript
├── styles/              # Estilos globais
└── App.tsx             # Componente principal
```

## 🛠️ Instalação e Execução

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn

### Instalação
```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Verificação de tipos TypeScript
npm run type-check
```

## 🎯 Funcionalidades

### ✅ Implementadas
- **Autenticação**: Sistema de login com múltiplos usuários e perfis
- **Dashboard**: Painel com métricas e gráficos em tempo real
- **PDV**: Sistema completo de vendas com carrinho e pagamentos
- **Gestão de Produtos**: CRUD completo de produtos
- **Gestão de Clientes**: Cadastro e histórico de clientes
- **Controle de Estoque**: Monitoramento e alertas de estoque baixo
- **Relatórios**: Geração de relatórios de vendas
- **Configurações**: Personalização do sistema

### 🔧 Tipos TypeScript
O projeto inclui tipagem completa com interfaces para:
- Usuários e autenticação
- Produtos e inventário
- Clientes e vendas
- Transações financeiras
- Componentes de UI

## 🎨 Design System

O projeto utiliza um design system consistente baseado em:
- **Cores**: Paleta de cores moderna com suporte a tema escuro
- **Componentes**: Biblioteca de componentes reutilizáveis
- **Tipografia**: Hierarquia clara de textos
- **Espaçamento**: Sistema de grid responsivo

## 📱 Responsividade

O sistema é totalmente responsivo, funcionando em:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (até 767px)

## 🔐 Segurança

- Autenticação baseada em roles (admin, vendedor, estoque, financeiro)
- Controle de permissões por módulo
- Validação de dados no frontend e backend
- Sessões seguras

## 🚀 Deploy

Para fazer deploy do projeto:

```bash
# Build de produção
npm run build

# Os arquivos estarão na pasta 'dist/'
```

## 📝 Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm run preview` - Preview do build
- `npm run type-check` - Verificação de tipos
- `npm run lint` - Linting do código

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Para suporte ou dúvidas, entre em contato através dos canais oficiais do projeto.

---

**Desenvolvido com ❤️ para facilitar a gestão de vendas**
