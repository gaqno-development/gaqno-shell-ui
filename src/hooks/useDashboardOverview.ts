import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { isAxiosError } from "axios";
import { ssoClient } from "@gaqno-development/frontcore/utils/api";
import { Zap, DollarSign, Activity, Globe } from "lucide-react";
import type { ChartConfig } from "@gaqno-development/frontcore/components/ui";
import type {
  IDashboardOverviewResponse,
  IDashboardTimeSeriesResponse,
  IDashboardActivityResponse,
} from "@gaqno-development/types";
import type {
  TimeRange,
  OverviewCardData,
  ActivityItemData,
  ChartDataPoint,
  DashboardOverviewState,
} from "../types/dashboard-overview.types";

const CARD_ICON_MAP: Record<string, React.ElementType> = {
  apiCalls: Zap,
  revenue: DollarSign,
  transactions: Activity,
  activeServices: Globe,
};

function retryUnless401(failureCount: number, error: unknown): boolean {
  if (isAxiosError(error) && error.response?.status === 401) return false;
  return failureCount < 2;
}

const useOverviewCards = () =>
  useQuery<IDashboardOverviewResponse>({
    queryKey: ["dashboard", "overview"],
    queryFn: async () => {
      const { data } = await ssoClient.get<IDashboardOverviewResponse>(
        "/dashboard/overview"
      );
      return data;
    },
    staleTime: 2 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
    retry: retryUnless401,
  });

const useUsageTimeSeries = (range: TimeRange) =>
  useQuery<IDashboardTimeSeriesResponse>({
    queryKey: ["dashboard", "usage-timeseries", range],
    queryFn: async () => {
      const { data } = await ssoClient.get<IDashboardTimeSeriesResponse>(
        `/dashboard/usage-timeseries?range=${range}`
      );
      return data;
    },
    staleTime: 2 * 60 * 1000,
    retry: retryUnless401,
  });

const useActivityFeed = () =>
  useQuery<IDashboardActivityResponse>({
    queryKey: ["dashboard", "activity"],
    queryFn: async () => {
      const { data } = await ssoClient.get<IDashboardActivityResponse>(
        "/dashboard/activity?limit=20"
      );
      return data;
    },
    staleTime: 1 * 60 * 1000,
    refetchInterval: 3 * 60 * 1000,
    retry: retryUnless401,
  });

export const useDashboardOverview = (): DashboardOverviewState => {
  const { t } = useTranslation("navigation");
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");

  const formatTimestamp = (iso: string): string => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60_000);
    if (mins < 1) return t("dashboard.justNow");
    if (mins < 60) return t("dashboard.minAgo", { count: mins });
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return t("dashboard.hrAgo", { count: hrs });
    return t("dashboard.dAgo", { count: Math.floor(hrs / 24) });
  };

  const chartConfig: ChartConfig = useMemo(() => ({
    apiCalls: { label: t("dashboard.apiCalls"), color: "hsl(217 91% 60%)" },
    storage: { label: t("dashboard.storageGb"), color: "hsl(160 84% 39%)" },
    bandwidth: { label: t("dashboard.bandwidthGb"), color: "hsl(280 68% 60%)" },
  }), [t]);

  const timeRangeLabels: Record<TimeRange, string> = useMemo(() => ({
    "7d": t("dashboard.range7d"),
    "30d": t("dashboard.range30d"),
    "90d": t("dashboard.range90d"),
    "12m": t("dashboard.range12m"),
  }), [t]);

  const overviewQuery = useOverviewCards();
  const timeSeriesQuery = useUsageTimeSeries(timeRange);
  const activityQuery = useActivityFeed();

  const overviewCards: readonly OverviewCardData[] = useMemo(() => {
    if (!overviewQuery.data?.cards) return [];
    return overviewQuery.data.cards.map((card) => ({
      key: card.key,
      title: card.title,
      value: card.value,
      change: card.change,
      trend: card.trend,
      icon: CARD_ICON_MAP[card.key] ?? Activity,
      description: card.description,
    }));
  }, [overviewQuery.data]);

  const chartData: readonly ChartDataPoint[] = useMemo(() => {
    if (!timeSeriesQuery.data?.points) return [];
    return timeSeriesQuery.data.points;
  }, [timeSeriesQuery.data]);

  const activityItems: readonly ActivityItemData[] = useMemo(() => {
    if (!activityQuery.data?.events) return [];
    return activityQuery.data.events.map((evt) => ({
      id: evt.id,
      type: evt.type,
      service: evt.service,
      message: evt.message,
      timestamp: formatTimestamp(evt.createdAt),
      status: evt.status,
    }));
  }, [activityQuery.data]);

  const isLoading =
    overviewQuery.isLoading ||
    timeSeriesQuery.isLoading ||
    activityQuery.isLoading;

  const hasError =
    !!overviewQuery.error || !!timeSeriesQuery.error || !!activityQuery.error;

  return {
    timeRange,
    chartData,
    chartConfig,
    overviewCards,
    activityItems,
    timeRangeLabels,
    isLoading,
    hasError,
    handleTimeRangeChange: setTimeRange,
  };
};
