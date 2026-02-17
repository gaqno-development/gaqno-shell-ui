import { ROUTE_PERMISSIONS } from "@/config/menu-config";

export function getFirstAvailableRoute(permissions: string[]): string | null {
  const hasPlatformAll = permissions.includes("platform.all");

  const routePriority = [
    "/dashboard",
    "/rpg",
    "/pdv",
    "/crm/dashboard",
    "/erp/dashboard",
    "/finance/dashboard",
    "/ai/dashboard",
    "/admin/costing",
    "/admin/users",
  ];

  for (const route of routePriority) {
    const requiredPermissions = ROUTE_PERMISSIONS[route];

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return route;
    }

    if (hasPlatformAll) {
      return route;
    }

    const hasAccess = requiredPermissions.every((perm) =>
      permissions.includes(perm)
    );

    if (hasAccess) {
      return route;
    }
  }

  return null;
}
