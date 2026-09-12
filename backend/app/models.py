from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Float
from datetime import datetime
from .database import Base

class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    complaint_number = Column(String(50), unique=True, index=True)
    product_name = Column(String(200), index=True)
    batch_number = Column(String(100), index=True)
    dosage_form = Column(String(50)) # 'API' or 'FDF'
    complaint_category = Column(String(100))
    severity = Column(String(50)) # 'Critical', 'Major', 'Minor'
    complainant_name = Column(String(200))
    complainant_type = Column(String(100))
    complaint_date = Column(String(50))
    description = Column(Text)
    raw_input = Column(Text, nullable=True)
    
    # AI Assessment Fields
    completeness_score = Column(Integer, default=0)
    missing_information = Column(Text, nullable=True) # JSON string
    risk_score = Column(Integer, default=0)
    patient_hazard_level = Column(String(50), default="Low")
    regulatory_reportable = Column(Boolean, default=False)
    regulatory_details = Column(Text, nullable=True)
    
    # Root cause & CAPA
    root_cause_summary = Column(Text, nullable=True)
    capa_summary = Column(Text, nullable=True)
    
    status = Column(String(50), default="Logged")
    created_at = Column(DateTime, default=datetime.utcnow)
