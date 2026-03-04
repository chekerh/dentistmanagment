import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Topbar from '../components/Topbar';
import Badge, { getStatusBadge } from '../components/Badge';
import { mockAppointments, mockPatients } from '../data/mockData';
import { useLang } from '../context/LanguageContext';

type SessionStatus = 'scheduled' | 'in-progress' | 'completed';

const SESSION_STATUSES: SessionStatus[] = ['scheduled', 'in-progress', 'completed'];

interface MaterialItem { id: string; name: string; unit: string; qty: number; icon: string; color: string; }

const DEFAULT_MATERIALS: MaterialItem[] = [
  { id: 'm1', name: 'Lidocaine 2%', unit: 'Inj. Cartridge', qty: 2, icon: 'vaccines', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
  { id: 'm2', name: 'Disposable Kit', unit: 'Standard Set', qty: 1, icon: 'masks', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' },
  { id: 'm3', name: 'Composite Resin', unit: 'A2 Shade, 2g', qty: 1, icon: 'dentistry', color: 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400' },
];

export default function AppointmentSessionPage() {
  const { t } = useLang();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const appointment = mockAppointments.find(a => a.id === id);
  const patient = appointment ? mockPatients.find(p => p.id === appointment.patientId) : null;

  const [sessionStatus, setSessionStatus] = useState<SessionStatus>(
    (appointment?.status as SessionStatus) ?? 'scheduled'
  );
  const [notes, setNotes] = useState('');
  const [notesSaved, setNotesSaved] = useState(false);
  const [materials, setMaterials] = useState<MaterialItem[]>(DEFAULT_MATERIALS);
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [newMat, setNewMat] = useState({ name: '', unit: '' });

  if (!appointment || !patient) {
    return (
      <Layout>
        <Topbar title="Session Not Found" />
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <span className="material-symbols-outlined text-5xl text-slate-300">event_busy</span>
          <p className="text-slate-500">{t.session.notFound}</p>
          <button onClick={() => navigate('/appointments')} className="text-primary hover:text-primary-hover text-sm font-medium">
            {t.session.backToAppts}
          </button>
        </div>
      </Layout>
    );
  }

  const treatmentLabel = t.treatments[appointment.treatmentType as keyof typeof t.treatments] ?? appointment.treatmentType;

  const saveNotes = () => {
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2500);
  };

  const addMaterial = () => {
    if (!newMat.name.trim()) return;
    setMaterials(prev => [
      ...prev,
      { id: `m${Date.now()}`, name: newMat.name, unit: newMat.unit || '—', qty: 1, icon: 'inventory_2', color: 'bg-slate-100 dark:bg-slate-800 text-slate-500' },
    ]);
    setNewMat({ name: '', unit: '' });
    setShowAddMaterial(false);
  };

  const removeMaterial = (matId: string) => setMaterials(prev => prev.filter(m => m.id !== matId));

  return (
    <Layout>
      <Topbar
        title="Appointment Session"
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/appointments')}
              className="flex items-center gap-2 h-9 px-3 rounded-lg border border-slate-200 dark:border-border-dark text-sm font-medium text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-surface-dark transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Back
            </button>
            <button className="flex items-center gap-2 h-9 px-4 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors shadow-sm shadow-primary/20">
              <span className="material-symbols-outlined text-[18px]">save</span>
              Save Session
            </button>
          </div>
        }
      />

      <div className="p-6 max-w-[1200px] mx-auto flex flex-col gap-6">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-1 text-sm">
          <Link to="/appointments" className="text-text-secondary hover:text-primary transition-colors">{t.session.appointmentsLink}</Link>
          <span className="material-symbols-outlined text-[16px] text-text-secondary">chevron_right</span>
          <span className="text-text-secondary">{appointment.dentist}</span>
          <span className="material-symbols-outlined text-[16px] text-text-secondary">chevron_right</span>
          <span className="text-slate-900 dark:text-white font-medium">Session #{appointment.id}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Patient Card */}
            <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
                <div className="flex gap-5 items-center">
                  <div className="relative">
                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl ring-4 ring-slate-100 dark:ring-surface-dark">
                      {patient.firstName[0]}{patient.lastName[0]}
                    </div>
                    <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-surface-dark" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{patient.firstName} {patient.lastName}</h2>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-slate-500 dark:text-text-secondary">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">badge</span> ID: {patient.id}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">calendar_today</span> {appointment.date} at {appointment.time}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-text-secondary mt-1">
                      {t.session.treatmentLabel} <span className="text-slate-700 dark:text-slate-300 font-medium">{treatmentLabel}</span>
                      <span className="ml-3">{t.session.roomLabel} <span className="text-slate-700 dark:text-slate-300 font-medium">{appointment.room}</span></span>
                    </p>
                    {patient.allergies.length > 0 && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="material-symbols-outlined text-[16px] text-red-500">warning</span>
                        <span className="text-xs text-red-600 dark:text-red-400 font-medium">{t.session.allergiesLabel} {patient.allergies.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                  <Link
                    to={`/patients/${patient.id}`}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-lg h-9 px-4 bg-slate-100 dark:bg-border-dark hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-white text-sm font-medium transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">history</span> History
                  </Link>
                  <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-lg h-9 px-4 bg-slate-100 dark:bg-border-dark hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-white text-sm font-medium transition-colors">
                    <span className="material-symbols-outlined text-[18px]">mail</span> Contact
                  </button>
                </div>
              </div>

              {/* Status toggle */}
              <div className="mt-6 pt-5 border-t border-slate-200 dark:border-border-dark">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-text-secondary mb-3">{t.session.sessionStatusLabel}</p>
                <div className="flex p-1 bg-slate-100 dark:bg-border-dark rounded-lg w-full sm:w-fit">
                  {SESSION_STATUSES.map(s => (
                    <button
                      key={s}
                      onClick={() => setSessionStatus(s)}
                      className={`flex-1 sm:flex-none px-5 py-2 rounded-md text-sm font-medium transition-all ${
                        sessionStatus === s
                          ? 'bg-white dark:bg-primary text-primary dark:text-white shadow-sm'
                          : 'text-slate-500 dark:text-text-secondary hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {s === 'in-progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* {t.session.clinicalNotes} */}
            <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark p-6 shadow-sm flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">clinical_notes</span>
                  Clinical Notes
                </h3>
                {notesSaved && (
                  <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span> Saved
                  </span>
                )}
                {!notesSaved && notes && (
                  <span className="text-xs text-slate-400">{t.session.unsavedLabel}</span>
                )}
              </div>
              <div className="relative">
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={8}
                  className="w-full p-4 bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-border-dark rounded-lg text-slate-900 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y leading-relaxed text-sm"
                  placeholder="Enter detailed clinical findings, procedure details, and patient complaints here..."
                />
                <div className="absolute bottom-3 right-3 flex gap-1.5">
                  {['image', 'mic'].map(icon => (
                    <button key={icon} className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-border-dark text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                      <span className="material-symbols-outlined text-[18px]">{icon}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={saveNotes}
                  className="bg-primary/10 hover:bg-primary/20 text-primary text-sm font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  {t.session.saveNotesBtn}
                </button>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* {t.session.materialsUsed} */}
            <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark p-6 shadow-sm flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">inventory_2</span>
                  Materials Used
                </h3>
                <button
                  onClick={() => setShowAddMaterial(true)}
                  className="text-primary hover:text-primary-hover text-sm font-medium flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span> Add
                </button>
              </div>

              {showAddMaterial && (
                <div className="mb-4 p-3 rounded-lg bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-border-dark flex flex-col gap-2">
                  <input
                    value={newMat.name}
                    onChange={e => setNewMat(p => ({ ...p, name: e.target.value }))}
                    placeholder={t.session.itemNamePh}
                    className="h-8 px-2 rounded border border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <input
                    value={newMat.unit}
                    onChange={e => setNewMat(p => ({ ...p, unit: e.target.value }))}
                    placeholder={t.session.itemUnitPh}
                    className="h-8 px-2 rounded border border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <div className="flex gap-2">
                    <button onClick={addMaterial} className="flex-1 h-8 rounded bg-primary text-white text-xs font-medium hover:bg-primary-hover transition-colors">Add</button>
                    <button onClick={() => setShowAddMaterial(false)} className="flex-1 h-8 rounded bg-slate-100 dark:bg-border-dark text-slate-600 dark:text-slate-300 text-xs font-medium hover:bg-slate-200 transition-colors">Cancel</button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {materials.map(mat => (
                  <div key={mat.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-background-dark border border-slate-100 dark:border-border-dark group">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded flex items-center justify-center ${mat.color}`}>
                        <span className="material-symbols-outlined text-[18px]">{mat.icon}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-200">{mat.name}</p>
                        <p className="text-xs text-slate-500 dark:text-text-secondary">{mat.unit}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">x{mat.qty}</span>
                      <button
                        onClick={() => removeMaterial(mat.id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-border-dark flex justify-between text-sm">
                <span className="text-slate-500 dark:text-text-secondary">{t.session.totalItems}</span>
                <span className="font-bold text-slate-900 dark:text-white">{materials.reduce((s, m) => s + m.qty, 0)}</span>
              </div>
            </div>

            {/* Next Steps */}
            <div className="rounded-xl bg-gradient-to-br from-primary/10 to-transparent dark:from-primary/20 p-6 border border-primary/20 shadow-sm flex flex-col gap-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">event_upcoming</span>
                {t.session.nextAppt}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {t.session.followUpDesc}{' '}
                <span className="font-bold text-primary">{t.session.twoWeeks}</span> {t.session.forCheckup}
              </p>
              <div className="flex flex-col gap-2 mt-2">
                <Link
                  to="/appointments"
                  className="flex w-full items-center justify-center rounded-lg h-10 px-4 bg-primary hover:bg-primary-hover text-white text-sm font-bold shadow-md shadow-primary/20 transition-all"
                >
                  {t.session.scheduleFollowUp}
                </Link>
                <button className="flex w-full items-center justify-center rounded-lg h-10 px-4 bg-white dark:bg-background-dark hover:bg-slate-50 dark:hover:bg-surface-dark text-slate-700 dark:text-white border border-slate-200 dark:border-border-dark text-sm font-bold transition-all">
                  {t.session.printPrescription}
                </button>
              </div>
            </div>

            {/* {t.session.sessionSummary} */}
            <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Session Summary</h3>
              <div className="flex flex-col gap-2 text-sm">
                {[
                  { label: 'Dentist', value: appointment.dentist },
                  { label: 'Duration', value: `${appointment.duration} min` },
                  { label: 'Room', value: appointment.room },
                  { label: 'Fee', value: `$${appointment.fee}` },
                  { label: 'Status', value: <Badge variant={getStatusBadge(sessionStatus)}>{sessionStatus.replace('-', ' ')}</Badge> },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-border-dark last:border-0">
                    <span className="text-slate-500 dark:text-text-secondary">{label}</span>
                    <span className="font-medium text-slate-900 dark:text-white">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
