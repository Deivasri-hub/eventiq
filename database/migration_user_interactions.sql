-- EventIQ Behavioral Recommendation System Migration
-- Table: user_interactions

CREATE TABLE IF NOT EXISTS user_interactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL CHECK (action IN ('VIEW', 'CLICK', 'LIKE', 'SAVE', 'REGISTER', 'DISMISS')),
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_interactions_user_id ON user_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_interactions_event_id ON user_interactions(event_id);
