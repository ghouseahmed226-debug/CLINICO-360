"""
Drug intelligence service — search, profile retrieval, same-class comparison.
"""
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.entities import Drug, ADREntry, DrugInteraction, IVCompatibility


def search_drugs(db: Session, query: str, limit: int = 20) -> List[Drug]:
    q = query.lower().strip()
    drugs = db.query(Drug).all()
    results = []
    for drug in drugs:
        score = 0
        if q in drug.generic_name.lower():
            score += 100 if drug.generic_name.lower().startswith(q) else 60
        brand_match = any(q in b.lower() for b in (drug.brand_names or []))
        if brand_match:
            score += 50
        if q in (drug.pharmacological_class or "").lower():
            score += 30
        if q in (drug.therapeutic_category or "").lower():
            score += 20
        if score > 0:
            results.append((score, drug))
    results.sort(key=lambda x: -x[0])
    return [d for _, d in results[:limit]]


def get_drug_by_name(db: Session, name: str) -> Optional[Drug]:
    drug = db.query(Drug).filter(
        Drug.generic_name.ilike(f"%{name}%")
    ).first()
    return drug


def get_drug_profile(db: Session, drug_id: int) -> Optional[Drug]:
    return db.query(Drug).filter(Drug.id == drug_id).first()


def get_adrs_for_drug(db: Session, drug_id: int) -> List[ADREntry]:
    return db.query(ADREntry).filter(ADREntry.drug_id == drug_id).all()


def get_same_class_drugs(db: Session, drug: Drug) -> List[Drug]:
    """Return drugs in the same pharmacological class."""
    same_class = db.query(Drug).filter(
        Drug.pharmacological_class == drug.pharmacological_class,
        Drug.id != drug.id
    ).all()
    return same_class


def build_comparison_table(primary: Drug, alternatives: List[Drug]) -> dict:
    """Build structured same-class drug comparison."""
    all_drugs = [primary] + alternatives
    rows = []
    factors = [
        ("pharmacological_class", "Pharmacological Class"),
        ("moa_simple", "Mechanism of Action (Simple)"),
        ("approved_indications", "Approved Indications"),
        ("available_strengths", "Available Strengths"),
        ("half_life", "Half-Life"),
        ("bioavailability", "Bioavailability"),
        ("metabolism", "Metabolism"),
        ("excretion", "Excretion"),
        ("renal_considerations", "Renal Considerations"),
        ("hepatic_considerations", "Hepatic Considerations"),
        ("pregnancy_category", "Pregnancy Category"),
        ("contraindications", "Key Contraindications"),
    ]
    for field, label in factors:
        row = {"factor": label}
        for d in all_drugs:
            val = getattr(d, field, None)
            if isinstance(val, list):
                val = "; ".join(val[:3]) + ("..." if len(val) > 3 else "")
            row[d.generic_name] = val or "Not documented"
        rows.append(row)
    return {
        "primary_drug": primary.generic_name,
        "alternatives": [a.generic_name for a in alternatives],
        "comparison_rows": rows,
        "disclaimer": (
            "This is a clinical comparison of available pharmacological alternatives. "
            "It does not confirm or replicate the original prescriber's reasoning. "
            "Therapeutic selection requires individualised clinical assessment by a qualified healthcare professional."
        )
    }
