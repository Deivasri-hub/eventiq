const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'student' | 'organizer';
}

export interface StudentProfile {
  user_id: number;
  department: string;
  year: number;
  location: string;
  career_goal: string;
  experience_level: string;
  skills: string[];
  interests: string[];
  previous_participations?: string[];
}

export interface EventItem {
  id: number;
  event_code: string;
  title: string;
  description: string;
  event_type: string;
  category: string;
  subcategory?: string;
  mode: string;
  location: string;
  start_date: string;
  end_date: string;
  start_time?: string;
  end_time?: string;
  registration_deadline?: string;
  registration_fee: number;
  is_free: boolean;
  eligibility?: string;
  required_skills: string[];
  target_audience: string[];
  difficulty: string;
  career_relevance: string[];
  organizer_name?: string;
  registration_url?: string;
  image_url?: string;
  status: string;
  matchScore?: number;
  reasons?: string[];
  isSimilarStudentRecommended?: boolean;
  similarStudentReason?: string;
  subScores?: {
    skillMatchPercent: number;
    interestMatchPercent: number;
    careerMatchPercent: number;
    locationMatchPercent: number;
    eligibilityMatchPercent: number;
  };
  isSaved?: boolean;
  isRegistered?: boolean;
}

export interface SkillGapItem {
  skill: string;
  matched: boolean;
  whyItMatters: string;
  difficulty: string;
  recommendation: string;
}

export interface RecommendationDetail {
  event: EventItem;
  recommendation: {
    eventId: number;
    matchScore: number;
    subScores: {
      skillMatchPercent: number;
      interestMatchPercent: number;
      careerMatchPercent: number;
      locationMatchPercent: number;
      eligibilityMatchPercent: number;
    };
    reasons: string[];
    isSimilarStudentRecommended?: boolean;
    similarStudentReason?: string;
    skillDetails: {
      matchedSkills: string[];
      missingSkills: string[];
      skillMatchRatio: string;
      gapItems: SkillGapItem[];
    };
  };
  isSaved: boolean;
  isRegistered: boolean;
}

export interface EventAnalysisResult {
  smartCategory: string;
  skillTags: string[];
  targetAudience: { department: string; matchPercent: number }[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  careerRelevance: string[];
  completenessScore: number;
  qualityScore: number;
  urgency: 'High' | 'Medium' | 'Normal';
  recommendationsForOrganizer: string[];
}

function getHeaders(): HeadersInit {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('ace_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
}

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...getHeaders(),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Network error' }));
    throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
  }

  return res.json();
}
