import { Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import categories from './categories'

export default function App() {
  const location = useLocation()
  const isEmbed = location.pathname.startsWith('/embed/')

  return (
    <Suspense fallback={<div className="page-container">Loading…</div>}>
      {isEmbed ? (
        <div className="embed-wrapper">
          <Routes>
            {categories.map(({ slug, component: Page }) => (
              <Route key={slug} path={`/embed/${slug}`} element={<Page />} />
            ))}
          </Routes>
        </div>
      ) : (
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            {categories.map(({ slug, component: Page }) => (
              <Route key={slug} path={`/${slug}`} element={<Page />} />
            ))}
          </Routes>
        </Layout>
      )}
    </Suspense>
  )
}
