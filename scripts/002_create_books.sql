-- Create books table
create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  author text not null,
  genre text,
  pages integer,
  isbn text,
  cover_image_url text,
  synopsis text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create index for faster lookups
create index if not exists idx_books_user_id on public.books(user_id);

alter table public.books enable row level security;

-- RLS policies for books
create policy "Allow users to view their own books"
  on public.books for select
  using (auth.uid() = user_id);

create policy "Allow users to insert their own books"
  on public.books for insert
  with check (auth.uid() = user_id);

create policy "Allow users to update their own books"
  on public.books for update
  using (auth.uid() = user_id);

create policy "Allow users to delete their own books"
  on public.books for delete
  using (auth.uid() = user_id);
