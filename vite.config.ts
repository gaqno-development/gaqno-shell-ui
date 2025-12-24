import { defineConfig } from 'vite'
import federation from '@originjs/vite-plugin-federation'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(async () => {
  const tailwindcss = (await import('@tailwindcss/vite')).default
  
  const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:3002'
  const CRM_SERVICE_URL = process.env.CRM_SERVICE_URL || 'http://localhost:3003'
  const ERP_SERVICE_URL = process.env.ERP_SERVICE_URL || 'http://localhost:3004'
  const FINANCE_SERVICE_URL = process.env.FINANCE_SERVICE_URL || 'http://localhost:3005'
  const PDV_SERVICE_URL = process.env.PDV_SERVICE_URL || 'http://localhost:3006'
  const SSO_SERVICE_URL = process.env.SSO_SERVICE_URL || 'http://localhost:3001'

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
    },
    plugins: [
      react(),
      tailwindcss({
        config: path.resolve(__dirname, './tailwind.config.ts'),
      }),
      federation({
        name: 'shell',
        remotes: {
          ai: AI_SERVICE_URL + '/assets/remoteEntry.js',
          crm: CRM_SERVICE_URL + '/assets/remoteEntry.js',
          erp: ERP_SERVICE_URL + '/assets/remoteEntry.js',
          finance: FINANCE_SERVICE_URL + '/assets/remoteEntry.js',
          pdv: PDV_SERVICE_URL + '/assets/remoteEntry.js',
          sso: SSO_SERVICE_URL + '/assets/remoteEntry.js',
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
        output: {
          assetFileNames: 'assets/[name].[ext]',
        },
      },
    },
  }
})

