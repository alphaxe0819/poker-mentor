# Poker Goal — AI 工作規則

## 語言
- 一律使用繁體中文回應

## 程式碼交付
- SQL migration 程式碼直接貼在對話裡（不要只說「在檔案裡」）
- Edge Function 程式碼也直接貼在對話裡（用戶沒有 Supabase CLI，要手動貼到 Dashboard）
- 描述 bug/feature 直接分析修復，不要反覆確認
- 不要膨脹時間估算

## 部署
- 正式網址：https://poker-goal.vercel.app/
- 正式機部署 = `git push origin main`（Vercel 自動部署）
- Edge Functions 透過 Supabase Dashboard → Edge Functions → Via Editor 手動部署
- DB migration 透過 Supabase Dashboard → SQL Editor 手動執行

## 推送到正式機前的必做事項（按順序）
1. 更新 `src/version.ts` 版本號
2. 更新 `CHANGELOG.md` — 記錄這個版本的新功能、改動、修復
3. 更新 memory `MEMORY.md` — 如果有新的產品決策或功能狀態變更
4. 更新此檔案 `CLAUDE.md` — 如果有新的固定規則需要記住
5. `git push origin main`

## 專案資訊
- 路徑：`C:\Users\User\Desktop\gto-poker-trainer`
- GitHub：`https://github.com/alphaxe0819/poker-mentor.git`
- Tech Stack：React 19 + TypeScript 5.9 + Vite 8 + Supabase + Vercel
- Supabase URL：`https://qaiwsocjwkjrmyzawabt.supabase.co`

## 目前產品狀態
- 免費用戶不限訓練次數
- 答題不加點數，點數只從任務和未來儲值取得
- AI 教練使用 Claude Haiku，5 點/則訊息
- 點數系統用 Supabase RPC 原子操作（add_points / spend_points）
