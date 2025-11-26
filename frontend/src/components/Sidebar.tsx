import { Home, Layers, TrendingUp, ListChecks, Settings, LogOut, CalendarDays, X, CreditCard } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { useAuth } from '../context/AuthContext';

const menuItems = [
  { label: 'Dashboard', icon: Home, path: '/dashboard' },
  { label: 'Takvim', icon: CalendarDays, path: '/calendar' },
  { label: 'İşlemler', icon: ListChecks, path: '/transactions' },
  { label: 'Raporlar', icon: TrendingUp, path: '/reports' },
  { label: 'Bütçeler', icon: Layers, path: '/budgets' },
  { label: 'Ayarlar', icon: Settings, path: '/settings' },
];

interface Props {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ isOpen, onClose }: Props) => {
  const { logout, user } = useAuth();
  const initials = user?.email?.slice(0, 2).toUpperCase() || 'AY';
  const displayName = user?.email?.split('@')[0] || 'Kullanıcı';

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={clsx(
          'fixed inset-0 z-40 bg-slate-900/50 transition-opacity lg:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-100 bg-white px-6 py-8 shadow-xl transition-transform lg:static lg:translate-x-0 lg:shadow-sm',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="mb-10 flex items-center justify-between lg:justify-start lg:gap-2">
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 lg:hidden"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
              <span className="font-bold">F</span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">FinansTakip</p>
              <p className="text-lg font-semibold text-slate-900">Kişisel Bütçe</p>
            </div>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition',
                    isActive
                      ? 'bg-brand-primary text-white shadow'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900',
                  )
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-8 rounded-2xl bg-slate-50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary/15 text-lg font-semibold text-brand-primary">
              {initials}
            </div>
            <div className="overflow-hidden">
              <p className="truncate font-semibold text-slate-900">{displayName}</p>
              <p className="truncate text-sm text-slate-500">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300"
          >
            <LogOut size={16} /> Çıkış Yap
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
