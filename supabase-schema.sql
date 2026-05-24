-- Run this in Supabase SQL Editor

-- User progress state
create table if not exists user_state (
  user_id uuid references auth.users(id) on delete cascade primary key,
  xp int default 0,
  gems int default 0,
  hearts int default 5,
  streak int default 0,
  last_active_date date,
  byte_mood text default 'happy',
  byte_battery int default 100,
  completed_lessons text[] default '{}',
  badges text[] default '{}',
  weekly_xp int default 0,
  week_start_date date,
  updated_at timestamptz default now()
);

-- Per-lesson progress log
create table if not exists user_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  lesson_id text not null,
  xp_earned int default 0,
  completed_at timestamptz default now(),
  unique(user_id, lesson_id)
);

-- RLS
alter table user_state enable row level security;
alter table user_progress enable row level security;

create policy "Users read own state" on user_state for select using (auth.uid() = user_id);
create policy "Users write own state" on user_state for all using (auth.uid() = user_id);

create policy "Users read own progress" on user_progress for select using (auth.uid() = user_id);
create policy "Users write own progress" on user_progress for insert with check (auth.uid() = user_id);

-- Auto-update timestamp
create or replace function update_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger user_state_updated_at before update on user_state
  for each row execute function update_updated_at();
