import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Icon from '../components/Icon'
import { Attributes, GarmentImage } from '../components/ItemCard'
import { itemLabel } from '../types/format'
import { useOutfit } from '../hooks/useWardrobe'
import { errorMessage } from '../api/errors'

export default function OutfitPage() {
  const suggestion = useOutfit()
  const outfit = suggestion.data
  const hasOutfit = !!outfit?.items.length
  return <><Navbar /><main id="main" className="page fade-up">
    <div className="page-heading"><div><p className="eyebrow"><span className="small-rule" /> The outfit studio</p><h1>Familiar pieces.<br className="mobile-break" /> <em>Fresh perspective.</em></h1><p className="lead">A new way to wear the wardrobe you already love.</p></div></div>
    {!hasOutfit && <section className="outfit-intro"><div className="outfit-art" aria-hidden="true"><div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" /><Icon name="hanger" size={80} /><span className="art-spark"><Icon name="spark" size={34} /></span></div><p className="eyebrow">A little inspiration, from your own wardrobe</p><h2>Your next look is already here.</h2><p>Bring together a top, a bottom and a pair of shoes.<br />We’ll find a combination from your ready pieces.</p></section>}
    {suggestion.error && <p className="notice" role="alert">{errorMessage(suggestion.error, 'We couldn’t find an outfit right now. Please try again.')}</p>}
    {outfit?.message && <div className="notice" role="status"><p>{outfit.message}</p>{!hasOutfit && <Link className="text-button" to="/upload">Add another piece ↗</Link>}</div>}
    {suggestion.isPending && <p className="processing-note outfit-progress" role="status"><span className="spinner" /> Finding a look from your collection…</p>}
    {hasOutfit && <section className="outfit-result" aria-label="Suggested outfit"><div className="outfit-result-header"><p className="eyebrow">A look to make your own</p>{outfit.score !== null && <span className="score"><Icon name="spark" size={17} />{Math.round(outfit.score * 100)}% compatibility</span>}</div><div className="outfit-grid">{outfit.items.map((item, index) => <article className="outfit-piece" key={item.id}><div className="outfit-photo"><GarmentImage item={item} /><span className="piece-number">0{index + 1}</span></div><p className="eyebrow">{itemLabel(item.category)}</p><h2>{itemLabel(item.subcategory) || 'Wardrobe essential'}</h2><Attributes item={item} /></article>)}</div><p className="outfit-caption">Your clothes, seen together. Make the look your own.</p></section>}
    <div className="outfit-controls"><button className="btn btn-primary" disabled={suggestion.isPending} onClick={() => suggestion.mutate()}><Icon name="spark" size={17} />{suggestion.isPending ? 'Finding your look…' : hasOutfit ? 'Try another combination' : 'Find my outfit'}</button><Link className="text-button" to="/wardrobe">Back to my wardrobe <Icon name="arrow" size={16} /></Link></div>
  </main></>
}
