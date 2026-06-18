export interface VarkQuestion {
  id: string;
  text: string;
  options: VarkOption[];
}

export interface VarkOption {
  label: string;
  style: 'Visual' | 'Aural' | 'Read/Write' | 'Kinesthetic';
}

// 16 official VARK-style questions
// option1 → Kinesthetic, option2 → Aural, option3 → Read/Write, option4 → Visual
export const varkQuestions: VarkQuestion[] = [
  {
    id: 'q1',
    text: 'You are about to give a direction to a person who is with you. You would:',
    options: [
      { label: 'Draw a map or give a visual demonstration', style: 'Visual' },
      { label: 'Tell them the directions verbally', style: 'Aural' },
      { label: 'Write down the directions on a piece of paper', style: 'Read/Write' },
      { label: 'Walk with them to show the way', style: 'Kinesthetic' },
    ],
  },
  {
    id: 'q2',
    text: 'You are planning a vacation for a group. You would:',
    options: [
      { label: 'Look at maps and browse photos of destinations', style: 'Visual' },
      { label: 'Discuss with friends about where to go', style: 'Aural' },
      { label: 'Read travel brochures and reviews online', style: 'Read/Write' },
      { label: 'Visit a travel agency to feel the brochures', style: 'Kinesthetic' },
    ],
  },
  {
    id: 'q3',
    text: 'You are helping someone who wants to go to your house. You would:',
    options: [
      { label: 'Draw a map or show a picture of the house', style: 'Visual' },
      { label: 'Tell them the directions over the phone', style: 'Aural' },
      { label: 'Write down the directions clearly', style: 'Read/Write' },
      { label: 'Pick them up and drive them there', style: 'Kinesthetic' },
    ],
  },
  {
    id: 'q4',
    text: 'You are learning a new computer program. You would:',
    options: [
      { label: 'Watch a video tutorial or follow diagrams', style: 'Visual' },
      { label: 'Ask someone to explain the features', style: 'Aural' },
      { label: 'Read the manual or help documentation', style: 'Read/Write' },
      { label: 'Jump in and try it yourself', style: 'Kinesthetic' },
    ],
  },
  {
    id: 'q5',
    text: 'You are trying to assemble a new piece of furniture. You would:',
    options: [
      { label: 'Look at the picture diagram', style: 'Visual' },
      { label: 'Call a friend to guide you through', style: 'Aural' },
      { label: 'Read the instructions step by step', style: 'Read/Write' },
      { label: 'Start putting pieces together intuitively', style: 'Kinesthetic' },
    ],
  },
  {
    id: 'q6',
    text: 'You are about to learn a new recipe. You would:',
    options: [
      { label: 'Watch a cooking video', style: 'Visual' },
      { label: 'Have someone explain the steps to you', style: 'Aural' },
      { label: 'Read the recipe card carefully', style: 'Read/Write' },
      { label: 'Start cooking and figure it out', style: 'Kinesthetic' },
    ],
  },
  {
    id: 'q7',
    text: 'You are in a museum. You prefer to:',
    options: [
      { label: 'Look at the exhibits and visual displays', style: 'Visual' },
      { label: 'Listen to an audio guide', style: 'Aural' },
      { label: 'Read the information plaques', style: 'Read/Write' },
      { label: 'Interact with hands-on exhibits', style: 'Kinesthetic' },
    ],
  },
  {
    id: 'q8',
    text: 'You are preparing for a test. You would:',
    options: [
      { label: 'Create diagrams and charts to study', style: 'Visual' },
      { label: 'Discuss topics with classmates', style: 'Aural' },
      { label: 'Write notes and summaries', style: 'Read/Write' },
      { label: 'Practice with hands-on exercises', style: 'Kinesthetic' },
    ],
  },
  {
    id: 'q9',
    text: 'You are buying a new phone. You would:',
    options: [
      { label: 'Look at product images and videos', style: 'Visual' },
      { label: 'Ask friends for their opinions', style: 'Aural' },
      { label: 'Read detailed specs and reviews', style: 'Read/Write' },
      { label: 'Visit a store to try it out', style: 'Kinesthetic' },
    ],
  },
  {
    id: 'q10',
    text: 'You are learning to play a new song. You would:',
    options: [
      { label: 'Watch someone play it first', style: 'Visual' },
      { label: 'Listen to the song repeatedly', style: 'Aural' },
      { label: 'Read the sheet music', style: 'Read/Write' },
      { label: 'Try playing it by ear', style: 'Kinesthetic' },
    ],
  },
  {
    id: 'q11',
    text: 'You are given a new gadget. You would:',
    options: [
      { label: 'Watch a demonstration video', style: 'Visual' },
      { label: 'Ask someone to explain its features', style: 'Aural' },
      { label: 'Read the user manual first', style: 'Read/Write' },
      { label: 'Press buttons and explore', style: 'Kinesthetic' },
    ],
  },
  {
    id: 'q12',
    text: 'You are trying to understand a complex concept. You prefer:',
    options: [
      { label: 'See it illustrated with diagrams', style: 'Visual' },
      { label: 'Have it explained out loud', style: 'Aural' },
      { label: 'Read a well-written explanation', style: 'Read/Write' },
      { label: 'Work through a real example', style: 'Kinesthetic' },
    ],
  },
  {
    id: 'q13',
    text: 'You are giving someone feedback on their work. You would:',
    options: [
      { label: 'Show them visual examples', style: 'Visual' },
      { label: 'Talk through your feedback', style: 'Aural' },
      { label: 'Write detailed comments', style: 'Read/Write' },
      { label: 'Demonstrate the changes physically', style: 'Kinesthetic' },
    ],
  },
  {
    id: 'q14',
    text: 'You are choosing a new course to take. You would prefer:',
    options: [
      { label: 'Look at infographics about the course', style: 'Visual' },
      { label: 'Attend an information session', style: 'Aural' },
      { label: 'Read the course syllabus and outline', style: 'Read/Write' },
      { label: 'Try a sample lesson', style: 'Kinesthetic' },
    ],
  },
  {
    id: 'q15',
    text: 'You are organizing an event. You would:',
    options: [
      { label: 'Create a visual timeline or storyboard', style: 'Visual' },
      { label: 'Discuss the plan with the team', style: 'Aural' },
      { label: 'Write a detailed checklist', style: 'Read/Write' },
      { label: 'Set up and rehearse physically', style: 'Kinesthetic' },
    ],
  },
  {
    id: 'q16',
    text: 'You are recalling a past experience. You most vividly remember:',
    options: [
      { label: 'The sights and visual scenes', style: 'Visual' },
      { label: 'The sounds and conversations', style: 'Aural' },
      { label: 'The written notes or texts', style: 'Read/Write' },
      { label: 'The physical feelings and actions', style: 'Kinesthetic' },
    ],
  },
];

export type VarkResult = {
  visual: number;
  aural: number;
  readWrite: number;
  kinesthetic: number;
  dominantStyle: 'Visual' | 'Aural' | 'Read/Write' | 'Kinesthetic';
  total: number;
};

export function calculateVarkScore(
  selections: Record<string, 'Visual' | 'Aural' | 'Read/Write' | 'Kinesthetic'>
): VarkResult {
  const scores: Record<string, number> = { Visual: 0, Aural: 0, 'Read/Write': 0, Kinesthetic: 0 };

  Object.values(selections).forEach((style) => {
    scores[style]++;
  });

  const sorted = (Object.entries(scores) as [string, number][]).sort((a, b) => b[1] - a[1]);

  return {
    visual: scores['Visual'],
    aural: scores['Aural'],
    readWrite: scores['Read/Write'],
    kinesthetic: scores['Kinesthetic'],
    dominantStyle: sorted[0][0] as VarkResult['dominantStyle'],
    total: 16,
  };
}

export const varkStyleDescriptions: Record<string, { desc: string; strengths: string[] }> = {
  Visual: {
    desc: 'You learn best through diagrams, charts, graphs, maps, and infographics. You "see" the big picture and remember information better when you can visualize it.',
    strengths: ['Excellent at reading maps and charts', 'Good at spatial reasoning', 'Strong visual memory', 'Notices visual details others miss'],
  },
  Aural: {
    desc: 'Listening, discussing, and speaking are your primary learning tools. You prefer verbal explanations, group discussions, and verbal repetition to absorb information.',
    strengths: ['Strong listening and recall', 'Excellent at verbal explanations', 'Thrives in group discussions', 'Good with rhythm and sound patterns'],
  },
  'Read/Write': {
    desc: 'Input and output of text is your forte. Lists, essays, definitions, textbooks, and taking notes are how you learn best. You love reading and writing.',
    strengths: ['Excellent note-taking skills', 'Strong reading comprehension', 'Good at writing essays and reports', 'Prefers lists and bullet points'],
  },
  Kinesthetic: {
    desc: 'You are a doer. Physical experiences, hands-on activities, real-world examples, and trial-and-error are how you master new concepts and skills.',
    strengths: ['Excellent hands-on learner', 'Strong muscle memory', 'Good at experiments and labs', 'Learns well through practice'],
  },
};