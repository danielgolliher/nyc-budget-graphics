// Vite plugin that turns the single-page app into real files GitHub Pages can serve directly.
//
// For every entry in src/categories.js the build writes /<slug>.html and /<slug>/index.html
// (the app shell with that page's title, description, canonical URL and social-preview tags),
// the same for /embed/<slug>, a 404.html shell, sitemap.xml and robots.txt. Crawlers and link
// unfurlers see the right tags, and visitors land straight in the app with no redirect hop.
//
// Built pages also get a Content-Security-Policy <meta> tag. GitHub Pages can't send response
// headers, so this is the only way to set one. Inline scripts are allowed by hash, computed
// from the built index.html, so editing them in index.html needs no change here.

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import path from 'node:path'
import categories, { pageTitle, SITE_NAME } from '../src/categories.js'

export const SITE_URL = 'https://data.maximumnewyork.com'

const DEFAULT_IMAGE = { image: 'og-image.jpg', imageWidth: 1200, imageHeight: 675 }

const HOME = {
  path: '/',
  title: SITE_NAME,
  description: 'Interactive visualizations of NYC data, by Daniel Golliher and Maximum New York',
}

// Hosts the app talks to. Add a host here when a page starts loading something new from it.
function contentSecurityPolicy(scriptHashes) {
  const analytics = 'https://*.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com https://*.g.doubleclick.net https://www.google.com'
  return [
    "default-src 'self'",
    `script-src 'self' ${scriptHashes.join(' ')} https://*.googletagmanager.com`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    // Met Museum artwork images, map tiles for Pedestrian Traffic, analytics beacons.
    `img-src 'self' data: blob: https://images.metmuseum.org https://server.arcgisonline.com ${analytics}`,
    `connect-src 'self' https://collectionapi.metmuseum.org https://met-favorites-email.danielgolliher.workers.dev ${analytics}`,
    "frame-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    'upgrade-insecure-requests',
  ].join('; ')
}

const esc = (s) => String(s)
  .replace(/&/g, '&amp;')
  .replace(/"/g, '&quot;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')

const START = '<!--page-meta:start-->'
const END = '<!--page-meta:end-->'

function metaTags(page) {
  const {
    title, description, shareDescription = description, path: pagePath,
    image, imageWidth, imageHeight, noindex,
  } = { ...DEFAULT_IMAGE, ...page }
  const url = SITE_URL + pagePath
  const imageUrl = `${SITE_URL}/${image}`
  return [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    noindex ? '<meta name="robots" content="noindex" />' : `<link rel="canonical" href="${esc(url)}" />`,
    '<meta property="og:type" content="website" />',
    `<meta property="og:site_name" content="${esc(SITE_NAME)}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(shareDescription)}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:image" content="${esc(imageUrl)}" />`,
    imageWidth && `<meta property="og:image:width" content="${imageWidth}" />`,
    imageHeight && `<meta property="og:image:height" content="${imageHeight}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(shareDescription)}" />`,
    `<meta name="twitter:image" content="${esc(imageUrl)}" />`,
  ].filter(Boolean).join('\n    ')
}

function categoryPage(c) {
  const description = c.metaDescription || c.description
  return {
    path: `/${c.slug}`,
    title: pageTitle(c),
    description,
    shareDescription: c.shareDescription || description,
    ...(c.image && { image: c.image, imageWidth: c.imageWidth, imageHeight: c.imageHeight }),
  }
}

function inlineScriptHashes(html) {
  const hashes = []
  for (const [, attrs, body] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (/\bsrc=/.test(attrs) || !body.trim()) continue
    hashes.push(`'sha256-${createHash('sha256').update(body).digest('base64')}'`)
  }
  return hashes
}

async function writePage(outDir, file, html) {
  const target = path.join(outDir, file)
  await mkdir(path.dirname(target), { recursive: true })
  await writeFile(target, html)
}

export default function sitePages() {
  let outDir = 'dist'

  return {
    name: 'site-pages',

    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },

    // Dev server and build both start from the homepage tags.
    transformIndexHtml(html) {
      return html.replace('<!--page-meta-->', () => `${START}\n    ${metaTags(HOME)}\n    ${END}`)
    },

    async closeBundle() {
      const shell = await readFile(path.join(outDir, 'index.html'), 'utf8')
      if (!shell.includes(START)) throw new Error('site-pages: index.html is missing <!--page-meta-->')

      const csp = `<meta http-equiv="Content-Security-Policy" content="${contentSecurityPolicy(inlineScriptHashes(shell))}" />`
      // A function replacement, so "$" in descriptions ("$34.6 billion") stays literal.
      const render = (page) => shell.replace(
        new RegExp(`${START}[\\s\\S]*?${END}`),
        () => `${csp}\n    ${metaTags(page)}`,
      )

      const pages = [['index.html', HOME]]
      for (const c of categories) {
        const page = categoryPage(c)
        pages.push([`${c.slug}.html`, page], [`${c.slug}/index.html`, page])
        if (!c.comingSoon) {
          const embed = { ...page, path: `/embed/${c.slug}`, noindex: true }
          pages.push([`embed/${c.slug}.html`, embed], [`embed/${c.slug}/index.html`, embed])
        }
      }
      pages.push(['404.html', {
        ...HOME,
        title: `Page not found — ${SITE_NAME}`,
        noindex: true,
      }])

      await Promise.all(pages.map(([file, page]) => writePage(outDir, file, render(page))))

      const urls = ['/', ...categories.filter((c) => !c.comingSoon).map((c) => `/${c.slug}`)]
      await writePage(outDir, 'sitemap.xml', [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...urls.map((u) => `  <url><loc>${SITE_URL}${u === '/' ? '/' : u}</loc></url>`),
        '</urlset>',
        '',
      ].join('\n'))
      await writePage(outDir, 'robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`)
      // Keep GitHub Pages from running Jekyll, which would hide files starting with "_".
      await writePage(outDir, '.nojekyll', '')
    },
  }
}
