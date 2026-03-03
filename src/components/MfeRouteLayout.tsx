import type { ReactNode } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { PageLayout, type PageLayoutTab, type PageLayoutTabGroup } from "@gaqno-development/frontcore/components/layout";
import { useTranslation } from "@gaqno-development/frontcore/i18n";

export interface MfeRouteLayoutTabConfig {
  id: string;
  path: string;
  labelKey: string;
  icon: ReactNode;
}

export interface MfeRouteLayoutTabGroupConfig {
  groupKey: string;
  tabIds: string[];
}

export interface MfeRouteLayoutConfig {
  basePath: string;
  titleKey: string;
  layoutId: string;
  tabs: MfeRouteLayoutTabConfig[];
  tabGroups?: MfeRouteLayoutTabGroupConfig[];
  mobileNavActiveIndicatorClassName?: string;
  mobileNavActiveLabelClassName?: string;
}

function getActiveTab(pathname: string, basePath: string, tabIds: string[]): string {
  const normalized = basePath.replace(/\/$/, "");
  const rest = pathname.startsWith(normalized + "/")
    ? pathname.slice(normalized.length + 1)
    : pathname === normalized
      ? ""
      : pathname.slice(normalized.length);
  const firstSegment = rest.split("/")[0] ?? "";
  return tabIds.includes(firstSegment) ? firstSegment : tabIds[0] ?? "";
}

export function MfeRouteLayout({ config }: { config: MfeRouteLayoutConfig }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation("navigation");
  const { basePath, titleKey, layoutId, tabs: tabConfigs, tabGroups: groupConfigs } = config;
  const tabIds = tabConfigs.map((tab) => tab.id);
  const activeTab = getActiveTab(location.pathname, basePath, tabIds);

  const tabs: PageLayoutTab[] = tabConfigs.map((tab) => ({
    id: tab.id,
    label: t(tab.labelKey),
    icon: tab.icon,
    href: `${basePath}/${tab.path}`.replace(/\/+/g, "/"),
  }));

  const tabGroups: PageLayoutTabGroup[] | undefined = groupConfigs?.map((group) => ({
    label: t(group.groupKey),
    tabs: group.tabIds.map((id) => tabs.find((tab) => tab.id === id)!).filter(Boolean),
  }));

  const handleTabChange = (tabId: string) => {
    const tab = tabConfigs.find((t) => t.id === tabId);
    if (tab) {
      const href = `${basePath}/${tab.path}`.replace(/\/+/g, "/");
      navigate(href, { replace: true });
    }
  };

  return (
    <PageLayout
      title={t(titleKey)}
      tabs={tabs}
      tabGroups={tabGroups}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      layoutId={layoutId}
      mobileNavActiveIndicatorClassName={config.mobileNavActiveIndicatorClassName}
      mobileNavActiveLabelClassName={config.mobileNavActiveLabelClassName}
    >
      <Outlet />
    </PageLayout>
  );
}
