import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { login } from '../api/auth'
import { errorMessage } from '../api/errors'
import { useAuthStore } from '../store/auth.store'
import AuthLayout from '../components/AuthLayout'
import Icon from '../components/Icon'

export default function LoginPage() {
  const navigate = useNavigate()
  const { token, setAuth, sessionMessage } = useAuthStore()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); setError(''); setLoading(true)
    try {
      const data = await login({ ...form, username: form.username.trim() })
      setAuth(data.access_token, data.refresh_token)
      navigate('/wardrobe', { replace: true })
    } catch (err) { setError(errorMessage(err, 'We couldn’t sign you in. Check your username and password.')) }
    finally { setLoading(false) }
  }
  if (token) return <Navigate to="/wardrobe" replace />
  return <AuthLayout title="Welcome back." intro="Your wardrobe is right where you left it." footer={<>New to Vestis? <Link to="/register">Create an account ↗</Link><Link className="verify-link" to="/verify">Have an email code? Verify your account</Link></>}>
    <form className="auth-form" onSubmit={handleSubmit}>
      {sessionMessage && <p className="field-help" role="status">{sessionMessage}</p>}
      <div className="form-field"><label htmlFor="username">Username</label><input id="username" autoComplete="username" value={form.username} onChange={event => setForm({ ...form, username: event.target.value })} placeholder="Your username" required maxLength={128} /></div>
      <div className="form-field"><label htmlFor="password">Password</label><input id="password" type="password" autoComplete="current-password" value={form.password} onChange={event => setForm({ ...form, password: event.target.value })} placeholder="Your password" required maxLength={128} /></div>
      {error && <p className="error-msg" role="alert">{error}</p>}
      <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? <><span className="spinner" /> Signing in…</> : <>Step inside <Icon name="arrow" size={17} /></>}</button>
    </form>
  </AuthLayout>
}
