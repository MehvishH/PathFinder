export const FLOW_KEYS = ["student", "reentry", "switch", "scholarships"] as const;

export type FlowKey = (typeof FLOW_KEYS)[number];

export type Question = {
  id: string;
  type: "text" | "single" | "multiple";
  question: string;
  description?: string;
  placeholder?: string;
  options?: string[];
  /** Optional questions can be skipped with no answer. */
  optional?: boolean;
};

export type FlowMeta = {
  key: FlowKey;
  title: string;
  blurb: string;
  /** What the person gets back, shown on the chooser and while loading. */
  outcome: string;
  questions: Question[];
};

export function isFlowKey(value: string): value is FlowKey {
  return (FLOW_KEYS as readonly string[]).includes(value);
}

const student: Question[] = [
  { id: "name", type: "text", question: "What's your name?", description: "So your plan feels like yours.", placeholder: "Your first name" },
  {
    id: "favorite_subjects", type: "multiple", question: "Which subjects do you enjoy the most?", description: "Pick as many as you like.",
    options: ["Mathematics", "Science (Biology, Chemistry, Physics)", "English/Literature", "History/Social Studies", "Art/Design", "Computer Science/Technology", "Foreign Languages", "Business/Economics", "Music", "Physical Education/Sports"],
  },
  {
    id: "strengths", type: "multiple", question: "What are your strongest skills?", description: "Choose your top strengths.",
    options: ["Problem Solving", "Creative Thinking", "Communication", "Leadership", "Analytical Thinking", "Hands-on/Practical Work", "Working with People", "Working with Technology", "Research & Investigation", "Organization & Planning"],
  },
  {
    id: "work_style", type: "single", question: "Which work environment appeals to you most?",
    options: ["Office/Corporate Setting", "Laboratory/Research Facility", "Outdoors/Field Work", "Studio/Creative Space", "Hospital/Healthcare Facility", "Classroom/Educational Setting", "Remote/Flexible Location", "Fast-paced Startup Environment"],
  },
  {
    id: "motivations", type: "multiple", question: "What motivates you in a career?", description: "Select your top priorities.",
    options: ["High Salary Potential", "Helping Others", "Creative Expression", "Making a Social Impact", "Job Stability", "Flexibility/Work-Life Balance", "Continuous Learning", "Innovation & Technology", "Entrepreneurship"],
  },
  {
    id: "activities", type: "multiple", question: "What do you enjoy doing outside of school?", description: "This tells us more about your interests.",
    options: ["Coding/Programming", "Reading/Writing", "Sports/Athletics", "Art/Crafts", "Volunteering", "Building/Making Things", "Gaming", "Music", "Social Media/Content Creation", "Debating/Public Speaking"],
  },
  {
    id: "problem_approach", type: "single", question: "How do you prefer to solve problems?",
    options: ["Using logic and data", "Through creative brainstorming", "By researching and learning", "Through hands-on experimentation", "By collaborating with others", "Using established methods and systems"],
  },
  {
    id: "future_vision", type: "single", question: "What matters most for your future career?",
    options: ["Making a lot of money", "Making a difference in the world", "Having creative freedom", "Having job security", "Being recognized as an expert", "Having time for personal life", "Being my own boss"],
  },
];

const reentry: Question[] = [
  { id: "name", type: "text", question: "What's your name?", description: "So your plan feels like yours.", placeholder: "Your first name" },
  { id: "previous_field", type: "text", question: "What field or industry did you work in?", description: "Be as specific as you can.", placeholder: "e.g., Software development, digital marketing, nursing" },
  { id: "last_role", type: "text", question: "What was your last job title?", description: "This tells us your experience level.", placeholder: "e.g., Senior marketing manager, registered nurse" },
  { id: "years_away", type: "single", question: "How long have you been away from this field?", options: ["Less than 1 year", "1-2 years", "3-5 years", "6-10 years", "More than 10 years"] },
  { id: "reason_for_break", type: "single", question: "What was the main reason for your break?", options: ["Raising children/Family responsibilities", "Health reasons", "Education/Further studies", "Career change exploration", "Personal development", "Relocation", "Other personal reasons"] },
  { id: "education_level", type: "single", question: "What's your highest level of education in this field?", options: ["High School Diploma", "Associate's Degree", "Bachelor's Degree", "Master's Degree", "PhD or Doctorate", "Professional Certification", "Self-taught/Bootcamp"] },
  { id: "current_knowledge", type: "single", question: "How current is your knowledge of the field?", description: "Be honest. It makes the plan more useful.", options: ["Still very current - I've kept up with trends", "Somewhat current - I've followed major changes", "Outdated - I haven't followed recent developments", "Completely outdated - The field has likely changed significantly"] },
  { id: "work_preference", type: "multiple", question: "What are you looking for in your return?", description: "Pick all that apply.", options: ["Full-time position", "Part-time position", "Remote work", "Flexible schedule", "Freelance/Contract work", "Return to previous role level", "Start at entry/mid-level to rebuild", "Career advancement opportunities"] },
  { id: "time_commitment", type: "single", question: "How much time can you put into upskilling?", options: ["A few hours per week", "10-15 hours per week", "20+ hours per week (intensive)", "Full-time bootcamp/program"] },
  { id: "budget", type: "single", question: "What's your budget for certifications and training?", options: ["Free resources only", "Under $500", "$500 - $2,000", "$2,000 - $5,000", "Over $5,000", "Open to investment if valuable"] },
];

const careerSwitch: Question[] = [
  { id: "name", type: "text", question: "What's your name?", description: "So your plan feels like yours.", placeholder: "Your first name" },
  { id: "current_situation", type: "single", question: "What best describes where you are now?", options: ["Undergraduate student exploring graduate programs", "Recent graduate considering a different path", "Working professional (1-5 years experience)", "Mid-career professional (5-10 years experience)", "Senior professional (10+ years experience)"] },
  { id: "current_field", type: "text", question: "What's your current field or major?", description: "Be specific about your background.", placeholder: "e.g., Marketing, computer science, finance" },
  { id: "target_field", type: "text", question: "What field do you want to move into?", description: "Your best guess is fine.", placeholder: "e.g., Data science, UX design, healthcare" },
  { id: "reason_for_switch", type: "multiple", question: "Why are you thinking about switching?", description: "Pick all that apply.", options: ["More aligned with my passions", "Better work-life balance", "Higher earning potential", "More job opportunities", "Interested in the field's growth", "Want more meaningful work", "Current field is declining", "Seeking new challenges"] },
  { id: "current_skills", type: "multiple", question: "Which of your skills do you think will carry over?", description: "Pick your strongest ones.", options: ["Communication", "Project Management", "Data Analysis", "Leadership", "Technical/Programming", "Creative Problem Solving", "Research", "Customer Service", "Financial Analysis", "Design Thinking"] },
  { id: "knowledge_level", type: "single", question: "How familiar are you with your target field?", options: ["Complete beginner - just curious", "Some knowledge from personal interest", "Taken a few courses or certifications", "Done projects or freelance work", "Have some professional experience"] },
  { id: "education_interest", type: "single", question: "Are you open to more education?", options: ["Yes, definitely considering a Master's degree", "Open to graduate programs if needed", "Prefer bootcamps or intensive programs", "Only interested in certifications", "Want to learn through self-study and practice", "Not interested in formal education"] },
  { id: "timeline", type: "single", question: "What's your ideal timeline for the switch?", options: ["As soon as possible (3-6 months)", "Within a year", "1-2 years gradual transition", "2-3 years with education", "Flexible - just exploring"] },
  { id: "financial_situation", type: "single", question: "What does your financial situation look like?", options: ["Can afford to leave current job and study full-time", "Need to work while transitioning", "Looking for paid training programs", "Can invest in education but need income", "Must maintain current income"] },
];

const scholarships: Question[] = [
  {
    id: "education_level", type: "single", question: "Where are you in school?",
    options: ["High school junior", "High school senior", "Community college student", "Undergraduate at a 4-year school", "Graduate student", "Adult going back to school"],
  },
  { id: "field", type: "text", question: "What do you study, or plan to?", description: "A major or a general area both work.", placeholder: "e.g., Nursing, computer science, undecided" },
  { id: "state", type: "text", question: "Which state do you live in?", description: "Lots of awards are state-specific.", placeholder: "e.g., Texas" },
  { id: "gpa", type: "single", question: "What's your GPA range?", options: ["3.8 or higher", "3.5 - 3.79", "3.0 - 3.49", "2.5 - 2.99", "Below 2.5", "Not sure or no GPA yet"] },
  {
    id: "background", type: "multiple", optional: true,
    question: "Any groups you'd like to be matched on?",
    description: "Optional. Many scholarships are set aside for specific communities. Skip this if you'd rather not say.",
    options: ["First-generation college student", "Hispanic or Latino", "Black or African American", "Asian American or Pacific Islander", "Native American or Alaska Native", "Woman in STEM", "LGBTQ+", "Military veteran or military family", "Student with a disability", "Immigrant or DACA recipient", "Student parent"],
  },
  {
    id: "activities", type: "multiple", question: "What are you involved in?", description: "Pick all that apply.",
    options: ["Community service", "Sports", "Arts, music or theater", "STEM clubs or competitions", "Student government or leadership", "Part-time job", "Caring for family", "Faith-based groups", "Writing or journalism", "Starting a business or side project"],
  },
  {
    id: "financial_need", type: "single", question: "How much help do you need paying for school?",
    options: ["A lot. I can't attend without aid", "A fair amount", "Some help would be nice", "Not much. I'm after merit awards", "Not sure yet"],
  },
];

export const FLOWS: Record<FlowKey, FlowMeta> = {
  student: {
    key: "student",
    title: "Find my major",
    blurb: "For students choosing a major and wondering where it leads.",
    outcome: "majors that fit you, the careers they lead to, schools and scholarships",
    questions: student,
  },
  reentry: {
    key: "reentry",
    title: "Return to work",
    blurb: "For anyone heading back to work after time away.",
    outcome: "a return plan with skills to refresh, roles to target and a week-by-week plan",
    questions: reentry,
  },
  switch: {
    key: "switch",
    title: "Switch careers",
    blurb: "For people moving into a new field.",
    outcome: "a switch plan with skills that carry over, gaps to close and roles to aim for",
    questions: careerSwitch,
  },
  scholarships: {
    key: "scholarships",
    title: "Find scholarships",
    blurb: "A short profile quiz that matches you with real scholarships.",
    outcome: "6 to 10 scholarships you could apply for, with deadlines and how to apply",
    questions: scholarships,
  },
};

export const CAREER_FLOWS: FlowKey[] = ["student", "reentry", "switch"];
