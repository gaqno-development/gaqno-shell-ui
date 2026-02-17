import React from "react";
import { useRouteError, useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@gaqno-development/frontcore/components/ui";
import { Button } from "@gaqno-development/frontcore/components/ui";
import { AlertCircle, Home, RefreshCw } from "lucide-react";

const SERVICE_NAMES: Record<string, string> = {
  "/dashboard/profile": "Perfil",
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
  "/omnichannel": "Omnichannel",
};

function getServiceName(pathname: string): string {
  for (const [route, name] of Object.entries(SERVICE_NAMES)) {
    if (pathname.startsWith(route)) {
      return name;
    }
  }
  return "serviço";
}

export function RouteErrorElement() {
  const error = useRouteError();
  const navigate = useNavigate();
  const location = useLocation();
  const serviceName = getServiceName(location.pathname);

  const errorMessage =
    error instanceof Error
      ? error.message
      : typeof (error as { message?: string })?.message === "string"
        ? (error as { message: string }).message
        : "Ocorreu um erro inesperado";
  const errorDetails =
    error instanceof Error
      ? error.stack
      : typeof error === "object" && error !== null
        ? JSON.stringify(error, null, 2)
        : String(error);

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
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
            {errorMessage && (
              <p className="mt-2 text-xs text-muted-foreground font-mono break-words">
                {errorMessage}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Button onClick={() => navigate("/dashboard")} className="w-full">
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

          {process.env.NODE_ENV === "development" && errorDetails && (
            <details className="mt-4">
              <summary className="text-xs text-muted-foreground cursor-pointer">
                Detalhes do erro (desenvolvimento)
              </summary>
              <pre className="mt-2 text-xs text-muted-foreground font-mono bg-muted p-2 rounded overflow-auto max-h-40">
                {errorDetails}
              </pre>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
