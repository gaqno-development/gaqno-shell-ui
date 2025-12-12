'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, ILoginFormValues } from '../schema'
import { useUIStore } from '@gaqno-dev/frontcore/store/uiStore'
import { useSignIn } from '@gaqno-dev/frontcore/hooks/auth/useSsoAuth'

export const useLogin = () => {
  const router = useRouter()
  const { addNotification } = useUIStore()
  const signIn = useSignIn()

  const form = useForm<ILoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = form.handleSubmit(
    (values: ILoginFormValues) => {
      signIn.mutate(
        {
          email: values.email,
          password: values.password,
        },
        {
          onSuccess: () => {
            addNotification({
              type: 'success',
              title: 'Login realizado',
              message: 'Redirecionando para o dashboard...',
              duration: 2000,
            })
            setTimeout(() => {
              window.location.href = '/dashboard'
            }, 300)
          },
          onError: (error: Error) => {
            const errorMessage = error.message || 'Erro ao fazer login'
            form.setError('root', {
              message: errorMessage,
            })
            addNotification({
              type: 'error',
              title: 'Erro no login',
              message: errorMessage,
            })
          },
        }
      )
    },
    (errors) => {
      console.log('[AUTH] Erros de validação:', errors)
    }
  )

  return {
    form,
    onSubmit,
    isSubmitting: signIn.isPending,
    error: form.formState.errors.root?.message,
  }
}

