export const VARK_STYLES = ['Visual', 'Aural', 'Read/Write', 'Kinesthetic'] as const;

export type VarkStyle = (typeof VARK_STYLES)[number];

export const VARK_STYLE_EMOJIS: Record<VarkStyle, string> = {
  Visual: '👁️',
  Aural: '👂',
  'Read/Write': '📖',
  Kinesthetic: '🖐️',
};

export const VARK_STYLE_COLORS: Record<VarkStyle, string> = {
  Visual: '#4361EE',
  Aural: '#F72585',
  'Read/Write': '#4CC9F0',
  Kinesthetic: '#7209B7',
};

export const VARK_TOTAL_QUESTIONS = 16;