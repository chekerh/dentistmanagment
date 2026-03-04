import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Topbar from '../components/Topbar';
import Badge, { getStatusBadge } from '../components/Badge';
import Modal from '../components/Modal';
import { mockPatients } from '../data/mockData';
import { useLang } from '../context/LanguageContext';


function calculateAge(dob: string) {
  const diff = new Date().getTime() - new Date(dob).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

export default function PatientsPage() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPatient, setNewPatient] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    dateOfBirth: '', gender: 'female', address: '',
    bloodType: '', allergies: '', medicalHistory: '',
    insuranceProvider: '', insuranceNumber: '',
  });

  const filtered = mockPatients.filter((p) => {
    const matchSearch =
      `${p.firstName} ${p.lastName} ${p.email} ${p.phone} ${p.id}`
        .toLowerCase()
        .includes(search.toLowerCase());
    const matchFilter = filter === 'all' || p.status === filter;
    return matchSearch && matchFilter;
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    alert(t.patients.addedDemo);
    setShowAddModal(false);
    setNewPatient({ firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '', gender: 'female', address: '', bloodType: '', allergies: '', medicalHistory: '', insuranceProvider: '', insuranceNumber: '' });
  };

  return (
    <Layout>
      <Topbar
        title="Patient Records"
        action={
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">person_add</span>
            Add Patient
          </button>
        }
      />

      <div className="p-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </span>
            <input
              type="text"
              placeholder="Search patients by name, email, phone, or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'active', 'inactive'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === f
                    ? 'bg-primary text-white'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-primary/50'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: t.patients.totalPatients, value: mockPatients.length, icon: 'group', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400' },
            { label: 'Active', value: mockPatients.filter(p => p.status === 'active').length, icon: 'check_circle', color: 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400' },
            { label: t.patients.withBalance, value: mockPatients.filter(p => p.balance > 0).length, icon: 'payments', color: 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400' },
            { label: t.patients.newThisMonth, value: mockPatients.filter(p => p.registeredDate >= '2026-02-01').length, icon: 'person_add', color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400' },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
              <div className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ${s.color}`}>
                <span className="material-symbols-outlined text-[18px]">{s.icon}</span>
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{s.value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 px-5 py-3 uppercase tracking-wide">Patient</th>
                  <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 px-5 py-3 uppercase tracking-wide">{t.patients.tableAgeGender}</th>
                  <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 px-5 py-3 uppercase tracking-wide">{t.patients.tableContact}</th>
                  <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 px-5 py-3 uppercase tracking-wide">{t.patients.tableLastVisit}</th>
                  <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 px-5 py-3 uppercase tracking-wide">Balance</th>
                  <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 px-5 py-3 uppercase tracking-wide">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-400">
                      <span className="material-symbols-outlined text-4xl block mb-2">search_off</span>
                      {t.patients.noPatientsFound}
                    </td>
                  </tr>
                ) : filtered.map((patient) => (
                  <tr
                    key={patient.id}
                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/patients/${patient.id}`)}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-semibold flex-shrink-0">
                          {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{patient.firstName} {patient.lastName}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">#{patient.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-600 dark:text-slate-400">
                      {calculateAge(patient.dateOfBirth)} yrs / {patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-sm text-slate-900 dark:text-white">{patient.phone}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{patient.email}</p>
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-600 dark:text-slate-400">{patient.lastVisit ?? '—'}</td>
                    <td className="px-5 py-3 text-sm font-medium">
                      {patient.balance > 0 ? (
                        <span className="text-red-500">${patient.balance.toFixed(2)}</span>
                      ) : <span className="text-green-600">$0.00</span>}
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant={getStatusBadge(patient.status)}>
                        {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/patients/${patient.id}`); }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Patient Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title={t.patients.modalTitle} size="lg">
        <form onSubmit={handleAdd} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'First Name', key: 'firstName', required: true },
              { label: 'Last Name', key: 'lastName', required: true },
              { label: 'Email', key: 'email', type: 'email', required: true },
              { label: 'Phone', key: 'phone', required: true },
              { label: 'Date of Birth', key: 'dateOfBirth', type: 'date', required: true },
              { label: 'Blood Type', key: 'bloodType' },
              { label: 'Insurance Provider', key: 'insuranceProvider' },
              { label: 'Insurance Number', key: 'insuranceNumber' },
            ].map(({ label, key, type = 'text', required }) => (
              <label key={key} className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}{required && ' *'}</span>
                <input
                  type={type}
                  value={(newPatient as any)[key]}
                  onChange={(e) => setNewPatient(p => ({ ...p, [key]: e.target.value }))}
                  required={required}
                  className="h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </label>
            ))}
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Gender *</span>
              <select
                value={newPatient.gender}
                onChange={(e) => setNewPatient(p => ({ ...p, gender: e.target.value }))}
                required
                className="h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </label>
          </div>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.patients.fieldAddress}</span>
            <input
              type="text"
              value={newPatient.address}
              onChange={(e) => setNewPatient(p => ({ ...p, address: e.target.value }))}
              className="h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Allergies (comma separated)</span>
            <input
              type="text"
              value={newPatient.allergies}
              onChange={(e) => setNewPatient(p => ({ ...p, allergies: e.target.value }))}
              placeholder="e.g. Penicillin, Latex"
              className="h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.patients.fieldMedHistory}</span>
            <textarea
              value={newPatient.medicalHistory}
              onChange={(e) => setNewPatient(p => ({ ...p, medicalHistory: e.target.value }))}
              rows={3}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
          </label>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="flex-1 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors"
            >
              Add Patient
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}
