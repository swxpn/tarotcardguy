create extension if not exists pgcrypto;

create table if not exists public.readings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  cards jsonb not null,
  created_at timestamptz not null default now(),
  constraint readings_cards_is_array check (jsonb_typeof(cards) = 'array'),
  constraint readings_cards_exact_length check (jsonb_array_length(cards) = 3)
);

create index if not exists readings_user_id_created_at_idx on public.readings (user_id, created_at desc);
create index if not exists readings_created_at_idx on public.readings (created_at desc);

alter table public.readings enable row level security;

drop policy if exists "readings_select_own" on public.readings;
create policy "readings_select_own"
  on public.readings
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "readings_insert_own" on public.readings;
create policy "readings_insert_own"
  on public.readings
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create or replace function public.get_reading_by_id(reading_id uuid)
returns public.readings
language sql
security definer
set search_path = public
as $$
  select *
  from public.readings
  where id = reading_id
  limit 1;
$$;

grant execute on function public.get_reading_by_id(uuid) to anon, authenticated;