"""
Drug interaction and IV compatibility service.
"""
from typing import List, Tuple
from sqlalchemy.orm import Session
from app.models.entities import DrugInteraction, IVCompatibility


def check_interactions(db: Session, drug_names: List[str]) -> List[dict]:
    """
    Check for interactions between a list of drug names.
    Returns all relevant interactions found in database.
    """
    drug_names_lower = [d.lower() for d in drug_names]
    all_interactions = db.query(DrugInteraction).all()
    findings = []
    
    for interaction in all_interactions:
        a = interaction.drug_a.lower()
        b = interaction.drug_b.lower()
        
        # Check if drug_a matches any drug in list
        a_match = any(a in dn or dn in a for dn in drug_names_lower)
        # Check if drug_b matches any drug in list
        b_match = any(b in dn or dn in b for dn in drug_names_lower)
        
        if a_match and b_match:
            findings.append({
                "drug_a": interaction.drug_a,
                "drug_b": interaction.drug_b,
                "severity": interaction.severity,
                "interaction_type": interaction.interaction_type,
                "mechanism": interaction.mechanism,
                "clinical_effect": interaction.clinical_effect,
                "management": interaction.management,
                "evidence_source": interaction.evidence_source,
                "uncertainty": "This interaction is based on documented pharmacological evidence. Clinical significance varies with individual patient factors."
            })
    
    return findings


def check_iv_compatibility(db: Session, drug_a: str, drug_b: str) -> dict:
    """Check IV compatibility between two drugs."""
    a_lower = drug_a.lower()
    b_lower = drug_b.lower()
    
    records = db.query(IVCompatibility).all()
    for record in records:
        ra = record.drug_a.lower()
        rb = record.drug_b.lower()
        if (a_lower in ra or ra in a_lower) and (b_lower in rb or rb in b_lower):
            return _format_iv_result(record)
        if (b_lower in ra or ra in b_lower) and (a_lower in rb or rb in a_lower):
            return _format_iv_result(record)
    
    # Not found in database
    return {
        "drug_a": drug_a,
        "drug_b": drug_b,
        "status": "Unknown",
        "status_code": "grey",
        "message": f"No IV compatibility data found for {drug_a} with {drug_b} in the current reference database.",
        "critical_warning": (
            "IMPORTANT: Absence of incompatibility data does NOT imply compatibility. "
            "Consult current Trissel's Handbook or King Guide, pharmacist, or hospital pharmacy "
            "before IV co-administration."
        )
    }


def _format_iv_result(record: IVCompatibility) -> dict:
    status_map = {
        "Compatible": "green",
        "Conditional": "yellow",
        "Incompatible": "red",
        "Unknown": "grey"
    }
    return {
        "drug_a": record.drug_a,
        "drug_b": record.drug_b,
        "diluent": record.diluent,
        "status": record.status,
        "status_code": status_map.get(record.status, "grey"),
        "physical_compatibility": record.physical_compatibility,
        "chemical_compatibility": record.chemical_compatibility,
        "notes": record.notes,
        "source": record.source,
        "critical_warning": (
            "IV compatibility is conditional on the specific concentrations, diluent, "
            "temperature, and administration conditions documented in the source. "
            "Verify against current institutional pharmacy guidance."
        )
    }
