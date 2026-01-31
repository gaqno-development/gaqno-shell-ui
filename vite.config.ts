import { defineConfig } from 'vite'
import federation from '@originjs/vite-plugin-federation'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig(async () => {
  const tailwindcss = (await import('@tailwindcss/vite')).default
  
  const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:3002'
  const CRM_SERVICE_URL = process.env.CRM_SERVICE_URL || 'http://localhost:3003'
  const ERP_SERVICE_URL = process.env.ERP_SERVICE_URL || 'http://localhost:3004'
  const FINANCE_SERVICE_URL = process.env.FINANCE_SERVICE_URL || 'http://localhost:3005'
  const PDV_SERVICE_URL = process.env.PDV_SERVICE_URL || 'http://localhost:3006'
  const RPG_SERVICE_URL = process.env.RPG_SERVICE_URL || 'http://localhost:3007'
  const SSO_SERVICE_URL = process.env.SSO_SERVICE_URL || 'http://localhost:3001'
  const SAAS_SERVICE_URL = process.env.SAAS_SERVICE_URL || 'http://localhost:3008'
  const OMNICHANNEL_SERVICE_URL = process.env.OMNICHANNEL_SERVICE_URL || 'http://localhost:3010'

  return {
    server: {
      port: 3000,
      origin: 'http://localhost:3000',
    },
    base: '/',
    optimizeDeps: {
      esbuildOptions: {
        target: 'esnext',
      },
      exclude: ['jsonwebtoken'],
      include: ['use-sync-external-store'],
    },
    plugins: [
      react(),
      tailwindcss({
        config: path.resolve(__dirname, './tailwind.config.ts'),
      }),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'White Label Admin',
          short_name: 'Admin',
          description: 'White Label Admin Dashboard',
          theme_color: '#3b82f6',
          background_color: '#ffffff',
          display: 'standalone',
          orientation: 'portrait',
          icons: [
            {
              src: '/vite.svg',
              sizes: '192x192',
              type: 'image/svg+xml',
              purpose: 'any',
            },
            {
              src: '/vite.svg',
              sizes: '512x512',
              type: 'image/svg+xml',
              purpose: 'any maskable',
            },
          ],
        },
        workbox: {
          navigateFallback: '/index.html',
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        },
        devOptions: { enabled: true },
      }),
      federation({
        name: 'shell',
        remotes: {
          ai: AI_SERVICE_URL + '/assets/remoteEntry.js',
          crm: CRM_SERVICE_URL + '/assets/remoteEntry.js',
          erp: ERP_SERVICE_URL + '/assets/remoteEntry.js',
          finance: FINANCE_SERVICE_URL + '/assets/remoteEntry.js',
          pdv: PDV_SERVICE_URL + '/assets/remoteEntry.js',
          rpg: RPG_SERVICE_URL + '/assets/remoteEntry.js',
          saas: SAAS_SERVICE_URL + '/assets/remoteEntry.js',
          sso: SSO_SERVICE_URL + '/assets/remoteEntry.js',
          omnichannel: OMNICHANNEL_SERVICE_URL + '/assets/remoteEntry.js',
        },
        shared: {
          react: {
            singleton: true,
            requiredVersion: '^18.0.0',
            eager: true,
          },
          'react-dom': {
            singleton: true,
            requiredVersion: '^18.0.0',
            eager: true,
          },
          'react-router-dom': {
            singleton: true,
            requiredVersion: '^6.0.0',
          },
          '@tanstack/react-query': {
            singleton: true,
            requiredVersion: '^5.0.0',
          },
          zustand: {
            singleton: true,
            requiredVersion: '^4.0.0',
          },
          'use-sync-external-store': {
            singleton: true,
            requiredVersion: '*',
          },
        },
      }),
    ],
    css: {
      devSourcemap: true,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      modulePreload: false,
      target: 'esnext',
      minify: false,
      cssCodeSplit: false,
      rollupOptions: {
        external: ['stream', 'events', 'crypto', 'util', 'buffer', 'process'],
        output: {
          format: 'es',
          assetFileNames: 'assets/[name].[ext]',
        },
      },
      commonjsOptions: {
        transformMixedEsModules: true,
        requireReturnsDefault: 'preferred',
      },
    },
    define: {
      'process.env': {},
      global: 'globalThis',
    },
  }
})

