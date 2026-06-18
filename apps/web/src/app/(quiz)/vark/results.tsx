'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { type VarkResult, varkStyleDescriptions } from '@brainify/shared/data/varkQuestions';
import { varkRecommendations, multimodalDescription } from '@brainify/shared/data/varkRecommendations';

interface ResultsDisplayProps {
  result: VarkResult;
  onRetake: () => void;
}

const styleConfig: Record<string, { gradient: string; icon: string; color: string; bar: string; lightBg: string; badge: string }> = {
  Visual: {
    gradient: 'from-blue-600 to-indigo-700',
    icon: '👁️',
    color: 'text-blue-600 dark:text-blue-300',
    bar: 'bg-gradient-to-r from-blue-500 to-indigo-600',
    lightBg: 'bg-blue-50 dark:bg-blue-900/20',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  },
  Aural: {
    gradient: 'from-pink-500 to-rose-600',
    icon: '👂',
    color: 'text-pink-600 dark:text-pink-300',
    bar: 'bg-gradient-to-r from-pink-500 to-rose-600',
    lightBg: 'bg-pink-50 dark:bg-pink-900/20',
    badge: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
  },
  'Read/Write': {
    gradient: 'from-cyan-500 to-teal-600',
    icon: '📖',
    color: 'text-cyan-600 dark:text-cyan-300',
    bar: 'bg-gradient-to-r from-cyan-500 to-teal-600',
    lightBg: 'bg-cyan-50 dark:bg-cyan-900/20',
    badge: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
  },
  Kinesthetic: {
    gradient: 'from-purple-500 to-violet-600',
    icon: '🖐️',
    color: 'text-purple-600 dark:text-purple-300',
    bar: 'bg-gradient-to-r from-purple-500 to-violet-600',
    lightBg: 'bg-purple-50 dark:bg-purple-900/20',
    badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  },
};

const celebrationEmojis = ['🎉', '✨', '🌟', '💫', '🎊', '🏆', '👏', '🎯'];

function ScoreBar({ label, score, total, config, index, isDominant }: { label: string; score: number; total: number; config: typeof styleConfig[keyof typeof styleConfig]; index: number; isDominant: boolean }) {
  const percent = total > 0 ? (score / total) * 100 : 0;
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 + index * 0.12, duration: 0.4 }}
      className="flex items-center gap-3 sm:gap-4"
    >
      <span className="text-xl sm:text-2xl flex-shrink-0">{config.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{label}</span>
            {isDominant && (
              <span className="text-[9px] font-bold text-brand bg-brand-50 dark:bg-brand/10 px-1.5 py-0.5 rounded-full">PRIMARY</span>
            )}
          </div>
          <span className="text-sm font-bold text-gray-900 dark:text-white">{score}</span>
        </div>
        <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${config.bar}`}
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ delay: 0.5 + index * 0.12, duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>
    </motion.div>
  );
}

function getSecondaryStyle(result: VarkResult): { label: string; score: number; config: typeof styleConfig[keyof typeof styleConfig] } | null {
  const styles = [
    { label: 'Visual', score: result.visual, config: styleConfig['Visual'] },
    { label: 'Aural', score: result.aural, config: styleConfig['Aural'] },
    { label: 'Read/Write', score: result.readWrite, config: styleConfig['Read/Write'] },
    { label: 'Kinesthetic', score: result.kinesthetic, config: styleConfig['Kinesthetic'] },
  ].filter((s) => s.label !== result.dominantStyle).sort((a, b) => b.score - a.score);
  return styles[0] || null;
}

function isMultimodal(result: VarkResult): boolean {
  const scores = [result.visual, result.aural, result.readWrite, result.kinesthetic];
  const max = Math.max(...scores);
  const closeCount = scores.filter((s) => s >= max - 2).length;
  return closeCount >= 3;
}

export default function ResultsDisplay({ result, onRetake }: ResultsDisplayProps) {
  const dominant = result.dominantStyle;
  const config = styleConfig[dominant];
  const description = varkStyleDescriptions[dominant];
  const recommendations = varkRecommendations[dominant];
  const secondary = getSecondaryStyle(result);
  const multimodal = isMultimodal(result);
  const totalSelections = result.visual + result.aural + result.readWrite + result.kinesthetic;

  const allStyles = [
    { label: 'Visual', score: result.visual, config: styleConfig['Visual'] },
    { label: 'Aural', score: result.aural, config: styleConfig['Aural'] },
    { label: 'Read/Write', score: result.readWrite, config: styleConfig['Read/Write'] },
    { label: 'Kinesthetic', score: result.kinesthetic, config: styleConfig['Kinesthetic'] },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FF] dark:bg-gray-900">
      {/* ===== HERO BANNER ===== */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`bg-gradient-to-br ${config.gradient} px-6 pt-16 pb-28 text-center relative overflow-hidden`}
      >
        {/* Floating celebration */}
        <div className="absolute inset-0 pointer-events-none">
          {celebrationEmojis.map((emoji, i) => (
            <motion.span
              key={i}
              className="absolute text-xl sm:text-2xl"
              initial={{ opacity: 0, y: 40 }}
              animate={{
                opacity: [0, 1, 1, 0],
                y: [-20, -80 - Math.random() * 60],
                x: [0, (i % 2 === 0 ? 1 : -1) * (20 + Math.random() * 40)],
              }}
              transition={{ duration: 2 + Math.random(), delay: 0.5 + i * 0.2, repeat: Infinity, repeatDelay: 1 + Math.random() }}
              style={{ left: `${10 + (i * 12) % 80}%`, top: `${20 + (i * 8) % 60}%` }}
            >
              {emoji}
            </motion.span>
          ))}
        </div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0di00aDR2NGgtNHptMC02di00aDR2NGgtNHptNiA2di00aDR2NGgtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20" />
        <div className="relative z-10 max-w-lg mx-auto">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.2 }}
            className="text-7xl mb-4"
          >
            {config.icon}
          </motion.div>
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="inline-flex items-center gap-1 bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3"
          >
            {multimodal ? '🌟 MULTIMODAL LEARNER PROFILE' : '🎯 YOUR LEARNING STYLE PROFILE'}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-4xl sm:text-5xl font-extrabold text-white mb-2"
          >
            {dominant}
          </motion.h1>
          {secondary && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-blue-100/80 text-sm"
            >
              Secondary: <span className="font-semibold text-white">{secondary.label}</span>
            </motion.p>
          )}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-blue-100 text-sm leading-relaxed mt-3 max-w-sm mx-auto"
          >
            {description.desc}
          </motion.p>
        </div>
      </motion.div>

      {/* ===== CONTENT ===== */}
      <div className="max-w-4xl mx-auto px-4 -mt-16 relative z-10 space-y-6 pb-12">
        {/* 1. LEARNING DNA SUMMARY */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden"
        >
          <div className={`h-2 w-full bg-gradient-to-r ${config.bar}`} />
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand to-brand-light flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Your Learning DNA</h2>
                <p className="text-xs text-gray-400">Based on {totalSelections} selections across 16 scenarios</p>
              </div>
            </div>
            {multimodal && (
              <div className={`${config.lightBg} rounded-2xl p-4 mb-5 border border-gray-100 dark:border-gray-700`}>
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">🧬</span>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-sm">{multimodalDescription.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{multimodalDescription.desc}</p>
                  </div>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {allStyles.map((s, idx) => (
                <div key={s.label} className={`rounded-2xl p-4 border ${s.label === dominant ? `${s.config.lightBg} border-brand/20` : 'bg-gray-50 dark:bg-gray-700/30 border-gray-100 dark:border-gray-700'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{s.config.icon}</span>
                    <span className="font-semibold text-gray-800 dark:text-white text-sm">{s.label}</span>
                    {s.label === dominant && <span className="text-[9px] font-bold text-brand bg-brand-50 dark:bg-brand/10 px-1.5 py-0.5 rounded-full">PRIMARY</span>}
                    {s.label === secondary?.label && <span className="text-[9px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded-full">SECONDARY</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${s.config.bar}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${totalSelections > 0 ? (s.score / totalSelections) * 100 : 0}%` }}
                        transition={{ delay: 0.6 + idx * 0.1, duration: 0.6 }}
                      />
                    </div>
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300 w-6 text-right">{s.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 2. SCORE BREAKDOWN */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl p-6 sm:p-8"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">VARK Score Breakdown</h3>
          <div className="space-y-5">
            {allStyles.map((s, idx) => (
              <ScoreBar key={s.label} label={s.label} score={s.score} total={totalSelections} config={s.config} index={idx} isDominant={s.label === dominant} />
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-sm"
          >
            <span className="text-gray-500 dark:text-gray-400">Total Selections</span>
            <span className="font-bold text-gray-900 dark:text-white">{totalSelections}</span>
          </motion.div>
        </motion.div>

        {/* 3. STUDY RECOMMENDATIONS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl p-6 sm:p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Personalized Study Tips</h3>
              <p className="text-xs text-gray-400">Optimized for your {dominant} learning style</p>
            </div>
          </div>
          <ul className="space-y-3">
            {recommendations.studyTips.map((tip, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.08 }}
                className="flex items-start gap-3"
              >
                <span className={`w-6 h-6 rounded-full bg-gradient-to-br ${config.gradient} text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  {i + 1}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{tip}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* 4. AI ADAPTATION PREVIEW */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden"
        >
          <div className={`h-2 w-full bg-gradient-to-r from-violet-500 to-purple-600`} />
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">AI Study Buddy Adaptation</h3>
                <p className="text-xs text-gray-400">How Brainify AI will teach you</p>
              </div>
            </div>
            <div className={`${config.lightBg} rounded-2xl p-5 border border-gray-100 dark:border-gray-700`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{config.icon}</span>
                <span className="font-bold text-gray-800 dark:text-white text-sm">{dominant}-Adapted Mode</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{recommendations.aiAdaptation}</p>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
              <svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>Your AI Study Buddy will adapt all explanations to your learning style automatically</span>
            </div>
          </div>
        </motion.div>

        {/* 5. CAREER STRENGTHS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl p-6 sm:p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Career & Learning Strengths</h3>
              <p className="text-xs text-gray-400">Potential career paths aligned with your style</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {recommendations.careers.map((career, i) => (
              <motion.div
                key={career}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + i * 0.05 }}
                className={`${config.lightBg} rounded-xl px-3 py-2.5 text-center border border-gray-100 dark:border-gray-700`}
              >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{career}</span>
              </motion.div>
            ))}
          </div>
          <div className="mt-5">
            <h4 className="text-sm font-bold text-gray-800 dark:text-white mb-3">Improvement Activities</h4>
            <ul className="space-y-2">
              {recommendations.improvementActivities.map((activity, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + i * 0.08 }}
                  className="flex items-start gap-2"
                >
                  <span className="text-brand text-sm flex-shrink-0">▸</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{activity}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* 6. OTHER STYLES */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 px-1">Explore Other Learning Styles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {allStyles.filter((s) => s.label !== dominant).map((s, idx) => {
              const cfg = styleConfig[s.label];
              const desc = varkStyleDescriptions[s.label];
              return (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + idx * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 hover:shadow-md transition-all duration-200"
                >
                  <span className="text-2xl block mb-2">{cfg.icon}</span>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{s.label}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-3 line-clamp-2">{desc.desc}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400 dark:text-gray-500">Score</span>
                    <span className={`font-bold ${cfg.color}`}>{s.score}</span>
                  </div>
                  <div className="mt-2 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${cfg.bar}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${totalSelections > 0 ? (s.score / totalSelections) * 100 : 0}%` }}
                      transition={{ delay: 1.2 + idx * 0.1, duration: 0.6 }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* 7. ACTIONS */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <motion.button
            onClick={onRetake}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-secondary text-sm py-3 w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582a7.5 7.5 0 0110.862-2.55M4 20v-5h.582a7.5 7.5 0 0010.862 2.55" /><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M17.5 17.5l3.5-3.5-3.5-3.5" /></svg>
            Retake Assessment
          </motion.button>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
            <Link href="/dashboard" className="btn-primary text-sm py-3 w-full sm:w-auto flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              Go to Dashboard
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}