import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { AppProvider } from "@gaqno-development/frontcore/components/providers";
import { WhiteLabelProvider } from "@gaqno-development/frontcore/components/providers";
import { TenantProvider } from "@gaqno-development/frontcore/contexts";
import { MicroFrontendErrorBoundary } from "@/components/microfrontend-error-boundary";
import { RootErrorBoundary } from "@/components/root-error-boundary";
import { ShellLayoutWrapper } from "@/components/shell-layout-wrapper";

const PUBLIC_PATHS = ["/", "/login", "/register", "/recovery-pass"];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

const pageTransition = {
  initial: { opacity: 1, x: 12 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 1, x: -12 },
  transition: { duration: 0.2 },
};

export function PublicLayout() {
  const location = useLocation();
  return (
    <RootErrorBoundary>
      <AppProvider>
        <WhiteLabelProvider>
          <TenantProvider>
            <MicroFrontendErrorBoundary>
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.key}
                  initial={pageTransition.initial}
                  animate={pageTransition.animate}
                  exit={pageTransition.exit}
                  transition={pageTransition.transition}
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </MicroFrontendErrorBoundary>
          </TenantProvider>
        </WhiteLabelProvider>
      </AppProvider>
    </RootErrorBoundary>
  );
}

export function RootLayout() {
  const { pathname } = useLocation();
  if (isPublicRoute(pathname)) {
    return <PublicLayout />;
  }
  return <ShellLayoutWrapper />;
}
