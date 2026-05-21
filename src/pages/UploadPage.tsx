import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useUploadItem } from '../hooks/useWardrobe'

const CATEGORIES = ['top', 'bottom', 'shoes', 'accessory','outer']

const CATEGORY_LABELS: Record<string, string> = {
  top: 'Футболка, рубашка, блузка',
  outer: 'Куртка, кофта, худи, кардиган',
  bottom: 'Штаны, джинсы, юбка',
  shoes: 'Обувь',
  accessory: 'Аксессуары',
}

export default function UploadPage() {
  const navigate = useNavigate()
  const { mutateAsync, isPending } = useUploadItem()
  const [category, setCategory] = useState('top')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return
    setError('')
    try {
      const fd = new FormData()
      fd.append('category', category)
      fd.append('image', file)
      await mutateAsync(fd)
      navigate('/wardrobe')
    } catch {
      setError('Upload failed. Please try again.')
    }
  }

  return (
    <>
      <Navbar />
      <div className="page fade-up">
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: '28px', fontWeight: 300, letterSpacing: '0.04em' }}>
              Add Item
            </h2>
            <p className="label" style={{ marginTop: '4px' }}>Upload a photo of your clothing</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div
              onClick={() => inputRef.current?.click()}
              style={{
                border: `1px dashed ${preview ? 'var(--border-hover)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-lg)',
                aspectRatio: '3/4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                overflow: 'hidden',
                background: 'var(--surface)',
                transition: 'border-color 0.2s',
                position: 'relative',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = preview ? 'var(--border-hover)' : 'var(--border)')}
            >
              {preview ? (
                <img src={preview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 300, color: 'var(--text-muted)', marginBottom: '8px' }}>
                    Click to upload
                  </p>
                  <p className="label">JPG, PNG up to 10MB</p>
                </div>
              )}
            </div>

            <input ref={inputRef} type="file" accept="image/*" onChange={onFileChange} style={{ display: 'none' }} />

            <div>
              <p className="label" style={{ marginBottom: '8px' }}>Category</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    style={{
                      padding: '10px',
                      fontSize: '10px',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      borderRadius: 'var(--radius)',
                      border: `1px solid ${category === cat ? 'var(--accent)' : 'var(--border)'}`,
                      background: category === cat ? 'var(--accent-dim)' : 'transparent',
                      color: category === cat ? 'var(--accent)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    <span>{cat}</span>
                    <span style={{ display: 'block', fontSize: '9px', color: 'var(--text-dim)', marginTop: '2px', textTransform: 'none', letterSpacing: 'normal' }}>
                      {CATEGORY_LABELS[cat]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="error-msg">{error}</p>}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={!file || isPending}
              style={{ justifyContent: 'center', opacity: !file ? 0.5 : 1 }}
            >
              {isPending ? <span className="spinner" /> : 'Upload'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
