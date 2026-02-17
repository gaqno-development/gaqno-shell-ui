import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@gaqno-development/frontcore/components/ui";
import type { ChartConfig } from "@gaqno-development/frontcore/components/ui";
import {
  Plus,
  Zap,
  HardDrive,
  Wifi,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Clock,
  Server,
  Shield,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

const CHART_DATA = [
  { month: "Jan", apiCalls: 4200, storage: 2400, bandwidth: 1800 },
  { month: "Feb", apiCalls: 4800, storage: 2600, bandwidth: 2200 },
  { month: "Mar", apiCalls: 5100, storage: 2900, bandwidth: 2600 },
  { month: "Apr", apiCalls: 4600, storage: 3100, bandwidth: 2400 },
  { month: "May", apiCalls: 5800, storage: 3400, bandwidth: 3100 },
  { month: "Jun", apiCalls: 6200, storage: 3600, bandwidth: 3400 },
  { month: "Jul", apiCalls: 7100, storage: 3800, bandwidth: 3800 },
  { month: "Aug", apiCalls: 6800, storage: 4100, bandwidth: 4200 },
  { month: "Sep", apiCalls: 7400, storage: 4300, bandwidth: 4600 },
  { month: "Oct", apiCalls: 8200, storage: 4600, bandwidth: 5100 },
  { month: "Nov", apiCalls: 8800, storage: 4900, bandwidth: 5400 },
  { month: "Dec", apiCalls: 9400, storage: 5200, bandwidth: 5800 },
];

const CHART_CONFIG: ChartConfig = {
  apiCalls: {
    label: "API Calls",
    color: "hsl(217 91% 60%)",
  },
  storage: {
    label: "Storage (GB)",
    color: "hsl(160 84% 39%)",
  },
  bandwidth: {
    label: "Bandwidth (GB)",
    color: "hsl(280 68% 60%)",
  },
};

const OVERVIEW_CARDS = [
  {
    title: "API Calls",
    value: "9.4K",
    change: "+12.5%",
    trend: "up" as const,
    icon: Zap,
    description: "This month",
  },
  {
    title: "Storage Used",
    value: "5.2 TB",
    change: "+6.1%",
    trend: "up" as const,
    icon: HardDrive,
    description: "Total consumed",
  },
  {
    title: "Bandwidth",
    value: "5.8 TB",
    change: "+7.4%",
    trend: "up" as const,
    icon: Wifi,
    description: "Data transferred",
  },
  {
    title: "Active Services",
    value: "12",
    change: "-1",
    trend: "down" as const,
    icon: Globe,
    description: "Running now",
  },
];

const ACTIVITY_ITEMS = [
  {
    id: "1",
    type: "deploy" as const,
    service: "API Gateway",
    message: "Deployment completed successfully",
    timestamp: "2 min ago",
    status: "success" as const,
  },
  {
    id: "2",
    type: "alert" as const,
    service: "Auth Service",
    message: "High latency detected (p99 > 500ms)",
    timestamp: "15 min ago",
    status: "warning" as const,
  },
  {
    id: "3",
    type: "scale" as const,
    service: "Worker Pool",
    message: "Auto-scaled from 3 to 5 instances",
    timestamp: "42 min ago",
    status: "info" as const,
  },
  {
    id: "4",
    type: "deploy" as const,
    service: "CDN Edge",
    message: "Cache invalidation completed",
    timestamp: "1 hr ago",
    status: "success" as const,
  },
  {
    id: "5",
    type: "security" as const,
    service: "Firewall",
    message: "Blocked 1,247 suspicious requests",
    timestamp: "2 hr ago",
    status: "info" as const,
  },
  {
    id: "6",
    type: "deploy" as const,
    service: "Database Cluster",
    message: "Primary failover test passed",
    timestamp: "3 hr ago",
    status: "success" as const,
  },
];

const ACTIVITY_ICON_MAP: Record<string, React.ElementType> = {
  deploy: CheckCircle2,
  alert: AlertTriangle,
  scale: Server,
  security: Shield,
};

const ACTIVITY_STATUS_COLORS: Record<string, string> = {
  success: "text-emerald-400",
  warning: "text-amber-400",
  info: "text-blue-400",
};

const TIME_RANGES = ["7d", "30d", "90d", "12m"] as const;
type TimeRange = (typeof TIME_RANGES)[number];

const TIME_RANGE_LABELS: Record<TimeRange, string> = {
  "7d": "7 days",
  "30d": "30 days",
  "90d": "90 days",
  "12m": "12 months",
};

function OverviewCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  description,
}: (typeof OVERVIEW_CARDS)[number]) {
  const isPositive = trend === "up";

  return (
    <Card className="group relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 border-border/50 hover:border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="rounded-lg bg-primary/10 p-2 transition-colors duration-200 group-hover:bg-primary/15">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight">{value}</span>
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-medium ${
              isPositive ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {change}
          </span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function ActivityItem({
  type,
  service,
  message,
  timestamp,
  status,
}: (typeof ACTIVITY_ITEMS)[number]) {
  const Icon = ACTIVITY_ICON_MAP[type] ?? Activity;
  const statusColor = ACTIVITY_STATUS_COLORS[status] ?? "text-muted-foreground";

  return (
    <div className="group flex items-start gap-4 rounded-lg px-4 py-3 transition-colors duration-150 hover:bg-muted/50">
      <div
        className={`mt-0.5 shrink-0 rounded-full bg-muted p-2 ${statusColor}`}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{service}</span>
          <Badge
            variant="outline"
            className="text-[10px] px-1.5 py-0 leading-4"
          >
            {type}
          </Badge>
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground truncate">
          {message}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
        <Clock className="h-3 w-3" />
        <span>{timestamp}</span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("12m");

  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back
          </h1>
          <p className="text-muted-foreground">
            Your cloud services at a glance
          </p>
        </div>
        <Button className="gap-2 self-start">
          <Plus className="h-4 w-4" />
          Create New
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        {OVERVIEW_CARDS.map((card) => (
          <OverviewCard key={card.title} {...card} />
        ))}
      </div>

      <Card className="border-border/50">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">
              Service Usage
            </CardTitle>
            <CardDescription>
              Cloud service consumption over time
            </CardDescription>
          </div>
          <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
            {TIME_RANGES.map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
                  timeRange === range
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {TIME_RANGE_LABELS[range]}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <ChartContainer config={CHART_CONFIG} className="h-[350px] w-full">
            <AreaChart
              data={CHART_DATA}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="gradientApi" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="hsl(217 91% 60%)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="100%"
                    stopColor="hsl(217 91% 60%)"
                    stopOpacity={0.02}
                  />
                </linearGradient>
                <linearGradient
                  id="gradientStorage"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="hsl(160 84% 39%)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="100%"
                    stopColor="hsl(160 84% 39%)"
                    stopOpacity={0.02}
                  />
                </linearGradient>
                <linearGradient
                  id="gradientBandwidth"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="hsl(280 68% 60%)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="100%"
                    stopColor="hsl(280 68% 60%)"
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                className="stroke-border/30"
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-xs"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(val: number) =>
                  val >= 1000 ? `${(val / 1000).toFixed(1)}K` : String(val)
                }
                className="text-xs"
              />
              <ChartTooltip
                cursor={{ stroke: "hsl(var(--muted-foreground))", strokeWidth: 1, strokeDasharray: "4 4" }}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Area
                type="monotone"
                dataKey="apiCalls"
                stroke="hsl(217 91% 60%)"
                strokeWidth={2}
                fill="url(#gradientApi)"
                dot={false}
                activeDot={{
                  r: 5,
                  fill: "hsl(217 91% 60%)",
                  stroke: "hsl(var(--background))",
                  strokeWidth: 2,
                }}
              />
              <Area
                type="monotone"
                dataKey="storage"
                stroke="hsl(160 84% 39%)"
                strokeWidth={2}
                fill="url(#gradientStorage)"
                dot={false}
                activeDot={{
                  r: 5,
                  fill: "hsl(160 84% 39%)",
                  stroke: "hsl(var(--background))",
                  strokeWidth: 2,
                }}
              />
              <Area
                type="monotone"
                dataKey="bandwidth"
                stroke="hsl(280 68% 60%)"
                strokeWidth={2}
                fill="url(#gradientBandwidth)"
                dot={false}
                activeDot={{
                  r: 5,
                  fill: "hsl(280 68% 60%)",
                  stroke: "hsl(var(--background))",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest events from your services
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
            View all
            <ArrowUpRight className="ml-1 h-3 w-3" />
          </Button>
        </CardHeader>
        <CardContent className="px-2 pt-0">
          <div className="divide-y divide-border/50">
            {ACTIVITY_ITEMS.map((item) => (
              <ActivityItem key={item.id} {...item} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
