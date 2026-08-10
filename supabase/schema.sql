-- CVio: resumes table
-- Safe to run multiple times in the Supabase Dashboard -> SQL Editor for
-- this project (tables/indexes use IF NOT EXISTS, policies/triggers are
-- dropped and recreated).
--
-- Stores each resume as JSON that mirrors the client-side ResumeData /
-- SectionMeta[] shape (see app/(app)/editor/types.ts). A single JSONB
-- column per resume is deliberately simpler than one table per section —
-- this app has no cross-resume reporting needs (private, non-commercial),
-- so normalizing experiences/educations/etc. into their own tables would
-- add schema surface without a real benefit yet.

create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null default 'Neuer Lebenslauf',
  template_name text not null default 'Berlin',
  section_meta jsonb not null default '[]'::jsonb,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists resumes_user_id_idx on public.resumes (user_id);

alter table public.resumes enable row level security;

drop policy if exists "Users can view their own resumes" on public.resumes;
create policy "Users can view their own resumes"
  on public.resumes for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own resumes" on public.resumes;
create policy "Users can insert their own resumes"
  on public.resumes for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own resumes" on public.resumes;
create policy "Users can update their own resumes"
  on public.resumes for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own resumes" on public.resumes;
create policy "Users can delete their own resumes"
  on public.resumes for delete
  using (auth.uid() = user_id);

-- Keep updated_at current on every change, used for "zuletzt bearbeitet".
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists resumes_set_updated_at on public.resumes;

create trigger resumes_set_updated_at
  before update on public.resumes
  for each row
  execute function public.set_updated_at();

-- CVio: resume photo storage
-- Bucket is public-read (the photo ends up on a PDF the user shares
-- externally anyway, and Puppeteer needs to fetch it without auth headers
-- when rendering the PDF). Writes are restricted to the owning user via the
-- first path segment, e.g. "<user_id>/<resume_id>-<timestamp>.jpg".

insert into storage.buckets (id, name, public)
values ('resume-photos', 'resume-photos', true)
on conflict (id) do nothing;

drop policy if exists "Anyone can view resume photos" on storage.objects;
create policy "Anyone can view resume photos"
  on storage.objects for select
  using (bucket_id = 'resume-photos');

drop policy if exists "Users can upload their own resume photos" on storage.objects;
create policy "Users can upload their own resume photos"
  on storage.objects for insert
  with check (
    bucket_id = 'resume-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can update their own resume photos" on storage.objects;
create policy "Users can update their own resume photos"
  on storage.objects for update
  using (
    bucket_id = 'resume-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can delete their own resume photos" on storage.objects;
create policy "Users can delete their own resume photos"
  on storage.objects for delete
  using (
    bucket_id = 'resume-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
