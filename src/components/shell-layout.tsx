import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  FacebookIcon,
  InstagramIcon,
  LanguagesIcon,
  LinkedinIcon,
  TwitterIcon,
} from "lucide-react";

import { ShellSidebar } from "@/components/shell-sidebar";
import { useAuth } from "@gaqno-development/frontcore/hooks";
import { useUIStore } from "@gaqno-development/frontcore/store/uiStore";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@gaqno-development/frontcore/components/ui";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@gaqno-development/frontcore/components/ui";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@gaqno-development/frontcore/components/ui";
import { Button } from "@gaqno-development/frontcore/components/ui";
import { Separator } from "@gaqno-development/frontcore/components/ui";

import LanguageDropdown from "@/components/shadcn-studio/blocks/dropdown-language";
import ProfileDropdown from "@/components/shadcn-studio/blocks/dropdown-profile";
import { MicroFrontendErrorBoundary } from "@/components/microfrontend-error-boundary";
import type { ShellMenuItem } from "@/components/shell-sidebar";

type ShellLayoutMenuItems = ShellMenuItem[] | undefined;

export type PageTransitionConfig = {
  initial: { opacity: number; x?: number };
  animate: { opacity: number; x?: number };
  exit: { opacity: number; x?: number };
  transition: { duration: number };
};

export type ShellLayoutProps = {
  menuItems?: ShellLayoutMenuItems;
  transitionKey: string;
  pageTransition: PageTransitionConfig;
};

function useShellHeader() {
  const navigate = useNavigate();
  const { profile, user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return { profile, user, handleSignOut };
}

export function ShellLayout({
  menuItems,
  transitionKey,
  pageTransition,
}: ShellLayoutProps) {
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const { profile, user, handleSignOut } = useShellHeader();
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const displayName = profile?.name ?? user?.email ?? null;
  const avatarFallback = displayName?.slice(0, 2).toUpperCase() ?? "?";

  return (
    <SidebarProvider
      open={sidebarOpen}
      defaultOpen={sidebarOpen}
      onOpenChange={setSidebarOpen}
      className="flex h-dvh w-full overflow-hidden"
    >
      <ShellSidebar menuItems={menuItems} />
      <SidebarInset
        className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
        onClick={() => sidebarOpen && setSidebarOpen(false)}
      >
        <header className="bg-card sticky top-0 z-40 shrink-0 border-b">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-2 sm:px-6">
            <div className="flex min-w-0 items-center gap-4">
              <SidebarTrigger className="[&_svg]:!size-5" />
              <Separator
                orientation="vertical"
                className="hidden !h-4 sm:block"
              />
              <Breadcrumb className="hidden min-w-0 shrink sm:block">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  {pathSegments.map((segment, i) => {
                    const href = "/" + pathSegments.slice(0, i + 1).join("/");
                    const isLast = i === pathSegments.length - 1;
                    const label =
                      segment.charAt(0).toUpperCase() + segment.slice(1);
                    return (
                      <React.Fragment key={href}>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          {isLast ? (
                            <BreadcrumbPage>{label}</BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                      </React.Fragment>
                    );
                  })}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <LanguageDropdown
                trigger={
                  <Button variant="ghost" size="icon">
                    <LanguagesIcon />
                  </Button>
                }
              />
              <ProfileDropdown
                profile={profile}
                user={user}
                onLogout={handleSignOut}
                trigger={
                  <Button variant="ghost" size="icon" className="size-9.5">
                    <Avatar className="size-9.5 rounded-md">
                      <AvatarImage
                        src={profile?.avatar_url}
                        alt={displayName ?? undefined}
                      />
                      <AvatarFallback>{avatarFallback}</AvatarFallback>
                    </Avatar>
                  </Button>
                }
              />
            </div>
          </div>
        </header>
        <main className="min-h-0 flex-1 overflow-auto bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 md:mx-0">
            <MicroFrontendErrorBoundary>
              <AnimatePresence mode="wait">
                <motion.div
                  key={transitionKey}
                  initial={pageTransition.initial}
                  animate={pageTransition.animate}
                  exit={pageTransition.exit}
                  transition={pageTransition.transition}
                  className="min-h-0 min-w-0"
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </MicroFrontendErrorBoundary>
          </div>
        </main>
        <footer className="text-muted-foreground shrink-0 border-t">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 max-sm:flex-col sm:gap-6 sm:px-6">
            <p className="text-balance text-center text-sm max-sm:w-full sm:text-left">
              {`©${new Date().getFullYear()}`}{" "}
              <a href="#" className="text-primary">
                gaqno
              </a>
            </p>
            <div className="flex gap-5">
              <a href="https://www.facebook.com/gaqno-development">
                <FacebookIcon className="size-4" />
              </a>
              <a href="https://www.instagram.com/gaqno-development">
                <InstagramIcon className="size-4" />
              </a>
              <a href="https://www.linkedin.com/in/gaqno">
                <LinkedinIcon className="size-4" />
              </a>
            </div>
          </div>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
