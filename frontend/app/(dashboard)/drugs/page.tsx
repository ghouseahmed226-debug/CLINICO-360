'use client'
import { useState } from 'react'
import Link from 'next/link'
import api from '@/lib/api'

export default function DrugLibraryPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const search = async () => {
    if (!query.trim()) return
    setLoading(true); setSearched(true)
    try { setResults(await api.drugs.search(query)) }
    catch { setResults([]) }
    finally { setLoading(false) }
  }

  const badge = (text: string) => (
    <span style={{ fontSize: 11, background: 'rgba(34,211,238,0.1)', color: '#67e8f9', border: '1px solid rgba(34,211,238,0.2)', borderRadius: 20, padding: '2px 8px' }}>{text}</span>
  )

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1100 }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, fontFamily: 'Manrope,sans-serif', color: '#f1f5f9', marginBottom: 6 }}>Drug Library</h1>
      <p style={{ fontSize: 14, color: '#64748b', marginBottom: 28 }}>Search by generic name, brand name, drug class or therapeutic category.</p>

      {/* Search bar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search()}
          placeholder="e.g. Ramipril, ACE Inhibitor, Antihypertensive…"
          style={{ flex: 1, background: 'rgba(10,22,40,0.9)', border: '1px solid rgba(30,66,120,0.5)', borderRadius: 10, padding: '12px 16px', fontSize: 14, color: '#f1f5f9', outline: 'none' }}
        />
        <button onClick={search} disabled={loading} style={{ padding: '12px 28px', background: '#22d3ee', borderRadius: 10, border: 'none', color: '#060d1f', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
          {loading ? '…' : 'Search'}
        </button>
      </div>

      {/* Results */}
      {searched && results.length === 0 && !loading && (
        <div style={{ padding: '20px', background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(30,66,120,0.3)', borderRadius: 10, fontSize: 14, color: '#64748b' }}>
          No drugs found for "{query}". Try a generic name, brand name or drug class.
        </div>
      )}

      <div style={{ display: 'grid', gap: 16 }}>
        {results.map(drug => (
          <div key={drug.id} style={{ background: 'rgba(10,22,40,0.85)', border: '1px solid rgba(30,66,120,0.3)', borderRadius: 12, padding: '20px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>{drug.generic_name}</h2>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                  {badge(drug.pharmacological_class)}
                  {badge(drug.therapeutic_category)}
                </div>
                <div style={{ fontSize: 12, color: '#475569', marginBottom: 8 }}>
                  Brands: {(drug.brand_names || []).join(', ')}
                </div>
                <p style={{ fontSize: 13, color: '#94a3b8', maxWidth: 600, lineHeight: 1.6 }}>{drug.moa_simple?.slice(0, 180)}…</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 160 }}>
                <Link href={`/drugs/${drug.id}`} style={{ padding: '10px 20px', background: '#22d3ee', borderRadius: 8, color: '#060d1f', textDecoration: 'none', fontSize: 13, fontWeight: 600, textAlign: 'center' }}>
                  Full Profile →
                </Link>
              </div>
            </div>
            <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {(drug.available_strengths || []).map((s: string) => (
                <span key={s} style={{ fontSize: 11, background: 'rgba(43,144,217,0.1)', color: '#93c5fd', border: '1px solid rgba(43,144,217,0.2)', borderRadius: 20, padding: '2px 8px' }}>{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {!searched && (
        <div style={{ marginTop: 20, padding: '24px', background: 'rgba(10,22,40,0.6)', border: '1px solid rgba(30,66,120,0.2)', borderRadius: 10 }}>
          <p style={{ fontSize: 13, color: '#475569' }}>Try searching: <strong style={{ color: '#67e8f9' }}>Ramipril</strong>, <strong style={{ color: '#67e8f9' }}>Metformin</strong>, <strong style={{ color: '#67e8f9' }}>ACE Inhibitor</strong>, <strong style={{ color: '#67e8f9' }}>Furosemide</strong>, <strong style={{ color: '#67e8f9' }}>Amlodipine</strong>, <strong style={{ color: '#67e8f9' }}>Losartan</strong></p>
        </div>
      )}
    </div>
  )
}
