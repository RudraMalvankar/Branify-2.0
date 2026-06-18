import Link from 'next/link';

const steps = [
  {
    step: '01',
    label: 'VARK Discovery',
    desc: 'Complete a science-backed assessment to uncover your dominant learning style profile.',
    gradient: 'from-blue-500 to-indigo-600',
    glow: 'hover:shadow-blue-500/20',
    pill: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  },
  {
    step: '02',
    label: 'AI Adaptation',
    desc: 'Our AI rewrites any lesson—from physics to poetry—into your preferred learning format.',
    gradient: 'from-violet-500 to-purple-600',
    glow: 'hover:shadow-violet-500/20',
    pill: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  },
  {
    step: '03',
    label: 'Mastery Check',
    desc: 'Track retention over time and get smart reminders when topics need revisiting.',
    gradient: 'from-pink-500 to-rose-600',
    glow: 'hover:shadow-pink-500/20',
    pill: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
  },
];

const varkTypes = [
  {
    type: 'Visual',
    color: 'from-blue-500 to-indigo-600',
    glow: 'group-hover:shadow-blue-500/30',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    desc: 'You learn best through diagrams, charts, and infographics. You "see" the big picture.',
  },
  {
    type: 'Auditory',
    color: 'from-emerald-500 to-teal-600',
    glow: 'group-hover:shadow-emerald-500/30',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    desc: 'Listening, discussing, and speaking are your primary tools. You prefer hearing over reading.',
  },
  {
    type: 'Read/Write',
    color: 'from-amber-500 to-orange-600',
    glow: 'group-hover:shadow-amber-500/30',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    desc: 'Input and output of text is your forte. Lists, essays, and notes are your primary tools.',
  },
  {
    type: 'Kinesthetic',
    color: 'from-purple-500 to-pink-600',
    glow: 'group-hover:shadow-purple-500/30',
    badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
    desc: 'You are a doer. Physical experiences, examples, and trial and error are how you master skills.',
  },
];

const features = [
  {
    gradient: 'from-blue-500 to-indigo-600',
    bar: 'from-blue-400 to-indigo-500',
    glow: 'hover:shadow-blue-500/20',
    title: 'VARK Assessment',
    desc: 'A scenario-based test that pinpoints your precise learning preference quotient.',
  },
  {
    gradient: 'from-violet-500 to-purple-600',
    bar: 'from-violet-400 to-purple-500',
    glow: 'hover:shadow-violet-500/20',
    title: 'AI Content Weaver',
    desc: 'Upload any PDF or idea and watch as our AI synthesizes it into 4 distinct learning formats.',
  },
  {
    gradient: 'from-emerald-500 to-teal-600',
    bar: 'from-emerald-400 to-teal-500',
    glow: 'hover:shadow-emerald-500/20',
    title: 'Retention Analytics',
    desc: "Track how well you remember topics over time and get reminders when it's time to revisit.",
  },
  {
    gradient: 'from-amber-500 to-orange-500',
    bar: 'from-amber-400 to-orange-400',
    glow: 'hover:shadow-amber-500/20',
    title: 'Smart Recommendations',
    desc: 'Daily suggestions for study topics based on your syllabus and current mastery levels.',
  },
  {
    gradient: 'from-pink-500 to-rose-600',
    bar: 'from-pink-400 to-rose-500',
    glow: 'hover:shadow-pink-500/20',
    title: 'Collaborative Study',
    desc: 'Match with study buddies who share your learning style for more productive group sessions.',
  },
  {
    gradient: 'from-sky-500 to-cyan-600',
    bar: 'from-sky-400 to-cyan-500',
    glow: 'hover:shadow-sky-500/20',
    title: 'Curriculum Alignment',
    desc: 'Brainify supports major international boards including IB, AP, and Cambridge Curriculum.',
  },
];

const testimonials = [
  { name: 'Priya S.', role: 'Beta Tester &mdash; Grade 11', text: '"I thought I was just bad at math. It turns out I just needed to see it through Visual summaries. My grades have never been higher."' },
  { name: 'Arjun M.', role: 'Beta Tester &mdash; University', text: '"The Auditory summaries are a game-changer. I listen to my Biology lectures while commuting and my retention has improved massively."' },
  { name: 'Leela K.', role: 'Beta Tester &mdash; Class 10', text: '"Being a Kinesthetic learner in a lecture hall was impossible. The interactive exercises here finally give me the hands-on practice I need."' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
              </div>
              <span className="font-bold text-gray-800 dark:text-white text-lg">Brainify</span>
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-500 dark:text-gray-300">
              <a href="#how-it-works" className="hover:text-brand transition-colors">How it Works</a>
              <a href="#vark" className="hover:text-brand transition-colors">VARK Model</a>
              <a href="#features" className="hover:text-brand transition-colors">Features</a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-brand transition-colors px-4 py-2">
              Log In
            </Link>
            <Link href="/register" className="btn-primary text-sm py-2.5">
              Start Learning Style Test
            </Link>
          </div>
        </div>
      </nav>
      {/* Hero */}
      <section className="pt-20 pb-24 px-6 bg-gradient-to-br from-white via-brand-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              Now Powered by Gemini AI
            </div>
            <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4">
              Learn Your Way,<br /><span className="text-brand">Not Their Way</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-300 text-lg mb-8 leading-relaxed">
              Traditional education uses a single mold. Brainify uses AI to discover your unique VARK learning style and adapts every lesson to how you think best.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link href="/register" className="btn-primary text-base py-3.5 px-8">
                Take Learning Style Test
              </Link>
              <a href="#how-it-works" className="btn-secondary text-base py-3.5 px-8">
                Explore Platform
              </a>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-400 mt-5">
              Joined by <strong className="text-gray-700 dark:text-gray-200">12,000+</strong> active learners
            </p>
          </div>
          <div className="hidden md:flex justify-center items-center">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-96 h-96 rounded-full bg-gradient-to-br from-green-200/60 via-brand-50/40 to-transparent dark:from-green-900/40 dark:via-brand/10 dark:to-transparent blur-2xl" />
              <div className="absolute w-80 h-80 rounded-full border-2 border-green-200/50 dark:border-green-700/30 animate-spin" style={{ animationDuration: '18s' }} />
              <div
                className="relative z-10 w-[340px] h-[340px] flex flex-col items-center justify-center"
                style={{ animation: 'brainFloat 4s ease-in-out infinite' }}
              >
                <div className="text-[120px] leading-none select-none" style={{ filter: 'drop-shadow(0 12px 32px rgba(67,97,238,0.25)) drop-shadow(0 2px 8px rgba(16,185,129,0.2))' }}>
                  🧠
                </div>
                <div className="mt-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl px-5 py-3 text-center shadow-lg border border-gray-100 dark:border-gray-700">
                  <p className="font-bold text-gray-800 dark:text-white text-base">VARK Assessment</p>
                  <p className="text-blue-500 dark:text-blue-300 text-xs mt-0.5">Discover your learning DNA</p>
                </div>
              </div>
              <div className="absolute top-6 -right-4 bg-white dark:bg-gray-800 rounded-xl px-3 py-2 shadow-lg border border-gray-100 dark:border-gray-700 flex items-center gap-2 z-20">
                <span className="text-lg">🎯</span>
                <div>
                  <p className="text-xs font-bold text-gray-800 dark:text-white leading-none">VARK Profile</p>
                  <p className="text-[10px] text-gray-400">Identified</p>
                </div>
              </div>
              <div className="absolute bottom-10 -left-6 bg-white dark:bg-gray-800 rounded-xl px-3 py-2 shadow-lg border border-gray-100 dark:border-gray-700 flex items-center gap-2 z-20">
                <span className="text-lg">⚡</span>
                <div>
                  <p className="text-xs font-bold text-gray-800 dark:text-white leading-none">AI Adapts</p>
                  <p className="text-[10px] text-gray-400">In real-time</p>
                </div>
              </div>
            </div>
            <style>{`
              @keyframes brainFloat {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-14px); }
              }
            `}</style>
          </div>
        </div>
      </section>
      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6 bg-gray-50 dark:bg-gray-800/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="section-pill">The Process</span>
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mt-1 mb-3">Your Path to Smarter Learning</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto text-sm leading-relaxed">Three simple steps to bridge the gap between complexity and your natural understanding.</p>
          </div>
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="hidden md:block absolute top-14 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-px bg-gradient-to-r from-blue-300 via-violet-300 to-pink-300 dark:from-blue-700 dark:via-violet-700 dark:to-pink-700 z-0" />
            {steps.map((s) => (
              <div key={s.label} className={`gradient-card ${s.glow}`}>
                <div className={`h-1.5 w-full bg-gradient-to-r ${s.gradient}`} />
                <div className="p-8 flex flex-col items-center text-center flex-1">
                  <div className="relative mb-6 z-10">
                    <svg className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${s.gradient} text-white p-3 shadow-lg`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      {s.step === '01' ? (
                        <><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></>
                      ) : s.step === '02' ? (
                        <><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></>
                      ) : (
                        <><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></>
                      )}
                    </svg>
                    <span className={`absolute -top-2 -right-2 w-6 h-6 rounded-full text-[10px] font-black flex items-center justify-center shadow ${s.pill}`}>{s.step}</span>
                  </div>
                  <h3 className="font-extrabold text-gray-800 dark:text-white text-lg mb-2">{s.label}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* VARK Framework */}
      <section id="vark" className="py-24 px-6 bg-white dark:bg-gray-900 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start justify-between mb-14 flex-wrap gap-4">
            <div>
              <span className="section-pill">Our Framework</span>
              <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mt-1 leading-tight">The VARK Framework</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-lg text-sm leading-relaxed">We don't all process information the same way. Understanding your VARK type is the first step to transforming how you learn.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {varkTypes.map((v) => (
              <div key={v.type} className={`group relative rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl ${v.glow} transition-all duration-300 hover:-translate-y-2 flex flex-col`}>
                <div className={`relative h-36 bg-gradient-to-br ${v.color} flex items-center justify-center overflow-hidden`}>
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="absolute text-[7rem] font-black text-white/10 select-none leading-none">{v.type[0]}</span>
                  <svg className="relative z-10 w-12 h-12 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    {v.type === 'Visual' ? (
                      <><circle cx="12" cy="12" r="3" /><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" /></>
                    ) : v.type === 'Auditory' ? (
                      <><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></>
                    ) : v.type === 'Read/Write' ? (
                      <><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" /></>
                    ) : (
                      <><path d="M18 8h1a4 4 0 010 8h-1" /><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" /></>
                    )}
                  </svg>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <span className={`self-start vark-badge mb-3 ${v.badge}`}>{v.type}</span>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed flex-1">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Features */}
      <section id="features" className="py-24 px-6 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="section-pill">Platform Features</span>
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mt-1 mb-3">Everything You Need to Excel</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto text-sm leading-relaxed">Built with the latest in pedagogical science and AI technology to provide a seamless learning experience.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className={`gradient-card ${f.glow}`}>
                <div className={`gradient-bar ${f.bar}`} />
                <div className="p-6">
                  <div className={`gradient-icon bg-gradient-to-br ${f.gradient} mb-5`}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      {f.title === 'VARK Assessment' ? (
                        <><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></>
                      ) : f.title === 'AI Content Weaver' ? (
                        <><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></>
                      ) : f.title === 'Retention Analytics' ? (
                        <><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></>
                      ) : f.title === 'Smart Recommendations' ? (
                        <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></>
                      ) : f.title === 'Collaborative Study' ? (
                        <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></>
                      ) : (
                        <><path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" /></>
                      )}
                    </svg>
                  </div>
                  <h3 className="font-extrabold text-gray-800 dark:text-white text-base mb-2">{f.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Testimonials */}
      <section className="py-20 px-6 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">Trusted by Students Worldwide</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Real stories from learners who transitioned from struggling to thriving.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-2xl p-6 shadow-card">
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-5">{t.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-white font-bold text-sm">{t.name[0]}</div>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA */}
      <section className="py-20 px-6 bg-brand">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Unlock Your Hidden Potential?</h2>
          <p className="text-blue-100 text-sm mb-8 max-w-lg mx-auto">Join thousands of students who have discovered their perfect way to learn. It only takes 5 minutes to start.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/register" className="bg-white text-brand font-bold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors text-sm">
              Take the VARK Quiz Now
            </Link>
            <a href="#how-it-works" className="bg-white/20 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/30 transition-colors text-sm">
              Learn More
            </a>
          </div>
          <div className="flex items-center justify-center gap-6 mt-6 text-xs text-blue-200">
            <span>&check; No Credit Card Required</span>
            <span>&check; Scientifically Researched</span>
            <span>&check; AI-Powered Results</span>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                </div>
                <span className="font-bold text-gray-800 dark:text-white">Brainify</span>
              </Link>
              <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed max-w-xs">Brainify uses AI to bridge the gap between teaching methods and your natural learning tendency.</p>
            </div>
            {[
              { heading: 'Platform', links: ['VARK Assessment', 'Courses', 'AI Personalization'] },
              { heading: 'Resources', links: ['Learning Science', 'Success Stories', 'Study Guide'] },
              { heading: 'Connect', links: ['Help Center', 'Privacy Policy', 'Contact Us'] },
            ].map((col) => (
              <div key={col.heading}>
                <p className="font-semibold text-gray-800 dark:text-white text-sm mb-3">{col.heading}</p>
                <ul className="space-y-2">{col.links.map((l) => (<li key={l}><a href="#" className="text-xs text-gray-400 hover:text-brand transition-colors">{l}</a></li>))}</ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 dark:border-gray-700 pt-6 flex items-center justify-between flex-wrap gap-3">
            <p className="text-xs text-gray-400 dark:text-gray-500">&copy; 2026 Brainify. All rights reserved.</p>
            <div className="flex gap-4 text-xs text-gray-400">
              <a href="#" className="hover:text-brand transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-brand transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-brand transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}