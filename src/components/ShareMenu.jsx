import { useState, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import html2canvas from 'html2canvas'

export default function ShareMenu({ chartRef, chartId, title, dark, onDownload }) {
  const [copied, setCopied] = useState(false)
  const [showEmbed, setShowEmbed] = useState(false)
  const [embedCopied, setEmbedCopied] = useState(false)

  const location = useLocation()
  const origin = window.location.origin
  const pageUrl = `${origin}${location.pathname}`
  const embedUrl = `${origin}/embed${location.pathname}`

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(pageUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [pageUrl])

  const handleDownload = useCallback(async () => {
    if (!chartRef?.current) return
    try {
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        ignoreElements: (el) => el.classList.contains('share-menu-controls'),
      })

      // Create a new canvas with credit bar
      const creditH = 40
      const finalCanvas = document.createElement('canvas')
      finalCanvas.width = canvas.width
      finalCanvas.height = canvas.height + creditH * 2 // scale 2
      const ctx = finalCanvas.getContext('2d')

      // Draw chart
      ctx.drawImage(canvas, 0, 0)

      // Draw credit bar
      ctx.fillStyle = '#BE5343'
      ctx.fillRect(0, canvas.height, finalCanvas.width, creditH * 2)
      ctx.fillStyle = '#FFFFFF'
      ctx.font = `${13 * 2}px -apple-system, BlinkMacSystemFont, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(
        `Source: Maximum New York | maximumnewyork.com | ${pageUrl}`,
        finalCanvas.width / 2,
        canvas.height + creditH,
      )

      const link = document.createElement('a')
      link.download = `${chartId}.png`
      link.href = finalCanvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error('Download failed:', err)
    }
  }, [chartRef, chartId, pageUrl])

  const embedCode = `<iframe src="${embedUrl}" width="100%" height="600" frameborder="0" title="${title} — Maximum New York"></iframe>`

  const handleCopyEmbed = useCallback(() => {
    navigator.clipboard.writeText(embedCode).then(() => {
      setEmbedCopied(true)
      setTimeout(() => setEmbedCopied(false), 2000)
    })
  }, [embedCode])

  return (
    <div className="share-menu">
      <div className="share-menu-controls">
        <button className="share-btn" onClick={handleCopyLink} title="Copy link">
          {copied ? '✓ Copied' : 'Link'}
        </button>
        <button className="share-btn" onClick={onDownload || handleDownload} title="Download as PNG">
          Download
        </button>
        <button className="share-btn" onClick={() => setShowEmbed(!showEmbed)} title="Get embed code">
          Embed
        </button>
        {showEmbed && (
          <div className="embed-popover">
            <textarea readOnly value={embedCode} rows={3} />
            <button className="embed-copy-btn" onClick={handleCopyEmbed}>
              {embedCopied ? '✓ Copied' : 'Copy code'}
            </button>
          </div>
        )}
      </div>
      <div className="chart-qr" title={pageUrl}>
        <QRCodeSVG
          value={pageUrl}
          size={48}
          level="L"
          bgColor="transparent"
          fgColor={dark ? 'rgba(255,255,255,0.3)' : 'rgba(27,42,74,0.2)'}
        />
      </div>
    </div>
  )
}
