'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface ServiceAvailability {
  available: boolean
  isLoading: boolean
  serviceName: string
  error?: string
}

const SERVICE_NAMES: Record<string, string> = {
  '/dashboard/finance': 'Finance',
  '/dashboard/crm': 'CRM',
  '/dashboard/erp': 'ERP',
  '/dashboard/books': 'AI/Books',
  '/dashboard/admin': 'Admin',
  '/admin': 'Admin',
  '/pdv': 'PDV',
}

function getServiceName(pathname: string): string {
  for (const [route, name] of Object.entries(SERVICE_NAMES)) {
    if (pathname.startsWith(route)) {
      return name
    }
  }
  return 'serviço'
}

function isMicroFrontendRoute(pathname: string): boolean {
  return Object.keys(SERVICE_NAMES).some(route => pathname.startsWith(route))
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

