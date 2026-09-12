# AIVOA - Round 1 AI Product Engineer Demo Video Walkthrough Guide (5-10 Minutes)

Use this complete script and step-by-step guide to record your 5–10 minute submission video.

---

## Video Outline & Timing Breakdown

| Timestamp | Section | Key Talking Points | Screen to Display |
|---|---|---|---|
| **0:00 - 1:00** | Introduction & Problem Overview | Intro yourself, state the problem (Pharma QMS for API & FDF complaints), introduce tech stack (FastAPI, LangGraph, Groq, React/Redux). | Browser: Pharma QMS UI homepage |
| **1:00 - 3:00** | Live Working Demonstration | Load a preset (e.g. Paracetamol Tablet Capping or Metformin API Contamination), click "Run AI Copilot Pipeline". Show how it populates: 1. "Log Customer Complaint" form, 2. "AI Copilot Risk Assessment", 3. Completeness Checker, 4. Duplicate Detector, 5. Root Cause (5-Whys & Fishbone), 6. CAPA Actions. Save complaint to QMS database. | Browser: Interactive UI actions |
| **3:00 - 5:00** | Code Walkthrough: Frontend & Redux | Show React structure, Redux store (`complaintSlice.ts`), state dispatching, form two-way binding, Google Inter font styling with Tailwind CSS. | VS Code: `frontend/src/store/complaintSlice.ts`, `ComplaintForm.tsx`, `RiskAssessment.tsx` |
| **5:00 - 7:30** | Code Walkthrough: Backend & LangGraph Agent | Show FastAPI endpoints (`/api/ai/analyze-complaint`, `/api/complaints`), StateGraph architecture in `agent.py`, discrete pipeline nodes in `nodes.py` (Extraction, Completeness, Duplicate match, ICH Q9 Risk matrix, Root Cause/CAPA), Groq LLM integration with resilient fallback engine. | VS Code: `backend/app/main.py`, `backend/app/graph/agent.py`, `backend/app/graph/nodes.py` |
| **7:30 - 9:00** | Bonus Features & Pharma QMS Deep Dive | Highlight 21 CFR Part 211 / ICH Q9 compliance, FMEA RPN matrix (Severity x Occurrence x Detectability), 15-day FDA alert trigger, Duplicate batch recurrence warning. Show QMS History Audit Log. | Browser: "QMS Records" audit trail table |
| **9:00 - 10:00** | Deployment & Conclusion | Show `railway.json`, Dockerfile, GitHub repo status, wrap up with vision for pharmaceutical AI quality systems. | VS Code / Browser: GitHub repo & Railway dashboard |

---

## Detailed Speaking Script

### Minute 0:00 - 1:00: Introduction
> "Hello everyone! Today I'm excited to present my submission for Round 1 of the AI Product Engineer role at AIVOA. 
> I have designed and implemented an enterprise-grade, **AI-Powered Customer Complaint Management System** specifically tailored for pharmaceutical companies manufacturing both Active Pharmaceutical Ingredients (API) and Finished Dosage Forms (FDF).
> The system is built with a **Python FastAPI** backend powered by **LangGraph** multi-node workflows and **Groq LLMs**, paired with a high-performance **React + Redux Toolkit** frontend styled with Google Inter font and Tailwind CSS."

### Minute 1:00 - 3:00: Live Feature Demonstration
> *(Switch to browser at http://localhost:3000)*
> "Let's begin with the live end-to-end workflow:
> 1. In our **Complaint Intake** panel, a QA team can either upload a PDF document or paste a customer complaint email or call transcript. I have prepared three quick presets representing real pharmaceutical deviation scenarios:
>    - Paracetamol 500mg (FDF Tablet Capping)
>    - Metformin API (Foreign Particulate Contamination)
>    - Amoxicillin Suspension (Failed Reconstitution)
> 2. Let's click on **'Paracetamol 500mg'** and click **'Run AI Copilot Pipeline'**.
> 3. Within seconds, the LangGraph pipeline analyzes the unstructured text:
>    - Notice on the left: the **'Log Customer Complaint'** form is automatically populated with Product Name, Batch Number (PARA-2401), Dosage Form (FDF), Complaint Category, Severity (Major), and Complainant details. All fields remain editable for the QA officer.
>    - Notice on the right: the **'AI Copilot Risk Assessment'** calculates an overall risk score, breaks down the FMEA Risk Priority Number (RPN: Severity × Occurrence × Detection), categorizes Patient Health Hazard, and checks regulatory reportability under 21 CFR Part 211.
> 4. Below, we see the bonus AI tools:
>    - **Completeness Checker**: Flags missing information (like storage conditions or physical samples) and provides exact questions to ask the customer.
>    - **Duplicate Detector**: Scans historical complaints and flags matching recurring lots.
>    - **Root Cause & CAPA**: Performs an automated 5-Whys analysis, classifies causes across 6M Ishikawa fishbone categories, generates immediate containment and long-term preventive actions, and generates an executive briefing for the QA Director.
> 5. Clicking **'Log & Save Complaint'** commits the record to our QMS database with an audit-ready timestamp and unique identifier."

### Minute 3:00 - 5:00: Frontend Architecture Walkthrough
> *(Switch to code editor)*
> "Now let's examine the code architecture:
> In `frontend/src/store/complaintSlice.ts`, we utilize Redux Toolkit.
> We define async thunks `analyzeComplaint`, `uploadComplaintFile`, and `saveComplaintToDb`.
> When the AI returns structured JSON, Redux stores both the raw analysis and pre-fills the `formData` state.
> In `ComplaintForm.tsx`, each input binds directly to Redux actions, allowing real-time edits.
> The UI strictly incorporates the required **Google Inter font** specified in `index.html` and `tailwind.config.js`."

### Minute 5:00 - 7:30: Backend & LangGraph Agent Pipeline
> *(Open `backend/app/graph/agent.py` and `nodes.py`)*
> "Turning to the backend:
> We utilize FastAPI in `backend/app/main.py`. The `/api/ai/analyze-complaint` endpoint delegates directly to our LangGraph state machine.
> In `agent.py`, we construct a directed `StateGraph`:
> 1. `extract_complaint_node`: Uses ChatGroq (Llama 3.3 70B / Gemma 2) to extract structured pharmaceutical attributes.
> 2. `completeness_check_node`: Evaluates 21 CFR Part 211 standard filing criteria.
> 3. `duplicate_detection_node`: Compares semantic similarity against historical database records.
> 4. `risk_assessment_node`: Applies ICH Q9 Quality Risk Management principles to compute RPN scores and regulatory urgency.
> 5. `root_cause_capa_node`: Generates the 5-Whys, Ishikawa factors, and CAPA schedules.
> We also implemented a robust fallback engine in `fallback_engine.py` ensuring the pipeline runs resiliently even before API keys are provisioned."

### Minute 7:30 - 9:00: Pharma QMS Deep Dive & Records Table
> *(Switch to browser -> Click 'QMS Records' tab)*
> "Navigating to our **QMS Records** tab, we see our historical complaint registry.
> QA leaders can filter by severity (Critical, Major, Minor) or status (Logged, Under Investigation, Closed).
> This provides full compliance with 21 CFR Part 11 electronic records regulations."

### Minute 9:00 - 10:00: Deployment & Wrap Up
> *(Show `railway.json` and Dockerfile)*
> "For deployment, the repository is production-ready for Railway using a multi-stage `Dockerfile` and `railway.json`. It packages both the React static client and the FastAPI backend into a single performant container.
> Thank you for reviewing this project, and I look forward to the next round with AIVOA!"
