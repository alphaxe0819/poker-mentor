-- =============================================
-- GTO Poker Trainer — Supabase 資料表初始化
-- 貼到 Supabase SQL Editor 執行
-- =============================================

-- 用戶資料表
create table profiles (
  id uuid references auth.users primary key,
  email text,
  name text,
  is_coach boolean default false,
  created_at timestamptz default now()
);

-- 教練代碼表
create table coach_codes (
  code text primary key,
  used_by uuid references profiles(id),
  used_at timestamptz,
  created_at timestamptz default now()
);

-- 訓練記錄表
create table training_records (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id),
  position text,
  hand text,
  action_taken text,
  correct_action text,
  is_correct boolean,
  stack_bb integer,
  coach_id text,
  created_at timestamptz default now()
);

-- RLS 政策
alter table profiles enable row level security;
alter table training_records enable row level security;
alter table coach_codes enable row level security;

create policy "users can read own profile"
  on profiles for select using (auth.uid() = id);
create policy "users can update own profile"
  on profiles for update using (auth.uid() = id);
create policy "users can insert own profile"
  on profiles for insert with check (auth.uid() = id);

create policy "users can read own records"
  on training_records for select using (auth.uid() = user_id);
create policy "users can insert own records"
  on training_records for insert with check (auth.uid() = user_id);

create policy "anyone can read coach codes"
  on coach_codes for select using (true);
create policy "anyone can update coach codes"
  on coach_codes for update using (true);
