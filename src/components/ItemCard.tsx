import { useState } from 'react'
import type { Item } from '../types/item'
import { useDeleteItem } from '../hooks/useWardrobe'

export default function ItemCard({ item }: { item: Item }) {
  const { mutate: deleteItem, isPending } = useDeleteItem()
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        aspectRatio: '3/4',
        cursor: 'default',
        transition: 'border-color 0.2s',
        borderColor: hovered ? 'var(--border-hover)' : undefined,
      }}
    >
      <img
        src={item.image_url}
        alt={item.category}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
      />

      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '32px 12px 12px',
        background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.2s',
      }}>
        <span className="label" style={{ color: 'rgba(255,255,255,0.6)' }}>
          {item.category}
        </span>

        <button
          onClick={() => deleteItem(item.id)}
          disabled={isPending}
          style={{
            fontSize: '10px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#e74c3c',
            background: 'rgba(0,0,0,0.5)',
            border: '1px solid rgba(231,76,60,0.3)',
            borderRadius: 'var(--radius)',
            padding: '4px 10px',
            cursor: 'pointer',
          }}
        >
          {isPending ? '...' : 'Remove'}
        </button>
      </div>

      {!item.embedding && (
        <div style={{
          position: 'absolute',
          top: 8,
          right: 8,
          background: 'rgba(0,0,0,0.7)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '3px 8px',
          fontSize: '9px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--text-dim)',
        }}>
          Processing
        </div>
      )}
    </div>
  )
}
