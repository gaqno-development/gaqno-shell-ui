'use client'

import React from 'react'
import { DashboardLayout } from '@gaqno-dev/ui/components'
import { AppProvider } from '@gaqno-dev/ui/components/providers'
import { WhiteLabelProvider } from '@gaqno-dev/ui/components/providers'
import { ToastContainer } from '@gaqno-dev/ui/components/ui'
import { TenantProvider } from '@gaqno-dev/frontcore/contexts'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <WhiteLabelProvider>
        <TenantProvider>
          <DashboardLayout>{children}</DashboardLayout>
          <ToastContainer />
        </TenantProvider>
      </WhiteLabelProvider>
    </AppProvider>
  )
}

