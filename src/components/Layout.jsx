import { useState, useRef, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import categories from '../categories'
import PigeonOverlay from './PigeonOverlay'

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [pigeonsActive, setPigeonsActive] = useState(false)
  const location = useLocation()
  const pageUrl = `${window.location.origin}${location.pathname}`
  const dropdownRef = useRef(null)

  const closeMenu = () => {
    setMenuOpen(false)
    setDropdownOpen(false)
  }

  const anyChildActive = categories.some(({ slug }) => location.pathname === '/' + slug)

  // Close dropdown on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    const handleEscape = (e) => {
      if (e.key === 'Escape') setDropdownOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <Link to="/" className="navbar-brand" onClick={closeMenu}>
            <span className="brand-monogram">MNY</span>
            <span className="brand-name">Maximum New York</span>
            <span className="brand-rule" />
            <span className="brand-sub">Data Viz & Art</span>
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
            <div
              className="nav-dropdown"
              ref={dropdownRef}
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button
                className={`nav-dropdown-trigger${anyChildActive ? ' active' : ''}`}
                onClick={() => setDropdownOpen((o) => !o)}
              >
                Explore
                <svg
                  className={`dropdown-chevron${dropdownOpen ? ' open' : ''}`}
                  width="10"
                  height="6"
                  viewBox="0 0 10 6"
                  fill="none"
                >
                  <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div className={`nav-dropdown-menu${dropdownOpen ? ' open' : ''}`}>
                {categories.map(({ slug, label, navLabel }) => (
                  <NavLink
                    key={slug}
                    to={`/${slug}`}
                    className={({ isActive }) => `nav-dropdown-item${isActive ? ' active' : ''}`}
                    onClick={closeMenu}
                  >
                    {navLabel || label}
                  </NavLink>
                ))}
              </div>
            </div>
            <button
              className={`pigeon-toggle${pigeonsActive ? ' active' : ''}`}
              onClick={() => setPigeonsActive((p) => !p)}
              title={pigeonsActive ? 'Disable pigeons' : 'Release the pigeons'}
            >
              Pigeons
            </button>
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
            <div className="footer-social">
              <a href="https://x.com/danielgolliher" target="_blank" rel="noopener noreferrer" aria-label="X / Twitter">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://linkedin.com/in/danielgolliher" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
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
      <PigeonOverlay active={pigeonsActive} />
    </>
  )
}
