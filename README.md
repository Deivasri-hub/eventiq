# ACE Intelligence (ACE AI) - AllCollegeEvent AI Recommendation Platform

> **Tagline:** "AI-Powered Event Intelligence & Personalized Recommendation Engine for AllCollegeEvent."

ACE Intelligence makes **AllCollegeEvent** smarter by using artificial intelligence to analyze student profiles, extract event skill requirements, compute explainable match scores (0-100%), perform skill gap analysis, deliver social recommendations from peer students with similar interests, and provide event intelligence auditing for organizers.

---

## 🌟 Core Platform Features

### For Students
1. **Personalized AI Recommendation Engine**: Calculates explainable match scores (0-100%) using Skills (55%), Interests (20%), Career Goal (15%), and Location (10%).
2. **Social / Similar Student Recommendations**: Recommends events that peer students with similar interest profiles are registering for or participating in, strictly filtered by student eligibility.
3. **Explainable AI Breakdown ("Why Recommended?")**: Clear checklist reasons showing *why* an event was recommended.
4. **Skill Gap Analysis**: Compares student skills against event requirements, identifying missing skills and delivering learning roadmaps.
5. **Student Profile**: Customizes department, skills, interests, location, career goals, and previous event participation history.

### For Organizers
1. **AI Event Intelligence Studio**: Quality scoring, completeness audit %, automatic category classification, and skill tag extraction.
2. **Audience Demographic Insights**: Tracks demographic affinity across engineering branches (CSE, AI & DS, IT, ECE).
3. **Event Management**: Create, audit, publish, and manage student opportunities.

---

## 🚀 Quick Start Guide (Windows Instructions)

### Prerequisites
- Node.js (v18 or higher)
- npm

### 1. Backend Setup & Startup
```powershell
cd backend
cmd /c npm install
cmd /c npm run dev
```
The backend server runs on `http://localhost:5000` with automated database setup & 30 pre-seeded sample events!

### 2. Frontend Setup & Startup
In a new terminal window:
```powershell
cd frontend
cmd /c npm install
cmd /c npm run dev
```
The frontend application opens on `http://localhost:3000`.

---

## 🔑 Demo Credentials

### Demo Student Account
- **Email:** `student@ace.demo`
- **Password:** `student123`
- **Role:** Student (Pre-configured with CS & AI skills + participation history)

### Demo Organizer Account
- **Email:** `organizer@ace.demo`
- **Password:** `organizer123`
- **Role:** Organizer (Access to AI Event Studio & Demographic Insights)

*(Or click the one-touch **Demo Student** / **Demo Organizer** buttons on the Sign In page!)*

---

## 📁 Project Structure

```
eventiq/
├── frontend/             # Next.js 14 React TypeScript Application
├── backend/              # Node.js Express REST API Server & Recommendation Engine
├── database/             # PostgreSQL schema.sql
├── seed/                 # Seed dataset (30 sample events + SQL scripts)
├── README.md             # Project overview & documentation
├── SETUP.md              # Detailed Windows step-by-step setup guide
└── .env.example          # Environment configuration variables template
```
