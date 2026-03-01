import { useNavigate } from 'react-router-dom';

const features = [
  { icon: 'calendar_month', title: 'Smart Scheduling', desc: 'AI-powered appointment management to minimize gaps and optimize chair utilization automatically.' },
  { icon: 'description', title: 'Digital Patient Records', desc: 'Secure, cloud-based access to patient history, periodontal charts, and X-rays from any device.' },
  { icon: 'inventory_2', title: 'Inventory Tracking', desc: 'Real-time stock monitoring for dental supplies with automated re-ordering alerts.' },
  { icon: 'payments', title: 'Automated Billing', desc: 'Seamless integration with insurance providers and one-click invoicing for patients.' },
  { icon: 'chat', title: 'Patient Communication', desc: 'Automated SMS and email reminders to reduce no-shows and keep your schedule full.' },
  { icon: 'analytics', title: 'Practice Analytics', desc: 'Deep insights into your revenue, patient retention, and treatment acceptance rates.' },
];

const testimonials = [
  { quote: '"DentoFlow revolutionized our booking process. We\'ve seen a 30% reduction in no-shows since switching."', name: 'Dr. Sarah Smith', clinic: 'Bright Smiles Clinic' },
  { quote: '"The inventory tracking alone saved us thousands in expired supplies last year. Absolutely essential software."', name: 'Dr. James Wilson', clinic: 'City Dental Group' },
  { quote: '"Intuitive, fast, and secure. My staff learned how to use it in one afternoon. Support is fantastic too."', name: 'Dr. Emily Chen', clinic: 'Chen Orthodontics' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background-dark text-white font-display overflow-x-hidden">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 w-full border-b border-border-dark bg-background-dark/80 backdrop-blur-md px-6 py-4 lg:px-20">
        <div className="flex items-center justify-between max-w-[1200px] mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary">
              <span className="material-symbols-outlined">dentistry</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">DentoFlow</h2>
          </div>
          <nav className="hidden lg:flex items-center gap-8">
            {['#features', '#testimonials', '#pricing'].map((href, i) => (
              <a key={href} href={href} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                {['Features', 'Testimonials', 'Pricing'][i]}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="hidden sm:block text-sm font-medium text-white hover:text-primary transition-colors"
            >
              Log In
            </button>
            <button
              onClick={() => navigate('/login')}
              className="bg-primary hover:bg-primary-hover text-white text-sm font-bold py-2.5 px-5 rounded-lg transition-all shadow-[0_0_15px_rgba(43,124,238,0.3)] hover:shadow-[0_0_25px_rgba(43,124,238,0.5)]"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative px-6 py-20 lg:px-20 lg:py-28 bg-background-dark overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 flex flex-col gap-6 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-dark border border-border-dark w-fit">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-medium text-primary">v2.0 Now Available</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
              Streamline Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">
                Dental Practice
              </span>
            </h1>
            <p className="text-lg text-text-secondary max-w-xl leading-relaxed">
              The all-in-one Dentist Management System designed to optimize appointments, patient records, and inventory effortlessly. Focus on smiles, not paperwork.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/login')}
                className="flex items-center justify-center h-12 px-8 rounded-lg bg-primary hover:bg-primary-hover text-white text-base font-bold tracking-wide transition-all shadow-lg shadow-primary/25"
              >
                Start Free Trial
              </button>
              <button className="flex items-center justify-center h-12 px-8 rounded-lg bg-surface-dark hover:bg-border-dark border border-border-dark text-white text-base font-medium transition-colors">
                <span className="material-symbols-outlined mr-2 text-xl">play_circle</span>
                Watch Demo
              </button>
            </div>
            <div className="flex items-center gap-4 pt-2 text-sm text-text-secondary">
              <div className="flex -space-x-2">
                {['bg-slate-600', 'bg-slate-500', 'bg-slate-400'].map((c, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 border-background-dark ${c}`} />
                ))}
              </div>
              <p>Trusted by 2,000+ clinics worldwide</p>
            </div>
          </div>
          {/* Hero visual */}
          <div className="flex-1 w-full max-w-lg relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-cyan-500/10 rounded-full blur-3xl" />
            <div className="relative z-10 w-full rounded-2xl border border-border-dark shadow-2xl bg-surface-dark/80 backdrop-blur-sm p-6 flex flex-col gap-4">
              <div className="flex items-center gap-3 pb-4 border-b border-border-dark">
                <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[18px]">dentistry</span>
                </div>
                <span className="text-sm font-bold">DentoFlow Dashboard</span>
                <span className="ml-auto flex items-center gap-1 text-xs text-green-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Live
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Patients Today', value: '18', color: 'text-white', bg: 'bg-primary/10', icon: 'person' },
                  { label: 'Revenue', value: '$4.2k', color: 'text-green-400', bg: 'bg-green-500/10', icon: 'payments' },
                  { label: 'Low Stock', value: '3', color: 'text-orange-400', bg: 'bg-orange-500/10', icon: 'warning' },
                ].map((s) => (
                  <div key={s.label} className={`${s.bg} rounded-xl p-3 flex flex-col gap-1`}>
                    <span className="material-symbols-outlined text-[16px] text-text-secondary">{s.icon}</span>
                    <span className={`text-lg font-bold ${s.color}`}>{s.value}</span>
                    <span className="text-[10px] text-text-secondary">{s.label}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-xs text-text-secondary font-medium uppercase tracking-wider">Today's Schedule</p>
                {[
                  { time: '09:00', name: 'Sarah Jenkins', type: 'Cleaning', status: 'Confirmed' },
                  { time: '10:30', name: 'Mark Allen', type: 'Root Canal', status: 'In Progress' },
                  { time: '14:00', name: 'Lisa Park', type: 'Checkup', status: 'Upcoming' },
                ].map((a) => (
                  <div key={a.time} className="flex items-center gap-3 p-2 rounded-lg bg-background-dark/50">
                    <span className="text-xs text-text-secondary w-10">{a.time}</span>
                    <span className="text-sm font-medium flex-1">{a.name}</span>
                    <span className="text-xs text-text-secondary">{a.type}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${a.status === 'In Progress' ? 'bg-primary/20 text-primary' : a.status === 'Confirmed' ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'}`}>
                      {a.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="px-6 py-20 bg-background-dark border-t border-border-dark lg:px-20">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary font-bold text-sm tracking-widest uppercase mb-3">Features</p>
            <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">Powerful Tools for Modern Dentistry</h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Everything you need to run a successful clinic, from AI-scheduling to automated billing and patient communication.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="group relative p-8 rounded-2xl bg-surface-dark border border-border-dark hover:border-primary/50 transition-all hover:shadow-[0_0_30px_rgba(43,124,238,0.1)] overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                <div className="w-12 h-12 mb-6 rounded-lg bg-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-2xl">{f.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                <p className="text-text-secondary leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="px-6 py-20 bg-surface-dark lg:px-20">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-black text-white mb-2">What Dentists Are Saying</h2>
              <p className="text-text-secondary">Join thousands of dental professionals streamlining their practice.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="flex flex-col p-6 rounded-xl bg-background-dark border border-border-dark">
                <div className="flex items-center gap-0.5 text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
                <p className="text-slate-300 text-base italic mb-6 flex-1">{t.quote}</p>
                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                    {t.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{t.name}</p>
                    <p className="text-text-secondary text-xs">{t.clinic}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="px-6 py-24 bg-background-dark lg:px-20">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">Transparent Pricing for Every Clinic</h2>
            <p className="text-text-secondary text-lg">Choose the plan that scales with your practice.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Starter */}
            <div className="p-8 rounded-2xl border border-border-dark bg-surface-dark flex flex-col gap-6 hover:border-slate-600 transition-colors">
              <div>
                <h3 className="text-xl font-bold text-white">Starter</h3>
                <p className="text-text-secondary text-sm mt-1">For new solo practices</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">$199</span>
                <span className="text-text-secondary">/mo</span>
              </div>
              <button onClick={() => navigate('/login')} className="w-full py-3 rounded-lg border border-border-dark bg-transparent text-white font-bold hover:bg-border-dark transition-colors">
                Get Started
              </button>
              <ul className="flex flex-col gap-3">
                {['1 Dentist Profile', 'Basic Scheduling', 'Digital Patient Records', 'Email Support'].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-slate-300">
                    <span className="material-symbols-outlined text-green-400 text-lg">check</span>{f}
                  </li>
                ))}
              </ul>
            </div>
            {/* Professional (featured) */}
            <div className="relative p-8 rounded-2xl border border-primary bg-surface-dark flex flex-col gap-6 shadow-[0_0_40px_rgba(43,124,238,0.15)] md:scale-105 z-10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Most Popular
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Professional</h3>
                <p className="text-text-secondary text-sm mt-1">For growing clinics</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">$399</span>
                <span className="text-text-secondary">/mo</span>
              </div>
              <button onClick={() => navigate('/login')} className="w-full py-3 rounded-lg bg-primary text-white font-bold hover:bg-primary-hover transition-colors shadow-lg shadow-primary/25">
                Start Free Trial
              </button>
              <ul className="flex flex-col gap-3">
                {['Up to 5 Dentist Profiles', 'Advanced AI Scheduling', 'Inventory Management', 'SMS Reminders included', '24/7 Priority Support'].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-white">
                    <span className="material-symbols-outlined text-primary text-lg">check_circle</span>{f}
                  </li>
                ))}
              </ul>
            </div>
            {/* Enterprise */}
            <div className="p-8 rounded-2xl border border-border-dark bg-surface-dark flex flex-col gap-6 hover:border-slate-600 transition-colors">
              <div>
                <h3 className="text-xl font-bold text-white">Enterprise</h3>
                <p className="text-text-secondary text-sm mt-1">For multi-location chains</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">Custom</span>
              </div>
              <button className="w-full py-3 rounded-lg border border-border-dark bg-transparent text-white font-bold hover:bg-border-dark transition-colors">
                Contact Sales
              </button>
              <ul className="flex flex-col gap-3">
                {['Unlimited Profiles', 'Multi-location Management', 'Custom Integrations (API)', 'Dedicated Account Manager'].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-slate-300">
                    <span className="material-symbols-outlined text-green-400 text-lg">check</span>{f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="px-6 py-20 bg-background-dark border-t border-border-dark lg:px-20">
        <div className="max-w-[1200px] mx-auto rounded-3xl bg-gradient-to-r from-primary to-blue-500 p-10 lg:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto gap-8">
            <h2 className="text-3xl lg:text-5xl font-black text-white leading-tight">
              Ready to Transform Your Dental Practice?
            </h2>
            <p className="text-blue-100 text-lg">Join the fastest-growing community of modern dentists today. No credit card required.</p>
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <button onClick={() => navigate('/login')} className="h-12 px-8 rounded-lg bg-white text-primary text-base font-bold tracking-wide hover:bg-slate-100 transition-colors shadow-xl">
                Get Started Now
              </button>
              <button className="h-12 px-8 rounded-lg bg-primary-hover border border-white/20 text-white text-base font-medium hover:bg-primary transition-colors">
                Schedule a Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="px-6 py-12 bg-background-dark border-t border-border-dark lg:px-20">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">dentistry</span>
            <span className="font-bold text-lg">DentoFlow</span>
          </div>
          <div className="flex gap-8 text-text-secondary text-sm">
            {['Privacy Policy', 'Terms of Service', 'Contact'].map(l => (
              <a key={l} href="#" className="hover:text-white transition-colors">{l}</a>
            ))}
          </div>
          <p className="text-text-secondary text-sm">© 2026 DentoFlow Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
