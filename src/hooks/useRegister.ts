import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useSignUp } from '@gaqno-development/frontcore/hooks/auth/useSsoAuth'
import { authStorage } from '@/utils/auth-storage'

const passwordSchema = z
  .string()
  .min(6, 'A senha deve ter no mínimo 6 caracteres')
  .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
  .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
  .regex(/[0-9]/, 'A senha deve conter pelo menos um número')

const registerSchema = z
  .object({
    name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    email: z.string().email('E-mail inválido'),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

export const useRegister = () => {
  const navigate = useNavigate()
  const signUp = useSignUp()

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = form.handleSubmit(
    (values) => {
      const browserLocale =
        typeof window !== 'undefined'
          ? navigator.language || Intl.DateTimeFormat().resolvedOptions().locale
          : 'pt-BR'
      const inferredCountryIso = (browserLocale?.split('-')[1] || 'BR').toUpperCase()

      signUp.mutate(
        {
          email: values.email,
          password: values.password,
          metadata: {
            name: values.name,
            country_iso: inferredCountryIso,
          },
        },
        {
          onSuccess: (data) => {
            if (data) {
              authStorage.set(data.user, {
                access_token: data.tokens.accessToken,
                expires_at: data.tokens.expiresAt,
              })
            }
            navigate('/dashboard')
          },
          onError: (error: Error) => {
            const errorMessage = error.message || 'Erro ao registrar'
            form.setError('root', {
              message: errorMessage,
            })
          },
        }
      )
    },
    (errors) => {
      console.log('[REGISTER] Erros de validação:', errors)
    }
  )

  return {
    form,
    onSubmit,
    isSubmitting: signUp.isPending,
    error: form.formState.errors.root?.message,
  }
}

