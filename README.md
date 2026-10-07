# Campus Placement & Skill Gap Analyzer

> **A Full-Stack MERN Platform with Predictive Placement Readiness Scoring, Dynamic Skill Gap Analysis, and TPO Cohort Intelligence.**

![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge)
![React 19](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-v24-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

##  System Overview

The **Campus Placement & Skill Gap Analyzer** bridges the gap between student competencies and industry placement criteria. It features an intelligent **Skill Gap Analysis Engine**, **Predictive Placement Scoring (0–100%)**, **Personalized Learning Roadmaps**, **Interactive Mock Screening Quizzes**, and a **Training & Placement Officer (TPO) Intelligence Portal** for college-wide cohort analytics.

---

## ✨ Key Features

### 🎓 1. Student Portal
- **Placement Readiness Gauge (0–100%)**: Dynamically computes readiness based on weighted technical skills (50%), academic records (20%), practical projects (20%), and verified assessments (10%).
- **Predicted Placement Bracket**: Categorizes chances into **Tier 1 (Product / FAANG: 15–35+ LPA)**, **Tier 2 (Mid-Product / Fintech: 8–14 LPA)**, or **Tier 3 (IT Services: 3.5–7 LPA)**.
- **Domain Competency Radar Chart**: Visual breakdown across Core CS, Programming, Frameworks, Databases, and Cloud & DevOps.
- **Critical Skill Gap Detection**: Flags mandatory blocker skills that recruiters screen for during campus rounds.
- **What-If Placement Simulator**: Allows students to simulate hypothetical scenarios (e.g., *"What if I learn Docker and maintain an 8.5 CGPA?"*) to see projected score improvements in real time.
- **Personalized Learning Pathway**: Multi-phase roadmap (Bridge Blockers → Framework Depth → System Design & Mock Drills) with milestone checklists and curated links (NeetCode 150, System Design Primer, Roadmap.sh, GFG).
- **Mock Assessments with Skill Verification**: Timed interactive technical screening tests (DSA, Web Dev, Core OS/DBMS) that unlock official **Verified Skill Badges** upon clearing.
- **Campus Placement Drives**: Real-time evaluation against company eligibility criteria (CGPA, active backlogs, department, required skills) with 1-click registration.

### 🏛️ 2. Training & Placement Officer (TPO) Portal
- **Executive Batch Metrics**: Real-time batch average readiness, mean CGPA, active drives, and recruitment conversion rates.
- **Campus-Wide Skill Deficit Trends**: Analytics chart identifying the most common skill gaps across all students (e.g., *72% lack System Design, 58% lack Docker*), helping faculty schedule targeted bootcamps.
- **Candidate Cohort Shortlisting Tool**: Multi-parameter filtering by department (CSE, IT, AI&DS, ECE), minimum CGPA, maximum backlogs, and readiness threshold.
- **Drive Candidate Match & CSV Export**: Select any upcoming drive (e.g., Google or Microsoft) to instantly identify eligible candidates and export the shortlisted roster to CSV.
- **Drive Announcement Console**: Create and publish new campus placement drives with custom criteria.

---

## 🛠️ Architecture & Tech Stack

```
campusplacemnt-and-skillgap-analyser/
├── client/                     # Frontend (React 19, Vite, Tailwind CSS, Recharts, Lucide)
│   ├── src/
│   │   ├── components/         # Navbar, StudentDashboard, SkillGapAnalyzer, RoadmapView,
│   │   │                       # MockAssessments, DrivesView, TpoDashboard, ProfileModal
│   │   ├── services/           # api.js (Unified REST Client)
│   │   ├── App.jsx             # Dual Portal State Controller
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── server/                     # Backend (Node.js, Express.js, Mongoose, MongoMemoryServer)
│   ├── config/                 # db.js (MongoDB Connection with zero-config memory fallback)
│   ├── models/                 # Student, JobRole, Drive, Assessment, User
│   ├── routes/                 # auth, students, analysis, drives, assessments, tpo
│   ├── services/               # analyzerService.js (Core Weighted Gap Analysis Engine)
│   ├── seed/                   # seedData.js (Realistic benchmark roles, drives & cohorts)
│   ├── server.js               # Express Server Bootstrap
│   └── package.json
├── package.json                # Root Concurrently Orchestrator
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Git**

> **Note on MongoDB**: Out of the box, the server automatically starts an embedded, high-performance in-memory MongoDB database pre-seeded with sample students, drives, and benchmark roles. If you wish to connect to a local MongoDB instance or MongoDB Atlas, simply provide `MONGODB_URI` in `server/.env`.

### 1. Installation
Clone or navigate to the project directory:
```bash
cd /path/to/project1
npm install
```

### 2. Start Both Frontend and Backend (One Command)
Run the root concurrent script:
```bash
npm run dev
```

- **Frontend Client**: Runs on `http://localhost:5173`
- **Backend API**: Runs on `http://localhost:5001`
- **API Health Check**: `http://localhost:5001/api/health`

---

## 🔗 Git & GitHub Setup Guide

Follow these steps to push this project to your GitHub account:

### Step 1: Check Git Status
```bash
git status
```

### Step 2: Stage and Commit All Files
```bash
git add .
git commit -m "feat: complete full-stack campus placement and skill gap analyzer"
```

### Step 3: Create a New Repository on GitHub
1. Go to [GitHub New Repository](https://github.com/new).
2. Name your repository: `campus-placement-and-skillgap-analyzer`.
3. Choose **Public** or **Private**.
4. Do **not** initialize with README or .gitignore (already included).
5. Click **Create repository**.

### Step 4: Link Remote & Push
```bash
# Rename branch to main
git branch -M main

# Add your GitHub repository remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/campus-placement-and-skillgap-analyzer.git

# Push your code
git push -u origin main
```

---

## 📡 REST API Endpoints Summary

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status check |
| `GET` | `/api/students/profile` | Retrieve student profile, skills, and projects |
| `PUT` | `/api/students/profile` | Update student CGPA, backlogs, target role, and links |
| `POST` | `/api/students/skills` | Add or update technical skill proficiency |
| `DELETE` | `/api/students/skills/:name` | Remove skill from student inventory |
| `GET` | `/api/analysis/roles` | Get list of industry benchmark roles |
| `GET` | `/api/analysis/gap?roleName=...` | Execute skill gap analysis and compute readiness |
| `POST` | `/api/analysis/simulate` | What-if simulation for hypothetical skills/CGPA |
| `GET` | `/api/drives` | Fetch campus placement drives with eligibility flags |
| `POST` | `/api/drives/:id/apply` | Student registration for recruitment drive |
| `POST` | `/api/drives` | TPO creates and publishes new campus drive |
| `GET` | `/api/assessments` | Get available mock screening assessments |
| `POST` | `/api/assessments/:id/submit` | Evaluate quiz, calculate score & verify skill |
| `GET` | `/api/tpo/stats` | TPO batch readiness and skill deficit intelligence |
| `GET` | `/api/tpo/cohort` | Filter cohort students (branch, CGPA, readiness) |
| `GET` | `/api/tpo/drive-eligibility/:driveId` | Generate drive candidate shortlist |

---

## 📝 License
MIT License. Built for students, training & placement officers, and campus recruitment teams.
