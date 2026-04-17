const ALLOWED_ORIGINS = [
  'https://data.maximumnewyork.com',
  'http://localhost:5173',
  'http://localhost:4173',
]

function corsHeaders(request) {
  const origin = request.headers.get('Origin') || ''
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

function buildEmailHTML(favorites) {
  const artworkRows = favorites.map((art, i) => `
    <tr>
      <td style="padding: 16px 0; border-bottom: 1px solid #EDE8DF;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td width="80" valign="top" style="padding-right: 16px;">
              <a href="${escapeHtml(art.url)}" target="_blank" style="text-decoration: none;">
                <img src="${escapeHtml(art.image)}" alt="${escapeHtml(art.title)}"
                  width="80" height="80"
                  style="border-radius: 6px; object-fit: cover; display: block; background: #EDE8DF;" />
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
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function safeHttpUrl(str) {
  if (typeof str !== 'string') return ''
  try {
    const u = new URL(str)
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return ''
    return u.toString()
  } catch {
    return ''
  }
}

function sanitizeFavorite(art) {
  if (!art || typeof art !== 'object') return null
  const title = typeof art.title === 'string' ? art.title.slice(0, 300) : ''
  if (!title) return null
  return {
    title,
    artist: typeof art.artist === 'string' ? art.artist.slice(0, 200) : '',
    date: typeof art.date === 'string' ? art.date.slice(0, 100) : '',
    url: safeHttpUrl(art.url),
    image: safeHttpUrl(art.image),
  }
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(request) })
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders(request), 'Content-Type': 'application/json' },
      })
    }

    let body
    try {
      body = await request.json()
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
        status: 400,
        headers: { ...corsHeaders(request), 'Content-Type': 'application/json' },
      })
    }

    const { email, favorites } = body

    if (!email || typeof email !== 'string' || email.length > 254 || !EMAIL_RE.test(email)) {
      return new Response(JSON.stringify({ error: 'Valid email required' }), {
        status: 400,
        headers: { ...corsHeaders(request), 'Content-Type': 'application/json' },
      })
    }

    if (!Array.isArray(favorites) || favorites.length === 0 || favorites.length > 100) {
      return new Response(JSON.stringify({ error: 'Between 1 and 100 favorites required' }), {
        status: 400,
        headers: { ...corsHeaders(request), 'Content-Type': 'application/json' },
      })
    }

    const cleanFavorites = favorites.map(sanitizeFavorite).filter(Boolean)
    if (cleanFavorites.length === 0) {
      return new Response(JSON.stringify({ error: 'No valid favorites' }), {
        status: 400,
        headers: { ...corsHeaders(request), 'Content-Type': 'application/json' },
      })
    }

    const html = buildEmailHTML(cleanFavorites)

    const res = await fetch('https://api.resend.com/emails', {
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

    const result = await res.json()

    if (!res.ok) {
      return new Response(JSON.stringify({ error: result.message || 'Failed to send email' }), {
        status: 500,
        headers: { ...corsHeaders(request), 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders(request), 'Content-Type': 'application/json' },
    })
  },
}
