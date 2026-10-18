import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Icon from '../components/Icon'
import ItemCard from '../components/ItemCard'
import { useItems } from '../hooks/useWardrobe'
import { errorMessage } from '../api/errors'

const filters = [{ key: 'all', label: 'All pieces' }, { key: 'top', label: 'Tops' }, { key: 'bottom', label: 'Bottoms' }, { key: 'shoes', label: 'Shoes' }, { key: 'outerwear', label: 'Outerwear' }, { key: 'accessory', label: 'Accessories' }]
export default function WardrobePage() {
  const { data, isLoading, error, refetch, isFetching } = useItems()
  const [filter, setFilter] = useState('all')
  const items = data?.items || []
  const visible = items.filter(item => filter === 'all' || item.category === filter)
  const processing = items.filter(item => ['pending', 'processing'].includes(item.processing_status)).length
  const ready = items.filter(item => item.processing_status === 'ready').length
  return <><Navbar /><main id="main" className="page fade-up">
    <div className="page-heading">
      <div><p className="eyebrow"><span className="small-rule" /> Your personal collection</p><h1>A little more <em>you.</em></h1><p className="lead">The pieces you own. The possibilities you haven’t tried.</p></div>
      <Link to="/upload" className="btn btn-primary"><Icon name="plus" size={17} /> Add a piece</Link>
    </div>
    <section className="collection-summary" aria-label="Collection overview">
      <div><span className="summary-number">{String(data?.total || 0).padStart(2, '0')}</span><span className="eyebrow">Pieces collected</span></div>
      <div><span className="summary-number">{String(ready).padStart(2, '0')}</span><span className="eyebrow">Ready to wear</span></div>
      <Link to="/outfit" className="summary-link"><Icon name="spark" /><span>Make something<br /><strong>of what you own.</strong></span><Icon name="arrow" /></Link>
    </section>
    <div className="collection-toolbar"><div className="filter-tabs" role="group" aria-label="Filter by category">{filters.map(({ key, label }) => <button key={key} aria-pressed={filter === key} className={filter === key ? 'selected' : ''} onClick={() => setFilter(key)}>{label}</button>)}</div><span className="collection-count">{visible.length} {visible.length === 1 ? 'piece' : 'pieces'}</span></div>
    {processing > 0 && <p className="processing-note" role="status"><span className="spinner" /> Getting to know {processing === 1 ? 'your new piece' : `${processing} new pieces`}. Details will appear here automatically.</p>}
    {error && <div className="notice" role="alert"><p>{errorMessage(error, 'We couldn’t load your wardrobe. Please try again.')}</p><button className="btn btn-ghost" disabled={isFetching} onClick={() => void refetch()}>Try again</button></div>}
    {isLoading && <div className="wardrobe-grid" aria-label="Loading wardrobe" role="status">{[1, 2, 3].map(n => <div className="skeleton-card" key={n}><div /><span /></div>)}<span className="sr-only">Loading your pieces…</span></div>}
    {!isLoading && !error && visible.length === 0 && <section className="empty-state"><div className="empty-icon"><Icon name="hanger" size={44} /></div><p className="eyebrow">{items.length ? 'Room for something new' : 'Every wardrobe starts somewhere'}</p><h2>{items.length ? 'No pieces in this category yet.' : 'Your first piece is the beginning.'}</h2><p>Photograph one item you love. We’ll take care of the details.</p><Link to="/upload" className="btn btn-primary">Add your {items.length ? 'next' : 'first'} piece <Icon name="arrow" size={17} /></Link></section>}
    {visible.length > 0 && <div className="wardrobe-grid">{visible.map(item => <ItemCard key={item.id} item={item} />)}</div>}
    <footer className="page-footer"><span>VESTIS — Wear what’s yours.</span><span>A considered wardrobe, one piece at a time.</span></footer>
  </main></>
}
