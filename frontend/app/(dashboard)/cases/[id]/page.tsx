'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import api from '@/lib/api'

export default function CaseDetailPage() {
  const { id } = useParams() as { id: string }
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    api.cases.get(parseInt(id)).then(setData).catch(() => {}).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div style={{ padding: 40, color: '#64748b' }}>Loading case…</div>
  if (!data) return <div style={{ padding: 40, color: '#ef4444' }}>Case not found.</div>

  const { case: c, analysis } = data

  return (
    <div style={{ padding: '32px 40px', maxWidth: 960 }}>
      <button onClick={() => router.back()} style={{ fontSize: 13, color: '#22d3ee', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 20 }}>← Back</button>
      <h1 style={{ fontSize: 24, fontWeight: 800, fontFamily: 'Manrope,sans-serif', color: '#f1f5f9', marginBottom: 4 }}>{c.title}</h1>
      <div style={{ fontSize: 12, color: '#475569', marginBottom: 24 }}>Case #{c.id} · {c.specialty} · {c.created_at?.slice(0,10)}</div>

      {/* Patient Info */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 10, marginBottom: 24 }}>
        {[['Age', c.patient_age], ['Gender', c.patient_gender], ['Renal Status', c.renal_status]].filter(([,v])=>v).map(([k,v]) => (
          <div key={k as string} style={{ background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(30,66,120,0.25)', borderRadius: 8, padding: '10px 12px' }}>
            <div style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase' }}>{k}</div>
            <div style={{ fontSize: 13, color: '#e2e8f0', marginTop: 2 }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Narrative */}
      <div style={{ background: 'rgba(10,22,40,0.85)', border: '1px solid rgba(30,66,120,0.3)', borderRadius: 12, padding: 20, marginBottom: 20 }}>
        <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Case Narrative</div>
        <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{c.free_text_narrative}</p>
      </div>

      {analysis ? (
        <div style={{ padding: '12px 16px', background: 'rgba(34,211,238,0.06)', border: '1px solid rgba(34,211,238,0.2)', borderRadius: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#22d3ee', marginBottom: 6 }}>Analysis Summary</div>
          <p style={{ fontSize: 13, color: '#94a3b8' }}>{analysis.section_1_summary}</p>
          <div style={{ marginTop: 10, fontSize: 12, color: '#475569' }}>
            Drugs identified: {analysis.section_4_identified_medications?.length ?? 0} · 
            Interactions: {analysis.section_8_interactions?.length ?? 0} · 
            ADR findings: {analysis.section_7_adr_analysis?.length ?? 0}
          </div>
        </div>
      ) : (
        <div style={{ padding: 20, color: '#475569', fontSize: 13 }}>No analysis available for this case.</div>
      )}
    </div>
  )
}
