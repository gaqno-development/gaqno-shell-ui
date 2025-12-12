import { NextRequest, NextResponse } from 'next/server'
import { getServiceUrl, getServiceName } from '@gaqno-dev/frontcore/config/service-urls'

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

