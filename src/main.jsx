import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// GitHub Pages redirects /page to /page/ when the page has its own folder. Drop the
// trailing slash so shared links, QR codes and embed codes all use one canonical URL.
const { pathname, search, hash } = window.location
if (pathname.length > 1 && pathname.endsWith('/')) {
  // Collapse leading slashes too: "//host" would be read as a different origin.
  const clean = '/' + pathname.replace(/^\/+|\/+$/g, '')
  window.history.replaceState(null, '', clean + search + hash)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
