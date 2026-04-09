// Scripted onboarding tutorial for AI Coach (no token cost)

export interface OnboardingStep {
  type: 'coach' | 'user-choices'
  text?: string
  choices?: { label: string; responseKey: string }[]
}

export interface OnboardingResponse {
  text: string
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    type: 'coach',
    text: '👋 歡迎！我是你的 AI 撲克教練。\n\n你可以跟我討論任何手牌的打法，我會用 GTO 的角度幫你分析。\n\n來試試看，選一個你想問的問題：',
  },
  {
    type: 'user-choices',
    choices: [
      { label: 'BTN 拿到 AQo 被 3-bet，該怎麼辦？', responseKey: 'aq_3bet' },
      { label: '短籌碼 15BB，什麼範圍該推全下？', responseKey: 'short_stack' },
      { label: '中位置拿到 JTs，要開還是不開？', responseKey: 'jts_open' },
    ],
  },
]

export const ONBOARDING_RESPONSES: Record<string, OnboardingResponse> = {
  aq_3bet: {
    text: '好問題！BTN 開局被 3-bet 拿著 AQo：\n\n**結論：跟注。**\n\nAQo 不夠強到 4-bet（容易被 5-bet 逼進尷尬局面），但絕對夠強跟注看翻牌。你有位置優勢，翻後可以根據牌面做決定。\n\n唯一例外：如果 3-bet 來自非常緊的玩家，可以考慮棄牌。但對一般對手，跟注是標準打法。',
  },
  short_stack: {
    text: '15BB 是經典的推疊區間！簡單規則：\n\n**UTG/HJ：** 77+、ATs+、AJo+、KQs\n**CO/BTN：** 更寬，加入 55+、A2s+、KJs+、QJs\n**SB：** 看 BB 的防守頻率，通常可以推很寬\n\n關鍵思路：15BB 不適合加注後再棄牌（你已投入太多比例）。所以要嘛推全下，要嘛棄牌。這叫 push/fold 策略。',
  },
  jts_open: {
    text: 'JTs 是翻前最有價值的同花連張之一！\n\n**HJ 以後的位置：一定要開。** 加注到 2-2.5BB。\n\nJTs 的強處在於它能做很多堅果牌（順子、同花），翻後可玩性極高。即使翻前沒中，翻牌常常給你好的半詐唬機會。\n\n**UTG：** 100BB 深可以開，但如果桌上 3-bet 頻率高，可以考慮棄牌。位置越前面要越謹慎。',
  },
}

export const ONBOARDING_OUTRO =
  '這就是我能幫你的方式！不只手牌分析，你也可以問我：\n\n• 特定位置的開局範圍\n• 面對不同對手類型的調整\n• 下注尺寸的選擇邏輯\n• 翻後的打法建議\n\n正式使用每則訊息消耗 **5 點**。'
