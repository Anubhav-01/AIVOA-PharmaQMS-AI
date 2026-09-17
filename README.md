Live Link : https://aivoa-pharma-qms-production.up.railway.app/
# AIVOA — AI-Powered Customer Complaint Management System (Pharma QMS)

> Enterprise-grade Quality Management System (QMS) Customer Complaint & Risk Assessment Copilot for Pharmaceutical API & FDF Manufacturing. Built for the **AIVOA - Round 1 AI Product Engineer** assignment.

---

## 🚀 Key Features

### 1. Core End-to-End Workflow
- **Multi-Modal Intake**: Process raw complaint emails, call transcripts, customer letters, or uploaded PDF documents.
- **Autonomous LangGraph Pipeline**: A 5-node state machine that processes unstructured pharmaceutical deviations into structured QMS data.
- **"Log Customer Complaint" Form**: Automatically pre-filled with Product Name, Batch/Lot Number, Dosage Form (API vs FDF), Category, Severity, and Complainant details. Fully editable with validation and QMS persistence.
- **"AI Copilot Risk Assessment"**: Real-time ICH Q9 Quality Risk Management computation, FMEA Risk Priority Number (RPN: Severity × Occurrence × Detectability), Patient Hazard level, and 21 CFR Part 211 15-Day regulatory alert determination.

### 2. Bonus AI Features (All Implemented)
- **Complaint Completeness Checker**: Evaluates complaint text against FDA 21 CFR 211.198 requirements, calculates a % completeness score, identifies information gaps, and suggests follow-up questions to ask the customer.
- **Duplicate Complaint & Recurring Defect Detection**: Matches historical complaints to flag recurring batches and similar defect patterns across product lines.
- **Root Cause Analysis (5-Whys & 6M Ishikawa)**: Generates automated 5-Whys diagnostic cascades and categorizes root causes across Man, Machine, Material, Method, Measurement, and Milieu.
- **CAPA Recommendation Engine**: Automatically generates actionable Corrective Actions (immediate containment) and Preventive Actions (long-term process safeguards) with target resolution timelines and department assignment.
- **Executive Summary Generator**: Produces an executive briefing tailored for the Quality Assurance Director.
- **QMS Audit Log & Registry**: Searchable, filterable historical database of all logged complaints with status tracking (Logged, Under Investigation, Closed).

---

## 🛠 Tech Stack

| Component | Technology | Specification |
|---|---|---|
| **Frontend** | React 18 + Vite | Redux Toolkit for state management, Tailwind CSS |
| **Typography** | Google Inter | Required font loaded via Google Fonts |
| **Backend** | Python 3.10+ & FastAPI | Pydantic v2, SQLAlchemy ORM |
| **AI Framework** | LangGraph & LangChain | StateGraph multi-node autonomous pipeline |
| **LLM Inference** | Groq Cloud | `llama-3.3-70b-versatile` & `gemma2-9b-it` (with intelligent built-in fallback) |
| **Database** | SQLite / PostgreSQL | Zero-config SQLite for local dev, PostgreSQL for Railway |
| **Deployment** | Railway | `railway.json`, `Procfile`, multi-stage `Dockerfile` |

---

## 🏗 Architecture & LangGraph Pipeline

```
[Raw Complaint Text / PDF]
           │
           ▼
   FastAPI Endpoint (/api/ai/analyze-complaint)
           │
           ▼
┌────────────────────────────────────────────────────────┐
│               LangGraph StateMachine Agent             │
│                                                        │
│  [Node 1: Entity Extraction (Groq / Fallback)]        │
│                    │                                   │
│                    ▼                                   │
│  [Node 2: Completeness Checker (21 CFR 211.198)]      │
│                    │                                   │
│                    ▼                                   │
│  [Node 3: Duplicate & Batch Defect Matcher]           │
│                    │                                   │
│                    ▼                                   │
│  [Node 4: AI Copilot Risk Assessment (ICH Q9 / RPN)]  │
│                    │                                   │
│                    ▼                                   │
│  [Node 5: Root Cause (5-Whys/6M) & CAPA Engine]       │
└────────────────────────────────────────────────────────┘
           │
           ▼
[React UI with Redux Toolkit]
├── Pre-fills "Log Customer Complaint" Form
├── Pre-fills "AI Copilot Risk Assessment" Panel
├── Displays Completeness Score & Follow-Up Questions
├── Displays Duplicate Detection Warnings
└── Displays 5-Whys, Ishikawa Breakdown & CAPA Actions
```

---

## 💻 Quick Start (Local Run)

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm
- Git

### One-Click Start (Windows)
Double-click `start_local.bat` in the project root. It will launch both the backend (port 8000) and frontend (port 3000).

### Manual Start

#### 1. Backend (FastAPI):
```bash
cd backend
pip install -r requirements.txt
python run.py
```
Backend runs at: `http://localhost:8000`  
API Swagger Docs: `http://localhost:8000/docs`

#### 2. Frontend (React + Redux):
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at: `http://localhost:3000`

---

## 🔑 Groq API Key Setup (Optional)
The system includes an **intelligent fallback engine** that mirrors the Groq LangGraph output so you can run, test, and record demos immediately without any API key.

To connect live Groq LLM:
1. Sign up for free at [console.groq.com](https://console.groq.com/keys).
2. Generate an API Key.
3. Add it to `backend/.env`:
   ```env
   GROQ_API_KEY=gsk_your_groq_api_key_here
   GROQ_MODEL=llama-3.3-70b-versatile
   ```

---

## 📦 Push to GitHub

A batch script is provided for one-click setup:
1. Double-click `setup_github.bat`
2. Enter your GitHub username and repository name.

Or via terminal:
```bash
git init
git add .
git commit -m "feat: AI-powered pharma complaint management system"
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO_NAME>.git
git push -u origin main
```

---

## 🚂 Deploy to Railway

1. **Log in to Railway**: Go to [railway.app](https://railway.app) and sign in with your GitHub account.
2. **New Project**:
   - Click **"New Project"** -> **"Deploy from GitHub repo"**.
   - Select your pushed repository.
3. **Automatic Build**:
   - Railway will automatically detect the included `Dockerfile` and `railway.json`.
   - It builds the React frontend and runs the FastAPI backend serving both UI and API on one port.
4. **Environment Variables (Optional)**:
   - In Railway Dashboard -> **Variables**, add:
     - `GROQ_API_KEY`: *(Your Groq API key, if using live LLM)*
     - `GROQ_MODEL`: `llama-3.3-70b-versatile`
5. **Add PostgreSQL (Optional)**:
   - In your Railway project, click **"+ New"** -> **"Database"** -> **"Add PostgreSQL"**.
   - Railway will automatically populate `DATABASE_URL`, and the app will switch seamlessly from SQLite to PostgreSQL.
6. **Generate Domain**:
   - In Railway Service Settings -> **Networking** -> click **"Generate Domain"**.
   - Your full-stack Pharma QMS is now live on the internet!

---

## 📹 Video Walkthrough Guide

Refer to [DEMO_SCRIPT.md](./DEMO_SCRIPT.md) for a detailed, minute-by-minute script to record your 5–10 minute submission video.
