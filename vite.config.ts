import { defineConfig } from 'vite'
import federation from '@originjs/vite-plugin-federation'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig(async () => {
  const tailwindcss = (await import('@tailwindcss/vite')).default
  
  const MFE_AI_URL = process.env.MFE_AI_URL || 'http://localhost:3002'
  const MFE_CRM_URL = process.env.MFE_CRM_URL || 'http://localhost:3003'
  const MFE_ERP_URL = process.env.MFE_ERP_URL || 'http://localhost:3004'
  const MFE_FINANCE_URL = process.env.MFE_FINANCE_URL || 'http://localhost:3005'
  const MFE_PDV_URL = process.env.MFE_PDV_URL || 'http://localhost:3006'
  const MFE_RPG_URL = process.env.MFE_RPG_URL || 'http://localhost:3007'
  const MFE_SSO_URL = process.env.MFE_SSO_URL || 'http://localhost:3001'
  const MFE_SAAS_URL = process.env.MFE_SAAS_URL || 'http://localhost:3008'
  const MFE_OMNICHANNEL_URL = process.env.MFE_OMNICHANNEL_URL || 'http://localhost:3008'

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
          ai: MFE_AI_URL + '/assets/remoteEntry.js',
          crm: MFE_CRM_URL + '/assets/remoteEntry.js',
          erp: MFE_ERP_URL + '/assets/remoteEntry.js',
          finance: MFE_FINANCE_URL + '/assets/remoteEntry.js',
          pdv: MFE_PDV_URL + '/assets/remoteEntry.js',
          rpg: MFE_RPG_URL + '/assets/remoteEntry.js',
          saas: MFE_SAAS_URL + '/assets/remoteEntry.js',
          sso: MFE_SSO_URL + '/assets/remoteEntry.js',
          omnichannel: MFE_OMNICHANNEL_URL + '/assets/remoteEntry.js',
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

