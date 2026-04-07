import { useRef } from 'react'
import PedestrianTrafficMap from '../components/PedestrianTrafficMap'
import ShareMenu from '../components/ShareMenu'

export default function PedestrianTrafficPage() {
  const cardRef = useRef(null)

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>NYC Pedestrian Foot Traffic</h1>
        <p className="subtitle">
          Estimated peak-period pedestrian volumes across every sidewalk and crosswalk in all five boroughs.
        </p>
      </div>

      <div style={{
        maxWidth: 780, margin: '0 auto 32px', padding: '0 16px',
        fontSize: 15, lineHeight: 1.75, color: 'var(--color-navy)',
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <p style={{ marginBottom: 12 }}>
          This map visualizes data from{' '}
          <a href="https://doi.org/10.1038/s44284-025-00383-y"
            target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)' }}>
            "Spatial distribution of foot traffic in New York City and applications for urban planning"
          </a>, published in{' '}
          <a href="https://www.nature.com/natcities/"
            target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)' }}>
            <em>Nature Cities</em>
          </a>{' '}
          by Andres Sevtsuk, Rounaq Basu, Liye Liu, Abdulaziz Alhassan, and Jack Kollar of the{' '}
          <a href="http://cityform.mit.edu/projects/nycwalks"
            target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)' }}>
            MIT City Form Lab
          </a>.
          The model estimates pedestrian volumes for peak travel periods using baseline counts from the
          NYC Department of Transportation, mapped onto a routable network of every pavement, crosswalk,
          and footpath across the five boroughs.
        </p>
        <p style={{ marginBottom: 12 }}>
          Color and thickness encode estimated pedestrians per block per hour.
          Use the controls to toggle between weekday and weekend, and between
          AM peak, midday, and PM peak periods. Hover over any segment to see
          the full set of volume estimates. Zoom in to see individual street-level detail.
        </p>

        {/* Error reporting box */}
        <div style={{
          margin: '20px 0', padding: '14px 18px',
          background: 'var(--color-highlight)',
          border: '1px solid #e0c97f',
          borderRadius: 8, fontSize: 14,
        }}>
          <strong>Spot an error?</strong>{' '}
          Please email{' '}
          <a href="mailto:daniel@maximumnewyork.com" style={{ color: 'var(--color-accent)', fontWeight: 600 }}>
            daniel@maximumnewyork.com
          </a>{' '}
          and we'll fix it.
        </div>
      </div>

      <div className="chart-card dark-card" ref={cardRef} style={{ overflow: 'hidden', padding: 0 }}>
        <div style={{ padding: '16px 20px 0' }}>
          <ShareMenu chartRef={cardRef} chartId="pedestrian-traffic" title="NYC Pedestrian Foot Traffic" dark />
        </div>
        <PedestrianTrafficMap />
      </div>

      {/* Sources & methodology */}
      <div style={{
        maxWidth: 780, margin: '32px auto 0', padding: '0 16px',
        fontSize: 14, lineHeight: 1.75, color: 'var(--color-text-secondary)',
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-navy)', marginBottom: 8 }}>
          How this visualization was made
        </h3>
        <p style={{ marginBottom: 12 }}>
          The underlying dataset contains 315,577 street segments with modeled pedestrian volume estimates
          for six peak periods (weekday and weekend, each with AM, midday, and PM). We downloaded the{' '}
          <a href="http://cityform.mit.edu/projects/nycwalks"
            target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)' }}>
            publicly available GeoJSON
          </a>{' '}
          from the MIT City Form Lab, reprojected it from NAD83 / New York Long Island (EPSG:32118) to
          WGS84 latitude/longitude, and converted it into a compact flat-array format (reducing the file
          from 262 MB to 18 MB) for efficient browser rendering. The map uses{' '}
          <a href="https://leafletjs.com/" target="_blank" rel="noopener noreferrer"
            style={{ color: 'var(--color-accent)' }}>Leaflet</a>{' '}
          with a custom Canvas overlay that draws all 315K segments via batched draw calls, color-coded
          and width-scaled by volume.
        </p>

        <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-navy)', marginBottom: 8, marginTop: 20 }}>
          Sources
        </h3>
        <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
          <li style={{ marginBottom: 6 }}>
            Sevtsuk, A., Basu, R., Liu, L., Alhassan, A., & Kollar, J. (2026).
            "Spatial distribution of foot traffic in New York City and applications for urban planning."{' '}
            <em>Nature Cities</em>.{' '}
            <a href="https://doi.org/10.1038/s44284-025-00383-y"
              target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)' }}>
              doi:10.1038/s44284-025-00383-y
            </a>
          </li>
          <li style={{ marginBottom: 6 }}>
            Dataset:{' '}
            <a href="http://cityform.mit.edu/projects/nycwalks"
              target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)' }}>
              NYCWalks — MIT City Form Lab
            </a>{' '}
            (pedestrian network estimates and counts, 2018–2019)
          </li>
          <li style={{ marginBottom: 6 }}>
            MIT News coverage:{' '}
            <a href="https://news.mit.edu/2026/new-model-maps-foot-traffic-new-york-city-0206"
              target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)' }}>
              "I'm walking here!"
            </a>
          </li>
          <li>
            Basemap tiles:{' '}
            <a href="https://carto.com/basemaps/" target="_blank" rel="noopener noreferrer"
              style={{ color: 'var(--color-accent)' }}>
              CARTO Dark Matter
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}
