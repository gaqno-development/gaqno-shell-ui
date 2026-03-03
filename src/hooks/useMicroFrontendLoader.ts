import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { REMOTE_PATHS, ensureFederationRemotesPatched } from "@/lib/patchFederationRemotes";

const LOAD_TIMEOUT_MS = 18000;
const RETRY_DELAY_MS = 2500;
const PREFLIGHT_TIMEOUT_MS = 5000;

interface UseMicroFrontendLoaderArgs {
  remoteName: string;
  moduleName: string;
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Timeout after ${ms}ms`));
    }, ms);
    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

function normalizeErrorMessage(err: unknown, remoteName: string): string {
  const msg = err instanceof Error ? err.message : String(err);
  const lower = msg.toLowerCase();
  if (
    lower.includes("502") ||
    lower.includes("503") ||
    lower.includes("504") ||
    lower.includes("bad gateway") ||
    lower.includes("service unavailable") ||
    lower.includes("gateway timeout")
  ) {
    return `Serviço temporariamente indisponível (erro de rede). O módulo "${remoteName}" não respondeu. Tente novamente.`;
  }
  if (
    lower.includes("failed to fetch") ||
    lower.includes("network") ||
    lower.includes("load failed") ||
    lower.includes("chunk") ||
    lower.includes("dynamically imported")
  ) {
    return `Serviço temporariamente indisponível (erro de rede). O módulo "${remoteName}" não pôde ser carregado. Tente novamente.`;
  }
  if (lower.includes("timeout") || lower.includes("demorou demais")) {
    return `Módulo demorou demais para carregar. O módulo "${remoteName}" não respondeu a tempo. Tente novamente.`;
  }
  return `Não foi possível carregar o módulo "${remoteName}". ${msg}`;
}

export function useMicroFrontendLoader({
  remoteName,
  moduleName,
}: UseMicroFrontendLoaderArgs) {
  const { pathname } = useLocation();
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const importPath = `${remoteName}/./${moduleName}`;

    const runPreflightIfPossible = async (): Promise<boolean> => {
      if (typeof window === "undefined") return true;
      ensureFederationRemotesPatched();
      const federation = (window as unknown as { __FEDERATION__?: Record<string, unknown> })
        .__FEDERATION__;
      const entry = federation?.[remoteName] as Record<string, unknown> | undefined;
      let entryUrl = typeof entry?.entry === "string" ? entry.entry : null;
      const origin = window.location.origin;
      const isProduction = !origin.startsWith("http://localhost") && !origin.startsWith("http://127.0.0.1");
      if (entryUrl && isProduction && entryUrl.includes("localhost")) {
        const path = REMOTE_PATHS[remoteName];
        const fallback = path ? `${origin}${path}/assets/remoteEntry.js` : null;
        if (fallback) {
          entryUrl = fallback;
          if (entry && federation) {
            (federation[remoteName] as { entry: string }).entry = fallback;
          }
        }
      }
      if (!entryUrl || !entryUrl.startsWith("http")) return true;
      try {
        await fetch(entryUrl, {
          method: "HEAD",
          signal: AbortSignal.timeout(PREFLIGHT_TIMEOUT_MS),
        });
        return true;
      } catch {
        return false;
      }
    };

    const tryLoad = async (): Promise<void> => {
      const preflightOk = await runPreflightIfPossible();
      if (!isMounted) return;
      if (!preflightOk) {
        setError(
          `Serviço indisponível. O módulo "${remoteName}" não está respondendo. Tente novamente.`
        );
        return;
      }

      if (
        typeof window !== "undefined" &&
        (window as unknown as { __FEDERATION__?: unknown }).__FEDERATION__
      ) {
        const federation = (window as unknown as { __FEDERATION__?: Record<string, unknown> })
          .__FEDERATION__;
        const instance = (federation as unknown as {
          __INSTANCES__?: Array<{
            loadRemote?: (path: string) => Promise<unknown>;
          }>;
        })?.__INSTANCES__?.[0];

        if (
          instance &&
          typeof (instance as { loadRemote?: (path: string) => Promise<unknown> }).loadRemote ===
            "function"
        ) {
          const loadPromise = (
            instance as { loadRemote: (path: string) => Promise<unknown> }
          ).loadRemote(`${remoteName}/./${moduleName}`);
          const moduleOrFactory = await withTimeout(loadPromise, LOAD_TIMEOUT_MS);
          const container =
            typeof moduleOrFactory === "function"
              ? await (moduleOrFactory as () => Promise<{ default?: React.ComponentType }>)()
              : (moduleOrFactory as { default?: React.ComponentType });
          if (isMounted) {
            const RemoteComponent = container?.default ?? container;
            if (RemoteComponent) {
              setComponent(() => RemoteComponent as React.ComponentType);
              return;
            }
          }
        }
      }

      let container: { default?: React.ComponentType } | null = null;
      try {
        container = await withTimeout(
          import(/* @vite-ignore */ importPath) as Promise<{ default?: React.ComponentType }>,
          LOAD_TIMEOUT_MS
        );
      } catch (err) {
        const altImportPath = `${remoteName}/${moduleName}`;
        try {
          container = await withTimeout(
            import(/* @vite-ignore */ altImportPath) as Promise<{ default?: React.ComponentType }>,
            LOAD_TIMEOUT_MS
          );
        } catch {
          throw err;
        }
      }

      const RemoteComponent = container?.default ?? container;
      if (isMounted && RemoteComponent) {
        setComponent(() => RemoteComponent as React.ComponentType);
      } else if (isMounted) {
        setError(`Componente não encontrado no módulo "${remoteName}".`);
      }
    };

    const loadMicroFrontend = async () => {
      try {
        setError(null);
        setComponent(null);

        console.log(`[Module Federation] Attempting to load: ${importPath}`, {
          remoteName,
          moduleName,
          timestamp: new Date().toISOString(),
        });

        await tryLoad();
      } catch (err) {
        if (!isMounted) return;
        const retryAfter = new Promise<void>((resolve) =>
          setTimeout(resolve, RETRY_DELAY_MS)
        );
        await retryAfter;
        if (!isMounted) return;
        try {
          await tryLoad();
        } catch (retryErr) {
          if (isMounted) {
            setError(normalizeErrorMessage(retryErr, remoteName));
          }
        }
      }
    };

    loadMicroFrontend();

    return () => {
      isMounted = false;
    };
  }, [remoteName, moduleName, pathname]);

  return { Component, error };
}
