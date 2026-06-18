export interface BrainRecommendation {
  title: string;
  subtitle: string;
  description: string;
  strengths: string[];
  challenges: string[];
  studyStrategies: string[];
  careers: string[];
  aiAdaptation: string;
}

export const brainRecommendations: Record<string, BrainRecommendation> = {
  'Strong Left Brain': {
    title: 'Strong Left Brain Dominance',
    subtitle: 'The Analyst',
    description: 'Your thinking is highly structured, logical, and analytical. You excel at breaking down complex problems into manageable parts, following sequential processes, and making decisions based on objective data.',
    strengths: [
      'Excellent analytical and critical thinking skills',
      'Strong at mathematical and logical reasoning',
      'Thrives with structured routines and schedules',
      'Effective at verbal communication and writing',
      'Good at paying attention to details and accuracy',
    ],
    challenges: [
      'May struggle with open-ended, ambiguous situations',
      'Can be overly critical of intuitive or creative approaches',
      'Sometimes misses the big picture while focusing on details',
      'May find it difficult to relax without a plan',
    ],
    studyStrategies: [
      'Create detailed outlines and structured study schedules',
      'Use logic-based mnemonics and categorization techniques',
      'Break complex topics into smaller, manageable chunks',
      'Practice explaining concepts in a linear, step-by-step manner',
      'Use spreadsheets and data analysis to track progress',
    ],
    careers: ['Data Scientist', 'Accountant', 'Software Engineer', 'Lawyer', 'Financial Analyst', 'Researcher', 'Editor', 'Project Manager'],
    aiAdaptation: 'Your AI Study Buddy will present information in a structured, logical format — using step-by-step explanations, clear definitions, bullet-point summaries, and analytical frameworks. Expect data-driven insights and systematic breakdowns of complex topics.',
  },
  'Moderate Left Brain': {
    title: 'Moderate Left Brain Tendency',
    subtitle: 'The Organizer',
    description: 'You show a preference for logical, structured thinking while maintaining some flexibility for creative approaches. You balance analytical rigor with an openness to new ideas.',
    strengths: [
      'Good analytical skills with room for creativity',
      'Balances structure with adaptability',
      'Effective at both detailed work and big-picture thinking',
      'Can switch between logical and intuitive approaches',
      'Strong organizational skills',
    ],
    challenges: [
      'May feel torn between structure and spontaneity',
      'Can overthink decisions when logic conflicts with intuition',
      'Sometimes struggles to commit to a single approach',
    ],
    studyStrategies: [
      'Combine structured notes with creative mind maps',
      'Use both logical outlines and visual summaries',
      'Alternate between focused study sessions and free exploration',
      'Practice explaining concepts both analytically and creatively',
    ],
    careers: ['Business Analyst', 'Teacher', 'Product Manager', 'Consultant', 'Marketing Manager', 'Architect', 'Engineer', 'UX Designer'],
    aiAdaptation: 'Your AI Study Buddy will blend structured explanations with creative insights — using logical frameworks alongside visual examples and real-world stories to keep you engaged across both thinking modes.',
  },
  'Balanced Brain': {
    title: 'Balanced Brain Dominance',
    subtitle: 'The Integrator',
    description: 'You have remarkable access to both left-brain and right-brain thinking. You can analyze data like an accountant and visualize possibilities like an artist. This cognitive flexibility is a rare and powerful advantage.',
    strengths: [
      'Exceptional cognitive flexibility across thinking modes',
      'Can approach problems from multiple perspectives',
      'Strong at both analytical reasoning and creative ideation',
      'Excellent at seeing both details and the big picture',
      'Adaptable to various learning and working environments',
    ],
    challenges: [
      'May struggle with prioritizing between logic and intuition',
      'Can feel pulled in different directions by competing approaches',
      'Sometimes takes longer to reach decisions due to processing multiple perspectives',
    ],
    studyStrategies: [
      'Alternate between analytical and creative study methods',
      'Use both structured outlines and visual mind maps',
      'Engage with material through both logical analysis and creative projects',
      'Teach concepts to others using multiple approaches',
      'Leverage your adaptability to match study methods to subject matter',
    ],
    careers: ['Entrepreneur', 'Product Designer', 'Creative Director', 'Innovation Manager', 'Architect', 'Psychologist', 'CEO', 'Systems Thinker'],
    aiAdaptation: 'Your AI Study Buddy will offer a rich blend of both analytical and creative approaches — you can toggle between structured explanations and visual, intuitive formats. Expect a fully customizable learning experience that adapts to how you want to learn each topic.',
  },
  'Moderate Right Brain': {
    title: 'Moderate Right Brain Tendency',
    subtitle: 'The Innovator',
    description: 'You lean toward intuitive, creative thinking while maintaining respect for structure and logic. You see possibilities where others see limitations and value both imagination and practicality.',
    strengths: [
      'Strong creative and intuitive thinking abilities',
      'Good at seeing patterns and making connections',
      'Balances imagination with practical considerations',
      'Open to new ideas and alternative approaches',
      'Effective at visual and spatial reasoning',
    ],
    challenges: [
      'May sometimes overlook important details',
      'Can struggle with overly structured or rigid environments',
      'May find it challenging to follow strict sequential processes',
    ],
    studyStrategies: [
      'Use visual aids, diagrams, and mind maps extensively',
      'Connect new concepts to real-world applications and stories',
      'Study in varied environments to stimulate creative thinking',
      'Group study and discussions to explore different perspectives',
      'Incorporate music, art, or movement into study sessions',
    ],
    careers: ['Graphic Designer', 'Marketing Creative', 'Innovation Consultant', 'Film Director', 'Artist', 'Product Designer', 'Writer', 'Entrepreneur'],
    aiAdaptation: 'Your AI Study Buddy will use rich visual and narrative-based explanations — incorporating stories, analogies, visual examples, and creative connections. Information will be presented in a holistic, context-rich format that engages your intuition.',
  },
  'Strong Right Brain': {
    title: 'Strong Right Brain Dominance',
    subtitle: 'The Visionary',
    description: 'Your thinking is predominantly intuitive, holistic, and visually oriented. You excel at seeing the big picture, recognizing patterns, and thinking creatively. Your strength lies in imagination, spatial awareness, and emotional intelligence.',
    strengths: [
      'Exceptional creative and innovative thinking',
      'Strong visual and spatial reasoning abilities',
      'Excellent at reading emotions and social cues',
      'Sees patterns and connections others miss',
      'Thinks holistically — understands systems as a whole',
    ],
    challenges: [
      'May struggle with rigid structure and strict deadlines',
      'Can find detailed, sequential tasks challenging',
      'Sometimes has difficulty explaining intuitive leaps logically',
      'May overlook factual details in favor of the big picture',
    ],
    studyStrategies: [
      'Use extensive visual aids — diagrams, charts, and illustrations',
      'Connect learning to stories, metaphors, and real-world examples',
      'Study in groups to leverage discussion and multiple perspectives',
      'Use color-coding and mind maps to organize information',
      'Take frequent breaks that involve movement or creative activities',
    ],
    careers: ['Artist', 'Musician', 'Therapist', 'Architect', 'Film Director', 'Fashion Designer', 'Photographer', 'Counselor'],
    aiAdaptation: 'Your AI Study Buddy will use highly visual, intuitive, and holistic teaching methods — emphasizing the big picture first, then exploring details through stories, images, and creative analogies. Lessons will feel like guided explorations rather than lectures.',
  },
};

export const brainTypeDescriptions: Record<string, { emoji: string; color: string; gradient: string }> = {
  'Strong Left Brain': { emoji: '🧠', color: 'text-blue-600 dark:text-blue-300', gradient: 'from-blue-600 to-indigo-700' },
  'Moderate Left Brain': { emoji: '🔷', color: 'text-blue-500 dark:text-blue-300', gradient: 'from-blue-500 to-indigo-600' },
  'Balanced Brain': { emoji: '⚖️', color: 'text-emerald-600 dark:text-emerald-300', gradient: 'from-emerald-500 to-teal-600' },
  'Moderate Right Brain': { emoji: '🎨', color: 'text-purple-500 dark:text-purple-300', gradient: 'from-purple-500 to-violet-600' },
  'Strong Right Brain': { emoji: '🌈', color: 'text-purple-600 dark:text-purple-300', gradient: 'from-purple-600 to-pink-600' },
};