import os
import json
from typing import TypedDict, Dict, Any, List, Optional
from ..config import settings
from .fallback_engine import analyze_complaint_fallback
from ..sample_data import HISTORICAL_COMPLAINTS

class ComplaintState(TypedDict):
    raw_input: str
    extracted_data: Dict[str, Any]
    completeness: Dict[str, Any]
    duplicates: List[Dict[str, Any]]
    risk_assessment: Dict[str, Any]
    root_cause: Dict[str, Any]
    capa: Dict[str, Any]
    executive_summary: str
    using_fallback: bool

def get_groq_llm():
    if not settings.GROQ_API_KEY:
        return None
    try:
        from langchain_groq import ChatGroq
        return ChatGroq(
            api_key=settings.GROQ_API_KEY,
            model_name=settings.GROQ_MODEL,
            temperature=0.1
        )
    except Exception as e:
        print(f"Error initializing ChatGroq: {e}")
        return None

def extract_complaint_node(state: ComplaintState) -> Dict[str, Any]:
    raw = state.get("raw_input", "")
    llm = get_groq_llm()

    if not llm:
        fallback = analyze_complaint_fallback(raw)
        return {
            "extracted_data": fallback["extracted_data"],
            "completeness": fallback["completeness"],
            "duplicates": fallback["duplicates"],
            "risk_assessment": fallback["risk_assessment"],
            "root_cause": fallback["root_cause"],
            "capa": fallback["capa"],
            "executive_summary": fallback["executive_summary"],
            "using_fallback": True
        }

    try:
        from langchain_core.messages import SystemMessage, HumanMessage
        prompt = (
            "You are an expert Pharmaceutical Quality Assurance QMS auditor. "
            "Extract structured data from this customer complaint. Return ONLY valid JSON with fields: "
            "product_name, batch_number, dosage_form ('API' or 'FDF'), complaint_category, severity ('Critical', 'Major', 'Minor'), "
            "complainant_name, complainant_type ('Hospital', 'Pharmacy', 'Distributor', 'Patient', 'Manufacturer', 'Clinic'), "
            "complaint_date (YYYY-MM-DD), description.\n"
            f"Input:\n{raw}"
        )
        response = llm.invoke([HumanMessage(content=prompt)])
        content = response.content.strip()
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()
        data = json.loads(content)
        return {"extracted_data": data, "using_fallback": False}
    except Exception as e:
        print(f"Extraction LLM error, using fallback: {e}")
        fallback = analyze_complaint_fallback(raw)
        return {
            "extracted_data": fallback["extracted_data"],
            "completeness": fallback["completeness"],
            "duplicates": fallback["duplicates"],
            "risk_assessment": fallback["risk_assessment"],
            "root_cause": fallback["root_cause"],
            "capa": fallback["capa"],
            "executive_summary": fallback["executive_summary"],
            "using_fallback": True
        }

def completeness_check_node(state: ComplaintState) -> Dict[str, Any]:
    if state.get("using_fallback", False):
        return {} # Already generated in fallback

    llm = get_groq_llm()
    extracted = state.get("extracted_data", {})
    raw = state.get("raw_input", "")

    if not llm:
        return {}

    try:
        from langchain_core.messages import HumanMessage
        prompt = (
            "Evaluate customer complaint completeness against FDA 21 CFR 211.198. "
            "Check for: Batch number, storage conditions, physical sample availability, exact defect description, complainant contact. "
            "Return ONLY JSON: {\"score\": int (0-100), \"is_complete\": bool, \"missing_fields\": [str], \"follow_up_questions\": [str], \"completeness_details\": str}.\n"
            f"Extracted: {json.dumps(extracted)}\nRaw: {raw}"
        )
        resp = llm.invoke([HumanMessage(content=prompt)])
        content = resp.content.strip()
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        return {"completeness": json.loads(content)}
    except Exception:
        fallback = analyze_complaint_fallback(raw)
        return {"completeness": fallback["completeness"]}

def duplicate_detection_node(state: ComplaintState) -> Dict[str, Any]:
    if state.get("using_fallback", False):
        return {}

    extracted = state.get("extracted_data", {})
    category = extracted.get("complaint_category", "")
    prod = extracted.get("product_name", "").lower()
    batch = extracted.get("batch_number", "")

    duplicates = []
    for comp in HISTORICAL_COMPLAINTS:
        sim = 0.0
        if comp["complaint_category"] == category:
            sim += 0.45
        if comp["product_name"].split()[0].lower() in prod:
            sim += 0.4
        if comp["batch_number"] == batch:
            sim += 0.15
        if sim >= 0.4:
            duplicates.append({**comp, "similarity_score": round(sim, 2)})

    return {"duplicates": duplicates}

def risk_assessment_node(state: ComplaintState) -> Dict[str, Any]:
    if state.get("using_fallback", False):
        return {}

    llm = get_groq_llm()
    extracted = state.get("extracted_data", {})
    raw = state.get("raw_input", "")

    if not llm:
        return {}

    try:
        from langchain_core.messages import HumanMessage
        prompt = (
            "Perform AI Copilot Risk Assessment for pharmaceutical complaint based on ICH Q9 Quality Risk Management. "
            "Return ONLY JSON with: {\"risk_score\": int (1-100), \"rpn_severity\": int(1-10), \"rpn_occurrence\": int(1-10), "
            "\"rpn_detectability\": int(1-10), \"calculated_rpn\": int, \"patient_hazard_level\": 'High'/'Medium'/'Low', "
            "\"risk_classification\": 'Critical'/'Major'/'Minor', \"regulatory_reportable\": bool, \"regulatory_deadline\": str, "
            "\"rationale\": str, \"recall_risk\": str}.\n"
            f"Details: {json.dumps(extracted)}"
        )
        resp = llm.invoke([HumanMessage(content=prompt)])
        content = resp.content.strip()
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        return {"risk_assessment": json.loads(content)}
    except Exception:
        fallback = analyze_complaint_fallback(raw)
        return {"risk_assessment": fallback["risk_assessment"]}

def root_cause_capa_node(state: ComplaintState) -> Dict[str, Any]:
    if state.get("using_fallback", False):
        return {}

    llm = get_groq_llm()
    extracted = state.get("extracted_data", {})
    raw = state.get("raw_input", "")

    if not llm:
        return {}

    try:
        from langchain_core.messages import HumanMessage
        prompt = (
            "Generate Root Cause Analysis (Ishikawa/Fishbone categories: Man, Machine, Material, Method, Measurement, Milieu; 5-Whys) "
            "and CAPA Recommendations (Corrective and Preventive Actions) for pharma QMS. "
            "Return ONLY JSON: {\"root_cause\": {\"fishbone_categories\": {...}, \"five_whys\": [str], \"probable_root_cause\": str}, "
            "\"capa\": {\"corrective_actions\": [str], \"preventive_actions\": [str], \"recommended_deadline_days\": int, \"responsible_department\": str}, "
            "\"executive_summary\": str}.\n"
            f"Complaint: {json.dumps(extracted)}"
        )
        resp = llm.invoke([HumanMessage(content=prompt)])
        content = resp.content.strip()
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        data = json.loads(content)
        return {
            "root_cause": data.get("root_cause", {}),
            "capa": data.get("capa", {}),
            "executive_summary": data.get("executive_summary", "")
        }
    except Exception:
        fallback = analyze_complaint_fallback(raw)
        return {
            "root_cause": fallback["root_cause"],
            "capa": fallback["capa"],
            "executive_summary": fallback["executive_summary"]
        }
