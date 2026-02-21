import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@gaqno-development/frontcore/components/ui/sidebar";
import { useUIStore } from "@gaqno-development/frontcore/store/uiStore";
import { useWhiteLabel } from "@gaqno-development/frontcore/hooks";
import type { ISidebarItem } from "@gaqno-development/frontcore/components/layout";

function useDashboardLayout() {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);
  return {
    open: sidebarOpen,
    defaultOpen: sidebarOpen,
    onOpenChange: setSidebarOpen,
  };
}

function MobileTopBar() {
  const { config: whiteLabel } = useWhiteLabel();
  const companyName =
    whiteLabel?.companyName || whiteLabel?.appName || "Dashboard";

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b bg-background px-4 md:hidden">
      <SidebarTrigger aria-label="Open menu" className="h-9 w-9" />
      {whiteLabel?.logoUrl ? (
        <img
          src={whiteLabel.logoUrl}
          alt={companyName}
          width={120}
          height={32}
          className="h-8 w-auto max-w-[65vw] object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      ) : null}
      <span className="min-w-0 truncate text-sm font-semibold text-foreground">
        {companyName}
      </span>
    </header>
  );
}

function SidebarMenuItems({ menuItems }: { menuItems: ISidebarItem[] }) {
  const location = useLocation();
  const pathname = location.pathname;

  const isActive = (href: string) =>
    href ? pathname === href || pathname.startsWith(href + "/") : false;

  return (
    <SidebarMenu>
      {menuItems.map((item) => {
        const active = item.href ? isActive(item.href) : false;
        const Icon = item.icon;
        if (item.children?.length) {
          return (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton asChild isActive={active}>
                <Link to={item.href ?? "#"}>
                  <Icon className="size-4" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        }
        return (
          <SidebarMenuItem key={item.label}>
            <SidebarMenuButton asChild isActive={active}>
              <Link to={item.href ?? "#"}>
                <Icon className="size-4" />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}

export interface DashboardLayoutProps {
  children: React.ReactNode;
  menuItems: ISidebarItem[];
}

export function DashboardLayout({ children, menuItems }: DashboardLayoutProps) {
  const { open, defaultOpen, onOpenChange } = useDashboardLayout();

  return (
    <SidebarProvider
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      <div className="flex h-screen w-full overflow-hidden">
        <Sidebar>
          <SidebarContent>
            <SidebarMenuItems menuItems={menuItems} />
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <MobileTopBar />
          <main className="min-h-0 flex-1 overflow-auto bg-background">
            <div className="min-h-full md:ml-[3em]">{children}</div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
