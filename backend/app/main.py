import os
import json
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from .config import settings
from .database import engine, Base, get_db
from .models import Complaint
from .schemas import (
    RawComplaintInput,
    AIAnalysisResponse,
    ComplaintCreate,
    ComplaintResponse
)
from .graph.agent import run_complaint_workflow
from .sample_data import HISTORICAL_COMPLAINTS

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Pharmaceutical QMS AI-Powered Customer Complaint Management System",
    version="1.0.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "groq_configured": bool(settings.GROQ_API_KEY),
        "groq_model": settings.GROQ_MODEL
    }

@app.post("/api/ai/analyze-complaint", response_model=AIAnalysisResponse)
def analyze_complaint(payload: RawComplaintInput):
    if not payload.text or len(payload.text.strip()) < 5:
        raise HTTPException(status_code=400, detail="Complaint text is too short to analyze.")
    result = run_complaint_workflow(payload.text)
    return result

@app.post("/api/ai/upload-file", response_model=AIAnalysisResponse)
async def upload_complaint_file(file: UploadFile = File(...)):
    contents = await file.read()
    try:
        text = contents.decode("utf-8", errors="ignore")
    except Exception:
        text = f"File {file.filename} uploaded with size {len(contents)} bytes."
    
    if len(text.strip()) < 5:
        text = f"Customer complaint intake from document: {file.filename}. Product investigation requested."
    
    return run_complaint_workflow(text)

@app.post("/api/complaints", response_model=ComplaintResponse)
def create_complaint(complaint_in: ComplaintCreate, db: Session = Depends(get_db)):
    year = datetime.utcnow().year
    count = db.query(Complaint).count() + 1
    cmp_number = f"CMP-{year}-{count:04d}"

    db_complaint = Complaint(
        complaint_number=cmp_number,
        product_name=complaint_in.product_name,
        batch_number=complaint_in.batch_number,
        dosage_form=complaint_in.dosage_form,
        complaint_category=complaint_in.complaint_category,
        severity=complaint_in.severity,
        complainant_name=complaint_in.complainant_name,
        complainant_type=complaint_in.complainant_type,
        complaint_date=complaint_in.complaint_date,
        description=complaint_in.description,
        raw_input=complaint_in.raw_input,
        completeness_score=complaint_in.completeness_score,
        missing_information=complaint_in.missing_information,
        risk_score=complaint_in.risk_score,
        patient_hazard_level=complaint_in.patient_hazard_level,
        regulatory_reportable=complaint_in.regulatory_reportable,
        regulatory_details=complaint_in.regulatory_details,
        root_cause_summary=complaint_in.root_cause_summary,
        capa_summary=complaint_in.capa_summary,
        status=complaint_in.status or "Logged"
    )
    db.add(db_complaint)
    db.commit()
    db.refresh(db_complaint)
    return db_complaint

@app.get("/api/complaints", response_model=List[ComplaintResponse])
def get_complaints(
    severity: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Complaint)
    if severity:
        query = query.filter(Complaint.severity == severity)
    if status:
        query = query.filter(Complaint.status == status)
    complaints = query.order_by(Complaint.id.desc()).all()

    # If database is empty, seed with realistic pharma complaints
    if not complaints and db.query(Complaint).count() == 0:
        for idx, sample in enumerate(HISTORICAL_COMPLAINTS, 1):
            seed = Complaint(
                complaint_number=sample["complaint_number"],
                product_name=sample["product_name"],
                batch_number=sample["batch_number"],
                dosage_form=sample["dosage_form"],
                complaint_category=sample["complaint_category"],
                severity=sample["severity"],
                complainant_name=sample["complainant_name"],
                complainant_type=sample["complainant_type"],
                complaint_date=sample["complaint_date"],
                description=sample["description"],
                completeness_score=85,
                risk_score=75 if sample["severity"] == "Critical" else 45,
                patient_hazard_level="High" if sample["severity"] == "Critical" else "Low",
                regulatory_reportable=sample["severity"] == "Critical",
                regulatory_details="Reportable under 21 CFR 211.198" if sample["severity"] == "Critical" else "Standard periodic review",
                root_cause_summary="Under formal investigation.",
                capa_summary="CAPA protocol initiated.",
                status="Logged" if idx == 1 else ("Under Investigation" if idx == 2 else "Closed")
            )
            db.add(seed)
        db.commit()
        complaints = db.query(Complaint).order_by(Complaint.id.desc()).all()

    return complaints

@app.get("/api/complaints/{complaint_id}", response_model=ComplaintResponse)
def get_complaint(complaint_id: int, db: Session = Depends(get_db)):
    comp = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not comp:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return comp

@app.patch("/api/complaints/{complaint_id}/status")
def update_complaint_status(complaint_id: int, status: str, db: Session = Depends(get_db)):
    comp = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not comp:
        raise HTTPException(status_code=404, detail="Complaint not found")
    comp.status = status
    db.commit()
    db.refresh(comp)
    return {"status": comp.status, "id": comp.id}

# Serve React static assets in production if built
frontend_dist = os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist")
if os.path.exists(frontend_dist):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        # Don't intercept API routes
        if full_path.startswith("api"):
            raise HTTPException(status_code=404, detail="API route not found")
        index_file = os.path.join(frontend_dist, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return {"error": "Frontend build not ready"}
