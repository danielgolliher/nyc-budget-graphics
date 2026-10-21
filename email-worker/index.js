// Sends a visitor their Met Explorer favorites. Anyone on the internet can call this URL,
// so the worker trusts as little as possible: it only accepts JSON posted from the site,
// rate-limits by IP and by recipient, and builds the email from the Met's own API rather
// than from text in the request. That keeps it from being used to mail arbitrary messages
// from favorites@data.maximumnewyork.com.

const ALLOWED_ORIGINS = [
  'https://data.maximumnewyork.com',
  'http://localhost:5173',
  'http://localhost:4173',
]

const MAX_BODY_BYTES = 64 * 1024
// Each favorite is looked up on the Met API, and the Workers free plan allows 50
// subrequests per call (one more goes to Resend).
const MAX_FAVORITES = 40
const MET_API = 'https://collectionapi.metmuseum.org/public/collection/v1/objects/'

function corsHeaders(request) {
  const origin = request.headers.get('Origin') || ''
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  }
}

function json(request, status, data) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders(request), 'Content-Type': 'application/json' },
  })
}

function buildEmailHTML(favorites) {
  const artworkRows = favorites.map((art, i) => `
    <tr>
      <td style="padding: 16px 0; border-bottom: 1px solid #EDE8DF;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td width="80" valign="top" style="padding-right: 16px;">
              <a href="${escapeHtml(art.url)}" target="_blank" style="text-decoration: none;">
                ${art.image ? `<img src="${escapeHtml(art.image)}" alt="${escapeHtml(art.title)}"
                  width="80" height="80"
                  style="border-radius: 6px; object-fit: cover; display: block; background: #EDE8DF;" />` : '<div style="width: 80px; height: 80px; border-radius: 6px; background: #EDE8DF;"></div>'}
              </a>
            </td>
            <td valign="top">
              <a href="${escapeHtml(art.url)}" target="_blank"
                style="font-family: Georgia, 'Times New Roman', serif; font-size: 16px; font-weight: 700; color: #2C2418; text-decoration: none; line-height: 1.3;">
                ${escapeHtml(art.title)}
              </a>
              ${art.artist ? `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; color: #6B5E50; margin-top: 4px;">${escapeHtml(art.artist)}</div>` : ''}
              ${art.date ? `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; color: #A09888; margin-top: 2px;">${escapeHtml(art.date)}</div>` : ''}
              <div style="margin-top: 8px;">
                <a href="${escapeHtml(art.url)}" target="_blank"
                  style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; color: #B8860B; text-decoration: none; font-weight: 600;">
                  View on Met Museum &rarr;
                </a>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>`).join('')

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background: #F5F0E8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #F5F0E8;">
    <tr>
      <td align="center" style="padding: 32px 16px;">
        <table cellpadding="0" cellspacing="0" border="0" width="560" style="max-width: 560px; width: 100%;">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #B8860B, #D4A017); border-radius: 12px 12px 0 0; padding: 32px 28px; text-align: center;">
              <div style="font-size: 28px; margin-bottom: 8px;">&#9733;</div>
              <h1 style="font-family: Georgia, 'Times New Roman', serif; font-size: 24px; font-weight: 700; color: #FFFFFF; margin: 0 0 6px; line-height: 1.2;">
                Your Met Museum Favorites
              </h1>
              <div style="font-size: 14px; color: rgba(255,255,255,0.85);">
                ${favorites.length} artwork${favorites.length === 1 ? '' : 's'} curated on Maximum New York Data Viz & Art
              </div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background: #FFFFFF; padding: 8px 28px 28px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                ${artworkRows}
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #FDFBF7; border-top: 1px solid #EDE8DF; border-radius: 0 0 12px 12px; padding: 24px 28px; text-align: center;">
              <a href="https://data.maximumnewyork.com/met-explorer" target="_blank"
                style="display: inline-block; padding: 12px 28px; background: #B8860B; color: #FFFFFF; font-size: 14px; font-weight: 700; text-decoration: none; border-radius: 8px;">
                Explore More Art
              </a>
              <div style="margin-top: 16px; font-size: 12px; color: #A09888; line-height: 1.5;">
                <a href="https://data.maximumnewyork.com" target="_blank" style="color: #B8860B; text-decoration: none; font-weight: 600;">Maximum New York</a>
                &middot; data.maximumnewyork.com
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function escapeHtml(str) {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const EMAIL_RE = /^[A-Za-z0-9._%+-]{1,64}@(?:[A-Za-z0-9-]{1,63}\.)+[A-Za-z]{2,24}$/
const MET_OBJECT_URL_RE = /^https:\/\/www\.metmuseum\.org\/art\/collection\/search\/(\d{1,7})\/?$/

// Strip control and bidi-override characters, collapse whitespace, cap length.
function cleanText(value, max) {
  if (typeof value !== 'string') return ''
  return value
    .replace(/[\u0000-\u001F\u007F\u200B-\u200F\u202A-\u202E\u2066-\u2069]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max)
}

function metImageUrl(value) {
  if (typeof value !== 'string' || value.length > 500) return ''
  try {
    const u = new URL(value)
    return u.protocol === 'https:' && u.hostname === 'images.metmuseum.org' && !u.username && !u.port ? u.href : ''
  } catch {
    return ''
  }
}

// The object ID is the only thing taken from the request; everything else is rebuilt.
function objectIdOf(art) {
  if (!art || typeof art !== 'object') return null
  if (Number.isInteger(art.objectID) && art.objectID > 0 && art.objectID < 1e7) return art.objectID
  const m = typeof art.url === 'string' && art.url.length < 200 && art.url.match(MET_OBJECT_URL_RE)
  return m ? Number(m[1]) : null
}

// Look the artwork up on the Met API. Returns null if it doesn't exist. If the Met API itself
// is unreachable, falls back to the request's text (cleaned and escaped), since a caller can't
// cause that failure and the link and image still have to point at the Met.
async function lookUpFavorite(art, id) {
  const url = `https://www.metmuseum.org/art/collection/search/${id}`
  try {
    const res = await fetch(MET_API + id, { signal: AbortSignal.timeout(5000) })
    if (res.status === 404) return null
    if (res.ok) {
      const data = await res.json()
      if (data.objectID !== id || !data.title) return null
      return {
        title: cleanText(data.title, 300),
        artist: cleanText(data.artistDisplayName, 200),
        date: cleanText(data.objectDate, 100),
        image: metImageUrl(data.primaryImageSmall),
        url,
      }
    }
  } catch {
    // Network error or timeout: fall through.
  }
  const title = cleanText(art.title, 300)
  if (!title) return null
  return {
    title,
    artist: cleanText(art.artist, 200),
    date: cleanText(art.date, 100),
    image: metImageUrl(art.image),
    url,
  }
}

// Per-isolate fallback when the Rate Limiting bindings (see wrangler.toml) aren't configured.
// Isolates are short-lived and per data center, so this only slows down a single noisy client.
const recentHits = new Map()
function localLimit(key, limit, periodMs) {
  const now = Date.now()
  const hits = (recentHits.get(key) || []).filter((t) => now - t < periodMs)
  if (hits.length >= limit) return false
  hits.push(now)
  recentHits.set(key, hits)
  if (recentHits.size > 5000) recentHits.clear()
  return true
}

async function withinRateLimits(env, ip, recipient) {
  const checks = [
    env.IP_LIMIT ? env.IP_LIMIT.limit({ key: ip }).then((r) => r.success) : localLimit(`ip:${ip}`, 5, 60000),
    env.RECIPIENT_LIMIT ? env.RECIPIENT_LIMIT.limit({ key: recipient }).then((r) => r.success) : localLimit(`to:${recipient}`, 1, 60000),
  ]
  return (await Promise.all(checks)).every(Boolean)
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(request) })
    }

    if (request.method !== 'POST') {
      return json(request, 405, { error: 'Method not allowed' })
    }

    // Browsers always send Origin on cross-site POSTs, so this stops other websites from
    // using their visitors to send mail. Requiring JSON forces a CORS preflight.
    if (!ALLOWED_ORIGINS.includes(request.headers.get('Origin'))) {
      return json(request, 403, { error: 'Forbidden' })
    }
    if (!/^application\/json\b/i.test(request.headers.get('Content-Type') || '')) {
      return json(request, 415, { error: 'Expected JSON' })
    }
    if (Number(request.headers.get('Content-Length') || 0) > MAX_BODY_BYTES) {
      return json(request, 413, { error: 'Request too large' })
    }

    let body
    try {
      const raw = await request.text()
      if (raw.length > MAX_BODY_BYTES) return json(request, 413, { error: 'Request too large' })
      body = JSON.parse(raw)
    } catch {
      return json(request, 400, { error: 'Invalid JSON' })
    }

    const email = typeof body?.email === 'string' ? body.email.trim() : ''
    const favorites = body?.favorites

    if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
      return json(request, 400, { error: 'Valid email required' })
    }

    if (!Array.isArray(favorites) || favorites.length === 0) {
      return json(request, 400, { error: 'At least one favorite required' })
    }
    if (favorites.length > MAX_FAVORITES) {
      return json(request, 400, { error: `You can email up to ${MAX_FAVORITES} favorites at a time. Remove a few and try again.` })
    }

    const ip = request.headers.get('CF-Connecting-IP') || 'unknown'
    if (!(await withinRateLimits(env, ip, email.toLowerCase()))) {
      return json(request, 429, { error: 'Too many emails. Please wait a minute and try again.' })
    }

    const ids = new Set()
    const lookups = []
    for (const art of favorites) {
      const id = objectIdOf(art)
      if (!id || ids.has(id)) continue
      ids.add(id)
      lookups.push(lookUpFavorite(art, id))
    }
    const cleanFavorites = (await Promise.all(lookups)).filter(Boolean)
    if (cleanFavorites.length === 0) {
      return json(request, 400, { error: 'No valid favorites' })
    }

    const html = buildEmailHTML(cleanFavorites)

    let res
    try {
      res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Met Explorer <favorites@data.maximumnewyork.com>',
          to: email,
          subject: 'Your Met Museum Favorites — Maximum New York Data Viz & Art',
          html,
        }),
      })
    } catch (err) {
      console.error('Resend request failed', err)
      return json(request, 502, { error: 'Email service unavailable. Please try again later.' })
    }

    if (!res.ok) {
      // Log the details for `wrangler tail`; don't hand Resend's error text to the caller.
      console.error('Resend error', res.status, await res.text().catch(() => ''))
      return json(request, 502, { error: 'Failed to send email. Please try again later.' })
    }

    return json(request, 200, { success: true })
  },
}
