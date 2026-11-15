import pytest
from app.database import SessionLocal
from app.services.drug_service import search_drugs, get_drug_by_name, get_same_class_drugs, build_comparison_table
from app.services.interaction_service import check_interactions, check_iv_compatibility
from app.services.case_service import analyze_case
from app.models.entities import ClinicalCase, Drug

def test_drug_search_and_retrieval():
    db = SessionLocal()
    try:
        drugs = search_drugs(db, "ramipril")
        assert len(drugs) >= 1
        assert drugs[0].generic_name == "Ramipril"

        # Search by class
        ace_drugs = search_drugs(db, "ACE Inhibitor")
        assert len(ace_drugs) >= 1

        # Search by brand
        brand_drugs = search_drugs(db, "Cardace")
        assert len(brand_drugs) >= 1
    finally:
        db.close()

def test_same_class_comparison():
    db = SessionLocal()
    try:
        ramipril = get_drug_by_name(db, "Ramipril")
        assert ramipril is not None
        # test comparison table structure
        table = build_comparison_table(ramipril, [])
        assert "primary_drug" in table
        assert "comparison_rows" in table
        assert "disclaimer" in table
    finally:
        db.close()

def test_interaction_service():
    db = SessionLocal()
    try:
        interactions = check_interactions(db, ["Ramipril", "Spironolactone"])
        assert len(interactions) >= 1
        assert interactions[0]["severity"] == "Major"
        assert "hyperkalaemia" in interactions[0]["mechanism"].lower()
    finally:
        db.close()

def test_iv_compatibility():
    db = SessionLocal()
    try:
        res = check_iv_compatibility(db, "Furosemide", "Gentamicin")
        assert res["status"] == "Incompatible"
        assert "critical_warning" in res

        # Unknown drug check - safe non-assumption
        unknown = check_iv_compatibility(db, "DrugX", "DrugY")
        assert unknown["status"] == "Unknown"
        assert "does NOT imply compatibility" in unknown["critical_warning"]
    finally:
        db.close()

def test_case_analysis_engine():
    db = SessionLocal()
    try:
        case = ClinicalCase(
            title="CKD patient on ACE inhibitor",
            specialty="Nephrology",
            patient_age=65,
            patient_gender="Male",
            comorbidities=["Hypertension", "Chronic kidney disease"],
            renal_status="eGFR 32 mL/min/1.73m2",
            free_text_narrative="65 year old with chronic kidney disease and hypertension taking Ramipril 5mg and Furosemide 40mg.",
            current_medications=[{"name": "Ramipril", "dose": "5mg", "freq": "OD"}]
        )
        report = analyze_case(db, case)
        assert "section_1_summary" in report
        assert "section_4_identified_medications" in report
        assert "section_7_adr_analysis" in report
        assert "section_16_missing_information" in report
        assert "section_20_educational_disclaimer" in report
        assert len(report["section_4_identified_medications"]) >= 1
    finally:
        db.close()
