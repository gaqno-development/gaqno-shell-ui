import { Link, useLocation } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@gaqno-development/frontcore/components/ui";
import { useWhiteLabel } from "@gaqno-development/frontcore/hooks";

export type ShellMenuItem = {
  label: string;
  href?: string;
  icon: LucideIcon;
  iconBackgroundColor?: string;
  notificationCount?: number;
  children?: ShellMenuItem[];
  isCollapsible?: boolean;
};

type ShellSidebarProps = {
  menuItems?: ShellMenuItem[];
};

function isPathActive(pathname: string, href: string | undefined): boolean {
  if (!href || href === "#") return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function ShellSidebar({ menuItems = [] }: ShellSidebarProps) {
  const location = useLocation();
  const pathname = location.pathname;
  const { config: whiteLabel } = useWhiteLabel();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex min-h-12 items-center gap-2 p-4">
            {whiteLabel?.logoUrl ? (
              <img
                src={whiteLabel.logoUrl}
                alt={whiteLabel?.companyName ?? "Logo"}
                width={120}
                height={40}
                className="h-10 w-auto max-w-full object-contain"
              />
            ) : (
              <span className="truncate text-lg font-bold">
                {whiteLabel?.companyName ?? whiteLabel?.appName ?? "Menu"}
              </span>
            )}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.length === 0 ? (
                <div className="p-4 text-muted-foreground text-sm">
                  Nenhum item de menu disponível
                </div>
              ) : (
                menuItems.map((item) => {
                  const Icon = item.icon;
                  const active = isPathActive(pathname, item.href);
                  return (
                    <SidebarMenuItem key={item.label} isActive={active}>
                      <SidebarMenuButton asChild isActive={active}>
                        <Link
                          to={item.href ?? "#"}
                          className="flex items-center gap-2"
                        >
                          <div
                            className="flex shrink-0 items-center justify-center rounded-md p-1.5"
                            style={{
                              backgroundColor:
                                item.iconBackgroundColor ?? "transparent",
                            }}
                          >
                            <Icon className="size-5" />
                          </div>
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="mt-auto border-t">
          <SidebarGroupContent className="p-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarTrigger
                  className="w-full justify-start"
                  aria-label="Alternar menu"
                />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
