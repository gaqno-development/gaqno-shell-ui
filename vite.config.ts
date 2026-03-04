import { defineConfig } from "vite";
import federation from "@originjs/vite-plugin-federation";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig(async () => {
  const tailwindcss = (await import("@tailwindcss/vite")).default;

  const ensureUrl = (u: unknown, fallback: string) =>
    typeof u === "string" && u.length > 0 ? u : fallback;
  const origin =
    typeof process.env.VITE_APP_ORIGIN === "string" &&
    process.env.VITE_APP_ORIGIN.length > 0
      ? process.env.VITE_APP_ORIGIN.replace(/\/$/, "")
      : "";
  const MFE_AI_URL = origin ? `${origin}/ai` : ensureUrl(process.env.MFE_AI_URL, "http://localhost:3002");
  const MFE_CRM_URL = origin ? `${origin}/crm` : ensureUrl(process.env.MFE_CRM_URL, "http://localhost:3003");
  const MFE_ERP_URL = origin ? `${origin}/erp` : ensureUrl(process.env.MFE_ERP_URL, "http://localhost:3004/erp");
  const MFE_FINANCE_URL = origin ? `${origin}/finance` : ensureUrl(process.env.MFE_FINANCE_URL, "http://localhost:3005");
  const MFE_PDV_URL = origin ? `${origin}/pdv` : ensureUrl(process.env.MFE_PDV_URL, "http://localhost:3006");
  const MFE_RPG_URL = origin ? `${origin}/rpg` : ensureUrl(process.env.MFE_RPG_URL, "http://localhost:3007");
  const MFE_SSO_URL = origin ? `${origin}/sso` : ensureUrl(process.env.MFE_SSO_URL, "http://localhost:3001");
  const MFE_SAAS_URL = origin ? `${origin}/saas` : ensureUrl(process.env.MFE_SAAS_URL, "http://localhost:3008/saas");
  const MFE_OMNICHANNEL_URL = origin ? `${origin}/omnichannel` : ensureUrl(process.env.MFE_OMNICHANNEL_URL, "http://localhost:3011/omnichannel");
  const MFE_WELLNESS_URL = origin ? `${origin}/wellness` : ensureUrl(process.env.MFE_WELLNESS_URL, "http://localhost:3012/wellness");
  const MFE_ADMIN_URL = origin ? `${origin}/admin` : ensureUrl(process.env.MFE_ADMIN_URL, "http://localhost:3010/admin");
  const MFE_INTELLIGENCE_URL = origin ? `${origin}/intelligence` : ensureUrl(process.env.MFE_INTELLIGENCE_URL, "http://localhost:3013/intelligence");
  const MFE_CONSUMER_URL = origin ? `${origin}/consumer` : ensureUrl(process.env.MFE_CONSUMER_URL, "http://localhost:3015/consumer");

  return {
    server: {
      port: 3000,
      origin: "http://localhost:3000",
    },
    base: "/",
    optimizeDeps: {
      esbuildOptions: {
        target: "esnext",
      },
      exclude: ["jsonwebtoken"],
      include: ["use-sync-external-store"],
    },
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: "autoUpdate",
        manifest: {
          name: "White Label Admin",
          short_name: "Admin",
          description: "White Label Admin Dashboard",
          theme_color: "#3b82f6",
          background_color: "#ffffff",
          display: "standalone",
          orientation: "portrait",
          icons: [
            {
              src: "/icon.svg",
              sizes: "192x192",
              type: "image/svg+xml",
              purpose: "any",
            },
            {
              src: "/icon.svg",
              sizes: "512x512",
              type: "image/svg+xml",
              purpose: "any maskable",
            },
          ],
        },
        workbox: {
          navigateFallback: "/index.html",
          globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
          maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        },
        devOptions: { enabled: true },
      }),
      federation({
        name: "shell",
        remotes: {
          ai: MFE_AI_URL + "/assets/remoteEntry.js",
          crm: MFE_CRM_URL + "/assets/remoteEntry.js",
          erp: MFE_ERP_URL + "/assets/remoteEntry.js",
          finance: MFE_FINANCE_URL + "/assets/remoteEntry.js",
          pdv: MFE_PDV_URL + "/assets/remoteEntry.js",
          rpg: MFE_RPG_URL + "/assets/remoteEntry.js",
          saas: MFE_SAAS_URL + "/assets/remoteEntry.js",
          sso: MFE_SSO_URL + "/assets/remoteEntry.js",
          omnichannel: MFE_OMNICHANNEL_URL + "/assets/remoteEntry.js",
          wellness: MFE_WELLNESS_URL + "/assets/remoteEntry.js",
          admin: MFE_ADMIN_URL + "/assets/remoteEntry.js",
          intelligence: MFE_INTELLIGENCE_URL + "/assets/remoteEntry.js",
          consumer: MFE_CONSUMER_URL + "/assets/remoteEntry.js",
        },
        shared: {
          react: {
            singleton: true,
            requiredVersion: "^18.0.0",
            eager: true,
          },
          "react-dom": {
            singleton: true,
            requiredVersion: "^18.0.0",
            eager: true,
          },
          "react-router-dom": {
            singleton: true,
            requiredVersion: "^6.0.0",
          },
          "@tanstack/react-query": {
            singleton: true,
            requiredVersion: "^5.0.0",
          },
          zustand: {
            singleton: true,
            requiredVersion: "^4.0.0",
          },
          "use-sync-external-store": {
            singleton: true,
            requiredVersion: "*",
          },
          "socket.io-client": {
            singleton: true,
            requiredVersion: "^4.0.0",
          },
          "@gaqno-development/frontcore": {
            singleton: true,
            requiredVersion: "^1.5.0",
          },
        },
      }),
    ],
    css: {
      devSourcemap: true,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      modulePreload: false,
      target: "esnext",
      minify: false,
      cssCodeSplit: false,
      rollupOptions: {
        external: ["stream", "events", "crypto", "util", "buffer", "process"],
        output: {
          format: "es",
        },
      },
      commonjsOptions: {
        transformMixedEsModules: true,
        requireReturnsDefault: "preferred",
      },
    },
    define: {
      "process.env": {},
      global: "globalThis",
    },
  };
});
