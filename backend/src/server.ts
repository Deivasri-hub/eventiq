import express, { Response } from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import {
  initDb,
  findUserByEmail,
  findUserById,
  createUser,
  getStudentProfile,
  getAllStudentProfiles,
  updateStudentProfile,
  getAllEvents,
  getEventById,
  createEvent,
  registerEvent,
  getUserRegistrations,
  getAllRegistrations,
  toggleSaveEvent,
  getUserSavedEvents,
  getSavedEventIds,
  getRegisteredEventIds,
} from './db';
import { generateToken, authenticateToken, AuthRequest } from './auth';
import { calculateRecommendation } from './recommendation';
import { analyzeEventDetails } from './aiEngine';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ----------------------------------------------------
// AUTH ENDPOINTS
// ----------------------------------------------------
app.post('/api/auth/signup', async (req, res): Promise<any> => {
  try {
    const { email, password, name, role } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required.' });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userRole = role === 'organizer' ? 'organizer' : 'student';
    const newUser = await createUser(email, passwordHash, name, userRole);
    const token = generateToken({ id: newUser.id, email: newUser.email, role: newUser.role });

    return res.status(201).json({
      message: 'Account created successfully',
      token,
      user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role },
    });
  } catch (err: any) {
    console.error('Signup error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res): Promise<any> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    return res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

app.get('/api/auth/me', authenticateToken, async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
    const user = await findUserById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json({ user });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// STUDENT PROFILE ENDPOINTS
// ----------------------------------------------------
app.get('/api/students/profile', authenticateToken, async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id || 1;
    let profile = await getStudentProfile(userId);
    if (!profile) {
      profile = {
        user_id: userId,
        department: 'Computer Science & Engineering',
        year: 3,
        location: 'Coimbatore',
        career_goal: 'AI Engineer',
        experience_level: 'Intermediate',
        skills: ['Python', 'Machine Learning', 'JavaScript', 'Problem Solving', 'Data Science'],
        interests: ['AI', 'Web Development', 'Data Science', 'Cloud'],
        previous_participations: ['HACKNIMA 2026'],
      };
    }
    return res.json(profile);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.put('/api/students/profile', authenticateToken, async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id || 1;
    const updated = await updateStudentProfile(userId, req.body);
    return res.json({ message: 'Profile updated successfully', profile: updated });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// EVENTS ENDPOINTS
// ----------------------------------------------------
app.get('/api/events', async (req, res): Promise<any> => {
  try {
    const events = await getAllEvents();
    return res.json(events);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.get('/api/events/:id', async (req, res): Promise<any> => {
  try {
    const id = parseInt(req.params.id, 10);
    const eventItem = await getEventById(id);
    if (!eventItem) return res.status(404).json({ error: 'Event not found' });
    return res.json(eventItem);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/events', authenticateToken, async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const eventItem = await createEvent(req.body);
    return res.status(201).json(eventItem);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// RECOMMENDATION & SKILL GAP ENDPOINTS
// ----------------------------------------------------
app.get('/api/recommendations', authenticateToken, async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id || 1;
    const profile = (await getStudentProfile(userId)) || {
      user_id: userId,
      department: 'Computer Science & Engineering',
      year: 3,
      location: 'Coimbatore',
      career_goal: 'AI Engineer',
      experience_level: 'Intermediate',
      skills: ['Python', 'Machine Learning', 'JavaScript', 'Problem Solving', 'Data Science'],
      interests: ['AI', 'Web Development', 'Data Science', 'Cloud'],
      previous_participations: ['HACKNIMA 2026'],
    };

    const events = await getAllEvents();
    const allProfiles = await getAllStudentProfiles();
    const allRegistrations = await getAllRegistrations();
    const savedIds = await getSavedEventIds(userId);
    const registeredIds = await getRegisteredEventIds(userId);

    const recommendations = events.map(evt => {
      const rec = calculateRecommendation(profile, evt, allProfiles, allRegistrations);
      return {
        ...evt,
        matchScore: rec.matchScore,
        reasons: rec.reasons,
        subScores: rec.subScores,
        isSimilarStudentRecommended: rec.isSimilarStudentRecommended,
        similarStudentReason: rec.similarStudentReason,
        isSaved: savedIds.includes(evt.id),
        isRegistered: registeredIds.includes(evt.id),
      };
    });

    recommendations.sort((a, b) => b.matchScore - a.matchScore);
    return res.json(recommendations);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.get('/api/events/:id/recommendation', authenticateToken, async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id || 1;
    const id = parseInt(req.params.id, 10);
    const evt = await getEventById(id);
    if (!evt) return res.status(404).json({ error: 'Event not found' });

    const profile = (await getStudentProfile(userId)) || {
      user_id: userId,
      department: 'Computer Science & Engineering',
      year: 3,
      location: 'Coimbatore',
      career_goal: 'AI Engineer',
      experience_level: 'Intermediate',
      skills: ['Python', 'Machine Learning', 'JavaScript', 'Problem Solving', 'Data Science'],
      interests: ['AI', 'Web Development', 'Data Science', 'Cloud'],
      previous_participations: ['HACKNIMA 2026'],
    };

    const allProfiles = await getAllStudentProfiles();
    const allRegistrations = await getAllRegistrations();
    const rec = calculateRecommendation(profile, evt, allProfiles, allRegistrations);
    const savedIds = await getSavedEventIds(userId);
    const registeredIds = await getRegisteredEventIds(userId);

    return res.json({
      event: evt,
      recommendation: rec,
      isSaved: savedIds.includes(evt.id),
      isRegistered: registeredIds.includes(evt.id),
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.get('/api/events/:id/skill-gap', authenticateToken, async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id || 1;
    const id = parseInt(req.params.id, 10);
    const evt = await getEventById(id);
    if (!evt) return res.status(404).json({ error: 'Event not found' });

    const profile = (await getStudentProfile(userId)) || {
      user_id: userId,
      department: 'Computer Science & Engineering',
      year: 3,
      location: 'Coimbatore',
      career_goal: 'AI Engineer',
      experience_level: 'Intermediate',
      skills: ['Python', 'Machine Learning', 'JavaScript', 'Problem Solving', 'Data Science'],
      interests: ['AI', 'Web Development', 'Data Science', 'Cloud'],
      previous_participations: ['HACKNIMA 2026'],
    };

    const allProfiles = await getAllStudentProfiles();
    const allRegistrations = await getAllRegistrations();
    const rec = calculateRecommendation(profile, evt, allProfiles, allRegistrations);

    return res.json({
      eventTitle: evt.title,
      requiredSkills: evt.required_skills,
      studentSkills: profile.skills,
      skillDetails: rec.skillDetails,
      matchScore: rec.matchScore,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// REGISTRATIONS & SAVED EVENTS
// ----------------------------------------------------
app.post('/api/events/:id/register', authenticateToken, async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id || 1;
    const eventId = parseInt(req.params.id, 10);
    await registerEvent(userId, eventId);
    return res.json({ message: 'Successfully registered for event', eventId });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.get('/api/registrations', authenticateToken, async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id || 1;
    const events = await getUserRegistrations(userId);
    return res.json(events);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/events/:id/save', authenticateToken, async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id || 1;
    const eventId = parseInt(req.params.id, 10);
    const result = await toggleSaveEvent(userId, eventId);
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.delete('/api/events/:id/save', authenticateToken, async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id || 1;
    const eventId = parseInt(req.params.id, 10);
    const result = await toggleSaveEvent(userId, eventId);
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.get('/api/saved-events', authenticateToken, async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id || 1;
    const events = await getUserSavedEvents(userId);
    return res.json(events);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// ORGANIZER ENDPOINTS
// ----------------------------------------------------
app.get('/api/organizer/dashboard', authenticateToken, async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const events = await getAllEvents();
    return res.json({
      totalEvents: events.length,
      activeEvents: events.filter(e => e.status === 'Upcoming' || e.status === 'Ongoing').length,
      registrations: 512,
      views: 4290,
      recentEvents: events.slice(0, 5),
      audienceInsights: [
        { department: 'AI & Data Science (AI & DS)', fitScore: 88 },
        { department: 'Computer Science & Engineering (CSE)', fitScore: 82 },
        { department: 'Information Technology (IT)', fontScore: 74, fitScore: 74 },
        { department: 'Electronics & Communication (ECE)', fitScore: 61 },
      ],
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.get('/api/organizer/events', authenticateToken, async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const events = await getAllEvents();
    return res.json(events);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/organizer/events', authenticateToken, async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const eventItem = await createEvent(req.body);
    return res.status(201).json(eventItem);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// AI EVENT ANALYSIS ENDPOINT
// ----------------------------------------------------
app.post('/api/ai/analyze-event', async (req, res): Promise<any> => {
  try {
    const result = analyzeEventDetails(req.body);
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Start Server
initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 ACE Intelligence API server listening on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
});
