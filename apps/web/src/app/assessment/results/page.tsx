'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { type VarkResult } from '@brainify/shared/data/varkQuestions';
import { type BrainResult } from '@brainify/shared/data/brainQuestions';
import { brainTypeDescriptions } from '@brainify/shared/data/brainRecommendations';
import { generateLearningDNA, type LearningPersona } from '@brainify/shared/data/learningPersona';
import { achievements, DNA_UNLOCK_BONUS, getLearningEnvironmentRecs, getStudyHabitsRecs, getProductivityRecs, type Achievement } from '@brainify/shared/data/gamification';

const varkStyleConfig: Record<string, { gradient: string; icon: string; color: string; bar: string }> = {
  Visual: { gradient: 'from-blue-600 to-indigo-700', icon: '👁️', color: 'text-blue-600 dark:text-blue-300', bar: 'bg-gradient-to-r from-blue-500 to-indigo-600' },
  Aural: { gradient: 'from-pink-500 to-rose-600', icon: '👂', color: 'text-pink-600 dark:text-pink-300', bar: 'bg-gradient-to-r from-pink-500 to-rose-600' },
  'Read/Write': { gradient: 'from-cyan-500 to-teal-600', icon: '📖', color: 'text-cyan-600 dark:text-cyan-300', bar: 'bg-gradient-to-r from-cyan-500 to-teal-600' },
  Kinesthetic: { gradient: 'from-purple-500 to-violet-600', icon: '🖐️', color: 'text-purple-600 dark:text-purple-300', bar: 'bg-gradient-to-r from-purple-500 to-violet-600' },
};

type RevealStage = 'scanning' | 'dna' | 'persona' | 'scores' | 'strengths' | 'recommendations' | 'complete';

export default function AssessmentResultsPage() {
  const [varkResult, setVarkResult] = useState<VarkResult | null>(null);
  const [brainResult, setBrainResult] = useState<BrainResult | null>(null);
  const [dna, setDna] = useState<{ primaryLearningStyle: string; secondaryLearningStyle: string | null; brainType: string; combinedPersona: LearningPersona } | null>(null);
  const [loading, setLoading] = useState(true);
  const [revealStage, setRevealStage] = useState<RevealStage>('scanning');
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([]);
  const [totalXp, setTotalXp] = useState(0);
  const [showUnlock, setShowUnlock] = useState(false);

  // Animated reveal sequence
  useEffect(() => {
    if (!loading && dna) {
      const sequence = async () => {
        await new Promise(r => setTimeout(r, 500));
        setRevealStage('dna');
        await new Promise(r => setTimeout(r, 800));
        setRevealStage('persona');
        await new Promise(r => setTimeout(r, 600));
        setRevealStage('scores');
        await new Promise(r => setTimeout(r, 600));
        setRevealStage('strengths');
        await new Promise(r => setTimeout(r, 600));
        setRevealStage('recommendations');
        await new Promise(r => setTimeout(r, 300));
        setRevealStage('complete');
        setShowUnlock(true);
        setTimeout(() => setShowUnlock(false), 4000);
      };
      sequence();
    }
  }, [loading, dna]);

  useEffect(() => {
    const varkData = sessionStorage.getItem('varkResult');
    const brainData = sessionStorage.getItem('brainResult');
    const xpData = parseInt(sessionStorage.getItem('totalXp') || '0');

    if (!varkData || !brainData) {
      setLoading(false);
      return;
    }

    const vark: VarkResult = JSON.parse(varkData);
    const brain: BrainResult = JSON.parse(brainData);
    setVarkResult(vark);
    setBrainResult(brain);
    setTotalXp(xpData);

    const learningDNA = generateLearningDNA(vark, brain);
    setDna(learningDNA);

    // Calculate achievements
    const earned: Achievement[] = [];
    achievements.forEach((a) => {
      if (a.id === 'dna_unlocked') earned.push({ ...a, unlocked: true });
      if (a.id === 'vark_complete') earned.push({ ...a, unlocked: true });
      if (a.id === 'brain_complete') earned.push({ ...a, unlocked: true });
      if (a.id === 'self_aware') earned.push({ ...a, unlocked: true });
      // Multimodal check
      const scores = [vark.visual, vark.aural, vark.readWrite, vark.kinesthetic];
      const max = Math.max(...scores);
      const closeCount = scores.filter((s) => s >= max - 2).length;
      if (closeCount >= 3) earned.push({ ...achievements.find(a => a.id === 'multimodal')!, unlocked: true });
      if (brain.dominance === 'Balanced Brain') earned.push({ ...achievements.find(a => a.id === 'balanced_brain')!, unlocked: true });
    });
    setUnlockedAchievements(earned);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0f2e] via-[#121840] to-[#1a1f4e] flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 mx-auto mb-4 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full"
          />
          <motion.p
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-cyan-300 text-sm font-medium"
          >
            Analyzing your Learning DNA...
          </motion.p>
        </div>
      </div>
    );
  }

  if (!varkResult || !brainResult || !dna) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0f2e] to-[#1a1f4e] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <span className="text-6xl block mb-4">🧬</span>
          <h1 className="text-2xl font-bold text-white mb-2">No Assessment Data Found</h1>
          <p className="text-sm text-white/50 mb-6">Please complete both assessments to see your Learning DNA report.</p>
          <Link href="/vark" className="inline-flex bg-gradient-to-r from-cyan-500 to-brand text-white font-bold px-6 py-3 rounded-2xl text-sm">Take VARK Assessment</Link>
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

  const envRecs = getLearningEnvironmentRecs(persona.personaName);
  const habitRecs = getStudyHabitsRecs(persona.personaName);
  const prodRecs = getProductivityRecs(persona.personaName);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0f2e] via-[#121840] to-[#1a1f4e]">
      {/* Unlock Flash */}
      <AnimatePresence>
        {showUnlock && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-[#0a0f2e]/90 backdrop-blur-xl"
          >
            <div className="text-center">
              <motion.span
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                className="text-8xl block mb-6"
              >
                🧬
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-extrabold text-white mb-2"
              >
                Learning DNA Unlocked!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-cyan-300 text-sm"
              >
                +{DNA_UNLOCK_BONUS} XP &bull; {unlockedAchievements.length} Achievements Earned
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO - Animated reveal */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative px-6 pt-20 pb-32 text-center overflow-hidden"
      >
        {/* Background scanning animation */}
        <div className="absolute inset-0 pointer-events-none">
          {revealStage === 'scanning' && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-purple-500/10"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </div>

        <div className="relative z-10 max-w-lg mx-auto">
          {/* Stage 1: DNA Scanning */}
          {revealStage === 'scanning' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-7xl mb-4"
              >
                🔬
              </motion.div>
              <motion.div className="h-1 w-48 mx-auto bg-gradient-to-r from-cyan-400 via-brand to-purple-500 rounded-full mb-4"
                animate={{ width: ['30%', '80%', '30%'] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <h1 className="text-2xl font-bold text-white mb-2">Scanning Your Learning DNA</h1>
              <p className="text-white/50 text-sm">Analyzing cognitive patterns...</p>
            </motion.div>
          )}

          {/* Stage 2: DNA Found */}
          {(revealStage === 'dna' || revealStage !== 'scanning') && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              <motion.span
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-7xl block mb-4"
              >
                {persona.personaEmoji}
              </motion.span>
            </motion.div>
          )}

          {/* Stage 3+: Persona Reveal */}
          {revealStage !== 'scanning' && revealStage !== 'dna' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="inline-flex items-center gap-1 bg-white/10 text-cyan-300 text-xs font-semibold px-3 py-1 rounded-full mb-3 border border-white/10">
                🧬 LEARNING DNA PROFILE
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-2">
                {persona.personaName}
              </h1>
              <p className="text-cyan-300/80 text-sm">{persona.personalityTrait}</p>
              <p className="text-white/50 text-sm leading-relaxed mt-3 max-w-sm mx-auto">{persona.personaDescription}</p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {revealStage !== 'scanning' && revealStage !== 'dna' && (
        <div className="max-w-4xl mx-auto px-4 -mt-16 relative z-10 space-y-6 pb-12">
          {/* XP + Achievements Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-5 flex items-center justify-between flex-wrap gap-3"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚡</span>
              <div>
                <p className="text-xs text-white/40 font-medium">Total XP Earned</p>
                <p className="text-xl font-bold text-amber-400">{totalXp || DNA_UNLOCK_BONUS}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {unlockedAchievements.map((a) => (
                <div key={a.id} className="bg-white/5 rounded-xl px-3 py-2 border border-white/10 text-center" title={a.description}>
                  <span className="text-lg block">{a.icon}</span>
                  <span className="text-[8px] text-white/40 font-medium">{a.title}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Profile Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {[
              { icon: varkConfig.icon, label: 'Primary Style', value: dna.primaryLearningStyle, sub: dna.secondaryLearningStyle ? `Secondary: ${dna.secondaryLearningStyle}` : undefined },
              { icon: brainTypeInfo.emoji, label: 'Brain Type', value: dna.brainType, sub: persona.personalityTrait },
              { icon: persona.personaEmoji, label: 'Combined Persona', value: persona.personaName, sub: 'Your learning identity' },
            ].map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-5 text-center hover:bg-white/10 transition-colors"
              >
                <span className="text-3xl block mb-2">{card.icon}</span>
                <p className="text-[10px] text-white/40 uppercase tracking-wider font-semibold mb-1">{card.label}</p>
                <p className="font-bold text-white text-lg">{card.value}</p>
                {card.sub && <p className="text-xs text-white/40 mt-1">{card.sub}</p>}
              </motion.div>
            ))}
          </motion.div>

          {/* VARK + Brain Scores */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-6">
              <h3 className="text-sm font-bold text-white mb-4">VARK Profile</h3>
              <div className="space-y-3">
                {varkScores.map((s) => {
                  const cfg = varkStyleConfig[s.label] || varkStyleConfig['Visual'];
                  const percent = total > 0 ? (s.score / total) * 100 : 0;
                  return (
                    <motion.div key={s.label} className="flex items-center gap-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + varkScores.indexOf(s) * 0.1 }}
                    >
                      <span className="text-sm flex-shrink-0 w-5">{cfg.icon}</span>
                      <div className="flex-1">
                        <div className="flex justify-between text-[10px] mb-0.5">
                          <span className="font-medium text-white/60">{s.label}</span>
                          <span className="font-bold text-white">{s.score}</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${cfg.bar}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.8 + varkScores.indexOf(s) * 0.1 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-6">
              <h3 className="text-sm font-bold text-white mb-4">Brain Dominance</h3>
              <div className="relative h-8 bg-white/5 rounded-full overflow-hidden">
                <motion.div className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-blue-400 rounded-l-full"
                  initial={{ width: '50%' }} animate={{ width: `${brainResult.leftPercent}%` }} transition={{ duration: 1, delay: 0.5 }} />
                <motion.div className="absolute inset-y-0 right-0 bg-gradient-to-l from-purple-500 to-purple-400 rounded-r-full"
                  initial={{ width: '50%' }} animate={{ width: `${brainResult.rightPercent}%` }} transition={{ duration: 1, delay: 0.5 }} />
                <div className="absolute inset-0 flex items-center justify-center"><div className="w-0.5 h-10 bg-white/20" /></div>
              </div>
              <div className="flex justify-between mt-3">
                <div className="text-center">
                  <p className="text-lg font-extrabold text-blue-400">{brainResult.leftPercent}%</p>
                  <p className="text-[10px] text-white/40">Left Brain</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-extrabold text-purple-400">{brainResult.rightPercent}%</p>
                  <p className="text-[10px] text-white/40">Right Brain</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Strengths + Growth */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-6">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><span>💪</span> Learning Strengths</h3>
              <ul className="space-y-2">
                {persona.combinedStrengths.slice(0, 4).map((s, i) => (
                  <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 + i * 0.08 }}
                    className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5 text-white">{i + 1}</span>
                    <span className="text-xs text-white/70 leading-relaxed">{s}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-6">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><span>🌱</span> Areas for Growth</h3>
              <ul className="space-y-2">
                {persona.combinedGrowthAreas.slice(0, 3).map((a, i) => (
                  <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 + i * 0.08 }}
                    className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                    <span className="text-xs text-white/70 leading-relaxed">{a}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Learning Environment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <h3 className="text-sm font-bold text-white mb-4 px-1 flex items-center gap-2"><span>🏠</span> Learning Environment Recommendations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {envRecs.map((rec, i) => (
                <motion.div key={rec.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 + i * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-5 hover:bg-white/10 transition-colors">
                  <span className="text-2xl block mb-2">{rec.icon}</span>
                  <h4 className="font-bold text-white text-sm mb-1">{rec.title}</h4>
                  <p className="text-xs text-white/50 mb-3 leading-relaxed">{rec.description}</p>
                  <ul className="space-y-1">
                    {rec.tips.map((tip, j) => (
                      <li key={j} className="text-[10px] text-white/40 flex items-start gap-1.5">
                        <span className="text-cyan-400 mt-0.5">▸</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Study Habits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <h3 className="text-sm font-bold text-white mb-4 px-1 flex items-center gap-2"><span>📚</span> Study Habits Recommendations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {habitRecs.map((rec, i) => (
                <motion.div key={rec.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 + i * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-5 hover:bg-white/10 transition-colors">
                  <span className="text-2xl block mb-2">{rec.icon}</span>
                  <h4 className="font-bold text-white text-sm mb-1">{rec.title}</h4>
                  <p className="text-xs text-white/50 mb-3 leading-relaxed">{rec.description}</p>
                  <ul className="space-y-1">
                    {rec.tips.map((tip, j) => (
                      <li key={j} className="text-[10px] text-white/40 flex items-start gap-1.5">
                        <span className="text-purple-400 mt-0.5">▸</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Productivity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
          >
            <h3 className="text-sm font-bold text-white mb-4 px-1 flex items-center gap-2"><span>⚡</span> Productivity Recommendations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prodRecs.map((rec, i) => (
                <motion.div key={rec.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 + i * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-5 hover:bg-white/10 transition-colors">
                  <span className="text-2xl block mb-2">{rec.icon}</span>
                  <h4 className="font-bold text-white text-sm mb-1">{rec.title}</h4>
                  <p className="text-xs text-white/50 mb-3 leading-relaxed">{rec.description}</p>
                  <ul className="space-y-1">
                    {rec.tips.map((tip, j) => (
                      <li key={j} className="text-[10px] text-white/40 flex items-start gap-1.5">
                        <span className="text-amber-400 mt-0.5">▸</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* AI Adaptation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="bg-gradient-to-r from-cyan-500/10 via-brand/10 to-purple-500/10 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden"
          >
            <div className="h-2 w-full bg-gradient-to-r from-cyan-400 via-brand to-purple-500" />
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-brand flex items-center justify-center shadow-md">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">AI Study Buddy Adaptation</h3>
                  <p className="text-xs text-white/40">How Brainify AI will teach you</p>
                </div>
              </div>
              <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{persona.personaEmoji}</span>
                  <span className="font-bold text-white text-sm">{persona.personaName} Mode</span>
                </div>
                <p className="text-sm text-white/70 leading-relaxed">{persona.aiAdaptation}</p>
              </div>
            </div>
          </motion.div>

          {/* Mindset Tip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="bg-gradient-to-br from-brand/20 to-purple-500/20 rounded-3xl p-6 sm:p-8 text-center border border-white/10"
          >
            <span className="text-4xl block mb-3">💡</span>
            <p className="text-white text-sm leading-relaxed max-w-lg mx-auto italic">
              &ldquo;{persona.mindsetTip}&rdquo;
            </p>
          </motion.div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/dashboard" className="bg-gradient-to-r from-cyan-500 to-brand text-white font-bold text-sm py-3 px-8 rounded-2xl flex items-center gap-2 shadow-lg shadow-brand/20 hover:shadow-xl transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              Go to Dashboard
            </Link>
            <Link href="/vark" className="bg-white/5 text-white/70 font-bold text-sm py-3 px-8 rounded-2xl flex items-center gap-2 border border-white/10 hover:bg-white/10 transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582a7.5 7.5 0 0110.862-2.55M4 20v-5h.582a7.5 7.5 0 0010.862 2.55" /><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M17.5 17.5l3.5-3.5-3.5-3.5" /></svg>
              Retake Assessments
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}