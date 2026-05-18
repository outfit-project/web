import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import ItemCard from '../components/ItemCard'
import { useItems } from '../hooks/useWardrobe'

export default function WardrobePage() {
  const { data, isLoading, error } = useItems()

  return (
    <>
      <Navbar />
      <div className="page fade-up">
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '40px' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: '28px', fontWeight: 300, letterSpacing: '0.04em' }}>
              My Wardrobe
            </h2>
            {data && (
              <p className="label" style={{ marginTop: '4px' }}>{data.total} items</p>
            )}
          </div>
          <Link to="/upload" className="btn btn-primary">+ Add Item</Link>
        </div>

        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '80px' }}>
            <span className="spinner" style={{ width: '28px', height: '28px' }} />
          </div>
        )}

        {error && (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', paddingTop: '80px', fontSize: '13px' }}>
            Failed to load wardrobe
          </p>
        )}

        {data && data.items.length === 0 && (
          <div style={{ textAlign: 'center', paddingTop: '100px' }}>
            <p style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 300, color: 'var(--text-muted)', marginBottom: '16px' }}>
              Your wardrobe is empty
            </p>
            <p className="label" style={{ marginBottom: '24px' }}>Add your first item to get started</p>
            <Link to="/upload" className="btn btn-ghost">Add Item</Link>
          </div>
        )}

        {data && data.items.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '16px',
          }}>
            {data.items.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
