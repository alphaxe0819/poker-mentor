/**
 * HU SRP board catalog + representative turn/river cards for batch generation.
 *
 * v1.0: 13 flop boards only (already generated as .ts files)
 * v2.0: 每個 flop 加上 10 張代表性 turn cards + 8 張代表性 river cards
 *
 * Turn card 選擇策略（每個 flop 選 10 張）：
 *   - 2 張高牌（A/K/Q）— 改變頂對、broadway 完成
 *   - 2 張中牌（J/T/9）— 帶來順子可能
 *   - 2 張低牌（2-6）— 磚牌（blank），策略變化小但頻率高
 *   - 2 張同花完成牌 — 花色與 flop 某張相同
 *   - 2 張順子完成/改變牌 — 讓 board 連牌結構改變
 *   - 排除 flop 已出現的 rank+suit
 *
 * River card 選擇策略（每個 turn 選 8 張）：
 *   - 動態產生：排除 flop+turn 已用的牌，從剩餘牌中選代表性的
 *   - 覆蓋高/中/低 + 同花完成 + 配對 board
 */

export const BOARDS = [
  // ── Dry rainbow (4) ───────────────────────────────
  {
    slug: 'As7d2c', cards: 'As,7d,2c', texture: 'dry_high_A', desc: 'Ace-high dry rainbow',
    turnCards: ['Kh', 'Qh', 'Jc', 'Td', '9h', '6s', '4d', '3h', '5h', '8c'],
    //          高K    高Q    中J    中T    中9    低磚   低磚   低磚   順子改變 中8
  },
  {
    slug: 'Kc8h3s', cards: 'Kc,8h,3s', texture: 'dry_high_K', desc: 'King-high dry rainbow',
    turnCards: ['Ad', 'Qd', 'Jh', 'Td', '9c', '6d', '4h', '2d', '5c', '7s'],
    //          高A    高Q    中J    中T    中9    低磚   低磚   低磚   低5     中7
  },
  {
    slug: 'Jc7d2h', cards: 'Jc,7d,2h', texture: 'dry_mid_J', desc: 'Jack-high dry rainbow',
    turnCards: ['Ah', 'Kd', 'Qs', 'Td', '9c', '8s', '6h', '4c', '3d', '5s'],
    //          高A    高K    高Q    中T    中9    順子   低磚   低磚   低磚   低5
  },
  {
    slug: '9d5c2h', cards: '9d,5c,2h', texture: 'dry_low', desc: 'Low dry rainbow',
    turnCards: ['Ah', 'Kc', 'Qd', 'Jh', 'Ts', '8c', '7h', '6d', '4s', '3d'],
    //          高A    高K    高Q    中J    中T    順子   順子   順子   低4    低3
  },

  // ── Semi-wet (3) ──────────────────────────────────
  {
    slug: 'KsQd4h', cards: 'Ks,Qd,4h', texture: 'broadway_dry', desc: 'Two broadway, rainbow',
    turnCards: ['Ah', 'Jc', 'Td', 'As', '9h', '8c', '6d', '3s', '2c', '5s'],
    //          高A順子 中J順子 中T順子 同花A  中9    中8    低磚   低磚   低磚   低5
  },
  {
    slug: 'Td8h4c', cards: 'Td,8h,4c', texture: 'gutter_mid', desc: 'Mid gutter rainbow',
    turnCards: ['Ad', 'Kh', 'Qc', 'Jh', '9s', '7c', '6d', '5h', '3s', '2h'],
    //          高A    高K    高Q    順子J  順子9  順子7  順子6  低5    低磚   低磚
  },
  {
    slug: 'Js9c3h', cards: 'Js,9c,3h', texture: 'one_gap', desc: 'One-gap rainbow',
    turnCards: ['Ah', 'Kd', 'Qc', 'Ts', '8d', '7h', '6c', '4s', '2d', '5d'],
    //          高A    高K    順子Q  順子T  順子8  中7    低6    低磚   低磚   低5
  },

  // ── Wet two-tone / draws (3) ───────────────────────
  {
    slug: 'JsTc9h', cards: 'Js,Tc,9h', texture: 'straight_wet', desc: 'Straight-wet rainbow',
    turnCards: ['Ah', 'Kd', 'Qc', '8s', '7d', '6c', '4h', '2d', '3s', 'Ks'],
    //          高A    順子K  順子Q  順子8  順子7  低6    低磚   低磚   低磚   同花K
  },
  {
    slug: '9h8d7c', cards: '9h,8d,7c', texture: 'connected_low', desc: 'Low connectors rainbow',
    turnCards: ['Ah', 'Kd', 'Qc', 'Js', 'Td', '6s', '5h', '4d', '3c', '2s'],
    //          高A    高K    高Q    順子J  順子T  順子6  順子5  低4    低磚   低磚
  },
  {
    slug: 'Tc9c6d', cards: 'Tc,9c,6d', texture: 'flush_draw', desc: 'Flush draw + connected',
    turnCards: ['Ac', 'Kc', 'Ah', 'Jd', '8s', '7h', '5c', '4h', '3c', '2s'],
    //          同花A  同花K  高A    中J    順子8  順子7  同花5  低磚   同花3  低磚
  },

  // ── Paired (2) ────────────────────────────────────
  {
    slug: '7s7d2h', cards: '7s,7d,2h', texture: 'paired_low', desc: 'Paired low',
    turnCards: ['Ah', 'Kc', 'Qd', 'Js', 'Td', '9c', '8h', '5s', '4d', '3c'],
    //          高A    高K    高Q    中J    中T    中9    順子8  低5    低磚   低磚
  },
  {
    slug: 'KcKd5h', cards: 'Kc,Kd,5h', texture: 'paired_high', desc: 'Paired high',
    turnCards: ['Ah', 'Qs', 'Jd', 'Tc', '9h', '8s', '7d', '6c', '4s', '3d'],
    //          高A    高Q    中J    中T    中9    中8    中7    低6    低磚   低磚
  },

  // ── Original POC board ────────────────────────────
  {
    slug: 'QsJh2h', cards: 'Qs,Jh,2h', texture: 'wet_broadway', desc: 'Wet broadway with flush draw',
    turnCards: ['Ah', 'Kd', 'Ts', '9c', '8d', '7h', '6c', '4s', '3d', 'Kh'],
    //          高A    順子K  順子T  中9    中8    同花7  低6    低磚   低磚   同花K
  },
]

/**
 * 為指定的 flop + turn 產生 8 張代表性 river cards。
 * 排除 flop 和 turn 已用的牌，從剩餘牌中選覆蓋面最廣的 8 張。
 */
export function generateRiverCards(flopCards, turnCard) {
  const RANKS = 'AKQJT98765432'
  const SUITS = 'cdhs'
  const used = new Set()

  // 解析已用的牌
  const allCards = flopCards.replace(/,/g, '')
  for (let i = 0; i < allCards.length; i += 2) {
    used.add(allCards.slice(i, i + 2))
  }
  used.add(turnCard)

  // 收集所有剩餘牌
  const remaining = []
  for (const r of RANKS) {
    for (const s of SUITS) {
      const card = r + s
      if (!used.has(card)) remaining.push(card)
    }
  }

  // 選 8 張代表性牌：2 高 + 2 中 + 2 低 + 1 同花完成 + 1 配對 board
  const picks = []
  const usedRanks = new Set()

  // Helper: 從 remaining 中找第一張符合條件的牌
  function pick(filter) {
    for (let i = 0; i < remaining.length; i++) {
      const c = remaining[i]
      if (filter(c) && !usedRanks.has(c[0])) {
        picks.push(c)
        usedRanks.add(c[0])
        remaining.splice(i, 1)
        return true
      }
    }
    return false
  }

  const highRanks = new Set('AKQJ'.split(''))
  const midRanks = new Set('T987'.split(''))
  const lowRanks = new Set('65432'.split(''))

  // 2 高
  pick(c => highRanks.has(c[0]))
  pick(c => highRanks.has(c[0]))
  // 2 中
  pick(c => midRanks.has(c[0]))
  pick(c => midRanks.has(c[0]))
  // 2 低
  pick(c => lowRanks.has(c[0]))
  pick(c => lowRanks.has(c[0]))
  // 補滿到 8 張
  while (picks.length < 8 && remaining.length > 0) {
    const c = remaining.shift()
    if (!usedRanks.has(c[0])) {
      picks.push(c)
      usedRanks.add(c[0])
    }
  }

  return picks.slice(0, 8)
}

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

// 40BB ranges — corrected from RYE Rangeviewer data (HU-25BBMais 35-50BB)
// BTN open ~87% (148/169), BB flat defend ~70% (119/169, excludes 3bet hands)
export const HU_40BB_RANGES = {
  ip: 'AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,K8s,K7s,K6s,K5s,K4s,K3s,K2s,QJs,QTs,Q9s,Q8s,Q7s,Q6s,Q5s,Q4s,Q3s,Q2s,JTs,J9s,J8s,J7s,J6s,J5s,J4s,J3s,J2s,T9s,T8s,T7s,T6s,T5s,T4s,T3s,T2s,98s,97s,96s,95s,94s,93s,92s,87s,86s,85s,84s,83s,82s,76s,75s,74s,73s,72s,65s,64s,63s,62s,54s,53s,52s,43s,42s,32s,AKo,AQo,AJo,ATo,A9o,A8o,A7o,A6o,A5o,KQo,KJo,KTo,K9o,K8o,K7o,K6o,K5o,K4o,K3o,K2o,QJo,QTo,Q9o,Q8o,Q7o,Q6o,Q5o,Q4o,Q3o,Q2o,JTo,J9o,J8o,J7o,J6o,J5o,J4o,J3o,J2o,T9o,T8o,T7o,T6o,T5o,98o,97o,96o,95o,87o,86o,85o,76o,75o,74o,65o,64o,54o',
  oop: '88,77,66,55,44,33,22,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,K9s,K8s,K7s,K6s,K5s,K4s,K3s,K2s,QTs,Q9s,Q8s,Q7s,Q6s,Q5s,Q4s,Q3s,Q2s,JTs,J9s,J8s,J7s,J6s,J5s,J4s,J3s,J2s,T9s,T8s,T7s,T6s,T5s,T4s,T3s,T2s,98s,97s,95s,94s,93s,92s,87s,84s,83s,82s,76s,73s,72s,62s,52s,42s,32s,ATo,A9o,A8o,A7o,A6o,A5o,A4o,A3o,A2o,KTo,K9o,K8o,K7o,K6o,K5o,K4o,K3o,K2o,QJo,QTo,Q9o,Q8o,Q7o,Q6o,Q5o,Q4o,Q3o,Q2o,JTo,J9o,J8o,J7o,J6o,J5o,T9o,T8o,T7o,T6o,T5o,98o,97o,96o,95o,87o,86o,85o,84o,76o,75o,74o,63o,53o,43o',
}

// 25BB ranges — corrected from RYE (HU-25BB 20-25BB)
// At 25BB, SB mixes open-raise + limp. SRP IP = open-raise hands only (96/169)
// AA/AKs/AQs limp-trap at this depth (not in SRP range)
export const HU_25BB_RANGES = {
  ip: 'KK,QQ,JJ,TT,99,88,77,66,55,A9s,KQs,KJs,KTs,K9s,K8s,K7s,K6s,QJs,QTs,Q9s,Q8s,Q6s,Q5s,Q4s,Q3s,Q2s,JTs,J9s,J8s,J6s,J5s,J4s,J3s,J2s,T9s,T8s,T6s,T5s,T4s,T3s,T2s,98s,97s,96s,95s,94s,93s,87s,86s,85s,84s,83s,76s,75s,74s,73s,65s,63s,AKo,AQo,AJo,ATo,A9o,A8o,KQo,KJo,KTo,K8o,K7o,K6o,K5o,K4o,K3o,K2o,QJo,QTo,Q8o,Q7o,Q6o,Q5o,Q4o,Q3o,Q2o,JTo,J8o,J7o,J6o,T8o,T7o,T6o,98o,97o,96o,87o,86o,76o',
  oop: 'A5s,A4s,A3s,A2s,K9s,K8s,K7s,K6s,K5s,K4s,K3s,K2s,QJs,QTs,Q9s,Q8s,Q7s,Q6s,Q5s,Q4s,Q3s,Q2s,JTs,J9s,J8s,J7s,J6s,J5s,J4s,J3s,J2s,T9s,T8s,T7s,T6s,T5s,T4s,T3s,T2s,98s,97s,96s,95s,94s,93s,92s,87s,86s,85s,84s,83s,82s,76s,75s,73s,65s,64s,62s,54s,52s,32s,A5o,A4o,A3o,A2o,KJo,KTo,K9o,K8o,K7o,K6o,K5o,K4o,K3o,K2o,QJo,QTo,Q9o,Q8o,Q7o,Q6o,Q5o,Q4o,Q3o,Q2o,JTo,J9o,J8o,J7o,J6o,J5o,T9o,T8o,T7o,T6o,98o,97o,96o,87o,86o,85o,76o',
}

// 13BB ranges — corrected from RYE (HU-25BB 10-15BB)
// At 13BB, most hands limp or shove. Only 41 hands open-raise (create SRP)
// BB defends very wide (77/169) because pot odds are huge
export const HU_13BB_RANGES = {
  ip: '66,55,44,33,22,A7s,A6s,A4s,A3s,A2s,K7s,K6s,K5s,K4s,K3s,K2s,Q8s,Q7s,J8s,J7s,T8s,T7s,98s,97s,87s,ATo,A9o,A8o,A7o,A6o,A5o,A4o,A3o,A2o,K9o,K8o,QTo,Q9o,JTo,J9o,T9o',
  oop: 'AA,Q8s,Q7s,Q6s,Q5s,Q4s,Q3s,Q2s,J9s,J8s,J7s,J6s,J5s,J4s,J3s,J2s,T9s,T8s,T7s,T6s,T5s,T4s,T3s,T2s,98s,97s,96s,95s,94s,93s,92s,87s,86s,85s,84s,83s,76s,75s,74s,73s,65s,64s,63s,54s,53s,43s,K8o,K7o,K6o,K5o,K4o,K3o,K2o,QTo,Q9o,Q8o,Q7o,Q6o,Q5o,JTo,J9o,J8o,J7o,T9o,T8o,T7o,98o,97o,96o,87o,86o,85o,76o,75o,65o,64o,54o',
}
