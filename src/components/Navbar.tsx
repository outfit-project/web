import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth.store'

export default function Navbar() {
  const { logout } = useAuthStore()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const link = (to: string, label: string) => (
    <Link
      to={to}
      style={{
        fontSize: '10px',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: pathname === to ? 'var(--accent)' : 'var(--text-muted)',
        transition: 'color 0.2s',
      }}
    >
      {label}
    </Link>
  )

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '28px 24px',
      maxWidth: '1200px',
      margin: '0 auto',
      borderBottom: '1px solid var(--border)',
      marginBottom: '48px',
    }}>
      <Link to="/wardrobe" style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 300, letterSpacing: '0.06em', color: 'var(--text)' }}>
        Vestis
      </Link>

      <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
        {link('/wardrobe', 'Wardrobe')}
        {link('/outfit', 'Outfit')}
        {link('/upload', 'Add Item')}
        <button
          onClick={handleLogout}
          style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-dim)', cursor: 'pointer', background: 'none', border: 'none', transition: 'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-muted)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-dim)')}
        >
          Exit
        </button>
      </div>
    </nav>
  )
}
