CREATE TABLE IF NOT EXISTS users (
 id SERIAL PRIMARY KEY, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, name TEXT NOT NULL,
 role TEXT NOT NULL DEFAULT 'student' CHECK(role IN ('student','organizer')), created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS student_profiles (
 user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE, department TEXT, year INTEGER, location TEXT,
 career_goal TEXT, experience_level TEXT, skills TEXT[] DEFAULT '{}', interests TEXT[] DEFAULT '{}'
);
CREATE TABLE IF NOT EXISTS organizers (
 id SERIAL PRIMARY KEY, user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE, organization_name TEXT, verified BOOLEAN DEFAULT false
);
CREATE TABLE IF NOT EXISTS events (
 id SERIAL PRIMARY KEY, event_code TEXT UNIQUE, event_name TEXT NOT NULL, event_type TEXT, category TEXT, mode TEXT,
 location TEXT, start_date DATE, end_date DATE, start_time TEXT, end_time TEXT, registration_fee_inr NUMERIC,
 is_free BOOLEAN, organizer_id INTEGER REFERENCES organizers(id), organizer_name TEXT, required_skills TEXT[] DEFAULT '{}',
 target_audience TEXT[] DEFAULT '{}', difficulty TEXT, status TEXT, description TEXT, image_url TEXT,
 created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS registrations (
 id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id) ON DELETE CASCADE, event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
 status TEXT DEFAULT 'registered', registered_at TIMESTAMPTZ DEFAULT now(), UNIQUE(user_id,event_id)
);
CREATE TABLE IF NOT EXISTS saved_events (
 id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id) ON DELETE CASCADE, event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
 saved_at TIMESTAMPTZ DEFAULT now(), UNIQUE(user_id,event_id)
);
