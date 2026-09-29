// Three-step, non-technical diagram: your computer → GitHub → someone else's computer.
// Pure HTML/CSS (styles in index.css under "How It Works Diagram") so it stacks on mobile.
import { Fragment } from 'react'

function LaptopIcon({ person }) {
  return (
    <svg viewBox="0 0 64 48" className="hiw-icon" aria-hidden="true">
      <rect x="10" y="6" width="44" height="30" rx="3" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <path d="M4 40 H60 L56 44 H8 Z" fill="currentColor" />
      {person ? (
        <>
          <circle cx="32" cy="17" r="5" fill="currentColor" opacity="0.85" />
          <path d="M22 32 C22 25 42 25 42 32" fill="currentColor" opacity="0.85" />
        </>
      ) : (
        <>
          <rect x="16" y="12" width="20" height="4" rx="2" fill="currentColor" opacity="0.85" />
          <rect x="16" y="20" width="32" height="3" rx="1.5" fill="currentColor" opacity="0.5" />
          <rect x="16" y="26" width="26" height="3" rx="1.5" fill="currentColor" opacity="0.5" />
        </>
      )}
    </svg>
  )
}

function CloudIcon() {
  return (
    <svg viewBox="0 0 64 48" className="hiw-icon" aria-hidden="true">
      <path
        d="M18 38 C9 38 6 30 10 25 C8 17 17 12 23 16 C26 8 40 7 43 16 C52 14 58 21 55 28 C60 32 57 38 50 38 Z"
        fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"
      />
      <rect x="22" y="22" width="9" height="11" rx="1.5" fill="currentColor" opacity="0.85" />
      <rect x="33" y="22" width="9" height="11" rx="1.5" fill="currentColor" opacity="0.5" />
    </svg>
  )
}

function Arrow({ label }) {
  return (
    <div className="hiw-arrow">
      <svg viewBox="0 0 48 16" className="hiw-arrow-line" aria-hidden="true">
        <path d="M2 8 H40" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M36 2 L46 8 L36 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="hiw-arrow-label">{label}</span>
    </div>
  )
}

const steps = [
  {
    num: 1,
    title: 'Your computer',
    icon: <LaptopIcon person />,
    body: 'You tell Claude what you want in plain English. Claude writes and edits the website’s files for you.',
    tool: 'Claude',
    toolNote: 'the helper that writes the site',
  },
  {
    num: 2,
    title: 'GitHub (in the cloud)',
    icon: <CloudIcon />,
    body: 'The website’s files are stored online at GitHub. When you’re happy with a change, Claude sends it up here, and GitHub publishes it at a web address.',
    tool: 'GitHub',
    toolNote: 'stores the files and puts them on the web',
  },
  {
    num: 3,
    title: 'Someone else’s computer',
    icon: <LaptopIcon />,
    body: 'Anyone with the link opens it in their web browser. Their browser gets the files from GitHub and shows them your work.',
    tool: 'A web browser',
    toolNote: 'what visitors already use',
  },
]

export default function HowItWorksDiagram() {
  return (
    <div className="hiw">
      <h2>How it works</h2>
      <p className="chart-subtitle">Where your website lives, and how it gets from you to everyone else.</p>

      <div className="hiw-flow">
        {steps.map((s, i) => (
          <Fragment key={s.num}>
            <div className={`hiw-step hiw-step-${s.num}`}>
              <div className="hiw-num">{s.num}</div>
              {s.icon}
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              <div className="hiw-tool">
                <strong>{s.tool}</strong> — {s.toolNote}
              </div>
            </div>
            {i === 0 && <Arrow label="Claude sends your changes" />}
            {i === 1 && <Arrow label="Visitors load the page" />}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
