# CLINICO 360
## AI-Powered Clinical Intelligence & Medication Safety Platform
> Think Faster. Verify Smarter. Practice Safer.

CLINICO 360 is an educational clinical intelligence platform for MBBS interns, Pharm.D students, hospital pharmacists and clinical educators. Enter any clinical case and receive evidence-backed pharmacology, ADR analysis, interaction checks and therapeutic comparisons.

---

## ⚠️ Educational Disclaimer
CLINICO 360 is an educational tool. It does **not** provide autonomous medical diagnosis, prescribing or treatment decisions. All patient management decisions require qualified healthcare professional supervision.

---

## Architecture

```
clinico-360/
├── backend/          # FastAPI (Python 3.12)
│   ├── app/
│   │   ├── main.py           # FastAPI app entry point
│   │   ├── config.py         # Settings & environment
│   │   ├── database.py       # SQLAlchemy (SQLite default / PostgreSQL)
│   │   ├── models/           # Database entities
│   │   ├── schemas/          # Pydantic request/response models
│   │   ├── services/         # Business logic
│   │   │   ├── auth_service.py
│   │   │   ├── drug_service.py
│   │   │   ├── interaction_service.py
│   │   │   └── case_service.py    # Core analysis engine
│   │   ├── routes/           # API endpoints
│   │   └── data/             # Seed data (curated from NFI, BNF, clinical references)
│   ├── tests/
│   ├── .env.example
│   └── requirements.txt
├── frontend/         # Next.js 15 + TypeScript + Tailwind CSS
│   ├── app/
│   │   ├── page.tsx           # Landing page
│   │   ├── auth/              # Sign in / Register
│   │   └── (dashboard)/
│   │       ├── dashboard/     # Main dashboard
│   │       ├── drugs/         # Drug library + profiles
│   │       ├── cases/         # Clinical case workspace
│   │       ├── interactions/  # Drug interaction checker
│   │       ├── prescription/  # Prescription analyser
│   │       ├── dosage/        # Dosage intelligence
│   │       └── iv-compat/     # IV compatibility
│   ├── components/
│   │   └── layout/Sidebar.tsx
│   └── lib/api.ts             # API client
└── docker-compose.yml
```

---

## Quick Start (Local Development)

### Backend

```bash
cd backend

# Optional: create virtual environment
python -m venv venv
venv\Scripts\activate   # Windows
source venv/bin/activate # macOS/Linux

# Install dependencies (all already installed in this environment)
pip install fastapi uvicorn sqlalchemy pydantic pydantic-settings python-multipart python-dotenv

# Run (auto-seeds database on first start)
uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/api/docs

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App: http://localhost:3000

---

## Environment Variables

Copy `backend/.env.example` to `backend/.env`:

```env
SECRET_KEY=your-long-random-secret-key
DATABASE_URL=sqlite:///./clinico360.db  # or PostgreSQL URL
GEMINI_API_KEY=                          # optional: AI-enhanced reports
OPENAI_API_KEY=                          # optional alternative
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register user |
| POST | `/api/v1/auth/login` | Login |
| GET | `/api/v1/drugs/search?q=` | Search drugs |
| GET | `/api/v1/drugs/{id}` | Full drug profile |
| GET | `/api/v1/drugs/{id}/adrs` | ADR explorer |
| GET | `/api/v1/drugs/{id}/same-class` | Same-class comparison |
| POST | `/api/v1/drugs/interactions/check` | Drug interaction check |
| POST | `/api/v1/drugs/iv-compatibility/check` | IV compatibility |
| POST | `/api/v1/cases/create` | Create & analyse clinical case |
| GET | `/api/v1/cases/{id}` | Retrieve case + analysis |
| POST | `/api/v1/cases/prescription/analyze` | Prescription text analysis |
| POST | `/api/v1/cases/dosage/query` | Dosage reference query |
| GET | `/api/v1/dashboard/stats` | Dashboard statistics |

Full interactive docs: http://localhost:8000/api/docs

---

## Seed Drug Database

The seed database contains 5 curated pharmacological profiles:
- **Ramipril** (ACE Inhibitor)
- **Losartan** (ARB)
- **Metformin** (Biguanide)
- **Amlodipine** (Dihydropyridine CCB)
- **Furosemide** (Loop Diuretic)

All data sourced from: NFI (National Formulary of India), BNF, UKPDS, HOPE Trial, LIFE Trial, RENAAL Trial, ASCOT, ACCOMPLISH, ESC Guidelines.

---

## Clinical Safety Rules

- System distinguishes reference information from individualised advice
- Shows evidence sources and verification dates
- Explicitly identifies missing information
- Communicates uncertainty with structured labels
- Never silently infers missing values
- Never invents drug indications, dosage values or ADR frequencies
- Unknown IV compatibility is NEVER assumed compatible
- All drug comparisons include disclaimer about prescriber reasoning

---

## Deployment (Vercel)

The frontend deploys to Vercel. The backend should be deployed to Railway, Render, or any FastAPI-compatible host.

Set environment variable in Vercel:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
```

And update `next.config.ts` rewrites destination accordingly.

---

## Known Limitations

- Drug database currently contains 5 reference drugs (expandable)
- OCR image upload requires Tesseract/cloud OCR integration (text input works)
- AI-enhanced report generation requires Gemini or OpenAI API key
- Voice/multilingual support pending Phase 8
- Offline library pending Service Worker implementation

---

## Roadmap

- [ ] Expand drug database (100+ drugs)
- [ ] Image/PDF OCR prescription upload
- [ ] AI Copilot (RAG with Gemini)
- [ ] Visual Pharmacology (interactive body map)
- [ ] Clinical Case Simulator
- [ ] Viva Simulator
- [ ] PostgreSQL + pgvector production database
- [ ] Voice input (Hindi, Telugu, English)
- [ ] Offline PWA support
