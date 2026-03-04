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
import { AlertCircle, Home, RefreshCw, Construction } from "lucide-react";

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
  "/wellness": "Wellness",
  "/saas": "SAAS",
  "/consumer": "Consumer",
  "/intelligence": "Intelligence",
};

const ROUTES_NOT_DEPLOYED = ["/intelligence", "/consumer"];
function isRouteNotDeployed(pathname: string): boolean {
  return ROUTES_NOT_DEPLOYED.some((p) => pathname.startsWith(p));
}

const PUBLIC_PATHS = ["/", "/login", "/register", "/recovery-pass"];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

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
  const inline = !isPublicRoute(location.pathname);
  const notDeployed = isRouteNotDeployed(location.pathname);

  React.useEffect(() => {
    if (error != null) {
      console.error("[RouteErrorElement]", location.pathname, error);
    }
  }, [error, location.pathname]);

  const errorMessage = (() => {
    if (error instanceof Error && error.message) return error.message;
    if (typeof (error as { message?: string })?.message === "string")
      return (error as { message: string }).message;
    if (typeof error === "string") return error;
    if (error && typeof (error as { reason?: unknown })?.reason !== "undefined")
      return String((error as { reason: unknown }).reason);
    if (error && typeof error === "object" && error !== null)
      return JSON.stringify(error).slice(0, 500);
    return "Ocorreu um erro inesperado";
  })();

  const isRemoteLoadError =
    typeof errorMessage === "string" &&
    (errorMessage.includes("Failed to fetch dynamically imported module") ||
      errorMessage.includes("Can not find remote module") ||
      errorMessage.includes("remoteEntry") ||
      /loading chunk \d+ failed/i.test(errorMessage) ||
      /Loading chunk .* failed/i.test(errorMessage));

  const hint =
    notDeployed
      ? null
      : isRemoteLoadError
        ? "Verifique se o serviço está implantado e se o proxy encaminha o caminho corretamente para o container do MFE."
        : null;

  const errorDetails =
    error instanceof Error
      ? error.stack
      : typeof error === "object" && error !== null
        ? JSON.stringify(error, null, 2)
        : String(error);

  return (
    <div
      className={
        inline
          ? "flex min-h-0 flex-1 flex-col items-center justify-center p-6"
          : "flex min-h-screen items-center justify-center p-6"
      }
    >
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
            {hint && (
              <p className="mt-2 text-xs italic text-muted-foreground">
                {hint}
              </p>
            )}
            {errorMessage && !notDeployed && (
              <p className="mt-2 break-words font-mono text-xs text-muted-foreground">
                {errorMessage}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Button
              variant="default"
              onClick={() => navigate("/dashboard")}
              className="w-full"
            >
              <Home className="mr-2 h-4 w-4" />
              Ir ao Dashboard
            </Button>
            {!notDeployed && (
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="w-full"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Tentar novamente
              </Button>
            )}
          </div>

          {errorDetails && !notDeployed && (
            <details className="mt-4">
              <summary className="cursor-pointer text-xs text-muted-foreground">
                {process.env.NODE_ENV === "development"
                  ? "Detalhes do erro (desenvolvimento)"
                  : "Detalhes do erro (copie para o suporte)"}
              </summary>
              <pre className="mt-2 max-h-40 overflow-auto rounded bg-muted p-2 font-mono text-xs text-muted-foreground">
                {errorDetails}
              </pre>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
