export interface WidgetConfig {
  id: string
  type: string
  position: number
  visible: boolean
  config?: Record<string, unknown>
}

export interface LayoutConfig {
  columns?: number
  grid?: Record<string, unknown>
}

export interface DashboardPreferences {
  widgets: WidgetConfig[]
  layout?: LayoutConfig
}

export interface ServiceMetrics {
  service: string
  metrics: Record<string, unknown>
}

export interface DashboardSummary {
  services: ServiceMetrics[]
  aggregated: Record<string, unknown>
}

export interface AvailableWidget {
  id: string
  type: string
  name: string
  icon: string
  defaultSize: { width: number; height: number }
  requiredPermissions: string[]
}

export interface WidgetsData {
  widgets: AvailableWidget[]
}

