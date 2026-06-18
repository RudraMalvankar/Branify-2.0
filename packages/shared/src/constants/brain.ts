export const BRAIN_TOTAL_QUESTIONS = 21;

export const BRAIN_TYPE_THRESHOLDS = [
  { max: 5, type: 'Strong Left Brain' as const },
  { max: 8, type: 'Moderate Left Brain' as const },
  { max: 13, type: 'Balanced Brain' as const },
  { max: 16, type: 'Moderate Right Brain' as const },
  { max: 21, type: 'Strong Right Brain' as const },
];

export function getBrainType(score: number): string {
  for (const threshold of BRAIN_TYPE_THRESHOLDS) {
    if (score <= threshold.max) {
      return threshold.type;
    }
  }
  return 'Balanced Brain';
}