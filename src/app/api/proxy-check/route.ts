import { NextRequest, NextResponse } from 'next/server'

const SERVICE_URLS: Record<string, string> = {
  '/dashboard/finance': process.env.FINANCE_SERVICE_URL || 'http://localhost:3006',
  '/dashboard/crm': process.env.CRM_SERVICE_URL || 'http://localhost:3004',
  '/dashboard/erp': process.env.ERP_SERVICE_URL || 'http://localhost:3005',
  '/dashboard/books': process.env.AI_SERVICE_URL || 'http://localhost:3003',
  '/dashboard/admin': process.env.ADMIN_SERVICE_URL || 'http://localhost:3002',
  '/admin': process.env.ADMIN_SERVICE_URL || 'http://localhost:3002',
  '/pdv': process.env.PDV_SERVICE_URL || 'http://localhost:3008',
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

function getServiceUrl(pathname: string): string | null {
  for (const [route, url] of Object.entries(SERVICE_URLS)) {
    if (pathname.startsWith(route)) {
      return url
    }
  }
  return null
}

function getServiceName(pathname: string): string {
  for (const [route, name] of Object.entries(SERVICE_NAMES)) {
    if (pathname.startsWith(route)) {
      return name
    }
  }
  return 'serviço'
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path') || '/dashboard'

  const serviceUrl = getServiceUrl(path)
  
  if (!serviceUrl) {
    return NextResponse.json({ available: true, isNative: true })
  }

  try {
    // Try to connect to the service with a short timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 2000) // 2 second timeout

    const response = await fetch(`${serviceUrl}${path}`, {
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        'Accept': 'text/html',
      },
    })

    clearTimeout(timeoutId)

    return NextResponse.json({
      available: response.ok,
      serviceName: getServiceName(path),
    })
  } catch (error) {
    return NextResponse.json({
      available: false,
      serviceName: getServiceName(path),
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}

