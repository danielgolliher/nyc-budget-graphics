export default function CouncilQuestPage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>NYC Council Quest</h1>
        <p className="subtitle">
          Walk Manhattan's 10 council districts, meet your representatives, explore their legislation, and email their offices — all in a retro 2D game.
        </p>
      </div>

      <div style={{ maxWidth: 840, margin: '0 auto', padding: '0 8px' }}>
        <iframe
          src="/council-quest/game.html"
          title="NYC Council Quest"
          style={{
            width: '100%',
            height: 680,
            border: '4px solid #333',
            borderRadius: 4,
            background: '#0a0a0a',
          }}
          allow="autoplay"
        />
      </div>

      <div style={{
        maxWidth: 780, margin: '20px auto 0', padding: '0 16px',
        fontSize: 13, color: '#888', lineHeight: 1.6,
        fontFamily: "'DM Sans', sans-serif",
        textAlign: 'center',
      }}>
        <p>
          Arrow keys to move &middot; Space to interact &middot; / to search by address &middot; +/- to zoom &middot; ESC for instructions
        </p>
        <p style={{ marginTop: 8 }}>
          Data from{' '}
          <a href="https://council.nyc.gov/districts/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)' }}>council.nyc.gov</a>,{' '}
          <a href="https://intro.nyc" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)' }}>intro.nyc</a>, and{' '}
          <a href="https://data.cityofnewyork.us" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)' }}>NYC Open Data</a>.
          Squirrel Census data from{' '}
          <a href="https://data.cityofnewyork.us/Environment/2018-Central-Park-Squirrel-Census-Squirrel-Data/vfnx-vebw" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)' }}>dataset vfnx-vebw</a>.
        </p>
      </div>
    </div>
  )
}
