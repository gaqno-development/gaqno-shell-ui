const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Enable standalone output for Docker
  transpilePackages: ["@gaqno-dev/ui", "@gaqno-dev/frontcore", "@gaqno-dev/core"],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-hook-form': path.resolve(__dirname, 'node_modules/react-hook-form'),
      '@hookform/resolvers': path.resolve(__dirname, 'node_modules/@hookform/resolvers'),
      '@tanstack/react-query': path.resolve(__dirname, 'node_modules/@tanstack/react-query'),
      'zod': path.resolve(__dirname, 'node_modules/zod'),
      '@supabase/ssr': path.resolve(__dirname, 'node_modules/@supabase/ssr'),
      '@supabase/supabase-js': path.resolve(__dirname, 'node_modules/@supabase/supabase-js'),
    };
    return config;
  },
  async rewrites() {
    const AUTH_URL = process.env.AUTH_SERVICE_URL;
    const ADMIN_URL = process.env.ADMIN_SERVICE_URL;
    const AI_URL = process.env.AI_SERVICE_URL;
    const CRM_URL = process.env.CRM_SERVICE_URL;
    const ERP_URL = process.env.ERP_SERVICE_URL;
    const FINANCE_URL = process.env.FINANCE_SERVICE_URL;
    const PDV_URL = process.env.PDV_SERVICE_URL;

    return [
      // App Asset Rewrites
      {
        source: "/auth/_next/:path*",
        destination: `${AUTH_URL}/_next/:path*`,
      },
      {
        source: "/admin/_next/:path*",
        destination: `${ADMIN_URL}/_next/:path*`,
      },
      {
        source: "/books/_next/:path*",
        destination: `${AI_URL}/_next/:path*`,
      },
      {
        source: "/crm/_next/:path*",
        destination: `${CRM_URL}/_next/:path*`,
      },
      {
        source: "/erp/_next/:path*",
        destination: `${ERP_URL}/_next/:path*`,
      },
      {
        source: "/finance/_next/:path*",
        destination: `${FINANCE_URL}/_next/:path*`,
      },
      {
        source: "/pdv/_next/:path*",
        destination: `${PDV_URL}/_next/:path*`,
      },
      // Page Rewrites (Order matters!)
      {
        source: "/admin",
        destination: `${ADMIN_URL}/admin`,
      },
      {
        source: "/admin/:path*",
        destination: `${ADMIN_URL}/admin/:path*`,
      },
      {
        source: "/dashboard/admin/:path*",
        destination: `${ADMIN_URL}/dashboard/admin/:path*`,
      },
      {
        source: "/dashboard/books/:path*",
        destination: `${AI_URL}/dashboard/books/:path*`,
      },
      {
        source: "/dashboard/crm/:path*",
        destination: `${CRM_URL}/dashboard/crm/:path*`,
      },
      {
        source: "/dashboard/erp/:path*",
        destination: `${ERP_URL}/dashboard/erp/:path*`,
      },
      {
        source: "/dashboard/finance/:path*",
        destination: `${FINANCE_URL}/dashboard/finance/:path*`,
      },
      {
        source: "/pdv/:path*",
        destination: `${PDV_URL}/pdv/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
