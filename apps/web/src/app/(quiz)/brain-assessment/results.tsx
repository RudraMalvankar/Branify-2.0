'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { type BrainResult } from '@brainify/shared/data/brainQuestions';
import { brainRecommendations, brainTypeDescriptions } from '@brainify/shared/data/brainRecommendations';

interface BrainResultsProps {
  result: BrainResult;
  onRetake: () => void;
}

const celebrationEmojis = ['🧠', '✨', '🌟', '💫', '🎊', '🏆', '👏', '⚡'];

function BrainGauge({ leftPercent, rightPercent, dominance }: { leftPercent: number; rightPercent: number; dominance: string }) {
  const isBalanced = dominance === 'Balanced Brain';
  return (
    <div className="relative py-6">
      {/* Gauge bar */}
      <div className="relative h-6 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-blue-400 rounded-l-full"
          initial={{ width: '50%' }}
          animate={{ width: `${leftPercent}%` }}
          transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
        />
        <motion.div
          className="absolute inset-y-0 right-0 bg-gradient-to-l from-purple-500 to-purple-400 rounded-r-full"
          initial={{ width: '50%' }}
          animate={{ width: `${rightPercent}%` }}
          transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
        />
        {/* Center divider */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-0.5 h-8 bg-white/80 dark:bg-gray-300/80 shadow-sm" />
        </div>
      </div>

      {/* Labels */}
      <div className="flex items-center justify-between mt-3">
        <div className="text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-2xl font-extrabold text-blue-600 dark:text-blue-300"
          >
            {leftPercent}%
          </motion.span>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Left Brain</p>
        </div>
        {isBalanced && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, type: 'spring' }}
            className="text-center"
          >
            <span className="text-lg">⚖️</span>
            <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">BALANCED</p>
          </motion.div>
        )}
        <div className="text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="text-2xl font-extrabold text-purple-600 dark:text-purple-300"
          >
            {rightPercent}%
          </motion.span>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Right Brain</p>
        </div>
      </div>
    </div>
  );
}

export default function BrainResults({ result, onRetake }: BrainResultsProps) {
  const { dominance, total, leftPercent, rightPercent } = result;
  const typeInfo = brainTypeDescriptions[dominance];
  const recs = brainRecommendations[dominance];

  return (
    <div className="min-h-screen bg-[#F5F7FF] dark:bg-gray-900">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`bg-gradient-to-br ${typeInfo.gradient} px-6 pt-16 pb-28 text-center relative overflow-hidden`}
      >
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
        <div className="relative z-10 max-w-lg mx-auto">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.2 }}
            className="text-7xl mb-4"
          >
            {typeInfo.emoji}
          </motion.div>
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="inline-flex items-center gap-1 bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3"
          >
            🧠 BRAIN DOMINANCE PROFILE
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-3xl sm:text-4xl font-extrabold text-white mb-1"
          >
            {dominance}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-blue-100/80 text-sm"
          >
            {recs.subtitle}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-blue-100 text-sm leading-relaxed mt-3 max-w-sm mx-auto"
          >
            {recs.description}
          </motion.p>
        </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 -mt-16 relative z-10 space-y-6 pb-12">
        {/* 1. Brain Gauge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl p-6 sm:p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Brain Dominance Gauge</h2>
              <p className="text-xs text-gray-400">Left Brain vs Right Brain activity</p>
            </div>
          </div>
          <BrainGauge leftPercent={leftPercent} rightPercent={rightPercent} dominance={dominance} />
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Total Questions</span>
            <span className="font-bold text-gray-900 dark:text-white">{total}</span>
          </div>
        </motion.div>

        {/* 2. Strengths */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl p-6 sm:p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Your Strengths</h3>
              <p className="text-xs text-gray-400">Cognitive advantages of your brain profile</p>
            </div>
          </div>
          <ul className="space-y-3">
            {recs.strengths.map((strength, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                className="flex items-start gap-3"
              >
                <span className={`w-6 h-6 rounded-full bg-gradient-to-br ${typeInfo.gradient} text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  {i + 1}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{strength}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* 3. Challenges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl p-6 sm:p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Growth Areas</h3>
              <p className="text-xs text-gray-400">Challenges to be aware of</p>
            </div>
          </div>
          <ul className="space-y-3">
            {recs.challenges.map((challenge, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.08 }}
                className="flex items-start gap-3"
              >
                <span className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{challenge}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* 4. Study Strategies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl p-6 sm:p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Study Strategies</h3>
              <p className="text-xs text-gray-400">Optimized for your brain type</p>
            </div>
          </div>
          <ul className="space-y-3">
            {recs.studyStrategies.map((strategy, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.08 }}
                className="flex items-start gap-3"
              >
                <span className={`w-6 h-6 rounded-full bg-gradient-to-br ${typeInfo.gradient} text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  {i + 1}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{strategy}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* 5. AI Adaptation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden"
        >
          <div className={`h-2 w-full bg-gradient-to-r ${typeInfo.gradient}`} />
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">AI Study Buddy Adaptation</h3>
                <p className="text-xs text-gray-400">How Brainify AI adapts to your brain type</p>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{typeInfo.emoji}</span>
                <span className="font-bold text-gray-800 dark:text-white text-sm">{dominance} Mode</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{recs.aiAdaptation}</p>
            </div>
          </div>
        </motion.div>

        {/* 6. Career Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl p-6 sm:p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Career Suggestions</h3>
              <p className="text-xs text-gray-400">Career paths aligned with your brain profile</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {recs.careers.map((career, i) => (
              <motion.div
                key={career}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + i * 0.05 }}
                className="bg-gray-50 dark:bg-gray-700/30 rounded-xl px-3 py-2.5 text-center border border-gray-100 dark:border-gray-700"
              >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{career}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 7. Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <motion.button onClick={onRetake} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="btn-secondary text-sm py-3 w-full sm:w-auto flex items-center justify-center gap-2">
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