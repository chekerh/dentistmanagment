import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { lazy, Suspense } from 'react';

// Lazy load all pages for code splitting
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const PatientsPage = lazy(() => import('./pages/PatientsPage'));
const PatientDetailPage = lazy(() => import('./pages/PatientDetailPage'));
const AppointmentsPage = lazy(() => import('./pages/AppointmentsPage'));
const InventoryPage = lazy(() => import('./pages/InventoryPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const BillingPage = lazy(() => import('./pages/BillingPage'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const PatientPortalPage = lazy(() => import('./pages/PatientPortalPage'));
const AppointmentSessionPage = lazy(() => import('./pages/AppointmentSessionPage'));
const FinancialReportPage = lazy(() => import('./pages/FinancialReportPage'));

// ─── Loading Fallback ────────────────────────────────────────────────────────

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-background-dark flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <p className="text-text-secondary text-sm">Loading…</p>
      </div>
    </div>
  );
}

// ─── Route Guards ────────────────────────────────────────────────────────────

function RequireAuth({ children, role }: { children: JSX.Element; role?: 'admin' | 'patient' }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (!user) return <Navigate to="/login" replace />;

  if (role && user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/dashboard' : '/portal'} replace />;
  }

  return children;
}

// ─── App Shell ───────────────────────────────────────────────────────────────

function AppRoutes() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Admin routes */}
        <Route path="/dashboard" element={<RequireAuth role="admin"><DashboardPage /></RequireAuth>} />
      <Route path="/patients" element={<RequireAuth role="admin"><PatientsPage /></RequireAuth>} />
      <Route path="/patients/:id" element={<RequireAuth role="admin"><PatientDetailPage /></RequireAuth>} />
      <Route path="/appointments" element={<RequireAuth role="admin"><AppointmentsPage /></RequireAuth>} />
      <Route path="/appointments/:id" element={<RequireAuth role="admin"><AppointmentSessionPage /></RequireAuth>} />
      <Route path="/inventory" element={<RequireAuth role="admin"><InventoryPage /></RequireAuth>} />
      <Route path="/reports" element={<RequireAuth role="admin"><ReportsPage /></RequireAuth>} />
      <Route path="/reports/financial" element={<RequireAuth role="admin"><FinancialReportPage /></RequireAuth>} />
      <Route path="/billing" element={<RequireAuth role="admin"><BillingPage /></RequireAuth>} />
      <Route path="/notifications" element={<RequireAuth role="admin"><NotificationsPage /></RequireAuth>} />
      <Route path="/settings" element={<RequireAuth role="admin"><SettingsPage /></RequireAuth>} />

      {/* Patient portal */}
      <Route path="/portal" element={<RequireAuth role="patient"><PatientPortalPage /></RequireAuth>} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    );
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
