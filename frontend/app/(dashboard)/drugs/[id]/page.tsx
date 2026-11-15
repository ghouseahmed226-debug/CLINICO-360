'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import api from '@/lib/api'

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => {
  const [open, setOpen] = useState(true)
  return (
    <div style={{ background: 'rgba(10,22,40,0.85)', border: '1px solid rgba(30,66,120,0.3)', borderRadius: 12, marginBottom: 16, overflow: 'hidden' }}>
      <button onClick={() => setOpen(!open)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', background: 'none', border: 'none', cursor: 'pointer', color: '#e2e8f0', fontSize: 14, fontWeight: 600 }}>
        {title} <span style={{ color: '#475569' }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && <div style={{ padding: '0 20px 18px', borderTop: '1px solid rgba(30,66,120,0.2)' }}>{children}</div>}
    </div>
  )
}

const Pill = ({ text, color = '#22d3ee' }: { text: string, color?: string }) => (
  <span style={{ display: 'inline-block', fontSize: 11, background: `${color}15`, color, border: `1px solid ${color}30`, borderRadius: 20, padding: '3px 10px', margin: '2px' }}>{text}</span>
)

const severityColor = (s: string) => ({ 'Life-Threatening': '#ef4444', 'Serious': '#f97316', 'Moderate': '#f59e0b', 'Common': '#22c55e' }[s] || '#94a3b8')

export default function DrugProfilePage() {
  const { id } = useParams() as { id: string }
  const [drug, setDrug] = useState<any>(null)
  const [sameClass, setSameClass] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const did = parseInt(id)
    api.drugs.profile(did).then(d => { setDrug(d); setLoading(false) })
    api.drugs.sameClass(did).then(setSameClass).catch(() => {})
  }, [id])

  if (loading) return <div style={{ padding: 40, color: '#64748b' }}>Loading drug profile…</div>
  if (!drug) return <div style={{ padding: 40, color: '#ef4444' }}>Drug not found.</div>

  return (
    <div style={{ padding: '32px 40px', maxWidth: 960 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <Pill text={drug.pharmacological_class} color="#22d3ee" />
          <Pill text={drug.therapeutic_category} color="#2b90d9" />
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 800, fontFamily: 'Manrope,sans-serif', color: '#f1f5f9', marginBottom: 4 }}>{drug.generic_name}</h1>
        <div style={{ fontSize: 13, color: '#475569' }}>Brands: {(drug.brand_names || []).join(' · ')}</div>
        {drug.last_verified && <div style={{ fontSize: 11, color: '#334155', marginTop: 4 }}>Last verified: {drug.last_verified}</div>}
      </div>

      {/* Quick identifiers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10, marginBottom: 24 }}>
        {[
          ['Half-life', drug.half_life], ['Bioavailability', drug.bioavailability], ['Protein Binding', drug.protein_binding],
          ['Onset', drug.onset], ['Peak', drug.peak], ['Duration', drug.duration]
        ].filter(([, v]) => v).map(([k, v]) => (
          <div key={k as string} style={{ background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(30,66,120,0.25)', borderRadius: 8, padding: '10px 12px' }}>
            <div style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: 1 }}>{k}</div>
            <div style={{ fontSize: 13, color: '#e2e8f0', marginTop: 2, fontWeight: 500 }}>{v}</div>
          </div>
        ))}
      </div>

      <Section title="🧬 Mechanism of Action">
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: '#22d3ee', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Simple Explanation</div>
          <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7 }}>{drug.moa_simple}</p>
        </div>
        <div>
          <div style={{ fontSize: 11, color: '#2b90d9', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Advanced Clinical</div>
          <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7 }}>{drug.moa_advanced}</p>
        </div>
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 11, color: '#475569', marginBottom: 6 }}>Molecular Targets</div>
          <div>{(drug.molecular_targets || []).map((t: string) => <Pill key={t} text={t} color="#a78bfa" />)}</div>
        </div>
        {(drug.organ_sites || []).length > 0 && (
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: 11, color: '#475569', marginBottom: 6 }}>Organ Sites of Action</div>
            <div>{drug.organ_sites.map((s: string) => <Pill key={s} text={s} color="#34d399" />)}</div>
          </div>
        )}
      </Section>

      <Section title="✅ Approved Indications">
        <ul style={{ margin: 0, padding: '12px 0 0 20px' }}>
          {(drug.approved_indications || []).map((i: string) => <li key={i} style={{ fontSize: 13, color: '#94a3b8', marginBottom: 4 }}>{i}</li>)}
        </ul>
        {(drug.off_label_indications || []).length > 0 && (
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 11, color: '#f59e0b', marginBottom: 6 }}>Off-label (clearly labelled)</div>
            {drug.off_label_indications.map((i: string) => <Pill key={i} text={i} color="#f59e0b" />)}
          </div>
        )}
      </Section>

      <Section title="⚠️ Adverse Drug Reactions">
        {(drug.adrs || []).length === 0 ? <p style={{ fontSize: 13, color: '#475569' }}>No ADR data loaded.</p> : (
          <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
            {drug.adrs.map((adr: any) => (
              <div key={adr.id} style={{ background: 'rgba(5,10,20,0.6)', border: `1px solid ${severityColor(adr.severity)}25`, borderLeft: `3px solid ${severityColor(adr.severity)}`, borderRadius: 8, padding: '12px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: '#e2e8f0' }}>{adr.reaction_name}</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Pill text={adr.severity} color={severityColor(adr.severity)} />
                    {adr.frequency && <Pill text={adr.frequency} color="#94a3b8" />}
                    {adr.organ_system && <Pill text={adr.organ_system} color="#2b90d9" />}
                  </div>
                </div>
                {adr.mechanism && <p style={{ fontSize: 12, color: '#64748b', marginTop: 6 }}><strong>Mechanism:</strong> {adr.mechanism}</p>}
                {adr.management && <p style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}><strong>Management:</strong> {adr.management}</p>}
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title="🚫 Contraindications">
        <ul style={{ margin: 0, padding: '12px 0 0 20px' }}>
          {(drug.contraindications || []).map((c: string) => <li key={c} style={{ fontSize: 13, color: '#fca5a5', marginBottom: 6 }}>{c}</li>)}
        </ul>
      </Section>

      <Section title="⚙️ Pharmacokinetics">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
          {[['Bioavailability', drug.bioavailability], ['Protein Binding', drug.protein_binding], ['Metabolism', drug.metabolism], ['Half-Life', drug.half_life], ['Excretion', drug.excretion]].filter(([,v])=>v).map(([k,v]) => (
            <div key={k as string}>
              <div style={{ fontSize: 11, color: '#475569', marginBottom: 2 }}>{k}</div>
              <div style={{ fontSize: 13, color: '#94a3b8' }}>{v}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="🫘 Renal & Hepatic Considerations">
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, color: '#22d3ee', marginBottom: 4 }}>Renal</div>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>{drug.renal_considerations || 'No specific renal data documented.'}</p>
        </div>
        <div>
          <div style={{ fontSize: 12, color: '#a78bfa', marginBottom: 4 }}>Hepatic</div>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>{drug.hepatic_considerations || 'No specific hepatic data documented.'}</p>
        </div>
      </Section>

      <Section title="🔬 Monitoring Requirements">
        <ul style={{ margin: 0, padding: '10px 0 0 20px' }}>
          {(drug.monitoring_requirements || []).map((m: string) => <li key={m} style={{ fontSize: 13, color: '#94a3b8', marginBottom: 4 }}>{m}</li>)}
        </ul>
      </Section>

      <Section title="📚 Evidence & Citations">
        {(drug.evidence_citations || []).map((c: any, i: number) => (
          <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid rgba(30,66,120,0.2)' }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#e2e8f0' }}>{c.source}</div>
            <div style={{ fontSize: 12, color: '#475569' }}>{c.publisher} · {c.year}</div>
            {c.note && <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{c.note}</div>}
          </div>
        ))}
        <div style={{ fontSize: 11, color: '#334155', marginTop: 10 }}>
          Evidence label: <span style={{ color: '#22c55e' }}>Verified evidence</span> · Last verified: {drug.last_verified}
        </div>
      </Section>

      {/* Same class comparison */}
      {sameClass && sameClass.comparison_rows && (
        <Section title="🔄 Same-Class Comparison">
          <div style={{ fontSize: 12, color: '#f59e0b', marginBottom: 12, padding: '8px 12px', background: 'rgba(245,158,11,0.08)', borderRadius: 6 }}>
            {sameClass.disclaimer}
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(30,66,120,0.4)' }}>
                  <th style={{ textAlign: 'left', padding: '8px 10px', color: '#475569' }}>Factor</th>
                  <th style={{ textAlign: 'left', padding: '8px 10px', color: '#22d3ee' }}>{sameClass.primary_drug}</th>
                  {(sameClass.alternatives || []).map((a: string) => (
                    <th key={a} style={{ textAlign: 'left', padding: '8px 10px', color: '#94a3b8' }}>{a}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(sameClass.comparison_rows || []).map((row: any) => (
                  <tr key={row.factor} style={{ borderBottom: '1px solid rgba(30,66,120,0.15)' }}>
                    <td style={{ padding: '8px 10px', color: '#64748b', fontWeight: 500 }}>{row.factor}</td>
                    <td style={{ padding: '8px 10px', color: '#94a3b8' }}>{row[sameClass.primary_drug] || '—'}</td>
                    {(sameClass.alternatives || []).map((a: string) => (
                      <td key={a} style={{ padding: '8px 10px', color: '#64748b' }}>{row[a] || '—'}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      <div style={{ marginTop: 20, padding: '12px 16px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 8 }}>
        <p style={{ fontSize: 11, color: '#78716c' }}>⚠️ This drug profile is for educational reference. Prescribing decisions require qualified clinical assessment. Doses and interactions are patient-specific.</p>
      </div>
    </div>
  )
}
