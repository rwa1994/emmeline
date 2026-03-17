-- Emmeline database schema
-- Run this in your Supabase SQL editor (Database > SQL Editor > New query)

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────
-- Profiles
-- ─────────────────────────────────────────
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  role text not null check (role in ('her', 'partner')),
  last_period_start date,
  cycle_length integer default 28 check (cycle_length between 21 and 45),
  period_length integer default 5 check (period_length between 1 and 14),
  created_at timestamptz default now()
);

-- ─────────────────────────────────────────
-- Daily logs
-- ─────────────────────────────────────────
create table daily_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  log_date date not null,
  flow text default 'none' check (flow in ('none', 'spotting', 'light', 'medium', 'heavy')),
  physical_symptoms text[] default '{}',
  emotional_symptoms text[] default '{}',
  energy integer default 3 check (energy between 1 and 5),
  notes text default '',
  created_at timestamptz default now(),
  unique(user_id, log_date)
);

-- ─────────────────────────────────────────
-- Row Level Security
-- Users can only access their own data
-- ─────────────────────────────────────────
alter table profiles enable row level security;
alter table daily_logs enable row level security;

-- Profiles policies
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Daily logs policies
create policy "Users can view own logs"
  on daily_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert own logs"
  on daily_logs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own logs"
  on daily_logs for update
  using (auth.uid() = user_id);

create policy "Users can delete own logs"
  on daily_logs for delete
  using (auth.uid() = user_id);
