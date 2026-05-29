-- Create a table for public profiles (optional if you want to store extra user data, but good practice)
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- Create a table for leads
create table public.leads (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  company text,
  email text,
  phone text,
  status text not null, -- check constraint or enum could be used here
  value numeric default 0,
  owner text, -- could be a reference to a profile if multi-user
  source text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  notes text,
  avatar text
);

alter table public.leads enable row level security;

create policy "Users can view their own leads." on public.leads
  for select using (auth.uid() = user_id);

create policy "Users can insert their own leads." on public.leads
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own leads." on public.leads
  for update using (auth.uid() = user_id);

create policy "Users can delete their own leads." on public.leads
  for delete using (auth.uid() = user_id);

-- Create a table for pipeline stages (optional if you want dynamic stages per user)
-- For v1, we might stick to hardcoded stages or simple per-user config. 
-- Let's enable a specific table for extensibility.
create table public.pipeline_stages (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  "order" integer not null default 0,
  pipeline_id text default 'default',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.pipeline_stages enable row level security;

create policy "Users can view their own stages." on public.pipeline_stages
  for select using (auth.uid() = user_id);

create policy "Users can insert their own stages." on public.pipeline_stages
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own stages." on public.pipeline_stages
  for update using (auth.uid() = user_id);

create policy "Users can delete their own stages." on public.pipeline_stages
  for delete using (auth.uid() = user_id);

-- Set up Realtime for leads (optional, but requested in "future" list, good to have)
alter publication supabase_realtime add table public.leads;

-- Function to handle new user signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- STORAGE BUCKET setup (Run this in SQL Editor)
-- Create a new bucket called 'avatars'
insert into storage.buckets (id, name, public) 
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Policy to allow public access to avatars
drop policy if exists "Avatar images are publicly accessible." on storage.objects;
create policy "Avatar images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'avatars' );

-- Policy to allow authenticated users to upload avatars
drop policy if exists "Anyone can upload an avatar." on storage.objects;
create policy "Anyone can upload an avatar."
  on storage.objects for insert
  with check ( bucket_id = 'avatars' and auth.role() = 'authenticated' );

-- Policy to allow users to update their own avatar
drop policy if exists "Users can update their own avatar." on storage.objects;
create policy "Users can update their own avatar."
  on storage.objects for update
  using ( bucket_id = 'avatars' and auth.uid() = owner );

-- Seed default pipeline stages (Run this once)
insert into public.pipeline_stages (user_id, name, "order")
select 
  auth.uid(), 
  s.name, 
  s.ord 
from 
  (values 
    ('New', 1), 
    ('Contacted', 2), 
    ('Qualified', 3), 
    ('Proposal', 4), 
    ('Won', 5), 
    ('Lost', 6)
  ) as s(name, ord)
where auth.uid() is not null; 

-- Create a table for tasks
create table if not exists public.tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  description text,
  status text not null check (status in ('To do', 'In progress', 'Waiting', 'Done')),
  priority text check (priority in ('Low', 'Medium', 'High')),
  due_date timestamp with time zone,
  owner_email text,
  related_lead_id uuid references public.leads(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone
);

alter table public.tasks enable row level security;

drop policy if exists "Users can view their own tasks." on public.tasks;
create policy "Users can view their own tasks." on public.tasks
  for select using (auth.uid() = user_id);

drop policy if exists "Users can insert their own tasks." on public.tasks;
create policy "Users can insert their own tasks." on public.tasks
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update their own tasks." on public.tasks;
create policy "Users can update their own tasks." on public.tasks
  for update using (auth.uid() = user_id);

drop policy if exists "Users can delete their own tasks." on public.tasks;
create policy "Users can delete their own tasks." on public.tasks
  for delete using (auth.uid() = user_id);
