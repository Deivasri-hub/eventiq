import { StudentProfile, EventItem, Registration } from './db';

export interface WeightConfig {
  skillsWeight: number;    // default 0.55
  interestsWeight: number; // default 0.20
  careerWeight: number;    // default 0.15
  locationWeight: number;  // default 0.10
}

export interface SkillGapItem {
  skill: string;
  matched: boolean;
  whyItMatters: string;
  difficulty: string;
  recommendation: string;
}

export interface RecommendationResult {
  eventId: number;
  matchScore: number; // 0 - 100
  subScores: {
    skillMatchPercent: number;
    interestMatchPercent: number;
    careerMatchPercent: number;
    locationMatchPercent: number;
    eligibilityMatchPercent: number;
  };
  reasons: string[];
  isSimilarStudentRecommended: boolean;
  similarStudentReason?: string;
  skillDetails: {
    matchedSkills: string[];
    missingSkills: string[];
    skillMatchRatio: string;
    gapItems: SkillGapItem[];
  };
}

const DEFAULT_WEIGHTS: WeightConfig = {
  skillsWeight: 0.55,
  interestsWeight: 0.20,
  careerWeight: 0.15,
  locationWeight: 0.10,
};

export function calculateRecommendation(
  profile: StudentProfile,
  eventItem: EventItem,
  allProfiles: StudentProfile[] = [],
  allRegistrations: Registration[] = [],
  customWeights?: Partial<WeightConfig>
): RecommendationResult {
  const weights: WeightConfig = { ...DEFAULT_WEIGHTS, ...customWeights };

  const studentSkills = (profile.skills || []).map(s => s.trim().toLowerCase());
  const studentInterests = (profile.interests || []).map(i => i.trim().toLowerCase());
  const careerGoal = (profile.career_goal || '').trim().toLowerCase();
  const studentLocation = (profile.location || '').trim().toLowerCase();
  const eventSkills = (eventItem.required_skills || []).map(s => s.trim().toLowerCase());
  const eventCareerRelevance = (eventItem.career_relevance || []).map(c => c.trim().toLowerCase());
  const eventCategory = (eventItem.category || '').trim().toLowerCase();
  const eventSubcategory = (eventItem.subcategory || '').trim().toLowerCase();
  const eventDesc = (eventItem.description || '').trim().toLowerCase();

  const reasons: string[] = [];

  // 1. Skill Score Calculation (55%)
  let matchedSkills: string[] = [];
  let missingSkills: string[] = [];

  if (eventSkills.length > 0) {
    eventSkills.forEach(reqSkill => {
      const originalReq = eventItem.required_skills.find(s => s.trim().toLowerCase() === reqSkill) || reqSkill;
      if (studentSkills.some(s => s.includes(reqSkill) || reqSkill.includes(s))) {
        matchedSkills.push(originalReq);
      } else {
        missingSkills.push(originalReq);
      }
    });
  } else {
    matchedSkills = profile.skills.slice(0, 2);
  }

  const rawSkillScore = eventSkills.length > 0
    ? matchedSkills.length / eventSkills.length
    : 0.85;
  const skillMatchPercent = Math.min(100, Math.round(rawSkillScore * 100));

  if (matchedSkills.length > 0) {
    reasons.push(`✓ Your ${matchedSkills.join(', ')} skill${matchedSkills.length > 1 ? 's' : ''} match this event requirement`);
  }

  // 2. Interest Score Calculation (20%)
  let interestMatchesCount = 0;
  studentInterests.forEach(interest => {
    if (
      eventCategory.includes(interest) ||
      eventSubcategory.includes(interest) ||
      eventDesc.includes(interest) ||
      eventSkills.some(s => s.includes(interest))
    ) {
      interestMatchesCount++;
      const capInterest = interest.toUpperCase();
      reasons.push(`✓ Your interest in ${capInterest} aligns with this opportunity`);
    }
  });

  const rawInterestScore = studentInterests.length > 0
    ? Math.min(1, interestMatchesCount / Math.min(3, studentInterests.length))
    : 0.7;
  const interestMatchPercent = Math.min(100, Math.round(rawInterestScore * 100));

  // 3. Career Goal Score (15%)
  let careerScore = 0.5;
  if (careerGoal) {
    const directMatch = eventCareerRelevance.some(cr => cr.includes(careerGoal) || careerGoal.includes(cr));
    const titleMatch = eventItem.title.toLowerCase().includes(careerGoal) || eventDesc.includes(careerGoal);

    if (directMatch || titleMatch) {
      careerScore = 1.0;
      reasons.push(`✓ Highly relevant to your career goal as ${profile.career_goal}`);
    } else if (eventCareerRelevance.length > 0) {
      careerScore = 0.7;
      reasons.push(`✓ Helps build foundational experience for ${profile.career_goal}`);
    }
  }
  const careerMatchPercent = Math.round(careerScore * 100);

  // 4. Location / Mode Score (10%)
  let locationScore = 0.8;
  const isOnline = eventItem.mode.toLowerCase() === 'online';
  const isSameLocation = eventItem.location.toLowerCase().includes(studentLocation) || studentLocation.includes(eventItem.location.toLowerCase());

  if (isOnline) {
    locationScore = 1.0;
    reasons.push(`✓ Online event accessible from anywhere`);
  } else if (isSameLocation) {
    locationScore = 1.0;
    reasons.push(`✓ Convenient location in ${eventItem.location}`);
  } else {
    locationScore = 0.6;
    reasons.push(`• In-person event in ${eventItem.location}`);
  }
  const locationMatchPercent = Math.round(locationScore * 100);

  // Calculate Weighted Total Base Score
  const baseScore = Math.round(
    (skillMatchPercent * weights.skillsWeight) +
    (interestMatchPercent * weights.interestsWeight) +
    (careerMatchPercent * weights.careerWeight) +
    (locationMatchPercent * weights.locationWeight)
  );

  // 5. SIMILAR STUDENT RECOMMENDATION LOGIC
  let isSimilarStudentRecommended = false;
  let similarStudentReason: string | undefined = undefined;

  // Check if event is relevant & eligible first (baseScore >= 50%)
  if (baseScore >= 50) {
    const peerRegistrations = allRegistrations.filter(r => r.event_id === eventItem.id && r.user_id !== profile.user_id);
    if (peerRegistrations.length > 0) {
      const peerUserIds = peerRegistrations.map(r => r.user_id);
      const similarPeers = allProfiles.filter(p => {
        if (!peerUserIds.includes(p.user_id)) return false;
        // Calculate interest overlap with peer
        const peerInterests = (p.interests || []).map(i => i.toLowerCase());
        const overlap = studentInterests.filter(i => peerInterests.includes(i));
        return overlap.length > 0;
      });

      if (similarPeers.length > 0) {
        isSimilarStudentRecommended = true;
        similarStudentReason = `Students with interests similar to yours are participating in this event.`;
        reasons.unshift(`⭐ ${similarStudentReason}`);
      }
    }
  }

  // Final match score clamp
  const finalScore = Math.max(45, Math.min(99, isSimilarStudentRecommended ? Math.min(99, baseScore + 5) : baseScore));

  const gapItems: SkillGapItem[] = missingSkills.map(skill => {
    return generateSkillGapRecommendation(skill);
  });

  return {
    eventId: eventItem.id,
    matchScore: finalScore,
    subScores: {
      skillMatchPercent,
      interestMatchPercent,
      careerMatchPercent,
      locationMatchPercent,
      eligibilityMatchPercent: 100,
    },
    reasons: reasons.slice(0, 5),
    isSimilarStudentRecommended,
    similarStudentReason,
    skillDetails: {
      matchedSkills,
      missingSkills,
      skillMatchRatio: `${matchedSkills.length} out of ${eventItem.required_skills.length || 1}`,
      gapItems,
    },
  };
}

function generateSkillGapRecommendation(skill: string): SkillGapItem {
  const s = skill.toLowerCase();

  if (s.includes('python')) {
    return {
      skill,
      matched: false,
      whyItMatters: 'Essential programming language for AI, data analysis, and backend scripts.',
      difficulty: 'Beginner',
      recommendation: 'Complete Python Fundamentals on W3Schools or official documentation before the event.',
    };
  }
  if (s.includes('machine learning') || s.includes('ai') || s.includes('ml')) {
    return {
      skill,
      matched: false,
      whyItMatters: 'Core knowledge required to train models and build intelligent decision engines.',
      difficulty: 'Intermediate',
      recommendation: 'Review scikit-learn basics, supervised classification models, and prompt engineering tools.',
    };
  }
  if (s.includes('deep learning') || s.includes('llm') || s.includes('agentic')) {
    return {
      skill,
      matched: false,
      whyItMatters: 'Required for state-of-the-art neural networks, multi-agent frameworks, and generative AI.',
      difficulty: 'Advanced',
      recommendation: 'Explore HuggingFace Transformers, PyTorch starter notebooks, and LangChain docs.',
    };
  }

  return {
    skill,
    matched: false,
    whyItMatters: `Recommended domain skill to maximize project performance and scoring in ${skill}.`,
    difficulty: 'Intermediate',
    recommendation: `Study starter crash courses and practice problem sets on ${skill}.`,
  };
}
