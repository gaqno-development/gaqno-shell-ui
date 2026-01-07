import React, { useEffect, useState } from 'react'
import { useLocation, Outlet } from 'react-router-dom'
import { DashboardLayout } from '@gaqno-development/frontcore/components'
import { AppProvider } from '@gaqno-development/frontcore/components/providers'
import { WhiteLabelProvider } from '@gaqno-development/frontcore/components/providers'
import { TenantProvider } from '@gaqno-development/frontcore/contexts'
import { useFilteredMenu } from '@gaqno-development/frontcore/hooks'
import { useAuth } from '@gaqno-development/frontcore/hooks'

const AUTHENTICATED_ROUTES = [
  '/dashboard',
  '/ai',
  '/crm',
  '/erp',
  '/finance',
  '/pdv',
  '/admin',
  '/sso',
  '/rpg',
]

const PUBLIC_ROUTES = ['/login', '/register', '/']

const MICRO_FRONTEND_ROUTES = ['/ai', '/crm', '/erp', '/finance', '/pdv', '/rpg', '/admin', '/sso']

function shouldShowDashboardLayout(pathname: string): boolean {
  if (PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(route + '/'))) {
    return false
  }
  
  return AUTHENTICATED_ROUTES.some((route) => pathname.startsWith(route))
}

function isMicroFrontendRoute(pathname: string): boolean {
  return MICRO_FRONTEND_ROUTES.some((route) => pathname.startsWith(route))
}

export function ShellLayoutWrapper() {
  const location = useLocation()
  const pathname = location.pathname
  const { user, loading } = useAuth()
  const [shouldShowLayout, setShouldShowLayout] = useState(false)
  const [isMicroFrontend, setIsMicroFrontend] = useState(false)
  const menuItems = useFilteredMenu()

  useEffect(() => {
    const isMFE = isMicroFrontendRoute(pathname)
    const showLayout = shouldShowDashboardLayout(pathname) && !loading && !!user
    setShouldShowLayout(showLayout)
    setIsMicroFrontend(isMFE)
  }, [pathname, loading, user])

  if (!shouldShowLayout) {
    return <Outlet />
  }

  return (
    <AppProvider>
      <WhiteLabelProvider>
        <TenantProvider>
          <DashboardLayout menuItems={menuItems}>
            <Outlet />
          </DashboardLayout>
        </TenantProvider>
      </WhiteLabelProvider>
    </AppProvider>
  )
}

