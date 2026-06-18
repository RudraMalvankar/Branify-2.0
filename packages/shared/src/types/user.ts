export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserWithProfile extends User {
  bio?: string;
  avatarUrl?: string;
  timezone?: string;
  // VARK scores
  visual: number;
  aural: number;
  readWrite: number;
  kinesthetic: number;
  varkPreference: string;
  varkNote: string;
  // Brain scores
  brainScore: number;
  brainType: string;
  brainNote: string;
  // Activity
  totalSessions: number;
  streakDays: number;
  lastActive: string | null;
}

export interface UserCreateInput {
  name: string;
  email: string;
  password: string;
}

export interface UserLoginInput {
  email: string;
  password: string;
}