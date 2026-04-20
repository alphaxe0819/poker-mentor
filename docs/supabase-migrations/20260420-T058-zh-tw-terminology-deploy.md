# T-058 繁中 poker 術語 grounding — 部署指南

## 前置
- dev 版本 ≥ v0.8.1-dev.37
- 測試 Supabase project: btiqmckyjyswzrarmfxa

## 部署步驟
1. 打開 supabase/functions/exploit-coach/index.ts，全選複製整檔
2. 登入 https://supabase.com/dashboard/project/btiqmckyjyswzrarmfxa
3. 左側選 Edge Functions → exploit-coach
4. 右上「Edit function」或「Via Editor」
5. 整檔貼上（覆蓋原內容）
6. 按 Deploy
7. Deploy 完成 log 顯示 new version 即 OK

## 實機驗收（3 條，全 pass 才算真 Done）
打開 https://poker-goal-dev.vercel.app/ → 教練 tab
設定：hero BTN / villain CO (跟注站型) / board K♠Q♣7♥

### 驗收 1：壓制
- 輸入：「我拿 QQ 面對 AK 擊中 K，怎麼辦」
- ✅ AI 用「被 AK 壓制」/「QQ 被壓制」
- ❌ 說「過度」= fail

### 驗收 2：bluff catcher
- 追問：「bluff catcher 是什麼」
- ✅ AI 回「抓詐唬牌」或保留英文
- ❌ 回「詐唬捕手」= fail

### 驗收 3：大陸用語
- 隨機問翻後場景（例：「如果對手跟 bet，該怎麼辦」）
- ✅ 不蹦「蝨子」「踢子」「皮卡」等
- ❌ 有大陸用語 = fail

## 失敗回報格式
- Bug #：(1/2/3)
- 實際 AI 回覆全文
- Chrome DevTools Console log（若有）

## 全 pass 後
- task-board T-059 → Done
- T-058 從「code merged」升級為「真正 Done（含部署）」
