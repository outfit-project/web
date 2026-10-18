import { useState } from 'react'
import type { Item, OutfitItem } from '../types/item'
import { useDeleteItem, useRetryItem } from '../hooks/useWardrobe'
import { errorMessage } from '../api/errors'
import Icon from './Icon'
import { itemLabel } from '../types/format'

export function GarmentImage({ item }: { item: OutfitItem }) {
  const [failed, setFailed] = useState(false)
  return <div className="garment-image">
    {failed ? <div className="image-fallback"><Icon name="hanger" size={38} /><span>Photo unavailable</span></div> :
      <img src={item.image_url} alt={itemLabel(item.subcategory || item.category) || 'Uploaded garment'} loading="lazy" onError={() => setFailed(true)} />}
  </div>
}

export function Attributes({ item }: { item: OutfitItem }) {
  const color = item.color_hex && /^#[0-9a-f]{6}$/i.test(item.color_hex) ? item.color_hex : null
  return <div className="attributes">
    <span>{itemLabel(item.style) || 'Style pending'}</span>
    {color && <span className="color-detail"><span className="swatch" style={{ backgroundColor: color }} aria-hidden="true" /><span>{color.toUpperCase()}</span></span>}
  </div>
}

export default function ItemCard({ item }: { item: Item }) {
  const remove = useDeleteItem()
  const retry = useRetryItem()
  const [confirm, setConfirm] = useState(false)
  const busy = remove.isPending || retry.isPending
  const statusLabel = { ready: 'Ready to style', pending: 'In the queue', processing: 'Finding the details', failed: 'Needs attention' }[item.processing_status]
  return <article className="item-card">
    <div className="item-photo"><GarmentImage item={item} />
      <span className={`status status-${item.processing_status}`}><span className="status-dot" />{statusLabel}</span>
    </div>
    <div className="item-content">
      <p className="eyebrow">{itemLabel(item.category) || 'New addition'}</p>
      <h2>{itemLabel(item.subcategory) || (item.processing_status === 'ready' ? 'Wardrobe essential' : 'Your new piece')}</h2>
      {item.processing_status === 'ready' ? <Attributes item={item} /> :
        <p className="item-description">{item.processing_status === 'failed' ? item.processing_error || 'We could not read this photo. Try again with a clear photo of one item.' : 'We’re identifying the category, style and color. Your piece will update automatically.'}</p>}
      {(remove.error || retry.error) && <p className="error-msg" role="alert">{errorMessage(remove.error || retry.error)}</p>}
      <div className="item-actions">
        {item.processing_status === 'failed' && <button className="text-button" disabled={busy} onClick={() => retry.mutate(item.id)}>{retry.isPending ? 'Retrying…' : 'Try again ↻'}</button>}
        {confirm ? <div className="confirm-remove"><span>Remove item?</span><button className="text-button danger" disabled={busy} onClick={() => remove.mutate(item.id)}>{remove.isPending ? 'Removing…' : 'Yes, remove'}</button><button className="text-button" disabled={busy} onClick={() => setConfirm(false)}>Keep</button></div> :
          <button className="text-button remove-button" disabled={busy} onClick={() => setConfirm(true)}>Remove</button>}
      </div>
    </div>
  </article>
}
