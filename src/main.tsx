import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/index.css";
import "./styles/sidebar-theme.css";

const isDev = import.meta.env.DEV;

function getErrorMessage(payload: unknown, isRejection: boolean): string {
  if (payload instanceof Error) return payload.stack ?? payload.message;
  if (typeof payload === "string") return payload;
  try {
    return JSON.stringify(payload);
  } catch {
    return String(payload);
  }
}

function showGlobalErrorFallback(message: string, isRejection: boolean): void {
  const root = document.getElementById("root");
  if (!root) return;

  const existing = document.getElementById("gaqno-global-error");
  if (existing) return;

  const overlay = document.createElement("div");
  overlay.id = "gaqno-global-error";
  overlay.setAttribute("role", "alert");
  overlay.style.cssText =
    "position:fixed;inset:0;z-index:999999;display:flex;align-items:center;justify-content:center;background:var(--background, #0a0a0a);color:var(--foreground, #fafafa);font-family:system-ui,sans-serif;padding:1.5rem;box-sizing:border-box;";

  const content = document.createElement("div");
  content.style.cssText =
    "max-width:420px;text-align:center;display:flex;flex-direction:column;gap:1.25rem;align-items:center;";

  const heading = document.createElement("h1");
  heading.style.cssText = "font-size:1.25rem;font-weight:600;margin:0;";
  heading.textContent = "Algo deu errado";

  const paragraph = document.createElement("p");
  paragraph.style.cssText =
    "font-size:0.875rem;color:var(--muted-foreground, #a1a1aa);margin:0;line-height:1.5;";
  paragraph.textContent = isDev
    ? "Erro capturado (ambiente de desenvolvimento):"
    : "Por favor, recarregue a página. Se o problema continuar, tente sair e entrar novamente.";

  const pre = document.createElement("pre");
  pre.style.cssText =
    "text-align:left;font-size:0.75rem;overflow:auto;max-height:40vh;padding:1rem;background:rgba(255,255,255,0.05);border-radius:0.5rem;margin:0;white-space:pre-wrap;word-break:break-word;";
  pre.textContent = isDev ? message : "";

  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "Recarregar página";
  button.style.cssText =
    "padding:0.5rem 1rem;font-size:0.875rem;cursor:pointer;background:var(--primary, #3b82f6);color:white;border:none;border-radius:0.375rem;";
  button.onclick = () => window.location.reload();

  content.appendChild(heading);
  content.appendChild(paragraph);
  if (isDev && message) content.appendChild(pre);
  content.appendChild(button);
  overlay.appendChild(content);
  document.body.appendChild(overlay);
}

window.addEventListener("error", (event) => {
  const message = getErrorMessage(event.error ?? event.message, false);
  console.error("[Shell] Uncaught error:", event.error ?? event.message);
  showGlobalErrorFallback(message, false);
});

window.addEventListener("unhandledrejection", (event) => {
  const message = getErrorMessage(event.reason, true);
  console.error("[Shell] Unhandled promise rejection:", event.reason);
  showGlobalErrorFallback(message, true);
  event.preventDefault();
  event.stopPropagation();
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
