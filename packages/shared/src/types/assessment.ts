export interface VarkScores {
  visual: number;
  aural: number;
  readWrite: number;
  kinesthetic: number;
}

export interface VarkResult {
  scores: VarkScores;
  preference: 'Visual' | 'Aural' | 'Read/Write' | 'Kinesthetic';
  note: string;
}

export interface BrainResult {
  score: number;
  brainType:
    | 'Strong Left Brain'
    | 'Moderate Left Brain'
    | 'Balanced Brain'
    | 'Moderate Right Brain'
    | 'Strong Right Brain';
  note: string;
}

export interface VarkAnswer {
  questionId: number;
  answers: string[];
}

export interface BrainAnswer {
  questionId: string;
  answer: string;
}