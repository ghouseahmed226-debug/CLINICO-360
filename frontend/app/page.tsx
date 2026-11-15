'use client'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #060d1f 0%, #0a1628 60%, #0f2040 100%)', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      {/* Nav */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 48px', borderBottom: '1px solid rgba(30,66,120,0.3)' }}>
        <div>
          <span style={{ fontSize: 22, fontWeight: 800, fontFamily: 'Manrope,sans-serif', color: '#22d3ee' }}>CLINICO</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#2b90d9', marginLeft: 6, letterSpacing: 4 }}>360</span>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <Link href="/auth" style={{ padding: '8px 20px', border: '1px solid rgba(34,211,238,0.3)', borderRadius: 8, color: '#22d3ee', textDecoration: 'none', fontSize: 14 }}>Sign In</Link>
          <Link href="/dashboard" style={{ padding: '8px 20px', background: '#22d3ee', borderRadius: 8, color: '#060d1f', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>Dashboard</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '100px 48px 60px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.25)', borderRadius: 20, padding: '6px 16px', fontSize: 12, color: '#22d3ee', marginBottom: 24, letterSpacing: 1 }}>
          AI-POWERED CLINICAL INTELLIGENCE
        </div>
        <h1 style={{ fontSize: 56, fontWeight: 800, fontFamily: 'Manrope,sans-serif', lineHeight: 1.1, marginBottom: 24 }}>
          Think Faster.<br />
          <span style={{ color: '#22d3ee' }}>Verify Smarter.</span><br />
          Practice Safer.
        </h1>
        <p style={{ fontSize: 18, color: '#94a3b8', maxWidth: 620, margin: '0 auto 40px', lineHeight: 1.7 }}>
          CLINICO 360 is a case-aware clinical intelligence platform for MBBS interns, Pharm.D students, hospital pharmacists and clinical educators. Enter any clinical case — get evidence-backed pharmacology, ADR analysis, interaction checks and therapeutic comparisons.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <Link href="/dashboard" style={{ padding: '14px 32px', background: '#22d3ee', borderRadius: 10, color: '#060d1f', textDecoration: 'none', fontSize: 15, fontWeight: 700 }}>
            Open Dashboard →
          </Link>
          <Link href="/drugs" style={{ padding: '14px 32px', border: '1px solid rgba(34,211,238,0.3)', borderRadius: 10, color: '#22d3ee', textDecoration: 'none', fontSize: 15 }}>
            Drug Library
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 48px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {[
            { icon: '🩺', title: 'Case-Aware Analysis', desc: 'Enter any clinical case in free text. The engine identifies drugs, comorbidities, interactions and ADR risks specific to your patient.' },
            { icon: '💊', title: 'Drug Intelligence', desc: 'Full pharmacological profiles: mechanism of action, pharmacokinetics, ADRs, contraindications — with traceable evidence citations.' },
            { icon: '⚡', title: 'Interaction Checker', desc: 'Drug-drug, drug-food and drug-disease interactions with severity levels, mechanisms and clinical management guidance.' },
            { icon: '🔬', title: 'ADR Explorer', desc: 'Organ-system-wise adverse reaction profiles with severity, frequency, dose-relationship and risk factors.' },
            { icon: '⚖️', title: 'Dosage Intelligence', desc: 'Reference dosing with renal/hepatic adjustments. Clear warnings when essential inputs are missing.' },
            { icon: '💉', title: 'IV Compatibility', desc: 'Green/yellow/red/grey compatibility status with source citations. Never assumes unknown = compatible.' },
            { icon: '🔄', title: 'Why This Drug?', desc: 'Compare same-class alternatives. Case-specific reasoning for why alternatives may be less suitable.' },
            { icon: '📋', title: 'Prescription Analyzer', desc: 'Text-based prescription analysis with medication card extraction and human verification workflow.' },
          ].map(f => (
            <div key={f.title} style={{ background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(30,66,120,0.3)', borderRadius: 12, padding: '24px 20px' }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8, color: '#e2e8f0' }}>{f.title}</div>
              <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <footer style={{ borderTop: '1px solid rgba(30,66,120,0.3)', padding: '24px 48px', textAlign: 'center' }}>
        <p style={{ fontSize: 11, color: '#475569', maxWidth: 700, margin: '0 auto' }}>
          ⚠️ CLINICO 360 is an educational clinical intelligence platform. It does not provide autonomous medical diagnosis, prescribing or treatment decisions. All patient management decisions remain strictly under qualified medical and pharmaceutical supervision.
        </p>
        <p style={{ fontSize: 11, color: '#334155', marginTop: 8 }}>© 2026 CLINICO 360 — Built for Healthcare Education</p>
      </footer>
    </main>
  )
}
