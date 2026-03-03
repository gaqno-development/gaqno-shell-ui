/**
 * When the shell is built without VITE_APP_ORIGIN, remotes point to localhost
 * and fail when the app runs on portal.gaqno.com.br. This patches
 * window.__FEDERATION__ so remote entry URLs use the current origin.
 */
export const REMOTE_PATHS: Record<string, string> = {
  ai: "/ai",
  crm: "/crm",
  erp: "/erp",
  finance: "/finance",
  pdv: "/pdv",
  rpg: "/rpg",
  saas: "/saas",
  sso: "/sso",
  omnichannel: "/omnichannel",
  wellness: "/wellness",
  admin: "/admin",
};

function patchFederationRemotes(): void {
  if (typeof window === "undefined") return;
  const origin = window.location.origin;
  if (origin.startsWith("http://localhost") || origin.startsWith("http://127.0.0.1")) {
    return;
  }
  const fed = (window as unknown as { __FEDERATION__?: Record<string, { entry?: string }> }).__FEDERATION__;
  if (!fed) return;
  for (const [name, path] of Object.entries(REMOTE_PATHS)) {
    const entry = fed[name];
    if (entry && typeof entry.entry === "string" && entry.entry.includes("localhost")) {
      (fed[name] as { entry: string }).entry = `${origin}${path}/assets/remoteEntry.js`;
    }
  }
}

export function ensureFederationRemotesPatched(): void {
  patchFederationRemotes();
  setTimeout(patchFederationRemotes, 0);
  if (typeof window !== "undefined") {
    window.addEventListener("load", patchFederationRemotes);
  }
}
