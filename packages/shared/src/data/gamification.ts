export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  xp: number;
}

export interface AiCompanionMessage {
  message: string;
  emoji: string;
}

export const achievements: Achievement[] = [
  { id: 'vark_complete', title: 'Learning Style Discovered', description: 'Completed the VARK assessment and unlocked your learning style', icon: '🎨', unlocked: false, xp: 100 },
  { id: 'brain_complete', title: 'Brain Decoded', description: 'Completed the Brain Dominance assessment', icon: '🧠', unlocked: false, xp: 100 },
  { id: 'dna_unlocked', title: 'DNA Decoded', description: 'Discovered your complete Learning DNA profile', icon: '🧬', unlocked: false, xp: 200 },
  { id: 'multimodal', title: 'Multimodal Master', description: 'Scored highly across multiple learning styles', icon: '🌟', unlocked: false, xp: 150 },
  { id: 'balanced_brain', title: 'Whole Brain Thinker', description: 'Achieved a balanced brain dominance result', icon: '⚖️', unlocked: false, xp: 150 },
  { id: 'quick_learner', title: 'Quick Learner', description: 'Completed both assessments in under 10 minutes', icon: '⚡', unlocked: false, xp: 75 },
  { id: 'self_aware', title: 'Self-Aware Scholar', description: 'Completed both assessments to understand yourself better', icon: '🔍', unlocked: false, xp: 50 },
];

export const VARK_QUESTIONS_XP = 5;
export const BRAIN_QUESTIONS_XP = 8;
export const VARK_COMPLETE_BONUS = 100;
export const BRAIN_COMPLETE_BONUS = 100;
export const DNA_UNLOCK_BONUS = 200;

export const aiCompanionMessages: Record<string, Record<string, AiCompanionMessage[]>> = {
  vark: {
    start: [
      { message: "Let's discover how your brain learns best! Each question reveals a piece of your learning DNA.", emoji: '🧬' },
    ],
    scanning: [
      { message: "I can see patterns emerging in your choices...", emoji: '🔍' },
      { message: "Your learning style is becoming clearer with each question!", emoji: '✨' },
      { message: "Excellent choices! Your brain is telling us something special.", emoji: '💡' },
      { message: "We're building a unique picture of how you learn.", emoji: '🎯' },
    ],
    analyzing: [
      { message: "Analyzing your learning patterns... fascinating!", emoji: '📊' },
      { message: "Your responses are painting a beautiful learning portrait.", emoji: '🎨' },
    ],
    finalizing: [
      { message: "Almost there! Your learning style is ready to be revealed!", emoji: '🚀' },
    ],
  },
  brain: {
    start: [
      { message: "Now let's explore how your brain processes information!", emoji: '🧠' },
    ],
    scanning: [
      { message: "Your brain patterns are revealing themselves...", emoji: '⚡' },
      { message: "I'm detecting unique cognitive signatures!", emoji: '🔬' },
      { message: "Your brain profile is taking shape beautifully.", emoji: '💫' },
      { message: "Each choice tells us more about your thinking style.", emoji: '🎯' },
    ],
    analyzing: [
      { message: "Analyzing your brain dominance patterns...", emoji: '📡' },
      { message: "Your cognitive profile is unique and fascinating!", emoji: '🌟' },
    ],
    finalizing: [
      { message: "Preparing your complete Learning DNA profile...", emoji: '🧬' },
    ],
  },
};

export interface Recommendation {
  title: string;
  description: string;
  icon: string;
  tips: string[];
}

export function getLearningEnvironmentRecs(personaName: string): Recommendation[] {
  const envs: Record<string, Recommendation[]> = {
    'Creative Visual Thinker': [
      { title: 'Visual Studio', description: 'A well-lit, visually inspiring space with mood boards and color-coded organization systems.', icon: '🎨', tips: ['Use natural lighting with warm tones', 'Create vision boards for each subject', 'Keep art supplies nearby for sketching concepts', 'Use color-coded folders and labels'] },
      { title: 'Creative Corner', description: 'A flexible space that allows for free-flowing ideas and big-picture thinking.', icon: '💡', tips: ['Keep a large whiteboard for mind mapping', 'Use ambient music to stimulate creativity', 'Have comfortable seating for thinking sessions', 'Display inspiring visuals and references'] },
    ],
    'Analytical Visualizer': [
      { title: 'Data Lab', description: 'An organized space with multiple screens for data visualization and analysis.', icon: '📊', tips: ['Dual monitor setup for side-by-side comparison', 'Keep reference charts and graphs visible', 'Use standing desk for active analysis sessions', 'Organize digital files in clear hierarchies'] },
      { title: 'Analysis Station', description: 'A clean, minimal environment that supports focused analytical work.', icon: '📐', tips: ['Minimal distractions with clean desk policy', 'Use task lighting to reduce eye strain', 'Keep analytical tools and templates accessible', 'Create a filing system for quick reference'] },
    ],
    'Creative Communicator': [
      { title: 'Podcast Nook', description: 'A sound-treated space perfect for recording thoughts and discussing ideas.', icon: '🎙️', tips: ['Invest in good microphone and headphones', 'Use sound-dampening materials for clarity', 'Keep a voice recorder for spontaneous ideas', 'Create a comfortable seating area for discussions'] },
      { title: 'Collaboration Hub', description: 'An open space designed for group discussions and verbal learning.', icon: '💬', tips: ['Arrange seating in a circle for discussions', 'Use acoustic panels to manage sound', 'Keep conversation starter cards handy', 'Have a dedicated recording station'] },
    ],
    'Analytical Communicator': [
      { title: 'Debate Chamber', description: 'A structured space for logical discussion and argument mapping.', icon: '🎯', tips: ['Use argument mapping software on a large screen', 'Keep reference materials organized by topic', 'Create a structured note-taking system', 'Use timers for structured debate sessions'] },
      { title: 'Logic Lab', description: 'A focused environment for critical thinking and structured communication.', icon: '🔍', tips: ['Minimize visual clutter for mental clarity', 'Use outline-based note-taking systems', 'Keep a dictionary and thesaurus accessible', 'Create templates for structured arguments'] },
    ],
    'Creative Scribe': [
      { title: 'Writing Sanctuary', description: 'A quiet, inspiring space dedicated to the written word.', icon: '✍️', tips: ['Use a comfortable chair for long writing sessions', 'Keep a journal for free-writing exercises', 'Display quotes and writing prompts', 'Use warm lighting to inspire creativity'] },
      { title: 'Literary Garden', description: 'A nature-inspired space that blends research with creative writing.', icon: '🌿', tips: ['Add plants for a calming atmosphere', 'Keep reference books within arm\'s reach', 'Use a mix of digital and analog note-taking', 'Create mood boards for writing projects'] },
    ],
    'Structured Knowledge Builder': [
      { title: 'Scholar\'s Study', description: 'A traditional study space with everything organized for systematic learning.', icon: '📚', tips: ['Use a large desk with organized sections', 'Implement a color-coded filing system', 'Keep reference materials in labeled binders', 'Use a study schedule posted visibly'] },
      { title: 'Knowledge Workshop', description: 'An efficient space optimized for building and organizing knowledge.', icon: '🔧', tips: ['Create a digital knowledge base system', 'Use index cards for key concepts', 'Keep a research tracking system', 'Organize materials by subject and difficulty'] },
    ],
    'Experiential Creator': [
      { title: 'Maker Space', description: 'A hands-on workshop for building, creating, and experimenting.', icon: '🔧', tips: ['Keep tools and materials organized and accessible', 'Create a prototyping station', 'Have space for movement and hands-on work', 'Use storage solutions for different projects'] },
      { title: 'Innovation Lab', description: 'A flexible space that encourages experimentation and physical learning.', icon: '⚡', tips: ['Use movable furniture for flexible layouts', 'Keep prototyping materials in reach', 'Create a "fail safely" zone for experiments', 'Have a project showcase area'] },
    ],
    'Precision Practitioner': [
      { title: 'Precision Workshop', description: 'A methodical space designed for careful, precise hands-on work.', icon: '⚙️', tips: ['Organize tools in a logical layout', 'Use good task lighting for precision work', 'Create checklists for each procedure', 'Keep a logbook for tracking progress'] },
      { title: 'Practice Arena', description: 'A structured environment for repeated practice and skill refinement.', icon: '🎯', tips: ['Set up stations for different skills', 'Use mirrors or cameras for self-review', 'Keep a progress tracking chart', 'Create a routine warm-up area'] },
    ],
  };

  return envs[personaName] || [
    { title: 'Flexible Study Space', description: 'A versatile environment that adapts to your unique learning needs.', icon: '🔄', tips: ['Experiment with different setups', 'Keep your most-used tools accessible', 'Create zones for different activities', 'Adjust lighting and seating for comfort'] },
    { title: 'Personal Learning Hub', description: 'Your personalized space designed around how you learn best.', icon: '🏠', tips: ['Customize your space based on your mood', 'Keep your learning tools organized', 'Create a comfortable atmosphere', 'Make it your own with personal touches'] },
  ];
}

export function getStudyHabitsRecs(personaName: string): Recommendation[] {
  const habits: Record<string, Recommendation[]> = {
    'Creative Visual Thinker': [
      { title: 'Visual Flow Sessions', description: 'Study in creative bursts with visual stimulation.', icon: '🎨', tips: ['Use 25-minute focused sketching sessions', 'Create visual summaries after each topic', 'Use color-coding for different subjects', 'Take breaks to look at inspiring visuals'] },
      { title: 'Pattern Recognition Practice', description: 'Train your brain to spot patterns in information.', icon: '🔍', tips: ['Create mind maps before studying details', 'Use imagery to memorize key concepts', 'Review using visual flashcards', 'Connect ideas through visual diagrams'] },
    ],
    'Analytical Visualizer': [
      { title: 'Data-Driven Study', description: 'Track and visualize your learning progress.', icon: '📊', tips: ['Create progress charts for each subject', 'Use data to identify weak areas', 'Set visual goals and track achievements', 'Review using infographic summaries'] },
      { title: 'Structured Review Sessions', description: 'Systematic review using visual frameworks.', icon: '📐', tips: ['Review using structured diagrams', 'Create comparison charts', 'Use flowcharts for sequential topics', 'Build visual reference libraries'] },
    ],
    'Creative Communicator': [
      { title: 'Discussion-Based Learning', description: 'Learn through conversation and verbal exchange.', icon: '🎙️', tips: ['Record verbal summaries of each topic', 'Join study groups for discussions', 'Explain concepts to others aloud', 'Use voice memos for quick notes'] },
      { title: 'Storytelling Sessions', description: 'Turn facts into stories for better retention.', icon: '📖', tips: ['Create narratives around concepts', 'Use mnemonics and rhymes', 'Record yourself telling study stories', 'Share what you learn with friends'] },
    ],
    'Analytical Communicator': [
      { title: 'Structured Discussion', description: 'Learn through organized debate and logical discourse.', icon: '🎯', tips: ['Prepare arguments for and against concepts', 'Join debate clubs or study groups', 'Record structured discussions', 'Practice explaining concepts logically'] },
      { title: 'Socratic Study Method', description: 'Question everything to deepen understanding.', icon: '❓', tips: ['Ask "why" five times for each concept', 'Create question banks for each topic', 'Practice answering under time pressure', 'Teach concepts through Q&A sessions'] },
    ],
    'Creative Scribe': [
      { title: 'Free-Writing Sessions', description: 'Use creative writing to explore and understand topics.', icon: '✍️', tips: ['Start with 10-minute free-writing on topics', 'Keep a creative learning journal', 'Rewrite concepts as stories', 'Create poetry or songs about subjects'] },
      { title: 'Dual-Format Note-Taking', description: 'Combine structured notes with creative reflections.', icon: '📝', tips: ['Write structured notes first, then creative summaries', 'Use different formats for different subjects', 'Create both analytical and narrative study guides', 'Review by rewriting in different styles'] },
    ],
    'Structured Knowledge Builder': [
      { title: 'Systematic Study Blocks', description: 'Structured time blocks for maximum efficiency.', icon: '📚', tips: ['Use 45-minute focused study blocks', 'Create detailed study schedules weekly', 'Take 10-minute breaks between blocks', 'Review using structured outlines'] },
      { title: 'Knowledge Mapping', description: 'Build comprehensive knowledge systems.', icon: '🗺️', tips: ['Create detailed outlines before studying', 'Build concept maps for each subject', 'Use the Cornell note-taking system', 'Regularly review and update your notes'] },
    ],
    'Experiential Creator': [
      { title: 'Hands-On Learning Blocks', description: 'Learn by doing with active experimentation.', icon: '🔧', tips: ['Build physical models of concepts', 'Use role-play to understand scenarios', 'Take movement breaks between study sessions', 'Create real-world projects for each topic'] },
      { title: 'Action-Reflection Cycles', description: 'Alternate between doing and reflecting.', icon: '🔄', tips: ['Try first, then read about the theory', 'Keep a project journal for reflections', 'Experiment with different approaches', 'Review by teaching through demonstration'] },
    ],
    'Precision Practitioner': [
      { title: 'Methodical Practice', description: 'Structured, repeatable practice sessions.', icon: '⚙️', tips: ['Use deliberate practice techniques', 'Track progress with detailed logs', 'Break complex skills into smaller steps', 'Set specific, measurable practice goals'] },
      { title: 'Skill-Building Routines', description: 'Daily routines that build precision and mastery.', icon: '🎯', tips: ['Start with warm-up exercises', 'Practice in focused 30-minute sessions', 'Review and refine techniques regularly', 'Keep a skill development journal'] },
    ],
  };

  return habits[personaName] || [
    { title: 'Balanced Study Routine', description: 'A flexible study habit system that adapts to your needs.', icon: '⚖️', tips: ['Experiment with different study lengths', 'Mix focused and relaxed study sessions', 'Take regular breaks for better focus', 'Adjust your routine based on energy levels'] },
    { title: 'Mindful Learning Practice', description: 'Stay present and engaged during study sessions.', icon: '🧘', tips: ['Start each session with a minute of focus', 'Take short breaks to reset attention', 'Reflect on what you learned after each session', 'Stay curious and ask questions'] },
  ];
}

export function getProductivityRecs(personaName: string): Recommendation[] {
  const prods: Record<string, Recommendation[]> = {
    'Creative Visual Thinker': [
      { title: 'Visual Goal Tracking', description: 'Use visual systems to track productivity.', icon: '📈', tips: ['Use a vision board for long-term goals', 'Create visual progress trackers', 'Use Kanban boards for task management', 'Color-code your calendar for different activities'] },
      { title: 'Creative Time Blocking', description: 'Structure your time around creative energy.', icon: '⏰', tips: ['Schedule creative work during peak energy', 'Use theme days for different subjects', 'Block time for both focused and free-form work', 'Take inspiration walks between tasks'] },
    ],
    'Analytical Visualizer': [
      { title: 'Data-Driven Productivity', description: 'Use metrics to optimize your workflow.', icon: '📊', tips: ['Track time spent on each task', 'Use productivity analytics tools', 'Set data-backed goals and deadlines', 'Review weekly productivity reports'] },
      { title: 'Systematic Task Management', description: 'Organize tasks in logical systems.', icon: '📋', tips: ['Use priority matrices for task management', 'Create detailed to-do lists with estimates', 'Implement the Getting Things Done method', 'Use project management software'] },
    ],
    'Creative Communicator': [
      { title: 'Accountability Partnerships', description: 'Stay productive through social accountability.', icon: '🤝', tips: ['Find a study accountability partner', 'Join productivity groups or communities', 'Share daily goals with someone', 'Use voice check-ins for progress updates'] },
      { title: 'Verbal Task Planning', description: 'Plan your day through spoken commitments.', icon: '🎯', tips: ['Verbally commit to your daily goals', 'Record morning planning sessions', 'Use voice memos for task lists', 'Discuss progress with a partner'] },
    ],
    'Analytical Communicator': [
      { title: 'Structured Productivity System', description: 'A logical framework for getting things done.', icon: '📐', tips: ['Use the Eisenhower Matrix for priorities', 'Implement time-blocking techniques', 'Create detailed project plans with milestones', 'Review and optimize your system weekly'] },
      { title: 'Focus Through Structure', description: 'Use structure to maintain focus and momentum.', icon: '🎯', tips: ['Set clear, measurable daily goals', 'Use the Pomodoro Technique consistently', 'Eliminate decision fatigue with routines', 'Track your most productive hours'] },
    ],
    'Creative Scribe': [
      { title: 'Writing-Based Organization', description: 'Use writing to plan and reflect on productivity.', icon: '✍️', tips: ['Start each day with a brief journal entry', 'Create written daily intentions', 'Use bullet journaling for task tracking', 'End each day with a written reflection'] },
      { title: 'Creative Time Management', description: 'Balance creative flow with productivity.', icon: '🔄', tips: ['Allow buffer time for creative detours', 'Use themed days for different types of work', 'Create writing prompts for task initiation', 'Review and celebrate small wins'] },
    ],
    'Structured Knowledge Builder': [
      { title: 'Systematic Productivity', description: 'Build reliable productivity systems.', icon: '📚', tips: ['Create SOPs for recurring tasks', 'Use project management frameworks', 'Implement the "eat the frog" technique', 'Review and refine your systems regularly'] },
      { title: 'Knowledge-Based Planning', description: 'Plan around learning goals and milestones.', icon: '🗺️', tips: ['Set specific learning objectives each week', 'Create study roadmaps with deadlines', 'Track knowledge acquisition milestones', 'Use spaced repetition for review planning'] },
    ],
    'Experiential Creator': [
      { title: 'Action-Oriented Productivity', description: 'Productivity through doing and experimenting.', icon: '⚡', tips: ['Start tasks immediately rather than planning', 'Use the "5-second rule" to overcome procrastination', 'Take action breaks between planning sessions', 'Learn by doing and adjust as you go'] },
      { title: 'Flexible Sprint System', description: 'Work in energetic sprints with movement.', icon: '🏃', tips: ['Use 20-minute focused sprints', 'Take movement breaks between sprints', 'Change locations for different tasks', 'Use physical rewards for completing tasks'] },
    ],
    'Precision Practitioner': [
      { title: 'Precision Planning', description: 'Meticulous planning for maximum efficiency.', icon: '⚙️', tips: ['Plan every minute of your study session', 'Create detailed checklists for each task', 'Use time-tracking to identify improvements', 'Review and refine your processes weekly'] },
      { title: 'Mastery-Based Scheduling', description: 'Schedule around skill development goals.', icon: '🎯', tips: ['Dedicate time blocks for deliberate practice', 'Track skill improvement metrics', 'Set mastery milestones with deadlines', 'Review progress against benchmarks'] },
    ],
  };

  return prods[personaName] || [
    { title: 'Balanced Productivity System', description: 'A flexible system that adapts to your workflow.', icon: '⚖️', tips: ['Experiment with different productivity methods', 'Find your natural energy peaks and troughs', 'Use a simple task tracking system', 'Review and adjust your system regularly'] },
    { title: 'Mindful Productivity Practice', description: 'Stay focused and present while working.', icon: '🧘', tips: ['Start each session with intention setting', 'Take regular breaks to reset', 'Avoid multitasking for better focus', 'Reflect on your productivity patterns'] },
  ];
}