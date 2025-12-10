'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, ILoginFormValues } from '../schema'
import { createClient } from '@gaqno-dev/core/utils/supabase/client'

export const useLogin = () => {
  const router = useRouter()
  const supabase = createClient()

  const form = useForm<ILoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = form.handleSubmit(async (values: ILoginFormValues) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })

      if (signInError) {
        setError(signInError.message || 'Erro ao fazer login')
        return
      }

      if (data) {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login')
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

