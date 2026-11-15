'use client'
import { useState } from 'react'
import api from '@/lib/api'
import Link from 'next/link'

const SPECIALTIES = ['Internal Medicine','Cardiology','Nephrology','Endocrinology','Respiratory Medicine','Neurology','Gastroenterology','Infectious Diseases','Psychiatry','Pediatrics','Obstetrics & Gynaecology','Emergency Medicine','Critical Care','Surgery','Geriatrics','Dermatology','Other']

const severityColor = (s: string) => ({ 'Major': '#f97316', 'Contraindicated': '#ef4444', 'Moderate': '#f59e0b', 'Life-Threatening': '#ef4444' }[s] || '#94a3b8')

export default function CasesPage() {
  const [form, setForm] = useState({
    title: '', specialty: 'Internal Medicine', patient_age: '', patient_gender: '',
    comorbidities: '', allergies: '', renal_status: '', hepatic_status: '',
    free_text_narrative: '', current_medications: ''
  })
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async () => {
    if (!form.free_text_narrative.trim()) { setError('Please enter a clinical case narrative.'); return }
    if (!form.title.trim()) { setError('Please enter a case title.'); return }
    setLoading(true); setError(''); setResult(null)
    try {
      const payload = {
        title: form.title,
        specialty: form.specialty,
        patient_age: form.patient_age ? parseInt(form.patient_age) : null,
        patient_gender: form.patient_gender || null,
        comorbidities: form.comorbidities.split(',').map(s=>s.trim()).filter(Boolean),
        allergies: form.allergies.split(',').map(s=>s.trim()).filter(Boolean),
        renal_status: form.renal_status || null,
        hepatic_status: form.hepatic_status || null,
        free_text_narrative: form.free_text_narrative,
        current_medications: form.current_medications.split('\n').map(s=>s.trim()).filter(Boolean).map(s=>({name: s}))
      }
      const r = await api.cases.create(payload)
      setResult(r)
    } catch(e: any) { setError(e.message || 'Analysis failed. Is the backend running?') }
    finally { setLoading(false) }
  }

  const inp = (label: string, field: keyof typeof form, placeholder: string, type='text') => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</label>
      <input type={type} value={form[field]} onChange={e=>setForm(f=>({...f,[field]:e.target.value}))}
        placeholder={placeholder}
        style={{ width: '100%', background: 'rgba(10,22,40,0.9)', border: '1px solid rgba(30,66,120,0.5)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#f1f5f9', outline: 'none' }} />
    </div>
  )

  const report = result?.report

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1000 }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, fontFamily: 'Manrope,sans-serif', color: '#f1f5f9', marginBottom: 6 }}>Clinical Case Workspace</h1>
      <p style={{ fontSize: 14, color: '#64748b', marginBottom: 28 }}>Enter any clinical case in free text. The engine will identify medications, analyse interactions, ADRs, dosage considerations and generate an educational report.</p>

      {!result ? (
        <div style={{ background: 'rgba(10,22,40,0.85)', border: '1px solid rgba(30,66,120,0.3)', borderRadius: 12, padding: '28px' }}>
          {inp('Case Title', 'title', 'e.g. CKD patient on multiple antihypertensives')}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Specialty</label>
            <select value={form.specialty} onChange={e=>setForm(f=>({...f,specialty:e.target.value}))}
              style={{ width: '100%', background: 'rgba(10,22,40,0.9)', border: '1px solid rgba(30,66,120,0.5)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#f1f5f9', outline: 'none' }}>
              {SPECIALTIES.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>{inp('Patient Age (optional)', 'patient_age', 'e.g. 58', 'number')}</div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Gender (optional)</label>
              <select value={form.patient_gender} onChange={e=>setForm(f=>({...f,patient_gender:e.target.value}))}
                style={{ width: '100%', background: 'rgba(10,22,40,0.9)', border: '1px solid rgba(30,66,120,0.5)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#f1f5f9', outline: 'none' }}>
                <option value=''>Not specified</option><option value='Male'>Male</option><option value='Female'>Female</option><option value='Other'>Other</option>
              </select>
            </div>
          </div>

          {inp('Comorbidities (comma-separated, optional)', 'comorbidities', 'e.g. Hypertension, Type 2 Diabetes, CKD Stage 3b')}
          {inp('Allergies (comma-separated, optional)', 'allergies', 'e.g. Penicillin, Sulfonamides')}
          {inp('Renal Status (optional)', 'renal_status', 'e.g. eGFR 38 mL/min/1.73m² (CKD Stage 3b)')}
          {inp('Hepatic Status (optional)', 'hepatic_status', 'e.g. Child-Pugh A, ALT 2x ULN')}

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Current Medications (one per line, optional)</label>
            <textarea value={form.current_medications} onChange={e=>setForm(f=>({...f,current_medications:e.target.value}))}
              placeholder={'Ramipril 5mg OD\nFurosemide 40mg BD\nMetformin 500mg TDS'}
              rows={4}
              style={{ width: '100%', background: 'rgba(10,22,40,0.9)', border: '1px solid rgba(30,66,120,0.5)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#f1f5f9', outline: 'none', resize: 'vertical' }} />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Clinical Case Narrative <span style={{ color: '#ef4444' }}>*</span></label>
            <textarea value={form.free_text_narrative} onChange={e=>setForm(f=>({...f,free_text_narrative:e.target.value}))}
              placeholder={'Enter the case in your own words. Example:\n\n58-year-old male with hypertension, type 2 diabetes and CKD Stage 3b (eGFR 38) presents with bilateral ankle swelling and poorly controlled BP (162/96). Currently on Ramipril 5mg OD, Furosemide 40mg BD and Metformin 500mg TDS. Recent potassium 5.1 mEq/L. Analyse the medication choices, possible interactions, dosage considerations and alternative drugs.'}
              rows={8}
              style={{ width: '100%', background: 'rgba(10,22,40,0.9)', border: '1px solid rgba(30,66,120,0.5)', borderRadius: 8, padding: '12px 14px', fontSize: 13, color: '#f1f5f9', outline: 'none', resize: 'vertical', lineHeight: 1.6 }} />
          </div>

          {error && <div style={{ marginBottom: 16, padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, fontSize: 13, color: '#fca5a5' }}>⚠️ {error}</div>}
          <button onClick={submit} disabled={loading} style={{ width: '100%', padding: '14px', background: loading ? '#1e4278' : '#22d3ee', borderRadius: 10, border: 'none', color: '#060d1f', fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Analysing Case…' : '🩺 Analyse Clinical Case'}
          </button>
          <p style={{ fontSize: 11, color: '#334155', marginTop: 10, textAlign: 'center' }}>Analysis uses evidence-based deterministic rules. AI enhancement available when API key is configured.</p>
        </div>
      ) : (
        <CaseReport report={report} caseId={result.case_id} onReset={() => { setResult(null); setForm({ title:'', specialty:'Internal Medicine', patient_age:'', patient_gender:'', comorbidities:'', allergies:'', renal_status:'', hepatic_status:'', free_text_narrative:'', current_medications:'' }) }} />
      )}
    </div>
  )
}

function CaseReport({ report, caseId, onReset }: { report: any, caseId: number, onReset: () => void }) {
  const Section = ({ title, children, accent='#22d3ee' }: any) => {
    const [open, setOpen] = useState(true)
    return (
      <div style={{ background: 'rgba(10,22,40,0.85)', border: '1px solid rgba(30,66,120,0.3)', borderRadius: 12, marginBottom: 14, overflow: 'hidden' }}>
        <button onClick={() => setOpen(!open)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '14px 20px', background: 'none', border: 'none', cursor: 'pointer', color: '#e2e8f0', fontSize: 14, fontWeight: 600 }}>
          {title} <span style={{ color: '#475569' }}>{open ? '▲' : '▼'}</span>
        </button>
        {open && <div style={{ padding: '0 20px 18px', borderTop: '1px solid rgba(30,66,120,0.2)' }}>{children}</div>}
      </div>
    )
  }

  const severityCol = (s: string) => ({ 'Major': '#f97316', 'Contraindicated': '#ef4444', 'Major — Contraindication Alert': '#ef4444', 'Serious': '#f97316', 'Life-Threatening': '#ef4444', 'Moderate': '#f59e0b', 'Common': '#22c55e' }[s] || '#94a3b8')

  return (
    <div>
      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, fontFamily: 'Manrope,sans-serif', color: '#f1f5f9' }}>Case Analysis Report</h2>
          <div style={{ fontSize: 12, color: '#475569' }}>Case ID #{caseId} · Educational Reference Only</div>
        </div>
        <button onClick={onReset} style={{ padding: '8px 20px', border: '1px solid rgba(34,211,238,0.3)', borderRadius: 8, color: '#22d3ee', background: 'none', cursor: 'pointer', fontSize: 13 }}>
          + New Case
        </button>
      </div>

      {/* Summary */}
      <div style={{ padding: '16px 20px', background: 'rgba(34,211,238,0.06)', border: '1px solid rgba(34,211,238,0.2)', borderRadius: 10, marginBottom: 20 }}>
        <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6 }}>{report?.section_1_summary}</p>
      </div>

      {/* Critical alerts */}
      {(report?.section_19_safety_alerts?.critical || []).length > 0 && (
        <div style={{ padding: '16px 20px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#ef4444', marginBottom: 10 }}>⛔ CRITICAL ALERTS</div>
          {report.section_19_safety_alerts.critical.map((a: any, i: number) => (
            <div key={i} style={{ fontSize: 13, color: '#fca5a5', marginBottom: 6 }}>• <strong>{a.drug}</strong>: {a.detail}</div>
          ))}
        </div>
      )}

      <Section title="💊 Identified Medications">
        {(report?.section_4_identified_medications || []).length === 0
          ? <p style={{ fontSize: 13, color: '#475569', paddingTop: 10 }}>No medications from the CLINICO 360 database were identified in this case. Try including specific drug names (e.g. Ramipril, Metformin).</p>
          : (report.section_4_identified_medications.map((m: any) => (
            <div key={m.generic_name} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(30,66,120,0.15)' }}>
              <div>
                <span style={{ fontSize: 14, fontWeight: 500, color: '#e2e8f0' }}>{m.generic_name}</span>
                <span style={{ fontSize: 11, color: '#64748b', marginLeft: 10 }}>{m.class}</span>
              </div>
              <Link href={`/drugs/${m.generic_name}`} style={{ fontSize: 12, color: '#22d3ee', textDecoration: 'none' }}>View profile →</Link>
            </div>
          )))
        }
      </Section>

      <Section title="⚡ Drug Interactions">
        {(report?.section_8_interactions || []).length === 0
          ? <p style={{ fontSize: 13, color: '#22c55e', paddingTop: 10 }}>✓ No interactions identified between detected drugs. Note: absence does not confirm safety — full medication list not available.</p>
          : report.section_8_interactions.map((i: any, idx: number) => (
            <div key={idx} style={{ padding: '12px', background: `${severityCol(i.severity)}08`, border: `1px solid ${severityCol(i.severity)}25`, borderLeft: `3px solid ${severityCol(i.severity)}`, borderRadius: 8, marginTop: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>{i.drug_a} ↔ {i.drug_b}</span>
                <span style={{ fontSize: 11, color: severityCol(i.severity), background: `${severityCol(i.severity)}15`, padding: '2px 8px', borderRadius: 20 }}>{i.severity}</span>
              </div>
              <p style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}><strong style={{ color: '#94a3b8' }}>Mechanism:</strong> {i.mechanism}</p>
              <p style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}><strong style={{ color: '#94a3b8' }}>Effect:</strong> {i.clinical_effect}</p>
              <p style={{ fontSize: 12, color: '#64748b' }}><strong style={{ color: '#94a3b8' }}>Management:</strong> {i.management}</p>
              <p style={{ fontSize: 11, color: '#334155', marginTop: 4 }}>Source: {i.evidence_source}</p>
            </div>
          ))
        }
      </Section>

      <Section title="🔬 ADR Analysis (Case-Specific)">
        {(report?.section_7_adr_analysis || []).length === 0
          ? <p style={{ fontSize: 13, color: '#475569', paddingTop: 10 }}>No ADR data available for identified medications.</p>
          : report.section_7_adr_analysis.slice(0, 8).map((a: any, i: number) => (
            <div key={i} style={{ padding: '10px', borderBottom: '1px solid rgba(30,66,120,0.15)', marginTop: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: '#e2e8f0' }}>{a.drug}: {a.adr}</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span style={{ fontSize: 11, color: severityCol(a.severity), background: `${severityCol(a.severity)}15`, padding: '2px 8px', borderRadius: 20 }}>{a.severity}</span>
                  {a.frequency !== 'Not documented' && <span style={{ fontSize: 11, color: '#94a3b8', background: 'rgba(148,163,184,0.1)', padding: '2px 8px', borderRadius: 20 }}>{a.frequency}</span>}
                </div>
              </div>
              {a.case_specific_reasoning.length > 0 && (
                <div style={{ padding: '6px 10px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 6, marginTop: 6 }}>
                  <div style={{ fontSize: 11, color: '#f59e0b', marginBottom: 2 }}>⚠️ Case-specific elevated risk:</div>
                  {a.case_specific_reasoning.map((r: string, ri: number) => <div key={ri} style={{ fontSize: 11, color: '#d97706' }}>• {r}</div>)}
                </div>
              )}
              {a.management && <p style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>Management: {a.management}</p>}
            </div>
          ))
        }
      </Section>

      <Section title="🫘 Renal & Hepatic Considerations">
        {(report?.section_10_renal || []).length === 0 && (report?.section_11_hepatic || []).length === 0
          ? <p style={{ fontSize: 13, color: '#475569', paddingTop: 10 }}>No specific renal/hepatic concerns flagged with current data.</p>
          : <>
            {(report?.section_10_renal || []).map((r: any, i: number) => (
              <div key={i} style={{ padding: '10px 12px', background: 'rgba(34,211,238,0.06)', border: '1px solid rgba(34,211,238,0.15)', borderRadius: 8, marginTop: 10 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#22d3ee', marginBottom: 4 }}>{r.drug} — Renal Consideration</div>
                <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>{r.detail}</p>
              </div>
            ))}
          </>
        }
      </Section>

      <Section title="🔄 Same-Class Comparisons & Why This Drug?">
        {Object.keys(report?.section_14_same_class_comparisons || {}).length === 0
          ? <p style={{ fontSize: 13, color: '#475569', paddingTop: 10 }}>No same-class alternatives found in current database for detected medications.</p>
          : Object.entries(report.section_14_same_class_comparisons).map(([drug, comp]: any) => (
            <div key={drug} style={{ marginTop: 12, padding: '14px', background: 'rgba(5,10,20,0.6)', border: '1px solid rgba(30,66,120,0.3)', borderRadius: 10 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0', marginBottom: 4 }}>{drug}</div>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 10 }}>Alternatives: {comp.alternatives?.join(', ')}</div>
              <div style={{ fontSize: 11, color: '#f59e0b', padding: '6px 10px', background: 'rgba(245,158,11,0.08)', borderRadius: 6 }}>
                {comp.disclaimer}
              </div>
              <Link href={`/drugs`} style={{ display: 'inline-block', marginTop: 10, fontSize: 12, color: '#22d3ee', textDecoration: 'none' }}>
                View full drug comparison →
              </Link>
            </div>
          ))
        }
      </Section>

      <Section title="📋 Missing Information">
        {(report?.section_16_missing_information || []).length === 0
          ? <p style={{ fontSize: 13, color: '#22c55e', paddingTop: 10 }}>✓ All key data points provided.</p>
          : <ul style={{ margin: 0, padding: '12px 0 0 20px' }}>
            {report.section_16_missing_information.map((m: string, i: number) => (
              <li key={i} style={{ fontSize: 13, color: '#f59e0b', marginBottom: 6 }}>{m}</li>
            ))}
          </ul>
        }
      </Section>

      <Section title="🔍 Uncertainty & Limitations">
        <div style={{ padding: '12px', background: 'rgba(148,163,184,0.06)', border: '1px solid rgba(148,163,184,0.15)', borderRadius: 8, marginTop: 10 }}>
          <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, marginBottom: 4 }}>Evidence Label: <span style={{ color: '#f59e0b' }}>{report?.section_17_uncertainty?.label}</span></div>
          <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.6 }}>{report?.section_17_uncertainty?.explanation}</p>
        </div>
      </Section>

      {/* Disclaimer */}
      <div style={{ marginTop: 20, padding: '14px 18px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 8 }}>
        <p style={{ fontSize: 11, color: '#78716c', lineHeight: 1.6 }}>{report?.section_20_educational_disclaimer}</p>
      </div>
    </div>
  )
}
