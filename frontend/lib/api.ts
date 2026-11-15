// API client for CLINICO 360 backend with resilient local fallback for Vercel/offline demo
import { SEED_DRUGS, SEED_INTERACTIONS, SEED_IV_COMPATIBILITY } from './clinicalData'

const getBaseUrl = () => {
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) {
    return `${process.env.NEXT_PUBLIC_API_URL}/api/v1`
  }
  return '/api/v1'
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const BASE = getBaseUrl()
  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      ...options,
    })
    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`)
    }
    return await res.json()
  } catch (err) {
    // Graceful fallback to embedded clinical engine
    return handleFallback<T>(path, options)
  }
}

// Local mock cases store for demonstration
let localCases: any[] = [
  {
    id: 1,
    title: 'Hypertension, T2DM, CKD Stage 3b on multiple agents',
    specialty: 'Internal Medicine',
    patient_age: 58,
    patient_gender: 'Male',
    comorbidities: ['Hypertension', 'Type 2 Diabetes', 'CKD Stage 3b'],
    renal_status: 'eGFR 38 mL/min/1.73m²',
    free_text_narrative: '58yo male with hypertension, type 2 diabetes and CKD Stage 3b presents with bilateral ankle swelling and uncontrolled BP (162/96). Currently on Ramipril 5mg OD, Furosemide 40mg BD, Metformin 500mg TDS. Potassium 5.1 mEq/L.',
    created_at: new Date().toISOString(),
    current_medications: [{ name: 'Ramipril' }, { name: 'Furosemide' }, { name: 'Metformin' }]
  }
]

function handleFallback<T>(path: string, options?: RequestInit): T {
  // Stats
  if (path.includes('/dashboard/stats')) {
    return {
      drugs_in_database: SEED_DRUGS.length,
      clinical_cases: localCases.length,
      prescriptions_analyzed: 12,
      drug_interactions_indexed: SEED_INTERACTIONS.length,
    } as T
  }

  if (path.includes('/dashboard/recent-cases')) {
    return localCases.slice(0, 5) as T
  }

  if (path.includes('/dashboard/recent-drugs')) {
    return SEED_DRUGS.slice(0, 8).map(d => ({
      id: d.id,
      generic_name: d.generic_name,
      pharmacological_class: d.pharmacological_class,
      therapeutic_category: d.therapeutic_category,
    })) as T
  }

  // Drug Search
  if (path.startsWith('/drugs/search')) {
    const url = new URL(`http://localhost${path}`)
    const q = (url.searchParams.get('q') || '').toLowerCase().trim()
    const matches = SEED_DRUGS.filter(d =>
      d.generic_name.toLowerCase().includes(q) ||
      d.brand_names.some(b => b.toLowerCase().includes(q)) ||
      d.pharmacological_class.toLowerCase().includes(q) ||
      d.therapeutic_category.toLowerCase().includes(q)
    )
    return matches as T
  }

  // Drug Profile
  const drugProfileMatch = path.match(/^\/drugs\/(\d+)$/)
  if (drugProfileMatch) {
    const id = parseInt(drugProfileMatch[1])
    const found = SEED_DRUGS.find(d => d.id === id) || SEED_DRUGS[0]
    return found as T
  }

  // Same Class
  const sameClassMatch = path.match(/^\/drugs\/(\d+)\/same-class$/)
  if (sameClassMatch) {
    const id = parseInt(sameClassMatch[1])
    const primary = SEED_DRUGS.find(d => d.id === id) || SEED_DRUGS[0]
    const alts = SEED_DRUGS.filter(d => d.pharmacological_class === primary.pharmacological_class && d.id !== primary.id)
    return {
      primary_drug: primary.generic_name,
      alternatives: alts.map(a => a.generic_name),
      comparison_rows: [
        { factor: 'Pharmacological Class', [primary.generic_name]: primary.pharmacological_class, ...Object.fromEntries(alts.map(a => [a.generic_name, a.pharmacological_class])) },
        { factor: 'Mechanism (Simple)', [primary.generic_name]: primary.moa_simple.slice(0, 100) + '...', ...Object.fromEntries(alts.map(a => [a.generic_name, a.moa_simple.slice(0, 100) + '...'])) },
        { factor: 'Approved Indications', [primary.generic_name]: primary.approved_indications.slice(0, 2).join('; '), ...Object.fromEntries(alts.map(a => [a.generic_name, a.approved_indications.slice(0, 2).join('; ')])) },
        { factor: 'Half-Life', [primary.generic_name]: primary.half_life, ...Object.fromEntries(alts.map(a => [a.generic_name, a.half_life])) },
        { factor: 'Renal Considerations', [primary.generic_name]: primary.renal_considerations?.slice(0, 80) + '...', ...Object.fromEntries(alts.map(a => [a.generic_name, a.renal_considerations?.slice(0, 80) + '...'])) },
      ],
      disclaimer: 'This is a clinical comparison of available pharmacological alternatives. It does not confirm or replicate the original prescriber\'s reasoning.'
    } as T
  }

  // Interactions Check
  if (path.includes('/drugs/interactions/check') && options?.body) {
    const { drug_names } = JSON.parse(options.body as string)
    const lower = (drug_names || []).map((n: string) => n.toLowerCase())
    const found = SEED_INTERACTIONS.filter(i => {
      const a = i.drug_a.toLowerCase()
      const b = i.drug_b.toLowerCase()
      return lower.some((n: string) => n.includes(a) || a.includes(n)) &&
             lower.some((n: string) => n.includes(b) || b.includes(n))
    })
    return {
      drugs_checked: drug_names,
      total_interactions_found: found.length,
      interactions: found,
      disclaimer: 'Interactions shown are based on documented pharmacological evidence. Absence of an interaction record does NOT confirm safety.'
    } as T
  }

  // IV Compatibility
  if (path.includes('/drugs/iv-compatibility/check') && options?.body) {
    const { drug_a, drug_b } = JSON.parse(options.body as string)
    const aLower = (drug_a || '').toLowerCase()
    const bLower = (drug_b || '').toLowerCase()
    const found = SEED_IV_COMPATIBILITY.find(iv =>
      (iv.drug_a.toLowerCase().includes(aLower) && iv.drug_b.toLowerCase().includes(bLower)) ||
      (iv.drug_a.toLowerCase().includes(bLower) && iv.drug_b.toLowerCase().includes(aLower))
    )
    if (found) {
      return { ...found, critical_warning: 'IV compatibility is conditional on specific concentrations, diluent, and administration conditions.' } as T
    }
    return {
      drug_a, drug_b,
      status: 'Unknown',
      status_code: 'grey',
      message: `No IV compatibility data found for ${drug_a} with ${drug_b} in reference database.`,
      critical_warning: 'IMPORTANT: Absence of incompatibility data does NOT imply compatibility. Consult current Trissel\'s or hospital pharmacy.'
    } as T
  }

  // Prescription Analysis
  if (path.includes('/cases/prescription/analyze') && options?.body) {
    const { raw_text } = JSON.parse(options.body as string)
    const textLower = (raw_text || '').toLowerCase()
    const found = SEED_DRUGS.filter(d =>
      textLower.includes(d.generic_name.toLowerCase()) ||
      d.brand_names.some(b => textLower.includes(b.toLowerCase()))
    )
    return {
      prescription_id: 101,
      drugs_identified: found.length,
      medication_cards: found.map(d => ({
        generic_name: d.generic_name,
        brand_names: d.brand_names,
        class: d.pharmacological_class,
        category: d.therapeutic_category,
        strengths: d.available_strengths,
        moa_simple: d.moa_simple,
        confidence: 'High — exact name match',
        verification_required: false,
        drug_id: d.id,
      })),
      verification_status: 'pending_review',
      disclaimer: 'Human verification required before clinical use.'
    } as T
  }

  // Dosage Query
  if (path.includes('/cases/dosage/query') && options?.body) {
    const { drug_name, renal_egfr, age } = JSON.parse(options.body as string)
    const found = SEED_DRUGS.find(d => d.generic_name.toLowerCase() === (drug_name || '').toLowerCase())
    if (!found) {
      return { status: 'not_found', message: `'${drug_name}' not found. Try Ramipril, Metformin, Amlodipine, Furosemide, Losartan.` } as T
    }
    const warnings: string[] = []
    if (renal_egfr !== null && renal_egfr !== undefined && renal_egfr < 30) {
      warnings.push(`eGFR ${renal_egfr} mL/min — CRITICAL: Review renal dosing requirements urgently.`)
    }
    if (!age) {
      warnings.push('Age not provided — age-specific risk stratification requires patient age.')
    }
    return {
      drug: found.generic_name,
      reference_dosage: {
        approved_indications: found.approved_indications,
        available_strengths: found.available_strengths,
        routes: found.routes,
        clinical_considerations: found.clinical_considerations,
        onset: found.onset, peak: found.peak, duration: found.duration,
      },
      renal_considerations: found.renal_considerations,
      hepatic_considerations: found.hepatic_considerations,
      monitoring: found.monitoring_requirements,
      warnings,
      evidence: found.evidence_citations,
      disclaimer: 'This is REFERENCE dosage information only. Patient-specific dosing must be determined by a qualified clinician.'
    } as T
  }

  // Case Create
  if (path.includes('/cases/create') && options?.body) {
    const data = JSON.parse(options.body as string)
    const newId = localCases.length + 1
    const newCase = { ...data, id: newId, created_at: new Date().toISOString() }
    localCases.unshift(newCase)

    const textLower = (data.free_text_narrative || '').toLowerCase()
    const detectedDrugs = SEED_DRUGS.filter(d =>
      textLower.includes(d.generic_name.toLowerCase()) ||
      d.brand_names.some(b => textLower.includes(b.toLowerCase()))
    )
    const drugNames = detectedDrugs.map(d => d.generic_name)
    const interactions = SEED_INTERACTIONS.filter(i =>
      drugNames.includes(i.drug_a) && drugNames.includes(i.drug_b)
    )

    return {
      case_id: newId,
      analysis_id: newId,
      report: {
        section_1_summary: `Case evaluated with ${detectedDrugs.length} identified medication(s) and ${data.comorbidities?.length || 0} entered comorbidity/condition(s). ${interactions.length} interaction(s) detected.`,
        section_4_identified_medications: detectedDrugs.map(d => ({ generic_name: d.generic_name, class: d.pharmacological_class })),
        section_7_adr_analysis: detectedDrugs.flatMap(d => (d.adrs || []).map(a => ({
          drug: d.generic_name,
          adr: a.reaction_name,
          severity: a.severity,
          frequency: a.frequency,
          case_specific_reasoning: data.comorbidities?.includes('CKD') && a.reaction_name.includes('Hyperkalaemia') ? ['CKD impairs potassium excretion, increasing risk'] : [],
          management: a.management
        }))),
        section_8_interactions: interactions,
        section_10_renal: detectedDrugs.filter(d => d.renal_considerations).map(d => ({ drug: d.generic_name, detail: d.renal_considerations })),
        section_14_same_class_comparisons: {},
        section_16_missing_information: [!data.patient_age ? 'Patient age' : null, !data.renal_status ? 'Quantitative eGFR' : null].filter(Boolean),
        section_17_uncertainty: { label: 'Conditional on patient factors', explanation: 'Clinical significance depends on verified laboratory values and individual patient status.' },
        section_19_safety_alerts: {
          critical: interactions.filter(i => i.severity === 'Major').map(i => ({ drug: `${i.drug_a} + ${i.drug_b}`, detail: i.clinical_effect })),
          major: [],
        },
        section_20_educational_disclaimer: 'CLINICO 360 is an educational clinical intelligence platform. All clinical decisions require qualified healthcare professional supervision.'
      }
    } as T
  }

  // Case Get
  const caseGetMatch = path.match(/^\/cases\/(\d+)$/)
  if (caseGetMatch) {
    const id = parseInt(caseGetMatch[1])
    const found = localCases.find(c => c.id === id) || localCases[0]
    return {
      case: found,
      analysis: {
        section_1_summary: `Retrieved case summary for ${found.title}.`,
        section_4_identified_medications: found.current_medications?.map((m: any) => ({ generic_name: m.name || m })),
        section_8_interactions: [],
        section_7_adr_analysis: [],
      }
    } as T
  }

  return {} as T
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    register: (email: string, password: string, full_name: string, role: string) =>
      request('/auth/register', { method: 'POST', body: JSON.stringify({ email, password, full_name, role }) }),
  },
  dashboard: {
    stats: () => request<{ drugs_in_database: number; clinical_cases: number; prescriptions_analyzed: number; drug_interactions_indexed: number }>('/dashboard/stats'),
    recentCases: (limit?: number) => request<any[]>(`/dashboard/recent-cases?limit=${limit ?? 5}`),
    recentDrugs: (limit?: number) => request<any[]>(`/dashboard/recent-drugs?limit=${limit ?? 8}`),
    health: () => request<{ status: string }>('/dashboard/health'),
  },
  drugs: {
    search: (q: string) => request<any[]>(`/drugs/search?q=${encodeURIComponent(q)}`),
    list: (skip = 0, limit = 50) => request<any[]>(`/drugs/list?skip=${skip}&limit=${limit}`),
    profile: (id: number) => request<any>(`/drugs/${id}`),
    adrs: (id: number, organ_system?: string, severity?: string) => {
      const params = new URLSearchParams()
      if (organ_system) params.set('organ_system', organ_system)
      if (severity) params.set('severity', severity)
      return request<any>(`/drugs/${id}/adrs?${params}`)
    },
    sameClass: (id: number) => request<any>(`/drugs/${id}/same-class`),
    checkInteractions: (drug_names: string[]) =>
      request<any>('/drugs/interactions/check', { method: 'POST', body: JSON.stringify({ drug_names }) }),
    ivCompat: (drug_a: string, drug_b: string) =>
      request<any>('/drugs/iv-compatibility/check', { method: 'POST', body: JSON.stringify({ drug_a, drug_b }) }),
  },
  cases: {
    create: (data: any) =>
      request<any>('/cases/create', { method: 'POST', body: JSON.stringify(data) }),
    get: (id: number) => request<any>(`/cases/${id}`),
    list: (skip = 0, limit = 20) => request<any[]>(`/cases/list/all?skip=${skip}&limit=${limit}`),
    analyzeRx: (raw_text: string, source_type = 'text') =>
      request<any>('/cases/prescription/analyze', { method: 'POST', body: JSON.stringify({ raw_text, source_type }) }),
    dosageQuery: (data: any) =>
      request<any>('/cases/dosage/query', { method: 'POST', body: JSON.stringify(data) }),
  },
}

export default api
