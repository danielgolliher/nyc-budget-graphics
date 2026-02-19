import { NavLink } from 'react-router-dom'

export default function Layout({ children }) {
  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <div className="navbar-brand">
            <span>New York City Budget Graphics</span>
            <span className="brand-rule" />
            <span className="brand-sub">Data & Visualization</span>
          </div>
          <div className="navbar-links">
            <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
              Expense Budget
            </NavLink>
            {/* Add future nav links here, e.g.: */}
            {/* <NavLink to="/revenue">Revenue</NavLink> */}
            {/* <NavLink to="/headcount">Headcount</NavLink> */}
          </div>
        </div>
      </nav>
      <main>
        {children}
      </main>
      <footer className="site-footer">
        Source: NYC Office of Management and Budget. All figures are nominal dollars from adopted or preliminary budgets.
      </footer>
    </>
  )
}
