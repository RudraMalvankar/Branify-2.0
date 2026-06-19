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
  Visual: { gradient: 'from-blue-600 to-indigo-700', icon: '👁️', color: 'text-blue-600', bar: 'bg-gradient-to-r from-blue-500 to-indigo-600' },
  Aural: { gradient: 'from-pink-500 to-rose-600', icon: '👂', color: 'text-pink-600', bar: 'bg-gradient-to-r from-pink-500 to-rose-600' },
  'Read/Write': { gradient: 'from-cyan-500 to-teal-600', icon: '📖', color: 'text-cyan-600', bar: 'bg-gradient-to-r from-cyan-500 to-teal-600' },
  Kinesthetic: { gradient: 'from-purple-500 to-violet-600', icon: '🖐️', color: 'text-purple-600', bar: 'bg-gradient-to-r from-purple-500 to-violet-600' },
};

const personaRarity: Record<string, { tier: string; label: string; color: string; desc: string }> = {
  'Creative Visual Thinker': { tier: 'rare', label: 'Rare Profile', color: 'from-purple-500 to-pink-500', desc: 'Only 8% of learners share this profile' },
  'Analytical Visualizer': { tier: 'common', label: 'Common Profile', color: 'from-blue-500 to-indigo-500', desc: '~15% of learners share this profile' },
  'Creative Communicator': { tier: 'rare', label: 'Rare Profile', color: 'from-pink-500 to-rose-500', desc: 'Only 7% of learners share this profile' },
  'Analytical Communicator': { tier: 'uncommon', label: 'Uncommon Profile', color: 'from-amber-500 to-orange-500', desc: '~11% of learners share this profile' },
  'Creative Scribe': { tier: 'uncommon', label: 'Uncommon Profile', color: 'from-teal-500 to-emerald-500', desc: '~10% of learners share this profile' },
  'Structured Knowledge Builder': { tier: 'common', label: 'Common Profile', color: 'from-cyan-500 to-blue-500', desc: '~14% of learners share this profile' },
  'Experiential Creator': { tier: 'rare', label: 'Rare Profile', color: 'from-orange-500 to-red-500', desc: 'Only 9% of learners share this profile' },
  'Precision Practitioner': { tier: 'uncommon', label: 'Uncommon Profile', color: 'from-slate-500 to-gray-500', desc: '~12% of learners share this profile' },
};

type RevealStage = 'scanning' | 'hero' | 'complete';

function LearningMixRing({ scores, dominant, size = 'default' }: { scores: { label: string; score: number; config: typeof varkStyleConfig[keyof typeof varkStyleConfig] }[]; dominant: string; size?: 'small' | 'default' }) {
  const total = scores.reduce((a, s) => a + s.score, 0) || 1;
  const gradientParts: string[] = [];
  let current = 0;
  scores.forEach((s) => {
    const pct = (s.score / total) * 360;
    const start = current;
    const end = current + pct;
    const color = s.label === 'Visual' ? '#3b82f6' : s.label === 'Aural' ? '#ec4899' : s.label === 'Read/Write' ? '#06b6d4' : '#8b5cf6';
    gradientParts.push(`${color} ${start}deg ${end}deg`);
    current = end;
  });
  const dim = size === 'small' ? 'w-20 h-20' : 'w-28 h-28';
  const inner = size === 'small' ? 'inset-2' : 'inset-3';
  const iconSize = size === 'small' ? 'text-lg' : 'text-2xl sm:text-3xl';
  return (
    <div className={`relative ${dim} flex-shrink-0`}>
      <motion.div className="w-full h-full rounded-full" style={{ background: `conic-gradient(${gradientParts.join(', ')})` }}
        initial={{ rotate: -90 }} animate={{ rotate: 0 }} transition={{ duration: 1.2, ease: 'easeOut' }} />
      <div className={`absolute ${inner} bg-[#0a0f2e] rounded-full flex items-center justify-center`}>
        <span className={`${iconSize} block`}>{varkStyleConfig[dominant]?.icon || '🧠'}</span>
      </div>
    </div>
  );
}

function BrainGauge({ leftPercent, rightPercent }: { leftPercent: number; rightPercent: number }) {
  return (
    <div>
      <div className="relative h-6 bg-white/5 rounded-full overflow-hidden">
        <motion.div className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-blue-400 rounded-l-full"
          initial={{ width: '50%' }} animate={{ width: `${leftPercent}%` }} transition={{ duration: 1, delay: 0.3 }} />
        <motion.div className="absolute inset-y-0 right-0 bg-gradient-to-l from-purple-500 to-purple-400 rounded-r-full"
          initial={{ width: '50%' }} animate={{ width: `${rightPercent}%` }} transition={{ duration: 1, delay: 0.3 }} />
        <div className="absolute inset-0 flex items-center justify-center"><div className="w-0.5 h-8 bg-white/20" /></div>
      </div>
      <div className="flex justify-between mt-1.5">
        <div className="text-center"><p className="text-sm font-extrabold text-blue-400">{leftPercent}%</p><p className="text-[9px] text-white/30">Left</p></div>
        <div className="text-center"><p className="text-sm font-extrabold text-purple-400">{rightPercent}%</p><p className="text-[9px] text-white/30">Right</p></div>
      </div>
    </div>
  );
}

function StatBadge({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2 border border-white/5">
      <span className="text-base">{icon}</span>
      <div>
        <p className="text-white font-bold text-xs">{value}</p>
        <p className="text-white/30 text-[8px] font-medium uppercase tracking-wider">{label}</p>
      </div>
    </div>
  );
}

export default function AssessmentResultsPage() {
  const [varkResult, setVarkResult] = useState<VarkResult | null>(null);
  const [brainResult, setBrainResult] = useState<BrainResult | null>(null);
  const [dna, setDna] = useState<{ primaryLearningStyle: string; secondaryLearningStyle: string | null; brainType: string; combinedPersona: LearningPersona } | null>(null);
  const [loading, setLoading] = useState(true);
  const [revealStage, setRevealStage] = useState<RevealStage>('scanning');
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([]);
  const [totalXp, setTotalXp] = useState(0);
  const [showUnlock, setShowUnlock] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (!loading && dna) {
      const sequence = async () => {
        await new Promise(r => setTimeout(r, 1200));
        setRevealStage('hero');
        await new Promise(r => setTimeout(r, 400));
        setRevealStage('complete');
        setShowUnlock(true);
        setTimeout(() => setShowUnlock(false), 3000);
      };
      sequence();
    }
  }, [loading, dna]);

  useEffect(() => {
    const varkData = sessionStorage.getItem('varkResult');
    const brainData = sessionStorage.getItem('brainResult');
    const xpData = parseInt(sessionStorage.getItem('totalXp') || '0');
    if (!varkData || !brainData) { setLoading(false); return; }
    const vark: VarkResult = JSON.parse(varkData);
    const brain: BrainResult = JSON.parse(brainData);
    setVarkResult(vark);
    setBrainResult(brain);
    setTotalXp(xpData);
    const learningDNA = generateLearningDNA(vark, brain);
    setDna(learningDNA);
    const earned: Achievement[] = [];
    achievements.forEach((a) => {
      if (['dna_unlocked', 'vark_complete', 'brain_complete', 'self_aware'].includes(a.id)) earned.push({ ...a, unlocked: true });
      const scores = [vark.visual, vark.aural, vark.readWrite, vark.kinesthetic];
      const max = Math.max(...scores);
      if (scores.filter((s) => s >= max - 2).length >= 3) earned.push({ ...achievements.find(a2 => a2.id === 'multimodal')!, unlocked: true });
      if (brain.dominance === 'Balanced Brain') earned.push({ ...achievements.find(a2 => a2.id === 'balanced_brain')!, unlocked: true });
    });
    setUnlockedAchievements(earned);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0f2e] via-[#121840] to-[#1a1f4e] flex items-center justify-center">
        <div className="text-center">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 mx-auto mb-4 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full" />
          <motion.p animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}
            className="text-cyan-300 text-sm font-medium">Building your Learning DNA profile...</motion.p>
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
          <p className="text-sm text-white/50 mb-6">Please complete both assessments.</p>
          <Link href="/vark" className="inline-flex bg-gradient-to-r from-cyan-500 to-brand text-white font-bold px-6 py-3 rounded-2xl text-sm">Start Assessment</Link>
        </div>
      </div>
    );
  }

  const persona = dna.combinedPersona;
  const brainTypeInfo = brainTypeDescriptions[brainResult.dominance] || { emoji: '🧠', color: 'text-blue-600', gradient: 'from-blue-600 to-indigo-700' };
  const rarity = personaRarity[persona.personaName] || { tier: 'common', label: 'Unique Profile', color: 'from-brand to-purple-500', desc: 'Your unique combination of traits' };

  const allScores = [
    { label: 'Visual', score: varkResult.visual, config: varkStyleConfig['Visual'] },
    { label: 'Aural', score: varkResult.aural, config: varkStyleConfig['Aural'] },
    { label: 'Read/Write', score: varkResult.readWrite, config: varkStyleConfig['Read/Write'] },
    { label: 'Kinesthetic', score: varkResult.kinesthetic, config: varkStyleConfig['Kinesthetic'] },
  ];
  const total = allScores.reduce((a, s) => a + s.score, 0);
  const envRecs = getLearningEnvironmentRecs(persona.personaName);
  const habitRecs = getStudyHabitsRecs(persona.personaName);
  const prodRecs = getProductivityRecs(persona.personaName);
  const confidenceScore = Math.min(100, Math.round((total / 32) * 100 + 40));

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0f2e] via-[#121840] to-[#1a1f4e]">
      <AnimatePresence>
        {showUnlock && (
          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.5 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-[#0a0f2e]/90 backdrop-blur-xl">
            <div className="text-center">
              <motion.span initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 12 }} className="text-8xl block mb-6">🧬</motion.span>
              <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="text-3xl font-extrabold text-white mb-2">Learning DNA Unlocked!</motion.h2>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                className="text-cyan-300 text-sm">+{DNA_UNLOCK_BONUS} XP &bull; {unlockedAchievements.length} Achievements</motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== SCANNING ====== */}
      {revealStage === 'scanning' && (
        <div className="min-h-screen flex items-center justify-center">
          <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.div animate={{ scale: [1, 1.15, 1], rotate: [0, 3, -3, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
              className="text-7xl mb-6">🔬</motion.div>
            <motion.div className="h-1 w-48 mx-auto bg-gradient-to-r from-cyan-400 via-brand to-purple-500 rounded-full mb-4"
              animate={{ width: ['30%', '85%', '30%'] }} transition={{ duration: 2, repeat: Infinity }} />
            <h1 className="text-2xl font-bold text-white">Decoding Your Learning DNA</h1>
            <p className="text-white/40 text-sm mt-2">Analyzing 36 data points...</p>
          </motion.div>
        </div>
      )}

      {/* ====== RESULTS ====== */}
      {revealStage !== 'scanning' && (
        <div>
          {/* FULL-WIDTH HERO */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className={`relative bg-gradient-to-br from-brand/30 via-purple-600/20 to-transparent border-b border-white/10 overflow-hidden`}
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0di00aDR2NGgtNHptMC02di00aDR2NGgtNHptNiA2di00aDR2NGgtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50" />
            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
              <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
                {/* Left: Icon + Title */}
                <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.3 }}
                  className="text-6xl sm:text-7xl lg:text-8xl flex-shrink-0">
                  {persona.personaEmoji}
                </motion.div>

                {/* Center: Persona details */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="flex items-center gap-2 flex-wrap justify-center lg:justify-start mb-2">
                    <span className="inline-flex items-center gap-1 bg-white/10 text-cyan-300 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-white/10">🧬 DNA UNLOCKED</span>
                    <span className={`inline-flex items-center gap-1 bg-gradient-to-r ${rarity.color} text-white text-[10px] font-semibold px-2.5 py-1 rounded-full`}>
                      {rarity.tier === 'rare' ? '💎' : rarity.tier === 'uncommon' ? '🔷' : '🟦'} {rarity.label}
                    </span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">{persona.personaName}</h1>
                  <p className="text-cyan-300/80 text-sm mt-1">{persona.personalityTrait}</p>
                  <p className="text-white/40 text-[10px] mt-1">{rarity.desc}</p>
                  <p className="text-white/50 text-xs leading-relaxed mt-3 max-w-2xl">{persona.personaDescription}</p>
                </div>

                {/* Right: Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 lg:gap-3 flex-shrink-0 w-full lg:w-auto">
                  <StatBadge icon="⚡" label="XP" value={`${totalXp || DNA_UNLOCK_BONUS}`} />
                  <StatBadge icon="📝" label="Questions" value="36" />
                  <StatBadge icon="⏱️" label="Time" value="~8m" />
                  <StatBadge icon="🎯" label="Confidence" value={`${confidenceScore}%`} />
                </div>
              </div>

              {/* Achievements below */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                className="flex items-center gap-2 flex-wrap mt-4 justify-center lg:justify-start">
                {unlockedAchievements.map((a) => (
                  <div key={a.id} className="bg-white/5 rounded-xl px-2.5 py-1.5 border border-white/10 flex items-center gap-1.5" title={a.description}>
                    <span className="text-sm">{a.icon}</span>
                    <span className="text-[8px] text-white/50 font-medium">{a.title}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* ====== CONTENT GRID ====== */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            {/* Row 1: Learning Mix + Brain Dominance side-by-side */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Learning Mix */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-5">
                <p className="text-xs text-white/40 font-semibold uppercase tracking-wider mb-4">Your Learning Mix</p>
                <div className="flex items-center gap-6">
                  <LearningMixRing scores={allScores} dominant={varkResult.dominantStyle} size="small" />
                  <div className="flex-1 space-y-2">
                    {allScores.sort((a, b) => b.score - a.score).map((s, i) => {
                      const pct = total > 0 ? Math.round((s.score / total) * 100) : 0;
                      return (
                        <div key={s.label} className="flex items-center gap-2">
                          <span className="text-xs w-4 flex-shrink-0">{s.config.icon}</span>
                          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div className={`h-full rounded-full ${s.config.bar}`}
                              initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: 1.2 + i * 0.1 }} />
                          </div>
                          <span className="text-[10px] font-bold text-white w-8 text-right">{s.score}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Brain Dominance */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg">{brainTypeInfo.emoji}</span>
                  <div>
                    <p className="text-xs text-white/40 font-semibold uppercase tracking-wider">Brain Dominance</p>
                    <p className="text-sm font-bold text-white">{brainResult.dominance}</p>
                  </div>
                </div>
                <BrainGauge leftPercent={brainResult.leftPercent} rightPercent={brainResult.rightPercent} />
              </div>
            </motion.div>

            {/* Row 2: Strengths + Growth side-by-side */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-5">
                <p className="text-xs text-white/40 font-semibold uppercase tracking-wider mb-3 flex items-center gap-1">💪 Key Strengths</p>
                <ul className="space-y-2">
                  {persona.combinedStrengths.slice(0, 4).map((s, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 text-[8px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5 text-white">{i + 1}</span>
                      <span className="text-xs text-white/70 leading-relaxed">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-5">
                <p className="text-xs text-white/40 font-semibold uppercase tracking-wider mb-3 flex items-center gap-1">🌱 Growth Areas</p>
                <ul className="space-y-2">
                  {persona.combinedGrowthAreas.slice(0, 4).map((a, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-[8px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                      <span className="text-xs text-white/70 leading-relaxed">{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Row 3: AI Buddy — highlighted */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="bg-gradient-to-r from-cyan-500/10 via-brand/10 to-purple-500/10 backdrop-blur-sm rounded-2xl border border-brand/20 p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-brand flex items-center justify-center shadow-lg shadow-brand/20">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">AI Study Buddy: {persona.personaName} Mode</p>
                  <p className="text-[10px] text-white/40">Brainify AI will adapt to your combined learning profile automatically</p>
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{persona.personaEmoji}</span>
                  <span className="font-bold text-white text-xs">{persona.personaName} Adaptation</span>
                </div>
                <p className="text-xs text-white/60 leading-relaxed">{persona.aiAdaptation}</p>
              </div>
            </motion.div>

            {/* Row 4: Mindset Tip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
              className="bg-gradient-to-br from-brand/20 to-purple-500/20 rounded-2xl p-5 text-center border border-white/10"
            >
              <span className="text-2xl block mb-1">💡</span>
              <p className="text-white text-xs leading-relaxed italic max-w-2xl mx-auto">&ldquo;{persona.mindsetTip}&rdquo;</p>
            </motion.div>

            {/* Row 5: Collapsible Detailed Report */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7 }}
            >
              <button onClick={() => setShowDetails(!showDetails)}
                className="w-full bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 flex items-center justify-between hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-lg">📋</span>
                  <span className="text-sm font-bold text-white">Detailed Report</span>
                  <span className="text-[9px] text-white/30">Learning Environment &bull; Study Habits &bull; Productivity</span>
                </div>
                <motion.svg animate={{ rotate: showDetails ? 180 : 0 }} className="w-4 h-4 text-white/40 flex-shrink-0"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></motion.svg>
              </button>

              <AnimatePresence>
                {showDetails && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                    <div className="pt-3 space-y-4">
                      {[
                        { title: '🏠 Learning Environment', icon: '🏠', data: envRecs, accent: 'text-cyan-400' },
                        { title: '📚 Study Habits', icon: '📚', data: habitRecs, accent: 'text-purple-400' },
                        { title: '⚡ Productivity', icon: '⚡', data: prodRecs, accent: 'text-amber-400' },
                      ].map((section) => (
                        <div key={section.title} className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-5">
                          <p className="text-xs text-white/40 font-semibold uppercase tracking-wider mb-3">{section.title}</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {section.data.map((rec) => (
                              <div key={rec.title} className="bg-white/[0.02] rounded-xl p-3.5 border border-white/5">
                                <span className="text-xl block mb-2">{rec.icon}</span>
                                <p className="text-sm font-bold text-white mb-1">{rec.title}</p>
                                <p className="text-[10px] text-white/40 mb-2 leading-relaxed">{rec.description}</p>
                                <ul className="space-y-1">
                                  {rec.tips.map((tip, j) => (
                                    <li key={j} className="text-[9px] text-white/40 flex items-start gap-1.5"><span className={`${section.accent} mt-0.5`}>▸</span>{tip}</li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 pb-10">
              <Link href="/dashboard" className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-brand text-white font-bold text-sm py-3 px-8 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-brand/20 hover:shadow-xl transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                Go to Dashboard
              </Link>
              <Link href="/vark" className="w-full sm:w-auto bg-white/5 text-white/60 font-bold text-sm py-3 px-8 rounded-2xl flex items-center justify-center gap-2 border border-white/10 hover:bg-white/10 transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582a7.5 7.5 0 0110.862-2.55M4 20v-5h.582a7.5 7.5 0 0010.862 2.55" /><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M17.5 17.5l3.5-3.5-3.5-3.5" /></svg>
                Retake
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}