import React, { useEffect, useState } from "react";
import { useLocation, Outlet, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { DashboardLayout } from "@gaqno-development/frontcore/components";
import { AppProvider } from "@gaqno-development/frontcore/components/providers";
import { WhiteLabelProvider } from "@gaqno-development/frontcore/components/providers";
import { TenantProvider } from "@gaqno-development/frontcore/contexts";
import { useFilteredMenu } from "@gaqno-development/frontcore/hooks";
import { useAuth } from "@gaqno-development/frontcore/hooks";

const AUTHENTICATED_ROUTES = [
  "/dashboard",
  "/ai",
  "/crm",
  "/erp",
  "/finance",
  "/pdv",
  "/admin",
  "/sso",
  "/rpg",
  "/omnichannel",
];

const PUBLIC_ROUTES = ["/login", "/register", "/"];

const MICRO_FRONTEND_ROUTES = [
  "/ai",
  "/crm",
  "/erp",
  "/finance",
  "/pdv",
  "/rpg",
  "/admin",
  "/sso",
  "/omnichannel",
];

function shouldShowDashboardLayout(pathname: string): boolean {
  if (
    PUBLIC_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    )
  ) {
    return false;
  }
  return AUTHENTICATED_ROUTES.some((route) => pathname.startsWith(route));
}

function isMicroFrontendRoute(pathname: string): boolean {
  return MICRO_FRONTEND_ROUTES.some((route) => pathname.startsWith(route));
}

function isAuthenticatedRoute(pathname: string): boolean {
  return AUTHENTICATED_ROUTES.some((route) => pathname.startsWith(route));
}

function getTransitionKey(pathname: string, locationKey: string): string {
  if (isMicroFrontendRoute(pathname)) {
    const firstSegment = pathname.split("/").filter(Boolean)[0];
    return (firstSegment ?? pathname) || locationKey;
  }
  return locationKey;
}

export function ShellLayoutWrapper() {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [shouldShowLayout, setShouldShowLayout] = useState(false);
  const [isMicroFrontend, setIsMicroFrontend] = useState(false);
  const menuItems = useFilteredMenu();
  const transitionKey = getTransitionKey(pathname, location.key);

  useEffect(() => {
    const isMFE = isMicroFrontendRoute(pathname);
    const showLayout =
      shouldShowDashboardLayout(pathname) && !loading && !!user;
    setShouldShowLayout(showLayout);
    setIsMicroFrontend(isMFE);
  }, [pathname, loading, user]);

  useEffect(() => {
    if (!loading && !user && isAuthenticatedRoute(pathname)) {
      navigate("/login");
    }
  }, [loading, user, pathname, navigate]);

  const pageTransition = {
    initial: { opacity: 0, x: 8 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -8 },
    transition: { duration: 0.2 },
  };

  if (!shouldShowLayout) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={transitionKey}
          initial={pageTransition.initial}
          animate={pageTransition.animate}
          exit={pageTransition.exit}
          transition={pageTransition.transition}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AppProvider>
      <WhiteLabelProvider>
        <TenantProvider>
          <DashboardLayout menuItems={menuItems}>
            <AnimatePresence mode="wait">
              <motion.div
                key={transitionKey}
                initial={pageTransition.initial}
                animate={pageTransition.animate}
                exit={pageTransition.exit}
                transition={pageTransition.transition}
                className="min-h-0 flex-1 flex flex-col"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </DashboardLayout>
        </TenantProvider>
      </WhiteLabelProvider>
    </AppProvider>
  );
}
