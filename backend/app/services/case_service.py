"""
Clinical Case Analysis Engine — CLINICO 360.

Performs deterministic rule-based analysis of clinical cases.
When AI API keys are present, uses them for natural language generation.
Fallback: structured deterministic analysis from database evidence.

SAFETY PRINCIPLE: All conclusions are framed as educational references.
No autonomous prescribing, diagnosis, or treatment recommendation is made.
"""
import re
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.entities import ClinicalCase, CaseAnalysis, Drug, ADREntry
from app.services.drug_service import get_drug_by_name, get_same_class_drugs, build_comparison_table
from app.services.interaction_service import check_interactions
from app.config import settings


def _extract_drugs_from_text(text: str, db: Session) -> List[Drug]:
    """Identify drugs mentioned in free-text case by matching against database."""
    all_drugs = db.query(Drug).all()
    found = []
    text_lower = text.lower()
    for drug in all_drugs:
        if drug.generic_name.lower() in text_lower:
            found.append(drug)
            continue
        for brand in (drug.brand_names or []):
            if brand.lower() in text_lower:
                if drug not in found:
                    found.append(drug)
    return found


def _extract_comorbidities(text: str) -> List[str]:
    """Identify common comorbidities from free text."""
    conditions = [
        ("hypertension", ["hypertension", "high blood pressure", "htn"]),
        ("type 2 diabetes", ["type 2 diabetes", "t2dm", "diabetes mellitus", "diabetes"]),
        ("chronic kidney disease", ["chronic kidney disease", "ckd", "renal failure", "renal impairment"]),
        ("heart failure", ["heart failure", "cardiac failure", "chf", "hf"]),
        ("COPD", ["copd", "chronic obstructive", "emphysema", "chronic bronchitis"]),
        ("asthma", ["asthma", "bronchial asthma"]),
        ("liver disease", ["liver disease", "hepatic", "cirrhosis", "liver failure"]),
        ("atrial fibrillation", ["atrial fibrillation", "af ", "afib"]),
        ("coronary artery disease", ["coronary artery disease", "cad", "ischemic heart", "ischaemic heart", "angina"]),
        ("gout", ["gout", "hyperuricaemia", "hyperuricemia"]),
        ("peptic ulcer", ["peptic ulcer", "pud", "gastric ulcer"]),
        ("pregnancy", ["pregnant", "pregnancy"]),
    ]
    text_lower = text.lower()
    found = []
    for name, patterns in conditions:
        for pat in patterns:
            if pat in text_lower:
                found.append(name)
                break
    return list(dict.fromkeys(found))


def _flag_renal_concerns(drug: Drug, renal_status: Optional[str], comorbidities: List[str]) -> Optional[dict]:
    has_ckd = "chronic kidney disease" in comorbidities
    if drug.renal_considerations and (has_ckd or (renal_status and renal_status.strip())):
        return {
            "drug": drug.generic_name,
            "type": "Renal Consideration",
            "detail": drug.renal_considerations,
            "evidence_label": "Verified evidence",
            "source": drug.evidence_citations[0]["source"] if drug.evidence_citations else "Reference database"
        }
    return None


def _flag_contraindications(drug: Drug, comorbidities: List[str]) -> List[dict]:
    alerts = []
    text_to_check = " ".join(comorbidities).lower()
    for contra in (drug.contraindications or []):
        c_lower = contra.lower()
        if any(word in c_lower for word in ["pregnancy"] if "pregnancy" in text_to_check):
            alerts.append({
                "drug": drug.generic_name,
                "type": "Contraindication",
                "detail": contra,
                "severity": "Critical",
                "evidence_label": "Verified evidence"
            })
        if any(word in c_lower for word in ["anuria", "renal artery"] if "chronic kidney disease" in text_to_check):
            alerts.append({
                "drug": drug.generic_name,
                "type": "Contraindication",
                "detail": contra,
                "severity": "Major",
                "evidence_label": "Verified evidence"
            })
    return alerts


def _assess_adrs_for_case(drug: Drug, comorbidities: List[str], adrs: List[ADREntry]) -> List[dict]:
    """Case-aware ADR assessment based on drug + patient comorbidities."""
    findings = []
    for adr in adrs:
        risk_elevated = False
        elevated_reason = []
        
        # Hyperkalaemia risk elevated in CKD or diabetes
        if "hyperkalaemia" in adr.reaction_name.lower() or "hyperkal" in adr.reaction_name.lower():
            if "chronic kidney disease" in comorbidities:
                risk_elevated = True
                elevated_reason.append("CKD reduces renal potassium excretion, compounding RAAS inhibitor-induced hyperkalaemia risk")
            if "type 2 diabetes" in comorbidities:
                risk_elevated = True
                elevated_reason.append("Diabetic nephropathy may further reduce potassium excretion capacity")
        
        # AKI risk elevated in CKD
        if "kidney" in adr.reaction_name.lower() or "renal" in adr.reaction_name.lower() or "aki" in adr.reaction_name.lower():
            if "chronic kidney disease" in comorbidities:
                risk_elevated = True
                elevated_reason.append("Pre-existing CKD reduces renal reserve — baseline creatinine is already elevated")
        
        # Hypotension risk
        if "hypotension" in adr.reaction_name.lower():
            if "heart failure" in comorbidities:
                risk_elevated = True
                elevated_reason.append("Heart failure patients may already have low cardiac output — first-dose hypotension risk higher")
        
        # Lactic acidosis risk (Metformin) elevated in CKD
        if "lactic" in adr.reaction_name.lower():
            if "chronic kidney disease" in comorbidities:
                risk_elevated = True
                elevated_reason.append("CKD reduces metformin clearance — lactic acidosis risk is significantly higher; check eGFR")

        findings.append({
            "drug": drug.generic_name,
            "adr": adr.reaction_name,
            "organ_system": adr.organ_system,
            "severity": adr.severity,
            "frequency": adr.frequency or "Not documented",
            "classification": "Suspected elevated risk in this case" if risk_elevated else "Known ADR — baseline risk",
            "case_specific_reasoning": elevated_reason if risk_elevated else [],
            "management": adr.management or "Monitor and manage per clinical assessment",
            "evidence_label": "Verified evidence"
        })
    
    return findings


def analyze_case(db: Session, case: ClinicalCase) -> dict:
    """
    Core analysis engine. Returns structured 20-section educational report.
    """
    # Step 1: Extract drugs from text + current_medications list
    text_drugs = _extract_drugs_from_text(case.free_text_narrative, db)
    
    listed_drugs = []
    for med in (case.current_medications or []):
        name = med.get("name", "") if isinstance(med, dict) else str(med)
        d = get_drug_by_name(db, name)
        if d and d not in listed_drugs:
            listed_drugs.append(d)
    
    all_drugs = list({d.id: d for d in text_drugs + listed_drugs}.values())
    
    # Step 2: Identify comorbidities
    comorbidities = list(case.comorbidities or [])
    text_comorbidities = _extract_comorbidities(case.free_text_narrative)
    all_comorbidities = list(dict.fromkeys(comorbidities + text_comorbidities))
    
    # Step 3: Drug interactions
    drug_names = [d.generic_name for d in all_drugs]
    interactions = check_interactions(db, drug_names)
    
    # Step 4: ADR analysis
    adr_findings = []
    for drug in all_drugs:
        adrs = db.query(ADREntry).filter(ADREntry.drug_id == drug.id).all()
        adr_findings.extend(_assess_adrs_for_case(drug, all_comorbidities, adrs))
    
    # Step 5: Renal considerations
    renal_concerns = []
    for drug in all_drugs:
        concern = _flag_renal_concerns(drug, case.renal_status, all_comorbidities)
        if concern:
            renal_concerns.append(concern)
    
    # Step 6: Contraindications
    contraindication_alerts = []
    for drug in all_drugs:
        alerts = _flag_contraindications(drug, all_comorbidities)
        contraindication_alerts.extend(alerts)
    
    # Step 7: Same-class comparisons
    comparisons = {}
    for drug in all_drugs:
        alternatives = get_same_class_drugs(db, drug)
        if alternatives:
            comparisons[drug.generic_name] = build_comparison_table(drug, alternatives)
    
    # Step 8: Missing information identification
    missing = []
    if not case.patient_age:
        missing.append("Patient age — affects dosage calculations and risk stratification")
    if not case.renal_status and "chronic kidney disease" in all_comorbidities:
        missing.append("Specific eGFR value — essential for renal dose adjustment of multiple agents")
    if not case.patient_gender:
        missing.append("Patient sex — relevant for some pharmacokinetic and dosage considerations")
    if not case.hepatic_status and any(d.hepatic_considerations for d in all_drugs):
        missing.append("Hepatic function status — relevant for drugs with hepatic dose adjustments")
    
    # Build 20-section report
    report = {
        "section_1_summary": f"Clinical case entered with {len(all_drugs)} identified medication(s) and {len(all_comorbidities)} identified comorbidity/condition(s). {len(interactions)} drug interaction(s) identified. {len(contraindication_alerts)} contraindication alert(s) flagged.",
        "section_2_patient_info": {
            "age": case.patient_age or "Not provided",
            "gender": case.patient_gender or "Not provided",
            "specialty": case.specialty,
            "renal_status": case.renal_status or "Not provided",
            "hepatic_status": case.hepatic_status or "Not provided",
            "allergies": case.allergies or [],
        },
        "section_3_comorbidities": all_comorbidities,
        "section_4_identified_medications": [
            {
                "generic_name": d.generic_name,
                "class": d.pharmacological_class,
                "category": d.therapeutic_category,
                "source": "Identified from case text or medication list"
            } for d in all_drugs
        ],
        "section_5_moa": [
            {
                "drug": d.generic_name,
                "simple": d.moa_simple,
                "advanced": d.moa_advanced,
                "targets": d.molecular_targets,
                "organ_sites": d.organ_sites
            } for d in all_drugs
        ],
        "section_6_dosage_considerations": [
            {
                "drug": d.generic_name,
                "strengths": d.available_strengths,
                "onset": d.onset,
                "peak": d.peak,
                "duration": d.duration,
                "monitoring": d.monitoring_requirements
            } for d in all_drugs
        ],
        "section_7_adr_analysis": adr_findings,
        "section_8_interactions": interactions,
        "section_9_contraindications": contraindication_alerts,
        "section_10_renal": renal_concerns,
        "section_11_hepatic": [
            {
                "drug": d.generic_name,
                "consideration": d.hepatic_considerations
            } for d in all_drugs if d.hepatic_considerations
        ],
        "section_12_monitoring": [
            {
                "drug": d.generic_name,
                "parameters": d.monitoring_requirements
            } for d in all_drugs
        ],
        "section_13_pregnancy_lactation": [
            {
                "drug": d.generic_name,
                "pregnancy": d.pregnancy_category,
                "lactation": d.lactation_safety
            } for d in all_drugs if ("pregnancy" in all_comorbidities or d.pregnancy_category)
        ],
        "section_14_same_class_comparisons": comparisons,
        "section_15_evidence": [
            {
                "drug": d.generic_name,
                "citations": d.evidence_citations,
                "last_verified": d.last_verified
            } for d in all_drugs
        ],
        "section_16_missing_information": missing,
        "section_17_uncertainty": {
            "label": "Conditional on patient factors",
            "explanation": (
                "This analysis is based on available patient information. "
                "Missing data points (noted above) may alter the conclusions. "
                "Clinical significance of identified interactions depends on individual "
                "patient characteristics, actual doses, and clinical context. "
                "All findings require verification by a qualified healthcare professional."
            )
        },
        "section_18_why_other_drugs": {
            drug_name: {
                "primary": drug_name,
                "alternatives": comp.get("alternatives", []),
                "comparison": comp.get("comparison_rows", []),
                "disclaimer": comp.get("disclaimer", "")
            }
            for drug_name, comp in comparisons.items()
        },
        "section_19_safety_alerts": {
            "critical": [a for a in contraindication_alerts if a.get("severity") == "Critical"],
            "major": [i for i in interactions if i.get("severity") == "Major"] + [a for a in contraindication_alerts if a.get("severity") == "Major"],
            "monitoring": [{"drug": d.generic_name, "params": d.monitoring_requirements} for d in all_drugs]
        },
        "section_20_educational_disclaimer": settings.DISCLAIMER
    }
    
    return report
