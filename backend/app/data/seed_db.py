"""
Database seeder — populates CLINICO 360 with curated reference drug data.
Run: python -m app.data.seed_db
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from app.database import SessionLocal, engine
from app.models.entities import Base, Drug, ADREntry, DrugInteraction, IVCompatibility
from app.data.seed_data import SEED_DRUGS, SEED_INTERACTIONS, SEED_IV_COMPATIBILITY

def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(Drug).count() > 0:
            print("Database already seeded — skipping.")
            return

        print("Seeding drug database...")
        for d in SEED_DRUGS:
            adrs_data = d.pop("adrs", [])
            drug = Drug(**d)
            db.add(drug)
            db.flush()

            for adr_data in adrs_data:
                adr_data.setdefault("risk_factors", [])
                adr = ADREntry(drug_id=drug.id, **adr_data)
                db.add(adr)

        print(f"  Inserted {len(SEED_DRUGS)} drugs.")

        print("Seeding drug interactions...")
        for i in SEED_INTERACTIONS:
            db.add(DrugInteraction(**i))
        print(f"  Inserted {len(SEED_INTERACTIONS)} interactions.")

        print("Seeding IV compatibility records...")
        for iv in SEED_IV_COMPATIBILITY:
            db.add(IVCompatibility(**iv))
        print(f"  Inserted {len(SEED_IV_COMPATIBILITY)} IV records.")

        db.commit()
        print("Seeding complete.")
    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed()
