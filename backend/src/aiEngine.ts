export interface EventAnalysisResult {
  smartCategory: string;
  skillTags: string[];
  targetAudience: { department: string; matchPercent: number }[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  careerRelevance: string[];
  completenessScore: number; // 0 - 100
  qualityScore: number;     // 0 - 100
  urgency: 'High' | 'Medium' | 'Normal';
  recommendationsForOrganizer: string[];
}

export function analyzeEventDetails(eventData: {
  title: string;
  description: string;
  category?: string;
  eligibility?: string;
  requiredSkills?: string[];
  location?: string;
  registrationFee?: number;
  startDate?: string;
}): EventAnalysisResult {
  const text = `${eventData.title} ${eventData.description} ${eventData.category || ''} ${eventData.eligibility || ''}`.toLowerCase();

  // 1. Smart Category Classification
  let smartCategory = eventData.category || 'Academic & Professional';
  if (text.includes('hackathon') || text.includes('hack')) {
    smartCategory = 'AI & Software Hackathon';
  } else if (text.includes('workshop') || text.includes('hands on')) {
    smartCategory = 'Interactive Technical Workshop';
  } else if (text.includes('conference') || text.includes('research')) {
    smartCategory = 'Research & Technical Conference';
  } else if (text.includes('esports') || text.includes('gaming')) {
    smartCategory = 'Competitive Esports & Gaming';
  } else if (text.includes('expo') || text.includes('project')) {
    smartCategory = 'Project Expo & Showcase';
  } else if (text.includes('business') || text.includes('pitch')) {
    smartCategory = 'Business Plan & Entrepreneurship';
  }

  // 2. Skill Tags Extraction
  const extractedSkills = new Set<string>();
  if (eventData.requiredSkills && eventData.requiredSkills.length > 0) {
    eventData.requiredSkills.forEach(s => extractedSkills.add(s));
  }

  if (text.includes('python')) extractedSkills.add('Python');
  if (text.includes('ai') || text.includes('artificial intelligence')) extractedSkills.add('AI');
  if (text.includes('machine learning') || text.includes('ml')) extractedSkills.add('Machine Learning');
  if (text.includes('web') || text.includes('javascript') || text.includes('react')) extractedSkills.add('Web Development');
  if (text.includes('cybersecurity') || text.includes('security')) extractedSkills.add('Cybersecurity');
  if (text.includes('data science') || text.includes('analytics')) extractedSkills.add('Data Science');
  if (text.includes('cloud')) extractedSkills.add('Cloud Computing');
  if (text.includes('iot') || text.includes('embedded')) extractedSkills.add('IoT & Hardware');
  if (text.includes('problem solving')) extractedSkills.add('Problem Solving');

  if (extractedSkills.size === 0) {
    extractedSkills.add('Problem Solving');
    extractedSkills.add('Teamwork');
  }

  const skillTags = Array.from(extractedSkills);

  // 3. Target Audience Fit
  const targetAudience = [
    { department: 'AI & Data Science (AI & DS)', matchPercent: text.includes('ai') || text.includes('data') ? 94 : 78 },
    { department: 'Computer Science & Engineering (CSE)', matchPercent: 88 },
    { department: 'Information Technology (IT)', matchPercent: 82 },
    { department: 'Electronics & Communication (ECE)', matchPercent: text.includes('hardware') || text.includes('iot') ? 89 : 65 },
  ];

  // 4. Difficulty Level Determination
  let difficulty: 'Beginner' | 'Intermediate' | 'Advanced' = 'Intermediate';
  if (text.includes('advanced') || text.includes('phd') || text.includes('research paper') || text.includes('metasurface')) {
    difficulty = 'Advanced';
  } else if (text.includes('beginner') || text.includes('intro') || text.includes('drawing') || text.includes('relay')) {
    difficulty = 'Beginner';
  }

  // 5. Career Relevance Roles
  const careerRelevanceSet = new Set<string>();
  if (text.includes('ai') || text.includes('ml')) {
    careerRelevanceSet.add('AI Engineer');
    careerRelevanceSet.add('ML Engineer');
  }
  if (text.includes('python') || text.includes('coding') || text.includes('hackathon')) {
    careerRelevanceSet.add('Software Engineer');
    careerRelevanceSet.add('Full Stack Developer');
  }
  if (text.includes('data')) {
    careerRelevanceSet.add('Data Scientist');
  }
  if (text.includes('security')) {
    careerRelevanceSet.add('Cybersecurity Analyst');
  }
  if (text.includes('business') || text.includes('pitch')) {
    careerRelevanceSet.add('Startup Founder');
    careerRelevanceSet.add('Product Manager');
  }
  if (careerRelevanceSet.size === 0) {
    careerRelevanceSet.add('Software Developer');
  }

  // 6. Information Completeness & Quality Score
  let completeness = 40;
  if (eventData.title && eventData.title.length > 5) completeness += 15;
  if (eventData.description && eventData.description.length > 30) completeness += 20;
  if (eventData.eligibility) completeness += 10;
  if (eventData.requiredSkills && eventData.requiredSkills.length > 0) completeness += 10;
  if (eventData.location) completeness += 5;

  const completenessScore = Math.min(100, completeness);
  const qualityScore = Math.min(100, completenessScore + (eventData.registrationFee === 0 ? 5 : 0));

  // 7. Urgency rating
  let urgency: 'High' | 'Medium' | 'Normal' = 'High';
  if (completenessScore > 85) urgency = 'Normal';
  else if (completenessScore > 70) urgency = 'Medium';

  const recommendationsForOrganizer: string[] = [];
  if (!eventData.eligibility || eventData.eligibility.length < 10) {
    recommendationsForOrganizer.push('Add specific eligibility criteria (e.g., "Open to 2nd and 3rd year CSE/IT students") to increase student trust.');
  }
  if (!eventData.requiredSkills || eventData.requiredSkills.length < 2) {
    recommendationsForOrganizer.push('Add at least 3 skill tags so our AI recommendation engine can match relevant candidates effectively.');
  }
  if (completenessScore > 85) {
    recommendationsForOrganizer.push('Excellent event details! Your event is ready for high-visibility publication.');
  }

  return {
    smartCategory,
    skillTags,
    targetAudience,
    difficulty,
    careerRelevance: Array.from(careerRelevanceSet),
    completenessScore,
    qualityScore,
    urgency,
    recommendationsForOrganizer,
  };
}
