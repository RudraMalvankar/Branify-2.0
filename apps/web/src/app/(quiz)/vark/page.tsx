'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { varkQuestions, calculateVarkScore, type VarkResult } from '@brainify/shared/data/varkQuestions';
import ResultsDisplay from './results';

export default function VarkQuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selections, setSelections] = useState<Record<string, 'Visual' | 'Aural' | 'Read/Write' | 'Kinesthetic'>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [result, setResult] = useState<VarkResult | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const totalQuestions = varkQuestions.length;

  const handleOptionClick = useCallback(
    (style: 'Visual' | 'Aural' | 'Read/Write' | 'Kinesthetic') => {
      if (isAnimating) return;
      setSelectedOption(style);
    },
    [isAnimating]
  );

  const handleNext = useCallback(() => {
    if (!selectedOption || isAnimating) return;

    const questionId = varkQuestions[currentQuestion].id;
    const newSelections = { ...selections, [questionId]: selectedOption as 'Visual' | 'Aural' | 'Read/Write' | 'Kinesthetic' };

    if (currentQuestion + 1 < totalQuestions) {
      setIsAnimating(true);
      setTimeout(() => {
        setSelections(newSelections);
        setCurrentQuestion((prev) => prev + 1);
        setSelectedOption(null);
        setIsAnimating(false);
      }, 200);
    } else {
      // Last question — calculate result
      const final = calculateVarkScore(newSelections);
      setSelections(newSelections);
      setResult(final);
    }
  }, [selectedOption, isAnimating, currentQuestion, selections, totalQuestions]);

  const handleBack = useCallback(() => {
    if (currentQuestion > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentQuestion((prev) => prev - 1);
        setSelectedOption(null);
        setIsAnimating(false);
      }, 200);
    }
  }, [currentQuestion]);

  const progressPercent = ((currentQuestion + (result ? 1 : 0)) / totalQuestions) * 100;

  if (result) {
    return <ResultsDisplay result={result} onRetake={() => { setResult(null); setCurrentQuestion(0); setSelections({}); setSelectedOption(null); }} />;
  }

  const question = varkQuestions[currentQuestion];

  const getOptionColor = (style: string) => {
    switch (style) {
      case 'Visual': return 'text-blue-600 dark:text-blue-300';
      case 'Aural': return 'text-pink-600 dark:text-pink-300';
      case 'Read/Write': return 'text-cyan-600 dark:text-cyan-300';
      case 'Kinesthetic': return 'text-purple-600 dark:text-purple-300';
      default: return 'text-gray-600';
    }
  };

  const getOptionIcon = (style: string) => {
    switch (style) {
      case 'Visual': return '👁️';
      case 'Aural': return '👂';
      case 'Read/Write': return '📖';
      case 'Kinesthetic': return '🖐️';
      default: return '❓';
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FF] dark:bg-gray-900 flex flex-col">
      {/* Top nav */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-brand rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
          </div>
          <span className="font-bold text-gray-800 dark:text-white text-sm">Brainify</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
            Question {currentQuestion + 1} of {totalQuestions}
          </span>
          <div className="hidden sm:flex items-center gap-1">
            {Array.from({ length: totalQuestions }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i <= currentQuestion
                    ? 'bg-brand'
                    : 'bg-gray-200 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gray-200 dark:bg-gray-700">
        <div
          className="h-full bg-brand transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl mx-auto">
          <div
            className={`transition-all duration-300 ${
              isAnimating ? 'opacity-0 translate-x-8' : 'opacity-100 translate-x-0'
            }`}
          >
            {/* Question card */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-lg p-8 mb-6">
              <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 mb-4">
                <span className="w-6 h-6 rounded-full bg-brand-50 dark:bg-brand/20 text-brand text-xs font-bold flex items-center justify-center">
                  {currentQuestion + 1}
                </span>
                <span>Select the option that best describes you</span>
              </div>

              <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-snug mb-8">
                {question.text}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {question.options.map((opt) => {
                  const isSelected = selectedOption === opt.style;
                  return (
                    <button
                      key={opt.label}
                      onClick={() => handleOptionClick(opt.style)}
                      className={`group relative flex items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                        isSelected
                          ? `border-brand bg-brand-50 dark:bg-brand/10 shadow-md`
                          : 'border-gray-100 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-200 dark:hover:border-gray-500 hover:shadow-sm'
                      }`}
                    >
                      <span className={`text-lg flex-shrink-0 mt-0.5 transition-transform duration-200 ${isSelected ? 'scale-110' : ''}`}>
                        {getOptionIcon(opt.style)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium leading-snug ${isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200'}`}>
                          {opt.label}
                        </p>
                        <span className={`text-[10px] font-semibold uppercase tracking-wider mt-1 inline-block ${getOptionColor(opt.style)}`}>
                          {opt.style}
                        </span>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-1 transition-all duration-200 ${
                        isSelected
                          ? 'border-brand bg-brand'
                          : 'border-gray-300 dark:border-gray-500'
                      }`}>
                        {isSelected && (
                          <svg className="w-3 h-3 text-white mx-auto mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={handleBack}
                disabled={currentQuestion === 0}
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-brand disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-4 py-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>

              <button
                onClick={handleNext}
                disabled={!selectedOption}
                className="btn-primary text-sm py-2.5 px-6 flex items-center gap-2"
              >
                {currentQuestion + 1 < totalQuestions ? (
                  <>Next Question <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></>
                ) : (
                  <>See Results <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}