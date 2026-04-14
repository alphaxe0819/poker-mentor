# Poker Goal - setup dev environment (run once after clone)

# 0. Git identity check
$gitName = git config --global user.name 2>$null
$gitEmail = git config --global user.email 2>$null

if (-not $gitName -or -not $gitEmail) {
    Write-Host "[0/3] Setting git identity ..." -ForegroundColor Cyan
    git config --global user.name "alphaxe0819"
    git config --global user.email "alphaxe@gmail.com"
    Write-Host "  git identity set (alphaxe0819)" -ForegroundColor Green
} else {
    Write-Host "[0/3] git identity already set ($gitName)" -ForegroundColor Green
}

# 1. Generate .env
Write-Host "[1/3] Generating .env ..." -ForegroundColor Cyan

$envFile = ".env"
if (Test-Path $envFile) {
    Write-Host "  .env already exists, skipping" -ForegroundColor Yellow
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
    Write-Host "  .env created" -ForegroundColor Green
}

# 2. npm install
Write-Host "[2/3] npm install ..." -ForegroundColor Cyan
npm install

# 3. TypeScript check
Write-Host "[3/3] TypeScript check ..." -ForegroundColor Cyan
npx tsc -b --noEmit
if ($LASTEXITCODE -eq 0) {
    Write-Host "  TypeScript: zero errors" -ForegroundColor Green
} else {
    Write-Host "  TypeScript: has errors, please fix" -ForegroundColor Red
}

Write-Host ""
Write-Host "Done! Run 'npm run dev' to start dev server." -ForegroundColor Green
