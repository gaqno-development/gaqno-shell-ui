import {
  LayoutDashboard,
  Sparkles,
  Users,
  Package,
  DollarSign,
  ShoppingCart,
  Dices,
  MessageSquare,
  Cloud,
  Shield,
  Building2,
} from "lucide-react";
import type { ShellMenuItem } from "@/components/shell-sidebar";

export const SHELL_MENU_ITEMS: ShellMenuItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "IA", href: "/ai", icon: Sparkles },
  { label: "CRM", href: "/crm", icon: Users },
  { label: "ERP", href: "/erp", icon: Package },
  { label: "Financeiro", href: "/finance", icon: DollarSign },
  { label: "PDV", href: "/pdv", icon: ShoppingCart },
  { label: "RPG", href: "/rpg", icon: Dices },
  { label: "Omnichannel", href: "/omnichannel", icon: MessageSquare },
  { label: "SaaS", href: "/saas", icon: Cloud },
  { label: "SSO", href: "/sso", icon: Shield },
  { label: "Admin", href: "/admin", icon: Building2 },
];
