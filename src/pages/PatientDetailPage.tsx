import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Topbar from '../components/Topbar';
import Badge, { getStatusBadge } from '../components/Badge';
import DentalChart from '../components/DentalChart';
import { mockPatients, mockAppointments, mockTreatments, mockPayments } from '../data/mockData';
import { useLang } from '../context/LanguageContext';

function calculateAge(dob: string) {
  const diff = new Date().getTime() - new Date(dob).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}


export default function PatientDetailPage() {
  const { t } = useLang();
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
            {t.patientDetail.backToPatients}
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
          <button onClick={() => navigate('/patients')} className="text-slate-500 hover:text-primary transition-colors">{t.patientDetail.patientsLink}</button>
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
              <p className="text-xs text-slate-500">{t.patientDetail.appointmentsSection}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{treatments.length}</p>
              <p className="text-xs text-slate-500">Treatments</p>
            </div>
            <div className="text-center">
              <p className={`text-2xl font-bold ${patient.balance > 0 ? 'text-red-500' : 'text-green-600'}`}>
                ${patient.balance.toFixed(2)}
              </p>
              <p className="text-xs text-slate-500">{t.patientDetail.balanceDue}</p>
            </div>
          </div>
        </div>

        {/* Dental Chart Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <DentalChart
              toothData={[
                { number: 14, status: 'cavity', notes: 'Decay (MOD)' },
                { number: 16, status: 'treated', notes: 'Root canal 2023' },
                { number: 26, status: 'crown', notes: 'Porcelain crown' },
                { number: 36, status: 'missing' },
              ]}
            />
          </div>
          
          <div className="flex flex-col gap-6">
            {/* Quick Actions */}
            <div className="bg-surface-dark border border-border-dark rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">{t.patientDetail.quickActions}</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-background-dark hover:bg-slate-800 border border-border-dark transition-colors group">
                  <span className="material-symbols-outlined text-2xl text-slate-400 group-hover:text-primary transition-colors">grid_on</span>
                  <span className="text-xs font-medium text-slate-300">{t.patientDetail.cavity}</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-background-dark hover:bg-slate-800 border border-border-dark transition-colors group">
                  <span className="material-symbols-outlined text-2xl text-slate-400 group-hover:text-primary transition-colors">stars</span>
                  <span className="text-xs font-medium text-slate-300">{t.patientDetail.crown}</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-background-dark hover:bg-slate-800 border border-border-dark transition-colors group">
                  <span className="material-symbols-outlined text-2xl text-slate-400 group-hover:text-primary transition-colors">close</span>
                  <span className="text-xs font-medium text-slate-300">{t.patientDetail.extract}</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-background-dark hover:bg-slate-800 border border-border-dark transition-colors group">
                  <span className="material-symbols-outlined text-2xl text-slate-400 group-hover:text-primary transition-colors">edit_note</span>
                  <span className="text-xs font-medium text-slate-300">{t.patientDetail.note}</span>
                </button>
              </div>
            </div>

            {/* Current Status */}
            <div className="bg-surface-dark border border-border-dark rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">{t.patientDetail.currentStatus}</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-400">{t.patientDetail.condition}</p>
                  <p className="text-sm font-semibold text-red-400 mt-1">Decay (MOD)</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">{t.patientDetail.lastTreatment}</p>
                  <p className="text-sm font-semibold text-white mt-1">{t.patientDetail.none}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* X-Rays & Media and Prescriptions Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* X-Rays & Media */}
          <div className="bg-surface-dark border border-border-dark rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wide">{t.patientDetail.xraysMedia}</h3>
              <button className="p-2 rounded-lg bg-background-dark hover:bg-slate-800 border border-border-dark transition-colors">
                <span className="material-symbols-outlined text-[20px] text-slate-300">photo_camera</span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative group cursor-pointer rounded-lg overflow-hidden bg-slate-800 border border-border-dark">
                <div className="aspect-square flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-slate-600">image</span>
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-xs text-white font-medium">{t.patientDetail.panoramicXray}</span>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[10px] text-white">
                  Jan 2025
                </div>
              </div>
              <div className="relative group cursor-pointer rounded-lg overflow-hidden bg-slate-800 border border-border-dark">
                <div className="aspect-square flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-slate-600">image</span>
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-xs text-white font-medium">{t.patientDetail.periapical} - Jan 2023</span>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[10px] text-white">
                  {t.patientDetail.periapical}
                </div>
              </div>
              <button className="aspect-square rounded-lg border-2 border-dashed border-border-dark hover:border-primary flex flex-col items-center justify-center gap-2 transition-colors group">
                <span className="material-symbols-outlined text-2xl text-slate-600 group-hover:text-primary">upload</span>
                <span className="text-xs text-slate-500 group-hover:text-primary">{t.patientDetail.uploadNew}</span>
              </button>
            </div>
          </div>

          {/* Active Prescriptions */}
          <div className="bg-surface-dark border border-border-dark rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wide">{t.patientDetail.activePrescriptions}</h3>
              <button className="p-2 rounded-lg bg-background-dark hover:bg-slate-800 border border-border-dark transition-colors">
                <span className="material-symbols-outlined text-[20px] text-slate-300">add</span>
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-background-dark border border-border-dark">
                <div className="p-2 rounded-lg bg-primary/10">
                  <span className="material-symbols-outlined text-primary text-[20px]">medication</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">Amoxicillin 500mg</p>
                  <p className="text-xs text-slate-400 mt-0.5">1 tablet every 8 hours for 7 days</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-background-dark border border-border-dark">
                <div className="p-2 rounded-lg bg-primary/10">
                  <span className="material-symbols-outlined text-primary text-[20px]">medication</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">Chlorhexidine Rinse</p>
                  <p className="text-xs text-slate-400 mt-0.5">{t.patientDetail.twiceDaily}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="flex flex-col gap-6">
            {/* Personal Info */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide mb-4">{t.patientDetail.personalInfo}</h3>
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
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide mb-3">{t.patientDetail.allergies}</h3>
              {patient.allergies.length === 0 ? (
                <p className="text-sm text-slate-500">{t.patientDetail.noAllergies}</p>
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

            {/* {t.patientDetail.medicalHistory} */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide mb-3">Medical History</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{patient.medicalHistory || t.patientDetail.noMedHistory}</p>
            </div>
          </div>

          {/* Right Column (2/3) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Appointments */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-slate-900 dark:text-white">Appointments</h3>
                <button onClick={() => navigate('/appointments')} className="text-sm text-primary hover:text-primary-hover">{t.patientDetail.viewAll}</button>
              </div>
              {appts.length === 0 ? (
                <p className="text-center text-slate-400 py-8">{t.patientDetail.noAppointments}</p>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {appts.slice(0, 4).map((a) => (
                    <div key={a.id} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{t.treatments[a.treatmentType as keyof typeof t.treatments] || a.treatmentType}</p>
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
                <h3 className="font-bold text-slate-900 dark:text-white">{t.patientDetail.treatmentHistory}</h3>
              </div>
              {treatments.length === 0 ? (
                <p className="text-center text-slate-400 py-8">{t.patientDetail.noTreatments}</p>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {treatments.map((treatment) => (
                    <div key={treatment.id} className="px-5 py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{t.treatments[treatment.type as keyof typeof t.treatments] || treatment.type}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{treatment.date} • {treatment.dentist}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{treatment.description}</p>
                          {treatment.toothNumbers && (
                            <p className="text-xs text-primary mt-1">Tooth #{treatment.toothNumbers.join(', #')}</p>
                          )}
                        </div>
                        <span className="text-sm font-semibold text-slate-900 dark:text-white flex-shrink-0">${treatment.cost}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Payments */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-slate-900 dark:text-white">{t.patientDetail.paymentHistory}</h3>
              </div>
              {payments.length === 0 ? (
                <p className="text-center text-slate-400 py-8">{t.patientDetail.noPayments}</p>
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
                            <p className="text-xs text-slate-500">{t.patientDetail.paidLabel} ${pay.paidAmount.toFixed(2)}</p>
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
