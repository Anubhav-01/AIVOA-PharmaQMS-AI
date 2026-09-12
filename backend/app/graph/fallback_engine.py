import re
from datetime import date
from typing import Dict, Any, List
from ..sample_data import HISTORICAL_COMPLAINTS

def analyze_complaint_fallback(raw_text: str) -> Dict[str, Any]:
    text_lower = raw_text.lower()
    
    # 1. Product Extraction
    product = "Paracetamol Tablets 500mg (FDF)"
    dosage = "FDF"
    if "api" in text_lower or "intermediate" in text_lower or "metformin api" in text_lower or "drum" in text_lower:
        dosage = "API"
        if "metformin" in text_lower:
            product = "Metformin Hydrochloride API"
        else:
            product = "Active Pharmaceutical Ingredient (API Batch)"
    elif "amoxicillin" in text_lower or "suspension" in text_lower:
        product = "Amoxicillin Oral Suspension 228.5mg/5mL"
    elif "ceftriaxone" in text_lower or "injection" in text_lower or "vial" in text_lower:
        product = "Ceftriaxone for Injection USP 1g"
    elif "atorvastatin" in text_lower:
        product = "Atorvastatin Calcium Tablets 20mg"
    elif "ibuprofen" in text_lower:
        product = "Ibuprofen BP 400mg Film-Coated Tablets"

    # Batch extraction
    batch_match = re.search(r'(?:batch|lot|lot\s*#|batch\s*#)\s*[:=]?\s*([a-zA-Z0-9\-_]+)', raw_text, re.IGNORECASE)
    batch = batch_match.group(1) if batch_match else "PARA-2401"

    # Complainant extraction
    complainant = "Memorial Central Hospital Pharmacy"
    comp_type = "Hospital"
    if "distributor" in text_lower or "wholesale" in text_lower:
        complainant = "Alliance Health Logistics"
        comp_type = "Distributor"
    elif "patient" in text_lower or "consumer" in text_lower:
        complainant = "Direct Patient / Consumer Report"
        comp_type = "Patient"
    elif "clinic" in text_lower:
        complainant = "Valley Health Specialty Clinic"
        comp_type = "Clinic"
    elif "manufacturer" in text_lower or dosage == "API":
        complainant = "Apex Pharmaceuticals Formulations Unit"
        comp_type = "Manufacturer"

    # Category & Severity
    category = "Physical Defect"
    severity = "Major"
    if "particulate" in text_lower or "glass" in text_lower or "black speck" in text_lower or "foreign" in text_lower or "contaminat" in text_lower:
        category = "Contamination/Foreign Matter"
        severity = "Critical"
    elif "dissolution" in text_lower or "potency" in text_lower or "assay" in text_lower or "ineffective" in text_lower or "caking" in text_lower:
        category = "Dissolution/Efficacy"
        severity = "Major"
    elif "label" in text_lower or "carton" in text_lower or "packaging" in text_lower or "barcode" in text_lower:
        category = "Packaging"
        severity = "Minor"
    elif "adverse" in text_lower or "hospitalized" in text_lower or "reaction" in text_lower:
        category = "Adverse Event"
        severity = "Critical"

    # Completeness Check
    missing = []
    follow_ups = []
    score = 75
    
    if not batch_match:
        missing.append("Verified Batch/Lot Number")
        follow_ups.append("Can you provide the high-resolution photo or physical lot number stamped on the outer carton / blister?")
        score -= 25
    if "sample" not in text_lower and "return" not in text_lower:
        missing.append("Defective Physical Sample Availability")
        follow_ups.append("Is a physical retained or defective unit available to be returned for QC analytical testing?")
        score -= 15
    if "storage" not in text_lower and "temperature" not in text_lower:
        missing.append("Storage Condition Verification (<25°C / 60% RH)")
        follow_ups.append("Were the goods stored according to label instructions (Controlled Room Temperature 20-25°C) prior to discovery?")
        score -= 10

    # Risk Assessment
    if severity == "Critical":
        rpn_s, rpn_o, rpn_d = 9, 4, 3
        risk_score = 88
        hazard = "High"
        reg_reportable = True
        reg_deadline = "15-Day Alert Report to FDA / CDSCO under 21 CFR 211.198"
        recall_risk = "Medium-High (potential Class I/II Field Action)"
        rationale = "Foreign matter or sterile particulate poses serious potential patient risk. Mandatory cross-functional QA investigation required immediately."
    elif severity == "Major":
        rpn_s, rpn_o, rpn_d = 6, 3, 3
        risk_score = 54
        hazard = "Medium"
        reg_reportable = False
        reg_deadline = "Routine 30-Day Periodic QMS Review"
        recall_risk = "Low (isolated batch deviation suspected)"
        rationale = "Physical defect or dissolution abnormality affects quality standard without acute patient toxicity."
    else:
        rpn_s, rpn_o, rpn_d = 3, 2, 2
        risk_score = 22
        hazard = "Low"
        reg_reportable = False
        reg_deadline = "Internal QMS Trend Analysis"
        recall_risk = "Negligible"
        rationale = "Minor cosmetic or packaging imperfection; core drug substance and therapeutic efficacy are preserved."

    # Duplicate Detection
    duplicates = []
    for comp in HISTORICAL_COMPLAINTS:
        sim = 0.0
        if comp["complaint_category"] == category:
            sim += 0.45
        if comp["product_name"].split()[0].lower() in product.lower():
            sim += 0.4
        if comp["batch_number"] == batch:
            sim += 0.15
        if sim >= 0.4:
            duplicates.append({
                **comp,
                "similarity_score": round(sim, 2)
            })

    # Root Cause (5 Whys & Fishbone)
    fishbone = {
        "Man": "Operator inspection fatigue or training gap at end-of-line visual sorting station.",
        "Machine": "Pneumatic pressure variance on blistering feed track or tooling wear on rotary punch.",
        "Material": "Raw excipient binder hygroscopic absorption or vendor packaging foil adhesive inconsistency.",
        "Method": "SOP-MFG-412 sealing temperature parameters permitted wide ±5°C window.",
        "Measurement": "Camera vision system threshold calibrated below fine micro-defect tolerance.",
        "Milieu": "Cleanroom relative humidity spiked above 55% during monsoon manufacturing shift."
    }

    five_whys = [
        "1. Why was defect present? The finished drug unit reached the customer with visible deviation.",
        "2. Why did it pass in-process controls? High-speed automated vision system failed to reject the individual unit.",
        "3. Why did vision system fail? Threshold parameters were configured for macro defects only.",
        "4. Why were parameters misconfigured? Recent line format changeover validation did not recalibrate fine focal distance.",
        "5. Root Cause: Lack of secondary sign-off checklist in format changeover SOP (SOP-ENG-089)."
    ]

    capa_corrective = [
        "Quarantine all retained samples of affected lot and inspect 100% of remaining warehouse inventory.",
        "Dispatch formal complaint response and replace affected product batch for customer within 5 business days."
    ]

    capa_preventive = [
        "Revise SOP-ENG-089 to include mandatory camera calibration verification prior to batch release.",
        "Implement AI-powered automated optical inspection (AOI) secondary validation gate.",
        "Conduct refresher training for line operators and QA inspectors on defect classification."
    ]

    exec_summary = (
        f"Complaint logged regarding {product} (Lot: {batch}). Initial AI classification indicates {severity} severity "
        f"under category '{category}'. Risk Priority assessment yielded a score of {risk_score}/100. "
        f"{'Regulatory alert required within 15 days.' if reg_reportable else 'Standard 30-day internal investigation protocol initiated.'} "
        f"Quality Assurance has triggered containment and CAPA review."
    )

    return {
        "extracted_data": {
            "product_name": product,
            "batch_number": batch,
            "dosage_form": dosage,
            "complaint_category": category,
            "severity": severity,
            "complainant_name": complainant,
            "complainant_type": comp_type,
            "complaint_date": str(date.today()),
            "description": raw_text.strip() if len(raw_text) < 300 else raw_text.strip()[:300] + "..."
        },
        "completeness": {
            "score": score,
            "is_complete": score >= 80,
            "missing_fields": missing if missing else ["None - Complaint is complete"],
            "follow_up_questions": follow_ups if follow_ups else ["No additional mandatory clarifications needed."],
            "completeness_details": f"Evaluated against 21 CFR Part 211.198 QMS Customer Complaint filing standards ({score}% complete)."
        },
        "duplicates": duplicates,
        "risk_assessment": {
            "risk_score": risk_score,
            "rpn_severity": rpn_s,
            "rpn_occurrence": rpn_o,
            "rpn_detectability": rpn_d,
            "calculated_rpn": rpn_s * rpn_o * rpn_d,
            "patient_hazard_level": hazard,
            "risk_classification": severity,
            "regulatory_reportable": reg_reportable,
            "regulatory_deadline": reg_deadline,
            "rationale": rationale,
            "recall_risk": recall_risk
        },
        "root_cause": {
            "fishbone_categories": fishbone,
            "five_whys": five_whys,
            "probable_root_cause": five_whys[-1].replace("5. Root Cause: ", "")
        },
        "capa": {
            "corrective_actions": capa_corrective,
            "preventive_actions": capa_preventive,
            "recommended_deadline_days": 15 if severity == "Critical" else 30,
            "responsible_department": "Quality Assurance & Production Engineering"
        },
        "executive_summary": exec_summary,
        "using_fallback": True
    }
