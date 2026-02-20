import { Link } from 'react-router-dom'
import categories from '../categories'

export default function HomePage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Maximum New York Data Viz</h1>
        <p className="subtitle">
          Interactive data visualizations from Maximum New York.
        </p>
      </div>

      <div className="category-grid">
        {categories.map(({ slug, label, description, preview }) => (
          <Link key={slug} to={`/${slug}`} className="category-card">
            {preview && (
              <div className="card-preview">
                <img src={import.meta.env.BASE_URL + preview} alt="" />
              </div>
            )}
            <div className="card-text">
              <h2>{label}</h2>
              <p>{description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
