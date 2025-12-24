import React from 'react'
import type { WidgetConfig } from '../../types/dashboard.types'

interface DashboardGridProps {
  widgets: WidgetConfig[]
  onReorder?: (reorderedWidgets: WidgetConfig[]) => void
  children?: React.ReactNode
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({
  widgets,
  onReorder,
  children,
}) => {
  // Simple grid layout - can be enhanced with drag-and-drop later
  const columns = 3
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: '1rem',
  }

  return (
    <div style={gridStyle} className="w-full">
      {children}
    </div>
  )
}

