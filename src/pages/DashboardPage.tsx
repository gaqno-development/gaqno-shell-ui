import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  LoaderPinwheelIcon,
  Skeleton,
} from "@gaqno-development/frontcore/components/ui";
import { Plus, ArrowUpRight, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDashboardOverview } from "../hooks/useDashboardOverview";
import { OverviewCard } from "../components/dashboard/OverviewCard";
import { ActivityItem } from "../components/dashboard/ActivityItem";
import { ServiceUsageChart } from "../components/dashboard/ServiceUsageChart";
import { MonitoringWidgets } from "../components/dashboard/MonitoringWidgets";

export default function DashboardPage() {
  const { t } = useTranslation("navigation");
  const {
    timeRange,
    chartData,
    chartConfig,
    overviewCards,
    activityItems,
    timeRangeLabels,
    isLoading,
    hasError,
    handleTimeRangeChange,
  } = useDashboardOverview();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <LoaderPinwheelIcon size={32} />
        <p className="text-sm text-muted-foreground">{t("dashboard.loading")}</p>
      </div>
    );
  }

  return (
    <main className="mx-auto size-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            {t("dashboard.welcomeBack")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("dashboard.cloudAtGlance")}
          </p>
        </div>
        <Button variant="default" className="gap-2 self-start">
          <Plus className="h-4 w-4" />
          {t("dashboard.createNew")}
        </Button>
      </div>

      {hasError && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-400 mb-6">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {t("dashboard.dataUnavailable")}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div className="col-span-full grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {overviewCards.length > 0 ? (
            overviewCards.map((card, index) => {
              const { key: cardKey, ...cardProps } = card;
              return <OverviewCard key={cardKey ?? index} {...cardProps} />;
            })
          ) : (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-[120px] rounded-lg" />
            ))
          )}
        </div>

        <div className="col-span-full">
          <MonitoringWidgets />
        </div>

        <div className="col-span-full">
          <ServiceUsageChart
            data={chartData}
            config={chartConfig}
            timeRange={timeRange}
            timeRangeLabels={timeRangeLabels}
            onTimeRangeChange={handleTimeRangeChange}
          />
        </div>

        <Card className="col-span-full border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">
                {t("dashboard.recentActivity")}
              </CardTitle>
              <CardDescription>{t("dashboard.latestEvents")}</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
              {t("dashboard.viewAll")}
              <ArrowUpRight className="ml-1 h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent className="px-2 pt-0">
            {activityItems.length > 0 ? (
              <div className="divide-y divide-border/50">
                {activityItems.map((item) => (
                  <ActivityItem key={item.id} {...item} />
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">
                {t("dashboard.noRecentActivity")}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
