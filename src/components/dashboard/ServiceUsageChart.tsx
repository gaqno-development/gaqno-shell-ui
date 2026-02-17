import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@gaqno-development/frontcore/components/ui";
import type { ChartConfig } from "@gaqno-development/frontcore/components/ui";
import {
  TIME_RANGES,
  type TimeRange,
} from "../../types/dashboard-overview.types";
import type { ChartDataPoint } from "../../types/dashboard-overview.types";

interface ServiceUsageChartProps {
  readonly data: readonly ChartDataPoint[];
  readonly config: ChartConfig;
  readonly timeRange: TimeRange;
  readonly timeRangeLabels: Record<string, string>;
  readonly onTimeRangeChange: (range: TimeRange) => void;
}

const formatTick = (val: number) =>
  val >= 1000 ? `${(val / 1000).toFixed(1)}K` : String(val);

export function ServiceUsageChart({
  data,
  config,
  timeRange,
  timeRangeLabels,
  onTimeRangeChange,
}: ServiceUsageChartProps) {
  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-lg font-semibold">Service Usage</CardTitle>
          <CardDescription>Cloud service consumption over time</CardDescription>
        </div>
        <TimeRangeSelector
          value={timeRange}
          labels={timeRangeLabels}
          onChange={onTimeRangeChange}
        />
      </CardHeader>
      <CardContent className="pt-0">
        <ChartContainer config={config} className="h-[350px] w-full">
          <AreaChart
            data={data as ChartDataPoint[]}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <defs>
              <AreaGradient id="gradientApi" color="hsl(217 91% 60%)" />
              <AreaGradient id="gradientStorage" color="hsl(160 84% 39%)" />
              <AreaGradient id="gradientBandwidth" color="hsl(280 68% 60%)" />
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              className="stroke-border/30"
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={formatTick}
              className="text-xs"
            />
            <ChartTooltip
              cursor={{
                stroke: "hsl(var(--muted-foreground))",
                strokeWidth: 1,
                strokeDasharray: "4 4",
              }}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <StyledArea
              dataKey="apiCalls"
              color="hsl(217 91% 60%)"
              gradient="gradientApi"
            />
            <StyledArea
              dataKey="storage"
              color="hsl(160 84% 39%)"
              gradient="gradientStorage"
            />
            <StyledArea
              dataKey="bandwidth"
              color="hsl(280 68% 60%)"
              gradient="gradientBandwidth"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function TimeRangeSelector({
  value,
  labels,
  onChange,
}: {
  readonly value: TimeRange;
  readonly labels: Record<string, string>;
  readonly onChange: (range: TimeRange) => void;
}) {
  return (
    <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
      {TIME_RANGES.map((range) => (
        <button
          key={range}
          onClick={() => onChange(range)}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
            value === range
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {labels[range]}
        </button>
      ))}
    </div>
  );
}

function AreaGradient({
  id,
  color,
}: {
  readonly id: string;
  readonly color: string;
}) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={color} stopOpacity={0.3} />
      <stop offset="100%" stopColor={color} stopOpacity={0.02} />
    </linearGradient>
  );
}

function StyledArea({
  dataKey,
  color,
  gradient,
}: {
  readonly dataKey: string;
  readonly color: string;
  readonly gradient: string;
}) {
  return (
    <Area
      type="monotone"
      dataKey={dataKey}
      stroke={color}
      strokeWidth={2}
      fill={`url(#${gradient})`}
      dot={false}
      activeDot={{
        r: 5,
        fill: color,
        stroke: "hsl(var(--background))",
        strokeWidth: 2,
      }}
    />
  );
}
