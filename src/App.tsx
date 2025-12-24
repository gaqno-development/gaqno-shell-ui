import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@gaqno-dev/frontcore/components/providers'
import { QueryProvider } from '@gaqno-dev/frontcore/components/providers'
import { AuthProvider } from '@gaqno-dev/frontcore/contexts'
import { ToastContainer } from '@gaqno-dev/frontcore/components/ui'
import { MicroFrontendErrorBoundary } from '@/components/microfrontend-error-boundary'
import { ShellLayoutWrapper } from '@/components/shell-layout-wrapper'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import ManagerDashboardPage from './pages/ManagerDashboardPage'
import UserDashboardPage from './pages/UserDashboardPage'
import SettingsPage from './pages/SettingsPage'
import UnauthorizedPage from './pages/UnauthorizedPage'
import ErrorPage from './pages/ErrorPage'
import DomainsPage from './pages/admin/DomainsPage'
import DomainFormPage from './pages/admin/DomainFormPage'
import DomainEditPage from './pages/admin/DomainEditPage'
import SSLStatusPage from './pages/admin/SSLStatusPage'
import TenantCostsPage from './pages/admin/TenantCostsPage'
import TenantsPage from './pages/admin/TenantsPage'
import BranchesPage from './pages/admin/BranchesPage'
import UsersPage from './pages/admin/UsersPage'
import AdminSettingsPage from './pages/admin/AdminSettingsPage'
import { lazy, Suspense } from 'react'

// @ts-nocheck
const AIPage = lazy(async () => import('ai/App' as string));
const BooksPage = lazy(async () => import('ai/BooksPage' as string));
const BookDetailPage = lazy(async () => import('ai/BookDetailPage' as string));
const BookChaptersPage = lazy(async () => import('ai/BookChaptersPage' as string));
const BookCoverPage = lazy(async () => import('ai/BookCoverPage' as string));
const BookExportPage = lazy(async () => import('ai/BookExportPage' as string));
const CRMPage = lazy(async () => import('crm/App' as string));
const ERPPage = lazy(async () => import('erp/App' as string));
const FinancePage = lazy(async () => import('finance/App' as string));
const PDVPage = lazy(async () => import('pdv/App' as string));
const SSOPage = lazy(async () => import('sso/App' as string));

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center p-6">
      <div className="animate-pulse text-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryProvider>
        <AuthProvider>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <ShellLayoutWrapper>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/dashboard/manager" element={<ManagerDashboardPage />} />
                <Route path="/dashboard/user" element={<UserDashboardPage />} />
                <Route path="/dashboard/settings" element={<SettingsPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
                <Route path="/error" element={<ErrorPage />} />
                <Route 
                  path="/ai/books" 
                  element={
                    <MicroFrontendErrorBoundary>
                      <Suspense fallback={<LoadingFallback />}>
                        <BooksPage />
                      </Suspense>
                    </MicroFrontendErrorBoundary>
                  } 
                />
                <Route 
                  path="/ai/books/:id/chapters" 
                  element={
                    <MicroFrontendErrorBoundary>
                      <Suspense fallback={<LoadingFallback />}>
                        <BookChaptersPage />
                      </Suspense>
                    </MicroFrontendErrorBoundary>
                  } 
                />
                <Route 
                  path="/ai/books/:id/cover" 
                  element={
                    <MicroFrontendErrorBoundary>
                      <Suspense fallback={<LoadingFallback />}>
                        <BookCoverPage />
                      </Suspense>
                    </MicroFrontendErrorBoundary>
                  } 
                />
                <Route 
                  path="/ai/books/:id/export" 
                  element={
                    <MicroFrontendErrorBoundary>
                      <Suspense fallback={<LoadingFallback />}>
                        <BookExportPage />
                      </Suspense>
                    </MicroFrontendErrorBoundary>
                  } 
                />
                <Route 
                  path="/ai/books/:id" 
                  element={
                    <MicroFrontendErrorBoundary>
                      <Suspense fallback={<LoadingFallback />}>
                        <BookDetailPage />
                      </Suspense>
                    </MicroFrontendErrorBoundary>
                  } 
                />
                <Route 
                  path="/ai/*" 
                  element={
                    <MicroFrontendErrorBoundary>
                      <Suspense fallback={<LoadingFallback />}>
                        <AIPage />
                      </Suspense>
                    </MicroFrontendErrorBoundary>
                  } 
                />
                <Route 
                  path="/crm/*" 
                  element={
                    <MicroFrontendErrorBoundary>
                      <Suspense fallback={<LoadingFallback />}>
                        <CRMPage />
                      </Suspense>
                    </MicroFrontendErrorBoundary>
                  } 
                />
                <Route 
                  path="/erp/*" 
                  element={
                    <MicroFrontendErrorBoundary>
                      <Suspense fallback={<LoadingFallback />}>
                        <ERPPage />
                      </Suspense>
                    </MicroFrontendErrorBoundary>
                  } 
                />
                <Route 
                  path="/finance/*" 
                  element={
                    <MicroFrontendErrorBoundary>
                      <Suspense fallback={<LoadingFallback />}>
                        <FinancePage />
                      </Suspense>
                    </MicroFrontendErrorBoundary>
                  } 
                />
                <Route 
                  path="/pdv/*" 
                  element={
                    <MicroFrontendErrorBoundary>
                      <Suspense fallback={<LoadingFallback />}>
                        <PDVPage />
                      </Suspense>
                    </MicroFrontendErrorBoundary>
                  } 
                />
                <Route 
                  path="/sso/*" 
                  element={
                    <MicroFrontendErrorBoundary>
                      <Suspense fallback={<LoadingFallback />}>
                        <SSOPage />
                      </Suspense>
                    </MicroFrontendErrorBoundary>
                  } 
                />
                <Route path="/admin/domains" element={<DomainsPage />} />
                <Route path="/admin/domains/new" element={<DomainFormPage />} />
                <Route path="/admin/domains/:id/edit" element={<DomainEditPage />} />
                <Route path="/admin/domains/ssl" element={<SSLStatusPage />} />
                <Route path="/admin/tenants" element={<TenantsPage />} />
                <Route path="/admin/tenants/costs" element={<TenantCostsPage />} />
                <Route path="/admin/tenants/:tenantId/costs" element={<TenantCostsPage />} />
                <Route path="/admin/branches" element={<BranchesPage />} />
                <Route path="/admin/users" element={<UsersPage />} />
                <Route path="/admin/settings" element={<AdminSettingsPage />} />
              </Routes>
            </ShellLayoutWrapper>
            <ToastContainer />
          </BrowserRouter>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  )
}

