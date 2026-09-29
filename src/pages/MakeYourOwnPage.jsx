import { useRef, useState } from 'react'
import HowItWorksDiagram from '../components/HowItWorksDiagram'
import ShareMenu from '../components/ShareMenu'

const starterPrompt =
  'I’m new to website design, hosting, and GitHub, but I’m smart and learn quickly. ' +
  'I’d like your help building a simple website and publishing it online with a free GitHub account. ' +
  'Please guide me step by step, tell me what each tool does and why we’re using it, and explain any jargon the first time it comes up. ' +
  'You don’t need to oversimplify — just don’t assume I already know how any of this works.'

export default function MakeYourOwnPage() {
  const cardRef = useRef(null)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(starterPrompt).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>You Can Make One of These</h1>
        <p className="subtitle">
          Every page on this site was built by talking to Claude, an AI assistant, and storing the
          files on GitHub. Anyone can do the same, with no programming background required.
        </p>
      </div>

      <div className="chart-card" ref={cardRef}>
        <ShareMenu chartRef={cardRef} chartId="make-your-own" title="How a Website Like This Works" />
        <HowItWorksDiagram />
      </div>

      <div className="myo-prose">
        <h2>What you need</h2>
        <ol>
          <li>
            <strong>A <a href="https://claude.ai" target="_blank" rel="noopener noreferrer">Claude</a> account.</strong>{' '}
            This is who you talk to. You describe the page you want, like &ldquo;a chart of
            my town&rsquo;s budget&rdquo; or &ldquo;a map of the parks near me,&rdquo; and
            Claude builds it, then changes it as you give feedback.
          </li>
          <li>
            <strong>A free <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a> account.</strong>{' '}
            This is where your website&rsquo;s files live. GitHub keeps a copy of every
            version and can publish your site at a web address you can share.
          </li>
          <li>
            <strong>An idea.</strong> A question you&rsquo;re curious about, some numbers you want
            people to understand, or just something fun.
          </li>
        </ol>

        <h2>How to start</h2>
        <p>
          Once you have both accounts, ask Claude to help you connect them. Then just describe what
          you want. Claude will make the files and put them on GitHub for you, and within a few
          minutes you&rsquo;ll have a link you can send to anyone.
        </p>
        <p>
          You don&rsquo;t need to understand the code. You look at the result, say what you&rsquo;d
          like changed, and repeat until it&rsquo;s right.
        </p>

        <h2>A prompt to get you started</h2>
        <p>Copy this and paste it as your first message to Claude:</p>
        <div className="myo-prompt">
          <p>{starterPrompt}</p>
          <button type="button" className="myo-copy-btn" onClick={handleCopy}>
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  )
}
