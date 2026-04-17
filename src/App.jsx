import { Suspense } from 'react'
import { Routes, Route, useLocation, Link } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import categories from './categories'

function ComingSoonPage({ label, description }) {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>{label}</h1>
        <p className="subtitle">{description}</p>
      </div>
      <div style={{
        maxWidth: 560, margin: '48px auto', padding: '32px 24px',
        textAlign: 'center', borderRadius: 12,
        background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.35)',
      }}>
        <div style={{
          display: 'inline-block', fontSize: 12, fontWeight: 800,
          color: '#fff', background: '#d4a017',
          padding: '4px 14px', borderRadius: 20, letterSpacing: '0.04em',
        }}>
          COMING SOON
        </div>
        <p style={{ marginTop: 16, fontSize: 15, color: 'var(--color-navy)', lineHeight: 1.6 }}>
          This one isn't ready to share yet. Check back soon — or{' '}
          <Link to="/" style={{ color: 'var(--color-accent)' }}>explore the rest of the site</Link>.
        </p>
      </div>
    </div>
  )
}

export default function App() {
  const location = useLocation()
  const isEmbed = location.pathname.startsWith('/embed/')

  return (
    <Suspense fallback={<div className="page-container">Loading…</div>}>
      {isEmbed ? (
        <div className="embed-wrapper">
          <Routes>
            {categories.filter(c => !c.comingSoon).map(({ slug, component: Page }) => (
              <Route key={slug} path={`/embed/${slug}`} element={<Page />} />
            ))}
          </Routes>
        </div>
      ) : (
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            {categories.map(({ slug, component: Page, comingSoon, label, description }) => (
              <Route
                key={slug}
                path={`/${slug}`}
                element={comingSoon ? <ComingSoonPage label={label} description={description} /> : <Page />}
              />
            ))}
          </Routes>
        </Layout>
      )}
    </Suspense>
  )
}
