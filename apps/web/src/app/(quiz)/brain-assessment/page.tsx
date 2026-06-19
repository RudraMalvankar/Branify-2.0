'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { brainQuestions, calculateBrainScore, brainCategories, type BrainResult } from '@brainify/shared/data/brainQuestions';

const ESTIMATED_SECONDS_PER_QUESTION = 15;

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
};

const motivationalMessages = [
  { range: [1, 5], message: "Let's discover how your brain works!", emoji: '🧠' },
  { range: [6, 10], message: 'Fascinating patterns emerging...', emoji: '🔍' },
  { range: [11, 15], message: 'Your brain profile is taking shape!', emoji: '📊' },
  { range: [16, 20], message: 'Almost there — your results are loading!', emoji: '🚀' },
];

function getMotivationalMessage(current: number) {
  const index = Math.min(Math.floor(current / 5), 3);
  return motivationalMessages[index];
}

export default function BrainAssessmentPage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selections, setSelections] = useState<Record<string, 'A' | 'B'>>({});
  const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | null>(null);
  const [result] = useState<BrainResult | null>(null);
  const [slideDir, setSlideDir] = useState(1);

  const totalQuestions = brainQuestions.length;
  const remainingQuestions = totalQuestions - currentQuestion;
  const estimatedMinutes = Math.ceil((remainingQuestions * ESTIMATED_SECONDS_PER_QUESTION) / 60);
  const moti = getMotivationalMessage(currentQuestion);

  const currentRef = useRef(currentQuestion);
  const selectedRef = useRef(selectedAnswer);
  const resultRef = useRef(result);
  const selectionsRef = useRef(selections);
  currentRef.current = currentQuestion;
  selectedRef.current = selectedAnswer;
  resultRef.current = result;
  selectionsRef.current = selections;

  const handleSelect = useCallback((answer: 'A' | 'B') => {
    if (resultRef.current) return;
    setSelectedAnswer(answer);
  }, []);

  const handleNext = useCallback(() => {
    if (!selectedRef.current) return;
    const qId = brainQuestions[currentRef.current].id;
    const newSelections = { ...selectionsRef.current, [qId]: selectedRef.current };

    if (currentRef.current + 1 < totalQuestions) {
      setSlideDir(1);
      setSelections(newSelections);
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
    } else {
      const final = calculateBrainScore(newSelections);
      setSelections(newSelections);
      // Store brain result in sessionStorage for unified results page
      sessionStorage.setItem('brainResult', JSON.stringify(final));
      const varkSequence = { ...selectionsRef.current, [qId]: selectedRef.current };
      sessionStorage.setItem('brainSelections', JSON.stringify(varkSequence));
      router.push('/assessment/results');
    }
  }, [totalQuestions, router]);

  const handleBack = useCallback(() => {
    if (currentRef.current > 0) {
      setSlideDir(-1);
      const prevQId = brainQuestions[currentRef.current - 1]?.id;
      const prevAnswer = selectionsRef.current[prevQId] || null;
      setCurrentQuestion((prev) => prev - 1);
      setSelectedAnswer(prevAnswer as 'A' | 'B' | null);
    }
  }, []);

  // Keyboard support
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (resultRef.current) return;
      if (e.key === '1') { e.preventDefault(); handleSelect('A'); }
      if (e.key === '2') { e.preventDefault(); handleSelect('B'); }
      if (e.key === 'Enter' && selectedRef.current) { e.preventDefault(); handleNext(); }
      if (e.key === 'Escape' && currentRef.current > 0) { e.preventDefault(); handleBack(); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleNext, handleBack, handleSelect]);

  const progressPercent = ((currentQuestion) / totalQuestions) * 100;
  const canProceed = !!selectedAnswer;

  const question = brainQuestions[currentQuestion];
  const categoryInfo = brainCategories.find((c) => c.id === question.category);

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
                <div key={i} className={`w-2 h-2 rounded-full transition-all duration-500 ${i <= currentQuestion ? 'bg-brand scale-100' : 'bg-gray-200 dark:bg-gray-600 scale-75'} ${i === currentQuestion ? 'ring-2 ring-brand/30' : ''}`} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-100 dark:bg-gray-700/50">
        <motion.div className="h-full bg-gradient-to-r from-brand to-brand-light" animate={{ width: `${progressPercent}%` }} transition={{ duration: 0.5, ease: 'easeOut' }} />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center px-3 sm:px-4 py-4 sm:py-8">
        <div className="w-full max-w-2xl mx-auto">
          <motion.div key={`moti-${currentQuestion}`} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 mb-3 sm:mb-4 px-1">
            <span className="text-sm">{moti.emoji}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{moti.message}</span>
          </motion.div>

          <AnimatePresence mode="wait" custom={slideDir}>
            <motion.div key={currentQuestion} custom={slideDir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25, ease: 'easeInOut' }}>
              <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700/60 shadow-lg hover:shadow-xl transition-shadow duration-300 p-5 sm:p-8 mb-4 sm:mb-6">
                <div className="flex items-center flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-5">
                  {categoryInfo && (
                    <span className="inline-flex items-center gap-1 bg-brand-50 dark:bg-brand/10 text-brand text-[10px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1 rounded-full">
                      <span className="text-xs sm:text-sm">{categoryInfo.icon}</span>
                      <span className="hidden xs:inline">{categoryInfo.label}</span>
                    </span>
                  )}
                  <span className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 font-medium ml-auto">#{currentQuestion + 1}</span>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white leading-snug mb-2">{question.text}</h2>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-6 sm:mb-7">Choose the option that resonates most with you</p>

                <div className="space-y-3">
                  <motion.button
                    onClick={() => handleSelect('A')}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`w-full flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
                      selectedAnswer === 'A'
                        ? 'border-brand bg-brand-50 dark:bg-brand/10 shadow-md shadow-brand/10'
                        : 'border-gray-100 dark:border-gray-600 bg-white dark:bg-gray-700/50 hover:border-gray-200 dark:hover:border-gray-500 hover:shadow-md'
                    }`}
                  >
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold transition-all duration-200 ${
                      selectedAnswer === 'A' ? 'bg-brand text-white shadow-md' : 'bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-300'
                    }`}>A</div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm sm:text-base font-medium leading-snug ${selectedAnswer === 'A' ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200'}`}>
                        {question.optionA}
                      </p>
                    </div>
                    <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex-shrink-0 mt-0.5 transition-all duration-200 flex items-center justify-center ${
                      selectedAnswer === 'A' ? 'border-brand bg-brand' : 'border-gray-300 dark:border-gray-500'
                    }`}>
                      {selectedAnswer === 'A' && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                    </div>
                  </motion.button>

                  <motion.button
                    onClick={() => handleSelect('B')}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`w-full flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
                      selectedAnswer === 'B'
                        ? 'border-brand bg-brand-50 dark:bg-brand/10 shadow-md shadow-brand/10'
                        : 'border-gray-100 dark:border-gray-600 bg-white dark:bg-gray-700/50 hover:border-gray-200 dark:hover:border-gray-500 hover:shadow-md'
                    }`}
                  >
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold transition-all duration-200 ${
                      selectedAnswer === 'B' ? 'bg-brand text-white shadow-md' : 'bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-300'
                    }`}>B</div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm sm:text-base font-medium leading-snug ${selectedAnswer === 'B' ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200'}`}>
                        {question.optionB}
                      </p>
                    </div>
                    <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex-shrink-0 mt-0.5 transition-all duration-200 flex items-center justify-center ${
                      selectedAnswer === 'B' ? 'border-brand bg-brand' : 'border-gray-300 dark:border-gray-500'
                    }`}>
                      {selectedAnswer === 'B' && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                    </div>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between gap-3 mb-8">
            <motion.button onClick={handleBack} disabled={currentQuestion === 0} whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-brand disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-3 sm:px-4 py-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              <span className="hidden xs:inline">Back</span>
            </motion.button>

            <div className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 text-center hidden sm:block">
              {canProceed ? (
                <span className="text-green-600 dark:text-green-400">Press <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px] font-mono">Enter</kbd> to continue</span>
              ) : (
                <span>Press <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px] font-mono">1</kbd> or <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px] font-mono">2</kbd> to select</span>
              )}
            </div>

            <motion.button onClick={handleNext} disabled={!canProceed} whileTap={{ scale: 0.95 }} whileHover={canProceed ? { scale: 1.02 } : {}}
              className={`btn-primary text-xs sm:text-sm py-2.5 sm:py-3 px-5 sm:px-6 flex items-center gap-2 ${!canProceed ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {currentQuestion + 1 < totalQuestions ? (
                <>Next <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></>
              ) : (
                <>See Your Full Report <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}