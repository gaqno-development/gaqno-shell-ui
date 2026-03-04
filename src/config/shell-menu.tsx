import {
  AnimatedBellIcon,
  AnimatedDicesIcon,
  AnimatedGearIcon,
  AnimatedShoppingCartIcon,
  AnimatedSparklesIcon,
  AnimatedTrendingUpIcon,
  AnimatedLightbulbIcon,
  BoxesIcon,
  DollarSignIcon,
  FileDescriptionIcon,
  LayoutPanelTopIcon,
  ShieldCheck,
  UsersIcon,
} from "@gaqno-development/frontcore/components/icons";
import { Activity, Heart } from "lucide-react";
import type { ShellMenuItem } from "@/components/shell-sidebar";

export const SHELL_MENU_ITEMS: ShellMenuItem[] = [
  {
    label: "Visão Geral",
    href: "/dashboard",
    icon: LayoutPanelTopIcon,
    isCollapsible: true,
    children: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutPanelTopIcon },
      { label: "Tarefas", href: "/dashboard/tasks", icon: FileDescriptionIcon },
      { label: "Agenda", href: "/dashboard/calendar", icon: LayoutPanelTopIcon },
      { label: "Notificações", href: "/dashboard/notifications", icon: AnimatedBellIcon },
    ],
  },
  {
    label: "Comercial",
    href: "/crm/dashboard/overview",
    icon: AnimatedTrendingUpIcon,
    isCollapsible: true,
    children: [
      { label: "Clientes", href: "/crm/customers/accounts", icon: UsersIcon },
      { label: "Pipeline", href: "/crm/sales/leads", icon: AnimatedTrendingUpIcon },
      { label: "Propostas", href: "/crm/sales/quotes", icon: FileDescriptionIcon },
      { label: "Vendas", href: "/crm/sales/leads", icon: AnimatedTrendingUpIcon },
      { label: "Desempenho", href: "/crm/reports/analytics", icon: FileDescriptionIcon },
    ],
  },
  {
    label: "Atendimento",
    href: "/omnichannel#overview",
    icon: AnimatedBellIcon,
    isCollapsible: true,
    children: [
      {
        label: "Inbox",
        href: "/omnichannel/inbox#conversations",
        icon: FileDescriptionIcon,
        children: [
          { label: "Conversas", href: "/omnichannel/inbox#conversations", icon: FileDescriptionIcon },
          { label: "Fila", href: "/omnichannel/inbox#queues", icon: FileDescriptionIcon },
          { label: "Atribuições", href: "/omnichannel/inbox#conversations", icon: UsersIcon },
        ],
      },
      {
        label: "Tickets",
        href: "/omnichannel/inbox#conversations",
        icon: FileDescriptionIcon,
        children: [
          { label: "Pendentes", href: "/omnichannel/inbox#conversations", icon: FileDescriptionIcon },
          { label: "SLA", href: "/omnichannel#sla-status", icon: FileDescriptionIcon },
          { label: "Resolvidos", href: "/omnichannel#reports", icon: FileDescriptionIcon },
        ],
      },
      {
        label: "Contatos",
        href: "/omnichannel/customers",
        icon: UsersIcon,
        children: [
          { label: "Perfil", href: "/omnichannel/customers", icon: UsersIcon },
          { label: "Interações", href: "/omnichannel/customers", icon: FileDescriptionIcon },
        ],
      },
      {
        label: "Automação",
        href: "/omnichannel#automation",
        icon: ShieldCheck,
        children: [
          { label: "Bots", href: "/omnichannel#automation", icon: ShieldCheck },
          { label: "Regras", href: "/omnichannel#automation", icon: ShieldCheck },
          { label: "Roteamento", href: "/omnichannel#automation", icon: ShieldCheck },
        ],
      },
      {
        label: "Métricas",
        href: "/omnichannel#reports",
        icon: FileDescriptionIcon,
        children: [
          { label: "SLA", href: "/omnichannel#reports", icon: FileDescriptionIcon },
          { label: "Volume", href: "/omnichannel#reports", icon: FileDescriptionIcon },
          { label: "CSAT", href: "/omnichannel#reports", icon: FileDescriptionIcon },
        ],
      },
    ],
  },
  {
    label: "Operações",
    href: "/erp/dashboard",
    icon: BoxesIcon,
    isCollapsible: true,
    children: [
      {
        label: "Estoque",
        href: "/erp/inventory",
        icon: BoxesIcon,
        children: [
          { label: "Posição", href: "/erp/inventory", icon: BoxesIcon },
          { label: "Movimentações", href: "/erp/inventory", icon: BoxesIcon },
          { label: "Inventário", href: "/erp/inventory", icon: BoxesIcon },
        ],
      },
      {
        label: "Pedidos",
        href: "/erp/orders",
        icon: BoxesIcon,
        children: [
          { label: "Pendentes", href: "/erp/orders", icon: BoxesIcon },
          { label: "Separação", href: "/erp/orders", icon: BoxesIcon },
          { label: "Enviados", href: "/erp/orders", icon: BoxesIcon },
        ],
      },
      {
        label: "Compras",
        href: "/erp/purchasing",
        icon: BoxesIcon,
        children: [
          { label: "Ordens", href: "/erp/purchasing", icon: BoxesIcon },
          { label: "Fornecedores", href: "/erp/suppliers", icon: BoxesIcon },
          { label: "Recebimentos", href: "/erp/purchasing/receipts", icon: BoxesIcon },
        ],
      },
      {
        label: "Catálogo",
        href: "/erp/catalog",
        icon: BoxesIcon,
        children: [
          { label: "Produtos", href: "/erp/catalog", icon: BoxesIcon },
          { label: "Categorias", href: "/erp/catalog/categories", icon: BoxesIcon },
          { label: "Variações", href: "/erp/catalog", icon: BoxesIcon },
        ],
      },
      {
        label: "Logística",
        href: "/erp/logistics",
        icon: BoxesIcon,
        children: [
          { label: "Envios", href: "/erp/logistics", icon: BoxesIcon },
          { label: "Transportadoras", href: "/erp/logistics/carriers", icon: BoxesIcon },
        ],
      },
    ],
  },
  {
    label: "Financeiro",
    href: "/finance/dashboard",
    icon: DollarSignIcon,
    isCollapsible: true,
    children: [
      { label: "Dashboard", href: "/finance/dashboard", icon: LayoutPanelTopIcon },
      {
        label: "Recebíveis",
        href: "/finance?view=receivables",
        icon: DollarSignIcon,
        children: [
          { label: "Pendentes", href: "/finance?view=receivables&status=pending", icon: DollarSignIcon },
          { label: "Liquidados", href: "/finance?view=receivables&status=settled", icon: DollarSignIcon },
          { label: "Inadimplência", href: "/finance?view=receivables&status=overdue", icon: DollarSignIcon },
        ],
      },
      {
        label: "Pagáveis",
        href: "/finance?view=payables",
        icon: DollarSignIcon,
        children: [
          { label: "Pendentes", href: "/finance?view=payables&status=pending", icon: DollarSignIcon },
          { label: "Liquidados", href: "/finance?view=payables&status=settled", icon: DollarSignIcon },
          { label: "Programados", href: "/finance?view=payables&status=scheduled", icon: DollarSignIcon },
        ],
      },
      {
        label: "Transações",
        href: "/finance?view=transactions",
        icon: DollarSignIcon,
        children: [
          { label: "Extrato", href: "/finance?view=transactions", icon: FileDescriptionIcon },
          { label: "Conciliação", href: "/finance?view=reconciliation", icon: DollarSignIcon },
          { label: "Centros de Custo", href: "/finance?view=cost-centers", icon: DollarSignIcon },
        ],
      },
      {
        label: "Fluxo de Caixa",
        href: "/finance?view=cashflow",
        icon: DollarSignIcon,
        children: [
          { label: "Projeção", href: "/finance?view=cashflow&tab=forecast", icon: DollarSignIcon },
          { label: "Realizado", href: "/finance?view=cashflow&tab=actual", icon: DollarSignIcon },
        ],
      },
      {
        label: "Demonstrativos",
        href: "/finance?view=reports",
        icon: FileDescriptionIcon,
        children: [
          { label: "DRE", href: "/finance?view=reports&report=dre", icon: FileDescriptionIcon },
          { label: "Fluxo", href: "/finance?view=reports&report=cashflow", icon: DollarSignIcon },
          { label: "Resultado", href: "/finance?view=reports&report=results", icon: FileDescriptionIcon },
        ],
      },
    ],
  },
  {
    label: "Inteligência",
    href: "/intelligence",
    icon: AnimatedLightbulbIcon,
    isCollapsible: true,
    children: [
      {
        label: "Análises",
        href: "/intelligence/analytics",
        icon: FileDescriptionIcon,
        children: [
          { label: "Comercial", href: "/intelligence/analytics/commercial", icon: AnimatedTrendingUpIcon },
          { label: "Operações", href: "/intelligence/analytics/operations", icon: BoxesIcon },
          { label: "Financeiro", href: "/intelligence/analytics/finance", icon: DollarSignIcon },
        ],
      },
      {
        label: "Previsões",
        href: "/intelligence/forecasts",
        icon: AnimatedTrendingUpIcon,
        children: [
          { label: "Vendas", href: "/intelligence/forecasts/sales", icon: AnimatedTrendingUpIcon },
          { label: "Estoque", href: "/intelligence/forecasts/inventory", icon: BoxesIcon },
          { label: "Fluxo de Caixa", href: "/intelligence/forecasts/cashflow", icon: DollarSignIcon },
        ],
      },
      {
        label: "Insights",
        href: "/intelligence/insights",
        icon: AnimatedLightbulbIcon,
        children: [
          { label: "Alertas", href: "/intelligence/insights/alerts", icon: AnimatedBellIcon },
          { label: "Anomalias", href: "/intelligence/insights/anomalies", icon: FileDescriptionIcon },
          { label: "Recomendações", href: "/intelligence/insights/recommendations", icon: AnimatedLightbulbIcon },
        ],
      },
      {
        label: "Automação",
        href: "/intelligence/automation",
        icon: ShieldCheck,
        children: [
          { label: "Workflows", href: "/intelligence/automation/workflows", icon: ShieldCheck },
          { label: "Regras", href: "/intelligence/automation/rules", icon: ShieldCheck },
        ],
      },
    ],
  },
  {
    label: "Consumer",
    href: "/consumer",
    icon: Activity,
    isCollapsible: true,
    children: [
      { label: "Dashboard", href: "/consumer/dashboard", icon: LayoutPanelTopIcon },
    ],
  },
  {
    label: "AI Studio",
    href: "/ai",
    icon: AnimatedSparklesIcon,
    isCollapsible: true,
    children: [
      {
        label: "Geração",
        href: "/ai/audio",
        icon: AnimatedSparklesIcon,
        children: [
          { label: "Texto", href: "/ai/audio#tts", icon: FileDescriptionIcon },
          { label: "Imagem", href: "/ai/images#text", icon: FileDescriptionIcon },
          { label: "Vídeo", href: "/ai/video#text", icon: FileDescriptionIcon },
          { label: "Áudio", href: "/ai/audio", icon: FileDescriptionIcon },
        ],
      },
      {
        label: "Marketing",
        href: "/ai/studio",
        icon: AnimatedTrendingUpIcon,
        children: [
          { label: "Shorts", href: "/ai/studio", icon: FileDescriptionIcon },
          { label: "Campanhas", href: "/ai/social", icon: AnimatedTrendingUpIcon },
          { label: "Distribuição", href: "/ai/retail#distribution", icon: FileDescriptionIcon },
        ],
      },
      {
        label: "Varejo",
        href: "/ai/retail#profile",
        icon: BoxesIcon,
        children: [
          { label: "Perfil", href: "/ai/retail#profile", icon: UsersIcon },
          { label: "Conteúdo", href: "/ai/retail#content", icon: FileDescriptionIcon },
          { label: "Vídeo", href: "/ai/retail#video", icon: FileDescriptionIcon },
          { label: "Atribuição GMV", href: "/ai/retail#attribution", icon: DollarSignIcon },
        ],
      },
      {
        label: "Biblioteca",
        href: "/ai/books",
        icon: FileDescriptionIcon,
        children: [
          { label: "Projetos", href: "/ai/books", icon: FileDescriptionIcon },
          { label: "Templates", href: "/ai/books", icon: FileDescriptionIcon },
          { label: "Histórico", href: "/ai/books", icon: FileDescriptionIcon },
        ],
      },
    ],
  },
  {
    label: "PDV",
    href: "/pdv",
    icon: AnimatedShoppingCartIcon,
    isCollapsible: true,
    children: [
      { label: "Caixa", href: "/pdv", icon: LayoutPanelTopIcon },
      { label: "Nova Venda", href: "/pdv/sales", icon: AnimatedShoppingCartIcon },
      { label: "Histórico", href: "/pdv/history", icon: FileDescriptionIcon },
      { label: "Fechamento", href: "/pdv/closing", icon: FileDescriptionIcon },
    ],
  },
  {
    label: "RPG",
    href: "/rpg",
    icon: AnimatedDicesIcon,
    isCollapsible: true,
    children: [
      { label: "Campanhas", href: "/rpg/campaigns", icon: FileDescriptionIcon },
      { label: "Sessões", href: "/rpg/sessions", icon: FileDescriptionIcon },
      {
        label: "Wiki",
        href: "/rpg/wiki",
        icon: FileDescriptionIcon,
        children: [
          { label: "Bestiário", href: "/rpg/wiki?category=monsters", icon: FileDescriptionIcon },
          { label: "Magias", href: "/rpg/wiki?category=spells", icon: FileDescriptionIcon },
          { label: "Itens", href: "/rpg/wiki?category=equipment", icon: BoxesIcon },
          { label: "Personagens", href: "/rpg/wiki?category=classes", icon: UsersIcon },
          { label: "Regras", href: "/rpg/rules", icon: FileDescriptionIcon },
        ],
      },
    ],
  },
  {
    label: "Bem-estar",
    href: "/wellness",
    icon: Heart,
    isCollapsible: true,
    children: [
      { label: "Hoje", href: "/wellness/today", icon: LayoutPanelTopIcon },
      { label: "Histórico", href: "/wellness/timeline", icon: FileDescriptionIcon },
      { label: "Estatísticas", href: "/wellness/stats", icon: FileDescriptionIcon },
      { label: "Insights", href: "/wellness/insights", icon: AnimatedLightbulbIcon },
    ],
  },
  {
    label: "Administração",
    href: "/admin/users",
    icon: AnimatedGearIcon,
    isCollapsible: true,
    children: [
      {
        label: "Organização",
        href: "/admin/organization",
        icon: AnimatedGearIcon,
        children: [
          { label: "Empresas", href: "/admin/organization", icon: AnimatedGearIcon },
          { label: "Filiais", href: "/saas/branches", icon: AnimatedGearIcon },
          { label: "Estrutura", href: "/admin/organization", icon: AnimatedGearIcon },
        ],
      },
      {
        label: "Acessos",
        href: "/admin/users",
        icon: UsersIcon,
        children: [
          { label: "Usuários", href: "/admin/users", icon: UsersIcon },
          { label: "Papéis", href: "/admin/roles", icon: ShieldCheck },
          { label: "Permissões", href: "/admin/roles", icon: ShieldCheck },
        ],
      },
      {
        label: "Integrações",
        href: "/admin/integrations",
        icon: AnimatedGearIcon,
        children: [
          { label: "APIs", href: "/admin/integrations", icon: AnimatedGearIcon },
          { label: "Webhooks", href: "/admin/integrations", icon: AnimatedGearIcon },
          { label: "Conectores", href: "/admin/integrations", icon: AnimatedGearIcon },
        ],
      },
      {
        label: "Plataforma",
        href: "/saas/costing",
        icon: AnimatedGearIcon,
        children: [
          { label: "Tenants", href: "/saas/tenants", icon: AnimatedGearIcon },
          { label: "Custos", href: "/saas/costing", icon: DollarSignIcon },
          { label: "Uso", href: "/saas/usage", icon: FileDescriptionIcon },
          { label: "Planos", href: "/saas/settings", icon: FileDescriptionIcon },
        ],
      },
      { label: "Auditoria", href: "/admin/audit", icon: FileDescriptionIcon },
      { label: "Configurações", href: "/admin/settings", icon: AnimatedGearIcon },
    ],
  },
];
