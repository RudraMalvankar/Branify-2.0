'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { brainQuestions, calculateBrainScore, brainCategories } from '@brainify/shared/data/brainQuestions';
import { aiCompanionMessages, BRAIN_QUESTIONS_XP, BRAIN_COMPLETE_BONUS, type AiCompanionMessage } from '@brainify/shared/data/gamification';

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

function getCompanionMessage(current: number, total: number): AiCompanionMessage {
  const msgs = aiCompanionMessages.brain;
  if (current === 0) return msgs.start[0];
  if (current === total - 1) return msgs.finalizing[0];
  if (current < 5) return msgs.scanning[current % msgs.scanning.length];
  if (current < 12) return msgs.analyzing[current % msgs.analyzing.length];
  return msgs.scanning[current % msgs.scanning.length];
}

export default function BrainAssessmentPage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selections, setSelections] = useState<Record<string, 'A' | 'B'>>({});
  const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | null>(null);
  const [slideDir, setSlideDir] = useState(1);
  const [xp, setXp] = useState(0);
  const [showXpPopup, setShowXpPopup] = useState(false);

  const totalQuestions = brainQuestions.length;
  const remainingQuestions = totalQuestions - currentQuestion;
  const estimatedMinutes = Math.ceil((remainingQuestions * ESTIMATED_SECONDS_PER_QUESTION) / 60);
  const moti = getMotivationalMessage(currentQuestion);
  const companion = getCompanionMessage(currentQuestion, totalQuestions);

  const currentRef = useRef(currentQuestion);
  const selectedRef = useRef(selectedAnswer);
  const selectionsRef = useRef(selections);
  currentRef.current = currentQuestion;
  selectedRef.current = selectedAnswer;
  selectionsRef.current = selections;

  // Load VARK XP
  useEffect(() => {
    const varkXp = parseInt(sessionStorage.getItem('varkXp') || '0');
    setXp(varkXp);
  }, []);

  const handleSelect = useCallback((answer: 'A' | 'B') => {
    setSelectedAnswer(answer);
  }, []);

  const handleNext = useCallback(() => {
    if (!selectedRef.current) return;
    const qId = brainQuestions[currentRef.current].id;
    const newSelections = { ...selectionsRef.current, [qId]: selectedRef.current };

    if (currentRef.current + 1 < totalQuestions) {
      const newXp = xp + BRAIN_QUESTIONS_XP;
      setXp(newXp);
      setShowXpPopup(true);
      setTimeout(() => setShowXpPopup(false), 1200);
      setSlideDir(1);
      setSelections(newSelections);
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
    } else {
      const final = calculateBrainScore(newSelections);
      const totalXp = xp + BRAIN_QUESTIONS_XP + BRAIN_COMPLETE_BONUS;
      sessionStorage.setItem('brainResult', JSON.stringify(final));
      sessionStorage.setItem('brainSelections', JSON.stringify(newSelections));
      sessionStorage.setItem('brainXp', String(totalXp));
      sessionStorage.setItem('totalXp', String(totalXp));
      router.push('/assessment/results');
    }
  }, [totalQuestions, router, xp]);

  const handleBack = useCallback(() => {
    if (currentRef.current > 0) {
      setSlideDir(-1);
      const prevQId = brainQuestions[currentRef.current - 1]?.id;
      const prevAnswer = selectionsRef.current[prevQId] || null;
      setCurrentQuestion((prev) => prev - 1);
      setSelectedAnswer(prevAnswer as 'A' | 'B' | null);
    }
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === '1') { e.preventDefault(); handleSelect('A'); }
      if (e.key === '2') { e.preventDefault(); handleSelect('B'); }
      if (e.key === 'Enter' && selectedRef.current) { e.preventDefault(); handleNext(); }
      if (e.key === 'Escape' && currentRef.current > 0) { e.preventDefault(); handleBack(); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleNext, handleBack, handleSelect]);

  const progressPercent = (currentQuestion / totalQuestions) * 100;
  const canProceed = !!selectedAnswer;
  const question = brainQuestions[currentQuestion];
  const categoryInfo = brainCategories.find((c) => c.id === question.category);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0f2e] via-[#121840] to-[#1a1f4e] dark:from-gray-950 dark:via-gray-900 dark:to-gray-900 flex flex-col">
      <AnimatePresence>
        {showXpPopup && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            className="fixed top-20 right-4 z-[100] bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-lg flex items-center gap-2"
          >
            <span>⚡</span> +{BRAIN_QUESTIONS_XP} XP
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white/5 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 bg-brand rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
          </div>
          <span className="font-bold text-white text-sm">Brainify</span>
        </Link>
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold">
            <span>⚡</span><span>{xp}</span>
          </div>
          <div className="hidden xs:flex items-center gap-1.5 text-xs text-white/50">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>~{estimatedMinutes} min</span>
          </div>
          <span className="text-xs text-white/50 font-medium">
            <span className="text-purple-400 font-bold">{currentQuestion + 1}</span>/{totalQuestions}
          </span>
        </div>
      </div>

      <div className="relative h-2 bg-white/5">
        <motion.div className="h-full bg-gradient-to-r from-purple-400 via-brand to-cyan-400" animate={{ width: `${progressPercent}%` }} transition={{ duration: 0.5 }} />
        <motion.div className="absolute top-0 left-0 h-full w-16 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{ left: [`${Math.max(progressPercent - 8, 0)}%`, `${Math.min(progressPercent + 8, 100)}%`] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="flex-1 flex items-start justify-center px-3 sm:px-4 py-4 sm:py-8">
        <div className="w-full max-w-2xl mx-auto">
          <motion.div key={`companion-${currentQuestion}`} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-3 sm:p-4 mb-3 sm:mb-4 flex items-start gap-3">
            <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} className="text-xl flex-shrink-0 mt-0.5">{companion.emoji}</motion.span>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-purple-300 font-semibold mb-0.5">AI Learning Companion</p>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed">{companion.message}</p>
            </div>
            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-2 h-2 rounded-full bg-purple-400 flex-shrink-0 mt-2" />
          </motion.div>

          <motion.div key={`moti-${currentQuestion}`} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 mb-3 sm:mb-4 px-1">
            <span className="text-sm">{moti.emoji}</span>
            <span className="text-xs text-white/50 font-medium">{moti.message}</span>
          </motion.div>

          <AnimatePresence mode="wait" custom={slideDir}>
            <motion.div key={currentQuestion} custom={slideDir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl shadow-brand/5 p-5 sm:p-8 mb-4 sm:mb-6">
                <div className="flex items-center flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-5">
                  {categoryInfo && (
                    <span className="inline-flex items-center gap-1 bg-brand/20 text-purple-300 text-[10px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1 rounded-full border border-brand/20">
                      <span className="text-xs sm:text-sm">{categoryInfo.icon}</span>
                      <span className="hidden xs:inline">{categoryInfo.label}</span>
                    </span>
                  )}
                  <span className="text-[10px] sm:text-xs text-white/30 font-medium ml-auto">Scanning Brain... #{currentQuestion + 1}</span>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-white leading-snug mb-2">{question.text}</h2>
                <p className="text-xs text-white/40 mb-6 sm:mb-7">Choose the option that resonates most with you</p>

                <div className="space-y-3">
                  {[question.optionA, question.optionB].map((opt, idx) => {
                    const answer = idx === 0 ? 'A' : 'B';
                    const isSelected = selectedAnswer === answer;
                    return (
                      <motion.button key={answer} onClick={() => handleSelect(answer)}
                        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                        className={`w-full flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
                          isSelected ? 'border-purple-400 bg-purple-500/10 shadow-lg shadow-purple-500/10' : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                        }`}>
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold transition-all ${
                          isSelected ? 'bg-gradient-to-r from-purple-500 to-brand text-white shadow-md' : 'bg-white/10 text-white/40'
                        }`}>{answer}</div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm sm:text-base font-medium leading-snug ${isSelected ? 'text-white' : 'text-white/70'}`}>{opt}</p>
                        </div>
                        <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex-shrink-0 mt-0.5 transition-all flex items-center justify-center ${
                          isSelected ? 'border-purple-400 bg-purple-400' : 'border-white/20'
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

          <div className="flex items-center justify-between gap-3 mb-8">
            <motion.button onClick={handleBack} disabled={currentQuestion === 0} whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-purple-400 disabled:opacity-20 disabled:cursor-not-allowed transition-colors px-3 sm:px-4 py-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              <span className="hidden xs:inline">Back</span>
            </motion.button>

            <div className="text-[10px] sm:text-xs text-white/30 text-center hidden sm:block">
              {canProceed ? (
                <span className="text-green-400">Press <kbd className="px-1 py-0.5 bg-white/10 rounded text-[10px] font-mono text-white/60">Enter</kbd> to continue</span>
              ) : (
                <span>Press <kbd className="px-1 py-0.5 bg-white/10 rounded text-[10px] font-mono text-white/60">1</kbd> or <kbd className="px-1 py-0.5 bg-white/10 rounded text-[10px] font-mono text-white/60">2</kbd> to select</span>
              )}
            </div>

            <motion.button onClick={handleNext} disabled={!canProceed} whileTap={{ scale: 0.95 }} whileHover={canProceed ? { scale: 1.02 } : {}}
              className={`text-xs sm:text-sm py-2.5 sm:py-3 px-5 sm:px-6 flex items-center gap-2 rounded-2xl font-bold transition-all duration-200 ${
                canProceed ? 'bg-gradient-to-r from-purple-500 to-brand text-white shadow-lg shadow-brand/20 hover:shadow-xl' : 'bg-white/10 text-white/30 cursor-not-allowed'
              }`}>
              {currentQuestion + 1 < totalQuestions ? (
                <>Next <span className="text-white/50 text-[10px]">+{BRAIN_QUESTIONS_XP} XP</span> <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></>
              ) : (
                <>Unlock Your Learning DNA <span className="text-white/50 text-[10px]">+{BRAIN_COMPLETE_BONUS} XP</span> <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}