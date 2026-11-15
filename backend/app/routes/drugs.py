from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.schemas.drugs import DrugSummary, DrugProfile, InteractionCheckRequest, IVCompatRequest
from app.services.drug_service import search_drugs, get_drug_profile, get_same_class_drugs, build_comparison_table
from app.services.interaction_service import check_interactions, check_iv_compatibility
from app.models.entities import Drug, ADREntry

router = APIRouter(prefix="/drugs", tags=["Drug Intelligence"])


@router.get("/search", response_model=List[DrugSummary])
def search(q: str = Query(..., min_length=1), limit: int = 20, db: Session = Depends(get_db)):
    results = search_drugs(db, q, limit)
    return results


@router.get("/list", response_model=List[DrugSummary])
def list_drugs(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    return db.query(Drug).offset(skip).limit(limit).all()


@router.get("/{drug_id}", response_model=DrugProfile)
def get_profile(drug_id: int, db: Session = Depends(get_db)):
    drug = get_drug_profile(db, drug_id)
    if not drug:
        raise HTTPException(status_code=404, detail="Drug not found")
    adrs = db.query(ADREntry).filter(ADREntry.drug_id == drug_id).all()
    drug.adrs = adrs
    return drug


@router.get("/{drug_id}/same-class")
def same_class_comparison(drug_id: int, db: Session = Depends(get_db)):
    drug = get_drug_profile(db, drug_id)
    if not drug:
        raise HTTPException(status_code=404, detail="Drug not found")
    alternatives = get_same_class_drugs(db, drug)
    if not alternatives:
        return {
            "message": f"No other drugs from the '{drug.pharmacological_class}' class found in current database.",
            "drug": drug.generic_name,
            "disclaimer": "Database coverage is growing. Absence does not imply no alternatives exist."
        }
    return build_comparison_table(drug, alternatives)


@router.post("/interactions/check")
def check_drug_interactions(req: InteractionCheckRequest, db: Session = Depends(get_db)):
    if len(req.drug_names) < 2:
        raise HTTPException(status_code=400, detail="At least 2 drug names required")
    interactions = check_interactions(db, req.drug_names)
    return {
        "drugs_checked": req.drug_names,
        "total_interactions_found": len(interactions),
        "interactions": interactions,
        "disclaimer": (
            "Interactions shown are based on documented pharmacological evidence. "
            "Absence of an interaction record does NOT confirm safety. "
            "Clinical significance is patient-specific. Consult a clinical pharmacist."
        )
    }


@router.post("/iv-compatibility/check")
def iv_compat(req: IVCompatRequest, db: Session = Depends(get_db)):
    return check_iv_compatibility(db, req.drug_a, req.drug_b)


@router.get("/{drug_id}/adrs")
def get_adrs(drug_id: int, organ_system: Optional[str] = None, severity: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(ADREntry).filter(ADREntry.drug_id == drug_id)
    if organ_system:
        q = q.filter(ADREntry.organ_system.ilike(f"%{organ_system}%"))
    if severity:
        q = q.filter(ADREntry.severity.ilike(f"%{severity}%"))
    adrs = q.all()
    return {
        "drug_id": drug_id,
        "filters": {"organ_system": organ_system, "severity": severity},
        "count": len(adrs),
        "adrs": [
            {
                "id": a.id,
                "reaction": a.reaction_name,
                "organ_system": a.organ_system,
                "severity": a.severity,
                "frequency": a.frequency,
                "dose_related": a.dose_related,
                "time_to_onset": a.time_to_onset,
                "risk_factors": a.risk_factors,
                "mechanism": a.mechanism,
                "management": a.management,
                "evidence_label": "Verified evidence"
            } for a in adrs
        ]
    }
