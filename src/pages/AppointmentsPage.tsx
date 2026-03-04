import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Topbar from '../components/Topbar';
import Badge, { getStatusBadge } from '../components/Badge';
import Modal from '../components/Modal';
import { mockAppointments, mockPatients } from '../data/mockData';
import type { Appointment, TreatmentType } from '../types';
import { useLang } from '../context/LanguageContext';

const today = new Date('2026-03-01').toISOString().split('T')[0];


const TREATMENT_TYPES: TreatmentType[] = [
  'checkup', 'cleaning', 'filling', 'root-canal', 'extraction', 'crown', 'whitening', 'orthodontics', 'implant', 'other',
];

export default function AppointmentsPage() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [filter, setFilter] = useState<'all' | 'today' | 'upcoming' | 'completed'>('all');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [newAppt, setNewAppt] = useState({
    patientId: '', date: today, time: '09:00',
    treatmentType: 'checkup' as TreatmentType,
    room: 'Room 1', duration: 60, notes: '', fee: 120,
  });

  const filtered = mockAppointments.filter((a) => {
    const matchSearch = a.patientName.toLowerCase().includes(search.toLowerCase()) ||
      a.treatmentType.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'all' ||
      (filter === 'today' && a.date === today) ||
      (filter === 'upcoming' && a.date > today) ||
      (filter === 'completed' && a.status === 'completed');
    return matchSearch && matchFilter;
  });

  const statusCounts = {
    total: mockAppointments.length,
    today: mockAppointments.filter(a => a.date === today).length,
    upcoming: mockAppointments.filter(a => a.date > today).length,
    completed: mockAppointments.filter(a => a.status === 'completed').length,
  };

  const handleBookAppt = (e: React.FormEvent) => {
    e.preventDefault();
    alert(t.appointments.bookedDemo);
    setShowModal(false);
  };

  return (
    <Layout>
      <Topbar
        title="Appointments"
        action={
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
              {(['list', 'calendar'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                    view === v ? 'bg-primary text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px] align-middle">
                    {v === 'list' ? 'list' : 'calendar_month'}
                  </span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              Schedule
            </button>
          </div>
        }
      />

      <div className="p-4 md:p-6 flex flex-col gap-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total', value: statusCounts.total, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400', icon: 'calendar_month', key: 'all' },
            { label: 'Today', value: statusCounts.today, color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400', icon: 'today', key: 'today' },
            { label: 'Upcoming', value: statusCounts.upcoming, color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400', icon: 'schedule', key: 'upcoming' },
            { label: 'Completed', value: statusCounts.completed, color: 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400', icon: 'check_circle', key: 'completed' },
          ].map((s) => (
            <button
              key={s.key}
              onClick={() => setFilter(s.key as any)}
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                filter === s.key ? 'border-primary bg-primary/5 dark:bg-primary/10' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
              } shadow-sm`}
            >
              <div className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ${s.color}`}>
                <span className="material-symbols-outlined text-[18px]">{s.icon}</span>
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{s.value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </span>
          <input
            type="text"
            placeholder="Search by patient name or treatment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-slate-900 dark:text-white placeholder-slate-400"
          />
        </div>

        {/* Table */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  {['Patient', 'Date & Time', 'Treatment', 'Room', 'Duration', 'Fee', 'Status', ''].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 px-5 py-3 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-slate-400">
                      <span className="material-symbols-outlined text-4xl block mb-2">calendar_today</span>
                      {t.appointments.noFound}
                    </td>
                  </tr>
                ) : filtered.sort((a, b) => `${a.date} ${a.time}` > `${b.date} ${b.time}` ? 1 : -1).map((appt) => (
                  <tr
                    key={appt.id}
                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/appointments/${appt.id}`)}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold flex-shrink-0">
                          {appt.patientName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{appt.patientName}</p>
                          <p className="text-xs text-slate-500">{appt.patientId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{appt.date}</p>
                      <p className="text-xs text-slate-500">{appt.time}</p>
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-700 dark:text-slate-300">{t.treatments[appt.treatmentType as keyof typeof t.treatments] || appt.treatmentType}</td>
                    <td className="px-5 py-3 text-sm text-slate-600 dark:text-slate-400">{appt.room}</td>
                    <td className="px-5 py-3 text-sm text-slate-600 dark:text-slate-400">{appt.duration}m</td>
                    <td className="px-5 py-3 text-sm font-medium text-slate-900 dark:text-white">${appt.fee}</td>
                    <td className="px-5 py-3">
                      <Badge variant={getStatusBadge(appt.status)}>
                        {appt.status.replace('-', ' ')}
                      </Badge>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/appointments/${appt.id}`); }}
                          className="p-1.5 rounded text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="View Session"
                        >
                          <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedAppt(appt); }}
                          className="p-1.5 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Quick View"
                        >
                          <span className="material-symbols-outlined text-[18px]">info</span>
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/patients/${appt.patientId}`); }}
                          className="p-1.5 rounded text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="View Patient"
                        >
                          <span className="material-symbols-outlined text-[18px]">person</span>
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate('/billing'); }}
                          className="p-1.5 rounded text-slate-400 hover:text-green-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Billing"
                        >
                          <span className="material-symbols-outlined text-[18px]">receipt</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* {t.appointments.bookBtn} Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={t.appointments.modalTitle} size="md">
        <form onSubmit={handleBookAppt} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Patient *</span>
            <select
              value={newAppt.patientId}
              onChange={(e) => setNewAppt(p => ({ ...p, patientId: e.target.value }))}
              required
              className="h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">Select patient...</option>
              {mockPatients.map(p => (
                <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Date *</span>
              <input
                type="date"
                value={newAppt.date}
                onChange={(e) => setNewAppt(p => ({ ...p, date: e.target.value }))}
                required
                className="h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Time *</span>
              <input
                type="time"
                value={newAppt.time}
                onChange={(e) => setNewAppt(p => ({ ...p, time: e.target.value }))}
                required
                className="h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </label>
          </div>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Treatment Type *</span>
            <select
              value={newAppt.treatmentType}
              onChange={(e) => setNewAppt(p => ({ ...p, treatmentType: e.target.value as TreatmentType }))}
              className="h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {TREATMENT_TYPES.map(type => (
                <option key={type} value={type}>{t.treatments[type] || type}</option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Room</span>
              <select
                value={newAppt.room}
                onChange={(e) => setNewAppt(p => ({ ...p, room: e.target.value }))}
                className="h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {['Room 1', 'Room 2', 'Room 3', 'Room 4'].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.appointments.fieldDuration}</span>
              <input
                type="number"
                value={newAppt.duration}
                onChange={(e) => setNewAppt(p => ({ ...p, duration: Number(e.target.value) }))}
                min={15}
                step={15}
                className="h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </label>
          </div>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.appointments.fieldFee}</span>
            <input
              type="number"
              value={newAppt.fee}
              onChange={(e) => setNewAppt(p => ({ ...p, fee: Number(e.target.value) }))}
              min={0}
              className="h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Notes</span>
            <textarea
              value={newAppt.notes}
              onChange={(e) => setNewAppt(p => ({ ...p, notes: e.target.value }))}
              rows={2}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
          </label>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)}
              className="flex-1 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors">
              Book Appointment
            </button>
          </div>
        </form>
      </Modal>

      {/* {t.appointments.detailsTitle} Modal */}
      <Modal isOpen={!!selectedAppt} onClose={() => setSelectedAppt(null)} title="Appointment Details">
        {selectedAppt && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-lg font-bold">
                {selectedAppt.patientName.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white">{selectedAppt.patientName}</h4>
                <p className="text-sm text-slate-500">{selectedAppt.patientId}</p>
              </div>
              <Badge variant={getStatusBadge(selectedAppt.status)} className="ml-auto">
                {selectedAppt.status.replace('-', ' ')}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
              {[
                { label: 'Date', value: selectedAppt.date },
                { label: 'Time', value: selectedAppt.time },
                { label: 'Duration', value: `${selectedAppt.duration} min` },
                { label: 'Room', value: selectedAppt.room },
                { label: 'Treatment', value: t.treatments[selectedAppt.treatmentType as keyof typeof t.treatments] || selectedAppt.treatmentType },
                { label: 'Dentist', value: selectedAppt.dentist },
                { label: 'Fee', value: `$${selectedAppt.fee}` },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white mt-0.5">{value}</p>
                </div>
              ))}
            </div>
            {selectedAppt.notes && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/50 rounded-lg p-3">
                <p className="text-xs font-medium text-yellow-700 dark:text-yellow-400 mb-1">Notes</p>
                <p className="text-sm text-yellow-800 dark:text-yellow-300">{selectedAppt.notes}</p>
              </div>
            )}
            <div className="flex gap-3 pt-2">
              <button onClick={() => { setSelectedAppt(null); navigate(`/patients/${selectedAppt.patientId}`); }}
                className="flex-1 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300">
                View Patient
              </button>
              <button onClick={() => navigate('/billing')}
                className="flex-1 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors">
                {t.appointments.processPayment}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
}
