from pydantic import BaseModel
from typing import List, Optional, Any, Dict

class DrugSummary(BaseModel):
    id: int
    generic_name: str
    brand_names: List[str]
    pharmacological_class: str
    therapeutic_category: str
    available_strengths: List[str]
    moa_simple: str

    class Config:
        from_attributes = True

class ADRSummary(BaseModel):
    id: int
    reaction_name: str
    organ_system: str
    severity: str
    frequency: Optional[str]
    dose_related: bool
    mechanism: Optional[str]
    management: Optional[str]

    class Config:
        from_attributes = True

class DrugProfile(BaseModel):
    id: int
    generic_name: str
    brand_names: List[str]
    pharmacological_class: str
    subclass: Optional[str]
    therapeutic_category: str
    available_strengths: List[str]
    dosage_forms: List[str]
    routes: List[str]
    moa_simple: str
    moa_advanced: str
    molecular_targets: List[str]
    receptors: List[str]
    enzymes: List[str]
    cellular_pathways: List[str]
    organ_sites: List[str]
    pharmacological_effects: List[str]
    approved_indications: List[str]
    off_label_indications: List[str]
    clinical_considerations: Optional[str]
    onset: Optional[str]
    peak: Optional[str]
    duration: Optional[str]
    bioavailability: Optional[str]
    protein_binding: Optional[str]
    metabolism: Optional[str]
    half_life: Optional[str]
    excretion: Optional[str]
    contraindications: List[str]
    precautions: List[str]
    pregnancy_category: Optional[str]
    lactation_safety: Optional[str]
    renal_considerations: Optional[str]
    hepatic_considerations: Optional[str]
    monitoring_requirements: List[str]
    evidence_citations: List[Any]
    last_verified: Optional[str]
    adrs: List[ADRSummary] = []

    class Config:
        from_attributes = True

class InteractionCheckRequest(BaseModel):
    drug_names: List[str]

class IVCompatRequest(BaseModel):
    drug_a: str
    drug_b: str
