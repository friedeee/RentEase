export default function Footer() {
  return (
    <footer style={{
      background: '#0f172a',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      padding: '16px 32px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 30,
    }}>
      <div style={{ fontSize: '13px', color: '#475569' }}>
        © 2026 <span style={{ color: '#60a5fa', fontWeight: '600' }}>RentEase</span> — Tous droits réservés
      </div>
      <div style={{ display: 'flex', gap: '24px' }}>
        {['Accueil', 'Aide', 'Contact', 'Mentions légales'].map(link => (
          <a key={link} href="#" style={{
            fontSize: '12px',
            color: '#475569',
            textDecoration: 'none',
          }}>
            {link}
          </a>
        ))}
      </div>
      <div style={{ fontSize: '12px', color: '#334155' }}>
        v1.0.0
      </div>
    </footer>
  )
}