import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@gaqno-development/frontcore/components/ui";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { OverviewCardData } from "../../types/dashboard-overview.types";

export function OverviewCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  description,
}: OverviewCardData) {
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
      <CardContent className="space-y-2">
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
        {description ? (
          <p className="text-xs text-muted-foreground leading-relaxed">
            {description}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
