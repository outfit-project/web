import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { verify, resendCode } from '../api/auth'
import { errorMessage } from '../api/errors'
import { useAuthStore } from '../store/auth.store'
import AuthLayout from '../components/AuthLayout'
import Icon from '../components/Icon'

export default function VerifyPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { token, setAuth } = useAuthStore()
  const [email, setEmail] = useState(params.get('email') || '')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [resent, setResent] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  useEffect(() => {
    if (!cooldown) return
    const timer = window.setTimeout(() => setCooldown(value => value - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [cooldown])
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); setError(''); setLoading(true)
    try {
      const data = await verify({ email: email.trim(), code })
      setAuth(data.access_token, data.refresh_token)
      navigate('/wardrobe', { replace: true })
    } catch (err) { setError(errorMessage(err, 'This code is invalid or has expired. Please try again.')) }
    finally { setLoading(false) }
  }
  const handleResend = async () => {
    setError(''); setSending(true); setResent(false)
    try { await resendCode(email.trim()); setResent(true); setCooldown(60) }
    catch (err) { setError(errorMessage(err, 'We couldn’t send a new code. Please try again.')) }
    finally { setSending(false) }
  }
  if (token) return <Navigate to="/wardrobe" replace />
  return <AuthLayout title="Check your inbox." intro="Enter the six-digit code we sent to your email." footer={<><Link to="/register">Use a different account ↗</Link><Link className="verify-link" to="/login">Back to sign in</Link></>}>
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="form-field"><label htmlFor="email">Email address</label><input id="email" type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" required /></div>
      <div className="form-field"><label htmlFor="code">Verification code</label><input id="code" className="code-input" autoComplete="one-time-code" inputMode="numeric" pattern="[0-9]{6}" value={code} onChange={event => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000" required maxLength={6} minLength={6} /></div>
      {error && <p className="error-msg" role="alert">{error}</p>}
      {resent && <p className="success-msg" role="status">A fresh code is on its way. Check your inbox and spam folder.</p>}
      <button type="submit" className="btn btn-primary" disabled={loading || sending}>{loading ? <><span className="spinner" /> Confirming…</> : <>Confirm email <Icon name="check" size={17} /></>}</button>
      <button type="button" className="text-button resend-button" disabled={sending || loading || cooldown > 0 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())} onClick={() => void handleResend()}>{sending ? 'Sending…' : cooldown ? `Resend available in ${cooldown}s` : 'Didn’t receive it? Resend code'}</button>
    </form>
  </AuthLayout>
}
