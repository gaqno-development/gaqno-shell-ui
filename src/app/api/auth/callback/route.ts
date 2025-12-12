import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export async function POST(request: NextRequest) {
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ ok: false, error: 'Supabase env not set' }, { status: 500 })
  }

  const body = await request.json().catch(() => null)
  const session = body?.session

  const response = NextResponse.json({ ok: true })

  if (!session) return response

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookies) => {
        cookies.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options as any)
        })
      },
    },
  })

  await supabase.auth.setSession({
    access_token: session.access_token,
    refresh_token: session.refresh_token ?? '',
  })

  return response
}

