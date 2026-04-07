import { Link } from 'react-router-dom'
import categories from '../categories'

export default function HomePage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Maximum New York Data Viz & Art</h1>
        <p className="subtitle">
          Created to support posts on the <a href="https://maximumnewyork.com" target="_blank" rel="noopener noreferrer">Maximum New York</a> site, and for general fun and interest. Contact Daniel at <a href="mailto:daniel@maximumnewyork.com">daniel@maximumnewyork.com</a> with any questions or comments, or DM him on <a href="https://linkedin.com/in/danielgolliher" target="_blank" rel="noopener noreferrer">LinkedIn</a> or <a href="https://x.com/danielgolliher" target="_blank" rel="noopener noreferrer">X</a>.
        </p>
      </div>

      <div className="category-grid">
        {categories.map(({ slug, label, description, preview, comingSoon }) => (
          <Link key={slug} to={comingSoon ? '#' : `/${slug}`} className={`category-card${comingSoon ? ' coming-soon' : ''}`}
            onClick={comingSoon ? (e) => e.preventDefault() : undefined}
          >
            {preview && (
              <div className="card-preview">
                <img src={import.meta.env.BASE_URL + preview} alt="" />
              </div>
            )}
            <div className="card-text">
              <h2>{label}{comingSoon && <span style={{
                marginLeft: 10, fontSize: 13, fontWeight: 900,
                color: '#fff', background: 'linear-gradient(135deg, #d4a017, #ffd700)',
                padding: '3px 14px', borderRadius: 12, verticalAlign: 'middle',
                textTransform: 'uppercase', letterSpacing: '0.5px',
                boxShadow: '0 2px 6px rgba(212,160,23,0.3)',
              }}>Coming Soon!</span>}</h2>
              <p>{description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
