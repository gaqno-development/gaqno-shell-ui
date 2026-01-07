import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useSignIn } from '@gaqno-development/frontcore/hooks/auth/useSsoAuth'
import { authStorage } from '@/utils/auth-storage'
import { ssoAxiosClient } from '@gaqno-development/frontcore/utils/api/sso-client'
import { getFirstAvailableRoute } from '@/utils/route-utils'

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export const useLogin = () => {
  const navigate = useNavigate()
  const signIn = useSignIn()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = form.handleSubmit(
    (values) => {
      signIn.mutate(
        {
          email: values.email,
          password: values.password,
        },
        {
          onSuccess: async (data) => {
            if (data) {
              authStorage.set(data.user, {
                access_token: data.tokens.accessToken,
                expires_at: data.tokens.expiresAt,
              })

              try {
                const { data: permissionsData } = await ssoAxiosClient.get<{ permissions: string[] }>('/permissions/my-permissions')
                const userPermissions = permissionsData.permissions || []
                const hasDashboardAccess = userPermissions.includes('dashboard.access') || userPermissions.includes('platform.all')

                if (hasDashboardAccess) {
                  navigate('/dashboard')
                } else {
                  const firstRoute = getFirstAvailableRoute(userPermissions)
                  if (firstRoute) {
                    navigate(firstRoute)
                  } else {
                    navigate('/unauthorized')
                  }
                }
              } catch (error) {
                console.error('[LOGIN] Error fetching permissions:', error)
                navigate('/dashboard')
              }
            } else {
              navigate('/dashboard')
            }
          },
          onError: (error: Error) => {
            const errorMessage = error.message || 'Erro ao fazer login'
            form.setError('root', {
              message: errorMessage,
            })
          },
        }
      )
    },
    (errors) => {
      console.log('[LOGIN] Validation errors:', errors)
    }
  )

  return {
    form,
    onSubmit,
    isSubmitting: signIn.isPending,
    error: form.formState.errors.root?.message,
  }
}

