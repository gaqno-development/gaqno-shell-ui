import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDashboardWidgets, useDashboardData, useDashboardPreferences, useSaveDashboardPreferences } from '../hooks/useDashboard'
import { getWidgetComponent } from '../config/widget-registry'
import { WidgetConfig } from '../types/dashboard.types'
import { DashboardGrid } from '../components/dashboard/DashboardGrid'
import { WidgetConfigDialog } from '../components/dashboard/WidgetConfigDialog'
import { Button, Alert, AlertDescription, AlertTitle } from '@gaqno-dev/frontcore/components/ui'
import { Settings, AlertCircle } from 'lucide-react'
import { useUserPermissions } from '@gaqno-dev/frontcore/hooks/useUserPermissions'
import { getFirstAvailableRoute } from '@/utils/route-utils'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [configuringWidget, setConfiguringWidget] = useState<WidgetConfig | null>(null)
  const { permissions, isLoading: permissionsLoading, hasPermission } = useUserPermissions()
  
  const { 
    data: widgetsData, 
    isLoading: widgetsLoading, 
    error: widgetsError 
  } = useDashboardWidgets()
  
  const { 
    data: summaryData, 
    isLoading: summaryLoading, 
    error: summaryError,
    refetch: refetchSummary
  } = useDashboardData()
  
  const { 
    data: preferences, 
    isLoading: preferencesLoading,
    error: preferencesError
  } = useDashboardPreferences()
  
  const savePreferences = useSaveDashboardPreferences()

  useEffect(() => {
    if (!permissionsLoading && !hasPermission('dashboard.access')) {
      const firstRoute = getFirstAvailableRoute(permissions)
      if (firstRoute) {
        navigate(firstRoute)
      } else {
        navigate('/unauthorized')
      }
    }
  }, [permissions, permissionsLoading, hasPermission, navigate])

  const isLoading = permissionsLoading || widgetsLoading || summaryLoading || preferencesLoading
  const hasError = widgetsError || summaryError || preferencesError

  if (permissionsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
        <p className="text-sm text-muted-foreground">Checking permissions...</p>
      </div>
    )
  }

  if (!hasPermission('dashboard.access')) {
    return null
  }

  const handleToggleWidget = (widgetId: string) => {
    if (!preferences) return

    const updatedWidgets = preferences.widgets.map(w =>
      w.id === widgetId ? { ...w, visible: !w.visible } : w
    )

    savePreferences.mutate({
      ...preferences,
      widgets: updatedWidgets
    })
  }

  const handleReorder = (reorderedWidgets: WidgetConfig[]) => {
    if (!preferences) return

    savePreferences.mutate({
      ...preferences,
      widgets: reorderedWidgets
    })
  }

  const handleConfigureWidget = (widget: WidgetConfig) => {
    setConfiguringWidget(widget)
  }

  const handleSaveWidgetConfig = (config: WidgetConfig) => {
    if (!preferences) return

    const updatedWidgets = preferences.widgets.map(w =>
      w.id === config.id ? config : w
    )

    savePreferences.mutate({
      ...preferences,
      widgets: updatedWidgets
    })
  }

  const visibleWidgets = useMemo(() => {
    if (!preferences) return []
    return preferences.widgets
      .filter(w => w.visible)
      .sort((a, b) => a.position - b.position)
  }, [preferences])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
        <p className="text-sm text-muted-foreground">Loading dashboard...</p>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error loading dashboard</AlertTitle>
          <AlertDescription>
            {widgetsError && 'Failed to load widgets. '}
            {summaryError && 'Failed to load dashboard data. '}
            {preferencesError && 'Failed to load preferences. '}
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => {
                if (summaryError) refetchSummary()
              }}
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (visibleWidgets.length === 0) {
    return (
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Configure seus widgets para começar
          </p>
        </div>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <p className="text-muted-foreground">Nenhum widget configurado</p>
          <Button onClick={() => {
            if (widgetsData?.widgets && widgetsData.widgets.length > 0 && preferences) {
              const firstWidget = widgetsData.widgets[0]
              const updatedWidgets = [
                ...preferences.widgets,
                {
                  ...firstWidget,
                  visible: true,
                  position: preferences.widgets.length
                }
              ]
              savePreferences.mutate({
                ...preferences,
                widgets: updatedWidgets
              })
            }
          }}>
            Add Widget
          </Button>
        </div>
      </div>
    )
  }

  const serviceMetricsMap = new Map()
  summaryData?.services.forEach(service => {
    serviceMetricsMap.set(service.service, service.metrics)
  })

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral dos seus serviços
          </p>
        </div>
        {summaryData && summaryData.aggregated?.lastUpdated && (
          <div className="text-xs text-muted-foreground">
            Last updated: {new Date(summaryData.aggregated.lastUpdated as string).toLocaleTimeString()}
          </div>
        )}
      </div>

      {savePreferences.isPending && (
        <Alert>
          <AlertDescription>Saving preferences...</AlertDescription>
        </Alert>
      )}

      <DashboardGrid
        widgets={visibleWidgets}
        onReorder={handleReorder}
      >
        {visibleWidgets.map((widget: WidgetConfig) => {
          const WidgetComponent = getWidgetComponent(widget.type)
          const serviceName = widget.type.split('-')[0]
          const metrics = serviceMetricsMap.get(serviceName)

          let widgetContent

          if (widget.type === 'aggregated-revenue' && summaryData?.aggregated) {
            widgetContent = (
              <WidgetComponent metrics={summaryData.aggregated} />
            )
          } else if (widget.type === 'activity-timeline' && summaryData?.services) {
            widgetContent = (
              <WidgetComponent services={summaryData.services} />
            )
          } else if (widget.type === 'quick-actions') {
            widgetContent = <WidgetComponent />
          } else if (metrics) {
            widgetContent = (
              <WidgetComponent
                service={serviceName}
                metrics={metrics}
              />
            )
          } else {
            widgetContent = (
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold">{widget.type}</h3>
                <p className="text-sm text-muted-foreground">No data available</p>
              </div>
            )
          }

          return (
            <div key={widget.id} className="relative group">
              {widgetContent}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleConfigureWidget(widget)}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          )
        })}
      </DashboardGrid>

      {configuringWidget && (
        <WidgetConfigDialog
          widget={configuringWidget}
          isOpen={!!configuringWidget}
          onClose={() => setConfiguringWidget(null)}
          onSave={handleSaveWidgetConfig}
        />
      )}
    </div>
  )
}

