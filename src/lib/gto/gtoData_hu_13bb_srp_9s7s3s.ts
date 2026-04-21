// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_13bb_srp_9s7s3s
// Generated: 2026-04-16T12:26:58.745Z
// =============================================================
//
// Action codes:
//   'x'      = check
//   'c'      = call
//   'f'      = fold
//   'r'      = raise (small)
//   'rbig'   = raise (large)
//   'b33'    = bet 33% pot (UI: 小)
//   'b50'    = bet 50% pot (UI: 中)
//   'b100'   = bet 100% pot (UI: 大)
//   'allin'  = all-in
//   'mix:CODE@PCT,CODE' = mixed strategy (e.g. 'mix:b33@60,x' = 60% b33 / 40% check)
// =============================================================

export type GtoRange = Record<string, string>
export type GtoDatabase = Record<string, GtoRange>

export const HU_13BB_SRP_9S7S3S: GtoDatabase = {

  // ──────────────────────────────
  hu_13bb_srp_9s7s3s_btn_cbet: {
    'AA':'mix:x@49,b33','AKs':'x','AQs':'x','AJs':'x','ATs':'x','A9s':'mix:b50@59,b33',
    'A8s':'x','A7s':'mix:b50@56,b33','A6s':'mix:x@68,b33','A5s':'x','A4s':'x','A3s':'mix:b33@39,b50',
    'A2s':'mix:x@64,b33','AKo':'mix:x@50,b33','KK':'b33','KQs':'x','KJs':'x','KTs':'mix:x@53,b33',
    'K9s':'mix:b50@54,b33','K8s':'mix:b33@55,x','AQo':'mix:x@64,b33','KQo':'x','QQ':'b33','QJs':'x',
    'QTs':'mix:x@55,b33','Q9s':'mix:b33@56,b50','AJo':'x','KJo':'mix:x@51,b33','QJo':'mix:x@52,b33','JJ':'b33',
    'JTs':'x','J9s':'b33','ATo':'x','KTo':'b33','QTo':'mix:b33@47,x','JTo':'mix:x@65,b33',
    'TT':'b33','T9s':'b33','T8s':'x','A9o':'mix:b33@62,b50','99':'mix:x@54,b33','98s':'b33',
    '97s':'b33','88':'b33','87s':'b33','77':'mix:x@47,b33','76s':'mix:b33@66,b50','66':'mix:b33@54,b50',
    '65s':'mix:x@62,b50','55':'mix:x@45,b33','54s':'x','44':'x','33':'mix:b33@47,x','22':'mix:x@45,b33',
  },

  // ──────────────────────────────
  hu_13bb_srp_9s7s3s_bb_facing_cbet_small: {
    'AKs':'mix:r@57,f','AQs':'f','AJs':'f','ATs':'f','A9s':'r','A8s':'f',
    'A7s':'r','A6s':'f','A5s':'f','A4s':'f','A3s':'r','A2s':'f',
    'AKo':'r','KQs':'f','KJs':'f','KTs':'f','K9s':'r','AQo':'mix:r@51,f',
    'KQo':'mix:f@50,r','QJs':'f','QTs':'f','AJo':'mix:r@50,f','KJo':'mix:f@50,r','QJo':'mix:f@50,r',
    'JTs':'f','J9s':'r','ATo':'mix:r@50,f','KTo':'mix:f@50,r','JTo':'mix:r@50,f','TT':'r',
    'T9s':'r','99':'r','98s':'r','88':'r','87s':'r','77':'r',
    '76s':'r','66':'r','65s':'r','55':'mix:r@57,f','54s':'f','44':'mix:r@51,f',
    '33':'r','22':'mix:r@50,f',
  },

  // ──────────────────────────────
  hu_13bb_srp_9s7s3s_bb_facing_cbet_mid: {
    'AKs':'mix:c@63,f','AQs':'f','AJs':'f','ATs':'f','A9s':'c','A8s':'f',
    'A7s':'c','A6s':'f','A5s':'f','A4s':'f','A3s':'c','A2s':'f',
    'AKo':'c','KQs':'f','KJs':'f','KTs':'f','K9s':'c','AQo':'mix:c@51,f',
    'KQo':'mix:c@50,f','QJs':'f','QTs':'f','AJo':'mix:c@50,f','KJo':'mix:c@50,f','QJo':'mix:c@50,f',
    'JTs':'f','J9s':'c','ATo':'mix:c@50,f','KTo':'mix:c@50,f','JTo':'mix:c@50,f','TT':'c',
    'T9s':'c','99':'c','98s':'c','88':'c','87s':'c','77':'c',
    '76s':'c','66':'c','65s':'mix:f@52,c','55':'c','54s':'f','44':'mix:c@52,f',
    '33':'c','22':'mix:c@50,f',
  },

}
