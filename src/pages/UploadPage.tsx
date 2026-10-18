import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Icon from '../components/Icon'
import { useUploadItem } from '../hooks/useWardrobe'
import { errorMessage } from '../api/errors'

export default function UploadPage() {
  const navigate = useNavigate()
  const upload = useUploadItem()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview) }
  }, [preview])
  const chooseFile = (files: FileList | null) => {
    if (!files?.length) return
    setError('')
    if (files.length !== 1) return setError('Choose one photo of one item at a time.')
    const selected = files[0]
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(selected.type)) return setError('Choose a JPG, PNG or WebP photo.')
    if (selected.size > 10 * 1024 * 1024) return setError('This photo is too large. Choose a file under 10 MB.')
    if (selected.size === 0) return setError('This file is empty. Choose another photo.')
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
  }
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!file) return
    setError('')
    const data = new FormData()
    data.append('image', file)
    try { await upload.mutateAsync(data); navigate('/wardrobe') }
    catch (err) { setError(errorMessage(err, 'We couldn’t upload this photo. Please try again.')) }
  }
  return <><Navbar /><main id="main" className="page fade-up">
    <Link className="back-link" to="/wardrobe">← Back to wardrobe</Link>
    <div className="upload-layout"><section className="upload-intro"><p className="eyebrow"><span className="small-rule" /> Make room for a favorite</p><h1>One photo.<br /><em>All the details.</em></h1><p className="lead">Add a piece to your collection. We’ll find its category, style and color from the photo.</p><div className="photo-guide"><span className="guide-number">01</span><div><h2>One piece at a time</h2><p>Lay it flat or hang it against a simple background.</p></div><span className="guide-number">02</span><div><h2>Let the details show</h2><p>Use good light and keep the whole item in the frame.</p></div><span className="guide-number">03</span><div><h2>Leave the rest to us</h2><p>Your piece will appear in your wardrobe while we find its details. Predictions may need a little patience.</p></div></div><p className="quiet-note">A clear photo makes a considered collection.</p></section>
    <form className="upload-form" onSubmit={handleSubmit}>
      <label className={`upload-zone ${dragging ? 'dragging' : ''} ${preview ? 'has-preview' : ''}`} onDragOver={event => { event.preventDefault(); if (!upload.isPending) setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={event => { event.preventDefault(); setDragging(false); if (!upload.isPending) chooseFile(event.dataTransfer.files) }}>
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" aria-label="Choose one garment photo" disabled={upload.isPending} onChange={event => chooseFile(event.target.files)} />
        {preview ? <><img src={preview} alt="Preview of your selected garment" /><span className="change-photo">Choose a different photo ↗</span></> : <span className="upload-placeholder"><span className="upload-symbol"><Icon name="upload" size={28} /></span><strong>Drop your photo here</strong><span>or click to browse your files</span><small>JPG, PNG or WebP · Up to 10 MB</small></span>}
      </label>
      <div className="file-info"><span>{file ? file.name : 'One photo. No descriptions needed.'}</span>{file && <span>{(file.size / 1024 / 1024).toFixed(1)} MB</span>}</div>
      {error && <p className="error-msg" role="alert">{error}</p>}
      <button className="btn btn-primary upload-submit" disabled={!file || upload.isPending}>{upload.isPending ? <><span className="spinner" /> Adding your piece…</> : <>Add to my wardrobe <Icon name="arrow" size={17} /></>}</button>
      <p className="upload-footnote">Details appear automatically after your photo is added.</p>
    </form></div>
  </main></>
}
