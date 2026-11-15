import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default="mbbs_intern")  # mbbs_intern, pharmd_intern, medical_student, hospital_pharmacist, clinical_educator, admin
    institution = Column(String(255), default="Teaching Hospital & Medical College")
    specialty_interest = Column(String(100), default="Internal Medicine")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    cases = relationship("ClinicalCase", back_populates="user")
    prescriptions = relationship("Prescription", back_populates="user")
    quiz_attempts = relationship("QuizAttempt", back_populates="user")
    audit_logs = relationship("AuditLog", back_populates="user")

class Drug(Base):
    __tablename__ = "drugs"

    id = Column(Integer, primary_key=True, index=True)
    generic_name = Column(String(255), unique=True, index=True, nullable=False)
    brand_names = Column(JSON, default=list)  # ["Cardace", "Altace", "Ramace"]
    pharmacological_class = Column(String(255), index=True, nullable=False) # e.g. "ACE Inhibitor"
    subclass = Column(String(255), nullable=True)
    therapeutic_category = Column(String(255), index=True, nullable=False) # e.g. "Antihypertensive"
    available_strengths = Column(JSON, default=list) # ["1.25 mg", "2.5 mg", "5 mg", "10 mg"]
    dosage_forms = Column(JSON, default=list) # ["Tablet", "Capsule"]
    routes = Column(JSON, default=list) # ["Oral"]
    
    # Mechanism of action
    moa_simple = Column(Text, nullable=False)
    moa_advanced = Column(Text, nullable=False)
    molecular_targets = Column(JSON, default=list) # ["Angiotensin-Converting Enzyme"]
    receptors = Column(JSON, default=list)
    enzymes = Column(JSON, default=list)
    cellular_pathways = Column(JSON, default=list)
    organ_sites = Column(JSON, default=list) # ["Cardiovascular", "Renal"]
    pharmacological_effects = Column(JSON, default=list)

    # Clinical Information
    approved_indications = Column(JSON, default=list)
    off_label_indications = Column(JSON, default=list)
    clinical_considerations = Column(Text, nullable=True)
    onset = Column(String(100), nullable=True)
    peak = Column(String(100), nullable=True)
    duration = Column(String(100), nullable=True)

    # PK/PD
    bioavailability = Column(String(100), nullable=True)
    protein_binding = Column(String(100), nullable=True)
    metabolism = Column(String(255), nullable=True)
    half_life = Column(String(100), nullable=True)
    excretion = Column(String(255), nullable=True)

    # Safety
    contraindications = Column(JSON, default=list)
    precautions = Column(JSON, default=list)
    pregnancy_category = Column(String(50), nullable=True) # e.g. "Category D (Black Box)"
    lactation_safety = Column(String(255), nullable=True)
    renal_considerations = Column(Text, nullable=True)
    hepatic_considerations = Column(Text, nullable=True)
    monitoring_requirements = Column(JSON, default=list)

    # Evidence
    evidence_citations = Column(JSON, default=list)
    last_verified = Column(String(50), default="2026-02-15")

    adrs = relationship("ADREntry", back_populates="drug")

class ADREntry(Base):
    __tablename__ = "adrs"

    id = Column(Integer, primary_key=True, index=True)
    drug_id = Column(Integer, ForeignKey("drugs.id"), nullable=False)
    reaction_name = Column(String(255), nullable=False)
    organ_system = Column(String(100), index=True, nullable=False) # e.g. "Respiratory", "Renal", "Cutaneous"
    severity = Column(String(50), nullable=False) # "Common", "Moderate", "Serious", "Life-Threatening"
    frequency = Column(String(50), nullable=True) # e.g. "5-10%", "1-3%", "<0.1%"
    dose_related = Column(Boolean, default=False)
    time_to_onset = Column(String(100), nullable=True)
    risk_factors = Column(JSON, default=list)
    mechanism = Column(Text, nullable=True)
    management = Column(Text, nullable=True)

    drug = relationship("Drug", back_populates="adrs")

class DrugInteraction(Base):
    __tablename__ = "drug_interactions"

    id = Column(Integer, primary_key=True, index=True)
    drug_a = Column(String(255), index=True, nullable=False)
    drug_b = Column(String(255), index=True, nullable=False)
    severity = Column(String(50), nullable=False) # "Contraindicated", "Major", "Moderate", "Minor"
    interaction_type = Column(String(50), default="PK") # "PK", "PD", "Duplicate"
    mechanism = Column(Text, nullable=False)
    clinical_effect = Column(Text, nullable=False)
    management = Column(Text, nullable=False)
    evidence_source = Column(String(255), default="NFI & Clinical Pharmacology Compendium")

class IVCompatibility(Base):
    __tablename__ = "iv_compatibilities"

    id = Column(Integer, primary_key=True, index=True)
    drug_a = Column(String(255), index=True, nullable=False)
    drug_b = Column(String(255), index=True, nullable=False)
    diluent = Column(String(100), default="0.9% Normal Saline") # "0.9% Normal Saline", "5% Dextrose (D5W)", "Lactated Ringer's"
    status = Column(String(50), nullable=False) # "Compatible", "Conditional", "Incompatible", "Unknown"
    physical_compatibility = Column(String(255), nullable=True)
    chemical_compatibility = Column(String(255), nullable=True)
    notes = Column(Text, nullable=True)
    source = Column(String(255), default="Trissel's / Clinical Reference Guide")

class ClinicalCase(Base):
    __tablename__ = "clinical_cases"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    title = Column(String(255), nullable=False)
    specialty = Column(String(100), default="Internal Medicine")
    patient_age = Column(Integer, nullable=True)
    patient_gender = Column(String(20), nullable=True)
    comorbidities = Column(JSON, default=list)
    allergies = Column(JSON, default=list)
    renal_status = Column(String(100), nullable=True) # e.g. "eGFR 38 mL/min/1.73m2 (CKD Stage 3b)"
    hepatic_status = Column(String(100), nullable=True)
    free_text_narrative = Column(Text, nullable=False)
    structured_findings = Column(JSON, default=dict)
    current_medications = Column(JSON, default=list) # [{"name": "Ramipril", "dose": "5mg", "freq": "OD"}]
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="cases")
    analyses = relationship("CaseAnalysis", back_populates="case")

class CaseAnalysis(Base):
    __tablename__ = "case_analyses"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("clinical_cases.id"), nullable=False)
    summary = Column(Text, nullable=False)
    identified_problems = Column(JSON, default=list)
    safety_alerts = Column(JSON, default=list)
    adr_suspicions = Column(JSON, default=list)
    dosage_evaluations = Column(JSON, default=list)
    same_class_comparisons = Column(JSON, default=list)
    educational_report = Column(JSON, default=dict) # 20 structured sections
    missing_information = Column(JSON, default=list)
    uncertainty_matrix = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    case = relationship("ClinicalCase", back_populates="analyses")

class Prescription(Base):
    __tablename__ = "prescriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    patient_identifier = Column(String(100), default="SYNTHETIC-PT-001")
    source_type = Column(String(50), default="text") # "upload", "ocr_print", "ocr_handwritten", "text"
    raw_text = Column(Text, nullable=False)
    extracted_medications = Column(JSON, default=list)
    confidence_score = Column(Float, default=0.92)
    verification_status = Column(String(50), default="pending_review") # "pending_review", "verified", "flagged"
    verified_medications = Column(JSON, default=list)
    clinical_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="prescriptions")

class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    quiz_type = Column(String(50), default="case_simulation") # "case_simulation", "viva_exam"
    topic = Column(String(255), nullable=False)
    score = Column(Float, nullable=False)
    total_questions = Column(Integer, default=5)
    details = Column(JSON, default=dict)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="quiz_attempts")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    action = Column(String(100), nullable=False)
    resource_type = Column(String(100), nullable=False)
    resource_id = Column(String(100), nullable=True)
    details = Column(JSON, default=dict)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="audit_logs")
