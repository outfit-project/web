import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth.store'
import Icon from './Icon'

export default function Navbar() {
  const logout = useAuthStore(state => state.logout)
  const navigate = useNavigate()
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header">
      <nav className="navbar" aria-label="Main navigation">
        <Link className="brand" to="/wardrobe">vestis<span className="brand-dot">.</span></Link>
        <div className="nav-links">
          <NavLink to="/wardrobe">Wardrobe</NavLink>
          <NavLink to="/outfit">Outfit studio</NavLink>
          <NavLink to="/upload" className="nav-add"><Icon name="plus" size={15} /> Add item</NavLink>
        </div>
        <button className="logout" onClick={() => { logout(); navigate('/login', { replace: true }) }}>Sign out <span aria-hidden="true">↗</span></button>
      </nav>
    </header>
  </>
}
