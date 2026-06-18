'use client';

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  varkQuestions,
  calculateVarkScore,
  getMotivationalMessage,
  questionCategories,
  type VarkResult,
} from '@brainify/shared/data/varkQuestions';
import ResultsDisplay from './results';

const ESTIMATED_SECONDS_PER_QUESTION = 20;

const STYLE_CONFIG = {
  Visual: { icon: '👁️', color: 'text-blue-600 dark:text-blue-300', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-700', bar: 'bg-blue-500' },
  Aural: { icon: '👂', color: 'text-pink-600 dark:text-pink-300', bg: 'bg-pink-50 dark:bg-pink-900/20', border: 'border-pink-200 dark:border-pink-700', bar: 'bg-pink-500' },
  'Read/Write': { icon: '📖', color: 'text-cyan-600 dark:text-cyan-300', bg: 'bg-cyan-50 dark:bg-cyan-900/20', border: 'border-cyan-200 dark:border-cyan-700', bar: 'bg-cyan-500' },
  Kinesthetic: { icon: '🖐️', color: 'text-purple-600 dark:text-purple-300', bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-700', bar: 'bg-purple-500' },
} as const;

type StyleKey = keyof typeof STYLE_CONFIG;

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
};

/** Flatten all question selections into one array for scoring */
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

export default function VarkQuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  // Store array of styles per question ID (multi-select support)
  const [selections, setSelections] = useState<Record<string, StyleKey[]>>({});
  const [selectedOptions, setSelectedOptions] = useState<StyleKey[]>([]);
  const [result, setResult] = useState<VarkResult | null>(null);
  const [slideDir, setSlideDir] = useState(1);

  const totalQuestions = varkQuestions.length;
  const remainingQuestions = totalQuestions - currentQuestion;
  const estimatedMinutes = Math.ceil((remainingQuestions * ESTIMATED_SECONDS_PER_QUESTION) / 60);
  const moti = getMotivationalMessage(currentQuestion);
  const trend = useMemo(() => getLiveTrend(selections), [selections]);

  // Refs for keyboard handler
  const currentRef = useRef(currentQuestion);
  const selectedRef = useRef(selectedOptions);
  const resultRef = useRef(result);
  const selectionsRef = useRef(selections);
  currentRef.current = currentQuestion;
  selectedRef.current = selectedOptions;
  resultRef.current = result;
  selectionsRef.current = selections;

  const handleOptionClick = useCallback((style: StyleKey) => {
    if (resultRef.current) return;
    setSelectedOptions((prev) => {
      const isSelected = prev.includes(style);
      if (isSelected) {
        return prev.filter((s) => s !== style);
      }
      return [...prev, style];
    });
  }, []);

  const handleNext = useCallback(() => {
    if (selectedRef.current.length === 0) return;
    const qId = varkQuestions[currentRef.current].id;

    // Merge local selections into the permanent store
    const newSelections = {
      ...selectionsRef.current,
      [qId]: selectedRef.current,
    };

    if (currentRef.current + 1 < totalQuestions) {
      setSlideDir(1);
      setSelections(newSelections);
      setCurrentQuestion((prev) => prev + 1);
      setSelectedOptions([]);
    } else {
      // Build a flat Record<string, StyleKey> for calculateVarkScore
      // Each selection gets its own entry keyed by `${questionId}-${idx}`
      const flat: Record<string, StyleKey> = {};
      Object.entries(newSelections).forEach(([qId, styles]) => {
        styles.forEach((style, idx) => {
          flat[`${qId}-${idx}`] = style;
        });
      });
      const final = calculateVarkScore(flat);
      setSelections(newSelections);
      setResult(final);
    }
  }, [totalQuestions]);

  const handleBack = useCallback(() => {
    if (currentRef.current > 0) {
      setSlideDir(-1);
      // Restore previous question's selections
      const prevQId = varkQuestions[currentRef.current - 1]?.id;
      const prevSelections = selectionsRef.current[prevQId] || [];
      setCurrentQuestion((prev) => prev - 1);
      setSelectedOptions(prevSelections);
    }
  }, []);

  // Keyboard support
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (resultRef.current) return;
      const question = varkQuestions[currentRef.current];
      if (!question) return;

      const keyNum = parseInt(e.key);
      if (keyNum >= 1 && keyNum <= 4 && question.options[keyNum - 1]) {
        e.preventDefault();
        handleOptionClick(question.options[keyNum - 1].style as StyleKey);
      }

      if (e.key === 'Enter' && selectedRef.current.length > 0) {
        e.preventDefault();
        handleNext();
      }

      if (e.key === 'Escape' && currentRef.current > 0) {
        e.preventDefault();
        handleBack();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleNext, handleBack, handleOptionClick]);

  const progressPercent = ((currentQuestion + (result ? 1 : 0)) / totalQuestions) * 100;
  const canProceed = selectedOptions.length > 0;

  if (result) {
    return (
      <ResultsDisplay
        result={result}
        onRetake={() => {
          setResult(null);
          setCurrentQuestion(0);
          setSelections({});
          setSelectedOptions([]);
        }}
      />
    );
  }

  const question = varkQuestions[currentQuestion];
  const categoryInfo = questionCategories.find((c) => c.id === question.category);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F7FF] to-white dark:from-gray-900 dark:to-gray-800 flex flex-col">
      {/* Top nav */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-100 dark:border-gray-700 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 bg-brand rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
          </div>
          <span className="font-bold text-gray-800 dark:text-white text-sm">Brainify</span>
        </Link>
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden xs:flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>~{estimatedMinutes} min left</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium whitespace-nowrap">
              <span className="text-brand font-bold">{currentQuestion + 1}</span>/{totalQuestions}
            </span>
            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: totalQuestions }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${
                    i <= currentQuestion ? 'bg-brand scale-100' : 'bg-gray-200 dark:bg-gray-600 scale-75'
                  } ${i === currentQuestion ? 'ring-2 ring-brand/30' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-100 dark:bg-gray-700/50">
        <motion.div
          className="h-full bg-gradient-to-r from-brand to-brand-light"
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center px-3 sm:px-4 py-4 sm:py-8">
        <div className="w-full max-w-2xl mx-auto">
          {/* Motivational bar */}
          <motion.div
            key={`moti-${currentQuestion}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between gap-2 mb-3 sm:mb-4 px-1"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">{moti.emoji}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{moti.message}</span>
            </div>
            {trend && (
              <div className="hidden sm:flex items-center gap-1.5 bg-white dark:bg-gray-800 rounded-full px-2.5 py-1 border border-gray-100 dark:border-gray-700 shadow-sm">
                <span className="text-xs text-gray-400">Trending:</span>
                <span className="text-xs font-bold">{STYLE_CONFIG[trend.style].icon} {trend.style}</span>
                <span className="text-[10px] font-semibold text-green-600 dark:text-green-400">{trend.percent}</span>
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
              {/* Question card */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700/60 shadow-lg hover:shadow-xl transition-shadow duration-300 p-5 sm:p-8 mb-4 sm:mb-6">
                <div className="flex items-center flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-5">
                  {categoryInfo && (
                    <span className="inline-flex items-center gap-1 bg-brand-50 dark:bg-brand/10 text-brand text-[10px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1 rounded-full">
                      <span className="text-xs sm:text-sm">{categoryInfo.icon}</span>
                      <span className="hidden xs:inline">{categoryInfo.label}</span>
                    </span>
                  )}
                  <span className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 font-medium ml-auto">
                    #{currentQuestion + 1}
                  </span>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white leading-snug mb-2">
                  {question.text}
                </h2>

                {/* Multi-select instruction */}
                <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mb-6 sm:mb-7">
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Select <span className="font-semibold text-gray-600 dark:text-gray-300">all options</span> that describe you
                  </p>
                  {selectedOptions.length > 0 && (
                    <span className="text-[10px] font-medium text-brand bg-brand-50 dark:bg-brand/10 px-2 py-0.5 rounded-full">
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
                            ? `border-brand ${cfg.bg} shadow-md shadow-brand/10`
                            : 'border-gray-100 dark:border-gray-600 bg-white dark:bg-gray-700/50 hover:border-gray-200 dark:hover:border-gray-500 hover:shadow-md hover:-translate-y-0.5'
                        }`}
                      >
                        <span className="absolute top-1.5 right-1.5 text-[9px] font-mono text-gray-300 dark:text-gray-600 border border-gray-100 dark:border-gray-600 rounded px-1 leading-tight">
                          {idx + 1}
                        </span>
                        <span className={`text-lg sm:text-xl flex-shrink-0 mt-0.5 transition-transform duration-200 ${isSelected ? 'scale-110' : ''}`}>
                          {cfg.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs sm:text-sm font-medium leading-snug ${isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200'}`}>
                            {opt.label}
                          </p>
                          <span className={`text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider mt-1 inline-block ${cfg.color}`}>
                            {opt.style}
                          </span>
                        </div>
                        <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md border-2 flex-shrink-0 mt-0.5 transition-all duration-200 flex items-center justify-center ${
                          isSelected ? 'border-brand bg-brand' : 'border-gray-300 dark:border-gray-500'
                        }`}>
                          {isSelected && (
                            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
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
            <motion.button
              onClick={handleBack}
              disabled={currentQuestion === 0}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-brand disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-3 sm:px-4 py-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden xs:inline">Back</span>
            </motion.button>

            <div className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 text-center hidden sm:block">
              {selectedOptions.length > 0 ? (
                <span className="text-green-600 dark:text-green-400">Press <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px] font-mono">Enter</kbd> to continue</span>
              ) : (
                <span>Press <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px] font-mono">1-4</kbd> to toggle</span>
              )}
            </div>

            <motion.button
              onClick={handleNext}
              disabled={!canProceed}
              whileTap={{ scale: 0.95 }}
              whileHover={canProceed ? { scale: 1.02 } : {}}
              className={`btn-primary text-xs sm:text-sm py-2.5 sm:py-3 px-5 sm:px-6 flex items-center gap-2 ${
                !canProceed ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {currentQuestion + 1 < totalQuestions ? (
                <>Next <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></>
              ) : (
                <>See Results <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}