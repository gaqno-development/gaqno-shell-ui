import { 
  ShoppingCart, 
  Users, 
  Package, 
  DollarSign, 
  Settings, 
  BookOpen,
  LayoutDashboard 
} from 'lucide-react';

export interface MenuItem {
  id: string;
  label: string;
  href: string;
  icon: any;
  requiredPermissions: string[];
  children?: MenuItem[];
}

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    requiredPermissions: [],
  },
  {
    id: 'pdv',
    label: 'PDV',
    href: '/pdv',
    icon: ShoppingCart,
    requiredPermissions: ['pdv.access'],
  },
  {
    id: 'crm',
    label: 'CRM',
    href: '/dashboard/crm',
    icon: Users,
    requiredPermissions: ['crm.access'],
  },
  {
    id: 'erp',
    label: 'ERP',
    href: '/dashboard/erp',
    icon: Package,
    requiredPermissions: ['erp.access'],
  },
  {
    id: 'finance',
    label: 'Financeiro',
    href: '/dashboard/finance',
    icon: DollarSign,
    requiredPermissions: ['finance.access'],
  },
  {
    id: 'ai',
    label: 'Inteligência Artificial',
    href: '/dashboard/books',
    icon: BookOpen,
    requiredPermissions: ['ai.access'],
  },
  {
    id: 'admin',
    label: 'Administração',
    href: '/dashboard/admin',
    icon: Settings,
    requiredPermissions: ['admin.access'],
  },
];

export const ROUTE_PERMISSIONS: Record<string, string[]> = {
  '/pdv': ['pdv.access'],
  '/pdv/sales': ['pdv.sales.read'],
  '/pdv/products': ['pdv.products.manage'],
  '/pdv/inventory': ['pdv.inventory.read'],
  '/pdv/settings': ['pdv.settings.write'],
  '/crm': ['crm.access'],
  '/crm/contacts': ['crm.contacts.read'],
  '/crm/deals': ['crm.deals.read'],
  '/crm/pipeline': ['crm.pipeline.manage'],
  '/crm/settings': ['crm.settings.write'],
  '/erp': ['erp.access'],
  '/erp/inventory': ['erp.inventory.read'],
  '/erp/orders': ['erp.orders.read'],
  '/erp/settings': ['erp.settings.write'],
  '/finance': ['finance.access'],
  '/finance/transactions': ['finance.transactions.read'],
  '/finance/accounts': ['finance.accounts.manage'],
  '/finance/reports': ['finance.reports.view'],
  '/finance/investments': ['finance.investments.read'],
  '/finance/settings': ['finance.settings.write'],
  '/ai': ['ai.access'],
  '/ai/books': ['ai.books.read'],
  '/ai/insights': ['ai.insights.view'],
  '/ai/avatar': ['ai.avatar.create'],
  '/ai/portrait': ['ai.portrait.create'],
  '/admin': ['admin.access'],
  '/admin/users': ['admin.users.manage'],
  '/admin/tenants': ['admin.tenants.manage'],
  '/admin/branches': ['admin.branches.manage'],
  '/admin/settings': ['admin.settings.write'],
  '/dashboard/settings': ['admin.settings.read'],
  '/sso/users': ['admin.users.read'],
}

