'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { type VarkResult } from '@brainify/shared/data/varkQuestions';
import { type BrainResult } from '@brainify/shared/data/brainQuestions';
import { brainTypeDescriptions } from '@brainify/shared/data/brainRecommendations';
import { generateLearningDNA, type LearningPersona } from '@brainify/shared/data/learningPersona';

const celebrationEmojis = ['🧬', '✨', '🌟', '💫', '🎊', '🏆', '👏', '⚡'];

const varkStyleConfig: Record<string, { gradient: string; icon: string; color: string; bar: string }> = {
  Visual: { gradient: 'from-blue-600 to-indigo-700', icon: '👁️', color: 'text-blue-600 dark:text-blue-300', bar: 'bg-gradient-to-r from-blue-500 to-indigo-600' },
  Aural: { gradient: 'from-pink-500 to-rose-600', icon: '👂', color: 'text-pink-600 dark:text-pink-300', bar: 'bg-gradient-to-r from-pink-500 to-rose-600' },
  'Read/Write': { gradient: 'from-cyan-500 to-teal-600', icon: '📖', color: 'text-cyan-600 dark:text-cyan-300', bar: 'bg-gradient-to-r from-cyan-500 to-teal-600' },
  Kinesthetic: { gradient: 'from-purple-500 to-violet-600', icon: '🖐️', color: 'text-purple-600 dark:text-purple-300', bar: 'bg-gradient-to-r from-purple-500 to-violet-600' },
};

export default function AssessmentResultsPage() {
  const [varkResult, setVarkResult] = useState<VarkResult | null>(null);
  const [brainResult, setBrainResult] = useState<BrainResult | null>(null);
  const [dna, setDna] = useState<{
    primaryLearningStyle: string;
    secondaryLearningStyle: string | null;
    brainType: string;
    combinedPersona: LearningPersona;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Read results from sessionStorage
    const varkData = sessionStorage.getItem('varkResult');
    const brainData = sessionStorage.getItem('brainResult');

    if (!varkData || !brainData) {
      setLoading(false);
      return;
    }

    const vark: VarkResult = JSON.parse(varkData);
    const brain: BrainResult = JSON.parse(brainData);
    setVarkResult(vark);
    setBrainResult(brain);

    const learningDNA = generateLearningDNA(vark, brain);
    setDna(learningDNA);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FF] dark:bg-gray-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-brand/20 border-t-brand rounded-full"
        />
      </div>
    );
  }

  if (!varkResult || !brainResult || !dna) {
    return (
      <div className="min-h-screen bg-[#F5F7FF] dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <span className="text-6xl block mb-4">🧬</span>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Assessment Data Found</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Please complete both assessments to see your Learning DNA report.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/vark" className="btn-primary text-sm py-3 px-6">
              Take VARK Assessment
            </Link>
            <Link href="/" className="btn-secondary text-sm py-3 px-6">
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const persona = dna.combinedPersona;
  const varkConfig = varkStyleConfig[varkResult.dominantStyle] || varkStyleConfig['Visual'];
  const brainTypeInfo = brainTypeDescriptions[brainResult.dominance] || { emoji: '🧠', color: 'text-blue-600', gradient: 'from-blue-600 to-indigo-700' };

  const varkScores = [
    { label: 'Visual', score: varkResult.visual },
    { label: 'Aural', score: varkResult.aural },
    { label: 'Read/Write', score: varkResult.readWrite },
    { label: 'Kinesthetic', score: varkResult.kinesthetic },
  ];
  const total = varkScores.reduce((acc, s) => acc + s.score, 0);

  return (
    <div className="min-h-screen bg-[#F5F7FF] dark:bg-gray-900">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-brand via-indigo-700 to-purple-800 px-6 pt-20 pb-32 text-center relative overflow-hidden"
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
            {persona.personaEmoji}
          </motion.div>
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="inline-flex items-center gap-1 bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3"
          >
            🧬 YOUR LEARNING DNA PROFILE
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-3xl sm:text-5xl font-extrabold text-white mb-2"
          >
            {persona.personaName}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-blue-100/80 text-sm"
          >
            {persona.personalityTrait}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-blue-100 text-sm leading-relaxed mt-3 max-w-sm mx-auto"
          >
            {persona.personaDescription}
          </motion.p>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 -mt-20 relative z-10 space-y-6 pb-12">
        {/* 1. Profile Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg p-5 text-center">
            <span className="text-3xl block mb-2">{varkConfig.icon}</span>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1">Primary Style</p>
            <p className="font-bold text-gray-900 dark:text-white text-lg">{dna.primaryLearningStyle}</p>
            {dna.secondaryLearningStyle && (
              <p className="text-xs text-gray-400 mt-1">Secondary: {dna.secondaryLearningStyle}</p>
            )}
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg p-5 text-center">
            <span className="text-3xl block mb-2">{brainTypeInfo.emoji}</span>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1">Brain Type</p>
            <p className="font-bold text-gray-900 dark:text-white text-lg">{dna.brainType}</p>
            <p className="text-xs text-gray-400 mt-1">{persona.personalityTrait}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg p-5 text-center">
            <span className="text-3xl block mb-2">{persona.personaEmoji}</span>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1">Combined Persona</p>
            <p className="font-bold text-gray-900 dark:text-white text-lg">{persona.personaName}</p>
            <p className="text-xs text-gray-400 mt-1">Your unique learning identity</p>
          </div>
        </motion.div>

        {/* 2. VARK + Brain Scores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* VARK Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl p-6">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">VARK Profile</h3>
            <div className="space-y-3">
              {varkScores.map((s) => {
                const cfg = varkStyleConfig[s.label] || varkStyleConfig['Visual'];
                const percent = total > 0 ? (s.score / total) * 100 : 0;
                return (
                  <div key={s.label} className="flex items-center gap-2">
                    <span className="text-sm flex-shrink-0 w-5">{cfg.icon}</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-[10px] mb-0.5">
                        <span className="font-medium text-gray-600 dark:text-gray-300">{s.label}</span>
                        <span className="font-bold text-gray-900 dark:text-white">{s.score}</span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${cfg.bar}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 0.6, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Brain Gauge */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl p-6">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Brain Dominance</h3>
            <div className="relative h-8 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-blue-400 rounded-l-full"
                initial={{ width: '50%' }}
                animate={{ width: `${brainResult.leftPercent}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
              <motion.div
                className="absolute inset-y-0 right-0 bg-gradient-to-l from-purple-500 to-purple-400 rounded-r-full"
                initial={{ width: '50%' }}
                animate={{ width: `${brainResult.rightPercent}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-0.5 h-10 bg-white/60" />
              </div>
            </div>
            <div className="flex justify-between mt-3">
              <div className="text-center">
                <p className="text-lg font-extrabold text-blue-600 dark:text-blue-300">{brainResult.leftPercent}%</p>
                <p className="text-[10px] text-gray-400">Left Brain</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-extrabold text-purple-600 dark:text-purple-300">{brainResult.rightPercent}%</p>
                <p className="text-[10px] text-gray-400">Right Brain</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 3. Strengths */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl p-6 sm:p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Learning Strengths</h3>
              <p className="text-xs text-gray-400">Your combined cognitive advantages</p>
            </div>
          </div>
          <ul className="space-y-3">
            {persona.combinedStrengths.map((strength, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.08 }}
                className="flex items-start gap-3"
              >
                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-brand to-indigo-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{strength}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* 4. Growth Areas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl p-6 sm:p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Areas for Growth</h3>
              <p className="text-xs text-gray-400">Opportunities to expand your learning toolkit</p>
            </div>
          </div>
          <ul className="space-y-3">
            {persona.combinedGrowthAreas.map((area, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.08 }}
                className="flex items-start gap-3"
              >
                <span className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{area}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* 5. Study Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl p-6 sm:p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Personalized Study Recommendations</h3>
              <p className="text-xs text-gray-400">Tailored to your unique learning DNA</p>
            </div>
          </div>
          <ul className="space-y-3">
            {persona.studyRecommendations.map((rec, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.08 }}
                className="flex items-start gap-3"
              >
                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{rec}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* 6. AI Adaptation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden"
        >
          <div className="h-2 w-full bg-gradient-to-r from-brand to-purple-600" />
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand to-purple-600 flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">AI Study Buddy Adaptation</h3>
                <p className="text-xs text-gray-400">How Brainify AI will teach you</p>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{persona.personaEmoji}</span>
                <span className="font-bold text-gray-800 dark:text-white text-sm">{persona.personaName} Mode</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{persona.aiAdaptation}</p>
            </div>
          </div>
        </motion.div>

        {/* 7. Career Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl p-6 sm:p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Career Suggestions</h3>
              <p className="text-xs text-gray-400">Career paths aligned with your combined profile</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {persona.careerSuggestions.map((career, i) => (
              <motion.div
                key={career}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + i * 0.05 }}
                className="bg-gray-50 dark:bg-gray-700/30 rounded-xl px-3 py-2.5 text-center border border-gray-100 dark:border-gray-700"
              >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{career}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 8. Mindset Tip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="bg-gradient-to-br from-brand to-indigo-700 rounded-3xl p-6 sm:p-8 text-center"
        >
          <span className="text-4xl block mb-3">💡</span>
          <p className="text-white text-sm leading-relaxed max-w-lg mx-auto italic">
            &ldquo;{persona.mindsetTip}&rdquo;
          </p>
        </motion.div>

        {/* 9. Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/dashboard" className="btn-primary text-sm py-3 px-8 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            Go to Dashboard
          </Link>
          <Link href="/vark" className="btn-secondary text-sm py-3 px-8 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582a7.5 7.5 0 0110.862-2.55M4 20v-5h.582a7.5 7.5 0 0010.862 2.55" /><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M17.5 17.5l3.5-3.5-3.5-3.5" /></svg>
            Retake Assessments
          </Link>
        </div>
      </div>
    </div>
  );
}