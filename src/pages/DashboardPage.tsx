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
import { useDashboardOverview } from "../hooks/useDashboardOverview";
import { OverviewCard } from "../components/dashboard/OverviewCard";
import { ActivityItem } from "../components/dashboard/ActivityItem";
import { ServiceUsageChart } from "../components/dashboard/ServiceUsageChart";

export default function DashboardPage() {
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
        <p className="text-sm text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground">
            Your cloud services at a glance
          </p>
        </div>
        <Button className="gap-2 self-start">
          <Plus className="h-4 w-4" />
          Create New
        </Button>
      </div>

      {hasError && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Some data may be unavailable. Showing what we could load.
        </div>
      )}

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        {overviewCards.length > 0
          ? overviewCards.map((card) => (
              <OverviewCard key={card.key} {...card} />
            ))
          : Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-[120px] rounded-lg" />
            ))}
      </div>

      <ServiceUsageChart
        data={chartData}
        config={chartConfig}
        timeRange={timeRange}
        timeRangeLabels={timeRangeLabels}
        onTimeRangeChange={handleTimeRangeChange}
      />

      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">
              Recent Activity
            </CardTitle>
            <CardDescription>Latest events from your services</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground"
          >
            View all
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
              No recent activity
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
