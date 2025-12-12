import { NextRequest, NextResponse } from 'next/server'
import { SERVICE_URLS } from '@gaqno-dev/frontcore/config/service-urls'

const AUTH_SERVICE_URL = SERVICE_URLS.AUTH

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path') || 'login'
  
  try {
    const response = await fetch(`${AUTH_SERVICE_URL}/${path}`, {
      method: 'GET',
      headers: {
        'Accept': 'text/html',
        'Cookie': request.headers.get('cookie') || '',
      },
      redirect: 'follow',
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Auth service unavailable' },
        { status: response.status }
      )
    }

    const html = await response.text()
    
    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    })
  } catch (error) {
    console.error('Auth proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to connect to auth service' },
      { status: 503 }
    )
  }
}

