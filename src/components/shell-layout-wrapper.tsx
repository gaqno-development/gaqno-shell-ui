import React from "react";
import { Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { AppProvider } from "@gaqno-development/frontcore/components/providers";
import { WhiteLabelProvider } from "@gaqno-development/frontcore/components/providers";
import { TenantProvider } from "@gaqno-development/frontcore/contexts";
import { useAuth } from "@gaqno-development/frontcore/hooks";
import { MicroFrontendErrorBoundary } from "@/components/microfrontend-error-boundary";
import { RootErrorBoundary } from "@/components/root-error-boundary";
import { ShellLayout } from "@/components/shell-layout";
import { useShellLayout } from "@/hooks/useShellLayout";

function ShellLayoutLoading() {
  return (
    <RootErrorBoundary inline>
      <AppProvider>
        <WhiteLabelProvider>
          <TenantProvider>
            <div className="flex items-center justify-center h-screen w-full bg-background">
              <div className="animate-pulse text-center">
                <p className="text-muted-foreground">Carregando...</p>
              </div>
            </div>
          </TenantProvider>
        </WhiteLabelProvider>
      </AppProvider>
    </RootErrorBoundary>
  );
}

function AuthenticatedShellLayout() {
  const {
    shouldShowLayout,
    transitionKey,
    menuItems,
    pageTransition,
  } = useShellLayout();

  if (!shouldShowLayout) {
    return (
      <RootErrorBoundary inline>
        <AppProvider>
          <WhiteLabelProvider>
            <TenantProvider>
              <MicroFrontendErrorBoundary>
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
              </MicroFrontendErrorBoundary>
            </TenantProvider>
          </WhiteLabelProvider>
        </AppProvider>
      </RootErrorBoundary>
    );
  }

  return (
    <RootErrorBoundary inline>
      <AppProvider>
        <WhiteLabelProvider>
          <TenantProvider>
            <ShellLayout
              menuItems={menuItems}
              transitionKey={transitionKey}
              pageTransition={pageTransition}
            />
          </TenantProvider>
        </WhiteLabelProvider>
      </AppProvider>
    </RootErrorBoundary>
  );
}

export function ShellLayoutWrapper() {
  const { loading } = useAuth();

  if (loading) {
    return <ShellLayoutLoading />;
  }

  return <AuthenticatedShellLayout />;
}
