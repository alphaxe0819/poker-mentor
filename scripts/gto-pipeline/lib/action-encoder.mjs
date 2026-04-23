/**
 * Action encoder lib — GTOW-style action encoding + pot advancement.
 * =============================================================
 * 從 batch-worker.mjs 抽出，供 batch-worker + migration scripts 共用。
 * 行為與 T-097 F-stage 驗過的版本 byte-identical（不改邏輯，只搬位置）。
 *
 * 編碼規則（GTOW spec §4）：
 *   CHECK      → X
 *   CALL       → C
 *   FOLD       → F
 *   BET X      → B<pct>   (pct = X / pot_before_bet * 100)
 *   RAISE Y    → R<pct>   (pct = Y / pot_before_raise * 100)
 *   all-in     → RAI      (bet/raise amount ≥ eff_stack * 0.95)
 * =============================================================
 */

/**
 * Encode a TexasSolver action key into GTOW-style code.
 *
 * @param {string} actKey - raw solver key, e.g. 'CHECK' / 'BET 1.5' / 'RAISE 4.0'
 * @param {number} potBefore - pot size *before* this action (denominator for %)
 * @param {number} effStack - effective stack (bb) for all-in detection
 * @returns {string} GTOW code; '?' for unrecognized input
 */
export function encodeAction(actKey, potBefore, effStack) {
  if (actKey === 'CHECK') return 'X'
  if (actKey === 'CALL') return 'C'
  if (actKey === 'FOLD') return 'F'
  const m = actKey.match(/^(BET|RAISE)\s+([\d.]+)/)
  if (!m) return '?'
  const amt = parseFloat(m[2])
  if (amt >= effStack * 0.95) return 'RAI'
  const pct = Math.round((amt / potBefore) * 100)
  return m[1] === 'BET' ? `B${pct}` : `R${pct}`
}

/**
 * Advance pot/betFacing state after consuming one action.
 *
 * Pot accounting model (HU):
 *   - BET X:   one player commits X this street. pot += X, next player faces X.
 *   - CALL:    current player matches betFacing. pot += betFacing, facing reset to 0.
 *   - RAISE Y: raiser's total this street = Y. pot += Y (raiser adds Y).
 *              Opponent now faces (Y - prior put-in) to match.
 *   - CHECK / FOLD: no chips added.
 *
 * @param {number} pot - current pot size (bb)
 * @param {number} betFacing - amount current actor faces (0 if unopened)
 * @param {string} actKey - raw solver key
 * @returns {{pot: number, betFacing: number}}
 */
export function advancePot(pot, betFacing, actKey) {
  if (actKey === 'CHECK') return { pot, betFacing: 0 }
  if (actKey === 'CALL') return { pot: pot + betFacing, betFacing: 0 }
  if (actKey === 'FOLD') return { pot, betFacing }
  const m = actKey.match(/^(BET|RAISE)\s+([\d.]+)/)
  if (!m) return { pot, betFacing }
  const amt = parseFloat(m[2])
  if (m[1] === 'BET') return { pot: pot + amt, betFacing: amt }
  // RAISE: raiser contributes amt; opponent now faces (amt - their prior put-in)
  return { pot: pot + amt, betFacing: amt - betFacing }
}
