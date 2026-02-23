import { useState, useEffect, useRef, useCallback, Fragment } from 'react'
import './metExplorerStyles.css'

const API_BASE = 'https://collectionapi.metmuseum.org/public/collection/v1'

// Pre-verified European Paintings highlights (public domain, with images)
const SEED_IDS = [436535, 438817, 437853, 436528, 437329, 435809, 436965, 438012, 437984, 436573, 435621, 437397]

const DEPARTMENTS = [
  'All',
  'American Decorative Arts',
  'Ancient Near Eastern Art',
  'Arms and Armor',
  'Asian Art',
  'Costume Institute',
  'Drawings and Prints',
  'Egyptian Art',
  'European Paintings',
  'European Sculpture and Decorative Arts',
  'Greek and Roman Art',
  'Islamic Art',
  'Medieval Art',
  'Modern and Contemporary Art',
  'Musical Instruments',
  'Photographs',
  'Robert Lehman Collection',
  'Sculpture and Metalwork',
  'The American Wing',
  'The Cloisters',
]

const BATCH_SIZE = 12

// ─── Helpers ───

async function fetchObject(id, cache, signal) {
  if (cache.current.has(id)) return cache.current.get(id)
  const res = await fetch(`${API_BASE}/objects/${id}`, { signal })
  if (!res.ok) return null
  const data = await res.json()
  if (data.primaryImageSmall) {
    cache.current.set(id, data)
    return data
  }
  return null
}

async function fetchBatch(ids, cache, signal) {
  const results = await Promise.allSettled(
    ids.map(id => fetchObject(id, cache, signal))
  )
  return results
    .filter(r => r.status === 'fulfilled' && r.value)
    .map(r => r.value)
}

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ─── Sub-components ───

function SearchBar({ searchQuery, setSearchQuery, onSearch, onClear, hasResults }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) onSearch(searchQuery.trim())
  }

  return (
    <form className="met-search-bar" onSubmit={handleSubmit}>
      <input
        className="met-search-input"
        type="text"
        placeholder="Search artworks... (e.g. van gogh, Egyptian sculpture)"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />
      <button className="met-search-btn" type="submit">Search</button>
      {hasResults && (
        <button className="met-search-clear" type="button" onClick={onClear}>
          Clear
        </button>
      )}
    </form>
  )
}

function DepartmentChips({ department, onSelect }) {
  return (
    <div className="met-departments">
      {DEPARTMENTS.map(dept => (
        <button
          key={dept}
          className={`met-dept-chip${department === dept ? ' active' : ''}`}
          onClick={() => onSelect(dept)}
        >
          {dept}
        </button>
      ))}
    </div>
  )
}

function SurpriseMeButton({ onClick, loading }) {
  return (
    <button className="met-surprise-btn" onClick={onClick} disabled={loading}>
      {loading ? 'Discovering...' : 'Surprise Me'}
    </button>
  )
}

function HeroArtwork({ artwork, onClick, isFavorite, toggleFavorite }) {
  if (!artwork) return null
  return (
    <div className="met-hero" onClick={() => onClick(artwork)}>
      <img
        className="met-hero-image"
        src={artwork.primaryImageSmall}
        alt={artwork.title}
      />
      <button
        className={`met-star-btn${isFavorite(artwork.objectID) ? ' starred' : ''}`}
        onClick={e => { e.stopPropagation(); toggleFavorite(artwork) }}
        title={isFavorite(artwork.objectID) ? 'Remove from Favorites' : 'Add to Favorites'}
      >
        {isFavorite(artwork.objectID) ? '★' : '☆'}
      </button>
      <div className="met-hero-overlay">
        <div className="met-hero-title">{artwork.title}</div>
        {artwork.artistDisplayName && (
          <div className="met-hero-artist">{artwork.artistDisplayName}</div>
        )}
        {artwork.objectDate && (
          <div className="met-hero-date">{artwork.objectDate}</div>
        )}
      </div>
    </div>
  )
}

function HeroSkeleton() {
  return <div className="met-hero-skeleton" />
}

function ArtworkCard({ artwork, onClick, index, isFavorite, toggleFavorite }) {
  return (
    <div
      className="met-card"
      onClick={() => onClick(artwork)}
      style={{ animationDelay: `${(index % BATCH_SIZE) * 0.04}s` }}
    >
      <div className="met-card-image-wrap">
        <img
          src={artwork.primaryImageSmall}
          alt={artwork.title}
          loading="lazy"
          decoding="async"
        />
        <button
          className={`met-star-btn${isFavorite(artwork.objectID) ? ' starred' : ''}`}
          onClick={e => { e.stopPropagation(); toggleFavorite(artwork) }}
          title={isFavorite(artwork.objectID) ? 'Remove from Favorites' : 'Add to Favorites'}
        >
          {isFavorite(artwork.objectID) ? '★' : '☆'}
        </button>
      </div>
      <div className="met-card-info">
        <div className="met-card-title">{artwork.title}</div>
        <div className="met-card-artist">
          {artwork.artistDisplayName || artwork.department || 'Unknown'}
        </div>
      </div>
    </div>
  )
}

function CardSkeleton() {
  return (
    <div className="met-card-skeleton">
      <div className="skel-image" />
      <div className="skel-info">
        <div className="skel-line" />
        <div className="skel-line" />
      </div>
    </div>
  )
}

function DetailOverlay({ artwork, onClose, isFavorite, toggleFavorite }) {
  useEffect(() => {
    document.body.classList.add('met-overlay-open')
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.classList.remove('met-overlay-open')
      window.removeEventListener('keydown', handleKey)
    }
  }, [onClose])

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  const starred = isFavorite(artwork.objectID)

  const fields = [
    ['Department', artwork.department],
    ['Medium', artwork.medium],
    ['Dimensions', artwork.dimensions],
    ['Classification', artwork.classification],
    ['Credit Line', artwork.creditLine],
    ['Accession Number', artwork.accessionNumber],
  ].filter(([, v]) => v)

  return (
    <div className="met-detail-overlay" onClick={handleBackdrop}>
      <div className="met-detail-content">
        <button className="met-detail-close" onClick={onClose}>✕</button>
        <div className="met-detail-image-wrap">
          <img
            src={artwork.primaryImage || artwork.primaryImageSmall}
            alt={artwork.title}
          />
        </div>
        <div className="met-detail-meta">
          <h2 className="met-detail-title">{artwork.title}</h2>
          {artwork.artistDisplayName && (
            <div className="met-detail-artist">{artwork.artistDisplayName}</div>
          )}
          {artwork.objectDate && (
            <div className="met-detail-date">{artwork.objectDate}</div>
          )}
          {fields.length > 0 && (
            <div className="met-detail-fields">
              {fields.map(([label, value]) => (
                <Fragment key={label}>
                  <span className="met-detail-label">{label}</span>
                  <span className="met-detail-value">{value}</span>
                </Fragment>
              ))}
            </div>
          )}
          <div className="met-detail-actions">
            {artwork.objectURL && (
              <a
                className="met-detail-link"
                href={artwork.objectURL}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on Met Museum →
              </a>
            )}
            <button
              className={`met-detail-star${starred ? ' starred' : ''}`}
              onClick={() => toggleFavorite(artwork)}
            >
              {starred ? '★ Remove from Favorites' : '☆ Add to Favorites'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function FavoritesButton({ count, onClick }) {
  if (count === 0) return null
  return (
    <button className="met-fab" onClick={onClick} title="View Favorites">
      ★
      <span className="met-fab-badge">{count}</span>
    </button>
  )
}

const EMAIL_WORKER_URL = 'https://met-favorites-email.danielgolliher.workers.dev'

function FavoritesSidePanel({ favorites, onClose, onRemove, onSelect }) {
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [sendError, setSendError] = useState(null)

  useEffect(() => {
    document.body.classList.add('met-overlay-open')
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.classList.remove('met-overlay-open')
      window.removeEventListener('keydown', handleKey)
    }
  }, [onClose])

  const items = Array.from(favorites.values())

  const handleSend = async (e) => {
    e.preventDefault()
    if (!email.trim() || sending) return
    setSending(true)
    setSendError(null)

    const payload = {
      email: email.trim(),
      favorites: items.map(art => ({
        title: art.title,
        artist: art.artistDisplayName || null,
        date: art.objectDate || null,
        image: art.primaryImageSmall,
        url: art.objectURL || `https://www.metmuseum.org/art/collection/search/${art.objectID}`,
      })),
    }

    try {
      const res = await fetch(EMAIL_WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send')
      setSent(true)
    } catch (err) {
      setSendError(err.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <div className="met-favorites-backdrop" onClick={onClose} />
      <div className="met-favorites-panel">
        <div className="met-favorites-header">
          <h3>Your Favorites</h3>
          {items.length > 0 && (
            <span className="met-favorites-count">{items.length}</span>
          )}
          <button className="met-favorites-close" onClick={onClose}>✕</button>
        </div>
        <div className="met-favorites-notice">
          Favorites are saved for this session only — they'll be lost if you leave or refresh.
        </div>
        {items.length === 0 ? (
          <div className="met-favorites-empty">
            <div className="met-favorites-empty-star">☆</div>
            <p>Star artworks to start building your collection.</p>
          </div>
        ) : (
          <div className="met-favorites-list">
            {items.map(art => (
              <div
                key={art.objectID}
                className="met-favorites-item"
                onClick={() => onSelect(art)}
              >
                <img
                  className="met-favorites-item-thumb"
                  src={art.primaryImageSmall}
                  alt={art.title}
                />
                <div className="met-favorites-item-info">
                  <div className="met-favorites-item-title">{art.title}</div>
                  <div className="met-favorites-item-artist">
                    {art.artistDisplayName || art.department || 'Unknown'}
                  </div>
                </div>
                <button
                  className="met-favorites-item-remove"
                  onClick={e => { e.stopPropagation(); onRemove(art) }}
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
        {items.length > 0 && (
          <div className="met-favorites-footer">
            {sent ? (
              <div className="met-email-success">
                <span className="met-email-success-icon">✓</span>
                Sent! Check your inbox.
              </div>
            ) : (
              <>
                <label>Send this list to yourself</label>
                <form className="met-email-form" onSubmit={handleSend}>
                  <input
                    className="met-email-input"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    disabled={sending}
                    required
                  />
                  <button className="met-email-btn" type="submit" disabled={!email.trim() || sending}>
                    {sending ? 'Sending...' : 'Send'}
                  </button>
                </form>
                {sendError && (
                  <div className="met-email-error">{sendError}</div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </>
  )
}

// ─── Main Component ───

export default function MetExplorer() {
  const [artworks, setArtworks] = useState([])
  const [featured, setFeatured] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [department, setDepartment] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedArtwork, setSelectedArtwork] = useState(null)
  const [error, setError] = useState(null)
  const [allIds, setAllIds] = useState([])
  const [loadedCount, setLoadedCount] = useState(0)
  const [favorites, setFavorites] = useState(() => new Map())
  const [showFavorites, setShowFavorites] = useState(false)

  const objectCache = useRef(new Map())
  const abortRef = useRef(null)

  const toggleFavorite = useCallback((artwork) => {
    setFavorites(prev => {
      const next = new Map(prev)
      if (next.has(artwork.objectID)) {
        next.delete(artwork.objectID)
      } else {
        next.set(artwork.objectID, artwork)
      }
      return next
    })
  }, [])

  const isFavorite = useCallback((objectID) => {
    return favorites.has(objectID)
  }, [favorites])

  const abortPrevious = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort()
    }
    abortRef.current = new AbortController()
    return abortRef.current.signal
  }, [])

  // Initial load with seed IDs
  useEffect(() => {
    const signal = abortPrevious()
    let cancelled = false

    async function loadInitial() {
      setLoading(true)
      setError(null)
      try {
        const objects = await fetchBatch(SEED_IDS, objectCache, signal)
        if (cancelled) return
        if (objects.length > 0) {
          setFeatured(objects[0])
          setArtworks(objects.slice(1))
        }

        // Background-fetch full list for load-more
        const res = await fetch(
          `${API_BASE}/search?hasImages=true&isPublicDomain=true&q=*&departmentId=11`,
          { signal }
        )
        if (!res.ok) throw new Error('Failed to fetch artwork list')
        const data = await res.json()
        if (!cancelled && data.objectIDs) {
          const filtered = shuffleArray(
            data.objectIDs.filter(id => !SEED_IDS.includes(id))
          )
          setAllIds(filtered)
          setLoadedCount(0)
        }
      } catch (err) {
        if (err.name === 'AbortError') return
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadInitial()
    return () => { cancelled = true }
  }, [abortPrevious])

  const loadDepartment = useCallback(async (dept) => {
    const signal = abortPrevious()
    setLoading(true)
    setError(null)
    setSearchTerm('')
    setSearchQuery('')
    setDepartment(dept)

    try {
      const deptParam = dept === 'All' ? '' : `&departmentId=${DEPARTMENTS.indexOf(dept)}`
      const res = await fetch(
        `${API_BASE}/search?hasImages=true&isPublicDomain=true&q=*${deptParam}`,
        { signal }
      )
      if (!res.ok) throw new Error('Search failed')
      const data = await res.json()
      if (!data.objectIDs || data.objectIDs.length === 0) {
        setFeatured(null)
        setArtworks([])
        setAllIds([])
        setLoadedCount(0)
        setLoading(false)
        return
      }

      const shuffled = shuffleArray(data.objectIDs)
      const batch = shuffled.slice(0, BATCH_SIZE + 1)
      const objects = await fetchBatch(batch, objectCache, signal)

      setFeatured(objects[0] || null)
      setArtworks(objects.slice(1))
      setAllIds(shuffled.slice(BATCH_SIZE + 1))
      setLoadedCount(0)
    } catch (err) {
      if (err.name === 'AbortError') return
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [abortPrevious])

  const handleSearch = useCallback(async (query) => {
    const signal = abortPrevious()
    setLoading(true)
    setError(null)
    setSearchTerm(query)

    try {
      const deptParam = department !== 'All'
        ? `&departmentId=${DEPARTMENTS.indexOf(department)}`
        : ''
      const res = await fetch(
        `${API_BASE}/search?hasImages=true&isPublicDomain=true&q=${encodeURIComponent(query)}${deptParam}`,
        { signal }
      )
      if (!res.ok) throw new Error('Search failed')
      const data = await res.json()
      if (!data.objectIDs || data.objectIDs.length === 0) {
        setFeatured(null)
        setArtworks([])
        setAllIds([])
        setLoadedCount(0)
        setLoading(false)
        return
      }

      const ids = data.objectIDs
      const batch = ids.slice(0, BATCH_SIZE + 1)
      const objects = await fetchBatch(batch, objectCache, signal)

      setFeatured(objects[0] || null)
      setArtworks(objects.slice(1))
      setAllIds(ids.slice(BATCH_SIZE + 1))
      setLoadedCount(0)
    } catch (err) {
      if (err.name === 'AbortError') return
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [abortPrevious, department])

  const handleClearSearch = useCallback(() => {
    setSearchTerm('')
    setSearchQuery('')
    loadDepartment(department)
  }, [department, loadDepartment])

  const handleSurpriseMe = useCallback(() => {
    const randomDept = DEPARTMENTS[Math.floor(Math.random() * (DEPARTMENTS.length - 1)) + 1]
    setDepartment(randomDept)
    loadDepartment(randomDept)
  }, [loadDepartment])

  const handleLoadMore = useCallback(async () => {
    if (loadingMore || allIds.length === 0) return
    setLoadingMore(true)

    const signal = abortRef.current?.signal
    const nextBatch = allIds.slice(loadedCount, loadedCount + BATCH_SIZE)
    if (nextBatch.length === 0) {
      setLoadingMore(false)
      return
    }

    try {
      const objects = await fetchBatch(nextBatch, objectCache, signal)
      setArtworks(prev => [...prev, ...objects])
      setLoadedCount(prev => prev + BATCH_SIZE)
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message)
      }
    } finally {
      setLoadingMore(false)
    }
  }, [allIds, loadedCount, loadingMore])

  const handleDepartmentSelect = useCallback((dept) => {
    if (dept === department) return
    loadDepartment(dept)
  }, [department, loadDepartment])

  const hasMore = loadedCount + BATCH_SIZE < allIds.length

  return (
    <div className="met-explorer">
      {/* Hero */}
      {loading ? <HeroSkeleton /> : (
        featured && <HeroArtwork artwork={featured} onClick={setSelectedArtwork} isFavorite={isFavorite} toggleFavorite={toggleFavorite} />
      )}

      {/* Favorites Tip */}
      <div className="met-favorites-tip">
        <span className="met-favorites-tip-star">★</span>
        <span>
          Star your favorite artworks as you browse, then send the list to yourself via email.
          Click the gold button in the bottom-right corner to view your picks.
        </span>
      </div>

      {/* Search */}
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
        onClear={handleClearSearch}
        hasResults={!!searchTerm}
      />

      {/* Department Chips */}
      <DepartmentChips department={department} onSelect={handleDepartmentSelect} />

      {/* Surprise Me */}
      <SurpriseMeButton onClick={handleSurpriseMe} loading={loading} />

      {/* Results Info */}
      {searchTerm && !loading && (
        <div className="met-results-info">
          Showing results for <strong>"{searchTerm}"</strong>
          {department !== 'All' && <> in <strong>{department}</strong></>}
          {allIds.length > 0 && <> — {allIds.length + artworks.length + (featured ? 1 : 0)} artworks found</>}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="met-error">
          <div className="met-error-title">Something went wrong</div>
          <div className="met-error-msg">{error}</div>
          <button className="met-error-retry" onClick={() => loadDepartment(department)}>
            Try Again
          </button>
        </div>
      )}

      {/* Gallery Grid */}
      {loading ? (
        <div className="met-gallery-grid">
          {Array.from({ length: BATCH_SIZE }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          {artworks.length > 0 && (
            <div className="met-gallery-grid">
              {artworks.map((art, i) => (
                <ArtworkCard
                  key={art.objectID}
                  artwork={art}
                  onClick={setSelectedArtwork}
                  index={i}
                  isFavorite={isFavorite}
                  toggleFavorite={toggleFavorite}
                />
              ))}
              {loadingMore && Array.from({ length: BATCH_SIZE }).map((_, i) => (
                <CardSkeleton key={`loading-${i}`} />
              ))}
            </div>
          )}

          {!loading && !error && artworks.length === 0 && !featured && (
            <div className="met-error">
              <div className="met-error-title">No artworks found</div>
              <div className="met-error-msg">Try a different search term or department.</div>
            </div>
          )}

          {hasMore && artworks.length > 0 && (
            <div className="met-load-more">
              <button
                className="met-load-more-btn"
                onClick={handleLoadMore}
                disabled={loadingMore}
              >
                {loadingMore ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}

      {/* Detail Overlay */}
      {selectedArtwork && (
        <DetailOverlay
          artwork={selectedArtwork}
          onClose={() => setSelectedArtwork(null)}
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
        />
      )}

      {/* Favorites FAB */}
      <FavoritesButton count={favorites.size} onClick={() => setShowFavorites(true)} />

      {/* Favorites Side Panel */}
      {showFavorites && (
        <FavoritesSidePanel
          favorites={favorites}
          onClose={() => setShowFavorites(false)}
          onRemove={toggleFavorite}
          onSelect={(art) => { setShowFavorites(false); setSelectedArtwork(art) }}
        />
      )}
    </div>
  )
}
