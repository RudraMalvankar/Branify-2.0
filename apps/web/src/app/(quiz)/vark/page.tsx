'use client';

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  varkQuestions,
  calculateVarkScore,
  getMotivationalMessage,
  questionCategories,
} from '@brainify/shared/data/varkQuestions';
import { aiCompanionMessages, VARK_QUESTIONS_XP, VARK_COMPLETE_BONUS, type AiCompanionMessage } from '@brainify/shared/data/gamification';

const ESTIMATED_SECONDS_PER_QUESTION = 20;

const STYLE_CONFIG = {
  Visual: { icon: '👁️', color: 'text-blue-600 dark:text-blue-300', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  Aural: { icon: '👂', color: 'text-pink-600 dark:text-pink-300', bg: 'bg-pink-50 dark:bg-pink-900/20' },
  'Read/Write': { icon: '📖', color: 'text-cyan-600 dark:text-cyan-300', bg: 'bg-cyan-50 dark:bg-cyan-900/20' },
  Kinesthetic: { icon: '🖐️', color: 'text-purple-600 dark:text-purple-300', bg: 'bg-purple-50 dark:bg-purple-900/20' },
} as const;

type StyleKey = keyof typeof STYLE_CONFIG;

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
};

function flattenSelections(selections: Record<string, StyleKey[]>): StyleKey[] {
  return Object.values(selections).flat();
}

function getLiveTrend(selections: Record<string, StyleKey[]>): { style: StyleKey; percent: string } | null {
  const all = flattenSelections(selections);
  if (all.length === 0) return null;
  const scores: Record<string, number> = { Visual: 0, Aural: 0, 'Read/Write': 0, Kinesthetic: 0 };
  all.forEach((s) => scores[s]++);
  const sorted = (Object.entries(scores) as [string, number][]).sort((a, b) => b[1] - a[1]);
  return { style: sorted[0][0] as StyleKey, percent: `${Math.round((sorted[0][1] / all.length) * 100)}%` };
}

function getCompanionMessage(current: number, total: number): AiCompanionMessage {
  const msgs = aiCompanionMessages.vark;
  if (current === 0) return msgs.start[0];
  if (current === total - 1) return msgs.finalizing[0];
  if (current < 4) return msgs.scanning[current % msgs.scanning.length];
  if (current < 10) return msgs.analyzing[current % msgs.analyzing.length];
  return msgs.scanning[current % msgs.scanning.length];
}

export default function VarkQuizPage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selections, setSelections] = useState<Record<string, StyleKey[]>>({});
  const [selectedOptions, setSelectedOptions] = useState<StyleKey[]>([]);
  const [slideDir, setSlideDir] = useState(1);
  const [xp, setXp] = useState(0);
  const [showXpPopup, setShowXpPopup] = useState(false);

  const totalQuestions = varkQuestions.length;
  const remainingQuestions = totalQuestions - currentQuestion;
  const estimatedMinutes = Math.ceil((remainingQuestions * ESTIMATED_SECONDS_PER_QUESTION) / 60);
  const moti = getMotivationalMessage(currentQuestion);
  const trend = useMemo(() => getLiveTrend(selections), [selections]);
  const companion = getCompanionMessage(currentQuestion, totalQuestions);

  const currentRef = useRef(currentQuestion);
  const selectedRef = useRef(selectedOptions);
  const selectionsRef = useRef(selections);
  currentRef.current = currentQuestion;
  selectedRef.current = selectedOptions;
  selectionsRef.current = selections;

  const handleOptionClick = useCallback((style: StyleKey) => {
    setSelectedOptions((prev) => {
      const isSelected = prev.includes(style);
      if (isSelected) return prev.filter((s) => s !== style);
      return [...prev, style];
    });
  }, []);

  const handleNext = useCallback(() => {
    if (selectedRef.current.length === 0) return;
    const qId = varkQuestions[currentRef.current].id;
    const newSelections = { ...selectionsRef.current, [qId]: selectedRef.current };

    if (currentRef.current + 1 < totalQuestions) {
      // Award XP per question
      const newXp = xp + VARK_QUESTIONS_XP;
      setXp(newXp);
      setShowXpPopup(true);
      setTimeout(() => setShowXpPopup(false), 1200);

      setSlideDir(1);
      setSelections(newSelections);
      setCurrentQuestion((prev) => prev + 1);
      setSelectedOptions([]);
    } else {
      const flat: Record<string, StyleKey> = {};
      Object.entries(newSelections).forEach(([qId, styles]) => {
        styles.forEach((style, idx) => { flat[`${qId}-${idx}`] = style; });
      });
      const result = calculateVarkScore(flat);
      const totalXp = xp + VARK_QUESTIONS_XP + VARK_COMPLETE_BONUS;
      setXp(totalXp);
      sessionStorage.setItem('varkResult', JSON.stringify(result));
      sessionStorage.setItem('varkSelections', JSON.stringify(newSelections));
      sessionStorage.setItem('varkXp', String(totalXp));
      router.push('/brain-assessment');
    }
  }, [totalQuestions, router, xp]);

  const handleBack = useCallback(() => {
    if (currentRef.current > 0) {
      setSlideDir(-1);
      const prevQId = varkQuestions[currentRef.current - 1]?.id;
      const prevSelections = selectionsRef.current[prevQId] || [];
      setCurrentQuestion((prev) => prev - 1);
      setSelectedOptions(prevSelections);
    }
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const question = varkQuestions[currentRef.current];
      if (!question) return;
      const keyNum = parseInt(e.key);
      if (keyNum >= 1 && keyNum <= 4 && question.options[keyNum - 1]) {
        e.preventDefault();
        handleOptionClick(question.options[keyNum - 1].style as StyleKey);
      }
      if (e.key === 'Enter' && selectedRef.current.length > 0) { e.preventDefault(); handleNext(); }
      if (e.key === 'Escape' && currentRef.current > 0) { e.preventDefault(); handleBack(); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleNext, handleBack, handleOptionClick]);

  const progressPercent = ((currentQuestion) / totalQuestions) * 100;
  const canProceed = selectedOptions.length > 0;
  const question = varkQuestions[currentQuestion];
  const categoryInfo = questionCategories.find((c) => c.id === question.category);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0f2e] via-[#121840] to-[#1a1f4e] dark:from-gray-950 dark:via-gray-900 dark:to-gray-900 flex flex-col">
      {/* XP popup */}
      <AnimatePresence>
        {showXpPopup && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            className="fixed top-20 right-4 z-[100] bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-lg flex items-center gap-2"
          >
            <span>⚡</span> +{VARK_QUESTIONS_XP} XP
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top nav */}
      <div className="bg-white/5 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 bg-brand rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
          </div>
          <span className="font-bold text-white text-sm">Brainify</span>
        </Link>
        <div className="flex items-center gap-3 sm:gap-4">
          {/* XP display */}
          <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold">
            <span>⚡</span>
            <span>{xp}</span>
          </div>
          <div className="hidden xs:flex items-center gap-1.5 text-xs text-white/50">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>~{estimatedMinutes} min</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xs text-white/50 font-medium whitespace-nowrap">
              <span className="text-cyan-400 font-bold">{currentQuestion + 1}</span>/{totalQuestions}
            </span>
          </div>
        </div>
      </div>

      {/* DNA Scanner Progress Bar */}
      <div className="relative h-2 bg-white/5">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-400 via-brand to-purple-500"
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
        <motion.div
          className="absolute top-0 left-0 h-full w-16 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{ left: [`${Math.max(progressPercent - 8, 0)}%`, `${Math.min(progressPercent + 8, 100)}%`] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center px-3 sm:px-4 py-4 sm:py-8">
        <div className="w-full max-w-2xl mx-auto">
          {/* AI Companion Bar */}
          <motion.div
            key={`companion-${currentQuestion}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-3 sm:p-4 mb-3 sm:mb-4 flex items-start gap-3"
          >
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-xl flex-shrink-0 mt-0.5"
            >
              {companion.emoji}
            </motion.span>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-cyan-300 font-semibold mb-0.5">AI Learning Companion</p>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed">{companion.message}</p>
            </div>
            {/* Scanner pulse */}
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0 mt-2"
            />
          </motion.div>

          {/* Motivational + Trend */}
          <motion.div
            key={`moti-${currentQuestion}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between gap-2 mb-3 sm:mb-4 px-1"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">{moti.emoji}</span>
              <span className="text-xs text-white/50 font-medium">{moti.message}</span>
            </div>
            {trend && (
              <div className="hidden sm:flex items-center gap-1.5 bg-white/5 rounded-full px-2.5 py-1 border border-white/10">
                <span className="text-xs text-white/40">Trending:</span>
                <span className="text-xs font-bold text-white">{STYLE_CONFIG[trend.style].icon} {trend.style}</span>
                <span className="text-[10px] font-semibold text-green-400">{trend.percent}</span>
              </div>
            )}
          </motion.div>

          <AnimatePresence mode="wait" custom={slideDir}>
            <motion.div
              key={currentQuestion}
              custom={slideDir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl shadow-brand/5 p-5 sm:p-8 mb-4 sm:mb-6">
                <div className="flex items-center flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-5">
                  {categoryInfo && (
                    <span className="inline-flex items-center gap-1 bg-brand/20 text-cyan-300 text-[10px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1 rounded-full border border-brand/20">
                      <span className="text-xs sm:text-sm">{categoryInfo.icon}</span>
                      <span className="hidden xs:inline">{categoryInfo.label}</span>
                    </span>
                  )}
                  <span className="text-[10px] sm:text-xs text-white/30 font-medium ml-auto">
                    Scanning DNA... #{currentQuestion + 1}
                  </span>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-white leading-snug mb-2">{question.text}</h2>

                <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mb-6 sm:mb-7">
                  <p className="text-xs text-white/40">
                    Select <span className="font-semibold text-cyan-300">all options</span> that describe you
                  </p>
                  {selectedOptions.length > 0 && (
                    <span className="text-[10px] font-medium text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                      {selectedOptions.length} selected
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  {question.options.map((opt, idx) => {
                    const style = opt.style as StyleKey;
                    const isSelected = selectedOptions.includes(style);
                    const cfg = STYLE_CONFIG[style];
                    return (
                      <motion.button
                        key={opt.label}
                        onClick={() => handleOptionClick(style)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`group relative flex items-start gap-3 p-3 sm:p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                          isSelected
                            ? 'border-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-500/10'
                            : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                        }`}
                      >
                        <span className="absolute top-1.5 right-1.5 text-[9px] font-mono text-white/20 border border-white/10 rounded px-1 leading-tight">{idx + 1}</span>
                        <span className="text-lg sm:text-xl flex-shrink-0 mt-0.5">{cfg.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs sm:text-sm font-medium leading-snug ${isSelected ? 'text-white' : 'text-white/70'}`}>{opt.label}</p>
                          <span className={`text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider mt-1 inline-block ${cfg.color}`}>{opt.style}</span>
                        </div>
                        <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md border-2 flex-shrink-0 mt-0.5 transition-all duration-200 flex items-center justify-center ${
                          isSelected ? 'border-cyan-400 bg-cyan-400' : 'border-white/20'
                        }`}>
                          {isSelected && <svg className="w-3 h-3 text-[#0a0f2e]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-3 mb-8">
            <motion.button onClick={handleBack} disabled={currentQuestion === 0} whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-cyan-400 disabled:opacity-20 disabled:cursor-not-allowed transition-colors px-3 sm:px-4 py-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              <span className="hidden xs:inline">Back</span>
            </motion.button>

            <div className="text-[10px] sm:text-xs text-white/30 text-center hidden sm:block">
              {selectedOptions.length > 0 ? (
                <span className="text-green-400">Press <kbd className="px-1 py-0.5 bg-white/10 rounded text-[10px] font-mono text-white/60">Enter</kbd> to continue</span>
              ) : (
                <span>Press <kbd className="px-1 py-0.5 bg-white/10 rounded text-[10px] font-mono text-white/60">1-4</kbd> to toggle</span>
              )}
            </div>

            <motion.button onClick={handleNext} disabled={!canProceed} whileTap={{ scale: 0.95 }} whileHover={canProceed ? { scale: 1.02 } : {}}
              className={`text-xs sm:text-sm py-2.5 sm:py-3 px-5 sm:px-6 flex items-center gap-2 rounded-2xl font-bold transition-all duration-200 ${
                canProceed
                  ? 'bg-gradient-to-r from-cyan-500 to-brand text-white shadow-lg shadow-brand/20 hover:shadow-xl hover:shadow-brand/30'
                  : 'bg-white/10 text-white/30 cursor-not-allowed'
              }`}>
              {currentQuestion + 1 < totalQuestions ? (
                <>Next <span className="text-white/50 text-[10px]">+{VARK_QUESTIONS_XP} XP</span> <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></>
              ) : (
                <>Continue to Brain Assessment <span className="text-white/50 text-[10px]">+{VARK_COMPLETE_BONUS} XP</span> <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}