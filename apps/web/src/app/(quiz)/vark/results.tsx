'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
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

const celebrationEmojis = ['🎉', '✨', '🌟', '💫', '🎊', '🏆', '👏', '🎯'];

function ScoreBar({ label, score, total, config, index }: { label: string; score: number; total: number; config: typeof styleConfig[keyof typeof styleConfig]; index: number }) {
  const percent = (score / total) * 100;
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 + index * 0.15, duration: 0.4 }}
      className="flex items-center gap-3"
    >
      <span className="text-lg flex-shrink-0">{config.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{label}</span>
          <span className="text-sm font-bold text-gray-900 dark:text-white">{score}/{total}</span>
        </div>
        <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${config.bar}`}
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ delay: 0.5 + index * 0.15, duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>
    </motion.div>
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

  const maxScore = Math.max(result.visual, result.aural, result.readWrite, result.kinesthetic);
  const isStrongDominance = maxScore >= 8;

  return (
    <div className="min-h-screen bg-[#F5F7FF] dark:bg-gray-900">
      {/* Hero result banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`bg-gradient-to-br ${config.gradient} px-6 pt-16 pb-24 text-center relative overflow-hidden`}
      >
        {/* Floating celebration emojis */}
        <div className="absolute inset-0 pointer-events-none">
          {celebrationEmojis.map((emoji, i) => (
            <motion.span
              key={i}
              className="absolute text-xl sm:text-2xl"
              initial={{ opacity: 0, y: 40, x: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                y: [-20, -80 - Math.random() * 60],
                x: [0, (i % 2 === 0 ? 1 : -1) * (20 + Math.random() * 40)],
              }}
              transition={{
                duration: 2 + Math.random(),
                delay: 0.5 + i * 0.2,
                repeat: Infinity,
                repeatDelay: 1 + Math.random(),
              }}
              style={{
                left: `${10 + (i * 12) % 80}%`,
                top: `${20 + (i * 8) % 60}%`,
              }}
            >
              {emoji}
            </motion.span>
          ))}
        </div>

        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzR2LTRoNHY0aC00em0wLTZ2LTRoNHY0aC00em02IDZ2LTRoNHY0aC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
        <div className="relative z-10 max-w-md mx-auto">
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
            {isStrongDominance ? '⭐ STRONG DOMINANT LEARNING STYLE' : '🎯 YOUR DOMINANT LEARNING STYLE'}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-4xl font-extrabold text-white mb-2"
          >
            {dominant}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-blue-100 text-sm leading-relaxed"
          >
            {description.desc}
          </motion.p>
        </div>
      </motion.div>

      {/* Score breakdown */}
      <div className="max-w-3xl mx-auto px-4 -mt-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl p-8 mb-6"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Your VARK Score Breakdown</h3>
          <div className="space-y-5">
            {allStyles.map((s, idx) => (
              <ScoreBar key={s.label} label={s.label} score={s.score} total={result.total} config={s.config} index={idx} />
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-sm"
          >
            <span className="text-gray-500 dark:text-gray-400">Total Questions</span>
            <span className="font-bold text-gray-900 dark:text-white">{result.total}</span>
          </motion.div>
        </motion.div>

        {/* Learning style detail card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl p-8 mb-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <span className="text-2xl">{config.icon}</span>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">About {dominant} Learners</h3>
              <p className={`text-xs font-semibold ${config.color}`}>Your Personalized Insights</p>
            </div>
          </div>
          <ul className="space-y-3">
            {description.strengths.map((strength, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className="flex items-start gap-3"
              >
                <span className={`w-5 h-5 rounded-full bg-gradient-to-br ${config.gradient} text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  {i + 1}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-300">{strength}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Learning style cards */}
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-lg font-bold text-gray-900 dark:text-white mb-4 px-1"
        >
          Explore Other Learning Styles
        </motion.h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {allStyles.filter((s) => s.label !== dominant).map((s, idx) => {
            const cfg = styleConfig[s.label];
            const desc = varkStyleDescriptions[s.label];
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + idx * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 hover:shadow-md transition-all duration-200"
              >
                <span className="text-2xl block mb-2">{cfg.icon}</span>
                <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{s.label}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-3">{desc.desc.slice(0, 100)}...</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400 dark:text-gray-500">Score</span>
                  <span className={`font-bold ${cfg.color}`}>{s.score}/{result.total}</span>
                </div>
                <div className="mt-2 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${cfg.bar}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(s.score / result.total) * 100}%` }}
                    transition={{ delay: 1.1 + idx * 0.1, duration: 0.6 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-10 px-1">
          <motion.button
            onClick={onRetake}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-secondary text-sm py-3 w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582a7.5 7.5 0 0110.862-2.55M4 20v-5h.582a7.5 7.5 0 0010.862 2.55" /><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M17.5 17.5l3.5-3.5-3.5-3.5" /></svg>
            Retake Assessment
          </motion.button>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
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