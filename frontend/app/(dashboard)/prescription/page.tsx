'use client'
import { useState } from 'react'
import api from '@/lib/api'

export default function PrescriptionPage() {
  const [text, setText] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const analyse = async () => {
    if (!text.trim()) { setError('Enter prescription text to analyse.'); return }
    setLoading(true); setError(''); setResult(null)
    try { setResult(await api.cases.analyzeRx(text)) }
    catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  const confColor = (c: string) => c?.includes('High') ? '#22c55e' : c?.includes('Medium') ? '#f59e0b' : '#94a3b8'

  return (
    <div style={{ padding: '32px 40px', maxWidth: 900 }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, fontFamily: 'Manrope,sans-serif', color: '#f1f5f9', marginBottom: 6 }}>Prescription Analyser</h1>
      <p style={{ fontSize: 14, color: '#64748b', marginBottom: 28 }}>Enter prescription text. The system extracts medications, matches them against the drug database, and generates medication cards for human verification.</p>

      <div style={{ background: 'rgba(10,22,40,0.85)', border: '1px solid rgba(30,66,120,0.3)', borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Prescription Text</label>
        <textarea value={text} onChange={e => setText(e.target.value)}
          placeholder={'Paste or type prescription here. Example:\n\nRx\nRamipril 5 mg — OD\nFurosemide 40 mg — BD\nMetformin 500 mg — TDS with meals\nAmlodipine 5 mg — OD'}
          rows={8}
          style={{ width: '100%', background: 'rgba(5,10,20,0.8)', border: '1px solid rgba(30,66,120,0.5)', borderRadius: 8, padding: '12px 14px', fontSize: 13, color: '#f1f5f9', outline: 'none', resize: 'vertical', marginBottom: 16, lineHeight: 1.6 }} />

        <div style={{ padding: '10px 14px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 8, marginBottom: 16 }}>
          <p style={{ fontSize: 12, color: '#d97706' }}>⚠️ Human verification required. All extracted medications must be confirmed against the original prescription before clinical use. Never act on unverified extracted data.</p>
        </div>

        {error && <div style={{ marginBottom: 12, fontSize: 13, color: '#fca5a5', padding: '8px 12px', background: 'rgba(239,68,68,0.1)', borderRadius: 6 }}>⚠️ {error}</div>}
        <button onClick={analyse} disabled={loading} style={{ padding: '12px 28px', background: '#22d3ee', borderRadius: 8, border: 'none', color: '#060d1f', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
          {loading ? 'Analysing…' : '📋 Analyse Prescription'}
        </button>
      </div>

      {result && (
        <div>
          <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
            <StatCard label="Drugs Identified" value={result.drugs_identified} color='#22d3ee' />
            <StatCard label="Verification Status" value="Pending Review" color='#f59e0b' />
          </div>

          {result.drugs_identified === 0 && (
            <div style={{ padding: 20, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, fontSize: 14, color: '#fca5a5', marginBottom: 16 }}>
              No drugs from the CLINICO 360 database were found in this prescription text. Try including specific generic names (e.g. Ramipril, Metformin, Furosemide, Amlodipine, Losartan).
            </div>
          )}

          <h2 style={{ fontSize: 15, fontWeight: 600, color: '#94a3b8', marginBottom: 14 }}>MEDICATION CARDS — VERIFY BEFORE CLINICAL USE</h2>
          <div style={{ display: 'grid', gap: 14 }}>
            {(result.medication_cards || []).map((card: any, i: number) => (
              <div key={i} style={{ background: 'rgba(10,22,40,0.85)', border: '1px solid rgba(34,211,238,0.2)', borderRadius: 12, padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>{card.generic_name}</h3>
                    <div style={{ fontSize: 12, color: '#475569', marginBottom: 6 }}>Brands: {(card.brand_names || []).join(', ')}</div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <Pill text={card.class} /><Pill text={card.category} color='#2b90d9' />
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color: confColor(card.confidence), background: `${confColor(card.confidence)}15`, padding: '4px 12px', borderRadius: 20, marginBottom: 8 }}>
                      {card.confidence}
                    </div>
                    <a href={`/drugs/${card.drug_id}`} style={{ fontSize: 12, color: '#22d3ee', textDecoration: 'none' }}>Full Profile →</a>
                  </div>
                </div>
                <div style={{ marginTop: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {(card.strengths || []).map((s: string) => (
                    <span key={s} style={{ fontSize: 11, color: '#93c5fd', background: 'rgba(43,144,217,0.1)', border: '1px solid rgba(43,144,217,0.2)', borderRadius: 20, padding: '2px 8px' }}>{s}</span>
                  ))}
                </div>
                <p style={{ fontSize: 12, color: '#475569', marginTop: 10, lineHeight: 1.5 }}>{card.moa_simple?.slice(0, 160)}…</p>
                {card.verification_required && (
                  <div style={{ marginTop: 10, padding: '6px 10px', background: 'rgba(245,158,11,0.08)', borderRadius: 6, fontSize: 11, color: '#d97706' }}>⚠️ Manual verification required against original prescription</div>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20, padding: '12px 16px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8 }}>
            <p style={{ fontSize: 11, color: '#78716c' }}>{result.disclaimer}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, color }: any) {
  return (
    <div style={{ padding: '14px 20px', background: 'rgba(10,22,40,0.8)', border: `1px solid ${color}20`, borderRadius: 10 }}>
      <div style={{ fontSize: 24, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 12, color: '#64748b' }}>{label}</div>
    </div>
  )
}

function Pill({ text, color = '#22d3ee' }: { text: string, color?: string }) {
  return <span style={{ fontSize: 11, color, background: `${color}10`, border: `1px solid ${color}25`, borderRadius: 20, padding: '2px 8px' }}>{text}</span>
}
