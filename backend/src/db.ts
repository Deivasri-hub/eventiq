import { Pool } from 'pg';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';

// Interfaces
export interface User {
  id: number;
  email: string;
  password_hash: string;
  name: string;
  role: 'student' | 'organizer';
  created_at?: string;
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
  previous_participations: string[];
}

export interface Organizer {
  id: number;
  user_id: number;
  organization_name: string;
  verified: boolean;
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
  organizer_id?: number;
  organizer_name?: string;
  registration_url?: string;
  image_url?: string;
  status: string;
  created_at?: string;
}

export interface Registration {
  id: number;
  user_id: number;
  event_id: number;
  status: string;
  registered_at: string;
}

export interface SavedEvent {
  id: number;
  user_id: number;
  event_id: number;
  saved_at: string;
}

interface DbSchema {
  users: User[];
  student_profiles: StudentProfile[];
  organizers: Organizer[];
  events: EventItem[];
  registrations: Registration[];
  saved_events: SavedEvent[];
}

let dbData: DbSchema = {
  users: [],
  student_profiles: [],
  organizers: [],
  events: [],
  registrations: [],
  saved_events: []
};

let pgPool: Pool | null = null;
let isPgAvailable = false;

const dbFilePath = path.join(__dirname, '..', 'ace_store.json');

function saveToDisk(): void {
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(dbData, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving ACE Intelligence store to disk:', err);
  }
}

export async function initDb(): Promise<void> {
  const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/ace_intelligence';

  try {
    const pool = new Pool({ connectionString, connectionTimeoutMillis: 1500 });
    const client = await pool.connect();
    client.release();
    pgPool = pool;
    isPgAvailable = true;
    console.log('✅ Connected to PostgreSQL database (ACE Intelligence)');
    await runPgMigrations();
    await seedPgData();
    return;
  } catch (err) {
    console.log('⚡ PostgreSQL unavailable. Operating with embedded zero-config ACE Intelligence engine.');
    isPgAvailable = false;
  }

  // Load from disk if exists
  if (fs.existsSync(dbFilePath)) {
    try {
      const raw = fs.readFileSync(dbFilePath, 'utf8');
      dbData = JSON.parse(raw);
      console.log('📂 Loaded existing ACE Intelligence store from disk.');
    } catch (e) {
      console.log('Re-initializing fresh data store.');
    }
  }

  if (dbData.users.length === 0 || dbData.events.length === 0) {
    seedLocalData();
  }
}

function seedLocalData(): void {
  console.log('🌱 Seeding ACE demo student, organizer, and 30 sample events...');

  const studentHash = bcrypt.hashSync('student123', 10);
  const organizerHash = bcrypt.hashSync('organizer123', 10);

  const studentUser: User = {
    id: 1,
    email: 'student@ace.demo',
    password_hash: studentHash,
    name: 'Alex Rivera',
    role: 'student',
    created_at: new Date().toISOString()
  };

  const studentProfile: StudentProfile = {
    user_id: 1,
    department: 'Computer Science & Engineering',
    year: 3,
    location: 'Coimbatore',
    career_goal: 'AI Engineer',
    experience_level: 'Intermediate',
    skills: ['Python', 'Machine Learning', 'JavaScript', 'Problem Solving', 'Data Science'],
    interests: ['AI', 'Web Development', 'Data Science', 'Cloud'],
    previous_participations: ['HACKNIMA 2026', 'GENESIS\'26 / Martian Chronicles']
  };

  // Peer student with similar AI interests for Social Recommendation testing
  const peerUser: User = {
    id: 3,
    email: 'sarah.peer@ace.demo',
    password_hash: studentHash,
    name: 'Sarah Chen',
    role: 'student',
    created_at: new Date().toISOString()
  };

  const peerProfile: StudentProfile = {
    user_id: 3,
    department: 'AI & Data Science (AI & DS)',
    year: 3,
    location: 'Coimbatore',
    career_goal: 'ML Engineer',
    experience_level: 'Intermediate',
    skills: ['Python', 'Machine Learning', 'AI', 'Problem Solving'],
    interests: ['AI', 'Data Science', 'Web Development'],
    previous_participations: ['HackACE 2026']
  };

  const organizerUser: User = {
    id: 2,
    email: 'organizer@ace.demo',
    password_hash: organizerHash,
    name: 'ACE Organizers Hub',
    role: 'organizer',
    created_at: new Date().toISOString()
  };

  const organizer: Organizer = {
    id: 1,
    user_id: 2,
    organization_name: 'AllCollegeEvent (ACE) Network',
    verified: true
  };

  dbData.users = [studentUser, organizerUser, peerUser];
  dbData.student_profiles = [studentProfile, peerProfile];
  dbData.organizers = [organizer];

  // Seed events from seed file
  const seedPath = path.join(__dirname, '..', '..', 'seed', 'events_seed.json');
  if (fs.existsSync(seedPath)) {
    const rawEvents = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
    dbData.events = rawEvents.map((evt: any, idx: number) => ({
      id: idx + 1,
      event_code: evt.event_code || `EVT00${idx + 1}`,
      title: evt.title,
      description: evt.description,
      event_type: evt.event_type,
      category: evt.category,
      subcategory: evt.subcategory || '',
      mode: evt.mode,
      location: evt.location,
      start_date: evt.start_date,
      end_date: evt.end_date,
      start_time: evt.start_time || '09:00',
      end_time: evt.end_time || '18:00',
      registration_deadline: evt.registration_deadline || evt.start_date,
      registration_fee: Number(evt.registration_fee || 0),
      is_free: Boolean(evt.is_free),
      eligibility: evt.eligibility || 'Open to all students',
      required_skills: evt.required_skills || [],
      target_audience: evt.target_audience || ['Students'],
      difficulty: evt.difficulty || 'Intermediate',
      career_relevance: evt.career_relevance || ['Software Engineer'],
      organizer_id: 1,
      organizer_name: evt.organizer_name || 'AllCollegeEvent Network',
      registration_url: evt.registration_url || `https://ace.demo/register/EVT${idx + 1}`,
      image_url: evt.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
      status: evt.status || 'Upcoming',
      created_at: new Date().toISOString()
    }));
    console.log(`✅ Seeded ${dbData.events.length} real sample events into ACE store`);
  }

  // Pre-seed a peer registration for event 2 (HackACE 2026) to demonstrate Similar Student Recommendations
  dbData.registrations = [
    { id: 1, user_id: 3, event_id: 2, status: 'registered', registered_at: new Date().toISOString() },
    { id: 2, user_id: 3, event_id: 9, status: 'registered', registered_at: new Date().toISOString() }
  ];

  saveToDisk();
}

async function runPgMigrations(): Promise<void> {
  if (!pgPool) return;
  const schemaPath = path.join(__dirname, '..', '..', 'database', 'schema.sql');
  if (fs.existsSync(schemaPath)) {
    const sql = fs.readFileSync(schemaPath, 'utf8');
    await pgPool.query(sql);
  }
}

async function seedPgData(): Promise<void> {
  if (!pgPool) return;
  const res = await pgPool.query('SELECT COUNT(*) FROM users');
  if (parseInt(res.rows[0].count, 10) > 0) return;

  const studentHash = await bcrypt.hash('student123', 10);
  const organizerHash = await bcrypt.hash('organizer123', 10);

  const uRes = await pgPool.query(
    `INSERT INTO users (email, password_hash, name, role) VALUES ($1, $2, $3, $4) RETURNING id`,
    ['student@ace.demo', studentHash, 'Alex Rivera', 'student']
  );
  const studentId = uRes.rows[0].id;

  await pgPool.query(
    `INSERT INTO student_profiles (user_id, department, year, location, career_goal, experience_level, skills, interests)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      studentId, 'Computer Science & Engineering', 3, 'Coimbatore', 'AI Engineer', 'Intermediate',
      ['Python', 'Machine Learning', 'JavaScript', 'Problem Solving', 'Data Science'],
      ['AI', 'Web Development', 'Data Science', 'Cloud']
    ]
  );

  const oRes = await pgPool.query(
    `INSERT INTO users (email, password_hash, name, role) VALUES ($1, $2, $3, $4) RETURNING id`,
    ['organizer@ace.demo', organizerHash, 'ACE Organizers Hub', 'organizer']
  );
  const orgUserId = oRes.rows[0].id;

  await pgPool.query(
    `INSERT INTO organizers (user_id, organization_name, verified) VALUES ($1, $2, true) RETURNING id`,
    [orgUserId, 'AllCollegeEvent (ACE) Network']
  );
}

// Exported DB Methods
export async function findUserByEmail(email: string): Promise<User | null> {
  if (isPgAvailable && pgPool) {
    const res = await pgPool.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]);
    return res.rows[0] || null;
  }
  const found = dbData.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  return found || null;
}

export async function findUserById(id: number): Promise<User | null> {
  if (isPgAvailable && pgPool) {
    const res = await pgPool.query('SELECT id, email, name, role, created_at FROM users WHERE id = $1', [id]);
    return res.rows[0] || null;
  }
  const found = dbData.users.find(u => u.id === id);
  return found || null;
}

export async function createUser(email: string, passwordHash: string, name: string, role: 'student' | 'organizer'): Promise<User> {
  if (isPgAvailable && pgPool) {
    const res = await pgPool.query(
      `INSERT INTO users (email, password_hash, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role, created_at`,
      [email, passwordHash, name, role]
    );
    const u = res.rows[0];
    if (role === 'student') {
      await pgPool.query(`INSERT INTO student_profiles (user_id) VALUES ($1)`, [u.id]);
    } else {
      await pgPool.query(`INSERT INTO organizers (user_id, organization_name) VALUES ($1, $2)`, [u.id, name + ' Org']);
    }
    return u;
  }

  const newId = dbData.users.length + 1;
  const newUser: User = { id: newId, email, password_hash: passwordHash, name, role, created_at: new Date().toISOString() };
  dbData.users.push(newUser);

  if (role === 'student') {
    dbData.student_profiles.push({
      user_id: newId,
      department: 'Computer Science & Engineering',
      year: 3,
      location: 'Coimbatore',
      career_goal: 'AI Engineer',
      experience_level: 'Intermediate',
      skills: ['Python', 'Problem Solving'],
      interests: ['AI', 'Web Development'],
      previous_participations: []
    });
  } else {
    dbData.organizers.push({
      id: dbData.organizers.length + 1,
      user_id: newId,
      organization_name: `${name} Organization`,
      verified: true
    });
  }

  saveToDisk();
  return newUser;
}

export async function getStudentProfile(userId: number): Promise<StudentProfile | null> {
  if (isPgAvailable && pgPool) {
    const res = await pgPool.query('SELECT * FROM student_profiles WHERE user_id = $1', [userId]);
    return res.rows[0] || null;
  }
  const profile = dbData.student_profiles.find(p => p.user_id === userId);
  return profile || dbData.student_profiles[0] || null;
}

export async function getAllStudentProfiles(): Promise<StudentProfile[]> {
  return dbData.student_profiles;
}

export async function updateStudentProfile(userId: number, data: Partial<StudentProfile>): Promise<StudentProfile> {
  let idx = dbData.student_profiles.findIndex(p => p.user_id === userId);
  if (idx === -1) {
    const newProfile: StudentProfile = {
      user_id: userId,
      department: data.department || 'Computer Science & Engineering',
      year: Number(data.year || 3),
      location: data.location || 'Coimbatore',
      career_goal: data.career_goal || 'AI Engineer',
      experience_level: data.experience_level || 'Intermediate',
      skills: data.skills || ['Python'],
      interests: data.interests || ['AI'],
      previous_participations: data.previous_participations || []
    };
    dbData.student_profiles.push(newProfile);
    saveToDisk();
    return newProfile;
  }

  dbData.student_profiles[idx] = {
    ...dbData.student_profiles[idx],
    ...data,
    user_id: userId,
    skills: data.skills || dbData.student_profiles[idx].skills,
    interests: data.interests || dbData.student_profiles[idx].interests,
    previous_participations: data.previous_participations !== undefined ? data.previous_participations : dbData.student_profiles[idx].previous_participations
  };

  saveToDisk();
  return dbData.student_profiles[idx];
}

export async function getAllEvents(): Promise<EventItem[]> {
  if (isPgAvailable && pgPool) {
    const res = await pgPool.query('SELECT * FROM events ORDER BY id ASC');
    return res.rows;
  }
  return dbData.events;
}

export async function getEventById(id: number): Promise<EventItem | null> {
  if (isPgAvailable && pgPool) {
    const res = await pgPool.query('SELECT * FROM events WHERE id = $1', [id]);
    return res.rows[0] || null;
  }
  return dbData.events.find(e => e.id === id) || null;
}

export async function createEvent(evt: Partial<EventItem>): Promise<EventItem> {
  const newId = dbData.events.length + 1;
  const eventCode = evt.event_code || `EVT${Date.now().toString().slice(-4)}`;
  const title = evt.title || 'New Opportunity';
  const newEvent: EventItem = {
    id: newId,
    event_code: eventCode,
    title,
    description: evt.description || '',
    event_type: evt.event_type || 'Hackathon',
    category: evt.category || 'Academic & Professional',
    subcategory: evt.subcategory || '',
    mode: evt.mode || 'Offline',
    location: evt.location || 'Coimbatore',
    start_date: evt.start_date || '2026-10-15',
    end_date: evt.end_date || '2026-10-16',
    start_time: evt.start_time || '09:00',
    end_time: evt.end_time || '18:00',
    registration_deadline: evt.registration_deadline || evt.start_date,
    registration_fee: Number(evt.registration_fee || 0),
    is_free: Number(evt.registration_fee || 0) === 0,
    eligibility: evt.eligibility || 'Open to all engineering students',
    required_skills: evt.required_skills || ['Python', 'Problem Solving'],
    target_audience: evt.target_audience || ['Students'],
    difficulty: evt.difficulty || 'Intermediate',
    career_relevance: evt.career_relevance || ['Software Engineer'],
    organizer_id: 1,
    organizer_name: evt.organizer_name || 'AllCollegeEvent Network',
    registration_url: evt.registration_url || `https://ace.demo/register/${eventCode}`,
    image_url: evt.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
    status: evt.status || 'Upcoming',
    created_at: new Date().toISOString()
  };

  dbData.events.unshift(newEvent);
  saveToDisk();
  return newEvent;
}

export async function registerEvent(userId: number, eventId: number): Promise<boolean> {
  const exists = dbData.registrations.some(r => r.user_id === userId && r.event_id === eventId);
  if (!exists) {
    dbData.registrations.push({
      id: dbData.registrations.length + 1,
      user_id: userId,
      event_id: eventId,
      status: 'registered',
      registered_at: new Date().toISOString()
    });
    saveToDisk();
  }
  return true;
}

export async function getUserRegistrations(userId: number): Promise<EventItem[]> {
  const registeredIds = dbData.registrations.filter(r => r.user_id === userId).map(r => r.event_id);
  return dbData.events.filter(e => registeredIds.includes(e.id));
}

export async function getAllRegistrations(): Promise<Registration[]> {
  return dbData.registrations;
}

export async function toggleSaveEvent(userId: number, eventId: number): Promise<{ saved: boolean }> {
  const idx = dbData.saved_events.findIndex(s => s.user_id === userId && s.event_id === eventId);
  if (idx !== -1) {
    dbData.saved_events.splice(idx, 1);
    saveToDisk();
    return { saved: false };
  } else {
    dbData.saved_events.push({
      id: dbData.saved_events.length + 1,
      user_id: userId,
      event_id: eventId,
      saved_at: new Date().toISOString()
    });
    saveToDisk();
    return { saved: true };
  }
}

export async function getUserSavedEvents(userId: number): Promise<EventItem[]> {
  const savedIds = dbData.saved_events.filter(s => s.user_id === userId).map(s => s.event_id);
  return dbData.events.filter(e => savedIds.includes(e.id));
}

export async function getSavedEventIds(userId: number): Promise<number[]> {
  return dbData.saved_events.filter(s => s.user_id === userId).map(s => s.event_id);
}

export async function getRegisteredEventIds(userId: number): Promise<number[]> {
  return dbData.registrations.filter(r => r.user_id === userId).map(r => r.event_id);
}
