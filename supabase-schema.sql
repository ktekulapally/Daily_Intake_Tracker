-- ============================================================================
-- DAILY INTAKE TRACKER — full database schema (Supabase / Postgres)
-- Run this once in Supabase → SQL Editor → New query → paste all → Run.
-- ============================================================================

create table if not exists intake_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null default auth.uid(),

  intake_date date not null default current_date,
  intake_time time not null default current_time,
  meal_type text not null,              -- Breakfast / Mid-Morning Snack / Lunch / Evening Snack / Dinner
  food_name text not null,
  category text not null,               -- Rice/Grains, Dairy, Vegetables, ... (see app for full list)

  quantity numeric(10,2) not null check (quantity > 0),
  unit text not null,                   -- Pieces, Bowl, Cup, g, ml, ...

  ingredients text,
  preparation_method text,
  brand_restaurant text,
  notes text,

  is_packaged_food boolean not null default false,
  is_new_food boolean not null default false,
  previously_consumed boolean not null default true,

  photo_url text,                       -- reserved for a future photo-upload feature; unused in v1

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists intake_records_user_date_idx
  on intake_records (user_id, intake_date desc, intake_time);

alter table intake_records enable row level security;

create policy "Users can view own intake records"
  on intake_records for select using (auth.uid() = user_id);
create policy "Users can insert own intake records"
  on intake_records for insert with check (auth.uid() = user_id);
create policy "Users can update own intake records"
  on intake_records for update using (auth.uid() = user_id);
create policy "Users can delete own intake records"
  on intake_records for delete using (auth.uid() = user_id);

-- Keep updated_at current on every edit
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists intake_records_set_updated_at on intake_records;
create trigger intake_records_set_updated_at
  before update on intake_records
  for each row execute function set_updated_at();
