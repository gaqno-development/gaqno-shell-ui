import type { MfeRouteLayoutConfig } from "@/components/MfeRouteLayout";
import {
  LayoutDashboard,
  TrendingUp,
  Package,
  ClipboardList,
  DollarSign,
  BarChart3,
  ShieldCheck,
  Sparkles,
  Music,
  Image,
  Video,
  Database,
  ShoppingBag,
  Share2,
  Network,
  ShoppingCart,
  Warehouse,
} from "lucide-react";
import { GearIcon, TargetIcon, UsersIcon } from "@gaqno-development/frontcore/components/icons";
import { BookIcon } from "@gaqno-development/frontcore/components/icons";

const iconCls = "h-4 w-4";

export const CRM_MFE_CONFIG: MfeRouteLayoutConfig = {
  basePath: "/crm",
  titleKey: "crm.title",
  layoutId: "crmActiveTab",
  tabGroups: [
    { groupKey: "crm.groupOverview", tabIds: ["dashboard"] },
    { groupKey: "crm.groupBusiness", tabIds: ["sales", "customers", "inventory", "operations", "finance"] },
    { groupKey: "crm.groupInsights", tabIds: ["reports", "automation", "ai-marketing"] },
    { groupKey: "crm.groupAdministration", tabIds: ["administration", "settings"] },
  ],
  tabs: [
    { id: "dashboard", path: "dashboard/overview", labelKey: "crm.dashboard", icon: <LayoutDashboard className={iconCls} /> },
    { id: "sales", path: "sales/leads", labelKey: "crm.sales", icon: <TrendingUp className={iconCls} /> },
    { id: "customers", path: "customers/accounts", labelKey: "crm.customers", icon: <UsersIcon className={iconCls} /> },
    { id: "inventory", path: "inventory/products", labelKey: "crm.inventory", icon: <Package className={iconCls} /> },
    { id: "operations", path: "operations/order-fulfillment", labelKey: "crm.operations", icon: <ClipboardList className={iconCls} /> },
    { id: "finance", path: "finance/invoices", labelKey: "crm.finance", icon: <DollarSign className={iconCls} /> },
    { id: "reports", path: "reports/analytics", labelKey: "crm.reports", icon: <BarChart3 className={iconCls} /> },
    { id: "automation", path: "automation/workflows", labelKey: "crm.automation", icon: <TargetIcon className={iconCls} /> },
    { id: "ai-marketing", path: "ai-marketing/video", labelKey: "crm.aiMarketing", icon: <Sparkles className={iconCls} /> },
    { id: "administration", path: "administration/users", labelKey: "crm.administration", icon: <ShieldCheck className={iconCls} /> },
    { id: "settings", path: "settings/organization", labelKey: "crm.settings", icon: <GearIcon className={iconCls} /> },
  ],
};

export const AI_MFE_CONFIG: MfeRouteLayoutConfig = {
  basePath: "/ai",
  titleKey: "ai.title",
  layoutId: "aiActiveTab",
  tabs: [
    { id: "books", path: "books", labelKey: "ai.books", icon: <BookIcon className={iconCls} /> },
    { id: "audio", path: "audio", labelKey: "ai.audio", icon: <Music className={iconCls} /> },
    { id: "images", path: "images", labelKey: "ai.images", icon: <Image className={iconCls} /> },
    { id: "video", path: "video", labelKey: "ai.video", icon: <Video className={iconCls} /> },
    { id: "studio", path: "studio", labelKey: "ai.studio", icon: <LayoutDashboard className={iconCls} /> },
    { id: "social", path: "social", labelKey: "ai.social", icon: <Share2 className={iconCls} /> },
    { id: "discovery", path: "discovery", labelKey: "ai.discovery", icon: <Database className={iconCls} /> },
    { id: "retail", path: "retail", labelKey: "ai.retail", icon: <ShoppingBag className={iconCls} /> },
  ],
};

export const ERP_MFE_CONFIG: MfeRouteLayoutConfig = {
  basePath: "/erp",
  titleKey: "erp.title",
  layoutId: "erpActiveTab",
  tabs: [
    { id: "dashboard", path: "dashboard", labelKey: "erp.dashboard", icon: <LayoutDashboard className={iconCls} /> },
    { id: "catalog", path: "catalog", labelKey: "erp.catalog", icon: <Package className={iconCls} /> },
    { id: "orders", path: "orders", labelKey: "erp.orders", icon: <ShoppingCart className={iconCls} /> },
    { id: "inventory", path: "inventory", labelKey: "erp.inventory", icon: <Warehouse className={iconCls} /> },
    { id: "ai-content", path: "ai-content", labelKey: "erp.aiContent", icon: <Sparkles className={iconCls} /> },
  ],
};

export const SAAS_MFE_CONFIG: MfeRouteLayoutConfig = {
  basePath: "/saas",
  titleKey: "saas.title",
  layoutId: "saasActiveTab",
  tabs: [
    { id: "dashboard", path: "dashboard", labelKey: "saas.dashboard", icon: <LayoutDashboard className={iconCls} /> },
    { id: "costing", path: "costing", labelKey: "saas.costing", icon: <DollarSign className={iconCls} /> },
    { id: "codemap", path: "codemap", labelKey: "saas.codemap", icon: <Network className={iconCls} /> },
  ],
};

export const WELLNESS_MFE_CONFIG: MfeRouteLayoutConfig = {
  basePath: "/wellness",
  titleKey: "wellness.title",
  layoutId: "wellnessActiveTab",
  mobileNavActiveIndicatorClassName: "absolute inset-x-2 -top-px h-0.5 bg-emerald-500 rounded-full",
  mobileNavActiveLabelClassName: "text-emerald-500 font-medium",
  tabs: [
    { id: "today", path: "today", labelKey: "wellness.today", icon: <span>📝</span> },
    { id: "timeline", path: "timeline", labelKey: "wellness.timeline", icon: <span>📅</span> },
    { id: "stats", path: "stats", labelKey: "wellness.stats", icon: <span>📊</span> },
    { id: "insights", path: "insights", labelKey: "wellness.insights", icon: <span>🧠</span> },
  ],
};
