import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Badge, { getStatusBadge } from '../components/Badge';
import { mockAppointments, mockTreatments, mockPayments, mockPatients } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';

const patientId = 'P001'; // Patient portal shows data for Sarah Johnson


export default function PatientPortalPage() {
  const { t } = useLang();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'appointments' | 'records' | 'payments'>('dashboard');
  const [showBookModal, setShowBookModal] = useState(false);

  const patient = mockPatients.find(p => p.id === patientId)!;
  const appts = mockAppointments.filter(a => a.patientId === patientId);
  const treatments = mockTreatments.filter(t => t.patientId === patientId);
  const payments = mockPayments.filter(p => p.patientId === patientId);

  const upcomingAppts = appts.filter(a => a.date >= '2026-03-01' && a.status !== 'cancelled');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-10 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">dentistry</span>
            </div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">{t.portal.headerTitle}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowBookModal(true)}
              className="hidden sm:flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Book Appointment
            </button>
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
              {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
            </div>
            <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 md:px-10 py-8 flex flex-col gap-8">
        {/* Welcome */}
        <div className="flex items-center gap-5 bg-gradient-to-r from-primary to-blue-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
          </div>
          <div>
            <p className="text-white/80 text-sm">{t.portal.welcomeBack}</p>
            <h2 className="text-2xl font-bold">{patient.firstName} {patient.lastName}</h2>
            <p className="text-white/70 text-sm mt-1">{t.portal.patientIdLabel} {patient.id}</p>
          </div>
          <div className="ml-auto hidden sm:flex flex-col items-end gap-1">
            <p className="text-white/80 text-xs">{t.portal.nextAppointmentLabel}</p>
            <p className="text-white font-semibold">{patient.nextAppointment ?? t.portal.noneScheduled}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
          {[
            { key: 'dashboard', label: 'Overview', icon: 'dashboard' },
            { key: 'appointments', label: 'Appointments', icon: 'calendar_month' },
            { key: 'records', label: 'My Records', icon: 'description' },
            { key: 'payments', label: 'Payments', icon: 'receipt' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
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

        {/* Overview Tab */}
        {activeTab === 'dashboard' && (
          <div className="flex flex-col gap-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: t.portal.statVisits, value: appts.filter(a => a.status === 'completed').length, icon: 'check_circle', color: 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400' },
                { label: 'Upcoming', value: upcomingAppts.length, icon: 'calendar_today', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400' },
                { label: 'Treatments', value: treatments.length, icon: 'dentistry', color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400' },
                { label: t.portal.statBalance, value: `$${patient.balance.toFixed(0)}`, icon: 'payments', color: patient.balance > 0 ? 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400' : 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400' },
              ].map((s) => (
                <div key={s.label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center mb-2 ${s.color}`}>
                    <span className="material-symbols-outlined text-[18px]">{s.icon}</span>
                  </div>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{s.value}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
                </div>
              ))}
            </div>

            {/* {t.portal.upcomingAppts} */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-slate-900 dark:text-white">Upcoming Appointments</h3>
                <button onClick={() => setActiveTab('appointments')} className="text-sm text-primary hover:text-primary-hover">{t.portal.viewAll}</button>
              </div>
              {upcomingAppts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <span className="material-symbols-outlined text-4xl text-slate-300">calendar_today</span>
                  <p className="text-slate-500 text-sm">{t.portal.noUpcomingAppts}</p>
                  <button
                    onClick={() => setShowBookModal(true)}
                    className="text-sm text-primary font-medium hover:text-primary-hover"
                  >
                    {t.portal.bookAnAppt}
                  </button>
                </div>
              ) : upcomingAppts.slice(0, 3).map((a) => (
                <div key={a.id} className="flex items-center gap-4 px-5 py-4 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-blue-700 dark:text-blue-300">
                      {new Date(a.date).toLocaleDateString('en', { month: 'short' })}
                    </span>
                    <span className="text-sm font-bold text-blue-700 dark:text-blue-300">
                      {new Date(a.date).getDate()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{t.treatments[a.treatmentType as keyof typeof t.treatments] || a.treatmentType}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{a.time} • {a.room} • {a.dentist}</p>
                  </div>
                  <Badge variant={getStatusBadge(a.status)}>{a.status}</Badge>
                </div>
              ))}
            </div>

            {/* Patient Info */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">{t.portal.myInfo}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: 'Date of Birth', value: patient.dateOfBirth },
                  { label: 'Blood Type', value: patient.bloodType ?? '—' },
                  { label: 'Phone', value: patient.phone },
                  { label: 'Email', value: patient.email },
                  { label: 'Insurance', value: patient.insuranceProvider ?? 'Not provided' },
                  { label: 'Address', value: patient.address },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-start gap-2 py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white text-right">{value}</span>
                  </div>
                ))}
              </div>
              {patient.allergies.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{t.portal.knownAllergies}</p>
                  <div className="flex flex-wrap gap-2">
                    {patient.allergies.map(a => (
                      <span key={a} className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/50 rounded-full px-3 py-0.5 text-xs font-medium">
                        ⚠ {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-900 dark:text-white">{t.portal.myAppointments}</h3>
              <button
                onClick={() => setShowBookModal(true)}
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                Book New
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {appts.sort((a, b) => a.date > b.date ? -1 : 1).map((a) => (
                <div key={a.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-xs font-semibold text-primary">
                      {new Date(a.date).toLocaleDateString('en', { month: 'short' })}
                    </span>
                    <span className="text-base font-bold text-primary leading-none">{new Date(a.date).getDate()}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{t.treatments[a.treatmentType as keyof typeof t.treatments] || a.treatmentType}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{a.date} at {a.time} • {a.room} • {a.duration} min</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{a.dentist}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant={getStatusBadge(a.status)}>{a.status.replace('-', ' ')}</Badge>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">${a.fee}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Records Tab */}
        {activeTab === 'records' && (
          <div className="flex flex-col gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-slate-900 dark:text-white">Treatment History</h3>
              </div>
              {treatments.length === 0 ? (
                <p className="text-center text-slate-400 py-8">{t.portal.noTreatments}</p>
              ) : treatments.map((treatment) => (
                <div key={treatment.id} className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{t.treatments[treatment.type as keyof typeof t.treatments] || treatment.type}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{treatment.date} • {treatment.dentist}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{treatment.description}</p>
                    </div>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white flex-shrink-0">${treatment.cost}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-slate-900 dark:text-white">Payment History</h3>
            {payments.map((pay) => (
              <div key={pay.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{pay.description}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{pay.date} • {pay.method}</p>
                  {pay.insuranceClaim && <p className="text-xs text-blue-500 mt-0.5">{t.portal.claimLabel} {pay.insuranceClaim}</p>}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <p className="text-base font-bold text-slate-900 dark:text-white">${pay.amount.toFixed(2)}</p>
                  {pay.paidAmount < pay.amount && (
                    <p className="text-xs text-slate-500">{t.portal.paidLabel} ${pay.paidAmount.toFixed(2)}</p>
                  )}
                  <Badge variant={getStatusBadge(pay.status)}>{pay.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Book Modal */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowBookModal(false)} />
          <div className="relative bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t.portal.requestAppt}</h3>
              <button onClick={() => setShowBookModal(false)} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); alert(t.portal.requestedDemo); setShowBookModal(false); }} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Preferred Date *</span>
                <input type="date" required min="2026-03-01" className="h-10 border border-slate-200 dark:border-slate-700 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white dark:bg-slate-800 text-slate-900 dark:text-white" />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.portal.prefTime}</span>
                <select className="h-10 border border-slate-200 dark:border-slate-700 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                  {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.portal.reasonForVisit}</span>
                <select className="h-10 border border-slate-200 dark:border-slate-700 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                  {['Routine Checkup', 'Cleaning', 'Tooth Pain', 'Follow-up', 'Other'].map(r => <option key={r}>{r}</option>)}
                </select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.portal.additionalNotes}</span>
                <textarea rows={2} className="border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white dark:bg-slate-800 text-slate-900 dark:text-white" placeholder="Any concerns you'd like to mention..." />
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowBookModal(false)} className="flex-1 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors">Request Appointment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
