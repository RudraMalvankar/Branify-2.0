'use client';

import Link from 'next/link';
import { type VarkResult, varkStyleDescriptions } from '@brainify/shared/data/varkQuestions';

interface ResultsDisplayProps {
  result: VarkResult;
  onRetake: () => void;
}

const styleConfig: Record<string, { gradient: string; lightBg: string; icon: string; color: string; bar: string }> = {
  Visual: {
    gradient: 'from-blue-600 to-indigo-700',
    lightBg: 'from-blue-500/20 to-indigo-500/10',
    icon: '👁️',
    color: 'text-blue-600 dark:text-blue-300',
    bar: 'bg-gradient-to-r from-blue-500 to-indigo-600',
  },
  Aural: {
    gradient: 'from-pink-500 to-rose-600',
    lightBg: 'from-pink-500/20 to-rose-500/10',
    icon: '👂',
    color: 'text-pink-600 dark:text-pink-300',
    bar: 'bg-gradient-to-r from-pink-500 to-rose-600',
  },
  'Read/Write': {
    gradient: 'from-cyan-500 to-teal-600',
    lightBg: 'from-cyan-500/20 to-teal-500/10',
    icon: '📖',
    color: 'text-cyan-600 dark:text-cyan-300',
    bar: 'bg-gradient-to-r from-cyan-500 to-teal-600',
  },
  Kinesthetic: {
    gradient: 'from-purple-500 to-violet-600',
    lightBg: 'from-purple-500/20 to-violet-500/10',
    icon: '🖐️',
    color: 'text-purple-600 dark:text-purple-300',
    bar: 'bg-gradient-to-r from-purple-500 to-violet-600',
  },
};

function ScoreBar({ label, score, total, config }: { label: string; score: number; total: number; config: typeof styleConfig[keyof typeof styleConfig] }) {
  const percent = (score / total) * 100;
  return (
    <div className="flex items-center gap-3">
      <span className="text-lg flex-shrink-0">{config.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{label}</span>
          <span className="text-sm font-bold text-gray-900 dark:text-white">{score}/{total}</span>
        </div>
        <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${config.bar}`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default function ResultsDisplay({ result, onRetake }: ResultsDisplayProps) {
  const dominant = result.dominantStyle;
  const config = styleConfig[dominant];
  const description = varkStyleDescriptions[dominant];

  const allStyles = [
    { label: 'Visual', score: result.visual, config: styleConfig['Visual'] },
    { label: 'Aural', score: result.aural, config: styleConfig['Aural'] },
    { label: 'Read/Write', score: result.readWrite, config: styleConfig['Read/Write'] },
    { label: 'Kinesthetic', score: result.kinesthetic, config: styleConfig['Kinesthetic'] },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FF] dark:bg-gray-900">
      {/* Hero result banner */}
      <div className={`bg-gradient-to-br ${config.gradient} px-6 pt-16 pb-24 text-center relative overflow-hidden`}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzR2LTRoNHY0aC00em0wLTZ2LTRoNHY0aC00em02IDZ2LTRoNHY0aC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
        <div className="relative z-10 max-w-md mx-auto">
          <div className="text-7xl mb-4 animate-bounce" style={{ animationDuration: '1.5s' }}>{config.icon}</div>
          <span className="inline-flex items-center gap-1 bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
            YOUR DOMINANT LEARNING STYLE
          </span>
          <h1 className="text-4xl font-extrabold text-white mb-2">{dominant}</h1>
          <p className="text-blue-100 text-sm leading-relaxed">{description.desc}</p>
        </div>
      </div>

      {/* Score breakdown */}
      <div className="max-w-3xl mx-auto px-4 -mt-12 relative z-10">
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl p-8 mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Your VARK Score Breakdown</h3>
          <div className="space-y-5">
            {allStyles.map((s) => (
              <ScoreBar key={s.label} label={s.label} score={s.score} total={result.total} config={s.config} />
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Total Questions</span>
            <span className="font-bold text-gray-900 dark:text-white">{result.total}</span>
          </div>
        </div>

        {/* Learning style detail card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl p-8 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-2xl">{config.icon}</span>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">About {dominant} Learners</h3>
              <p className={`text-xs font-semibold ${config.color}`}>Your Personalized Insights</p>
            </div>
          </div>
          <ul className="space-y-3">
            {description.strengths.map((strength, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className={`w-5 h-5 rounded-full bg-gradient-to-br ${config.gradient} text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  {i + 1}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-300">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Learning style cards */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 px-1">Explore Other Learning Styles</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {allStyles.filter((s) => s.label !== dominant).map((s) => {
            const cfg = styleConfig[s.label];
            const desc = varkStyleDescriptions[s.label];
            return (
              <div key={s.label} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 hover:shadow-md transition-all duration-200">
                <span className="text-2xl block mb-2">{cfg.icon}</span>
                <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{s.label}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-3">{desc.desc.slice(0, 100)}...</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400 dark:text-gray-500">Score</span>
                  <span className={`font-bold ${cfg.color}`}>{s.score}/{result.total}</span>
                </div>
                <div className="mt-2 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${cfg.bar}`} style={{ width: `${(s.score / result.total) * 100}%` }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-10 px-1">
          <button onClick={onRetake} className="btn-secondary text-sm py-3 w-full sm:w-auto flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582a7.5 7.5 0 0110.862-2.55M4 20v-5h.582a7.5 7.5 0 0010.862 2.55" /><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M17.5 17.5l3.5-3.5-3.5-3.5" /></svg>
            Retake Assessment
          </button>
          <Link href="/dashboard" className="btn-primary text-sm py-3 w-full sm:w-auto flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}