'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: '⬛' },
  { label: 'Drug Library', href: '/drugs', icon: '💊' },
  { label: 'Clinical Cases', href: '/cases', icon: '🩺' },
  { label: 'Prescription', href: '/prescription', icon: '📋' },
  { label: 'Interactions', href: '/interactions', icon: '⚡' },
  { label: 'Dosage', href: '/dosage', icon: '⚖️' },
  { label: 'IV Compatibility', href: '/iv-compat', icon: '💉' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      style={{
        width: 220,
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0a1628 0%, #060d1f 100%)',
        borderRight: '1px solid rgba(30,66,120,0.4)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 40,
        overflowY: 'auto',
      }}
    >
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(30,66,120,0.3)' }}>
        <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'Manrope, sans-serif', color: '#22d3ee', letterSpacing: '-0.5px' }}>
          CLINICO
        </div>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#2b90d9', letterSpacing: 4, marginTop: 2 }}>
          360
        </div>
        <div style={{ fontSize: 10, color: '#475569', marginTop: 4 }}>
          Clinical Intelligence
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px' }}>
        {navItems.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 8,
                marginBottom: 2,
                fontSize: 13,
                fontWeight: active ? 600 : 400,
                color: active ? '#22d3ee' : '#94a3b8',
                background: active ? 'rgba(34,211,238,0.08)' : 'transparent',
                border: active ? '1px solid rgba(34,211,238,0.15)' : '1px solid transparent',
                textDecoration: 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <span style={{ fontSize: 15 }}>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Disclaimer */}
      <div style={{ padding: '12px 14px', borderTop: '1px solid rgba(30,66,120,0.3)', margin: '0 10px 10px' }}>
        <div style={{ fontSize: 10, color: '#475569', lineHeight: 1.5 }}>
          ⚠️ Educational platform. All clinical decisions require qualified healthcare professional supervision.
        </div>
      </div>
    </aside>
  )
}
