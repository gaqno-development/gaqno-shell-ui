import type React from "react";
import type { ChartConfig } from "@gaqno-development/frontcore/components/ui";

export type {
  DashboardTimeRange as TimeRange,
  IDashboardOverviewCard,
  IDashboardOverviewResponse,
  IDashboardTimeSeriesPoint,
  IDashboardTimeSeriesResponse,
  IDashboardActivityEvent,
  IDashboardActivityResponse,
} from "@gaqno-development/types";

export const TIME_RANGES = ["7d", "30d", "90d", "12m"] as const;

export interface OverviewCardData {
  key: string;
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: React.ElementType;
  description: string;
}

export interface ActivityItemData {
  id: string;
  type: string;
  service: string;
  message: string;
  timestamp: string;
  status: string;
}

export interface ChartDataPoint {
  date: string;
  apiCalls: number;
  storage: number;
  bandwidth: number;
}

export interface DashboardOverviewState {
  timeRange: "7d" | "30d" | "90d" | "12m";
  chartData: readonly ChartDataPoint[];
  chartConfig: ChartConfig;
  overviewCards: readonly OverviewCardData[];
  activityItems: readonly ActivityItemData[];
  timeRangeLabels: Record<string, string>;
  isLoading: boolean;
  hasError: boolean;
  handleTimeRangeChange: (range: "7d" | "30d" | "90d" | "12m") => void;
}
