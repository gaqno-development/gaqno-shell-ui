import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authStorage } from '@/utils/auth-storage'

export default function HomePage() {
  const navigate = useNavigate()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    console.log('[AUTH_DEBUG] HomePage: useEffect iniciado')
    
    let isMounted = true

    const checkAuth = async () => {
      console.log('[AUTH_DEBUG] HomePage: checkAuth iniciado')
      
      try {
        const authState = authStorage.get()
        
        console.log('[AUTH_DEBUG] HomePage: Verificando estado de autenticação', {
          hasAuthState: !!authState,
          hasUser: !!authState?.user,
          hasSession: !!authState?.session
        })

        if (!isMounted) {
          console.log('[AUTH_DEBUG] HomePage: Componente desmontado, abortando')
          return
        }

        setIsRedirecting(true)

        if (authState?.user && authState?.session?.access_token) {
          console.log('[AUTH_DEBUG] HomePage: Usuário autenticado, redirecionando para /dashboard', {
            userId: authState.user.id
          })
          navigate('/dashboard')
        } else {
          console.log('[AUTH_DEBUG] HomePage: Usuário não autenticado, redirecionando para /login')
          navigate('/login')
        }
      } catch (error) {
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
        navigate('/login')
      }
    }

    checkAuth()

    return () => {
      console.log('[AUTH_DEBUG] HomePage: useEffect cleanup')
      isMounted = false
    }
  }, [navigate])

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

