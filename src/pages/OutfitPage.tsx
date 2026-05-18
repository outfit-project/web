import { useState } from 'react'
import Navbar from '../components/Navbar'
import { useOutfit } from '../hooks/useWardrobe'
import type { OutfitItem } from '../types/item'

function OutfitItemCard({ item }: { item: OutfitItem }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      aspectRatio: '3/4',
    }}>
      <img
        src={item.image_url}
        alt={item.category}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        onError={e => { (e.target as HTMLImageElement).style.opacity = '0.2' }}
      />
    </div>
  )
}

export default function OutfitPage() {
  const [enabled, setEnabled] = useState(false)
  const { data, isFetching, refetch, error } = useOutfit(enabled)

  const outfit = data?.items?.length ? data : null

  const handleSuggest = () => {
    if (!enabled) setEnabled(true)
    else refetch()
  }

  return (
    <>
      <Navbar />
      <div className="page fade-up">
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <div style={{ marginBottom: '48px' }}>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: '28px', fontWeight: 300, letterSpacing: '0.04em' }}>
              Today's Outfit
            </h2>
            <p className="label" style={{ marginTop: '4px' }}>AI-powered style matching</p>
          </div>

          {!enabled && !outfit && (
            <div style={{ textAlign: 'center', paddingTop: '60px' }}>
              <p style={{
                fontFamily: 'var(--serif)',
                fontSize: '20px',
                fontWeight: 300,
                color: 'var(--text-muted)',
                marginBottom: '32px',
                lineHeight: 1.6,
              }}>
                Let us find the perfect<br />combination from your wardrobe
              </p>
              <button className="btn btn-primary" onClick={handleSuggest}>
                Suggest Outfit
              </button>
            </div>
          )}

          {isFetching && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '80px', gap: '16px' }}>
              <span className="spinner" style={{ width: '28px', height: '28px' }} />
              <p className="label">Finding your look</p>
            </div>
          )}

          {enabled && !isFetching && !error && !outfit && (
            <div style={{ textAlign: 'center', paddingTop: '60px' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '24px' }}>
                No top + bottom pair with embeddings yet. Add at least one top and one bottom, then wait for processing.
              </p>
              <button className="btn btn-ghost" onClick={handleSuggest}>Try Again</button>
            </div>
          )}

          {error && !isFetching && (
            <div style={{ textAlign: 'center', paddingTop: '60px' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '24px' }}>
                Could not generate outfit. Add more items to your wardrobe.
              </p>
              <button className="btn btn-ghost" onClick={handleSuggest}>Try Again</button>
            </div>
          )}

          {outfit && !isFetching && (
            <div className="fade-up">
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
                marginBottom: '32px',
              }}>
                {outfit.items.map((item) => (
                  <div key={item.id}>
                    <OutfitItemCard item={item} />
                    <p className="label" style={{ marginTop: '8px', textAlign: 'center' }}>{item.category}</p>
                  </div>
                ))}
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid var(--border)',
                paddingTop: '24px',
              }}>
                <div>
                  <p className="label">Compatibility score</p>
                  <p style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 300, color: 'var(--accent)', marginTop: '2px' }}>
                    {outfit.score != null ? `${(outfit.score * 100).toFixed(0)}%` : '—'}
                  </p>
                </div>

                <button className="btn btn-ghost" onClick={handleSuggest}>
                  Try Another
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
