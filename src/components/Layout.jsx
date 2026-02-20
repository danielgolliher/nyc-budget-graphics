import { useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import categories from '../categories'

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const pageUrl = `${window.location.origin}${location.pathname}`

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <Link to="/" className="navbar-brand" onClick={closeMenu}>
            <span className="brand-name">Maximum New York</span>
            <span className="brand-rule" />
            <span className="brand-sub">Data Viz</span>
          </Link>

          <button
            className={`navbar-toggle${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>

          <div className={`navbar-links${menuOpen ? ' open' : ''}`}>
            <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')} end onClick={closeMenu}>
              Home
            </NavLink>
            {categories.map(({ slug, label }) => (
              <NavLink
                key={slug}
                to={`/${slug}`}
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={closeMenu}
              >
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {menuOpen && <div className="navbar-overlay" onClick={closeMenu} />}

      <main>
        {children}
      </main>
      <footer className="site-footer">
        <div className="footer-content">
          <div>
            <div className="footer-attribution">
              Brought to you by Daniel Golliher and{' '}
              <a href="https://maximumnewyork.com" target="_blank" rel="noopener noreferrer">
                Maximum New York
              </a>
            </div>
          </div>
          <div className="footer-qr" title={pageUrl}>
            <QRCodeSVG
              value={pageUrl}
              size={56}
              level="L"
              bgColor="transparent"
              fgColor="rgba(27,42,74,0.2)"
            />
          </div>
        </div>
      </footer>
    </>
  )
}
