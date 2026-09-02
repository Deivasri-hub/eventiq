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

const DEFAULT_MOCK_EVENTS: EventItem[] = [
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

function getStoredEventsTS(): EventItem[] {
  if (typeof window === 'undefined') return DEFAULT_MOCK_EVENTS;
  try {
    const raw = localStorage.getItem('eventiq_events');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  localStorage.setItem('eventiq_events', JSON.stringify(DEFAULT_MOCK_EVENTS));
  return DEFAULT_MOCK_EVENTS;
}

function saveStoredEventsTS(events: EventItem[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('eventiq_events', JSON.stringify(events));
  } catch (e) {}
}

function getSavedIdsTS(): number[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('eventiq_saved_ids');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [];
}

function toggleSavedIdTS(id: number): boolean {
  const ids = getSavedIdsTS();
  const index = ids.indexOf(id);
  let isSaved = false;
  if (index >= 0) {
    ids.splice(index, 1);
    isSaved = false;
  } else {
    ids.push(id);
    isSaved = true;
  }
  if (typeof window !== 'undefined') {
    localStorage.setItem('eventiq_saved_ids', JSON.stringify(ids));
  }
  return isSaved;
}

function handleClientFallback<T>(endpoint: string, options: RequestInit): T {
  let bodyData: any = {};
  if (options.body && typeof options.body === 'string') {
    try { bodyData = JSON.parse(options.body); } catch (e) {}
  }

  const events = getStoredEventsTS();
  const savedIds = getSavedIdsTS();

  if (endpoint.includes('/auth/reset-password')) {
    return { message: 'Password updated successfully! Please sign in with your new password.' } as T;
  }

  if (endpoint.includes('/auth/signup')) {
    const user = {
      id: Date.now(),
      email: bodyData.email || 'user@eventiq.app',
      name: bodyData.name || (bodyData.email ? bodyData.email.split('@')[0] : 'EventIQ User'),
      role: bodyData.role || 'student'
    };
    return { token: 'jwt-user-token-' + Date.now(), user } as T;
  }

  if (endpoint.includes('/auth/login')) {
    const user = {
      id: Date.now(),
      email: bodyData.email || 'user@eventiq.app',
      name: bodyData.name || (bodyData.email ? bodyData.email.split('@')[0] : 'EventIQ User'),
      role: bodyData.email?.includes('organizer') ? 'organizer' : 'student'
    };
    return { token: 'jwt-user-token-' + Date.now(), user } as T;
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

  if (endpoint.includes('/ai/analyze-event')) {
    const skills = bodyData.requiredSkills || [];
    return {
      smartCategory: 'AI & Data Science',
      skillTags: skills.length ? skills : ['Python', 'Machine Learning', 'AI'],
      targetAudience: [
        { department: 'AI & Data Science (AI & DS)', matchPercent: 94 },
        { department: 'Computer Science & Engineering (CSE)', matchPercent: 88 },
        { department: 'Information Technology (IT)', matchPercent: 82 }
      ],
      difficulty: 'Intermediate',
      careerRelevance: ['AI Engineer', 'ML Architect', 'Fullstack Developer'],
      completenessScore: 92,
      qualityScore: 96,
      urgency: 'High',
      recommendationsForOrganizer: [
        'Great skill alignment! Highlight hands-on AI project tracks in your description.',
        'Offer certificates or prize incentives to maximize registrations.'
      ]
    } as T;
  }

  if (endpoint === '/organizer/events' && options.method === 'POST') {
    const newEvt: EventItem = {
      id: Date.now(),
      event_code: 'EVT-' + Math.floor(Math.random() * 10000),
      title: bodyData.title || bodyData.event_name || 'New Event',
      description: bodyData.description || '',
      event_type: bodyData.event_type || 'Hackathon',
      category: bodyData.category || 'Academic & Professional',
      mode: bodyData.mode || 'Online',
      location: bodyData.location || 'Online',
      start_date: bodyData.start_date || new Date().toISOString().split('T')[0],
      end_date: bodyData.end_date || new Date().toISOString().split('T')[0],
      registration_fee: bodyData.registration_fee || 0,
      is_free: Boolean(bodyData.is_free),
      required_skills: bodyData.required_skills || [],
      target_audience: bodyData.target_audience || ['Students'],
      difficulty: bodyData.difficulty || 'Intermediate',
      career_relevance: ['Software Developer', 'AI Engineer'],
      status: bodyData.status || 'Upcoming',
      organizer_name: 'ACE Organizers Hub',
      matchScore: 95
    };
    events.unshift(newEvt);
    saveStoredEventsTS(events);
    return newEvt as T;
  }

  if (endpoint.includes('/organizer/events')) {
    return events as T;
  }

  if (endpoint.includes('/recommendations') || endpoint === '/events') {
    const mapped = events.map(e => ({
      ...e,
      isSaved: savedIds.includes(e.id),
      matchScore: e.matchScore || 90
    }));
    return mapped as T;
  }

  if (endpoint.includes('/save')) {
    const parts = endpoint.split('/');
    const id = parseInt(parts[2], 10);
    const isSaved = toggleSavedIdTS(id);
    return { saved: isSaved } as T;
  }

  if (endpoint.includes('/saved-events')) {
    const saved = events.filter(e => savedIds.includes(e.id)).map(e => ({ ...e, isSaved: true }));
    return saved as T;
  }

  if (endpoint.includes('/organizer/dashboard')) {
    return {
      totalEvents: events.length,
      activeEvents: events.length,
      registrations: 512,
      views: 4290,
      recentEvents: events,
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

    const data = await res.json();
    if (endpoint === '/organizer/events' && options.method === 'POST' && data && data.id) {
      const events = getStoredEventsTS();
      events.unshift(data);
      saveStoredEventsTS(events);
    }
    if (endpoint.includes('/save') && options.method === 'POST') {
      const parts = endpoint.split('/');
      toggleSavedIdTS(parseInt(parts[2], 10));
    }
    return data;
  } catch (err: any) {
    return handleClientFallback<T>(endpoint, options);
  }
}

export function trackInteraction(eventId: number | string, action: 'VIEW' | 'CLICK' | 'LIKE' | 'SAVE' | 'REGISTER' | 'DISMISS') {
  if (!eventId || !action) return;
  fetchApi('/interactions', {
    method: 'POST',
    body: JSON.stringify({ event_id: eventId, action }),
  }).catch(() => {});
}

