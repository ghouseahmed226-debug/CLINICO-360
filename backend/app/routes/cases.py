from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.cases import ClinicalCaseCreate, ClinicalCaseOut, PrescriptionCreate, DosageQueryRequest
from app.models.entities import ClinicalCase, CaseAnalysis, Prescription
from app.services.case_service import analyze_case
from app.services.drug_service import get_drug_by_name

router = APIRouter(prefix="/cases", tags=["Clinical Cases"])


@router.post("/create")
def create_case(req: ClinicalCaseCreate, db: Session = Depends(get_db)):
    meds_as_dicts = [m.model_dump() if hasattr(m, "model_dump") else dict(m) for m in req.current_medications]
    case = ClinicalCase(
        title=req.title,
        specialty=req.specialty,
        patient_age=req.patient_age,
        patient_gender=req.patient_gender,
        comorbidities=req.comorbidities,
        allergies=req.allergies,
        renal_status=req.renal_status,
        hepatic_status=req.hepatic_status,
        free_text_narrative=req.free_text_narrative,
        current_medications=meds_as_dicts,
        structured_findings=req.structured_findings,
    )
    db.add(case)
    db.commit()
    db.refresh(case)
    
    # Auto-analyse on creation
    report = analyze_case(db, case)
    
    analysis = CaseAnalysis(
        case_id=case.id,
        summary=report["section_1_summary"],
        identified_problems=report.get("section_19_safety_alerts", {}).get("major", []),
        safety_alerts=report.get("section_19_safety_alerts", {}),
        adr_suspicions=report.get("section_7_adr_analysis", []),
        dosage_evaluations=report.get("section_6_dosage_considerations", []),
        same_class_comparisons=list(report.get("section_14_same_class_comparisons", {}).values()),
        educational_report=report,
        missing_information=report.get("section_16_missing_information", []),
        uncertainty_matrix=report.get("section_17_uncertainty", {}),
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)
    
    return {
        "case_id": case.id,
        "analysis_id": analysis.id,
        "report": report
    }


@router.get("/{case_id}")
def get_case(case_id: int, db: Session = Depends(get_db)):
    case = db.query(ClinicalCase).filter(ClinicalCase.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    analysis = db.query(CaseAnalysis).filter(CaseAnalysis.case_id == case_id).order_by(CaseAnalysis.id.desc()).first()
    return {
        "case": {
            "id": case.id,
            "title": case.title,
            "specialty": case.specialty,
            "patient_age": case.patient_age,
            "patient_gender": case.patient_gender,
            "comorbidities": case.comorbidities,
            "free_text_narrative": case.free_text_narrative,
            "current_medications": case.current_medications,
            "renal_status": case.renal_status,
            "created_at": case.created_at.isoformat() if case.created_at else None
        },
        "analysis": analysis.educational_report if analysis else None
    }


@router.get("/list/all")
def list_cases(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    cases = db.query(ClinicalCase).order_by(ClinicalCase.id.desc()).offset(skip).limit(limit).all()
    return [
        {
            "id": c.id,
            "title": c.title,
            "specialty": c.specialty,
            "created_at": c.created_at.isoformat() if c.created_at else None,
            "medications_count": len(c.current_medications or [])
        } for c in cases
    ]


@router.post("/prescription/analyze")
def analyze_prescription(req: PrescriptionCreate, db: Session = Depends(get_db)):
    """
    Text-based prescription analysis. 
    OCR upload is handled by the /upload endpoint.
    Extracts medication names from free text and returns structured medication cards.
    """
    from app.services.case_service import _extract_drugs_from_text
    
    # Create temporary mock case for drug extraction
    class _TempCase:
        free_text_narrative = req.raw_text
        comorbidities = []
        current_medications = []
        renal_status = None
        hepatic_status = None
        allergies = []
        patient_age = None
        patient_gender = None
    
    drugs = _extract_drugs_from_text(req.raw_text, db)
    
    prescription = Prescription(
        raw_text=req.raw_text,
        source_type=req.source_type,
        patient_identifier=req.patient_identifier,
        extracted_medications=[{"name": d.generic_name, "class": d.pharmacological_class} for d in drugs],
        confidence_score=0.85 if drugs else 0.40,
        verification_status="pending_review"
    )
    db.add(prescription)
    db.commit()
    db.refresh(prescription)
    
    return {
        "prescription_id": prescription.id,
        "drugs_identified": len(drugs),
        "medication_cards": [
            {
                "generic_name": d.generic_name,
                "brand_names": d.brand_names,
                "class": d.pharmacological_class,
                "category": d.therapeutic_category,
                "strengths": d.available_strengths,
                "moa_simple": d.moa_simple,
                "confidence": "High — exact name match",
                "verification_required": False,
                "drug_id": d.id
            } for d in drugs
        ],
        "unrecognized_text": req.raw_text if not drugs else None,
        "verification_status": "pending_review",
        "disclaimer": "Human verification required before clinical use. Extracted medications should be confirmed against the original prescription."
    }


@router.post("/dosage/query")
def dosage_query(req: DosageQueryRequest, db: Session = Depends(get_db)):
    """Returns reference dosage information for a drug. Does NOT calculate patient-specific doses without required inputs."""
    drug = get_drug_by_name(db, req.drug_name)
    if not drug:
        return {
            "drug": req.drug_name,
            "status": "not_found",
            "message": f"'{req.drug_name}' not found in current database. Try a different spelling or generic name.",
            "disclaimer": "Consult NFI, BNF, or approved prescribing information."
        }
    
    warnings = []
    renal_note = None
    
    # Renal check
    if req.renal_egfr is not None and drug.renal_considerations:
        renal_note = drug.renal_considerations
        if req.renal_egfr < 30:
            warnings.append(f"eGFR {req.renal_egfr} mL/min — CRITICAL: Review renal dosing requirements urgently.")
        elif req.renal_egfr < 60:
            warnings.append(f"eGFR {req.renal_egfr} mL/min — Renal dose adjustment may be required. See renal considerations.")
    
    if not req.age:
        warnings.append("Age not provided — paediatric, elderly, or weight-based dose calculations require patient age.")
    if not req.weight_kg and "weight-based" in str(drug.approved_indications).lower():
        warnings.append("Weight not provided — weight-based dosing cannot be calculated.")
    
    return {
        "drug": drug.generic_name,
        "indication_requested": req.indication,
        "reference_dosage": {
            "approved_indications": drug.approved_indications,
            "available_strengths": drug.available_strengths,
            "routes": drug.routes,
            "clinical_considerations": drug.clinical_considerations,
            "onset": drug.onset,
            "peak": drug.peak,
            "duration": drug.duration,
        },
        "renal_considerations": renal_note,
        "hepatic_considerations": drug.hepatic_considerations,
        "monitoring": drug.monitoring_requirements,
        "warnings": warnings,
        "missing_inputs": [w for w in warnings if "not provided" in w],
        "evidence": drug.evidence_citations,
        "disclaimer": (
            "This is REFERENCE dosage information only. "
            "Patient-specific dosing must be determined by a qualified clinician based on "
            "complete individual assessment. CLINICO 360 does not prescribe or recommend doses."
        )
    }
