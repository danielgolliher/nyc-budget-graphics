// The 119th Congress Lawbook is a self-contained explorer (public/lawbook/app.html, mirrored from
// github.com/danielgolliher/lawbook). It brings its own title, so the page is just the app, filling
// the viewport under the navbar. A #law-119-N anchor on this page opens that law inside the frame.
export default function LawbookPage() {
  const hash = /^#law-119-\d+$/.test(window.location.hash) ? window.location.hash : ''
  return (
    <iframe
      src={`/lawbook/app.html${hash}`}
      title="119th Congress Lawbook"
      style={{
        display: 'block',
        width: '100%',
        height: 'calc(100svh - var(--nav-height))',
        border: 0,
      }}
    />
  )
}
