import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Topbar from '../components/Topbar';
import StatCard from '../components/StatCard';
import Badge, { getStatusBadge } from '../components/Badge';
import Modal from '../components/Modal';
import { mockAppointments, mockPatients, mockInventory, mockNotifications } from '../data/mockData';
import type { Appointment } from '../types';
import { useLang } from '../context/LanguageContext';

const today = new Date('2026-03-01').toISOString().split('T')[0];

function formatTime(time: string) {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return { hour: `${hour}:${m.toString().padStart(2, '0')}`, period };
}

export default function DashboardPage() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);

  const todayAppts = mockAppointments.filter((a) => a.date === today);
  const newPatients = mockPatients.filter((p) => p.registeredDate >= '2026-01-01').length;
  const lowStockCount = mockInventory.filter((i) => i.quantity <= i.reorderThreshold).length;
  const pendingLabs = 5;
  const unreadNotifs = mockNotifications.filter((n) => !n.read).length;

  return (
    <Layout>
      <Topbar
        title="Dashboard Overview"
        action={
          <button
            onClick={() => navigate('/appointments/new')}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            {t.dashboard.newAppointment}
          </button>
        }
      />

      <div className="flex flex-col gap-6 p-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title={t.dashboard.todayAppts}
            value={todayAppts.length}
            icon="calendar_today"
            iconBg="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
            trend="+20%"
            trendUp
          />
          <StatCard
            title={t.dashboard.newPatients}
            value={newPatients}
            icon="person_add"
            iconBg="bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
            trend="+10%"
            trendUp
          />
          <StatCard
            title={t.dashboard.pendingLabs}
            value={pendingLabs}
            icon="science"
            iconBg="bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
            subtitle={t.dashboard.processing}
          />
          <StatCard
            title={t.dashboard.inventoryAlerts}
            value={lowStockCount}
            icon="warning"
            iconBg="bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400"
            subtitle={t.dashboard.lowStock}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* {t.dashboard.todaySchedule} */}
          <div className="lg:col-span-2 flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 p-5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t.dashboard.todaySchedule}</h3>
              <button
                onClick={() => navigate('/appointments')}
                className="text-sm font-medium text-primary hover:text-primary-hover"
              >
                {t.dashboard.viewCalendar}
              </button>
            </div>
            {todayAppts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <span className="material-symbols-outlined text-5xl mb-2">calendar_today</span>
                <p>{t.dashboard.noAppointmentsToday}</p>
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800">
                {todayAppts.map((appt) => {
                  const { hour, period } = formatTime(appt.time);
                  return (
                    <div
                      key={appt.id}
                      className="group flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedAppt(appt)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 p-2 min-w-[60px]">
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{hour}</span>
                          <span className="text-sm font-bold text-slate-900 dark:text-white">{period}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{appt.patientName}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {t.treatments[appt.treatmentType as keyof typeof t.treatments] || appt.treatmentType} • {appt.room}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusBadge(appt.status)}>
                          {appt.status.charAt(0).toUpperCase() + appt.status.slice(1).replace('-', ' ')}
                        </Badge>
                        <button className="rounded p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="material-symbols-outlined text-[20px]">more_vert</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">
            {/* {t.dashboard.quickActions} */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">{t.dashboard.quickActions}</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: 'person_add', label: t.dashboard.addPatient, to: '/patients/new', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400' },
                  { icon: 'calendar_add_on', label: t.dashboard.schedule, to: '/appointments/new', color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/30 dark:text-purple-400' },
                  { icon: 'add_box', label: t.dashboard.addStock, to: '/inventory', color: 'text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400' },
                  { icon: 'receipt_long', label: t.dashboard.newBill, to: '/billing', color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/30 dark:text-orange-400' },
                ].map((action) => (
                  <button
                    key={action.to}
                    onClick={() => navigate(action.to)}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${action.color}`}>
                      <span className="material-symbols-outlined text-[22px]">{action.icon}</span>
                    </div>
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400 text-center">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Alerts */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{t.dashboard.alerts}</h3>
                <span className="text-xs bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-full px-2 py-0.5 font-medium">{unreadNotifs} new</span>
              </div>
              <div className="flex flex-col gap-3">
                {mockNotifications.filter(n => !n.read).slice(0, 3).map((n) => (
                  <div key={n.id} className="flex gap-3 items-start">
                    <div className={`mt-0.5 h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                      n.priority === 'high' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                      n.priority === 'medium' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      <span className="material-symbols-outlined text-[14px]">
                        {n.type === 'inventory' ? 'inventory_2' : n.type === 'appointment' ? 'calendar_today' : n.type === 'payment' ? 'payments' : 'info'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white leading-snug">{n.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{n.message}</p>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => navigate('/notifications')}
                  className="mt-1 text-sm font-medium text-primary hover:text-primary-hover text-center"
                >
                  {t.dashboard.viewAllAlerts}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* {t.dashboard.recentPatients} */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 p-5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t.dashboard.recentPatients}</h3>
            <button onClick={() => navigate('/patients')} className="text-sm font-medium text-primary hover:text-primary-hover">
              {t.dashboard.viewAll}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="text-left text-xs font-medium text-slate-500 dark:text-slate-400 px-5 py-3">{t.dashboard.tablePatient}</th>
                  <th className="text-left text-xs font-medium text-slate-500 dark:text-slate-400 px-5 py-3">{t.dashboard.tableLastVisit}</th>
                  <th className="text-left text-xs font-medium text-slate-500 dark:text-slate-400 px-5 py-3">{t.dashboard.tableNextAppt}</th>
                  <th className="text-left text-xs font-medium text-slate-500 dark:text-slate-400 px-5 py-3">{t.dashboard.tableBalance}</th>
                  <th className="text-left text-xs font-medium text-slate-500 dark:text-slate-400 px-5 py-3">{t.dashboard.tableStatus}</th>
                </tr>
              </thead>
              <tbody>
                {mockPatients.slice(0, 5).map((patient) => (
                  <tr
                    key={patient.id}
                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/patients/${patient.id}`)}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold flex-shrink-0">
                          {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{patient.firstName} {patient.lastName}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{patient.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-600 dark:text-slate-400">{patient.lastVisit ?? '—'}</td>
                    <td className="px-5 py-3 text-sm text-slate-600 dark:text-slate-400">{patient.nextAppointment ?? '—'}</td>
                    <td className="px-5 py-3 text-sm font-medium text-slate-900 dark:text-white">
                      {patient.balance > 0 ? (
                        <span className="text-red-500">${patient.balance.toFixed(2)}</span>
                      ) : '$0.00'}
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant={getStatusBadge(patient.status)}>
                        {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Appointment Detail Modal */}
      <Modal
        isOpen={!!selectedAppt}
        onClose={() => setSelectedAppt(null)}
        title={t.dashboard.apptDetails}
      >
        {selectedAppt && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-lg font-semibold">
                {selectedAppt.patientName.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white">{selectedAppt.patientName}</h4>
                <p className="text-sm text-slate-500">{t.dashboard.idPrefix} {selectedAppt.patientId}</p>
              </div>
              <div className="ml-auto">
                <Badge variant={getStatusBadge(selectedAppt.status)}>
                  {selectedAppt.status.replace('-', ' ')}
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
              {[
                { label: t.dashboard.fieldDate, value: selectedAppt.date },
                { label: t.dashboard.fieldTime, value: selectedAppt.time },
                { label: t.dashboard.fieldDuration, value: `${selectedAppt.duration} ${t.common.min}` },
                { label: t.dashboard.fieldRoom, value: selectedAppt.room },
                { label: t.dashboard.fieldTreatment, value: t.treatments[selectedAppt.treatmentType as keyof typeof t.treatments] || selectedAppt.treatmentType },
                { label: t.dashboard.fieldDentist, value: selectedAppt.dentist },
                { label: t.dashboard.fieldFee, value: `$${selectedAppt.fee}` },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white mt-0.5">{value}</p>
                </div>
              ))}
            </div>
            {selectedAppt.notes && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/50 rounded-lg p-3">
                <p className="text-xs font-medium text-yellow-700 dark:text-yellow-400 mb-1">{t.dashboard.fieldNotes}</p>
                <p className="text-sm text-yellow-800 dark:text-yellow-300">{selectedAppt.notes}</p>
              </div>
            )}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => { setSelectedAppt(null); navigate(`/patients/${selectedAppt.patientId}`); }}
                className="flex-1 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                {t.dashboard.viewPatient}
              </button>
              <button
                onClick={() => setSelectedAppt(null)}
                className="flex-1 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors"
              >
                {t.dashboard.close}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
}
