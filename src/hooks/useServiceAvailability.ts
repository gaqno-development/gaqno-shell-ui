'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { getServiceName, SERVICE_ROUTE_MAP } from '@gaqno-dev/frontcore/config/service-urls'

interface ServiceAvailability {
  available: boolean
  isLoading: boolean
  serviceName: string
  error?: string
}

function isMicroFrontendRoute(pathname: string): boolean {
  return Object.keys(SERVICE_ROUTE_MAP).some(route => pathname.startsWith(route))
}

export function useServiceAvailability(): ServiceAvailability {
  const pathname = usePathname()
  const [availability, setAvailability] = useState<ServiceAvailability>({
    available: true,
    isLoading: false,
    serviceName: getServiceName(pathname),
  })

  useEffect(() => {
    // Only check for micro-frontend routes
    if (!isMicroFrontendRoute(pathname)) {
      setAvailability({
        available: true,
        isLoading: false,
        serviceName: '',
      })
      return
    }

    const checkAvailability = async () => {
      setAvailability(prev => ({ ...prev, isLoading: true }))

      try {
        const response = await fetch(`/api/proxy-check?path=${encodeURIComponent(pathname)}`)
        const data = await response.json()

        setAvailability({
          available: data.available || false,
          isLoading: false,
          serviceName: data.serviceName || getServiceName(pathname),
          error: data.error,
        })
      } catch (error) {
        setAvailability({
          available: false,
          isLoading: false,
          serviceName: getServiceName(pathname),
          error: error instanceof Error ? error.message : 'Erro desconhecido',
        })
      }
    }

    checkAvailability()
  }, [pathname])

  return availability
}

