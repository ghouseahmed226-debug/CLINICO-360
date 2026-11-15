'use client'
import { useState } from 'react'
import api from '@/lib/api'
import { useRouter } from 'next/navigation'

const ROLES = [
  { value: 'mbbs_intern', label: 'MBBS Intern' },
  { value: 'pharmd_intern', label: 'Pharm.D Intern' },
  { value: 'medical_student', label: 'Medical Student' },
  { value: 'hospital_pharmacist', label: 'Hospital Pharmacist' },
  { value: 'clinical_educator', label: 'Clinical Educator' },
]

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [form, setForm] = useState({ email: '', password: '', full_name: '', role: 'mbbs_intern' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const submit = async () => {
    setLoading(true); setError('')
    try {
      let res: any
      if (mode === 'login') {
        res = await api.auth.login(form.email, form.password)
      } else {
        if (!form.full_name.trim()) { setError('Full name required'); setLoading(false); return }
        res = await api.auth.register(form.email, form.password, form.full_name, form.role)
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('clinico_token', res.access_token)
        localStorage.setItem('clinico_user', JSON.stringify({ id: res.user_id, name: res.full_name, role: res.role, email: res.email }))
      }
      router.push('/dashboard')
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  const inp = (label: string, field: keyof typeof form, type = 'text', placeholder = '') => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>{label}</label>
      <input type={type} value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} placeholder={placeholder}
        style={{ width: '100%', background: 'rgba(10,22,40,0.9)', border: '1px solid rgba(30,66,120,0.5)', borderRadius: 8, padding: '12px 14px', fontSize: 14, color: '#f1f5f9', outline: 'none' }} />
    </div>
  )

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #060d1f 0%, #0a1628 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 420, padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 24, fontWeight: 800, fontFamily: 'Manrope,sans-serif', color: '#22d3ee' }}>CLINICO <span style={{ color: '#2b90d9' }}>360</span></div>
          <div style={{ fontSize: 13, color: '#475569', marginTop: 6 }}>Clinical Intelligence Platform</div>
        </div>

        <div style={{ background: 'rgba(10,22,40,0.9)', border: '1px solid rgba(30,66,120,0.4)', borderRadius: 16, padding: '32px 28px' }}>
          {/* Toggle */}
          <div style={{ display: 'flex', background: 'rgba(5,10,20,0.6)', borderRadius: 10, padding: 4, marginBottom: 24 }}>
            {(['login', 'register'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)} style={{ flex: 1, padding: '10px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, background: mode === m ? '#1e4278' : 'transparent', color: mode === m ? '#22d3ee' : '#475569' }}>
                {m === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          {mode === 'register' && inp('Full Name', 'full_name', 'text', 'Dr. Priya Sharma')}
          {inp('Email', 'email', 'email', 'you@hospital.edu')}
          {inp('Password', 'password', 'password', '••••••••')}

          {mode === 'register' && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>Role</label>
              <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                style={{ width: '100%', background: 'rgba(10,22,40,0.9)', border: '1px solid rgba(30,66,120,0.5)', borderRadius: 8, padding: '12px 14px', fontSize: 14, color: '#f1f5f9', outline: 'none' }}>
                {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
          )}

          {error && <div style={{ marginBottom: 14, padding: '10px 12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, fontSize: 13, color: '#fca5a5' }}>⚠️ {error}</div>}

          <button onClick={submit} disabled={loading} style={{ width: '100%', padding: '13px', background: '#22d3ee', borderRadius: 10, border: 'none', color: '#060d1f', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign In →' : 'Create Account →'}
          </button>

          <p style={{ fontSize: 11, color: '#334155', marginTop: 16, textAlign: 'center', lineHeight: 1.5 }}>
            By using CLINICO 360, you agree that this is an educational platform. All clinical decisions require qualified healthcare professional supervision.
          </p>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <a href="/dashboard" style={{ fontSize: 13, color: '#475569', textDecoration: 'none' }}>
            Continue without account (read-only) →
          </a>
        </div>
      </div>
    </main>
  )
}
