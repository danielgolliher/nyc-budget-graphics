// Large Loads is a self-contained scrolling guide (public/large-loads/guide.html, mirrored from
// github.com/danielgolliher/large-loads). It brings its own title, so the page is just the
// guide, filling the viewport under the navbar.
export default function LargeLoadsPage() {
  return (
    <iframe
      src="/large-loads/guide.html"
      title="Large Loads"
      style={{
        display: 'block',
        width: '100%',
        height: 'calc(100svh - var(--nav-height))',
        border: 0,
        background: '#0f2d6b',
      }}
    />
  )
}
