import React from 'react'
import type { ServiceMetrics } from '../types/dashboard.types'

// Simple widget components - can be enhanced later
const ServiceMetricsWidget: React.FC<{
  service?: string
  metrics?: Record<string, unknown>
}> = ({ service, metrics }) => {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold mb-2">{service || 'Service'} Metrics</h3>
      {metrics ? (
        <div className="text-sm text-muted-foreground">
          {JSON.stringify(metrics, null, 2)}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No data available</p>
      )}
    </div>
  )
}

const AggregatedMetricsWidget: React.FC<{
  metrics?: Record<string, unknown>
}> = ({ metrics }) => {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold mb-2">Aggregated Revenue</h3>
      {metrics ? (
        <div className="text-sm text-muted-foreground">
          {JSON.stringify(metrics, null, 2)}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No data available</p>
      )}
    </div>
  )
}

const ActivityTimelineWidget: React.FC<{
  services?: Array<{ service: string; metrics: Record<string, unknown> }>
}> = ({ services }) => {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold mb-2">Activity Timeline</h3>
      {services && services.length > 0 ? (
        <div className="text-sm text-muted-foreground">
          {services.length} services active
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No recent activity</p>
      )}
    </div>
  )
}

const QuickActionsWidget: React.FC = () => {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold mb-2">Quick Actions</h3>
      <div className="space-y-2">
        <button className="text-sm text-primary hover:underline">Create New</button>
        <button className="text-sm text-primary hover:underline">View Reports</button>
        <button className="text-sm text-primary hover:underline">Settings</button>
      </div>
    </div>
  )
}

const widgetComponents: Record<string, React.ComponentType<any>> = {
  'crm-overview': ServiceMetricsWidget,
  'finance-summary': ServiceMetricsWidget,
  'pdv-sales': ServiceMetricsWidget,
  'erp-orders': ServiceMetricsWidget,
  'ai-activity': ServiceMetricsWidget,
  'aggregated-revenue': AggregatedMetricsWidget,
  'activity-timeline': ActivityTimelineWidget,
  'quick-actions': QuickActionsWidget,
}

export const getWidgetComponent = (widgetType: string): React.ComponentType<any> => {
  return widgetComponents[widgetType] || ServiceMetricsWidget
}

