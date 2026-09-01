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

// Default Fallback Data when backend server is offline/unreachable on client
const MOCK_EVENTS: EventItem[] = [
  {
    id: 1,
    event_code: 'EVT001',
    title: 'HACKNIMA 2026',
    description: 'National-level online hackathon empowering students to build high-impact EdTech and software solutions.',
    event_type: 'Hackathon',
    category: 'Academic & Professional',
    mode: 'Online',
    location: 'Online',
    start_date: '2026-08-01',
    end_date: '2026-10-31',
    registration_fee: 0,
    is_free: true,
    required_skills: ['Python', 'Problem Solving', 'EdTech', 'Web Development'],
    target_audience: ['Students'],
    difficulty: 'Intermediate',
    career_relevance: ['Software Engineer'],
    organizer_name: 'Poornima University',
    image_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
    status: 'Upcoming',
    matchScore: 94,
    reasons: ['Direct skill overlap with Python & Problem Solving', 'High relevance to your Software Engineer career goal'],
    isSimilarStudentRecommended: true,
    similarStudentReason: 'Registered by 14 students with similar AI & CS interests'
  },
  {
    id: 2,
    event_code: 'EVT002',
    title: 'HackACE 2026',
    description: 'International-level innovation challenge focusing on Artificial Intelligence, machine learning models, and real-world software prototypes.',
    event_type: 'Hackathon',
    category: 'Academic & Professional',
    mode: 'Online',
    location: 'Online',
    start_date: '2026-07-13',
    end_date: '2026-09-13',
    registration_fee: 0,
    is_free: true,
    required_skills: ['Programming', 'AI', 'Problem Solving', 'Machine Learning'],
    target_audience: ['Students', 'Developers'],
    difficulty: 'Intermediate',
    career_relevance: ['AI Engineer'],
    organizer_name: 'KPR Institute / ACE',
    image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    status: 'Upcoming',
    matchScore: 91,
    reasons: ['Matches AI & Machine Learning skills', 'Aligned with AI Engineer career goal'],
    isSimilarStudentRecommended: true,
    similarStudentReason: 'Popular among 4th Year AI & Data Science peers'
  }
];

function handleClientFallback<T>(endpoint: string, options: RequestInit): T {
  let bodyData: any = {};
  if (options.body && typeof options.body === 'string') {
    try { bodyData = JSON.parse(options.body); } catch (e) {}
  }

  if (endpoint.includes('/auth/signup')) {
    const user = {
      id: Date.now(),
      email: bodyData.email || 'student@eventiq.demo',
      name: bodyData.name || 'EventIQ User',
      role: bodyData.role || 'student'
    };
    return { token: 'demo-jwt-token', user } as T;
  }

  if (endpoint.includes('/auth/login')) {
    const user = {
      id: 1,
      email: bodyData.email || 'student@eventiq.demo',
      name: bodyData.email ? bodyData.email.split('@')[0] : 'EventIQ User',
      role: bodyData.email?.includes('organizer') ? 'organizer' : 'student'
    };
    return { token: 'demo-jwt-token', user } as T;
  }

  if (endpoint.includes('/students/profile')) {
    return {
      user_id: 1,
      department: 'Computer Science & Engineering',
      year: 3,
      location: 'Coimbatore',
      career_goal: 'Software Engineer',
      experience_level: 'Intermediate',
      skills: ['Python', 'Machine Learning', 'JavaScript', 'Problem Solving'],
      interests: ['AI', 'Web Development', 'Data Science'],
      previous_participations: ['HACKNIMA 2026']
    } as T;
  }

  if (endpoint.includes('/recommendations') || endpoint === '/events') {
    return MOCK_EVENTS as T;
  }

  if (endpoint.includes('/recommendation')) {
    return {
      event: MOCK_EVENTS[0],
      recommendation: {
        eventId: 1,
        matchScore: 94,
        subScores: { skillMatchPercent: 95, interestMatchPercent: 90, careerMatchPercent: 95, locationMatchPercent: 100, eligibilityMatchPercent: 100 },
        reasons: ['Direct skill overlap', 'Matches career goals'],
        isSimilarStudentRecommended: true,
        similarStudentReason: 'Registered by 14 peer students',
        skillDetails: {
          matchedSkills: ['Python', 'Problem Solving'],
          missingSkills: ['EdTech'],
          skillMatchRatio: '2/3',
          gapItems: [{ skill: 'EdTech', matched: false, whyItMatters: 'Key for project track', difficulty: 'Beginner', recommendation: 'Review EdTech case studies' }]
        }
      },
      isSaved: false,
      isRegistered: false
    } as T;
  }

  if (endpoint.includes('/register')) {
    return { message: 'Successfully registered for event', eventId: 1 } as T;
  }

  if (endpoint.includes('/save')) {
    return { saved: true } as T;
  }

  if (endpoint.includes('/registrations') || endpoint.includes('/saved-events')) {
    return [MOCK_EVENTS[0]] as T;
  }

  if (endpoint.includes('/organizer/dashboard')) {
    return {
      totalEvents: 6,
      activeEvents: 4,
      registrations: 512,
      views: 4290,
      recentEvents: MOCK_EVENTS,
      audienceInsights: [
        { department: 'AI & Data Science (AI & DS)', fitScore: 88 },
        { department: 'Computer Science & Engineering (CSE)', fitScore: 82 }
      ]
    } as T;
  }

  return {} as T;
}

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  try {
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
  } catch (err: any) {
    console.warn(`API call to ${endpoint} failed, using intelligent client fallback:`, err.message);
    return handleClientFallback<T>(endpoint, options);
  }
}
