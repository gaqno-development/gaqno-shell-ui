'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@gaqno-dev/core/utils/supabase/client'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@gaqno-dev/ui/components/ui'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@gaqno-dev/ui/components/ui'
import { Input } from '@gaqno-dev/ui/components/ui'
import { Button } from '@gaqno-dev/ui/components/ui'
import { useLogin } from './hooks/useLogin'

export default function LoginPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const { form, onSubmit, isSubmitting, error } = useLogin()

  useEffect(() => {
    setMounted(true)
    
    const checkAuth = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          router.push('/dashboard')
        }
      } catch (error) {
        console.error('Auth check error:', error)
      }
    }

    checkAuth()
  }, [router])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-center">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Entre com suas credenciais para acessar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="seu@email.com" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Não tem uma conta?{' '}
            <Link 
              href="/register" 
              className="font-medium text-primary hover:underline"
            >
              Registre-se
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
