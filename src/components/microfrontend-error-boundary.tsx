import type { ReactNode } from "react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@gaqno-development/frontcore/components/ui";
import { Button } from "@gaqno-development/frontcore/components/ui";
import { AlertCircle, Home, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

const SERVICE_NAMES: Record<string, string> = {
  "/dashboard/finance": "Finance",
  "/dashboard/crm": "CRM",
  "/dashboard/erp": "ERP",
  "/dashboard/books": "AI/Books",
  "/dashboard/admin": "Admin",
  "/admin": "Admin",
  "/pdv": "PDV",
  "/crm": "CRM",
  "/erp": "ERP",
  "/finance": "Finance",
  "/ai": "AI",
};

function getServiceName(pathname: string): string {
  for (const [route, name] of Object.entries(SERVICE_NAMES)) {
    if (pathname.startsWith(route)) {
      return name;
    }
  }
  return "serviço";
}

interface FallbackProps {
  serviceName: string;
  error: unknown;
  resetErrorBoundary: () => void;
}

function MicroFrontendErrorFallback({
  serviceName,
  error,
  resetErrorBoundary,
}: FallbackProps) {
  const handleGoToDashboard = () => {
    window.location.href = "/dashboard";
  };

  const handleRetry = () => {
    resetErrorBoundary();
    window.location.reload();
  };

  return (
    <div className="flex items-center justify-center p-6">
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
              Isso pode acontecer se o serviço não estiver em execução ou se
              houver um problema de conexão.
            </p>
            {error != null && (
              <p className="mt-2 text-xs text-muted-foreground font-mono">
                {error instanceof Error ? error.message : String(error)}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Button onClick={handleGoToDashboard} className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Voltar ao Dashboard
            </Button>
            <Button variant="outline" onClick={handleRetry} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Tentar Novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function MicroFrontendErrorBoundary({ children, fallback }: Props) {
  if (fallback) {
    return (
      <ReactErrorBoundary fallback={fallback}>{children}</ReactErrorBoundary>
    );
  }
  return (
    <ReactErrorBoundary
      onError={(error, info) => {
        console.error("Micro-frontend error:", error, info);
      }}
      fallbackRender={({ error, resetErrorBoundary }) => (
        <MicroFrontendErrorFallback
          serviceName={getServiceName(window.location.pathname)}
          error={error}
          resetErrorBoundary={resetErrorBoundary}
        />
      )}
    >
      {children}
    </ReactErrorBoundary>
  );
}
