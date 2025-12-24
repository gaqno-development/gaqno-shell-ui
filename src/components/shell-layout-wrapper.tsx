import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { DashboardLayout } from '@gaqno-dev/frontcore/components'
import { AppProvider } from '@gaqno-dev/frontcore/components/providers'
import { WhiteLabelProvider } from '@gaqno-dev/frontcore/components/providers'
import { TenantProvider } from '@gaqno-dev/frontcore/contexts'
import { useFilteredMenu } from '@gaqno-dev/frontcore/hooks'
import { useAuth } from '@gaqno-dev/frontcore/hooks'

const AUTHENTICATED_ROUTES = [
  '/dashboard',
  '/ai',
  '/crm',
  '/erp',
  '/finance',
  '/pdv',
  '/admin',
  '/sso',
]

const PUBLIC_ROUTES = ['/login', '/register', '/']

const MICRO_FRONTEND_ROUTES = ['/ai', '/crm', '/erp', '/finance', '/pdv', '/admin', '/sso']

function shouldShowDashboardLayout(pathname: string): boolean {
  if (PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(route + '/'))) {
    return false
  }
  
  return AUTHENTICATED_ROUTES.some((route) => pathname.startsWith(route))
}

function isMicroFrontendRoute(pathname: string): boolean {
  return MICRO_FRONTEND_ROUTES.some((route) => pathname.startsWith(route))
}

interface ShellLayoutWrapperProps {
  children: React.ReactNode
}

export function ShellLayoutWrapper({ children }: ShellLayoutWrapperProps) {
  const location = useLocation()
  const pathname = location.pathname
  const { user, loading } = useAuth()
  const [shouldShowLayout, setShouldShowLayout] = useState(false)
  const [isMicroFrontend, setIsMicroFrontend] = useState(false)
  const menuItems = useFilteredMenu()

  useEffect(() => {
    const showLayout = shouldShowDashboardLayout(pathname) && !loading && user
    const isMFE = isMicroFrontendRoute(pathname)
    setShouldShowLayout(showLayout)
    setIsMicroFrontend(isMFE)
  }, [pathname, loading, user])

  if (!shouldShowLayout) {
    return <>{children}</>
  }

  return (
    <AppProvider>
      <WhiteLabelProvider>
        <TenantProvider>
          <DashboardLayout menuItems={menuItems}>{children}</DashboardLayout>
        </TenantProvider>
      </WhiteLabelProvider>
    </AppProvider>
  )
}

