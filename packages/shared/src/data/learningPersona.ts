import { type VarkResult } from './varkQuestions';
import { type BrainResult } from './brainQuestions';

export interface UnifiedResult {
  vark: VarkResult;
  brain: BrainResult;
}

export interface LearningPersona {
  personaName: string;
  personaEmoji: string;
  personaDescription: string;
  personalityTrait: string;
  combinedStrengths: string[];
  combinedGrowthAreas: string[];
  studyRecommendations: string[];
  aiAdaptation: string;
  careerSuggestions: string[];
  mindsetTip: string;
}

function getPersonaKey(varkStyle: string, brainType: string): string {
  const brainSide = brainType.includes('Right') ? 'right' : brainType.includes('Left') ? 'left' : 'balanced';
  return `${varkStyle.toLowerCase()}-${brainSide}`;
}

const personaMap: Record<string, LearningPersona> = {
  // Visual combinations
  'visual-right': {
    personaName: 'Creative Visual Thinker',
    personaEmoji: '🎨',
    personaDescription: 'You see the world through images and intuition. Your mind naturally connects visual patterns with creative possibilities, making you an exceptional innovator and designer.',
    personalityTrait: 'The Visionary Creator',
    combinedStrengths: [
      'Exceptional spatial reasoning and visual creativity',
      'Strong pattern recognition across complex systems',
      'Excellent at visualizing abstract concepts',
      'Natural ability to think both holistically and creatively',
      'Intuitive understanding of design and aesthetics',
    ],
    combinedGrowthAreas: [
      'May struggle with detailed sequential instructions',
      'Can find rigid, text-heavy environments challenging',
      'Sometimes prioritizes visual appeal over functional details',
      'May need help translating creative visions into structured plans',
    ],
    studyRecommendations: [
      'Use mind maps, diagrams, and visual frameworks to organize thoughts',
      'Create vision boards and mood boards for project planning',
      'Combine sketching with free association to explore ideas',
      'Use color-coded systems that allow for flexible reorganization',
      'Study in visually stimulating environments with natural light',
    ],
    aiAdaptation: 'Your AI Study Buddy will combine rich visual explanations with intuitive, big-picture thinking. Expect beautifully formatted content that emphasizes patterns, connections, and creative possibilities — all while respecting your holistic learning approach.',
    careerSuggestions: ['Creative Director', 'Architect', 'UX/UI Designer', 'Visual Artist', 'Film Director', 'Brand Strategist', 'Interior Designer', 'Innovation Consultant'],
    mindsetTip: 'Your strength is seeing what others can\'t imagine. Use visual journals to capture your ideas before they fade.',
  },
  'visual-left': {
    personaName: 'Analytical Visualizer',
    personaEmoji: '📊',
    personaDescription: 'You combine the power of visual thinking with analytical precision. Charts, graphs, and data visualizations are your superpower — you see patterns others miss and can explain them with clarity.',
    personalityTrait: 'The Data Visualizer',
    combinedStrengths: [
      'Excellent at creating and interpreting data visualizations',
      'Strong analytical skills with visual presentation ability',
      'Can break down complex data into clear visual stories',
      'Precise attention to detail in visual layouts',
      'Effective at combining logic with visual communication',
    ],
    combinedGrowthAreas: [
      'May over-analyze visual information',
      'Can struggle with ambiguous or unstructured creative tasks',
      'Sometimes gets lost in visual details at expense of big picture',
      'May find purely intuitive approaches uncomfortable',
    ],
    studyRecommendations: [
      'Transform data into charts, graphs, and infographics',
      'Create structured visual outlines before diving into details',
      'Use flowcharts and decision trees for complex topics',
      'Build visual databases and organized reference systems',
      'Combine note-taking with diagramming for maximum retention',
    ],
    aiAdaptation: 'Your AI Study Buddy will present information through structured visual frameworks — think organized charts, clean infographics, and logical diagrams that follow clear, sequential patterns while remaining visually engaging.',
    careerSuggestions: ['Data Scientist', 'Business Analyst', 'Information Designer', 'GIS Specialist', 'Technical Illustrator', 'UX Researcher', 'Financial Analyst', 'Scientific Visualizer'],
    mindsetTip: 'Your gift is making the complex clear. Keep asking "how can I show this visually?" — your best insights come through visualization.',
  },
  'visual-balanced': {
    personaName: 'Visual Integrator',
    personaEmoji: '🔮',
    personaDescription: 'You possess a rare balance of visual thinking and cognitive flexibility. You can switch between analytical and creative modes while maintaining a strong visual orientation.',
    personalityTrait: 'The Adaptive Visionary',
    combinedStrengths: [
      'Exceptional cognitive flexibility with visual strengths',
      'Can adapt visual thinking to both analytical and creative contexts',
      'Strong at integrating multiple perspectives',
      'Natural mediator between creative and analytical teams',
      'Versatile problem-solving across domains',
    ],
    combinedGrowthAreas: [
      'May struggle with prioritizing between approaches',
      'Can spread energy across too many directions',
      'Sometimes takes longer to commit to a single visual direction',
      'May need help narrowing focus',
    ],
    studyRecommendations: [
      'Alternate between structured diagrams and free-form mind maps',
      'Use both analytical frameworks and creative visual tools',
      'Experiment with different visual formats for each subject',
      'Teach concepts using multiple visual approaches',
      'Leverage adaptability to match study methods to content',
    ],
    aiAdaptation: 'Your AI Study Buddy offers a rich blend of visual formats — switching between analytical charts and creative imagery based on the topic. You can toggle between structured and free-form visual learning modes.',
    careerSuggestions: ['Design Thinker', 'Product Manager', 'Creative Technologist', 'Innovation Lead', 'Systems Designer', 'Strategic Consultant', 'Creative Director', 'Entrepreneur'],
    mindsetTip: 'Your versatility is your greatest asset. Don\'t feel pressured to choose one approach — your strength is adapting how you see.',
  },

  // Aural combinations
  'aural-right': {
    personaName: 'Creative Communicator',
    personaEmoji: '🎙️',
    personaDescription: 'Words and emotions flow through you naturally. You combine deep listening with creative intuition, making you a powerful storyteller and empathetic communicator who connects with others effortlessly.',
    personalityTrait: 'The Expressive Storyteller',
    combinedStrengths: [
      'Exceptional verbal and emotional communication',
      'Strong storytelling ability with creative flair',
      'Excellent at reading rooms and understanding others',
      'Natural facilitator of group discussions',
      'Can inspire and motivate through speech',
    ],
    combinedGrowthAreas: [
      'May struggle with written documentation',
      'Can find silent, individual work challenging',
      'Sometimes prioritizes emotional resonance over factual accuracy',
      'May need help organizing verbal ideas into structured formats',
    ],
    studyRecommendations: [
      'Record and discuss ideas with study groups',
      'Turn concepts into stories, podcasts, or verbal explanations',
      'Use voice memos to capture and organize thoughts',
      'Teach concepts to others through discussion',
      'Combine verbal learning with creative expression',
    ],
    aiAdaptation: 'Your AI Study Buddy engages you through rich conversational exchanges — using storytelling, verbal analogies, and emotive language. Lessons feel like inspiring discussions rather than lectures.',
    careerSuggestions: ['Podcast Host', 'Speechwriter', 'Therapist', 'Teacher', 'Storyteller', 'Public Speaker', 'Counselor', 'Creative Writer'],
    mindsetTip: 'Your voice is your instrument. Record your thoughts, tell your stories — the world needs to hear your perspective.',
  },
  'aural-left': {
    personaName: 'Analytical Communicator',
    personaEmoji: '🎯',
    personaDescription: 'You think with precision and communicate with purpose. Your logical mind organizes thoughts into clear, compelling arguments that convince and clarify.',
    personalityTrait: 'The Logical Orator',
    combinedStrengths: [
      'Exceptional verbal reasoning and logical argumentation',
      'Clear, structured communication style',
      'Strong at debate and persuasive speaking',
      'Can explain complex ideas in simple terms',
      'Excellent at verbal problem-solving',
    ],
    combinedGrowthAreas: [
      'May come across as overly critical in discussions',
      'Can struggle with emotionally charged conversations',
      'Sometimes prioritizes logic over empathy',
      'May find creative brainstorming sessions frustrating',
    ],
    studyRecommendations: [
      'Engage in structured debates and discussions',
      'Record logical explanations and review them',
      'Create verbal outlines before writing',
      'Join or form study groups focused on analysis',
      'Practice explaining concepts in sequential, logical order',
    ],
    aiAdaptation: 'Your AI Study Buddy uses clear, logical conversation — presenting arguments, evidence, and structured verbal explanations. Expect Socratic-style dialogue that sharpens your thinking.',
    careerSuggestions: ['Lawyer', 'Debater', 'Policy Analyst', 'Professor', 'Journalist', 'Consultant', 'Mediator', 'Technical Writer'],
    mindsetTip: 'Your precision with words is a superpower. Use it to clarify, not to criticize — your logic can illuminate paths for others.',
  },
  'aural-balanced': {
    personaName: 'Versatile Dialoguer',
    personaEmoji: '💬',
    personaDescription: 'You navigate conversations with remarkable adaptability — equally comfortable in analytical debates and creative brainstorming sessions.',
    personalityTrait: 'The Balanced Conversationalist',
    combinedStrengths: [
      'Can adapt communication style to any audience',
      'Strong at both analytical discussion and creative dialogue',
      'Excellent mediator and facilitator',
      'Natural at synthesizing different viewpoints',
      'Versatile verbal communicator',
    ],
    combinedGrowthAreas: [
      'May struggle to commit to a single communication style',
      'Can spread conversational energy too thin',
      'Sometimes needs time to process before speaking',
      'May find it hard to choose between logic and emotion',
    ],
    studyRecommendations: [
      'Mix structured discussions with creative brainstorming',
      'Use both logical debate and storytelling techniques',
      'Lead study groups to practice adaptive communication',
      'Record and analyze your own verbal explanations',
      'Experiment with different communication styles per subject',
    ],
    aiAdaptation: 'Your AI Study Buddy adapts its conversational style to suit the topic — switching between analytical dialogue and creative discussion seamlessly based on what you need.',
    careerSuggestions: ['Diplomat', 'Host', 'Coach', 'Facilitator', 'Communications Director', 'Therapist', 'Professor', 'Public Affairs Specialist'],
    mindsetTip: 'Your ability to speak to anyone is rare. Use it to build bridges between different perspectives.',
  },

  // Read/Write combinations
  'read/write-right': {
    personaName: 'Creative Scribe',
    personaEmoji: '✍️',
    personaDescription: 'You blend the written word with creative intuition. Your writing is not just precise but evocative — you can craft documents that inform and inspire.',
    personalityTrait: 'The Inspired Writer',
    combinedStrengths: [
      'Strong writing skills with creative flair',
      'Can produce both technical and creative content',
      'Excellent at translating abstract ideas into written form',
      'Natural at narrative and descriptive writing',
      'Combines research skills with imaginative expression',
    ],
    combinedGrowthAreas: [
      'May struggle with strict formatting requirements',
      'Can get lost in creative tangents while writing',
      'Sometimes prioritizes style over substance',
      'May find data-heavy writing restrictive',
    ],
    studyRecommendations: [
      'Keep a creative journal alongside structured notes',
      'Write both analytical summaries and creative reflections',
      'Use writing as a tool for both analysis and expression',
      'Create study documents that blend facts with narratives',
      'Rewrite concepts in different written formats',
    ],
    aiAdaptation: 'Your AI Study Buddy delivers information through beautifully crafted written content — blending precise definitions with evocative descriptions and narrative examples.',
    careerSuggestions: ['Creative Writer', 'Content Strategist', 'Copywriter', 'Journalist', 'Author', 'Editor', 'Screenwriter', 'Brand Writer'],
    mindsetTip: 'Your words paint pictures AND build arguments. The world needs both — never feel you have to choose.',
  },
  'read/write-left': {
    personaName: 'Structured Knowledge Builder',
    personaEmoji: '📚',
    personaDescription: 'You are a natural scholar who builds knowledge systematically. Your love for reading, writing, and logical organization makes you a master of structured learning.',
    personalityTrait: 'The Systematic Scholar',
    combinedStrengths: [
      'Exceptional at creating structured notes and outlines',
      'Strong research and analytical writing skills',
      'Excellent at building comprehensive knowledge systems',
      'Natural at creating study guides and reference materials',
      'Precise and accurate in written communication',
    ],
    combinedGrowthAreas: [
      'May struggle with creative or open-ended writing tasks',
      'Can be overly reliant on written materials',
      'Sometimes gets lost in details at expense of synthesis',
      'May find visual or verbal learning methods less comfortable',
    ],
    studyRecommendations: [
      'Create detailed outlines before studying any topic',
      'Build comprehensive notes, summaries, and reference sheets',
      'Write and rewrite concepts in your own words',
      'Develop systematic study schedules and track progress',
      'Create practice tests and written assessments',
    ],
    aiAdaptation: 'Your AI Study Buddy presents well-structured, text-rich content — definitions, lists, summaries, and detailed explanations organized in clear hierarchical formats.',
    careerSuggestions: ['Researcher', 'Academic', 'Editor', 'Technical Writer', 'Policy Analyst', 'Lawyer', 'Librarian', 'Grant Writer'],
    mindsetTip: 'Your systematic mind builds knowledge that lasts. Share your notes and systems — others can learn from your structure.',
  },
  'read/write-balanced': {
    personaName: 'Adaptive Scholar',
    personaEmoji: '📖',
    personaDescription: 'You combine the precision of written learning with remarkable cognitive flexibility. Your reading and writing skills are enhanced by your ability to adapt approaches.',
    personalityTrait: 'The Flexible Intellectual',
    combinedStrengths: [
      'Strong written communication with adaptive thinking',
      'Can switch between detailed analysis and creative synthesis',
      'Excellent at integrating multiple sources and perspectives',
      'Natural at creating comprehensive yet accessible documents',
      'Versatile in both academic and creative writing contexts',
    ],
    combinedGrowthAreas: [
      'May struggle to choose between comprehensive and concise writing',
      'Can over-research before starting to write',
      'Sometimes needs help prioritizing information',
      'May find it hard to decide on a single writing approach',
    ],
    studyRecommendations: [
      'Mix detailed outlines with creative written reflections',
      'Use both structured note-taking and free-writing techniques',
      'Create study materials that work across different formats',
      'Experiment with various written documentation styles',
      'Build flexible knowledge systems that can adapt',
    ],
    aiAdaptation: 'Your AI Study Buddy offers written content in multiple formats — from structured outlines to creative narratives — allowing you to choose the best style for each topic.',
    careerSuggestions: ['Writer', 'Editor', 'Content Manager', 'Researcher', 'Publishing Professional', 'Curriculum Developer', 'Documentation Lead', 'Academic Writer'],
    mindsetTip: 'Your adaptability in writing is rare. Use it to translate complex ideas for different audiences.',
  },

  // Kinesthetic combinations
  'kinesthetic-right': {
    personaName: 'Experiential Creator',
    personaEmoji: '🔧',
    personaDescription: 'You learn by doing, and you create with intuition. Your hands and heart work together to build, make, and experience the world in ways that others can only imagine.',
    personalityTrait: 'The Hands-On Innovator',
    combinedStrengths: [
      'Exceptional hands-on learning and creative making',
      'Strong intuitive understanding of physical systems',
      'Excellent at prototyping and iterative creation',
      'Natural at learning through experimentation',
      'Combines physical skill with creative vision',
    ],
    combinedGrowthAreas: [
      'May struggle with theoretical or abstract concepts',
      'Can find static learning environments challenging',
      'Sometimes prioritizes action over planning',
      'May need help documenting creative processes',
    ],
    studyRecommendations: [
      'Build physical models and prototypes of concepts',
      'Use role-play and physical movement to learn',
      'Take frequent hands-on breaks between study sessions',
      'Create real-world projects that apply what you learn',
      'Combine physical activities with creative exploration',
    ],
    aiAdaptation: 'Your AI Study Buddy provides action-oriented learning — real-world projects, step-by-step hands-on guides, and creative experiments you can physically try.',
    careerSuggestions: ['Inventor', 'Product Designer', 'Chef', 'Sculptor', 'Engineer', 'Artisan', 'Furniture Maker', 'Experiential Designer'],
    mindsetTip: 'Your hands are your greatest teachers. Don\'t let anyone tell you that "doing" isn\'t learning — it\'s the deepest form.',
  },
  'kinesthetic-left': {
    personaName: 'Precision Practitioner',
    personaEmoji: '⚙️',
    personaDescription: 'You combine hands-on learning with analytical precision. Your ability to execute tasks methodically while learning through practice makes you a master craftsperson.',
    personalityTrait: 'The Methodical Maker',
    combinedStrengths: [
      'Excellent hands-on skills with systematic approach',
      'Strong at following technical procedures precisely',
      'Natural at troubleshooting and practical problem-solving',
      'Combines physical dexterity with logical thinking',
      'Effective at optimizing physical processes',
    ],
    combinedGrowthAreas: [
      'May struggle with abstract or theoretical concepts',
      'Can be overly rigid in following procedures',
      'Sometimes misses creative alternatives',
      'May find open-ended projects uncomfortable',
    ],
    studyRecommendations: [
      'Follow structured lab exercises and practical guides',
      'Create systematic checklists for hands-on tasks',
      'Build physical models that demonstrate concepts',
      'Practice skills in structured, repeatable sessions',
      'Document procedures and processes in detail',
    ],
    aiAdaptation: 'Your AI Study Buddy delivers step-by-step practical guides, structured hands-on exercises, and methodical real-world applications that respect your systematic approach.',
    careerSuggestions: ['Surgeon', 'Engineer', 'Technician', 'Pilot', 'Master Craftsperson', 'Lab Researcher', 'Mechanic', 'Architect'],
    mindsetTip: 'Your precision makes you reliable. Your hands make you capable. Together, they make you unstoppable.',
  },
  'kinesthetic-balanced': {
    personaName: 'Versatile Practitioner',
    personaEmoji: '🛠️',
    personaDescription: 'You bring both hands-on expertise and cognitive flexibility to everything you do. Whether following a procedure or improvising a solution, you adapt seamlessly.',
    personalityTrait: 'The Adaptive Maker',
    combinedStrengths: [
      'Strong practical skills with adaptive thinking',
      'Can follow procedures or improvise as needed',
      'Excellent at learning through varied hands-on approaches',
      'Natural at switching between structured and creative making',
      'Versatile problem-solving in physical contexts',
    ],
    combinedGrowthAreas: [
      'May struggle with choosing between following and improvising',
      'Can spread practical energy across too many projects',
      'Sometimes needs help committing to one approach',
      'May find it hard to document processes consistently',
    ],
    studyRecommendations: [
      'Mix structured practice with creative experimentation',
      'Use both guided projects and self-directed exploration',
      'Build a portfolio of varied hands-on learning experiences',
      'Alternate between following procedures and innovating',
      'Create flexible learning spaces that support different modes',
    ],
    aiAdaptation: 'Your AI Study Buddy offers both structured guides and open-ended projects — letting you choose between following precise steps or exploring freely based on each topic.',
    careerSuggestions: ['Innovator', 'Product Developer', 'Maker', 'Engineer', 'Designer', 'Entrepreneur', 'Artisan', 'Technical Director'],
    mindsetTip: 'Your ability to both follow and improvise is rare. Trust your hands AND your adaptability.',
  },
};

export function getLearningPersona(varkResult: VarkResult, brainResult: BrainResult): LearningPersona {
  const key = getPersonaKey(varkResult.dominantStyle, brainResult.dominance);
  const persona = personaMap[key];
  if (!persona) {
    // Fallback: return generic persona
    return {
      personaName: `${varkResult.dominantStyle} Learner`,
      personaEmoji: '🧠',
      personaDescription: `You have a ${varkResult.dominantStyle} learning preference with a ${brainResult.dominance} brain profile.`,
      personalityTrait: 'The Unique Learner',
      combinedStrengths: [
        'A unique combination of learning preferences',
        'Flexibility in how you approach new information',
        'Natural ability to learn in your own way',
        'Growing self-awareness of your learning style',
        'Potential to develop multimodal learning skills',
      ],
      combinedGrowthAreas: [
        'Continue exploring your learning preferences',
        'Practice adapting to different learning contexts',
        'Build on your natural strengths while developing others',
      ],
      studyRecommendations: [
        'Experiment with different study methods to find what works best',
        'Combine your VARK and brain preferences for optimal learning',
        'Track what methods work best for different subjects',
        'Stay open to trying new learning approaches',
        'Build a personalized study routine based on your profile',
      ],
      aiAdaptation: `Your AI Study Buddy will adapt to your ${varkResult.dominantStyle} learning style and ${brainResult.dominance} thinking patterns, creating a personalized learning experience that respects your unique cognitive profile.`,
      careerSuggestions: ['Consultant', 'Entrepreneur', 'Researcher', 'Educator', 'Innovation Lead', 'Coach', 'Project Manager', 'Creative Technologist'],
      mindsetTip: 'Your unique combination of traits makes you one of a kind. Embrace your personal learning style — it\'s your superpower.',
    };
  }
  return persona;
}

export function generateLearningDNA(
  varkResult: VarkResult,
  brainResult: BrainResult
): {
  primaryLearningStyle: string;
  secondaryLearningStyle: string | null;
  brainType: string;
  combinedPersona: LearningPersona;
} {
  const allVark = [
    { label: 'Visual', score: varkResult.visual },
    { label: 'Aural', score: varkResult.aural },
    { label: 'Read/Write', score: varkResult.readWrite },
    { label: 'Kinesthetic', score: varkResult.kinesthetic },
  ].sort((a, b) => b.score - a.score);

  const secondary = allVark[1] && allVark[1].score > 0 ? allVark[1].label : null;

  return {
    primaryLearningStyle: varkResult.dominantStyle,
    secondaryLearningStyle: secondary,
    brainType: brainResult.dominance,
    combinedPersona: getLearningPersona(varkResult, brainResult),
  };
}