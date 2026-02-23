import MetExplorer from '../components/MetExplorer'

export default function MetExplorerPage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Met Museum Art Explorer</h1>
        <p className="subtitle">
          Discover and explore 500,000+ artworks from The Metropolitan Museum of Art's open collection.
        </p>
      </div>
      <MetExplorer />
    </div>
  )
}
