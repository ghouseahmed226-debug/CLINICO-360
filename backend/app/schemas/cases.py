from pydantic import BaseModel
from typing import List, Optional, Any, Dict

class MedicationEntry(BaseModel):
    name: str
    dose: Optional[str] = None
    frequency: Optional[str] = None
    route: Optional[str] = None

class ClinicalCaseCreate(BaseModel):
    title: str
    specialty: str = "Internal Medicine"
    patient_age: Optional[int] = None
    patient_gender: Optional[str] = None
    comorbidities: List[str] = []
    allergies: List[str] = []
    renal_status: Optional[str] = None
    hepatic_status: Optional[str] = None
    free_text_narrative: str
    current_medications: List[MedicationEntry] = []
    structured_findings: Dict[str, Any] = {}

class ClinicalCaseOut(BaseModel):
    id: int
    title: str
    specialty: str
    patient_age: Optional[int]
    patient_gender: Optional[str]
    comorbidities: List[str]
    free_text_narrative: str
    current_medications: Any

    class Config:
        from_attributes = True

class PrescriptionCreate(BaseModel):
    raw_text: str
    source_type: str = "text"
    patient_identifier: str = "SYNTHETIC-PT-001"

class DosageQueryRequest(BaseModel):
    drug_name: str
    indication: Optional[str] = None
    age: Optional[int] = None
    weight_kg: Optional[float] = None
    renal_egfr: Optional[float] = None
    comorbidities: List[str] = []
