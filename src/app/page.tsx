'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@gaqno-dev/core/utils/supabase/client'

export default function HomePage() {
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    let isMounted = true
    let timeoutId: NodeJS.Timeout

    const checkAuth = async () => {
      try {
        const supabase = createClient()
        
        // Use getSession() - faster, reads from cookies
        const sessionPromise = supabase.auth.getSession()
        const timeoutPromise = new Promise<{ data: { session: null } }>((resolve) => {
          timeoutId = setTimeout(() => {
            resolve({ data: { session: null } })
          }, 3000) // 3 second timeout
        })

        const sessionResult = await Promise.race([sessionPromise, timeoutPromise])
        clearTimeout(timeoutId)

        if (!isMounted) return

        const { data: { session } } = sessionResult as any

        setIsRedirecting(true)

        if (session?.user) {
          router.push('/dashboard')
        } else {
          router.push('/login')
        }
      } catch (error) {
        clearTimeout(timeoutId)
        console.error('Auth check error:', error)
        
        if (!isMounted) return

        setIsRedirecting(true)
        // On any error, redirect to login
        router.push('/login')
      }
    }

    checkAuth()

    return () => {
      isMounted = false
      clearTimeout(timeoutId)
    }
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse text-center">
        <p className="text-muted-foreground">
          {isRedirecting ? 'Redirecionando...' : 'Carregando...'}
        </p>
      </div>
    </div>
  )
}

