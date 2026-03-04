import { useState } from 'react';
import Layout from '../components/Layout';
import Topbar from '../components/Topbar';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';

export default function SettingsPage() {
  const { t } = useLang();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'clinic' | 'security' | 'notifications'>('profile');
  const [profile, setProfile] = useState({
    name: user?.name ?? 'Dr. Smith',
    email: user?.email ?? 'dr.smith@dentalcare.com',
    phone: '+1 (555) 100-2000',
    specialty: 'General Dentistry',
    licenseNo: 'DDS-IL-12345',
  });
  const [clinic, setClinic] = useState({
    name: 'DentalCare Clinic',
    address: '100 Dental Way, Springfield, IL 62701',
    phone: '+1 (555) 200-3000',
    email: 'clinic@dentalcare.com',
    website: 'www.dentalcare.com',
    openTime: '08:00',
    closeTime: '17:00',
  });
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const tabs = [
    { key: 'profile', label: 'Profile', icon: 'person' },
    { key: 'clinic', label: 'Clinic', icon: 'local_hospital' },
    { key: 'security', label: 'Security', icon: 'lock' },
    { key: 'notifications', label: 'Notifications', icon: 'notifications' },
  ] as const;

  return (
    <Layout>
      <Topbar title="Settings" />

      <div className="p-6 max-w-4xl mx-auto flex flex-col gap-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
              <span className="hidden sm:block">{tab.label}</span>
            </button>
          ))}
        </div>

        {saved && (
          <div className="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-xl px-4 py-3">
            <span className="material-symbols-outlined text-green-600 text-[20px]">check_circle</span>
            <p className="text-sm font-medium text-green-700 dark:text-green-300">{t.settings.savedSuccess}</p>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col gap-6">
            <div className="flex items-center gap-5">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold">
                {profile.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{profile.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{profile.specialty}</p>
                <button type="button" className="mt-2 text-xs text-primary hover:text-primary-hover font-medium">
                  {t.settings.changePhoto}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Full Name', key: 'name' },
                { label: 'Email', key: 'email', type: 'email' },
                { label: 'Phone', key: 'phone' },
                { label: 'Specialty', key: 'specialty' },
                { label: 'License Number', key: 'licenseNo' },
              ].map(({ label, key, type = 'text' }) => (
                <label key={key} className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
                  <input
                    type={type}
                    value={(profile as any)[key]}
                    onChange={(e) => setProfile(p => ({ ...p, [key]: e.target.value }))}
                    className="h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </label>
              ))}
            </div>
            <button type="submit" className="self-start px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors">
              {t.settings.saveChanges}
            </button>
          </form>
        )}

        {/* Clinic Tab */}
        {activeTab === 'clinic' && (
          <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col gap-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t.settings.clinicInfo}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Clinic Name', key: 'name' },
                { label: 'Phone', key: 'phone' },
                { label: 'Email', key: 'email', type: 'email' },
                { label: 'Website', key: 'website' },
                { label: 'Opening Time', key: 'openTime', type: 'time' },
                { label: 'Closing Time', key: 'closeTime', type: 'time' },
              ].map(({ label, key, type = 'text' }) => (
                <label key={key} className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
                  <input
                    type={type}
                    value={(clinic as any)[key]}
                    onChange={(e) => setClinic(p => ({ ...p, [key]: e.target.value }))}
                    className="h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </label>
              ))}
            </div>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Address</span>
              <input
                type="text"
                value={clinic.address}
                onChange={(e) => setClinic(p => ({ ...p, address: e.target.value }))}
                className="h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </label>
            <button type="submit" className="self-start px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors">
              {t.settings.saveClinic}
            </button>
          </form>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col gap-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t.settings.securityTitle}</h3>
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              {[
                { label: 'Current Password', key: 'current' },
                { label: 'New Password', key: 'new' },
                { label: 'Confirm New Password', key: 'confirm' },
              ].map(({ label, key }) => (
                <label key={key} className="flex flex-col gap-1.5 max-w-sm">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </label>
              ))}
              <button type="submit" className="self-start px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors">
                {t.settings.updatePassword}
              </button>
            </form>
            <div className="border-t border-slate-200 dark:border-slate-800 pt-5">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">{t.settings.twoFactor}</h4>
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{t.settings.authenticatorApp}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t.settings.notConfigured}</p>
                </div>
                <button className="text-sm text-primary font-medium hover:text-primary-hover">{t.settings.setUp}</button>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col gap-5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t.settings.notifPrefs}</h3>
            {[
              { label: t.settings.emailNotifs, desc: t.settings.emailNotifsDesc, checked: true },
              { label: t.settings.apptReminders, desc: t.settings.apptRemindersDesc, checked: true },
              { label: t.settings.lowStockAlerts, desc: t.settings.lowStockDesc, checked: true },
              { label: t.settings.paymentReminders, desc: t.settings.paymentRemindersDesc, checked: false },
              { label: t.settings.sysAnnouncements, desc: t.settings.sysAnnouncementsDesc, checked: true },
            ].map((setting) => (
              <div key={setting.label} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{setting.label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{setting.desc}</p>
                </div>
                <button
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ml-4 ${setting.checked ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
                >
                  <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${setting.checked ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
