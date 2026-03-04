import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';

const FEATURE_ICONS = ['calendar_month', 'description', 'inventory_2', 'payments', 'chat', 'analytics'];
const LANGS = [{ code: 'en', label: 'EN' }, { code: 'fr', label: 'FR' }, { code: 'ar', label: 'AR' }] as const;

export default function LandingPage() {
  const navigate = useNavigate();
  const { t, lang, setLang, isRTL } = useLang();
  const l = t.landing;

  // Scroll-reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background-dark text-white overflow-x-hidden" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 w-full border-b border-border-dark bg-background-dark/80 backdrop-blur-md px-6 py-4 lg:px-20">
        <div className="flex items-center justify-between max-w-[1200px] mx-auto gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary">
              <span className="material-symbols-outlined text-[20px]">dentistry</span>
            </div>
            <h2 className="text-xl font-black tracking-tight">DentoFlow</h2>
          </div>

          {/* Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">{l.navFeatures}</a>
            <a href="#testimonials" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">{l.navTestimonials}</a>
            <a href="#pricing" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">{l.navPricing}</a>
          </nav>

          {/* Right side: lang switcher + CTA */}
          <div className="flex items-center gap-3">
            {/* Language switcher */}
            <div className="flex items-center gap-0.5 rounded-lg bg-surface-dark border border-border-dark p-1">
              {LANGS.map(({ code, label }) => (
                <button
                  key={code}
                  onClick={() => setLang(code)}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${lang === code ? 'bg-primary text-white shadow' : 'text-text-secondary hover:text-white'}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              onClick={() => navigate('/login')}
              className="hidden sm:block text-sm font-medium text-white hover:text-primary transition-colors"
            >
              {l.logIn}
            </button>
            <button
              onClick={() => navigate('/login')}
              className="bg-primary hover:bg-primary-hover text-white text-sm font-bold py-2.5 px-5 rounded-lg transition-all shadow-[0_0_15px_rgba(43,124,238,0.3)] hover:shadow-[0_0_25px_rgba(43,124,238,0.5)]"
            >
              {l.getStarted}
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative px-6 py-20 lg:px-20 lg:py-28 bg-background-dark overflow-hidden">
        {/* Background orbs */}
        <div className="anim-orb absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="anim-orb delay-4 absolute bottom-0 left-0 w-[360px] h-[360px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Text */}
          <div className="flex-1 flex flex-col gap-6 z-10">
            <div className="anim-fade-up delay-1 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-dark border border-border-dark w-fit">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-medium text-primary">{l.badge}</span>
            </div>
            <h1 className="anim-fade-up delay-2 text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
              {l.heroTitle1}{' '}
              <span className="gradient-text-anim">{l.heroTitle2}</span>
            </h1>
            <p className="anim-fade-up delay-3 text-lg text-text-secondary max-w-xl leading-relaxed">
              {l.heroDesc}
            </p>
            <div className="anim-fade-up delay-4 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/login')}
                className="flex items-center justify-center h-12 px-8 rounded-lg bg-primary hover:bg-primary-hover text-white text-base font-bold tracking-wide transition-all shadow-lg shadow-primary/25 hover:scale-105"
              >
                {l.startFreeTrial}
              </button>
              <button className="flex items-center justify-center h-12 px-8 rounded-lg bg-surface-dark hover:bg-border-dark border border-border-dark text-white text-base font-medium transition-colors">
                <span className="material-symbols-outlined me-2 text-xl">play_circle</span>
                {l.watchDemo}
              </button>
            </div>
            <div className="anim-fade-up delay-5 flex items-center gap-4 pt-2 text-sm text-text-secondary">
              <div className="flex -space-x-2">
                {['bg-slate-600', 'bg-slate-500', 'bg-slate-400'].map((c, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 border-background-dark ${c}`} />
                ))}
              </div>
              <p>{l.trustedBy}</p>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="anim-fade-right delay-3 flex-1 w-full max-w-lg relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-cyan-500/10 rounded-full blur-3xl" />
            <div className="anim-float relative z-10 w-full rounded-2xl border border-border-dark shadow-2xl bg-surface-dark/90 backdrop-blur-sm p-6 flex flex-col gap-4">
              {/* Card header */}
              <div className="flex items-center gap-3 pb-4 border-b border-border-dark">
                <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[18px]">dentistry</span>
                </div>
                <span className="text-sm font-bold">{l.heroCardTitle}</span>
                <span className="ms-auto flex items-center gap-1 text-xs text-green-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> {l.heroCardLive}
                </span>
              </div>
              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: l.heroStatPatients, value: '18', color: 'text-white',       bg: 'bg-primary/10',     icon: 'person' },
                  { label: l.heroStatRevenue,  value: '$4.2k', color: 'text-green-400', bg: 'bg-green-500/10',  icon: 'payments' },
                  { label: l.heroStatLowStock, value: '3',   color: 'text-orange-400', bg: 'bg-orange-500/10',  icon: 'warning' },
                ].map((s) => (
                  <div key={s.label} className={`${s.bg} rounded-xl p-3 flex flex-col gap-1`}>
                    <span className="material-symbols-outlined text-[16px] text-text-secondary">{s.icon}</span>
                    <span className={`text-lg font-bold ${s.color}`}>{s.value}</span>
                    <span className="text-[10px] text-text-secondary">{s.label}</span>
                  </div>
                ))}
              </div>
              {/* Schedule */}
              <div className="flex flex-col gap-2">
                <p className="text-xs text-text-secondary font-medium uppercase tracking-wider">{l.heroScheduleTitle}</p>
                {[
                  { time: '09:00', name: 'Sarah Jenkins', type: 'Cleaning', status: l.heroStatusConfirmed },
                  { time: '10:30', name: 'Mark Allen',    type: 'Root Canal', status: l.heroStatusInProgress },
                  { time: '14:00', name: 'Lisa Park',     type: 'Checkup',  status: l.heroStatusUpcoming },
                ].map((a) => (
                  <div key={a.time} className="flex items-center gap-3 p-2 rounded-lg bg-background-dark/50">
                    <span className="text-xs text-text-secondary w-10">{a.time}</span>
                    <span className="text-sm font-medium flex-1">{a.name}</span>
                    <span className="text-xs text-text-secondary">{a.type}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${a.status === l.heroStatusInProgress ? 'bg-primary/20 text-primary' : a.status === l.heroStatusConfirmed ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'}`}>
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
      <section id="features" className="px-6 py-24 bg-background-dark border-t border-border-dark lg:px-20">
        <div className="max-w-[1200px] mx-auto">
          <div className="scroll-reveal text-center mb-16">
            <p className="text-primary font-bold text-sm tracking-widest uppercase mb-3">{l.featuresLabel}</p>
            <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">{l.featuresTitle}</h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">{l.featuresDesc}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {l.features.map((f, i) => (
              <div
                key={i}
                className="scroll-reveal group relative p-8 rounded-2xl bg-surface-dark border border-border-dark hover:border-primary/50 transition-all hover:shadow-[0_0_30px_rgba(43,124,238,0.12)] overflow-hidden cursor-default"
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full -me-4 -mt-4 transition-transform group-hover:scale-125" />
                <div className="w-12 h-12 mb-6 rounded-xl bg-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all group-hover:scale-110">
                  <span className="material-symbols-outlined text-2xl">{FEATURE_ICONS[i]}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                <p className="text-text-secondary leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="px-6 py-24 bg-surface-dark lg:px-20">
        <div className="max-w-[1200px] mx-auto">
          <div className="scroll-reveal flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-black text-white mb-2">{l.testimonialsTitle}</h2>
              <p className="text-text-secondary">{l.testimonialsDesc}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {l.testimonials.map((t, i) => (
              <div
                key={i}
                className="scroll-reveal flex flex-col p-6 rounded-2xl bg-background-dark border border-border-dark hover:border-primary/30 transition-all hover:shadow-[0_0_24px_rgba(43,124,238,0.08)]"
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <div className="flex items-center gap-0.5 text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
                <p className="text-slate-300 text-base italic mb-6 flex-1">{t.quote}</p>
                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                    {t.name.split(' ').filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase()}
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
          <div className="scroll-reveal text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">{l.pricingTitle}</h2>
            <p className="text-text-secondary text-lg">{l.pricingDesc}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Starter */}
            <div className="scroll-reveal p-8 rounded-2xl border border-border-dark bg-surface-dark flex flex-col gap-6 hover:border-slate-600 transition-all hover:shadow-lg" style={{ transitionDelay: '0ms' }}>
              <div>
                <h3 className="text-xl font-bold text-white">{l.starterName}</h3>
                <p className="text-text-secondary text-sm mt-1">{l.starterDesc}</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">$199</span>
                <span className="text-text-secondary">{t.common.perMonth}</span>
              </div>
              <button onClick={() => navigate('/login')} className="w-full py-3 rounded-lg border border-border-dark bg-transparent text-white font-bold hover:bg-border-dark transition-colors">
                {l.getStarted}
              </button>
              <ul className="flex flex-col gap-3">
                {l.starterFeatures.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                    <span className="material-symbols-outlined text-green-400 text-lg shrink-0">check</span>{f}
                  </li>
                ))}
              </ul>
            </div>
            {/* Professional */}
            <div className="scroll-reveal relative p-8 rounded-2xl border border-primary bg-surface-dark flex flex-col gap-6 shadow-[0_0_40px_rgba(43,124,238,0.18)] md:scale-105 z-10" style={{ transitionDelay: '100ms' }}>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider whitespace-nowrap">
                {l.mostPopular}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{l.proName}</h3>
                <p className="text-text-secondary text-sm mt-1">{l.proDesc}</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">$399</span>
                <span className="text-text-secondary">{t.common.perMonth}</span>
              </div>
              <button onClick={() => navigate('/login')} className="w-full py-3 rounded-lg bg-primary text-white font-bold hover:bg-primary-hover transition-colors shadow-lg shadow-primary/25">
                {l.startFreeTrial}
              </button>
              <ul className="flex flex-col gap-3">
                {l.proFeatures.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-white">
                    <span className="material-symbols-outlined text-primary text-lg shrink-0">check_circle</span>{f}
                  </li>
                ))}
              </ul>
            </div>
            {/* Enterprise */}
            <div className="scroll-reveal p-8 rounded-2xl border border-border-dark bg-surface-dark flex flex-col gap-6 hover:border-slate-600 transition-all hover:shadow-lg" style={{ transitionDelay: '200ms' }}>
              <div>
                <h3 className="text-xl font-bold text-white">{l.entName}</h3>
                <p className="text-text-secondary text-sm mt-1">{l.entDesc}</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">{l.entPrice}</span>
              </div>
              <button className="w-full py-3 rounded-lg border border-border-dark bg-transparent text-white font-bold hover:bg-border-dark transition-colors">
                {l.contactSales}
              </button>
              <ul className="flex flex-col gap-3">
                {l.entFeatures.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                    <span className="material-symbols-outlined text-green-400 text-lg shrink-0">check</span>{f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="px-6 py-20 bg-background-dark border-t border-border-dark lg:px-20">
        <div className="scroll-reveal max-w-[1200px] mx-auto rounded-3xl bg-gradient-to-r from-primary to-blue-500 p-10 lg:p-16 text-center relative overflow-hidden">
          <div className="anim-orb absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="anim-orb delay-3 absolute bottom-0 left-0 w-64 h-64 bg-cyan-400/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto gap-8">
            <h2 className="text-3xl lg:text-5xl font-black text-white leading-tight">{l.ctaTitle}</h2>
            <p className="text-blue-100 text-lg">{l.ctaDesc}</p>
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <button onClick={() => navigate('/login')} className="h-12 px-8 rounded-lg bg-white text-primary text-base font-bold tracking-wide hover:bg-slate-100 transition-all shadow-xl hover:scale-105">
                {l.getStartedNow}
              </button>
              <button className="h-12 px-8 rounded-lg bg-primary-hover border border-white/20 text-white text-base font-medium hover:bg-primary transition-colors">
                {l.scheduleDemo}
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
          <div className="flex gap-6 text-text-secondary text-sm flex-wrap justify-center">
            <a href="#" className="hover:text-white transition-colors">{l.footerPrivacy}</a>
            <a href="#" className="hover:text-white transition-colors">{l.footerTerms}</a>
            <a href="#" className="hover:text-white transition-colors">{l.footerContact}</a>
          </div>
          <p className="text-text-secondary text-sm text-center">{l.footerCopyright}</p>
        </div>
      </footer>
    </div>
  );
}
