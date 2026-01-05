import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@gaqno-dev/frontcore/components/providers";
import { QueryProvider } from "@gaqno-dev/frontcore/components/providers";
import { AuthProvider } from "@gaqno-dev/frontcore/contexts";
import { ToastContainer } from "@gaqno-dev/frontcore/components/ui";
import { ShellLayoutWrapper } from "@/components/shell-layout-wrapper";
import { RouteErrorElement } from "@/components/route-error-element";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ManagerDashboardPage from "./pages/ManagerDashboardPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import SettingsPage from "./pages/SettingsPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import ErrorPage from "./pages/ErrorPage";
import DomainsPage from "./pages/admin/DomainsPage";
import DomainFormPage from "./pages/admin/DomainFormPage";
import DomainEditPage from "./pages/admin/DomainEditPage";
import SSLStatusPage from "./pages/admin/SSLStatusPage";
import TenantCostsPage from "./pages/admin/TenantCostsPage";
import TenantsPage from "./pages/admin/TenantsPage";
import BranchesPage from "./pages/admin/BranchesPage";
import UsersPage from "./pages/admin/UsersPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import { lazy, Suspense } from "react";

// @ts-nocheck
const AIPage = lazy(async () => import("ai/App" as string));
const BooksPage = lazy(async () => import("ai/BooksPage" as string));
const BookDetailPage = lazy(async () => import("ai/BookDetailPage" as string));
const BookChaptersPage = lazy(
  async () => import("ai/BookChaptersPage" as string)
);
const BookCoverPage = lazy(async () => import("ai/BookCoverPage" as string));
const BookExportPage = lazy(async () => import("ai/BookExportPage" as string));
const CRMPage = lazy(async () => import("crm/App" as string));
const ERPPage = lazy(async () => import("erp/App" as string));
const FinancePage = lazy(async () => import("finance/App" as string));
const PDVPage = lazy(async () => import("pdv/App" as string));
const RPGPage = lazy(async () => import("rpg/App" as string));
const SSOPage = lazy(async () => import("sso/App" as string));

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
        { path: "/unauthorized", Component: UnauthorizedPage },
        { path: "/error", Component: ErrorPage },
        {
          path: "/ai",
          errorElement: <RouteErrorElement />,
          element: (
            <Suspense fallback={<LoadingFallback />}>
              <AIPage />
            </Suspense>
          ),
          children: [
            {
              path: "books",
              Component: BooksPage,
            },
            {
              path: "books/:id/chapters",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <BookChaptersPage />
                </Suspense>
              ),
            },
            {
              path: "books/:id/cover",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <BookCoverPage />
                </Suspense>
              ),
            },
            {
              path: "books/:id/export",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <BookExportPage />
                </Suspense>
              ),
            },
            {
              path: "books/:id",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <BookDetailPage />
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
              path: "sessions/:id",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <RPGPage />
                </Suspense>
              ),
            },
            {
              path: "sessions/:id/master",
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
        { path: "/admin/tenants/costs", Component: TenantCostsPage },
        { path: "/admin/tenants/:tenantId/costs", Component: TenantCostsPage },
        { path: "/admin/branches", Component: BranchesPage },
        { path: "/admin/users", Component: UsersPage },
        { path: "/admin/settings", Component: AdminSettingsPage },
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
