import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { register } from '../api/auth'
import { errorMessage } from '../api/errors'
import { useAuthStore } from '../store/auth.store'
import AuthLayout from '../components/AuthLayout'
import Icon from '../components/Icon'

export default function RegisterPage() {
  const navigate = useNavigate()
  const token = useAuthStore(state => state.token)
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); setError(''); setLoading(true)
    const email = form.email.trim()
    try {
      await register({ ...form, email, username: form.username.trim() })
      navigate(`/verify?email=${encodeURIComponent(email)}`)
    } catch (err) { setError(errorMessage(err, 'We couldn’t create your account. Please try again.')) }
    finally { setLoading(false) }
  }
  if (token) return <Navigate to="/wardrobe" replace />
  return <AuthLayout title="Make it yours." intro="A fresh perspective on the pieces you already love." footer={<>Already have an account? <Link to="/login">Sign in ↗</Link></>}>
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="form-field"><label htmlFor="username">Username</label><input id="username" autoComplete="username" value={form.username} onChange={event => setForm({ ...form, username: event.target.value })} placeholder="Choose a username" required minLength={3} maxLength={128} /></div>
      <div className="form-field"><label htmlFor="email">Email address</label><input id="email" type="email" autoComplete="email" value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" required /></div>
      <div className="form-field"><label htmlFor="password">Password</label><input id="password" type="password" autoComplete="new-password" value={form.password} onChange={event => setForm({ ...form, password: event.target.value })} placeholder="Create a password" required minLength={8} maxLength={128} aria-describedby="password-help" /><span id="password-help" className="field-help">Use 8–128 characters.</span></div>
      {error && <p className="error-msg" role="alert">{error}</p>}
      <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? <><span className="spinner" /> Creating your account…</> : <>Create account <Icon name="arrow" size={17} /></>}</button>
      <p className="field-help">We’ll email a code to confirm it’s you.</p>
    </form>
  </AuthLayout>
}
