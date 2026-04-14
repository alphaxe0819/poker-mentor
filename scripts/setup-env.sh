#!/bin/bash
# Poker Goal - setup dev environment (run once after clone)

# 0. Git identity check
GIT_NAME=$(git config --global user.name 2>/dev/null)
GIT_EMAIL=$(git config --global user.email 2>/dev/null)

if [ -z "$GIT_NAME" ] || [ -z "$GIT_EMAIL" ]; then
  echo "[0/3] Setting git identity ..."
  git config --global user.name "alphaxe0819"
  git config --global user.email "alphaxe@gmail.com"
  echo "  git identity set (alphaxe0819)"
else
  echo "[0/3] git identity already set ($GIT_NAME)"
fi

# 1. Generate .env
echo "[1/3] Generating .env ..."

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

# 2. npm install
echo "[2/3] npm install ..."
npm install

# 3. TypeScript check
echo "[3/3] TypeScript check ..."
npx tsc -b --noEmit
if [ $? -eq 0 ]; then
  echo "  TypeScript: zero errors"
else
  echo "  TypeScript: has errors, please fix"
fi

echo ""
echo "Done! Run 'npm run dev' to start dev server."
