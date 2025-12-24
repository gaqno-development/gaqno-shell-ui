import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@gaqno-dev/frontcore/components/ui'
import { Button } from '@gaqno-dev/frontcore/components/ui'
import { AlertCircle, Home, RefreshCw } from 'lucide-react'

export default function ErrorPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const service = searchParams.get('service') || 'serviço'
  const path = searchParams.get('path') || '/dashboard'

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Serviço Indisponível</CardTitle>
          <CardDescription>
            O {service} não está disponível no momento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md bg-muted p-4 text-sm">
            <p className="font-medium mb-2">O que aconteceu?</p>
            <p className="text-muted-foreground">
              O serviço que você está tentando acessar não está respondendo. 
              Isso pode acontecer se o serviço não estiver em execução ou se houver 
              um problema de conexão.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              onClick={() => navigate('/dashboard')}
              className="w-full"
            >
              <Home className="mr-2 h-4 w-4" />
              Voltar ao Dashboard
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="w-full"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Tentar Novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

