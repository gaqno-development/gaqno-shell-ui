'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@gaqno-dev/frontcore/utils/supabase/client'

export default function HomePage() {
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    console.log('[AUTH_DEBUG] HomePage: useEffect iniciado')
    
    let isMounted = true
    let timeoutId: NodeJS.Timeout

    const checkAuth = async () => {
      console.log('[AUTH_DEBUG] HomePage: checkAuth iniciado')
      
      try {
        const supabase = createClient()
        
        console.log('[AUTH_DEBUG] HomePage: Chamando getSession com timeout de 3s')
        const sessionPromise = supabase.auth.getSession()
        const timeoutPromise = new Promise<{ data: { session: null } }>((resolve) => {
          timeoutId = setTimeout(() => {
            console.log('[AUTH_DEBUG] HomePage: Timeout ao buscar sessão (3s)')
            resolve({ data: { session: null } })
          }, 3000)
        })

        const sessionResult = await Promise.race([sessionPromise, timeoutPromise])
        clearTimeout(timeoutId)

        console.log('[AUTH_DEBUG] HomePage: getSession concluído', {
          hasResult: !!sessionResult,
          isTimeout: !sessionResult || !(sessionResult as any).data?.session
        })

        if (!isMounted) {
          console.log('[AUTH_DEBUG] HomePage: Componente desmontado, abortando')
          return
        }

        const { data: { session } } = sessionResult as any

        console.log('[AUTH_DEBUG] HomePage: Sessão obtida', {
          hasSession: !!session,
          hasUser: !!session?.user,
          userId: session?.user?.id,
          expiresAt: session?.expires_at
        })

        setIsRedirecting(true)

        if (session?.user) {
          console.log('[AUTH_DEBUG] HomePage: Usuário autenticado, redirecionando para /dashboard', {
            userId: session.user.id
          })
          router.push('/dashboard')
        } else {
          console.log('[AUTH_DEBUG] HomePage: Usuário não autenticado, redirecionando para /login')
          router.push('/login')
        }
      } catch (error) {
        clearTimeout(timeoutId)
        console.error('[AUTH_DEBUG] HomePage: Erro ao verificar autenticação', {
          error,
          errorMessage: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined
        })
        
        if (!isMounted) {
          console.log('[AUTH_DEBUG] HomePage: Componente desmontado após erro, abortando')
          return
        }

        setIsRedirecting(true)
        console.log('[AUTH_DEBUG] HomePage: Erro capturado, redirecionando para /login')
        router.push('/login')
      }
    }

    checkAuth()

    return () => {
      console.log('[AUTH_DEBUG] HomePage: useEffect cleanup')
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

