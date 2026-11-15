'use client'
import { useState } from 'react'
import api from '@/lib/api'

export default function DosagePage() {
  const [form, setForm] = useState({ drug_name: '', indication: '', age: '', weight_kg: '', renal_egfr: '', comorbidities: '' })
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const query = async () => {
    if (!form.drug_name.trim()) { setError('Drug name required.'); return }
    setLoading(true); setError(''); setResult(null)
    try {
      setResult(await api.cases.dosageQuery({
        drug_name: form.drug_name,
        indication: form.indication || null,
        age: form.age ? parseInt(form.age) : null,
        weight_kg: form.weight_kg ? parseFloat(form.weight_kg) : null,
        renal_egfr: form.renal_egfr ? parseFloat(form.renal_egfr) : null,
        comorbidities: form.comorbidities.split(',').map(s => s.trim()).filter(Boolean)
      }))
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  const inp = (label: string, field: keyof typeof form, placeholder: string, type = 'text') => (
    <div>
      <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</label>
      <input type={type} value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} placeholder={placeholder}
        style={{ width: '100%', background: 'rgba(5,10,20,0.8)', border: '1px solid rgba(30,66,120,0.5)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#f1f5f9', outline: 'none' }} />
    </div>
  )

  return (
    <div style={{ padding: '32px 40px', maxWidth: 860 }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, fontFamily: 'Manrope,sans-serif', color: '#f1f5f9', marginBottom: 6 }}>Dosage Intelligence</h1>
      <p style={{ fontSize: 14, color: '#64748b', marginBottom: 28 }}>Reference dosage information with renal/hepatic adjustment guidance. Patient-specific dosing must be determined by a qualified clinician.</p>

      <div style={{ background: 'rgba(10,22,40,0.85)', border: '1px solid rgba(30,66,120,0.3)', borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          {inp('Drug Name *', 'drug_name', 'e.g. Ramipril, Metformin, Furosemide')}
          {inp('Indication (optional)', 'indication', 'e.g. Hypertension, Heart Failure')}
          {inp('Patient Age (optional)', 'age', '58', 'number')}
          {inp('Weight kg (optional)', 'weight_kg', '70', 'number')}
          {inp('eGFR mL/min (optional)', 'renal_egfr', 'e.g. 38', 'number')}
          {inp('Comorbidities (comma-separated)', 'comorbidities', 'e.g. CKD, Diabetes')}
        </div>
        {error && <div style={{ marginBottom: 12, fontSize: 13, color: '#fca5a5', padding: '8px 12px', background: 'rgba(239,68,68,0.1)', borderRadius: 6 }}>⚠️ {error}</div>}
        <button onClick={query} disabled={loading} style={{ padding: '12px 28px', background: '#22d3ee', borderRadius: 8, border: 'none', color: '#060d1f', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
          {loading ? 'Looking up…' : '⚖️ Get Dosage Reference'}
        </button>
        <p style={{ fontSize: 11, color: '#334155', marginTop: 10 }}>Try: Ramipril, Metformin (with eGFR 38), Furosemide, Amlodipine, Losartan</p>
      </div>

      {result && (
        <div>
          {result.status === 'not_found' ? (
            <div style={{ padding: 20, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, fontSize: 14, color: '#fca5a5' }}>
              {result.message}
            </div>
          ) : (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>{result.drug}</h2>
              {result.indication_requested && <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>Indication: {result.indication_requested}</p>}

              {/* Warnings */}
              {(result.warnings || []).length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  {result.warnings.map((w: string, i: number) => (
                    <div key={i} style={{ padding: '10px 14px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 8, fontSize: 13, color: '#fcd34d', marginBottom: 8 }}>
                      ⚠️ {w}
                    </div>
                  ))}
                </div>
              )}

              {/* Reference Dosage */}
              <div style={{ background: 'rgba(10,22,40,0.85)', border: '1px solid rgba(30,66,120,0.3)', borderRadius: 12, padding: 20, marginBottom: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#94a3b8', marginBottom: 14, textTransform: 'uppercase', letterSpacing: 1 }}>Reference Dosage Information</h3>
                <Row label="Approved Indications" value={(result.reference_dosage?.approved_indications || []).join('; ')} />
                <Row label="Available Strengths" value={(result.reference_dosage?.available_strengths || []).join(', ')} />
                <Row label="Routes" value={(result.reference_dosage?.routes || []).join(', ')} />
                <Row label="Onset" value={result.reference_dosage?.onset} />
                <Row label="Peak" value={result.reference_dosage?.peak} />
                <Row label="Duration" value={result.reference_dosage?.duration} />
                {result.reference_dosage?.clinical_considerations && (
                  <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(34,211,238,0.06)', border: '1px solid rgba(34,211,238,0.15)', borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: '#22d3ee', marginBottom: 4 }}>Clinical Considerations</div>
                    <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{result.reference_dosage.clinical_considerations}</p>
                  </div>
                )}
              </div>

              {result.renal_considerations && (
                <div style={{ padding: '14px 18px', background: 'rgba(34,211,238,0.06)', border: '1px solid rgba(34,211,238,0.2)', borderRadius: 10, marginBottom: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#22d3ee', marginBottom: 6 }}>🫘 Renal Considerations</div>
                  <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{result.renal_considerations}</p>
                </div>
              )}
              {result.hepatic_considerations && (
                <div style={{ padding: '14px 18px', background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 10, marginBottom: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#a78bfa', marginBottom: 6 }}>🏥 Hepatic Considerations</div>
                  <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{result.hepatic_considerations}</p>
                </div>
              )}
              {(result.monitoring || []).length > 0 && (
                <div style={{ padding: '14px 18px', background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(30,66,120,0.3)', borderRadius: 10, marginBottom: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>📊 Monitoring Parameters</div>
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    {result.monitoring.map((m: string, i: number) => <li key={i} style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>{m}</li>)}
                  </ul>
                </div>
              )}
              {(result.evidence || []).length > 0 && (
                <div style={{ padding: '12px 16px', background: 'rgba(10,22,40,0.7)', border: '1px solid rgba(30,66,120,0.2)', borderRadius: 8, marginBottom: 14 }}>
                  <div style={{ fontSize: 11, color: '#475569', marginBottom: 6 }}>Evidence Sources</div>
                  {result.evidence.map((e: any, i: number) => (
                    <div key={i} style={{ fontSize: 11, color: '#334155', marginBottom: 2 }}>{e.source} · {e.publisher} · {e.year}</div>
                  ))}
                </div>
              )}
              <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 8 }}>
                <p style={{ fontSize: 11, color: '#78716c' }}>{result.disclaimer}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function Row({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <div style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: '1px solid rgba(30,66,120,0.15)' }}>
      <span style={{ fontSize: 11, color: '#475569', textTransform: 'uppercase', letterSpacing: 1, minWidth: 140 }}>{label}</span>
      <span style={{ fontSize: 13, color: '#94a3b8', flex: 1 }}>{value}</span>
    </div>
  )
}
