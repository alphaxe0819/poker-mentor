// ── 答錯時的 GTO 策略說明生成器 ─────────────────────────────────────────────

const RANK_ORDER = 'AKQJT98765432'
function rankValue(r: string): number { return RANK_ORDER.indexOf(r) }

// ── 手牌分類 ─────────────────────────────────────────────────────────────────

export type HandCategory =
  | 'premium_pair'    // AA, KK, QQ
  | 'high_pair'       // JJ, TT
  | 'mid_pair'        // 99-77
  | 'low_pair'        // 66-22
  | 'big_broadway'    // AK, AQ
  | 'mid_broadway'    // AJ, AT, KQ, KJ
  | 'low_broadway'    // KT, QJ, QT, JT
  | 'suited_ace'      // Axs (non-broadway)
  | 'suited_connector'// 連張同花
  | 'suited_gapper'   // 一隔同花
  | 'offsuit_ace'     // Axo (non-broadway)
  | 'trash'           // 其他

function parseHand(hand: string): { r1: string; r2: string; suited: boolean; pair: boolean } {
  const r1 = hand[0]
  const r2 = hand[1]
  const suited = hand.endsWith('s')
  const pair = r1 === r2
  return { r1, r2, suited, pair }
}

export function categorize(hand: string): HandCategory {
  const { r1, r2, suited, pair } = parseHand(hand)
  const v1 = rankValue(r1)
  const v2 = rankValue(r2)

  if (pair) {
    if (v1 <= 2) return 'premium_pair'
    if (v1 <= 4) return 'high_pair'
    if (v1 <= 7) return 'mid_pair'
    return 'low_pair'
  }

  const isBroadway = (r: string) => 'AKQJT'.includes(r)

  if (r1 === 'A' && !isBroadway(r2) && suited) return 'suited_ace'
  if (r1 === 'A' && !isBroadway(r2) && !suited) return 'offsuit_ace'

  if (isBroadway(r1) && isBroadway(r2)) {
    if ((r1 === 'A' && 'KQ'.includes(r2))) return 'big_broadway'
    if ((r1 === 'A' && 'JT'.includes(r2)) || (r1 === 'K' && 'QJ'.includes(r2))) return 'mid_broadway'
    return 'low_broadway'
  }

  if (suited) {
    const gap = v2 - v1
    if (gap === 1) return 'suited_connector'
    if (gap === 2) return 'suited_gapper'
  }

  return 'trash'
}

const CATEGORY_NAMES: Record<HandCategory, string> = {
  premium_pair:     '頂級口袋對',
  high_pair:        '高對',
  mid_pair:         '中對',
  low_pair:         '小對',
  big_broadway:     '頂級大牌',
  mid_broadway:     '中等大牌',
  low_broadway:     '邊緣大牌',
  suited_ace:       '同花 A',
  suited_connector: '同花連張',
  suited_gapper:    '同花隔張',
  offsuit_ace:      '雜色 A',
  trash:            '弱牌',
}

// ── 位置描述 ─────────────────────────────────────────────────────────────────

type PositionType = 'early' | 'middle' | 'late' | 'blinds'

function positionType(pos: string): PositionType {
  if (['UTG', 'UTG+1', 'UTG+2'].includes(pos)) return 'early'
  if (['LJ', 'HJ'].includes(pos)) return 'middle'
  if (['CO', 'BTN'].includes(pos)) return 'late'
  return 'blinds'
}

// 位置描述（供未來擴展使用）
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const POS_DESC: Record<PositionType, string> = {
  early:  '前位需面對多位後手玩家，範圍應收緊',
  middle: '中位有一定位置優勢但仍需謹慎',
  late:   '後位有位置優勢，可以適當放寬範圍',
  blinds: '盲注位置不利，需要更好的牌力補償',
}
void POS_DESC

// ── 行動名稱 ─────────────────────────────────────────────────────────────────

const ACTION_LABELS: Record<string, string> = {
  f: 'Fold', c: 'Call', r: 'Raise', '3b': '3-Bet', '4b': '4-Bet', allin: 'All-in',
}

// ── 主生成函數 ───────────────────────────────────────────────────────────────

export function getExplanation(opts: {
  hand: string
  heroPos: string
  gtoAction: string
  chosenAction: string
  raiserPos: string | null
  raiserAction: string | null
  stackBB: number
}): string {
  const { hand, heroPos, gtoAction, chosenAction, raiserPos, stackBB } = opts
  const cat = categorize(hand)
  const catName = CATEGORY_NAMES[cat]
  const posType = positionType(heroPos)
  const gtoLabel = ACTION_LABELS[gtoAction] ?? gtoAction
  const chosenLabel = ACTION_LABELS[chosenAction] ?? chosenAction
  const { suited } = parseHand(hand)

  const lines: string[] = []

  // ── RFI（開池）場景 ──
  if (!raiserPos) {
    if (gtoAction === 'f') {
      // 應該 Fold 但沒 Fold
      lines.push(`${hand} 屬於${catName}，在 ${heroPos} 開池不夠強。`)
      if (posType === 'early') {
        lines.push('前位開池範圍很窄，只有頂級牌力才值得加注。')
      } else if (posType === 'middle') {
        lines.push('中位範圍略寬，但這手牌仍落在棄牌區間。')
      } else if (posType === 'blinds' && heroPos === 'SB') {
        lines.push('SB 開池需要考慮 BB 的反擊，邊緣牌選擇棄牌。')
      }
    } else if (gtoAction === 'r' || gtoAction === 'allin') {
      if (chosenAction === 'f') {
        lines.push(`${hand} 是${catName}，在 ${heroPos} 有足夠的牌力開池加注。`)
        if (suited) lines.push('同花增加了翻牌後的可玩性和勝率。')
        if (posType === 'late') {
          lines.push('後位加注可以偷盲注並保有位置優勢。')
        }
        if (cat === 'suited_ace') {
          lines.push('同花 A 有堅果同花潛力，作為半詐唬加注非常合適。')
        }
      } else if (chosenAction === 'c') {
        lines.push(`${hand} 在 ${heroPos} 應該加注而非跟注。`)
        if (heroPos === 'SB') {
          lines.push('SB 面對未加注底池，有牌力的手牌應主動加注來孤立 BB。')
        } else {
          lines.push('開池加注可以拿下死錢，也能在有利位置建立底池。')
        }
      }
    } else if (gtoAction === 'c') {
      // 應該 limp/check
      if (chosenAction === 'r') {
        lines.push(`${hand} 在此場景中跟注（平跟）比加注更有利。`)
        lines.push('這類牌有足夠的翻牌後價值，但加注反而會被更強的範圍壓制。')
      } else {
        lines.push(`${hand} 有足夠的底池賠率可以跟注看翻牌。`)
      }
    }
  }
  // ── Facing Raise 場景 ──
  else {
    const raiserDesc = raiserPos
    if (gtoAction === 'f') {
      lines.push(`面對 ${raiserDesc} 加注，${hand}（${catName}）不夠強。`)
      if (posType === 'blinds') {
        lines.push('雖然盲注有底池賠率，但這手牌翻牌後表現不佳，棄牌減少損失。')
      } else {
        lines.push('跟注或 3-Bet 都缺乏足夠的牌力支撐，應選擇棄牌。')
      }
      if (cat === 'low_pair' && stackBB <= 25) {
        lines.push(`在 ${stackBB}BB 深度下，小對的隱含賠率不足以跟注。`)
      }
    } else if (gtoAction === 'c') {
      if (chosenAction === 'f') {
        lines.push(`${hand} 面對 ${raiserDesc} 加注有足夠牌力跟注。`)
        if (cat === 'mid_pair' || cat === 'low_pair') {
          lines.push('口袋對有暗三條潛力，底池賠率支持跟注。')
        }
        if (suited) {
          lines.push('同花牌有翻牌後的可玩性和堅果潛力。')
        }
        if (heroPos === 'BB') {
          lines.push('BB 已投入 1BB，有更好的底池賠率來防守。')
        }
      } else if (chosenAction === '3b') {
        lines.push(`${hand} 面對 ${raiserDesc} 加注應跟注而非 3-Bet。`)
        lines.push('這手牌更適合用翻牌後的可玩性獲利，3-Bet 會讓底池膨脹到不利的程度。')
      }
    } else if (gtoAction === '3b') {
      if (chosenAction === 'f') {
        lines.push(`${hand} 面對 ${raiserDesc} 加注，應該 3-Bet。`)
        if (cat === 'suited_ace' || cat === 'big_broadway') {
          lines.push('這手牌有足夠的阻擋效果和翻牌後堅果潛力，是理想的 3-Bet 牌。')
        }
        if (cat === 'premium_pair' || cat === 'high_pair') {
          lines.push('強牌應透過 3-Bet 建立底池，同時獲取更多價值。')
        }
      } else if (chosenAction === 'c') {
        lines.push(`${hand} 面對 ${raiserDesc} 加注，3-Bet 優於跟注。`)
        if (heroPos === 'SB') {
          lines.push('SB 沒有位置優勢，跟注後翻牌會在不利位置打，3-Bet 可以在翻前奪取主動。')
        } else {
          lines.push('3-Bet 可以孤立加注者並建立底池，利用牌力優勢。')
        }
      }
    } else if (gtoAction === '4b') {
      lines.push(`${hand} 面對 3-Bet 應該 4-Bet。`)
      if (cat === 'premium_pair' || cat === 'big_broadway') {
        lines.push('頂級牌力必須透過 4-Bet 最大化價值。')
      }
      if (cat === 'suited_ace') {
        lines.push('同花 A 作為 4-Bet 半詐唬，有阻擋效果且被跟注時仍有勝率。')
      }
    } else if (gtoAction === 'allin') {
      lines.push(`在 ${stackBB}BB 深度下，${hand} 面對加注應全下。`)
      lines.push('短碼時全下可以最大化棄牌收益並避免翻牌後的困難決策。')
    }
  }

  // 補充籌碼深度說明
  if (stackBB <= 25 && lines.length > 0) {
    lines.push(`短碼（${stackBB}BB）下策略更極端，中間選項（跟注）減少。`)
  }

  if (lines.length === 0) {
    lines.push(`GTO 建議 ${gtoLabel}，你選了 ${chosenLabel}。在此位置和場景下，${gtoLabel} 的期望值更高。`)
  }

  return lines.join('')
}
