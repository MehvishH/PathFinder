export type FlowKey = 'student' | 'reentry' | 'switch';

export type Question = {
  id: string;
  type: 'text' | 'single' | 'multiple';
  question: string;
  description?: string;
  placeholder?: string;
  options?: string[];
};

export type FlowMeta = {
  key: FlowKey;
  title: string;
  subtitle: string;
  icon: string; // ionicons name
  questions: Question[];
};

const student: Question[] = [
  { id: 'name', type: 'text', question: "What's your name?", description: "Let's personalize your experience", placeholder: 'Your name' },
  {
    id: 'favorite_subjects', type: 'multiple', question: 'Which subjects do you enjoy the most?', description: 'Select all that apply',
    options: ['Mathematics', 'Science (Biology, Chemistry, Physics)', 'English/Literature', 'History/Social Studies', 'Art/Design', 'Computer Science/Technology', 'Foreign Languages', 'Business/Economics', 'Music', 'Physical Education/Sports'],
  },
  {
    id: 'strengths', type: 'multiple', question: 'What are your strongest skills?', description: 'Choose your top strengths',
    options: ['Problem Solving', 'Creative Thinking', 'Communication', 'Leadership', 'Analytical Thinking', 'Hands-on/Practical Work', 'Working with People', 'Working with Technology', 'Research & Investigation', 'Organization & Planning'],
  },
  {
    id: 'work_style', type: 'single', question: 'Which work environment appeals to you most?',
    options: ['Office/Corporate Setting', 'Laboratory/Research Facility', 'Outdoors/Field Work', 'Studio/Creative Space', 'Hospital/Healthcare Facility', 'Classroom/Educational Setting', 'Remote/Flexible Location', 'Fast-paced Startup Environment'],
  },
  {
    id: 'motivations', type: 'multiple', question: 'What motivates you in a career?', description: 'Select your top priorities',
    options: ['High Salary Potential', 'Helping Others', 'Creative Expression', 'Making a Social Impact', 'Job Stability', 'Flexibility/Work-Life Balance', 'Continuous Learning', 'Innovation & Technology', 'Entrepreneurship'],
  },
  {
    id: 'activities', type: 'multiple', question: 'What activities do you enjoy outside of school?', description: 'This helps us understand your interests better',
    options: ['Coding/Programming', 'Reading/Writing', 'Sports/Athletics', 'Art/Crafts', 'Volunteering', 'Building/Making Things', 'Gaming', 'Music', 'Social Media/Content Creation', 'Debating/Public Speaking'],
  },
  {
    id: 'problem_approach', type: 'single', question: 'How do you prefer to solve problems?',
    options: ['Using logic and data', 'Through creative brainstorming', 'By researching and learning', 'Through hands-on experimentation', 'By collaborating with others', 'Using established methods and systems'],
  },
  {
    id: 'future_vision', type: 'single', question: "What's most important for your future career?",
    options: ['Making a lot of money', 'Making a difference in the world', 'Having creative freedom', 'Having job security', 'Being recognized as an expert', 'Having time for personal life', 'Being my own boss'],
  },
];

const reentry: Question[] = [
  { id: 'name', type: 'text', question: "What's your name?", description: "Let's personalize your career re-entry plan", placeholder: 'Your name' },
  { id: 'previous_field', type: 'text', question: 'What field or industry did you work in?', description: 'Be as specific as possible', placeholder: 'e.g., Software Development, Digital Marketing, Nursing' },
  { id: 'last_role', type: 'text', question: 'What was your last job title or role?', description: 'This helps us understand your experience level', placeholder: 'e.g., Senior Marketing Manager, Registered Nurse' },
  { id: 'years_away', type: 'single', question: 'How long have you been away from this field?', options: ['Less than 1 year', '1-2 years', '3-5 years', '6-10 years', 'More than 10 years'] },
  { id: 'reason_for_break', type: 'single', question: 'What was the primary reason for your career break?', options: ['Raising children/Family responsibilities', 'Health reasons', 'Education/Further studies', 'Career change exploration', 'Personal development', 'Relocation', 'Other personal reasons'] },
  { id: 'education_level', type: 'single', question: "What's your highest level of education in this field?", options: ['High School Diploma', "Associate's Degree", "Bachelor's Degree", "Master's Degree", 'PhD or Doctorate', 'Professional Certification', 'Self-taught/Bootcamp'] },
  { id: 'current_knowledge', type: 'single', question: 'How would you rate your current knowledge of the field?', description: 'Be honest - this helps us provide better recommendations', options: ["Still very current - I've kept up with trends", "Somewhat current - I've followed major changes", "Outdated - I haven't followed recent developments", 'Completely outdated - The field has likely changed significantly'] },
  { id: 'work_preference', type: 'multiple', question: 'What are you looking for in your return?', description: 'Select all that apply', options: ['Full-time position', 'Part-time position', 'Remote work', 'Flexible schedule', 'Freelance/Contract work', 'Return to previous role level', 'Start at entry/mid-level to rebuild', 'Career advancement opportunities'] },
  { id: 'time_commitment', type: 'single', question: 'How much time can you dedicate to upskilling?', options: ['A few hours per week', '10-15 hours per week', '20+ hours per week (intensive)', 'Full-time bootcamp/program'] },
  { id: 'budget', type: 'single', question: "What's your budget for certifications and training?", options: ['Free resources only', 'Under $500', '$500 - $2,000', '$2,000 - $5,000', 'Over $5,000', 'Open to investment if valuable'] },
];

const careerSwitch: Question[] = [
  { id: 'name', type: 'text', question: "What's your name?", description: "Let's personalize your career transition plan", placeholder: 'Your name' },
  { id: 'current_situation', type: 'single', question: 'What best describes your current situation?', options: ['Undergraduate student exploring graduate programs', 'Recent graduate considering a different path', 'Working professional (1-5 years experience)', 'Mid-career professional (5-10 years experience)', 'Senior professional (10+ years experience)'] },
  { id: 'current_field', type: 'text', question: 'What is your current field or major?', description: 'Be specific about your background', placeholder: 'e.g., Marketing, Computer Science, Finance' },
  { id: 'target_field', type: 'text', question: 'What field do you want to transition into?', description: 'What career path are you considering?', placeholder: 'e.g., Data Science, UX Design, Healthcare' },
  { id: 'reason_for_switch', type: 'multiple', question: 'Why are you considering this career switch?', description: 'Select all that apply', options: ['More aligned with my passions', 'Better work-life balance', 'Higher earning potential', 'More job opportunities', "Interested in the field's growth", 'Want more meaningful work', 'Current field is declining', 'Seeking new challenges'] },
  { id: 'current_skills', type: 'multiple', question: 'What skills from your current field do you think are valuable?', description: 'Select your strongest transferable skills', options: ['Communication', 'Project Management', 'Data Analysis', 'Leadership', 'Technical/Programming', 'Creative Problem Solving', 'Research', 'Customer Service', 'Financial Analysis', 'Design Thinking'] },
  { id: 'knowledge_level', type: 'single', question: 'How familiar are you with your target field?', options: ['Complete beginner - just curious', 'Some knowledge from personal interest', 'Taken a few courses or certifications', 'Done projects or freelance work', 'Have some professional experience'] },
  { id: 'education_interest', type: 'single', question: 'Are you interested in pursuing further education?', options: ["Yes, definitely considering a Master's degree", 'Open to graduate programs if needed', 'Prefer bootcamps or intensive programs', 'Only interested in certifications', 'Want to learn through self-study and practice', 'Not interested in formal education'] },
  { id: 'timeline', type: 'single', question: "What's your ideal timeline for this transition?", options: ['As soon as possible (3-6 months)', 'Within a year', '1-2 years gradual transition', '2-3 years with education', 'Flexible - just exploring'] },
  { id: 'financial_situation', type: 'single', question: "What's your situation regarding the transition?", options: ['Can afford to leave current job and study full-time', 'Need to work while transitioning', 'Looking for paid training programs', 'Can invest in education but need income', 'Must maintain current income'] },
];

export const FLOWS: Record<FlowKey, FlowMeta> = {
  student: { key: 'student', title: 'Find My Major', subtitle: 'For students choosing a college major and career path', icon: 'school-outline', questions: student },
  reentry: { key: 'reentry', title: 'Return to Work', subtitle: 'For people re-entering the workforce after a break', icon: 'refresh-outline', questions: reentry },
  switch: { key: 'switch', title: 'Switch Careers', subtitle: 'For people transitioning into a new field', icon: 'swap-horizontal-outline', questions: careerSwitch },
};
