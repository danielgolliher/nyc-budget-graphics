import { Component, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation, Link } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import categories, { pageTitle, SITE_NAME } from './categories'
import pageComponents from './pageComponents'

function Notice({ title, description, badge, children }) {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>{title}</h1>
        {description && <p className="subtitle">{description}</p>}
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
          {badge}
        </div>
        <p style={{ marginTop: 16, fontSize: 15, color: 'var(--color-navy)', lineHeight: 1.6 }}>
          {children}
        </p>
      </div>
    </div>
  )
}

function ComingSoonPage({ label, description }) {
  return (
    <Notice title={label} description={description} badge="COMING SOON">
      This one isn't ready to share yet. Check back soon — or{' '}
      <Link to="/" style={{ color: 'var(--color-accent)' }}>explore the rest of the site</Link>.
    </Notice>
  )
}

function NotFoundPage() {
  return (
    <Notice title="Page not found" badge="404">
      There's nothing at this address. Try the{' '}
      <Link to="/" style={{ color: 'var(--color-accent)' }}>full list of visualizations</Link>.
    </Notice>
  )
}

// A page chunk can fail to load when someone has the site open across a deploy (the old
// hashed file is gone) or on a flaky connection. Reload once to pick up the new build;
// otherwise show a message instead of a blank page.
const CHUNK_ERROR = /dynamically imported module|Importing a module script failed|Failed to fetch|error loading dynamically/i
const RELOAD_KEY = 'mny-chunk-reload'

class PageErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidUpdate(prevProps) {
    if (this.state.error && prevProps.resetKey !== this.props.resetKey) this.setState({ error: null })
  }

  componentDidCatch(error) {
    if (!CHUNK_ERROR.test(String(error?.message))) return
    try {
      const last = Number(sessionStorage.getItem(RELOAD_KEY) || 0)
      if (Date.now() - last > 10000) {
        sessionStorage.setItem(RELOAD_KEY, String(Date.now()))
        window.location.reload()
      }
    } catch {
      // Storage blocked: fall through to the message.
    }
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <Notice title="Something went wrong" badge="ERROR">
        This page didn't load. Please{' '}
        <a href={window.location.href} style={{ color: 'var(--color-accent)' }}>reload</a>{' '}
        to try again.
      </Notice>
    )
  }
}

// Scroll to the top and update the tab title on every page change.
function RouteEffects({ isEmbed }) {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    const slug = pathname.replace(/^\/(embed\/)?/, '').replace(/\/+$/, '')
    const category = categories.find((c) => c.slug === slug)
    if (category) document.title = pageTitle(category)
    else if (pathname === '/') document.title = SITE_NAME
    else document.title = `Page not found — ${SITE_NAME}`
  }, [pathname])

  useEffect(() => {
    if (!hash && !isEmbed) window.scrollTo(0, 0)
  }, [pathname, hash, isEmbed])

  return null
}

export default function App() {
  const location = useLocation()
  const isEmbed = location.pathname.startsWith('/embed/')
  const fallback = <div className="page-container">Loading…</div>

  if (isEmbed) {
    return (
      <div className="embed-wrapper">
        <RouteEffects isEmbed />
        <PageErrorBoundary resetKey={location.pathname}>
          <Suspense fallback={fallback}>
            <Routes>
              {categories.filter(c => !c.comingSoon).map(({ slug }) => {
                const Page = pageComponents[slug]
                return <Route key={slug} path={`/embed/${slug}`} element={<Page />} />
              })}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </PageErrorBoundary>
      </div>
    )
  }

  return (
    <Layout>
      <RouteEffects />
      <PageErrorBoundary resetKey={location.pathname}>
        <Suspense fallback={fallback}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            {categories.map(({ slug, comingSoon, label, description }) => {
              const Page = pageComponents[slug]
              return (
                <Route
                  key={slug}
                  path={`/${slug}`}
                  element={comingSoon ? <ComingSoonPage label={label} description={description} /> : <Page />}
                />
              )
            })}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </PageErrorBoundary>
    </Layout>
  )
}
