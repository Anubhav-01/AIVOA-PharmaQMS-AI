from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class RawComplaintInput(BaseModel):
    text: str
    source_type: Optional[str] = "text" # "text", "email", "pdf"

class ExtractedComplaintData(BaseModel):
    product_name: str = ""
    batch_number: str = ""
    dosage_form: str = "FDF" # API or FDF
    complaint_category: str = "Physical Defect"
    severity: str = "Major"
    complainant_name: str = ""
    complainant_type: str = "Hospital"
    complaint_date: str = ""
    description: str = ""

class CompletenessCheck(BaseModel):
    score: int = 0 # 0 - 100
    is_complete: bool = False
    missing_fields: List[str] = []
    follow_up_questions: List[str] = []
    completeness_details: str = ""

class DuplicateRecord(BaseModel):
    id: int
    complaint_number: str
    product_name: str
    batch_number: str
    complaint_category: str
    severity: str
    similarity_score: float
    description: str

class RiskAssessment(BaseModel):
    risk_score: int = 0 # 1 - 100
    rpn_severity: int = 1 # 1-10
    rpn_occurrence: int = 1 # 1-10
    rpn_detectability: int = 1 # 1-10
    calculated_rpn: int = 1
    patient_hazard_level: str = "Low" # Critical, High, Medium, Low
    risk_classification: str = "Major" # Critical, Major, Minor
    regulatory_reportable: bool = False
    regulatory_deadline: str = "Routine Periodic Review"
    rationale: str = ""
    recall_risk: str = "Low probability"

class RootCauseAnalysis(BaseModel):
    fishbone_categories: Dict[str, str] = Field(default_factory=dict) # Man, Machine, Material, Method, Measurement, Milieu
    five_whys: List[str] = []
    probable_root_cause: str = ""

class CAPARecommendation(BaseModel):
    corrective_actions: List[str] = []
    preventive_actions: List[str] = []
    recommended_deadline_days: int = 30
    responsible_department: str = "Quality Assurance / Production"

class AIAnalysisResponse(BaseModel):
    extracted_data: ExtractedComplaintData
    completeness: CompletenessCheck
    duplicates: List[DuplicateRecord] = []
    risk_assessment: RiskAssessment
    root_cause: RootCauseAnalysis
    capa: CAPARecommendation
    executive_summary: str = ""
    using_fallback: bool = False

class ComplaintCreate(BaseModel):
    product_name: str
    batch_number: str
    dosage_form: str
    complaint_category: str
    severity: str
    complainant_name: str
    complainant_type: str
    complaint_date: str
    description: str
    raw_input: Optional[str] = None
    completeness_score: Optional[int] = 0
    missing_information: Optional[str] = None
    risk_score: Optional[int] = 0
    patient_hazard_level: Optional[str] = "Low"
    regulatory_reportable: Optional[bool] = False
    regulatory_details: Optional[str] = None
    root_cause_summary: Optional[str] = None
    capa_summary: Optional[str] = None
    status: Optional[str] = "Logged"

class ComplaintResponse(ComplaintCreate):
    id: int
    complaint_number: str
    created_at: datetime

    class Config:
        from_attributes = True
