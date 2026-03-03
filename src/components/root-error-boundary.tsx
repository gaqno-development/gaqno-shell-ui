import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@gaqno-development/frontcore/components/ui";
import { Button } from "@gaqno-development/frontcore/components/ui";
import { AlertCircle, Home, RefreshCw } from "lucide-react";

interface RootErrorBoundaryProps {
  children: React.ReactNode;
  inline?: boolean;
}

interface RootErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class RootErrorBoundary extends React.Component<
  RootErrorBoundaryProps,
  RootErrorBoundaryState
> {
  constructor(props: RootErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): RootErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("[RootErrorBoundary]", error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError && this.state.error) {
      return (
        <RootErrorFallback
          error={this.state.error}
          onRetry={() => this.setState({ hasError: false, error: null })}
          inline={this.props.inline}
        />
      );
    }
    return this.props.children;
  }
}

function RootErrorFallback({
  error,
  onRetry,
  inline = false,
}: {
  error: Error;
  onRetry: () => void;
  inline?: boolean;
}) {
  const navigate = useNavigate();
  const message = error?.message ?? "Erro inesperado";
  const stack = error?.stack ?? "";

  return (
    <div
      className={
        inline
          ? "flex min-h-0 flex-1 flex-col items-center justify-center p-6 bg-background"
          : "flex min-h-screen items-center justify-center p-6 bg-background"
      }
    >
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Erro ao carregar o portal</CardTitle>
          <CardDescription>
            Algo falhou ao renderizar a página. Use os botões abaixo para voltar
            ou recarregar.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md bg-muted p-4 text-sm">
            <p className="font-medium mb-2">Mensagem:</p>
            <p className="text-muted-foreground font-mono break-words">
              {message}
            </p>
          </div>
          {stack && (
            <details className="rounded-md bg-muted p-3 text-xs">
              <summary className="cursor-pointer text-muted-foreground">
                Detalhes técnicos (stack)
              </summary>
              <pre className="mt-2 font-mono text-muted-foreground overflow-auto max-h-48 whitespace-pre-wrap break-words">
                {stack}
              </pre>
            </details>
          )}
          <div className="flex flex-col gap-2">
            <Button
              variant="default"
              onClick={() => {
                onRetry();
                navigate("/dashboard");
              }}
              className="w-full"
            >
              <Home className="mr-2 h-4 w-4" />
              Ir para o Dashboard
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="w-full"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Recarregar página
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
