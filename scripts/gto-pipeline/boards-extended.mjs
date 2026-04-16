/**
 * Extended board catalog — 30 flop textures covering the full range
 * of boards the bot may face. Organized by texture category.
 *
 * Use with generate-input-v2.mjs to produce solver inputs for any
 * scenario × board combination.
 */

export const BOARDS_EXTENDED = [
  // ════════════════════════════════════════════════════════════
  // 1. DRY RAINBOW (high equity disparity, easy to barrel)
  // ════════════════════════════════════════════════════════════
  { slug: 'As7d2c',  cards: 'As,7d,2c', texture: 'dry_high_A',    desc: 'Ace-high dry rainbow' },
  { slug: 'Ah5c2d',  cards: 'Ah,5c,2d', texture: 'dry_high_A_wheel', desc: 'Ace-high with wheel draw' },
  { slug: 'Kc8h3s',  cards: 'Kc,8h,3s', texture: 'dry_high_K',    desc: 'King-high dry rainbow' },
  { slug: 'Qd7s2c',  cards: 'Qd,7s,2c', texture: 'dry_high_Q',    desc: 'Queen-high dry rainbow' },
  { slug: 'Jc7d2h',  cards: 'Jc,7d,2h', texture: 'dry_mid_J',     desc: 'Jack-high dry rainbow' },
  { slug: '9d5c2h',  cards: '9d,5c,2h', texture: 'dry_low',       desc: 'Low dry rainbow' },
  { slug: '8s5h2c',  cards: '8s,5h,2c', texture: 'dry_low_8',     desc: '8-high dry rainbow' },

  // ════════════════════════════════════════════════════════════
  // 2. SEMI-WET (some draws, moderate coordination)
  // ════════════════════════════════════════════════════════════
  { slug: 'KsQd4h',  cards: 'Ks,Qd,4h', texture: 'broadway_dry',  desc: 'Two broadway, rainbow' },
  { slug: 'Ah8h3c',  cards: 'Ah,8h,3c', texture: 'ace_fd',        desc: 'Ace-high flush draw' },
  { slug: 'Kh9h4c',  cards: 'Kh,9h,4c', texture: 'king_fd',       desc: 'King-high flush draw' },
  { slug: 'Td8h4c',  cards: 'Td,8h,4c', texture: 'gutter_mid',    desc: 'Mid gutter rainbow' },
  { slug: 'Js9c3h',  cards: 'Js,9c,3h', texture: 'one_gap',       desc: 'One-gap rainbow' },
  { slug: 'Qh9d6s',  cards: 'Qh,9d,6s', texture: 'two_gap',       desc: 'Two-gap mid rainbow' },

  // ════════════════════════════════════════════════════════════
  // 3. WET / DYNAMIC (straight + flush draws, lots of turn cards change equity)
  // ════════════════════════════════════════════════════════════
  { slug: 'JsTc9h',  cards: 'Js,Tc,9h', texture: 'straight_wet',  desc: 'Straight-wet rainbow' },
  { slug: 'QsJh2h',  cards: 'Qs,Jh,2h', texture: 'broadway_fd',   desc: 'Wet broadway with flush draw' },
  { slug: 'Jh9h7c',  cards: 'Jh,9h,7c', texture: 'straight_fd',   desc: 'Straight + flush draw' },
  { slug: '9h8d7c',  cards: '9h,8d,7c', texture: 'connected_low', desc: 'Low connectors rainbow' },
  { slug: 'Tc9c6d',  cards: 'Tc,9c,6d', texture: 'flush_draw',    desc: 'Flush draw + connected' },
  { slug: '8s7s5d',  cards: '8s,7s,5d', texture: 'suited_connected', desc: 'Suited connectors 8-7-5' },
  { slug: '6d5h4c',  cards: '6d,5h,4c', texture: 'low_wet',       desc: 'Low wet connectors' },

  // ════════════════════════════════════════════════════════════
  // 4. MONOTONE (single-suit, limits bluffing, flush-dominated)
  // ════════════════════════════════════════════════════════════
  { slug: 'Kh8h3h',  cards: 'Kh,8h,3h', texture: 'mono_high',     desc: 'Monotone K-high' },
  { slug: 'Qc9c4c',  cards: 'Qc,9c,4c', texture: 'mono_mid',      desc: 'Monotone Q-high' },
  { slug: '9s7s3s',  cards: '9s,7s,3s', texture: 'mono_low',      desc: 'Monotone 9-high' },

  // ════════════════════════════════════════════════════════════
  // 5. PAIRED (lots of equity reduction, different strategy)
  // ════════════════════════════════════════════════════════════
  { slug: '7s7d2h',  cards: '7s,7d,2h', texture: 'paired_low',    desc: 'Paired low (77)' },
  { slug: 'KcKd5h',  cards: 'Kc,Kd,5h', texture: 'paired_high',   desc: 'Paired high (KK)' },
  { slug: 'AsAd7c',  cards: 'As,Ad,7c', texture: 'paired_ace',    desc: 'Paired aces' },
  { slug: 'Ts9c9h',  cards: 'Ts,9c,9h', texture: 'paired_mid',    desc: 'Paired mid with overcard' },
  { slug: 'Js8s8c',  cards: 'Js,8s,8c', texture: 'paired_fd',     desc: 'Paired with flush draw' },

  // ════════════════════════════════════════════════════════════
  // 6. TRIPS / WEIRD (edge cases for range robustness)
  // ════════════════════════════════════════════════════════════
  { slug: '5s5c5d',  cards: '5s,5c,5d', texture: 'trips',         desc: 'Trips (5-5-5)' },
  { slug: 'Ah2d2c',  cards: 'Ah,2d,2c', texture: 'paired_a2',     desc: 'Ace-deuce pair' },
]

// Quick texture filter
export const BOARDS_BY_TEXTURE = BOARDS_EXTENDED.reduce((acc, b) => {
  const cat = b.texture.split('_')[0]
  if (!acc[cat]) acc[cat] = []
  acc[cat].push(b)
  return acc
}, {})
