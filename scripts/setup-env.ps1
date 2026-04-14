# Poker Goal — 新電腦一鍵設定（clone 後跑這個就好）

Write-Host "🚀 Poker Goal 開發環境設定中..." -ForegroundColor Cyan

# 1. 產生 .env
$envFile = ".env"
if (Test-Path $envFile) {
    Write-Host "⚠️  .env 已存在，跳過產生" -ForegroundColor Yellow
} else {
@"
VITE_SUPABASE_URL=https://qaiwsocjwkjrmyzawabt.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhaXdzb2Nqd2tqcm15emF3YWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NTg5OTksImV4cCI6MjA5MDQzNDk5OX0.gm5z6HXyfcPL07LdJebuWJA4OsYs66pV_dGLM1kbMPQ
VITE_ADMIN_USER=admin
VITE_ADMIN_PASS=PokerGoal2026!

# Lemon Squeezy
VITE_LEMONSQUEEZY_STORE_ID=338476
VITE_LEMONSQUEEZY_CHECKOUT_MONTHLY=https://pokergoal.lemonsqueezy.com/checkout/buy/937ad893-bdff-4f75-be23-01446937be9f
VITE_LEMONSQUEEZY_CHECKOUT_YEARLY=https://pokergoal.lemonsqueezy.com/checkout/buy/cd19cdd8-aa8c-4f49-aaba-658e5bcfb6ca
"@ | Out-File -Encoding utf8 $envFile
    Write-Host "✅ .env 已產生" -ForegroundColor Green
}

# 2. npm install
Write-Host "📦 安裝 dependencies..." -ForegroundColor Cyan
npm install

# 3. TypeScript 檢查
Write-Host "🔍 TypeScript 編譯檢查..." -ForegroundColor Cyan
npx tsc -b --noEmit
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ TypeScript 零錯誤" -ForegroundColor Green
} else {
    Write-Host "❌ TypeScript 有錯誤，請修復" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 設定完成！執行 npm run dev 啟動開發伺服器" -ForegroundColor Green
