'use client'
import { useState } from 'react'
import api from '@/lib/api'

const statusConfig: Record<string, { label: string, color: string, bg: string, border: string }> = {
  Compatible:   { label: '✅ Compatible',   color: '#22c55e', bg: 'rgba(34,197,94,0.08)',   border: 'rgba(34,197,94,0.3)' },
  Conditional:  { label: '⚠️ Conditional',  color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.3)' },
  Incompatible: { label: '⛔ Incompatible', color: '#ef4444', bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.3)' },
  Unknown:      { label: '❓ Unknown',      color: '#94a3b8', bg: 'rgba(148,163,184,0.08)', border: 'rgba(148,163,184,0.3)' },
}

export default function IVCompatPage() {
  const [drugA, setDrugA] = useState('')
  const [drugB, setDrugB] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const check = async () => {
    if (!drugA.trim() || !drugB.trim()) { setError('Enter both drug names.'); return }
    setLoading(true); setError(''); setResult(null)
    try { setResult(await api.drugs.ivCompat(drugA, drugB)) }
    catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  const cfg = result ? (statusConfig[result.status] || statusConfig.Unknown) : null

  return (
    <div style={{ padding: '32px 40px', maxWidth: 860 }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, fontFamily: 'Manrope,sans-serif', color: '#f1f5f9', marginBottom: 6 }}>IV Compatibility</h1>
      <p style={{ fontSize: 14, color: '#64748b', marginBottom: 16 }}>Check physical and chemical compatibility of IV medications. Unknown compatibility is NEVER assumed to be compatible.</p>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 28, flexWrap: 'wrap' }}>
        {Object.values(statusConfig).map(c => (
          <span key={c.label} style={{ fontSize: 11, color: c.color, background: c.bg, border: `1px solid ${c.border}`, borderRadius: 20, padding: '4px 12px' }}>{c.label}</span>
        ))}
      </div>

      <div style={{ background: 'rgba(10,22,40,0.85)', border: '1px solid rgba(30,66,120,0.3)', borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Drug A</label>
            <input value={drugA} onChange={e => setDrugA(e.target.value)} placeholder="e.g. Furosemide"
              style={{ width: '100%', background: 'rgba(5,10,20,0.8)', border: '1px solid rgba(30,66,120,0.5)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#f1f5f9', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Drug B</label>
            <input value={drugB} onChange={e => setDrugB(e.target.value)} placeholder="e.g. Gentamicin"
              style={{ width: '100%', background: 'rgba(5,10,20,0.8)', border: '1px solid rgba(30,66,120,0.5)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#f1f5f9', outline: 'none' }} />
          </div>
        </div>
        {error && <div style={{ marginBottom: 12, fontSize: 13, color: '#fca5a5', padding: '8px 12px', background: 'rgba(239,68,68,0.1)', borderRadius: 6 }}>⚠️ {error}</div>}
        <button onClick={check} disabled={loading} style={{ padding: '12px 28px', background: '#22d3ee', borderRadius: 8, border: 'none', color: '#060d1f', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
          {loading ? 'Checking…' : '💉 Check Compatibility'}
        </button>
        <p style={{ fontSize: 11, color: '#334155', marginTop: 10 }}>Try: Furosemide + Gentamicin · Furosemide + Morphine · Morphine + Ondansetron</p>
      </div>

      {result && cfg && (
        <div style={{ background: cfg.bg, border: `2px solid ${cfg.border}`, borderRadius: 12, padding: 24 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: cfg.color, marginBottom: 8 }}>{cfg.label}</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#f1f5f9', marginBottom: 16 }}>{result.drug_a} + {result.drug_b}</div>

          {result.diluent && result.diluent !== 'N/A (diluent itself)' && (
            <Row label="Diluent" value={result.diluent} />
          )}
          {result.physical_compatibility && <Row label="Physical Compatibility" value={result.physical_compatibility} />}
          {result.chemical_compatibility && <Row label="Chemical Compatibility" value={result.chemical_compatibility} />}
          {result.notes && (
            <div style={{ padding: '12px 14px', background: 'rgba(10,22,40,0.5)', borderRadius: 8, margin: '12px 0' }}>
              <div style={{ fontSize: 11, color: '#475569', marginBottom: 4 }}>Notes</div>
              <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>{result.notes}</p>
            </div>
          )}
          {result.source && <Row label="Source" value={result.source} />}
          {result.message && <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 12, lineHeight: 1.6 }}>{result.message}</p>}

          <div style={{ marginTop: 16, padding: '12px 14px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8 }}>
            <p style={{ fontSize: 11, color: '#78716c', lineHeight: 1.6 }}>{result.critical_warning}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: '1px solid rgba(30,66,120,0.15)' }}>
      <span style={{ fontSize: 11, color: '#475569', textTransform: 'uppercase', letterSpacing: 1, minWidth: 160 }}>{label}</span>
      <span style={{ fontSize: 13, color: '#94a3b8' }}>{value}</span>
    </div>
  )
}
