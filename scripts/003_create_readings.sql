-- Create readings table
create table if not exists public.readings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  book_id uuid not null references public.books(id) on delete cascade,
  status text not null check (status in ('em-andamento', 'concluido')),
  start_date date not null,
  end_date date,
  notes text,
  rating integer check (rating >= 1 and rating <= 5),
  pages_read integer,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create indexes
create index if not exists idx_readings_user_id on public.readings(user_id);
create index if not exists idx_readings_book_id on public.readings(book_id);

alter table public.readings enable row level security;

-- RLS policies for readings
create policy "Allow users to view their own readings"
  on public.readings for select
  using (auth.uid() = user_id);

create policy "Allow users to insert their own readings"
  on public.readings for insert
  with check (auth.uid() = user_id);

create policy "Allow users to update their own readings"
  on public.readings for update
  using (auth.uid() = user_id);

create policy "Allow users to delete their own readings"
  on public.readings for delete
  using (auth.uid() = user_id);
