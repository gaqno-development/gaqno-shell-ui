import React, { useEffect } from "react";
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
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RecoveryPassPage from "./pages/RecoveryPassPage";
import DashboardPage from "./pages/DashboardPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import ErrorPage from "./pages/ErrorPage";
import { lazy, Suspense } from "react";
import { RootLayout } from "./components/public-layout";

// @ts-nocheck
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
const OmnichannelInboxPage = lazy(
  () => import("omnichannel/InboxView" as string),
);
const OmnichannelDashboardPage = lazy(
  () => import("omnichannel/DashboardPage" as string),
);
const OmnichannelCustomersPage = lazy(
  () => import("omnichannel/CustomersPage" as string),
);
const OmnichannelAgentsPage = lazy(
  () => import("omnichannel/AgentsPage" as string),
);
const OmnichannelTeamsPage = lazy(
  () => import("omnichannel/TeamsPage" as string),
);
const OmnichannelSettingsPage = lazy(
  () => import("omnichannel/SettingsPage" as string),
);
const OmnichannelReportsPage = lazy(
  () => import("omnichannel/ReportsPage" as string),
);
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
const WellnessRouteLayout = lazy(() => import("wellness/WellnessRouteLayout" as string));
// @ts-nocheck
const WellnessDailyLogPage = lazy(() => import("wellness/DailyLogPage" as string));
// @ts-nocheck
const WellnessTimelinePage = lazy(() => import("wellness/TimelinePage" as string));
// @ts-nocheck
const WellnessStatsPage = lazy(() => import("wellness/StatsPage" as string));
// @ts-nocheck
const WellnessInsightsPage = lazy(() => import("wellness/InsightsPage" as string));

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
      Component: RootLayout,
      errorElement: <RouteErrorElement />,
      children: [
        { path: "/", Component: HomePage },
        { path: "/login", Component: LoginPage },
        { path: "/register", Component: RegisterPage },
        { path: "/recovery-pass", Component: RecoveryPassPage },
        { path: "/dashboard", Component: DashboardPage },
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
          path: "/crm",
          errorElement: <RouteErrorElement />,
          children: [
            {
              index: true,
              element: <Navigate to="dashboard/overview" replace />,
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
          ],
        },
        {
          path: "/wellness",
          errorElement: <RouteErrorElement />,
          element: (
            <Suspense fallback={<LoadingFallback />}>
              <WellnessRouteLayout />
            </Suspense>
          ),
          children: [
            {
              index: true,
              element: <Navigate to="/wellness/today" replace />,
            },
            {
              path: "today",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <WellnessDailyLogPage />
                </Suspense>
              ),
            },
            {
              path: "timeline",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <WellnessTimelinePage />
                </Suspense>
              ),
            },
            {
              path: "stats",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <WellnessStatsPage />
                </Suspense>
              ),
            },
            {
              path: "insights",
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
          children: [
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
