'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, IRegisterFormValues } from '../schema'
import { createClient } from '@gaqno-dev/frontcore/utils/supabase/client'
import { UserRole } from '@gaqno-dev/frontcore/types/user'

export const useRegister = () => {
  const router = useRouter()
  const supabase = createClient()

  const form = useForm<IRegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = form.handleSubmit(async (values: IRegisterFormValues) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const browserLocale = typeof window !== 'undefined' 
        ? navigator.language || Intl.DateTimeFormat().resolvedOptions().locale 
        : 'pt-BR'
      const inferredCountryIso = (browserLocale?.split('-')[1] || 'BR').toUpperCase()

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            name: values.name,
            role: UserRole.USER,
            country_iso: inferredCountryIso,
          }
        }
      })

      if (authError) {
        if (authError.message.includes('already registered') || authError.message.includes('already exists')) {
          setError('Este email já está cadastrado')
          return
        }
        setError(authError.message || 'Erro ao registrar')
        return
      }

      if (!authData.user) {
        setError('Falha ao criar usuário')
        return
      }

      let retries = 10
      let profile = null

      while (retries > 0 && !profile) {
        await new Promise(resolve => setTimeout(resolve, 500))

        const { data: profileData } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', authData.user.id)
          .maybeSingle()

        profile = profileData
        retries--
      }

      if (!profile) {
        console.warn('Profile not created by trigger, but user registration succeeded')
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? (err.message.includes('User already registered') || err.message.includes('already exists')
          ? 'Este email já está cadastrado'
          : err.message)
        : 'Erro ao registrar'
      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  })

  return {
    form,
    onSubmit,
    isSubmitting,
    error: error || form.formState.errors.root?.message,
  }
}

