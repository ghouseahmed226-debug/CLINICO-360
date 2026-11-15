'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import api from '@/lib/api'

interface Stats { drugs_in_database: number; clinical_cases: number; prescriptions_analyzed: number; drug_interactions_indexed: number }

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentCases, setRecentCases] = useState<any[]>([])
  const [recentDrugs, setRecentDrugs] = useState<any[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    api.dashboard.stats().then(setStats).catch(() => setError('Backend offline — start the FastAPI server on port 8000'))
    api.dashboard.recentCases(5).then(setRecentCases).catch(() => {})
    api.dashboard.recentDrugs(6).then(setRecentDrugs).catch(() => {})
  }, [])

  const card = (label: string, value: string | number, sub: string, color: string) => (
    <div style={{ background: 'rgba(10,22,40,0.9)', border: `1px solid ${color}30`, borderRadius: 12, padding: '20px 24px' }}>
      <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Manrope,sans-serif', color }}>{value}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', marginTop: 4 }}>{label}</div>
      <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{sub}</div>
    </div>
  )

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Manrope,sans-serif', color: '#f1f5f9', marginBottom: 6 }}>
          Clinical Dashboard
        </h1>
        <p style={{ fontSize: 14, color: '#64748b' }}>CLINICO 360 — AI-Powered Clinical Intelligence & Medication Safety Platform</p>
        {error && (
          <div style={{ marginTop: 12, padding: '10px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, fontSize: 13, color: '#fca5a5' }}>
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        {card('Drugs in Database', stats?.drugs_in_database ?? '…', 'Curated pharmacological profiles', '#22d3ee')}
        {card('Clinical Cases', stats?.clinical_cases ?? '…', 'Entered & analysed', '#2b90d9')}
        {card('Prescriptions Analysed', stats?.prescriptions_analyzed ?? '…', 'Extracted & verified', '#a78bfa')}
        {card('Interactions Indexed', stats?.drug_interactions_indexed ?? '…', 'Drug-drug, drug-food', '#f59e0b')}
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontWeight: 600, color: '#94a3b8', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1, fontSize: 12 }}>QUICK ACTIONS</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
          {[
            { label: 'New Clinical Case', href: '/cases', icon: '🩺', color: '#22d3ee' },
            { label: 'Drug Search', href: '/drugs', icon: '💊', color: '#2b90d9' },
            { label: 'Check Interactions', href: '/interactions', icon: '⚡', color: '#f59e0b' },
            { label: 'Analyse Prescription', href: '/prescription', icon: '📋', color: '#a78bfa' },
            { label: 'Dosage Reference', href: '/dosage', icon: '⚖️', color: '#34d399' },
            { label: 'IV Compatibility', href: '/iv-compat', icon: '💉', color: '#fb7185' },
          ].map(a => (
            <Link key={a.href} href={a.href} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8, padding: '16px 18px', background: 'rgba(10,22,40,0.8)', border: `1px solid ${a.color}20`, borderRadius: 10, textDecoration: 'none', transition: 'border-color 0.15s ease' }}>
              <span style={{ fontSize: 22 }}>{a.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: '#e2e8f0' }}>{a.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Two column: recent cases + recent drugs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Recent Cases */}
        <div style={{ background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(30,66,120,0.3)', borderRadius: 12, padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: '#94a3b8' }}>Recent Clinical Cases</h2>
            <Link href="/cases" style={{ fontSize: 12, color: '#22d3ee', textDecoration: 'none' }}>View all →</Link>
          </div>
          {recentCases.length === 0 ? (
            <p style={{ fontSize: 13, color: '#334155' }}>No cases yet. <Link href="/cases" style={{ color: '#22d3ee', textDecoration: 'none' }}>Create your first case →</Link></p>
          ) : (
            recentCases.map(c => (
              <Link key={c.id} href={`/cases/${c.id}`} style={{ display: 'block', padding: '10px 0', borderBottom: '1px solid rgba(30,66,120,0.2)', textDecoration: 'none' }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#e2e8f0' }}>{c.title}</div>
                <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{c.specialty} · {c.created_at?.slice(0, 10)}</div>
              </Link>
            ))
          )}
        </div>

        {/* Recent Drugs */}
        <div style={{ background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(30,66,120,0.3)', borderRadius: 12, padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: '#94a3b8' }}>Drug Library</h2>
            <Link href="/drugs" style={{ fontSize: 12, color: '#22d3ee', textDecoration: 'none' }}>Browse all →</Link>
          </div>
          {recentDrugs.map(d => (
            <Link key={d.id} href={`/drugs/${d.id}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(30,66,120,0.2)', textDecoration: 'none' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#e2e8f0' }}>{d.generic_name}</div>
                <div style={{ fontSize: 11, color: '#475569' }}>{d.pharmacological_class}</div>
              </div>
              <div style={{ fontSize: 11, color: '#22d3ee', background: 'rgba(34,211,238,0.08)', padding: '2px 8px', borderRadius: 20 }}>{d.therapeutic_category?.split(' ')[0]}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{ marginTop: 32, padding: '14px 18px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 8 }}>
        <p style={{ fontSize: 11, color: '#78716c', lineHeight: 1.6 }}>
          ⚠️ CLINICO 360 is an educational clinical intelligence platform. All statistics reflect actual database records. Clinical findings shown are reference information only and require qualified healthcare professional verification before any patient care decision.
        </p>
      </div>
    </div>
  )
}
