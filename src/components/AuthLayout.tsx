import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import Icon from './Icon'

export default function AuthLayout({ title, intro, children, footer }: { title: string; intro: string; children: ReactNode; footer: ReactNode }) {
  return <main className="auth-layout">
    <section className="auth-story" aria-label="About Vestis"><Link to="/login" className="brand">vestis<span className="brand-dot">.</span></Link><div className="story-content"><p className="eyebrow"><span className="small-rule" /> A wardrobe, considered</p><h1>Less searching.<br />More <em>you.</em></h1><p>Rediscover what you own.<br />Find new ways to wear it.</p><div className="story-art" aria-hidden="true"><span className="story-circle" /><Icon name="hanger" size={160} /><span className="story-art-caption">THE ART OF GETTING DRESSED</span></div></div><div className="story-footer"><span>Your pieces. Your possibilities.</span><span>EST. 2026</span></div></section>
    <section className="auth-panel"><Link to="/login" className="brand mobile-brand">vestis<span className="brand-dot">.</span></Link><div className="auth-form-wrap fade-up"><p className="eyebrow">Your personal wardrobe</p><h2>{title}</h2><p className="auth-intro">{intro}</p>{children}<div className="auth-footer">{footer}</div></div><p className="auth-bottom-note">A little intention. An everyday ritual.</p></section>
  </main>
}
