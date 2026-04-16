#!/bin/bash
# Poker Goal - setup dev environment (run once after clone)

# 0. Git identity check
GIT_NAME=$(git config --global user.name 2>/dev/null)
GIT_EMAIL=$(git config --global user.email 2>/dev/null)

if [ -z "$GIT_NAME" ] || [ -z "$GIT_EMAIL" ]; then
  echo "[0/4] Setting git identity ..."
  git config --global user.name "alphaxe0819"
  git config --global user.email "alphaxe@gmail.com"
  echo "  git identity set (alphaxe0819)"
else
  echo "[0/4] git identity already set ($GIT_NAME)"
fi

# 1. Generate .env
echo "[1/4] Generating .env ..."

ENV_FILE=".env"
if [ -f "$ENV_FILE" ]; then
  echo "  .env already exists, skipping"
else
  cat > "$ENV_FILE" << 'EOF'
VITE_SUPABASE_URL=https://qaiwsocjwkjrmyzawabt.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhaXdzb2Nqd2tqcm15emF3YWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NTg5OTksImV4cCI6MjA5MDQzNDk5OX0.gm5z6HXyfcPL07LdJebuWJA4OsYs66pV_dGLM1kbMPQ
VITE_ADMIN_USER=admin
VITE_ADMIN_PASS=PokerGoal2026!

# Lemon Squeezy
VITE_LEMONSQUEEZY_STORE_ID=338476
VITE_LEMONSQUEEZY_CHECKOUT_MONTHLY=https://pokergoal.lemonsqueezy.com/checkout/buy/937ad893-bdff-4f75-be23-01446937be9f
VITE_LEMONSQUEEZY_CHECKOUT_YEARLY=https://pokergoal.lemonsqueezy.com/checkout/buy/cd19cdd8-aa8c-4f49-aaba-658e5bcfb6ca
EOF
  echo "  .env created"
fi

# 2. Link memory/ folder to Claude Code memory location (sync across machines via git)
echo "[2/4] Linking memory/ folder ..."

CLAUDE_MEMORY="$HOME/.claude/projects/C--Users-User-Desktop-gto-poker-trainer/memory"
REPO_MEMORY="$(pwd)/memory"

if [ -L "$CLAUDE_MEMORY" ]; then
  echo "  Symlink already exists, skipping"
elif [ -d "$CLAUDE_MEMORY" ]; then
  BACKUP="${CLAUDE_MEMORY}.backup-$(date +%Y%m%d-%H%M%S)"
  mv "$CLAUDE_MEMORY" "$BACKUP"
  echo "  Backed up existing memory to: $BACKUP"
  mkdir -p "$(dirname "$CLAUDE_MEMORY")"
  ln -s "$REPO_MEMORY" "$CLAUDE_MEMORY"
  echo "  Symlink created: $CLAUDE_MEMORY -> $REPO_MEMORY"
else
  mkdir -p "$(dirname "$CLAUDE_MEMORY")"
  ln -s "$REPO_MEMORY" "$CLAUDE_MEMORY"
  echo "  Symlink created: $CLAUDE_MEMORY -> $REPO_MEMORY"
fi

# 3. npm install
echo "[3/4] npm install ..."
npm install

# 4. TypeScript check
echo "[4/4] TypeScript check ..."
npx tsc -b --noEmit
if [ $? -eq 0 ]; then
  echo "  TypeScript: zero errors"
else
  echo "  TypeScript: has errors, please fix"
fi

echo ""
echo "Done! Run 'npm run dev' to start dev server."
