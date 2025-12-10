'use client'

import React, { Component, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@gaqno-dev/ui/components/ui'
import { Button } from '@gaqno-dev/ui/components/ui'
import { AlertCircle, Home, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  serviceName: string
}

const SERVICE_NAMES: Record<string, string> = {
  '/dashboard/finance': 'Finance',
  '/dashboard/crm': 'CRM',
  '/dashboard/erp': 'ERP',
  '/dashboard/books': 'AI/Books',
  '/dashboard/admin': 'Admin',
  '/admin': 'Admin',
  '/pdv': 'PDV',
}

function getServiceName(pathname: string): string {
  for (const [route, name] of Object.entries(SERVICE_NAMES)) {
    if (pathname.startsWith(route)) {
      return name
    }
  }
  return 'serviço'
}

export class MicroFrontendErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      serviceName: 'serviço',
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Micro-frontend error:', error, errorInfo)
    
    // Check if it's a network/fetch error
    if (
      error.message.includes('fetch') ||
      error.message.includes('network') ||
      error.message.includes('Failed to fetch') ||
      error.message.includes('ECONNREFUSED')
    ) {
      const pathname = window.location.pathname
      this.setState({
        serviceName: getServiceName(pathname),
      })
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <MicroFrontendErrorFallback
          serviceName={this.state.serviceName}
          error={this.state.error}
        />
      )
    }

    return this.props.children
  }
}

interface FallbackProps {
  serviceName: string
  error: Error | null
}

function MicroFrontendErrorFallback({ serviceName, error }: FallbackProps) {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Serviço Indisponível</CardTitle>
          <CardDescription>
            O {serviceName} não está disponível no momento
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
            {error && (
              <p className="mt-2 text-xs text-muted-foreground font-mono">
                {error.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Button
              onClick={() => router.push('/dashboard')}
              className="w-full"
            >
              <Home className="mr-2 h-4 w-4" />
              Voltar ao Dashboard
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                router.refresh()
                window.location.reload()
              }}
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

