export interface BrainQuestion {
  id: string;
  text: string;
  category: string;
  optionA: string;
  optionB: string;
  // If true, optionA is right-brain; optionB is left-brain
  // If false, optionA is left-brain; optionB is right-brain
  rightIsA: boolean;
}

export const brainCategories = [
  { id: 'thinking', label: 'Thinking Style', icon: '💭', desc: 'How you process information and approach problems' },
  { id: 'learning', label: 'Learning Preference', icon: '📚', desc: 'Your natural approach to acquiring new knowledge' },
  { id: 'creativity', label: 'Creativity & Expression', icon: '🎨', desc: 'How you express ideas and think creatively' },
  { id: 'organization', label: 'Organization & Planning', icon: '📋', desc: 'Your approach to structure and planning' },
  { id: 'social', label: 'Social & Communication', icon: '💬', desc: 'How you interact and communicate with others' },
  { id: 'problem', label: 'Problem Solving', icon: '🧩', desc: 'Your method for tackling challenges' },
  { id: 'memory', label: 'Memory & Recall', icon: '🧠', desc: 'How you remember and retrieve information' },
  { id: 'decision', label: 'Decision Making', icon: '⚖️', desc: 'How you make choices and judgments' },
];

export const brainQuestions: BrainQuestion[] = [
  {
    id: 'b1',
    category: 'thinking',
    text: 'When solving a problem, I prefer to:',
    optionA: 'Look at the big picture and brainstorm possibilities',
    optionB: 'Analyze step-by-step using logic and data',
    rightIsA: true,
  },
  {
    id: 'b2',
    category: 'learning',
    text: 'I learn best when I:',
    optionA: 'Follow structured instructions and written guidelines',
    optionB: 'Explore freely and discover through hands-on experience',
    rightIsA: false,
  },
  {
    id: 'b3',
    category: 'creativity',
    text: 'When working on a creative project, I:',
    optionA: 'Follow a structured plan and refine as I go',
    optionB: 'Let ideas flow freely and see where they take me',
    rightIsA: false,
  },
  {
    id: 'b4',
    category: 'organization',
    text: 'My workspace and schedule are typically:',
    optionA: 'Organized and planned in advance',
    optionB: 'Flexible and adaptable to change',
    rightIsA: false,
  },
  {
    id: 'b5',
    category: 'social',
    text: 'In conversations, I tend to:',
    optionA: 'Focus on facts, details, and logical points',
    optionB: 'Read between the lines and focus on emotions',
    rightIsA: false,
  },
  {
    id: 'b6',
    category: 'problem',
    text: 'When faced with a challenge, I usually:',
    optionA: 'Trust my intuition and gut feeling',
    optionB: 'Analyze all options systematically',
    rightIsA: true,
  },
  {
    id: 'b7',
    category: 'memory',
    text: 'I remember things better when I:',
    optionA: 'See visual images and patterns',
    optionB: 'Recall facts, names, and specific details',
    rightIsA: true,
  },
  {
    id: 'b8',
    category: 'decision',
    text: 'When making decisions, I rely more on:',
    optionA: 'Logic, data, and objective analysis',
    optionB: 'Intuition, feelings, and personal values',
    rightIsA: false,
  },
  {
    id: 'b9',
    category: 'thinking',
    text: 'I am more comfortable with:',
    optionA: 'Abstract concepts and theoretical ideas',
    optionB: 'Concrete facts and practical applications',
    rightIsA: true,
  },
  {
    id: 'b10',
    category: 'learning',
    text: 'When studying, I prefer:',
    optionA: 'Visual aids like diagrams and mind maps',
    optionB: 'Written notes and detailed explanations',
    rightIsA: true,
  },
  {
    id: 'b11',
    category: 'creativity',
    text: 'I consider myself more:',
    optionA: 'Analytical and detail-oriented',
    optionB: 'Creative and big-picture oriented',
    rightIsA: false,
  },
  {
    id: 'b12',
    category: 'organization',
    text: 'When starting a project, I first:',
    optionA: 'Create a detailed timeline and checklist',
    optionB: 'Envision the end result and work backwards',
    rightIsA: false,
  },
  {
    id: 'b13',
    category: 'social',
    text: 'I prefer communication that is:',
    optionA: 'Direct, clear, and to the point',
    optionB: 'Expressive, nuanced, and context-rich',
    rightIsA: false,
  },
  {
    id: 'b14',
    category: 'problem',
    text: 'I solve problems better when I:',
    optionA: 'Break them down into smaller parts',
    optionB: 'See the problem as a whole system',
    rightIsA: false,
  },
  {
    id: 'b15',
    category: 'memory',
    text: 'I am better at remembering:',
    optionA: 'Faces and visual scenes',
    optionB: 'Names and specific information',
    rightIsA: true,
  },
  {
    id: 'b16',
    category: 'decision',
    text: 'I prefer decisions to be based on:',
    optionA: 'Objective facts and measurable data',
    optionB: 'Personal experiences and empathy',
    rightIsA: false,
  },
  {
    id: 'b17',
    category: 'thinking',
    text: 'I enjoy tasks that involve:',
    optionA: 'Pattern recognition and spatial reasoning',
    optionB: 'Sequential logic and verbal reasoning',
    rightIsA: true,
  },
  {
    id: 'b18',
    category: 'learning',
    text: 'When learning a new skill, I prefer:',
    optionA: 'Understanding the theory before practicing',
    optionB: 'Jumping in and learning by doing',
    rightIsA: false,
  },
  {
    id: 'b19',
    category: 'creativity',
    text: 'My creative process is best described as:',
    optionA: 'Spontaneous and inspired by emotions',
    optionB: 'Methodical and refined through iteration',
    rightIsA: true,
  },
  {
    id: 'b20',
    category: 'organization',
    text: 'I prefer instructions that are:',
    optionA: 'Visual with diagrams and examples',
    optionB: 'Written with clear step-by-step lists',
    rightIsA: true,
  },
];

export type BrainResult = {
  leftScore: number;
  rightScore: number;
  total: number;
  dominance: 'Strong Left Brain' | 'Moderate Left Brain' | 'Balanced Brain' | 'Moderate Right Brain' | 'Strong Right Brain';
  leftPercent: number;
  rightPercent: number;
};

export function calculateBrainScore(
  selections: Record<string, 'A' | 'B'>
): BrainResult {
  let leftScore = 0;
  let rightScore = 0;

  Object.entries(selections).forEach(([qId, answer]) => {
    const question = brainQuestions.find((q) => q.id === qId);
    if (!question) return;

    const selectedRight = (answer === 'A' && question.rightIsA) || (answer === 'B' && !question.rightIsA);
    if (selectedRight) {
      rightScore++;
    } else {
      leftScore++;
    }
  });

  const total = leftScore + rightScore;
  const leftPercent = total > 0 ? Math.round((leftScore / total) * 100) : 0;
  const rightPercent = total > 0 ? Math.round((rightScore / total) * 100) : 0;
  const diff = rightScore - leftScore;

  let dominance: BrainResult['dominance'];
  if (diff >= 6) dominance = 'Strong Right Brain';
  else if (diff >= 3) dominance = 'Moderate Right Brain';
  else if (diff <= -6) dominance = 'Strong Left Brain';
  else if (diff <= -3) dominance = 'Moderate Left Brain';
  else dominance = 'Balanced Brain';

  return { leftScore, rightScore, total, dominance, leftPercent, rightPercent };
}