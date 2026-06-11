'use client'

import { useState } from 'react'

type SidebarProps = {
  active: string
}

export default function Sidebar({ active }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  const links = [
    { href: '/', label: 'Dashboard', icon: '📊' },
    { href: '/proprietaires', label: 'Propriétaires', icon: '👤' },
    { href: '/biens', label: 'Biens', icon: '🏠' },
    { href: '/chambres', label: 'Chambres', icon: '🚪' },
    { href: '/locataires', label: 'Locataires', icon: '👥' },
    { href: '/contrats', label: 'Contrats', icon: '📄' },
    { href: '/paiements', label: 'Paiements', icon: '💰' },
    { href: '/recus', label: 'Reçus', icon: '🧾' },
  ]

  return (
    <div
      style={{
        width: collapsed ? '72px' : '260px',
        background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
        transition: 'width 0.3s ease',
        boxShadow: '4px 0 20px rgba(0,0,0,0.3)',
      }}
      className="fixed left-0 top-0 h-full text-white z-40 flex flex-col"
    >
      <div style={{
        padding: '24px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
      }}>
        {!collapsed && (
          <div>
            <div style={{
              fontSize: '20px',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px',
            }}>
              RentEase
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
              Gestion locative
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            padding: '8px',
            cursor: 'pointer',
            color: '#94a3b8',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {collapsed ? '▶' : '◀'}
        </button>
      </div>

      <nav style={{ padding: '12px 8px', flex: 1 }}>
        {links.map(link => {
          const isActive = active === link.href
          return (
            <a
              key={link.href}
              href={link.href}
              title={link.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '10px',
                marginBottom: '4px',
                textDecoration: 'none',
                color: isActive ? '#fff' : '#94a3b8',
                background: isActive
                  ? 'linear-gradient(135deg, rgba(96,165,250,0.2), rgba(167,139,250,0.2))'
                  : 'transparent',
                borderLeft: isActive ? '3px solid #60a5fa' : '3px solid transparent',
                transition: 'all 0.2s',
                fontSize: '14px',
                fontWeight: isActive ? '600' : '400',
              }}
            >
              <span style={{ fontSize: '18px', minWidth: '24px', textAlign: 'center' }}>
                {link.icon}
              </span>
              {!collapsed && (
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
                  {link.label}
                </span>
              )}
            </a>
          )
        })}
      </nav>

      {!collapsed && (
        <div style={{
          padding: '16px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          fontSize: '11px',
          color: '#475569',
          textAlign: 'center',
        }}>
          RentEase v1.0 © 2026
        </div>
      )}
    </div>
  )
}
