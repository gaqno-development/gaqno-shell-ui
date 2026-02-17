import React from "react";
import { Badge } from "@gaqno-development/frontcore/components/ui";
import {
  Activity,
  Clock,
  Server,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Settings,
  User,
} from "lucide-react";
import type { ActivityItemData } from "../../types/dashboard-overview.types";

const ICON_MAP: Record<string, React.ElementType> = {
  deploy: CheckCircle2,
  alert: AlertTriangle,
  scale: Server,
  security: Shield,
  config: Settings,
  user: User,
};

const STATUS_COLORS: Record<string, string> = {
  success: "text-emerald-400",
  warning: "text-amber-400",
  info: "text-blue-400",
  error: "text-rose-400",
};

export function ActivityItem({
  type,
  service,
  message,
  timestamp,
  status,
}: ActivityItemData) {
  const Icon = ICON_MAP[type] ?? Activity;
  const statusColor = STATUS_COLORS[status] ?? "text-muted-foreground";

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
