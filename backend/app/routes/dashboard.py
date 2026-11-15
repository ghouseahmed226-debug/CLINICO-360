from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.entities import Drug, ClinicalCase, Prescription, QuizAttempt, DrugInteraction
from app.config import settings

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    """Returns real database counts for the dashboard."""
    return {
        "drugs_in_database": db.query(Drug).count(),
        "clinical_cases": db.query(ClinicalCase).count(),
        "prescriptions_analyzed": db.query(Prescription).count(),
        "drug_interactions_indexed": db.query(DrugInteraction).count(),
        "disclaimer": settings.DISCLAIMER,
        "platform_version": settings.VERSION
    }


@router.get("/recent-cases")
def recent_cases(limit: int = 5, db: Session = Depends(get_db)):
    cases = db.query(ClinicalCase).order_by(ClinicalCase.id.desc()).limit(limit).all()
    return [
        {
            "id": c.id,
            "title": c.title,
            "specialty": c.specialty,
            "created_at": c.created_at.isoformat() if c.created_at else None
        } for c in cases
    ]


@router.get("/recent-drugs")
def recent_drugs(limit: int = 8, db: Session = Depends(get_db)):
    drugs = db.query(Drug).limit(limit).all()
    return [
        {
            "id": d.id,
            "generic_name": d.generic_name,
            "pharmacological_class": d.pharmacological_class,
            "therapeutic_category": d.therapeutic_category
        } for d in drugs
    ]


@router.get("/health")
def health():
    return {"status": "healthy", "service": "CLINICO 360 API", "version": settings.VERSION}
