import React, { useEffect, lazy, Suspense } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "@gaqno-development/frontcore/components/providers";
import { QueryProvider } from "@gaqno-development/frontcore/components/providers";
import { AuthProvider } from "@gaqno-development/frontcore/contexts";
import { ToastContainer } from "@gaqno-development/frontcore/components/ui";
import { I18nProvider, i18n } from "@gaqno-development/frontcore/i18n";
import { RouteErrorElement } from "@/components/route-error-element";
import { MfeRouteLayout } from "@/components/MfeRouteLayout";
import {
  CRM_MFE_CONFIG,
  ERP_MFE_CONFIG,
  INTELLIGENCE_MFE_CONFIG,
  CONSUMER_MFE_CONFIG,
  ADMIN_MFE_CONFIG,
  WELLNESS_MFE_CONFIG,
} from "@/config/mfe-route-config";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RecoveryPassPage from "./pages/RecoveryPassPage";
import DashboardPage from "./pages/DashboardPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import ErrorPage from "./pages/ErrorPage";
import { RootLayout } from "./components/public-layout";

// @ts-nocheck
const IntelligencePage = lazy(() => import("intelligence/App" as string));
const AIRouteLayout = lazy(() => import("ai/AIRouteLayout" as string));
const AIBookPage = lazy(() => import("ai/BookPage" as string));
const AIAudioSection = lazy(() => import("ai/AudioSection" as string));
const AIImagesSection = lazy(() => import("ai/ImagesSection" as string));
const AIVideoSection = lazy(() => import("ai/VideoSection" as string));
const AIStudioDashboard = lazy(() => import("ai/StudioDashboard" as string));
const AISocialAccountsPage = lazy(() => import("ai/SocialAccountsPage" as string));
const AIProductDataDiscoveryPage = lazy(() => import("ai/ProductDataDiscoveryPage" as string));
const AIRetailSection = lazy(() => import("ai/RetailSection" as string));
const CRMPage = lazy(() => import("crm/App" as string));
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
// @ts-nocheck
const AdminPage = lazy(() => import("admin/App" as string));
// @ts-nocheck
const SaasRouteLayout = lazy(() => import("saas/SaasRouteLayout" as string));
// @ts-nocheck
const SaasDashboardPage = lazy(() => import("saas/DashboardPage" as string));
// @ts-nocheck
const SaasCostingPage = lazy(() => import("saas/SaasCostingPage" as string));
// @ts-nocheck
const SaasCodemapView = lazy(() => import("saas/CodemapView" as string));
// @ts-nocheck
const WellnessDailyLogPage = lazy(() => import("wellness/DailyLogPage" as string));
// @ts-nocheck
const WellnessTimelinePage = lazy(() => import("wellness/TimelinePage" as string));
// @ts-nocheck
const WellnessStatsPage = lazy(() => import("wellness/StatsPage" as string));
// @ts-nocheck
const WellnessInsightsPage = lazy(() => import("wellness/InsightsPage" as string));
// @ts-nocheck
const ConsumerPage = lazy(() => import("consumer/App" as string));

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center p-6">
      <div className="animate-pulse text-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    </div>
  );
}

function SectionLoadingFallback() {
  return (
    <div className="flex min-h-[320px] flex-1 flex-col gap-4 p-6">
      <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
      <div className="flex gap-2">
        <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
        <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
        <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
      </div>
      <div className="flex-1 animate-pulse rounded-lg bg-muted/50" />
    </div>
  );
}

const router = createBrowserRouter(
  [
    {
      Component: RootLayout,
      errorElement: <RouteErrorElement />,
      children: [
        { path: "/", Component: HomePage },
        { path: "/login", Component: LoginPage },
        { path: "/register", Component: RegisterPage },
        { path: "/recovery-pass", Component: RecoveryPassPage },
        { path: "/dashboard", Component: DashboardPage },
        { path: "/dashboard/tasks", Component: DashboardPage },
        { path: "/dashboard/calendar", Component: DashboardPage },
        { path: "/dashboard/notifications", Component: DashboardPage },
        { path: "/dashboard/manager", element: <Navigate to="/dashboard" replace /> },
        { path: "/dashboard/user", element: <Navigate to="/dashboard" replace /> },
        { path: "/dashboard/settings", element: <Navigate to="/dashboard" replace /> },
        { path: "/dashboard/profile", element: <Navigate to="/dashboard" replace /> },
        { path: "/unauthorized", Component: UnauthorizedPage },
        { path: "/error", Component: ErrorPage },
        {
          path: "/ai",
          errorElement: <RouteErrorElement />,
          element: (
            <Suspense fallback={<LoadingFallback />}>
              <AIRouteLayout />
            </Suspense>
          ),
          children: [
            {
              index: true,
              element: <Navigate to="/ai/books" replace />,
            },
            {
              path: "books",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <AIBookPage />
                </Suspense>
              ),
            },
            {
              path: "audio",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <AIAudioSection />
                </Suspense>
              ),
            },
            {
              path: "images",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <AIImagesSection />
                </Suspense>
              ),
            },
            {
              path: "video",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <AIVideoSection />
                </Suspense>
              ),
            },
            {
              path: "studio",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <AIStudioDashboard />
                </Suspense>
              ),
            },
            {
              path: "social",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <AISocialAccountsPage />
                </Suspense>
              ),
            },
            {
              path: "discovery",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <AIProductDataDiscoveryPage />
                </Suspense>
              ),
            },
            {
              path: "retail",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <AIRetailSection />
                </Suspense>
              ),
            },
          ],
        },
        {
          path: "/intelligence",
          errorElement: <RouteErrorElement />,
          element: (
            <Suspense fallback={<SectionLoadingFallback />}>
              <MfeRouteLayout config={INTELLIGENCE_MFE_CONFIG} />
            </Suspense>
          ),
          children: [
            {
              index: true,
              element: <Navigate to="analytics" replace />,
            },
            {
              path: "*",
              errorElement: <RouteErrorElement />,
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <IntelligencePage />
                </Suspense>
              ),
            },
          ],
        },
        {
          path: "/consumer",
          errorElement: <RouteErrorElement />,
          element: (
            <Suspense fallback={<SectionLoadingFallback />}>
              <MfeRouteLayout config={CONSUMER_MFE_CONFIG} />
            </Suspense>
          ),
          children: [
            {
              index: true,
              element: <Navigate to="dashboard" replace />,
            },
            {
              path: "*",
              errorElement: <RouteErrorElement />,
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <ConsumerPage />
                </Suspense>
              ),
            },
          ],
        },
        {
          path: "/crm",
          errorElement: <RouteErrorElement />,
          element: (
            <Suspense fallback={<SectionLoadingFallback />}>
              <MfeRouteLayout config={CRM_MFE_CONFIG} />
            </Suspense>
          ),
          children: [
            {
              index: true,
              element: <Navigate to="dashboard/overview" replace />,
            },
            {
              path: "*",
              errorElement: <RouteErrorElement />,
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
          element: (
            <Suspense fallback={<SectionLoadingFallback />}>
              <MfeRouteLayout config={ERP_MFE_CONFIG} />
            </Suspense>
          ),
          children: [
            {
              index: true,
              element: <Navigate to="dashboard" replace />,
            },
            {
              path: "dashboard",
              errorElement: <RouteErrorElement />,
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <ERPDashboardPage />
                </Suspense>
              ),
            },
            {
              path: "catalog",
              errorElement: <RouteErrorElement />,
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <ERPCatalogPage />
                </Suspense>
              ),
            },
            {
              path: "inventory",
              errorElement: <RouteErrorElement />,
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <ERPInventoryPage />
                </Suspense>
              ),
            },
            {
              path: "orders",
              errorElement: <RouteErrorElement />,
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <ERPOrdersPage />
                </Suspense>
              ),
            },
            {
              path: "ai-content",
              errorElement: <RouteErrorElement />,
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <ERPAIContentPage />
                </Suspense>
              ),
            },
            {
              path: "*",
              errorElement: <RouteErrorElement />,
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
          element: (
            <Suspense fallback={<LoadingFallback />}>
              <SaasRouteLayout />
            </Suspense>
          ),
          children: [
            {
              index: true,
              element: <Navigate to="/saas/dashboard" replace />,
            },
            {
              path: "dashboard",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <SaasDashboardPage />
                </Suspense>
              ),
            },
            {
              path: "costing",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <SaasCostingPage />
                </Suspense>
              ),
            },
            {
              path: "codemap",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <SaasCodemapView />
                </Suspense>
              ),
            },
            {
              path: "tenants",
              element: <Navigate to="/admin/tenants" replace />,
            },
            {
              path: "usage",
              element: <Navigate to="/admin/usage" replace />,
            },
            {
              path: "branches",
              element: <Navigate to="/admin/branches" replace />,
            },
            {
              path: "settings",
              element: <Navigate to="/saas/dashboard" replace />,
            },
          ],
        },
        {
          path: "/wellness",
          errorElement: <RouteErrorElement />,
          element: (
            <Suspense fallback={<SectionLoadingFallback />}>
              <MfeRouteLayout config={WELLNESS_MFE_CONFIG} />
            </Suspense>
          ),
          children: [
            {
              index: true,
              element: <Navigate to="/wellness/today" replace />,
            },
            {
              path: "today",
              errorElement: <RouteErrorElement />,
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <WellnessDailyLogPage />
                </Suspense>
              ),
            },
            {
              path: "timeline",
              errorElement: <RouteErrorElement />,
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <WellnessTimelinePage />
                </Suspense>
              ),
            },
            {
              path: "stats",
              errorElement: <RouteErrorElement />,
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <WellnessStatsPage />
                </Suspense>
              ),
            },
            {
              path: "insights",
              errorElement: <RouteErrorElement />,
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <WellnessInsightsPage />
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
          element: (
            <Suspense fallback={<SectionLoadingFallback />}>
              <MfeRouteLayout config={ADMIN_MFE_CONFIG} />
            </Suspense>
          ),
          children: [
            {
              index: true,
              element: <Navigate to="users" replace />,
            },
            {
              path: "*",
              errorElement: <RouteErrorElement />,
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

const LANG_STORAGE_KEY = "gaqno-lng";

function AppWithI18n() {
  useEffect(() => {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    const supported = ["en", "pt-BR", "de", "es", "ko"];
    if (saved && supported.includes(saved)) {
      i18n.changeLanguage(saved);
    }
  }, []);

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

export default function App() {
  return (
    <I18nProvider>
      <AppWithI18n />
    </I18nProvider>
  );
}
