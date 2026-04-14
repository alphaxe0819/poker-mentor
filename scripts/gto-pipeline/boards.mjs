/**
 * HU 40BB SRP flop board catalog for v1.0 batch generation.
 *
 * 12 boards covering all major texture categories so the bot's decision
 * coverage is wide enough to validate logic. Each entry includes a slug
 * (filesystem-safe id), the board cards in TexasSolver format, and a
 * texture label for documentation.
 */

export const BOARDS = [
  // ── Dry rainbow (4) ───────────────────────────────
  { slug: 'As7d2c',  cards: 'As,7d,2c', texture: 'dry_high_A',     desc: 'Ace-high dry rainbow' },
  { slug: 'Kc8h3s',  cards: 'Kc,8h,3s', texture: 'dry_high_K',     desc: 'King-high dry rainbow' },
  { slug: 'Jc7d2h',  cards: 'Jc,7d,2h', texture: 'dry_mid_J',      desc: 'Jack-high dry rainbow' },
  { slug: '9d5c2h',  cards: '9d,5c,2h', texture: 'dry_low',        desc: 'Low dry rainbow' },

  // ── Semi-wet (3) ──────────────────────────────────
  { slug: 'KsQd4h',  cards: 'Ks,Qd,4h', texture: 'broadway_dry',   desc: 'Two broadway, rainbow' },
  { slug: 'Td8h4c',  cards: 'Td,8h,4c', texture: 'gutter_mid',     desc: 'Mid gutter rainbow' },
  { slug: 'Js9c3h',  cards: 'Js,9c,3h', texture: 'one_gap',        desc: 'One-gap rainbow' },

  // ── Wet two-tone / draws (3) ───────────────────────
  { slug: 'JsTc9h',  cards: 'Js,Tc,9h', texture: 'straight_wet',   desc: 'Straight-wet rainbow' },
  { slug: '9h8d7c',  cards: '9h,8d,7c', texture: 'connected_low',  desc: 'Low connectors rainbow' },
  { slug: 'Tc9c6d',  cards: 'Tc,9c,6d', texture: 'flush_draw',     desc: 'Flush draw + connected' },

  // ── Paired (2) ────────────────────────────────────
  { slug: '7s7d2h',  cards: '7s,7d,2h', texture: 'paired_low',     desc: 'Paired low' },
  { slug: 'KcKd5h',  cards: 'Kc,Kd,5h', texture: 'paired_high',    desc: 'Paired high' },

  // ── Original POC board (re-run for consistent export naming) ──
  { slug: 'QsJh2h',  cards: 'Qs,Jh,2h', texture: 'wet_broadway',   desc: 'Wet broadway with flush draw' },
]

export const STACK_RATIOS = [
  // 1:1 = 40BB vs 40BB (already generated)
  {
    slug: '40bb',
    label: '1:1',
    pot_bb: 5,
    effective_stack_bb: 37.5,
    description: 'HU 80BB total 1:1, BTN open 2.5 → BB call → pot 5BB, eff 37.5BB',
  },
  // 1:2 and 2:1 share the same effective stack (short side = 27BB)
  // BTN open 2.5 → BB call → pot 5BB, eff = 27 - 2.5 = 24.5BB
  {
    slug: '25bb',
    label: '1:2 / 2:1',
    pot_bb: 5,
    effective_stack_bb: 24.5,
    description: 'HU 80BB total 1:2 or 2:1, short stack 27BB, eff 24.5BB',
  },
  // 1:5 and 5:1 share the same effective stack (short side = 13BB)
  // BTN open 2.5 → BB call → pot 5BB, eff = 13 - 2.5 = 10.5BB
  {
    slug: '13bb',
    label: '1:5 / 5:1',
    pot_bb: 5,
    effective_stack_bb: 10.5,
    description: 'HU 80BB total 1:5 or 5:1, short stack 13BB, eff 10.5BB',
  },
]

// ── Ranges per stack depth ──
// Deeper stacks = wider ranges; shorter stacks = tighter (more push/fold)

// 40BB ranges (BTN open ~60%, BB flat defend ~45%)
export const HU_40BB_RANGES = {
  ip: 'AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,K8s,K7s,K6s,K5s,K4s,K3s,K2s,QJs,QTs,Q9s,Q8s,Q7s,Q6s,Q5s,JTs,J9s,J8s,J7s,T9s,T8s,T7s,98s,97s,87s,86s,76s,75s,65s,64s,54s,53s,43s,AKo,AQo,AJo,ATo,A9o,A8o,A7o,KQo,KJo,KTo,K9o,QJo,QTo,Q9o,JTo,J9o,T9o,98o',
  oop: '22,33,44,55,66,77,88,99,TT,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,K8s,K7s,K6s,K5s,QJs,QTs,Q9s,Q8s,Q7s,JTs,J9s,J8s,T9s,T8s,98s,97s,87s,86s,76s,75s,65s,54s,43s,AKo,AQo,AJo,ATo,A9o,A8o,KQo,KJo,KTo,K9o,QJo,QTo,JTo,T9o,98o',
}

// 25BB ranges — tighter since shorter stack (open ~50%, defend ~40%)
export const HU_25BB_RANGES = {
  ip: 'AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,K8s,K7s,K6s,K5s,QJs,QTs,Q9s,Q8s,Q7s,JTs,J9s,J8s,T9s,T8s,T7s,98s,97s,87s,86s,76s,65s,54s,43s,AKo,AQo,AJo,ATo,A9o,A8o,KQo,KJo,KTo,K9o,QJo,QTo,JTo,T9o,98o',
  oop: '22,33,44,55,66,77,88,99,TT,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,K8s,K7s,K6s,K5s,QJs,QTs,Q9s,Q8s,JTs,J9s,J8s,T9s,T8s,98s,97s,87s,86s,76s,65s,54s,43s,AKo,AQo,AJo,ATo,A9o,KQo,KJo,KTo,K9o,QJo,QTo,JTo,T9o',
}

// 13BB ranges — very tight, push/fold territory (open ~40%, defend ~35%)
export const HU_13BB_RANGES = {
  ip: 'AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,K8s,QJs,QTs,Q9s,JTs,J9s,T9s,T8s,98s,97s,87s,76s,65s,54s,AKo,AQo,AJo,ATo,A9o,KQo,KJo,KTo,QJo,QTo,JTo',
  oop: '22,33,44,55,66,77,88,99,TT,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,QJs,QTs,JTs,J9s,T9s,98s,87s,76s,65s,54s,AKo,AQo,AJo,ATo,KQo,KJo,KTo,QJo,JTo',
}
