#!/usr/bin/env node
// Refresh Council Quest bills data from the NYC Council Legislative Archive
// (jehiah/nyc_legislation on GitHub — pulls from council.nyc.gov/legislation/api).
//
// Rewrites the `LEGIS` and `COLEGIS_EXT` blocks in
// public/council-quest/game.html with fresh primary + co-sponsored bills
// for the current session's introductions.
//
// Usage: node scripts/refresh-bills.mjs
// Exit 0 on any successful run (even if no content changed).

import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const GAME = path.join(ROOT, 'public', 'council-quest', 'game.html')

// Current NYC Council session starts in 2026. Bills are introduced across
// the year; this script walks all introduction/<year>/*.json for each year
// in the session so the picture stays complete as the session progresses.
const SESSION_YEARS = [2026, 2027, 2028, 2029]

const ARCHIVE_URL = 'https://github.com/jehiah/nyc_legislation.git'
const ARCHIVE_DIR = process.env.ARCHIVE_DIR || path.join(process.env.RUNNER_TEMP || '/tmp', 'nyc_legislation')

// ────────────────────────────── helpers ──────────────────────────────

function sh(cmd, opts = {}) {
    return execSync(cmd, { stdio: 'pipe', encoding: 'utf8', ...opts }).trim()
}

function syncArchive() {
    if (fs.existsSync(path.join(ARCHIVE_DIR, '.git'))) {
        sh(`git -C "${ARCHIVE_DIR}" fetch --depth 1 origin master`)
        sh(`git -C "${ARCHIVE_DIR}" reset --hard origin/master`)
    } else {
        fs.mkdirSync(path.dirname(ARCHIVE_DIR), { recursive: true })
        sh(`git clone --depth 1 "${ARCHIVE_URL}" "${ARCHIVE_DIR}"`)
    }
}

// Map Legistar StatusName to the single-letter code the game uses.
// Keep the palette simple: C (in committee), L (laid over), M (mayor's
// desk), E (enacted), X (did-not-pass: vetoed/withdrawn/failed/filed).
function statusCode(name) {
    const s = (name || '').toLowerCase()
    if (s.includes('enacted')) {
        // "Enacted (Mayor's Desk for Signature)" means passed by council,
        // awaiting mayor — we render that as M.
        return s.includes("mayor's desk") ? 'M' : 'E'
    }
    if (s.includes('sent to mayor')) return 'M'
    if (s.includes('laid over')) return 'L'
    if (s.includes('vetoed') || s.includes('withdrawn') || s.includes('failed') || s.includes('filed')) return 'X'
    // Default everything else (in committee, reported out, etc.) to C.
    return 'C'
}

// Cleanup rules for bill titles so they render well in the game's
// monospace dialogue box. Archive "Name" fields often start with
// "A plan regarding ..." / "A Local Law ..." boilerplate and end with
// a period. Strip those and collapse whitespace. Cap at 70 chars on a
// word boundary so long titles don't overflow the bill list UI.
const TITLE_PREFIXES = [
    /^A plan regarding\s+/i,
    /^A Local Law to amend[^,]*,\s+in relation to\s+/i,
    /^A Local Law\s+(?:to\s+)?/i,
    /^A Resolution\s+(?:calling\s+(?:upon|on)\s+)?/i,
    /^Establishing\s+/i,
]
function cleanTitle(name) {
    let t = String(name || '').trim().replace(/\s+/g, ' ').replace(/\.$/, '')
    for (const re of TITLE_PREFIXES) t = t.replace(re, '')
    t = t.trim()
    if (t.length > 70) {
        const cut = t.lastIndexOf(' ', 67)
        t = (cut > 40 ? t.slice(0, cut) : t.slice(0, 67)).replace(/[,;:\s]+$/, '') + '...'
    }
    // Capitalize first letter since we may have sliced off an article.
    return t.charAt(0).toUpperCase() + t.slice(1)
}

// "Int 0298-2026" → "0298"
function parseBillNumber(file) {
    const m = String(file || '').match(/Int\s+(\d+)/)
    return m ? m[1].padStart(4, '0') : null
}

// ────────────────────────────── main ──────────────────────────────

syncArchive()

// Build slug → district from people/*.json. Source fields vary: some
// members list DistrictN@council.nyc.gov in Email, others use lastname@,
// others use WWW like /district-N/ or /dN/, and a few have only
// personalized URLs. Try each signal in order, fall back to overrides.
const SLUG_DISTRICT_OVERRIDES = {
    // Members whose Email + WWW don't encode a district numerically.
    // Add here whenever the archive adds a member we can't auto-resolve.
    'justin-e-sanchez': 17,
    'shanel-thomas-henry': 21,
}
const DISTRICT_PATTERNS = [
    /District(\d+)@/i,        // Email: District11@...
    /^M0?(\d+)@/,             // Email: M02@ (older Manhattan convention)
    /\/district-(\d+)\//i,    // WWW:   /district-11/
    /\/d(\d+)\//i,            // WWW:   /d24/
]
function resolveDistrict(p) {
    if (SLUG_DISTRICT_OVERRIDES[p.Slug]) return SLUG_DISTRICT_OVERRIDES[p.Slug]
    for (const re of DISTRICT_PATTERNS) {
        const m = (p.Email || '').match(re) || (p.WWW || '').match(re)
        if (m) {
            const n = parseInt(m[1], 10)
            if (n >= 1 && n <= 51) return n
        }
    }
    return null
}

// Skip the IsActive filter: the flag lags reality (e.g. members who
// return after a break show up as inactive for a while). Any bill in
// the current session has sponsors who are currently serving, so we
// only need a district resolver - not an active-status gate.
const slugToDistrict = {}
const peopleDir = path.join(ARCHIVE_DIR, 'people')
for (const f of fs.readdirSync(peopleDir)) {
    if (!f.endsWith('.json')) continue
    const p = JSON.parse(fs.readFileSync(path.join(peopleDir, f), 'utf8'))
    const d = resolveDistrict(p)
    if (d) slugToDistrict[p.Slug] = d
}

// Seed 1..51 so every district has an entry (empty arrays render as
// "No bills in this category" in the game).
const primary = Object.fromEntries(Array.from({ length: 51 }, (_, i) => [i + 1, []]))
const cosponsored = Object.fromEntries(Array.from({ length: 51 }, (_, i) => [i + 1, []]))

// Track shared bill metadata across sponsors so the co-sponsor tab can
// look up title + status from a bill number alone. In game.html this
// lookup table is the const `B`.
const billDB = {}

let billsSeen = 0
for (const year of SESSION_YEARS) {
    const dir = path.join(ARCHIVE_DIR, 'introduction', String(year))
    if (!fs.existsSync(dir)) continue
    for (const f of fs.readdirSync(dir).sort()) {
        if (!f.endsWith('.json')) continue
        let b
        try { b = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) }
        catch { continue }
        if (!b || !Array.isArray(b.Sponsors) || b.Sponsors.length === 0) continue
        const num = parseBillNumber(b.File) || f.replace('.json', '').padStart(4, '0')
        const title = cleanTitle(b.Name)
        const status = statusCode(b.StatusName)
        if (!title) continue
        billDB[num] = [title, status]

        const primSp = b.Sponsors[0]
        const primDist = slugToDistrict[primSp.Slug]
        if (primDist) primary[primDist].push([num, title, status])

        const seen = new Set(primDist ? [primDist] : [])
        for (let i = 1; i < b.Sponsors.length; i++) {
            const d = slugToDistrict[b.Sponsors[i].Slug]
            if (!d || seen.has(d)) continue
            seen.add(d)
            cosponsored[d].push(num)
        }
        billsSeen++
    }
}

// Stable sort each district's lists (ascending bill number).
for (const d in primary) primary[d].sort((a, b) => a[0].localeCompare(b[0]))
for (const d in cosponsored) cosponsored[d].sort((a, b) => a.localeCompare(b))

// ────────────────────────── format output ──────────────────────────

function fmtPair(arr) { // ["0298","Title","C"]
    const [n, t, s] = arr
    return `["${n}",${JSON.stringify(t)},"${s}"]`
}

function renderLegis() {
    // All 51 districts, even if empty, so the file contains a stable
    // shape every week. District 3 is the vacant seat — still render it.
    const lines = []
    lines.push('const LEGIS = {')
    for (let d = 1; d <= 51; d++) {
        const bills = primary[d] || []
        if (bills.length === 0) {
            lines.push(`    ${d}: [],`)
        } else {
            const inner = bills.map(fmtPair).join(',')
            lines.push(`    ${d}: [${inner}],`)
        }
    }
    // drop trailing comma on last entry for cleanliness
    lines[lines.length - 1] = lines[lines.length - 1].replace(/,$/, '')
    lines.push('};')
    return lines.join('\n')
}

function renderColegisExt() {
    // Only districts 11..51 live in COLEGIS_EXT (D1..D10 Manhattan
    // members are in the inline COLEGIS block above). We keep the same
    // split so the merge at runtime still does the right thing.
    const lines = []
    lines.push('const COLEGIS_EXT = {')
    for (let d = 11; d <= 51; d++) {
        const nums = cosponsored[d] || []
        if (nums.length === 0) {
            lines.push(`    ${d}: [],`)
        } else {
            const inner = nums.map(n => `"${n}"`).join(',')
            lines.push(`    ${d}: [${inner}],`)
        }
    }
    lines[lines.length - 1] = lines[lines.length - 1].replace(/,$/, '')
    lines.push('};')
    return lines.join('\n')
}

function renderColegisPrimary() {
    // Same for D1..D10 — rewrite the primary COLEGIS block too so
    // Manhattan co-sponsored lists stay fresh.
    const lines = []
    lines.push('const COLEGIS = {')
    for (let d = 1; d <= 10; d++) {
        const nums = cosponsored[d] || []
        if (nums.length === 0) {
            lines.push(`    ${d}: [],`)
        } else {
            const inner = nums.map(n => `"${n}"`).join(',')
            lines.push(`    ${d}: [${inner}],`)
        }
    }
    lines[lines.length - 1] = lines[lines.length - 1].replace(/,$/, '')
    lines.push('};')
    return lines.join('\n')
}

function renderBillDB() {
    // `B` is the shared lookup the co-sponsored tab uses to resolve
    // a bill number back to [title, status]. Keep it deterministic.
    const nums = Object.keys(billDB).sort()
    const lines = ['const B={']
    for (const n of nums) {
        const [t, s] = billDB[n]
        lines.push(`"${n}":[${JSON.stringify(t)},"${s}"],`)
    }
    lines[lines.length - 1] = lines[lines.length - 1].replace(/,$/, '')
    lines.push('};')
    return lines.join('\n')
}

// ─────────────────────── splice into game.html ──────────────────────

let html = fs.readFileSync(GAME, 'utf8')

function spliceBlock(source, startMarker, endPattern, replacement) {
    // Replace from `startMarker` line through the first `};` after it.
    const startIdx = source.indexOf(startMarker)
    if (startIdx === -1) throw new Error(`Could not find marker: ${startMarker}`)
    const endSearch = source.indexOf(endPattern, startIdx)
    if (endSearch === -1) throw new Error(`Could not find end '${endPattern}' after ${startMarker}`)
    const endIdx = endSearch + endPattern.length
    return source.slice(0, startIdx) + replacement + source.slice(endIdx)
}

html = spliceBlock(html, 'const LEGIS = {',       '\n};', renderLegis())
html = spliceBlock(html, 'const B={',             '\n};', renderBillDB())
html = spliceBlock(html, 'const COLEGIS = {',     '\n};', renderColegisPrimary())
html = spliceBlock(html, 'const COLEGIS_EXT = {', '\n};', renderColegisExt())

// Stamp the freshness so you can tell at a glance when data last ran.
const today = new Date().toISOString().slice(0, 10)
html = html.replace(
    /\/\/ LEGISLATION DATA \(Primary Sponsored[^\n]*/,
    `// LEGISLATION DATA (Primary Sponsored, from council.nyc.gov/legislation/api via jehiah/nyc_legislation, refreshed ${today})`,
)

fs.writeFileSync(GAME, html)

// ─────────────────────────── summary ────────────────────────────

const totalPrimary = Object.values(primary).reduce((a, b) => a + b.length, 0)
const totalCo = Object.values(cosponsored).reduce((a, b) => a + b.length, 0)
const withPrimary = Object.values(primary).filter(b => b.length > 0).length
const withCo = Object.values(cosponsored).filter(b => b.length > 0).length

console.log(`Processed ${billsSeen} introductions across ${SESSION_YEARS.join(', ')}.`)
console.log(`Primary-sponsored: ${totalPrimary} bills across ${withPrimary}/51 districts.`)
console.log(`Co-sponsored:      ${totalCo} links across ${withCo}/51 districts.`)
console.log(`Known bills in BILL_DB: ${Object.keys(billDB).length}.`)
console.log(`Wrote ${GAME}`)
