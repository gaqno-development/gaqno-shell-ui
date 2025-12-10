'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@gaqno-dev/ui/components/ui'
import { Button } from '@gaqno-dev/ui/components/ui'
import { AlertCircle, Home } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <CardTitle className="text-2xl">Erro no Sistema</CardTitle>
              <CardDescription>
                Ocorreu um erro inesperado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md bg-muted p-4 text-sm">
                <p className="font-medium mb-2">Detalhes do erro:</p>
                <p className="text-muted-foreground font-mono text-xs">
                  {error.message || 'Erro desconhecido'}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => {
                    window.location.href = '/dashboard'
                  }}
                  className="w-full"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Voltar ao Dashboard
                </Button>
                <Button
                  variant="outline"
                  onClick={reset}
                  className="w-full"
                >
                  Tentar Novamente
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </body>
    </html>
  )
}

