'use client'
import { useState } from 'react'
import api from '@/lib/api'

const severityColor = (s: string) => ({ 'Major': '#f97316', 'Contraindicated': '#ef4444', 'Moderate': '#f59e0b', 'Minor': '#22c55e' }[s] || '#94a3b8')

export default function InteractionsPage() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const check = async () => {
    const names = input.split(',').map(s => s.trim()).filter(Boolean)
    if (names.length < 2) { setError('Enter at least 2 drug names, separated by commas.'); return }
    setLoading(true); setError(''); setResult(null)
    try { setResult(await api.drugs.checkInteractions(names)) }
    catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  return (
    <div style={{ padding: '32px 40px', maxWidth: 900 }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, fontFamily: 'Manrope,sans-serif', color: '#f1f5f9', marginBottom: 6 }}>Drug Interaction Checker</h1>
      <p style={{ fontSize: 14, color: '#64748b', marginBottom: 28 }}>Enter multiple drug names separated by commas. Checks drug-drug interactions with severity, mechanism and clinical management.</p>

      <div style={{ background: 'rgba(10,22,40,0.85)', border: '1px solid rgba(30,66,120,0.3)', borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Drug Names (comma-separated)</label>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && check()}
          placeholder="e.g. Ramipril, Spironolactone, Furosemide"
          style={{ width: '100%', background: 'rgba(5,10,20,0.8)', border: '1px solid rgba(30,66,120,0.5)', borderRadius: 8, padding: '12px 16px', fontSize: 14, color: '#f1f5f9', outline: 'none', marginBottom: 16 }} />
        {error && <div style={{ marginBottom: 12, fontSize: 13, color: '#fca5a5', padding: '8px 12px', background: 'rgba(239,68,68,0.1)', borderRadius: 6 }}>⚠️ {error}</div>}
        <button onClick={check} disabled={loading} style={{ padding: '12px 28px', background: '#22d3ee', borderRadius: 8, border: 'none', color: '#060d1f', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
          {loading ? 'Checking…' : 'Check Interactions'}
        </button>
        <p style={{ fontSize: 11, color: '#334155', marginTop: 10 }}>Try: Ramipril, Spironolactone · Metformin, Furosemide · Ramipril, Losartan</p>
      </div>

      {result && (
        <div>
          <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
            <div style={{ padding: '12px 20px', background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(30,66,120,0.3)', borderRadius: 10 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: result.total_interactions_found > 0 ? '#f97316' : '#22c55e' }}>{result.total_interactions_found}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>Interactions found</div>
            </div>
            <div style={{ padding: '12px 20px', background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(30,66,120,0.3)', borderRadius: 10 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>{result.drugs_checked?.join(', ')}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>Drugs checked</div>
            </div>
          </div>

          {result.total_interactions_found === 0 ? (
            <div style={{ padding: '20px', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 10, fontSize: 14, color: '#86efac' }}>
              ✓ No interactions found in current database for these drugs.<br />
              <span style={{ fontSize: 12, color: '#475569', display: 'block', marginTop: 6 }}>Note: absence does not confirm no interaction exists. Consult clinical pharmacist for a comprehensive review.</span>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 14 }}>
              {result.interactions.map((i: any, idx: number) => (
                <div key={idx} style={{ background: 'rgba(10,22,40,0.85)', border: `1px solid ${severityColor(i.severity)}30`, borderLeft: `4px solid ${severityColor(i.severity)}`, borderRadius: 10, padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: '#f1f5f9' }}>{i.drug_a} ↔ {i.drug_b}</h3>
                    <span style={{ fontSize: 12, color: severityColor(i.severity), background: `${severityColor(i.severity)}15`, padding: '4px 12px', borderRadius: 20, border: `1px solid ${severityColor(i.severity)}30`, whiteSpace: 'nowrap' }}>{i.severity}</span>
                  </div>
                  <div style={{ display: 'grid', gap: 8 }}>
                    <Row label="Interaction Type" value={i.interaction_type === 'PK' ? 'Pharmacokinetic (PK)' : i.interaction_type === 'PD' ? 'Pharmacodynamic (PD)' : i.interaction_type} />
                    <Row label="Mechanism" value={i.mechanism} />
                    <Row label="Clinical Effect" value={i.clinical_effect} />
                    <Row label="Management" value={i.management} />
                    <Row label="Evidence Source" value={i.evidence_source} small />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: 20, padding: '12px 16px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 8 }}>
            <p style={{ fontSize: 11, color: '#78716c' }}>{result.disclaimer}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function Row({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div>
      <span style={{ fontSize: 11, color: '#475569', textTransform: 'uppercase', letterSpacing: 1 }}>{label}: </span>
      <span style={{ fontSize: small ? 11 : 13, color: small ? '#334155' : '#94a3b8' }}>{value}</span>
    </div>
  )
}
