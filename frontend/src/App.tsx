import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Menu } from 'lucide-react';

import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import ReportsPage from './pages/ReportsPage';
import BudgetsPage from './pages/BudgetsPage';
import SettingsPage from './pages/SettingsPage';
import CalendarPage from './pages/CalendarPage';
import AuthPage from './pages/AuthPage';
import { useAuth } from './context/AuthContext';

function App() {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-brand-primary border-t-transparent"></div>
          <p className="font-medium text-slate-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1">
        {/* Mobile Header */}
        <header className="flex items-center justify-between bg-white px-6 py-4 shadow-sm lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-50"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary">
              <span className="font-bold">F</span>
            </div>
            <span className="font-semibold text-slate-900">FinansTakip</span>
          </div>
        </header>

        <main className="p-4 lg:p-8">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/budgets" element={<BudgetsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route
              path="*"
              element={
                <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
                  <p className="text-sm font-medium text-slate-500">Sayfa bulunamadı</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">404</h2>
                  <p className="mt-4 text-slate-500">Sol menüden geçerli bir sayfa seçebilirsiniz.</p>
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
