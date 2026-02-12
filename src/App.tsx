import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
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
import { lazy, Suspense } from "react";

// @ts-nocheck
const AIPage = lazy(async () => import("ai/App" as string));
const CRMPage = lazy(async () => import("crm/App" as string));
const ERPPage = lazy(async () => import("erp/App" as string));
const FinancePage = lazy(async () => import("finance/App" as string));
const PDVPage = lazy(async () => import("pdv/App" as string));
const RPGPage = lazy(async () => import("rpg/App" as string));
const SSOPage = lazy(async () => import("sso/App" as string));
const SaasPage = lazy(
  async () =>
    import("saas/App" as string).catch(() => ({ default: CostingPage }))
);
// @ts-nocheck
const OmnichannelPage = lazy(async () => import("omnichannel/App" as string));
// @ts-nocheck
const WellnessPage = lazy(async () => import("wellness/App" as string));

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
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <CRMPage />
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
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <ERPPage />
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
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <OmnichannelPage />
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
          path: "/wellness",
          errorElement: <RouteErrorElement />,
          children: [
            {
              index: true,
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <WellnessPage />
                </Suspense>
              ),
            },
            {
              path: "*",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <WellnessPage />
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
        { path: "/admin/domains", Component: DomainsPage },
        { path: "/admin/domains/new", Component: DomainFormPage },
        { path: "/admin/domains/:id/edit", Component: DomainEditPage },
        { path: "/admin/domains/ssl", Component: SSLStatusPage },
        { path: "/admin/tenants", Component: TenantsPage },
        { path: "/admin/tenants/new", Component: TenantFormPage },
        { path: "/admin/tenants/:id/edit", Component: TenantEditPage },
        { path: "/admin/tenants/costs", Component: TenantCostsPage },
        { path: "/admin/tenants/:tenantId/costs", Component: TenantCostsPage },
        { path: "/admin/branches", Component: BranchesPage },
        { path: "/admin/branches/new", Component: BranchFormPage },
        { path: "/admin/branches/:id/edit", Component: BranchEditPage },
        { path: "/admin/users", Component: UsersPage },
        { path: "/admin/users/new", Component: UserFormPage },
        { path: "/admin/users/:id/edit", Component: UserEditPage },
        { path: "/admin/roles", Component: AdminRolesPage },
        { path: "/admin/menu", Component: AdminMenuPage },
        { path: "/admin/settings", Component: AdminSettingsPage },
        { path: "/admin/usage", Component: AdminUsagePage },
        {
          path: "/admin/costing",
          element: (
            <Suspense fallback={<LoadingFallback />}>
              <SaasPage />
            </Suspense>
          ),
        },
      ],
    },
  ],
  {
    future: {
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
