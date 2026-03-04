import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();

  const navGroups = [
    {
      key: 'main',
      label: null,
      items: [
        { icon: 'dashboard', label: t.nav.dashboard, to: '/dashboard' },
      ],
    },
    {
      key: 'management',
      label: t.groups.management,
      items: [
        { icon: 'group', label: t.nav.patients, to: '/patients' },
        { icon: 'calendar_month', label: t.nav.appointments, to: '/appointments' },
        { icon: 'inventory_2', label: t.nav.inventory, to: '/inventory' },
      ],
    },
    {
      key: 'finance',
      label: t.groups.finance,
      items: [
        { icon: 'bar_chart', label: t.nav.reports, to: '/reports' },
        { icon: 'receipt_long', label: t.nav.billing, to: '/billing' },
      ],
    },
    {
      key: 'system',
      label: t.groups.system,
      items: [
        { icon: 'notifications', label: t.nav.notifications, to: '/notifications' },
        { icon: 'settings', label: t.nav.settings, to: '/settings' },
      ],
    },
  ];

  return (
    <aside className="hidden md:flex w-64 flex-col border-e border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-screen sticky top-0 flex-shrink-0">
      <div className="flex h-full flex-col justify-between py-4 px-3">

        <div className="flex flex-col gap-5">
          {/* Brand */}
          <div className="flex items-center gap-3 px-2 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary flex-shrink-0">
              <span className="material-symbols-outlined text-2xl">dentistry</span>
            </div>
            <div className="flex flex-col min-w-0">
              <h1 className="text-slate-900 dark:text-white text-base font-bold leading-tight truncate">{t.brand}</h1>
              <p className="text-slate-400 dark:text-slate-500 text-xs truncate">{t.brandSub}</p>
            </div>
          </div>

          {/* Grouped navigation */}
          <nav className="flex flex-col gap-5">
            {navGroups.map((group) => (
              <div key={group.key}>
                {group.label && (
                  <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-600 select-none">
                    {group.label}
                  </p>
                )}
                <div className="flex flex-col gap-0.5">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all overflow-hidden ${
                          isActive
                            ? 'bg-primary/10 dark:bg-primary/15 text-primary font-semibold'
                            : 'font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <span className="absolute start-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-e-full bg-primary" />
                          )}
                          <span className="material-symbols-outlined text-[20px] flex-shrink-0">
                            {item.icon}
                          </span>
                          <span className="truncate">{item.label}</span>
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* User footer */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group">
            <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
              {user?.name?.charAt(0) ?? 'D'}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user?.name}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {user?.role === 'admin' ? t.role.admin : t.role.patient}
              </p>
            </div>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
              title={t.actions.logout}
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </div>
        </div>

      </div>
    </aside>
  );
}
