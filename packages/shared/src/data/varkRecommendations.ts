export interface VarkRecommendation {
  careers: string[];
  studyTips: string[];
  aiAdaptation: string;
  improvementActivities: string[];
}

export const varkRecommendations: Record<string, VarkRecommendation> = {
  Visual: {
    careers: ['Graphic Designer', 'Architect', 'Data Visualizer', 'UI/UX Designer', 'Photographer', 'Video Editor', 'Fashion Designer', 'Cartographer'],
    studyTips: [
      'Use mind maps and flowcharts to organize concepts',
      'Color-code your notes by topic or theme',
      'Watch video tutorials before reading text instructions',
      'Draw diagrams to explain concepts to others',
      'Use flashcards with images and diagrams',
    ],
    aiAdaptation: 'Your AI Study Buddy will prioritize visual explanations — describing concepts through diagrams, spatial analogies, and imagery. Lessons will be formatted with rich visual layouts, charts, and infographics.',
    improvementActivities: [
      'Practice sketching concepts before writing about them',
      'Try explaining ideas using only drawings',
      'Create visual summaries after reading chapters',
    ],
  },
  Aural: {
    careers: ['Music Producer', 'Teacher', 'Podcast Host', 'Speech Therapist', 'Journalist', 'Therapist', 'Radio DJ', 'Voice Actor'],
    studyTips: [
      'Record yourself summarizing lessons and listen back',
      'Join study groups for verbal discussions',
      'Use rhymes and mnemonics to memorize facts',
      'Explain concepts out loud to a friend',
      'Listen to educational podcasts related to your subject',
    ],
    aiAdaptation: 'Your AI Study Buddy will use a conversational, discussion-based approach — explaining topics through verbal analogies, mnemonics, and Q&A dialogues. Expect to hear concepts explained like a tutor would.',
    improvementActivities: [
      'Start a study podcast with a classmate',
      'Verbally summarize chapters before moving on',
      'Record voice memos of key concepts',
    ],
  },
  'Read/Write': {
    careers: ['Author', 'Editor', 'Lawyer', 'Researcher', 'Journalist', 'Content Writer', 'Academic', 'Technical Writer'],
    studyTips: [
      'Rewrite notes in your own words after class',
      'Create detailed outlines and summaries',
      'Read textbooks and articles actively with a highlighter',
      'Write practice essays and get feedback',
      'Keep a learning journal for each subject',
    ],
    aiAdaptation: 'Your AI Study Buddy will deliver well-structured, text-based explanations — definitions, lists, bullet-point summaries, and note-style answers. You\'ll get detailed reading lists and written examples.',
    improvementActivities: [
      'Try writing one-paragraph summaries of everything you learn',
      'Create glossaries of new terminology',
      'Rewrite complex concepts for a younger audience',
    ],
  },
  Kinesthetic: {
    careers: ['Surgeon', 'Athlete', 'Chef', 'Engineer', 'Physical Therapist', 'Dancer', 'Mechanic', 'Park Ranger'],
    studyTips: [
      'Use physical objects and models to understand concepts',
      'Take frequent movement breaks between study sessions',
      'Role-play scenarios related to your subject',
      'Build prototypes or models of what you\'re learning',
      'Stand up and walk around while reviewing notes',
    ],
    aiAdaptation: 'Your AI Study Buddy will focus on real-world applications and hands-on examples — describing step-by-step processes, experiments you can try, and action-oriented learning activities.',
    improvementActivities: [
      'Find real-world applications for every concept',
      'Teach concepts by demonstrating physically',
      'Build something related to what you\'re learning',
    ],
  },
};

export const multimodalDescription = {
  title: 'Multimodal Learner',
  desc: 'You show strong preferences across multiple learning styles, making you a versatile and adaptive learner. You can switch between different modes of learning depending on the context, which is a significant advantage in complex, real-world environments.',
  badge: '🌟 Versatile Learner',
};