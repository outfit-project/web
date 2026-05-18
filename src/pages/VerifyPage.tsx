import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { verify, resendCode } from '../api/auth'
import { useAuthStore } from '../store/auth.store'

export default function VerifyPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const email = params.get('email') || ''
  const { setAuth } = useAuthStore()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resent, setResent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await verify({ email, code })
      setAuth(data.access_token, data.refresh_token)
      navigate('/wardrobe')
    } catch {
      setError('Invalid or expired code')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    try {
      await resendCode(email)
      setResent(true)
      setTimeout(() => setResent(false), 4000)
    } catch {
      setError('Could not resend code')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
      padding: '24px',
    }}>
      <div className="fade-up" style={{ width: '100%', maxWidth: '360px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: '36px', fontWeight: 300, letterSpacing: '0.08em', marginBottom: '8px' }}>
            Verify
          </h1>
          <p className="label">Check your email</p>
          {email && (
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>{email}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <p className="label" style={{ marginBottom: '6px' }}>Verification code</p>
            <input
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="000000"
              maxLength={6}
              required
              style={{ textAlign: 'center', fontSize: '20px', letterSpacing: '0.3em' }}
            />
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '8px', justifyContent: 'center' }}>
            {loading ? <span className="spinner" /> : 'Confirm'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '12px', color: 'var(--text-dim)' }}>
          {resent ? (
            <span style={{ color: 'var(--accent)' }}>Code sent</span>
          ) : (
            <button
              onClick={handleResend}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '12px', cursor: 'pointer', letterSpacing: '0.04em' }}
            >
              Resend code
            </button>
          )}
        </p>
      </div>
    </div>
  )
}
