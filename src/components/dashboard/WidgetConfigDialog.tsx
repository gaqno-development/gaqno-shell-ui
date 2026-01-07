import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@gaqno-development/frontcore/components/ui'
import { Button } from '@gaqno-development/frontcore/components/ui'
import type { WidgetConfig } from '../../types/dashboard.types'

interface WidgetConfigDialogProps {
  widget: WidgetConfig
  isOpen: boolean
  onClose: () => void
  onSave: (config: WidgetConfig) => void
}

export const WidgetConfigDialog: React.FC<WidgetConfigDialogProps> = ({
  widget,
  isOpen,
  onClose,
  onSave,
}) => {
  const handleSave = () => {
    onSave(widget)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configure Widget</DialogTitle>
          <DialogDescription>
            Configure settings for {widget.type}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Widget configuration options will be available here.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

