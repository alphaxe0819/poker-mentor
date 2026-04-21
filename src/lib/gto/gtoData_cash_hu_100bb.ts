// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
import { makeRange, makeRangeDefaultCall, makeRangeDefaultRaise, type GtoDB } from './helpers'

export const DB_CASH_HU_100BB: GtoDB = {
  // ── SB/BTN open (HU: SB=BTN, opens ~80% of hands) ────────────────────────
  'cash_hu_100bb_SB_open': makeRangeDefaultRaise(
    ['72o','73o','82o','83o','92o','32o','42o','52o','62o',
     '72s','82s','32s'],
    [],
    { '74o':'mr:60','84o':'mr:70','93o':'mr:60','94o':'mr:70',
      '43o':'mr:50','53o':'mr:60','63o':'mr:70' }
  ),

  // ── BB defend (HU: BB defends very wide) ──────────────────────────────────
  'cash_hu_100bb_BB_vs_open': makeRangeDefaultCall(
    ['AA','KK','QQ','JJ','TT','99',
     'AKs','AQs','AJs','ATs','A9s','AKo','AQo','AJo',
     'KQs','KJs','KTs','KQo',
     'QJs','QTs','JTs',
     'A5s','A4s','54s','43s'],
    ['72o','73o','82o','32o','42o','52o']
  ),

  // ══════════════════════════════════════════════════════════════════════════
  // VS 3-BET — Cash HU 100BB
  // ══════════════════════════════════════════════════════════════════════════

  // ── SB/BTN vs BB 3-bet (SB opened, BB 3-bet) ─────────────────────────────
  'cash_hu_100bb_SB_vs_3bet': makeRange(
    [],
    ['QQ','JJ','TT','99','88','77','66','55',
     'AQs','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s',
     'AQo','AJo','ATo',
     'KQs','KJs','KTs','K9s','K8s','K7s',
     'KQo','KJo',
     'QJs','QTs','Q9s','Q8s',
     'QJo',
     'JTs','J9s','J8s',
     'T9s','T8s','T7s',
     '98s','97s','96s',
     '87s','86s','76s','75s','65s','64s','54s','53s','43s'],
    { 'AA':'4b','KK':'4b',
      'AKs':'4b','AKo':'4b',
      'AQo':'mr:60_4b','AJo':'mr:30_4b',
      'A5s':'mr:50_4b','A4s':'mr:40_4b','A3s':'mr:30_4b',
      'K5s':'mr:30_4b','76s':'mr:30_4b' }
  ),

  // ── BB 3-bet range (BB facing SB open, decides to 3-bet) ──────────────────
  'cash_hu_100bb_BB_3bet': makeRange(
    [],
    [],
    { 'AA':'3b','KK':'3b','QQ':'3b','JJ':'3b','TT':'mr:60_3b','99':'mr:40_3b',
      'AKs':'3b','AQs':'3b','AJs':'3b','ATs':'3b','A9s':'mr:60_3b','A8s':'mr:40_3b',
      'AKo':'3b','AQo':'3b','AJo':'3b','ATo':'mr:50_3b','A9o':'mr:30_3b',
      'A5s':'3b','A4s':'mr:80_3b','A3s':'mr:60_3b','A2s':'mr:50_3b',
      'KQs':'3b','KJs':'mr:70_3b','KTs':'mr:50_3b','K9s':'mr:30_3b',
      'KQo':'mr:60_3b','KJo':'mr:30_3b',
      'QJs':'mr:50_3b','QTs':'mr:30_3b',
      'Q9s':'mr:30_3b',
      'JTs':'mr:40_3b','J9s':'mr:30_3b',
      'T9s':'mr:30_3b',
      '76s':'mr:40_3b','65s':'mr:30_3b','54s':'mr:30_3b' }
  ),
}
