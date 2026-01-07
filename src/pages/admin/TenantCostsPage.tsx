import React from 'react'
import { useParams } from 'react-router-dom'
import { TenantCostsSummary } from '@gaqno-development/frontcore/components/admin'

export default function TenantCostsPage() {
  const { tenantId } = useParams<{ tenantId?: string }>()

  if (!tenantId) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center text-muted-foreground">
          Please select a tenant to view costs
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <TenantCostsSummary tenantId={tenantId} />
    </div>
  )
}

