# ACE Intelligence Setup Guide

## Windows Prerequisites
Ensure Node.js is installed:
```powershell
node -v
```

## Step 1: Navigate to Project Root
```powershell
cd c:\Users\deiva\Downloads\EventIQ-complete-hackathon\eventiq
```

## Step 2: Backend Setup & Startup
```powershell
cd backend
cmd /c npm install
cmd /c npm run dev
```

> **Database Note:** The backend tries connecting to PostgreSQL if available (`postgresql://postgres:postgres@localhost:5432/ace_intelligence`). If PostgreSQL is not running locally, it automatically operates using an embedded zero-config data store with disk persistence (`ace_store.json`), requiring zero manual database configuration!

## Step 3: Frontend Setup & Startup
In a separate terminal window:
```powershell
cd frontend
cmd /c npm install
cmd /c npm run dev
```
Open your browser to **`http://localhost:3000`**.

## Step 4: Complete Verification Flow
1. Open `http://localhost:3000/signin`
2. Click **"Demo Student"** button to log in as `student@ace.demo`.
3. View personalized AI recommendations on the Dashboard, including the **"Popular Among Students Like You"** social proof section.
4. Click **"Why Match?"** on an event to view explainable AI sub-scores & checklist.
5. Click **"Skill Gap Analysis"** to inspect missing skills & recommended learning roadmaps.
6. Register and Save events.
7. Click **"Sign Out"**, then log in with **"Demo Organizer"** (`organizer@ace.demo`).
8. Create a new event, click **"Analyze with AI"**, view quality score audit, and publish!
