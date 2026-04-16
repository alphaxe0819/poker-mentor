# Poker Goal - setup dev environment (run once after clone)

# 0. Git identity check
$gitName = git config --global user.name 2>$null
$gitEmail = git config --global user.email 2>$null

if (-not $gitName -or -not $gitEmail) {
    Write-Host "[0/4] Setting git identity ..." -ForegroundColor Cyan
    git config --global user.name "alphaxe0819"
    git config --global user.email "alphaxe@gmail.com"
    Write-Host "  git identity set (alphaxe0819)" -ForegroundColor Green
} else {
    Write-Host "[0/4] git identity already set ($gitName)" -ForegroundColor Green
}

# 1. Generate .env
Write-Host "[1/4] Generating .env ..." -ForegroundColor Cyan

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

# 2. Link memory/ folder to Claude Code memory location (sync across machines via git)
Write-Host "[2/4] Linking memory/ folder ..." -ForegroundColor Cyan

$claudeMemoryPath = "$env:USERPROFILE\.claude\projects\C--Users-User-Desktop-gto-poker-trainer\memory"
$repoMemoryPath = (Resolve-Path ".\memory").Path

if (Test-Path $claudeMemoryPath) {
    $item = Get-Item $claudeMemoryPath -Force
    if ($item.Attributes -band [System.IO.FileAttributes]::ReparsePoint) {
        Write-Host "  Junction already exists, skipping" -ForegroundColor Yellow
    } else {
        # Backup existing files then remove folder
        $backupPath = "$claudeMemoryPath.backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
        Move-Item $claudeMemoryPath $backupPath
        Write-Host "  Backed up existing memory to: $backupPath" -ForegroundColor Yellow
        New-Item -ItemType Junction -Path $claudeMemoryPath -Target $repoMemoryPath | Out-Null
        Write-Host "  Junction created: $claudeMemoryPath -> $repoMemoryPath" -ForegroundColor Green
    }
} else {
    # Parent folder might not exist yet (fresh Claude Code install)
    $parentPath = Split-Path $claudeMemoryPath -Parent
    if (-not (Test-Path $parentPath)) {
        New-Item -ItemType Directory -Path $parentPath -Force | Out-Null
    }
    New-Item -ItemType Junction -Path $claudeMemoryPath -Target $repoMemoryPath | Out-Null
    Write-Host "  Junction created: $claudeMemoryPath -> $repoMemoryPath" -ForegroundColor Green
}

# 3. npm install
Write-Host "[3/4] npm install ..." -ForegroundColor Cyan
npm install

# 4. TypeScript check
Write-Host "[4/4] TypeScript check ..." -ForegroundColor Cyan
npx tsc -b --noEmit
if ($LASTEXITCODE -eq 0) {
    Write-Host "  TypeScript: zero errors" -ForegroundColor Green
} else {
    Write-Host "  TypeScript: has errors, please fix" -ForegroundColor Red
}

Write-Host ""
Write-Host "Done! Run 'npm run dev' to start dev server." -ForegroundColor Green
