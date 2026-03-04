import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import type { Language } from '../i18n/translations';

interface TopbarProps {
  title?: string; // optional override; auto-derived from route by default
  action?: React.ReactNode;
}

const LANGS: { code: Language; flag: string; name: string }[] = [
  { code: 'en', flag: '🇬🇧', name: 'English' },
  { code: 'fr', flag: '🇫🇷', name: 'Français' },
  { code: 'ar', flag: '🇸🇦', name: 'العربية' },
];

export default function Topbar({ title, action }: TopbarProps) {
  const { user, logout } = useAuth();
  const { t, lang, setLang } = useLang();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  // Auto-derive title from current route
  const routeMap: Record<string, string> = {
    '/dashboard':         t.pages.dashboard,
    '/patients':          t.pages.patients,
    '/appointments':      t.pages.appointments,
    '/inventory':         t.pages.inventory,
    '/reports':           t.pages.reports,
    '/reports/financial': t.pages.financialReport,
    '/billing':           t.pages.billing,
    '/notifications':     t.pages.notifications,
    '/settings':          t.pages.settings,
  };
  const path = location.pathname;
  const autoTitle =
    routeMap[path] ??
    (path.startsWith('/patients/')     ? t.pages.patientDetail      : null) ??
    (path.startsWith('/appointments/') ? t.pages.appointmentSession : null) ??
    title ?? '';

  const mobileNavItems = [
    { icon: 'dashboard',      label: t.nav.dashboard,     to: '/dashboard' },
    { icon: 'group',          label: t.nav.patients,      to: '/patients' },
    { icon: 'calendar_month', label: t.nav.appointments,  to: '/appointments' },
    { icon: 'inventory_2',    label: t.nav.inventory,     to: '/inventory' },
    { icon: 'bar_chart',      label: t.nav.reports,       to: '/reports' },
    { icon: 'receipt_long',   label: t.nav.billing,       to: '/billing' },
    { icon: 'notifications',  label: t.nav.notifications, to: '/notifications' },
    { icon: 'settings',       label: t.nav.settings,      to: '/settings' },
  ];

  return (
    <>
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 md:px-6 gap-4">
        {/* Left: hamburger + page title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 flex-shrink-0"
            onClick={() => setMenuOpen(true)}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white truncate">{autoTitle}</h2>
        </div>

        {/* Right: actions + lang switcher + bell + avatar */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {action}

          {/* ── Language switcher ── */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 h-9 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors uppercase tracking-wide"
            >
              <span className="material-symbols-outlined text-[16px]">language</span>
              {lang}
              <span className="material-symbols-outlined text-[14px] text-slate-400">
                {langOpen ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {langOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setLangOpen(false)} />
                <div className="absolute end-0 top-11 z-20 min-w-[148px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden">
                  {LANGS.map((opt) => (
                    <button
                      key={opt.code}
                      onClick={() => { setLang(opt.code); setLangOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors text-start ${
                        lang === opt.code
                          ? 'bg-primary/10 text-primary'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="text-base leading-none">{opt.flag}</span>
                      <span>{opt.name}</span>
                      {lang === opt.code && (
                        <span className="material-symbols-outlined text-[14px] ms-auto">check</span>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Notifications bell */}
          <NavLink
            to="/notifications"
            className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute end-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
          </NavLink>

          {/* Avatar */}
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
            {user?.name?.charAt(0) ?? 'D'}
          </div>
        </div>
      </header>

      {/* ── Mobile nav drawer ── */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMenuOpen(false)} />
          <div className="absolute start-0 top-0 bottom-0 w-72 bg-white dark:bg-slate-900 flex flex-col overflow-y-auto">
            {/* Drawer header */}
            <div className="flex items-center gap-3 p-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary flex-shrink-0">
                <span className="material-symbols-outlined text-2xl">dentistry</span>
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <h1 className="text-slate-900 dark:text-white text-base font-bold truncate">{t.brand}</h1>
                <p className="text-slate-400 text-xs">{t.brandSub}</p>
              </div>
              <button
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex-shrink-0"
                onClick={() => setMenuOpen(false)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 p-3 flex flex-col gap-1">
              {mobileNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                    }`
                  }
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* Drawer footer */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
              {/* Language switcher (mobile) */}
              <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                {LANGS.map((opt) => (
                  <button
                    key={opt.code}
                    onClick={() => setLang(opt.code)}
                    className={`flex-1 py-1.5 rounded-md text-xs font-bold uppercase transition-colors ${
                      lang === opt.code
                        ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    {opt.flag} {opt.code.toUpperCase()}
                  </button>
                ))}
              </div>
              <button
                onClick={() => { logout(); navigate('/login'); setMenuOpen(false); }}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
                {t.actions.logout}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
