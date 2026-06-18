import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-brand p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full translate-y-1/3 -translate-x-1/4" />
        <Link href="/" className="flex items-center gap-2 z-10">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
          </div>
          <span className="font-bold text-white text-lg">Brainify</span>
        </Link>
        <div className="z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <span>🤖</span> AI-Powered Personalization
          </div>
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-6">
            The smarter way to<br /><span className="text-blue-200">master</span> any subject.
          </h2>
          <p className="text-blue-100 text-sm mb-8">Free, personalised learning — built for every student in India, regardless of school or background. 🌟</p>
          <div className="space-y-3">
            {[
              'Personalized Study Paths — Tailored to your VARK profile.',
              'Real-time Analytics — Track your retention and growth.',
              'Expert Support — Teacher-led interventions when needed.',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 bg-white/10 rounded-xl p-3">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-white text-xs flex-shrink-0 mt-0.5">✓</div>
                <span className="text-white/90 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-blue-200 text-xs z-10">© 2026 Brainify AI Education</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 bg-white dark:bg-gray-900 relative">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-brand transition-colors mb-8">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            Back to Home
          </Link>

          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
            </div>
            <span className="font-bold text-gray-800 dark:text-white text-lg">Brainify</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Welcome Back!</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">Sign in to your student account to continue learning.</p>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </span>
                <input
                  type="text"
                  className="input-field pl-10"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                <a href="#" className="text-xs text-brand hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </span>
                <input
                  type="password"
                  className="input-field pl-10"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn-primary w-full text-center py-3.5 mt-2 flex items-center justify-center gap-2">
              Sign In <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-600" /></div>
            <div className="relative flex justify-center"><span className="bg-white dark:bg-gray-900 px-3 text-xs text-gray-400">OR CONTINUE WITH</span></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-600 rounded-xl py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-600 rounded-xl py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
              GitHub
            </button>
          </div>

          <p className="text-center text-gray-500 dark:text-gray-400 mt-6 text-sm">
            Don't have an account?{' '}
            <Link href="/register" className="text-brand font-semibold hover:underline">Sign up for free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}