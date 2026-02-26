import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { ThemeProvider } from "@gaqno-development/frontcore/components/providers";
import { QueryProvider } from "@gaqno-development/frontcore/components/providers";
import { AuthProvider } from "@gaqno-development/frontcore/contexts";
import { ToastContainer } from "@gaqno-development/frontcore/components/ui";
import { ShellLayoutWrapper } from "@/components/shell-layout-wrapper";
import { RouteErrorElement } from "@/components/route-error-element";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ManagerDashboardPage from "./pages/ManagerDashboardPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import ErrorPage from "./pages/ErrorPage";
import DomainsPage from "./pages/admin/DomainsPage";
import DomainFormPage from "./pages/admin/DomainFormPage";
import DomainEditPage from "./pages/admin/DomainEditPage";
import SSLStatusPage from "./pages/admin/SSLStatusPage";
import TenantCostsPage from "./pages/admin/TenantCostsPage";
import TenantsPage from "./pages/admin/TenantsPage";
import TenantFormPage from "./pages/admin/TenantFormPage";
import TenantEditPage from "./pages/admin/TenantEditPage";
import BranchesPage from "./pages/admin/BranchesPage";
import BranchFormPage from "./pages/admin/BranchFormPage";
import BranchEditPage from "./pages/admin/BranchEditPage";
import UsersPage from "./pages/admin/UsersPage";
import UserFormPage from "./pages/admin/UserFormPage";
import UserEditPage from "./pages/admin/UserEditPage";
import AdminRolesPage from "./pages/admin/AdminRolesPage";
import AdminMenuPage from "./pages/admin/AdminMenuPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import AdminUsagePage from "./pages/admin/AdminUsagePage";
import CostingPage from "./pages/admin/CostingPage";
import AIModelsPage from "./pages/admin/AIModelsPage";
import NexAiRequestsPage from "./pages/admin/NexAiRequestsPage";
import DashboardShell01Page from "./pages/DashboardShell01Page";
import ApplicationShell01Page from "./pages/ApplicationShell01Page";
import { lazy, Suspense } from "react";

// @ts-nocheck
const AIPage = lazy(() => import("ai/App" as string));
const CRMPage = lazy(() => import("crm/App" as string));
const CRMOverviewPage = lazy(() => import("crm/OverviewPage" as string));
const CRMLeadsPage = lazy(() => import("crm/LeadsPage" as string));
const CRMDealsPage = lazy(() => import("crm/DealsPage" as string));
const CRMContactsPage = lazy(() => import("crm/ContactsPage" as string));
const CRMInteractionHistoryPage = lazy(() => import("crm/InteractionHistoryPage" as string));
const ERPPage = lazy(() => import("erp/App" as string));
const ERPDashboardPage = lazy(() => import("erp/DashboardPage" as string));
const ERPCatalogPage = lazy(() => import("erp/CatalogPage" as string));
const ERPInventoryPage = lazy(() => import("erp/InventoryPage" as string));
const ERPOrdersPage = lazy(() => import("erp/OrdersListPage" as string));
const ERPAIContentPage = lazy(() => import("erp/AIContentPage" as string));
const FinancePage = lazy(() => import("finance/App" as string));
const PDVPage = lazy(() => import("pdv/App" as string));
const RPGPage = lazy(() => import("rpg/App" as string));
const SSOPage = lazy(() => import("sso/App" as string));
// @ts-nocheck
const OmnichannelPage = lazy(() => import("omnichannel/App" as string));
const OmnichannelInboxPage = lazy(() => import("omnichannel/InboxView" as string));
const OmnichannelDashboardPage = lazy(() => import("omnichannel/DashboardPage" as string));
const OmnichannelCustomersPage = lazy(() => import("omnichannel/CustomersPage" as string));
const OmnichannelAgentsPage = lazy(() => import("omnichannel/AgentsPage" as string));
const OmnichannelTeamsPage = lazy(() => import("omnichannel/TeamsPage" as string));
const OmnichannelSettingsPage = lazy(() => import("omnichannel/SettingsPage" as string));
const OmnichannelReportsPage = lazy(() => import("omnichannel/ReportsPage" as string));
// @ts-nocheck
const AdminPage = lazy(() => import("admin/App" as string));
// @ts-nocheck
const SaasPage = lazy(() => import("saas/App" as string));

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center p-6">
      <div className="animate-pulse text-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    </div>
  );
}

const router = createBrowserRouter(
  [
    {
      Component: ShellLayoutWrapper,
      errorElement: <RouteErrorElement />,
      children: [
        { path: "/", Component: HomePage },
        { path: "/login", Component: LoginPage },
        { path: "/register", Component: RegisterPage },
        { path: "/dashboard", Component: DashboardPage },
        { path: "/dashboard/manager", Component: ManagerDashboardPage },
        { path: "/dashboard/user", Component: UserDashboardPage },
        { path: "/dashboard/settings", Component: SettingsPage },
        { path: "/dashboard/profile", Component: ProfilePage },
        { path: "/dashboard-shell-01", Component: DashboardShell01Page },
        { path: "/application-shell-01", Component: ApplicationShell01Page },
        { path: "/unauthorized", Component: UnauthorizedPage },
        { path: "/error", Component: ErrorPage },
        {
          path: "/ai",
          errorElement: <RouteErrorElement />,
          children: [
            {
              index: true,
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <AIPage />
                </Suspense>
              ),
            },
            {
              path: "*",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <AIPage />
                </Suspense>
              ),
            },
          ],
        },
        {
          path: "/crm",
          errorElement: <RouteErrorElement />,
          children: [
            {
              index: true,
              element: <Navigate to="dashboard" replace />,
            },
            {
              path: "dashboard",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <CRMOverviewPage />
                </Suspense>
              ),
            },
            {
              path: "sales/leads",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <CRMLeadsPage />
                </Suspense>
              ),
            },
            {
              path: "sales/deals",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <CRMDealsPage />
                </Suspense>
              ),
            },
            {
              path: "customers/contacts",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <CRMContactsPage />
                </Suspense>
              ),
            },
            {
              path: "customers/interaction-history",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <CRMInteractionHistoryPage />
                </Suspense>
              ),
            },
            {
              path: "*",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <CRMPage />
                </Suspense>
              ),
            },
          ],
        },
        {
          path: "/erp",
          errorElement: <RouteErrorElement />,
          children: [
            {
              index: true,
              element: <Navigate to="dashboard" replace />,
            },
            {
              path: "dashboard",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <ERPDashboardPage />
                </Suspense>
              ),
            },
            {
              path: "catalog",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <ERPCatalogPage />
                </Suspense>
              ),
            },
            {
              path: "inventory",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <ERPInventoryPage />
                </Suspense>
              ),
            },
            {
              path: "orders",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <ERPOrdersPage />
                </Suspense>
              ),
            },
            {
              path: "ai-content",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <ERPAIContentPage />
                </Suspense>
              ),
            },
            {
              path: "*",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <ERPPage />
                </Suspense>
              ),
            },
          ],
        },
        {
          path: "/finance",
          errorElement: <RouteErrorElement />,
          children: [
            {
              index: true,
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <FinancePage />
                </Suspense>
              ),
            },
            {
              path: "*",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <FinancePage />
                </Suspense>
              ),
            },
          ],
        },
        {
          path: "/pdv",
          errorElement: <RouteErrorElement />,
          children: [
            {
              index: true,
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <PDVPage />
                </Suspense>
              ),
            },
            {
              path: "*",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <PDVPage />
                </Suspense>
              ),
            },
          ],
        },
        {
          path: "/rpg",
          errorElement: <RouteErrorElement />,
          children: [
            {
              index: true,
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <RPGPage />
                </Suspense>
              ),
            },
            {
              path: "*",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <RPGPage />
                </Suspense>
              ),
            },
          ],
        },
        {
          path: "/omnichannel",
          errorElement: <RouteErrorElement />,
          children: [
            {
              index: true,
              element: <Navigate to="inbox" replace />,
            },
            {
              path: "inbox",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <OmnichannelInboxPage />
                </Suspense>
              ),
            },
            {
              path: "dashboard",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <OmnichannelDashboardPage />
                </Suspense>
              ),
            },
            {
              path: "customers",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <OmnichannelCustomersPage />
                </Suspense>
              ),
            },
            {
              path: "reports",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <OmnichannelReportsPage />
                </Suspense>
              ),
            },
            {
              path: "agents",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <OmnichannelAgentsPage />
                </Suspense>
              ),
            },
            {
              path: "teams",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <OmnichannelTeamsPage />
                </Suspense>
              ),
            },
            {
              path: "settings",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <OmnichannelSettingsPage />
                </Suspense>
              ),
            },
            {
              path: "*",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <OmnichannelPage />
                </Suspense>
              ),
            },
          ],
        },
        {
          path: "/saas",
          errorElement: <RouteErrorElement />,
          children: [
            {
              index: true,
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <SaasPage />
                </Suspense>
              ),
            },
            {
              path: "*",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <SaasPage />
                </Suspense>
              ),
            },
          ],
        },
        {
          path: "/sso",
          errorElement: <RouteErrorElement />,
          children: [
            {
              index: true,
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <SSOPage />
                </Suspense>
              ),
            },
            {
              path: "*",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <SSOPage />
                </Suspense>
              ),
            },
          ],
        },
        {
          path: "/admin",
          errorElement: <RouteErrorElement />,
          children: [
            { path: "domains", Component: DomainsPage },
            { path: "domains/new", Component: DomainFormPage },
            { path: "domains/:id/edit", Component: DomainEditPage },
            { path: "domains/ssl", Component: SSLStatusPage },
            { path: "tenants", Component: TenantsPage },
            { path: "tenants/new", Component: TenantFormPage },
            { path: "tenants/:id/edit", Component: TenantEditPage },
            { path: "tenants/costs", Component: TenantCostsPage },
            { path: "tenants/:tenantId/costs", Component: TenantCostsPage },
            { path: "branches", Component: BranchesPage },
            { path: "branches/new", Component: BranchFormPage },
            { path: "branches/:id/edit", Component: BranchEditPage },
            { path: "users", Component: UsersPage },
            { path: "users/new", Component: UserFormPage },
            { path: "users/:id/edit", Component: UserEditPage },
            { path: "roles", Component: AdminRolesPage },
            { path: "menu", Component: AdminMenuPage },
            { path: "settings", Component: AdminSettingsPage },
            { path: "usage", Component: AdminUsagePage },
            { path: "costing", Component: CostingPage },
            { path: "ai-models", Component: AIModelsPage },
            { path: "ai-requests", Component: NexAiRequestsPage },
            {
              index: true,
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <AdminPage />
                </Suspense>
              ),
            },
            {
              path: "*",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <AdminPage />
                </Suspense>
              ),
            },
          ],
        },
      ],
    },
  ],
  {
    future: {
      // @ts-ignore
      v7_startTransition: true,
    },
  },
);

export default function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryProvider>
        <AuthProvider>
          <RouterProvider router={router} />
          <ToastContainer />
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
