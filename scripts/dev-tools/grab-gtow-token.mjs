#!/usr/bin/env node
// grab-gtow-token.mjs
//
// Dev-only tool for T-082/T-084: Listen to api.gtowizard.com requests via
// Chrome DevTools Protocol and print the Bearer token to stdout.
//
// Usage:
//   1. Close all Chrome windows.
//   2. Start Chrome with:
//      chrome.exe --remote-debugging-port=9222 --user-data-dir="C:\temp\chrome-gtow"
//   3. Log into gtowizard.com in that Chrome instance.
//   4. Open any spot page so the site fires an API call.
//   5. node grab-gtow-token.mjs          # prints token only
//      node grab-gtow-token.mjs --save   # also writes .gtow-token.local.txt
//
// Scope: only grabs the token. Does NOT batch-scrape GTOW data (ToS safety).

import { chromium } from 'playwright-core';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const CDP_URL = 'http://localhost:9222';
const TARGET_HOST = 'api.gtowizard.com';
const TIMEOUT_MS = 30_000;

const args = new Set(process.argv.slice(2));
const SAVE = args.has('--save');
const HELP = args.has('--help') || args.has('-h');

if (HELP) {
  console.log(`Usage: node grab-gtow-token.mjs [--save]

Options:
  --save    Write token to ./.gtow-token.local.txt (opt-in; gitignored)
  --help    Show this help

Prerequisites:
  - Chrome started with: --remote-debugging-port=9222 --user-data-dir=<dir>
  - User logged into gtowizard.com in that Chrome
  - At least one spot page loaded (to trigger an API call)
`);
  process.exit(0);
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const SAVE_PATH = join(__dirname, '.gtow-token.local.txt');

function log(msg) {
  process.stderr.write(msg + '\n');
}

function fail(msg, hint) {
  log('');
  log('❌ ' + msg);
  if (hint) log('   ' + hint);
  log('');
  process.exit(1);
}

log('🔌 Connecting to Chrome CDP at ' + CDP_URL + ' ...');

let browser;
try {
  browser = await chromium.connectOverCDP(CDP_URL);
} catch (err) {
  fail(
    'Cannot connect to Chrome at ' + CDP_URL,
    'Close all Chrome windows, then start Chrome with:\n   ' +
      '"chrome.exe" --remote-debugging-port=9222 --user-data-dir="C:\\temp\\chrome-gtow"\n' +
      '   Reason: ' + (err?.message || String(err)),
  );
}

log('✅ Connected. Watching for ' + TARGET_HOST + ' requests ...');
log('   (If nothing appears, click around gtowizard.com to trigger an API call.)');
log('');

let resolved = false;

function handleRequest(request) {
  if (resolved) return;
  const url = request.url();
  if (!url.includes(TARGET_HOST)) return;

  const headers = request.headers();
  const auth = headers['authorization'] || headers['Authorization'];
  if (!auth || !auth.startsWith('Bearer ')) return;

  const token = auth.slice('Bearer '.length).trim();
  if (!token) return;

  resolved = true;

  // Token goes to stdout so `| clip` / `| pbcopy` works; logs go to stderr.
  process.stdout.write(token + '\n');

  log('');
  log('✅ Token captured from: ' + url);
  log('   Length: ' + token.length + ' chars');
  log('   Preview: ' + token.slice(0, 24) + '...' + token.slice(-8));

  if (SAVE) {
    try {
      writeFileSync(SAVE_PATH, token + '\n', { encoding: 'utf8' });
      log('   Saved to: ' + SAVE_PATH + ' (gitignored)');
    } catch (err) {
      log('   ⚠ Failed to write ' + SAVE_PATH + ': ' + (err?.message || err));
    }
  }

  log('');
  log('Next step:');
  log('  Supabase Dashboard → Edge Functions → exploit-coach-gtow → Secrets');
  log('  Set GTO_WIZARD_TOKEN = <the token printed above>');
  log('');

  cleanupAndExit(0);
}

function attachToContext(context) {
  for (const page of context.pages()) attachToPage(page);
  context.on('page', attachToPage);
}

function attachToPage(page) {
  page.on('request', handleRequest);
}

for (const context of browser.contexts()) attachToContext(context);
// New incognito contexts would fire a 'context' event, but CDP endpoint typically
// only exposes the default context. Iterating existing contexts is sufficient.

const timeoutHandle = setTimeout(() => {
  if (resolved) return;
  log('');
  log('⏳ Timed out after ' + (TIMEOUT_MS / 1000) + 's without capturing a token.');
  log('   Open GTO Wizard in Chrome, load any spot page, then re-run this script.');
  log('');
  cleanupAndExit(2);
}, TIMEOUT_MS);

async function cleanupAndExit(code) {
  clearTimeout(timeoutHandle);
  try {
    // Only disconnects CDP — does NOT close the user's Chrome.
    await browser.close();
  } catch {
    // ignore
  }
  process.exit(code);
}

process.on('SIGINT', () => {
  log('\n⚠ Interrupted.');
  cleanupAndExit(130);
});
