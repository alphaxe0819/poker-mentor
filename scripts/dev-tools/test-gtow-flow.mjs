#!/usr/bin/env node
// test-gtow-flow.mjs — T-086 end-to-end verification
//
// Flow: generate ephemeral keypair → sign refresh request → POST /v1/token/refresh/ →
//       extract access_token → call /v4/solutions/spot-solution/ with Bearer → print pass/fail.
//
// Requires Node 18+ (for global Web Crypto + fetch).
//
// Usage:
//   GTOW_REFRESH_TOKEN="eyJ..."  node test-gtow-flow.mjs
//   # or
//   node test-gtow-flow.mjs --token eyJ...
//   # or put in scripts/dev-tools/.gtow-refresh.local.txt and run without args
//
// The refresh token lives in browser localStorage.user_refresh after login.
// Use T-084 grabber variant or DevTools console: localStorage.getItem('user_refresh')
//
// This script DUPLICATES signing logic from gto_signing.ts by design — it's a standalone
// verification tool for when the Edge Function deploy fails. If gto_signing.ts is updated,
// mirror changes here.

import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const LOCAL_TOKEN_FILE = join(__dirname, '.gtow-refresh.local.txt')

// ── Constants (must match gto_signing.ts + ai-poker-wizard) ──

const API_BASE = 'https://api.gtowizard.com'
const ORIGIN = 'https://app.gtowizard.com'
const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36'
const BUILD_VERSION = '2026-03-23.2e78d975'
const APP_UID = '00000000-0000-0000-0000-000000000000'
const SIG_VERSION = 'v1'

// ── base64 helpers ──

function b64(bytes) {
  return Buffer.from(bytes).toString('base64')
}
function b64urlDecode(s) {
  let t = s.replace(/-/g, '+').replace(/_/g, '/')
  while (t.length % 4) t += '='
  return Buffer.from(t, 'base64')
}

// ── Keypair + signing ──

async function generateKeypair() {
  const pair = await crypto.subtle.generateKey(
    { name: 'ECDSA', namedCurve: 'P-256' },
    true,
    ['sign', 'verify'],
  )
  const pubJwk = await crypto.subtle.exportKey('jwk', pair.publicKey)
  const privJwk = await crypto.subtle.exportKey('jwk', pair.privateKey)
  return {
    publicJwk: { crv: 'P-256', kty: 'EC', x: pubJwk.x, y: pubJwk.y },
    privateJwk: { crv: 'P-256', kty: 'EC', x: privJwk.x, y: privJwk.y, d: privJwk.d },
  }
}

async function importPrivateKey(jwk) {
  return await crypto.subtle.importKey(
    'jwk',
    { ...jwk, key_ops: ['sign'], ext: true },
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['sign'],
  )
}

async function exportPublicSpkiB64(jwk) {
  const pub = await crypto.subtle.importKey(
    'jwk',
    { ...jwk, key_ops: ['verify'], ext: true },
    { name: 'ECDSA', namedCurve: 'P-256' },
    true,
    ['verify'],
  )
  const spki = new Uint8Array(await crypto.subtle.exportKey('spki', pub))
  return b64(spki)
}

let _offsetMs = null
async function serverTimeMs() {
  if (_offsetMs === null) {
    try {
      const r = await fetch(`${API_BASE}/v4/core/server-time/`)
      const d = r.headers.get('date')
      if (d) {
        const serverMs = Date.parse(d)
        if (!Number.isNaN(serverMs)) _offsetMs = serverMs - Date.now()
      }
    } catch {}
    if (_offsetMs === null) _offsetMs = 0
  }
  return Date.now() + _offsetMs
}

async function signRefreshRequest(refreshToken, keypair) {
  const timestamp = await serverTimeMs()
  const bodyStr = JSON.stringify({ refresh: refreshToken })
  const payload = [
    'POST', '/v1/token/refresh/', String(timestamp), bodyStr,
    ORIGIN, USER_AGENT, APP_UID, BUILD_VERSION,
  ].join('|')

  const priv = await importPrivateKey(keypair.privateJwk)
  const sigBuf = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    priv,
    new TextEncoder().encode(payload),
  )
  const sigB64 = b64(new Uint8Array(sigBuf))
  const spkiB64 = await exportPublicSpkiB64(keypair.publicJwk)

  const headersObj = { origin: ORIGIN, userAgent: USER_AGENT, appUid: APP_UID, buildVersion: BUILD_VERSION }
  const headersB64 = b64(Buffer.from(JSON.stringify(headersObj)))

  return {
    'google-anal-id': [sigB64, spkiB64, String(timestamp), SIG_VERSION, headersB64].join('.'),
    'origin': ORIGIN,
    'user-agent': USER_AGENT,
    'content-type': 'application/json',
  }
}

function jwtExp(token) {
  const payload = token.split('.')[1]
  const bytes = b64urlDecode(payload)
  const json = JSON.parse(bytes.toString('utf8'))
  return json.exp
}

// ── Token source ──

function loadRefreshToken() {
  const argIdx = process.argv.indexOf('--token')
  if (argIdx > -1 && process.argv[argIdx + 1]) return process.argv[argIdx + 1]
  if (process.env.GTOW_REFRESH_TOKEN) return process.env.GTOW_REFRESH_TOKEN
  if (existsSync(LOCAL_TOKEN_FILE)) return readFileSync(LOCAL_TOKEN_FILE, 'utf8').trim()
  return null
}

// ── E2E flow ──

function log(msg)  { process.stdout.write(msg + '\n') }
function err(msg)  { process.stderr.write(msg + '\n') }
function fail(msg) { err('\n❌ ' + msg + '\n'); process.exit(1) }

const refreshToken = loadRefreshToken()
if (!refreshToken || !refreshToken.startsWith('eyJ')) {
  fail(
    'No refresh token found.\n' +
    '   Set GTOW_REFRESH_TOKEN env var, pass --token <jwt>, or write it to:\n' +
    '   ' + LOCAL_TOKEN_FILE + '\n' +
    '   Token source: Chrome DevTools → localStorage.getItem("user_refresh") after login.',
  )
}

log('🔑 Refresh token: ' + refreshToken.slice(0, 24) + '...' + refreshToken.slice(-8))
try {
  const exp = jwtExp(refreshToken)
  log('   exp = ' + new Date(exp * 1000).toISOString() + ' (' + Math.round((exp - Date.now() / 1000) / 86400) + ' days remaining)')
} catch (e) { log('   ⚠ JWT exp decode failed: ' + e.message) }

log('\n⚙  Step 1 — generate ECDSA P-256 keypair (ephemeral)')
const keypair = await generateKeypair()
log('   public x = ' + keypair.publicJwk.x.slice(0, 20) + '...')

log('\n⚙  Step 2 — sign /v1/token/refresh/ request')
const signed = await signRefreshRequest(refreshToken, keypair)
log('   google-anal-id length = ' + signed['google-anal-id'].length)
log('   google-anal-id parts  = ' + signed['google-anal-id'].split('.').length)

log('\n🌐 Step 3 — POST /v1/token/refresh/')
const refreshRes = await fetch(`${API_BASE}/v1/token/refresh/`, {
  method: 'POST',
  headers: signed,
  body: JSON.stringify({ refresh: refreshToken }),
})
log('   HTTP ' + refreshRes.status)
if (!refreshRes.ok) {
  const t = await refreshRes.text().catch(() => '')
  fail('refresh failed: ' + refreshRes.status + ' — ' + t.slice(0, 500))
}
const refreshJson = await refreshRes.json()
const accessToken = refreshJson.access
if (!accessToken || !accessToken.startsWith('eyJ')) fail('refresh response missing access token: ' + JSON.stringify(refreshJson).slice(0, 300))
log('   ✅ access token = ' + accessToken.slice(0, 24) + '...' + accessToken.slice(-8))
try {
  const exp = jwtExp(accessToken)
  log('   access exp      = ' + new Date(exp * 1000).toISOString() + ' (' + (exp - Math.floor(Date.now() / 1000)) + 's remaining)')
} catch {}

log('\n🌐 Step 4 — call /v4/solutions/spot-solution/ with Bearer')
const spotUrl = new URL(`${API_BASE}/v4/solutions/spot-solution/`)
spotUrl.searchParams.set('gametype', 'Cash6mGeneral_6mNL25R25')
spotUrl.searchParams.set('depth', '100')
spotUrl.searchParams.set('stacks', '')
spotUrl.searchParams.set('preflop_actions', 'F-F-F-R2.5-F-C-F')  // GTOW format: dash-separated (士林 2026-04-22 本機驗發現)
const spotRes = await fetch(spotUrl.toString(), {
  headers: { 'Authorization': `Bearer ${accessToken}`, 'origin': ORIGIN },
})
log('   HTTP ' + spotRes.status + '  ' + spotUrl.toString())
if (spotRes.status === 204) {
  log('   ⚠ 204 No Content — scenario not covered, but auth worked.')
} else if (spotRes.status === 403) {
  fail('403 Forbidden — access token rejected for spot-solution; signing flow may be broken.')
} else if (!spotRes.ok) {
  const t = await spotRes.text().catch(() => '')
  fail('spot-solution failed: ' + spotRes.status + ' — ' + t.slice(0, 400))
} else {
  const j = await spotRes.json()
  const nActions = j?.action_solutions?.length ?? j?.spot_solution?.action_solutions?.length ?? 0
  log('   ✅ got ' + nActions + ' action_solutions')
}

log('\n✅ ALL STEPS PASSED — signing + refresh + spot-solution flow works.')
log('   Next: set Supabase Secret GTOW_REFRESH_TOKEN and deploy exploit-coach-gtow.')
log('   For persistent keypair across cold starts, also set GTOW_KEYPAIR_JWK to this JSON:')
log(JSON.stringify(keypair))
