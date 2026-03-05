import type { ComponentType } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDownIcon, Package } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
} from "@gaqno-development/frontcore/components/ui";
import { useWhiteLabel } from "@gaqno-development/frontcore/hooks";

export type ShellMenuItem = {
  label: string;
  href?: string;
  icon: ComponentType<{ className?: string }>;
  iconBackgroundColor?: string;
  notificationCount?: number;
  children?: ShellMenuItem[];
  isCollapsible?: boolean;
};

type ShellSidebarProps = {
  menuItems?: ShellMenuItem[];
};

const MAX_MENU_DEPTH = 3;

function splitHref(href: string): { pathname: string; hash: string } {
  const idx = href.indexOf("#");
  if (idx === -1) return { pathname: href, hash: "" };
  return { pathname: href.slice(0, idx), hash: href.slice(idx) };
}

function toAbsoluteHref(href: string): string {
  return href.startsWith("/") ? href : `/${href}`;
}

function isPathActive(pathname: string, href: string | undefined): boolean {
  if (!href || href === "#") return false;
  const parsed = splitHref(href);
  if (parsed.pathname === "/") return pathname === "/";
  return pathname === parsed.pathname || pathname.startsWith(parsed.pathname + "/");
}

function hasActiveDescendant(pathname: string, item: ShellMenuItem): boolean {
  if (isPathActive(pathname, item.href)) return true;
  if (!item.children?.length) return false;
  return item.children.some((child) => hasActiveDescendant(pathname, child));
}

type MenuItemContentProps = {
  item: ShellMenuItem;
  pathname: string;
  depth: number;
};

function safeIcon(item: ShellMenuItem): ComponentType<{ className?: string }> {
  const Icon = item?.icon;
  return typeof Icon === "function" ? Icon : Package;
}

function MenuItemContent({ item, pathname, depth }: MenuItemContentProps) {
  const Icon = safeIcon(item);
  const active = isPathActive(pathname, item.href);
  const hasChildren = Boolean(item.children?.length) && depth < MAX_MENU_DEPTH;
  const defaultOpen = hasChildren && hasActiveDescendant(pathname, item);

  if (hasChildren) {
    return (
      <Collapsible defaultOpen={defaultOpen}>
        <SidebarMenuItem isActive={active}>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton isActive={active} className="group/collapsible flex w-full">
              <div
                className="flex shrink-0 items-center justify-center rounded-md p-1.5 text-sidebar-foreground"
                style={{
                  backgroundColor: item.iconBackgroundColor ?? "transparent",
                }}
              >
                <Icon className="size-5 shrink-0" />
              </div>
              <span>{item.label}</span>
              {item.notificationCount != null && item.notificationCount > 0 && (
                <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs">
                  {item.notificationCount}
                </span>
              )}
              <ChevronDownIcon className="ml-auto size-4 shrink-0 transition-transform group-data-[state=open]/collapsible:rotate-180" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.children!.map((child) => (
                <ShellMenuSubItem
                  key={child.label}
                  item={child}
                  pathname={pathname}
                  depth={depth + 1}
                />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  return (
    <SidebarMenuItem isActive={active}>
      <SidebarMenuButton asChild isActive={active}>
        <Link
          to={item.href ? splitHref(toAbsoluteHref(item.href)) : "#"}
          className="flex items-center gap-2"
        >
          <div
            className="flex shrink-0 items-center justify-center rounded-md p-1.5 text-sidebar-foreground"
            style={{
              backgroundColor: item.iconBackgroundColor ?? "transparent",
            }}
          >
            <Icon className="size-5 shrink-0" />
          </div>
          <span>{item.label}</span>
          {item.notificationCount != null && item.notificationCount > 0 && (
            <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs">
              {item.notificationCount}
            </span>
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function ShellMenuSubItem({
  item,
  pathname,
  depth,
}: MenuItemContentProps) {
  const Icon = safeIcon(item);
  const active = isPathActive(pathname, item.href);
  const hasChildren = Boolean(item.children?.length) && depth < MAX_MENU_DEPTH;
  const defaultOpen = hasChildren && hasActiveDescendant(pathname, item);

  if (hasChildren) {
    return (
      <SidebarMenuSubItem>
        <Collapsible defaultOpen={defaultOpen}>
          <CollapsibleTrigger asChild>
            <SidebarMenuSubButton
              isActive={active}
              className="flex w-full group/collapsible"
            >
              <Icon className="size-4 shrink-0 text-sidebar-foreground" />
              <span>{item.label}</span>
              <ChevronDownIcon className="ml-auto size-3 shrink-0 transition-transform group-data-[state=open]/collapsible:rotate-180" />
            </SidebarMenuSubButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.children!.map((child) => (
                <ShellMenuSubItem
                  key={child.label}
                  item={child}
                  pathname={pathname}
                  depth={depth + 1}
                />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenuSubItem>
    );
  }

  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton asChild isActive={active}>
        <Link to={item.href ? splitHref(toAbsoluteHref(item.href)) : "#"} className="flex items-center gap-2">
          <Icon className="size-4 shrink-0 text-sidebar-foreground" />
          <span>{item.label}</span>
          {item.notificationCount != null && item.notificationCount > 0 && (
            <span className="ml-auto rounded-full bg-primary/10 px-1.5 py-0.5 text-xs">
              {item.notificationCount}
            </span>
          )}
        </Link>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
}

export function ShellSidebar({ menuItems = [] }: ShellSidebarProps) {
  const location = useLocation();
  const pathname = location.pathname;
  const { config: whiteLabel } = useWhiteLabel();

  return (
    <Sidebar collapsible="offcanvas">
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
                menuItems.map((item) => (
                  <MenuItemContent
                    key={item.label}
                    item={item}
                    pathname={pathname}
                    depth={0}
                  />
                ))
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
