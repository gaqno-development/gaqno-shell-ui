import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@gaqno-development/frontcore/components/ui";
import { Button } from "@gaqno-development/frontcore/components/ui";
import { AlertCircle, Home, RefreshCw, Construction } from "lucide-react";

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
  "/sso": "SSO",
  "/rpg": "RPG",
  "/omnichannel": "Omnichannel",
  "/wellness": "Wellness",
  "/saas": "SAAS",
  "/consumer": "Consumer",
  "/intelligence": "Intelligence",
};

const ROUTES_NOT_DEPLOYED = ["/intelligence", "/consumer"];

function getServiceName(pathname: string): string {
  for (const [route, name] of Object.entries(SERVICE_NAMES)) {
    if (pathname.startsWith(route)) {
      return name;
    }
  }
  return "serviço";
}

function isRouteNotDeployed(pathname: string): boolean {
  return ROUTES_NOT_DEPLOYED.some((p) => pathname.startsWith(p));
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
  const navigate = useNavigate();
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  const notDeployed = isRouteNotDeployed(pathname);

  const handleGoToDashboard = () => navigate("/dashboard");
  const handleRetry = () => {
    resetErrorBoundary();
    window.location.reload();
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div
            className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
              notDeployed ? "bg-amber-500/10" : "bg-destructive/10"
            }`}
          >
            {notDeployed ? (
              <Construction className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            ) : (
              <AlertCircle className="h-6 w-6 text-destructive" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {notDeployed ? "Módulo em implantação" : "Serviço Indisponível"}
          </CardTitle>
          <CardDescription>
            {notDeployed
              ? `${serviceName} ainda não está disponível. Use o menu para acessar outras áreas.`
              : `O ${serviceName} não está disponível no momento.`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md bg-muted p-4 text-sm">
            <p className="mb-2 font-medium">
              {notDeployed ? "Por quê?" : "O que aconteceu?"}
            </p>
            <p className="text-muted-foreground">
              {notDeployed
                ? "Este módulo está em implantação. Quando estiver no ar, ele aparecerá aqui normalmente."
                : "O serviço que você está tentando acessar não está respondendo. Pode ser que não esteja em execução ou haja um problema de conexão."}
            </p>
            {error != null && !notDeployed && (
              <p className="mt-2 font-mono text-xs text-muted-foreground">
                {error instanceof Error ? error.message : String(error)}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Button
              variant="default"
              onClick={handleGoToDashboard}
              className="w-full"
            >
              <Home className="mr-2 h-4 w-4" />
              Ir ao Dashboard
            </Button>
            {!notDeployed && (
              <Button
                variant="outline"
                onClick={handleRetry}
                className="w-full"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Tentar novamente
              </Button>
            )}
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
