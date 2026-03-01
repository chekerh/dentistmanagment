import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Topbar from '../components/Topbar';
import Badge, { getStatusBadge } from '../components/Badge';
import { mockPatients, mockAppointments, mockTreatments, mockPayments } from '../data/mockData';

function calculateAge(dob: string) {
  const diff = new Date().getTime() - new Date(dob).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

function getTreatmentLabel(type: string) {
  const labels: Record<string, string> = {
    checkup: 'General Checkup', cleaning: 'Dental Cleaning', filling: 'Tooth Filling',
    'root-canal': 'Root Canal', extraction: 'Extraction', crown: 'Crown Placement',
    whitening: 'Whitening', orthodontics: 'Orthodontic Adjustment', implant: 'Dental Implant', other: 'Other',
  };
  return labels[type] ?? type;
}

export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const patient = mockPatients.find((p) => p.id === id);

  if (!patient) {
    return (
      <Layout>
        <Topbar title="Patient Not Found" />
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <span className="material-symbols-outlined text-5xl text-slate-300">person_off</span>
          <p className="text-slate-500">Patient ID {id} not found.</p>
          <button onClick={() => navigate('/patients')} className="text-primary hover:underline text-sm">
            Back to patients
          </button>
        </div>
      </Layout>
    );
  }

  const appts = mockAppointments.filter((a) => a.patientId === id);
  const treatments = mockTreatments.filter((t) => t.patientId === id);
  const payments = mockPayments.filter((p) => p.patientId === id);

  return (
    <Layout>
      <Topbar
        title="Patient Chart"
        action={
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/appointments/new')}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Book Appointment
            </button>
          </div>
        }
      />

      <div className="p-6 flex flex-col gap-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <button onClick={() => navigate('/patients')} className="text-slate-500 hover:text-primary transition-colors">Patients</button>
          <span className="material-symbols-outlined text-[16px] text-slate-400">chevron_right</span>
          <span className="text-slate-900 dark:text-white font-medium">{patient.firstName} {patient.lastName}</span>
        </div>

        {/* Patient Header */}
        <div className="flex flex-col sm:flex-row gap-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold flex-shrink-0">
              {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{patient.firstName} {patient.lastName}</h2>
                <Badge variant={getStatusBadge(patient.status)}>{patient.status}</Badge>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">ID: {patient.id} • {calculateAge(patient.dateOfBirth)} years old • {patient.gender}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{patient.email} • {patient.phone}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 sm:ml-auto items-start">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{appts.length}</p>
              <p className="text-xs text-slate-500">Appointments</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{treatments.length}</p>
              <p className="text-xs text-slate-500">Treatments</p>
            </div>
            <div className="text-center">
              <p className={`text-2xl font-bold ${patient.balance > 0 ? 'text-red-500' : 'text-green-600'}`}>
                ${patient.balance.toFixed(2)}
              </p>
              <p className="text-xs text-slate-500">Balance Due</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="flex flex-col gap-6">
            {/* Personal Info */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide mb-4">Personal Information</h3>
              <div className="flex flex-col gap-3">
                {[
                  { label: 'Date of Birth', value: patient.dateOfBirth },
                  { label: 'Address', value: patient.address || '—' },
                  { label: 'Blood Type', value: patient.bloodType || '—' },
                  { label: 'Insurance', value: patient.insuranceProvider || '—' },
                  { label: 'Insurance No.', value: patient.insuranceNumber || '—' },
                  { label: 'Registered', value: patient.registeredDate },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-start gap-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex-shrink-0">{label}</span>
                    <span className="text-xs text-slate-900 dark:text-white text-right font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Allergies */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide mb-3">Allergies</h3>
              {patient.allergies.length === 0 ? (
                <p className="text-sm text-slate-500">No known allergies</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {patient.allergies.map((a) => (
                    <span key={a} className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/50 rounded-full px-3 py-1 text-xs font-medium">
                      ⚠ {a}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Medical History */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide mb-3">Medical History</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{patient.medicalHistory || 'No medical history on record.'}</p>
            </div>
          </div>

          {/* Right Column (2/3) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Appointments */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-slate-900 dark:text-white">Appointments</h3>
                <button onClick={() => navigate('/appointments')} className="text-sm text-primary hover:text-primary-hover">View all</button>
              </div>
              {appts.length === 0 ? (
                <p className="text-center text-slate-400 py-8">No appointments</p>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {appts.slice(0, 4).map((a) => (
                    <div key={a.id} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{getTreatmentLabel(a.treatmentType)}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{a.date} at {a.time} • {a.room}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">${a.fee}</span>
                        <Badge variant={getStatusBadge(a.status)}>{a.status.replace('-', ' ')}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Treatments */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-slate-900 dark:text-white">Treatment History</h3>
              </div>
              {treatments.length === 0 ? (
                <p className="text-center text-slate-400 py-8">No treatment records</p>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {treatments.map((t) => (
                    <div key={t.id} className="px-5 py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{getTreatmentLabel(t.type)}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t.date} • {t.dentist}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{t.description}</p>
                          {t.toothNumbers && (
                            <p className="text-xs text-primary mt-1">Tooth #{t.toothNumbers.join(', #')}</p>
                          )}
                        </div>
                        <span className="text-sm font-semibold text-slate-900 dark:text-white flex-shrink-0">${t.cost}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Payments */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-slate-900 dark:text-white">Payment History</h3>
              </div>
              {payments.length === 0 ? (
                <p className="text-center text-slate-400 py-8">No payments</p>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {payments.map((pay) => (
                    <div key={pay.id} className="flex items-center justify-between px-5 py-3">
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{pay.description}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{pay.date} • {pay.method}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">${pay.amount.toFixed(2)}</p>
                          {pay.paidAmount < pay.amount && (
                            <p className="text-xs text-slate-500">Paid: ${pay.paidAmount.toFixed(2)}</p>
                          )}
                        </div>
                        <Badge variant={getStatusBadge(pay.status)}>{pay.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
