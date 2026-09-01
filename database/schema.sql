-- EventIQ PostgreSQL Database Schema

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'organizer')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS student_profiles (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    department VARCHAR(255) DEFAULT 'Computer Science & Engineering',
    year INTEGER DEFAULT 3,
    location VARCHAR(255) DEFAULT 'Coimbatore',
    career_goal VARCHAR(255) DEFAULT 'AI Engineer',
    experience_level VARCHAR(50) DEFAULT 'Intermediate',
    skills TEXT[] DEFAULT '{}',
    interests TEXT[] DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS organizers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    organization_name VARCHAR(255) NOT NULL,
    verified BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    event_code VARCHAR(50) UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    mode VARCHAR(50) NOT NULL DEFAULT 'Offline',
    location VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    start_time VARCHAR(20),
    end_time VARCHAR(20),
    registration_deadline DATE,
    registration_fee NUMERIC(10, 2) DEFAULT 0,
    is_free BOOLEAN DEFAULT true,
    eligibility TEXT,
    required_skills TEXT[] DEFAULT '{}',
    target_audience TEXT[] DEFAULT '{}',
    difficulty VARCHAR(50) DEFAULT 'Intermediate',
    career_relevance TEXT[] DEFAULT '{}',
    organizer_id INTEGER REFERENCES organizers(id) ON DELETE SET NULL,
    organizer_name VARCHAR(255),
    registration_url VARCHAR(500),
    image_url VARCHAR(500),
    status VARCHAR(50) DEFAULT 'Upcoming',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS registrations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'registered',
    registered_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, event_id)
);

CREATE TABLE IF NOT EXISTS saved_events (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    saved_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, event_id)
);

CREATE TABLE IF NOT EXISTS event_analysis (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    smart_category VARCHAR(100),
    skill_tags TEXT[] DEFAULT '{}',
    target_audience JSONB,
    difficulty VARCHAR(50),
    career_relevance TEXT[] DEFAULT '{}',
    completeness_score INTEGER DEFAULT 85,
    quality_score INTEGER DEFAULT 90,
    urgency VARCHAR(50) DEFAULT 'High',
    analyzed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
