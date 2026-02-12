
-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- 1. Custom Types (using DO blocks for idempotency)
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type user_role as enum ('student', 'faculty', 'candidate', 'employer', 'admin', 'superadmin');
  end if;
  if not exists (select 1 from pg_type where typname = 'job_status') then
    create type job_status as enum ('active', 'closed', 'draft');
  end if;
  if not exists (select 1 from pg_type where typname = 'application_status') then
    create type application_status as enum ('applied', 'reviewing', 'shortlisted', 'interviewing', 'accepted', 'rejected');
  end if;
end $$;

-- 1. Profiles Table (Extends Supabase Auth)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  role user_role default 'candidate',
  full_name text,
  avatar_url text,
  phone text,
  dob date,
  summary text,
  linkedin_url text,
  tagline text,
  industry text,
  company_size text,
  founded_year text,
  website_url text,
  location text,
  description text,
  company_culture text,
  benefits jsonb default '[]',
  social_media jsonb default '{}',
  education jsonb default '[]',
  experience jsonb default '[]',
  skills jsonb default '[]',
  projects jsonb default '[]',
  certifications jsonb default '[]',
  resumes jsonb default '[]',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Jobs Table
create table if not exists public.jobs (
  id uuid default gen_random_uuid() primary key,
  employer_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  location text,
  salary_range text,
  requirements jsonb default '[]',
  type text,
  experience_required text,
  education_required text,
  work_mode text,
  min_cgpa float8,
  visibility text default 'public',
  status job_status default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Applications Table
create table if not exists public.applications (
  id uuid default uuid_generate_v4() primary key,
  job_id uuid references public.jobs(id) on delete cascade not null,
  candidate_id uuid references public.profiles(id) on delete cascade not null,
  status application_status default 'applied',
  resume_url text,
  cover_letter text,
  current_ctc text,
  expected_ctc text,
  notice_period text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(job_id, candidate_id) -- Prevent duplicate applications
);

-- 4. Saved Jobs Table (for candidates to bookmark jobs)
create table if not exists public.saved_jobs (
  id uuid default uuid_generate_v4() primary key,
  job_id uuid references public.jobs(id) on delete cascade not null,
  candidate_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(job_id, candidate_id) -- Prevent duplicate saves
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.jobs enable row level security;
alter table public.applications enable row level security;
alter table public.saved_jobs enable row level security;

-- Policies for Profiles
drop policy if exists "Public profiles are viewable by everyone" on profiles;
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

drop policy if exists "Users can insert their own profile" on profiles;
create policy "Users can insert their own profile"
  on profiles for insert
  with check ( auth.uid() = id );

drop policy if exists "Users can update their own profile" on profiles;
create policy "Users can update their own profile"
  on profiles for update
  using ( auth.uid() = id );

-- Policies for Jobs
drop policy if exists "Active jobs are viewable by everyone" on jobs;
create policy "Active jobs are viewable by everyone"
  on jobs for select
  using ( status = 'active'::job_status );

drop policy if exists "Employers can insert jobs" on jobs;
create policy "Employers can insert jobs"
  on jobs for insert
  with check ( auth.uid() = employer_id );

drop policy if exists "Employers can update their own jobs" on jobs;
create policy "Employers can update their own jobs"
  on jobs for update
  using ( auth.uid() = employer_id );

drop policy if exists "Employers can delete their own jobs" on jobs;
create policy "Employers can delete their own jobs"
  on jobs for delete
  using ( auth.uid() = employer_id );

-- Policies for Applications
drop policy if exists "Candidates can view their own applications" on applications;
create policy "Candidates can view their own applications"
  on applications for select
  using ( auth.uid() = candidate_id );

drop policy if exists "Employers can view applications for their jobs" on applications;
create policy "Employers can view applications for their jobs"
  on applications for select
  using ( 
    exists (
      select 1 from jobs
      where jobs.id = applications.job_id
      and jobs.employer_id = auth.uid()
    )
  );

drop policy if exists "Candidates can insert applications" on applications;
create policy "Candidates can insert applications"
  on applications for insert
  with check ( auth.uid() = candidate_id );

drop policy if exists "Employers can update applications" on applications;
create policy "Employers can update applications"
  on applications for update
  using ( 
    exists (
      select 1 from jobs
      where jobs.id = applications.job_id
      and jobs.employer_id = auth.uid()
    )
  );

-- Policies for Saved Jobs
drop policy if exists "Candidates can view their saved jobs" on saved_jobs;
create policy "Candidates can view their saved jobs"
  on saved_jobs for select
  using ( auth.uid() = candidate_id );

drop policy if exists "Candidates can save jobs" on saved_jobs;
create policy "Candidates can save jobs"
  on saved_jobs for insert
  with check ( auth.uid() = candidate_id );

drop policy if exists "Candidates can unsave jobs" on saved_jobs;
create policy "Candidates can unsave jobs"
  on saved_jobs for delete
  using ( auth.uid() = candidate_id );

-- Database Trigger to automatically create profile on signup (BACKUP MECHANISM)
-- Note: AuthContext now creates profiles manually for better reliability
create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- Try to insert profile, ignore if it already exists
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      split_part(new.email, '@', 1)
    ),
    coalesce(
      (new.raw_user_meta_data->>'role')::user_role,
      'candidate'::user_role
    )
  )
  on conflict (id) do nothing;
  
  return new;
exception
  when others then
    -- Silently ignore all errors - profile creation handled by app
    return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- Storage Buckets Setup
-- Note: These may require superuser or storage admin permissions
insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', true), ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Set up RLS for Storage
-- Allow public read access
drop policy if exists "Public Access" on storage.objects;
create policy "Public Access"
on storage.objects for select
using ( bucket_id in ('resumes', 'avatars') );

-- Allow authenticated users to upload
drop policy if exists "Authenticated users can upload files" on storage.objects;
create policy "Authenticated users can upload files"
on storage.objects for insert
with check (
    bucket_id in ('resumes', 'avatars')
    and auth.role() = 'authenticated'
);

-- Allow users to update/delete their own files
drop policy if exists "Users can update their own files" on storage.objects;
create policy "Users can update their own files"
on storage.objects for update
using ( auth.uid() = owner and bucket_id in ('resumes', 'avatars') );

-- ... existing storage policies ...
drop policy if exists "Users can delete their own files" on storage.objects;
create policy "Users can delete their own files"
on storage.objects for delete
using ( auth.uid() = owner and bucket_id in ('resumes', 'avatars') );

-- 5. Role-Specific Profile Tables (One-to-One with public.profiles)

-- 5.1 Student Profiles
create table if not exists public.student_profiles (
  id uuid references public.profiles(id) on delete cascade not null primary key,
  institution_name text,
  educational_level text check (educational_level in ('High School', 'Undergraduate', 'Graduate', 'PhD')),
  major text,
  graduation_year int,
  gpa float,
  skills text[],
  preferred_job_roles text[],
  location_preferences text[],
  resume_url text,
  portfolio_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5.2 Faculty Profiles
create table if not exists public.faculty_profiles (
  id uuid references public.profiles(id) on delete cascade not null primary key,
  employee_id text,
  department text,
  position_title text,
  years_of_experience int,
  specialization_areas text[],
  publications jsonb default '[]', -- [{title, journal, year}]
  courses_taught text[],
  office_hours text,
  research_interests text[],
  personal_website text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5.3 Candidate/Job Seeker Profiles (Employee Aspiring Job)
create table if not exists public.candidate_profiles (
  id uuid references public.profiles(id) on delete cascade not null primary key,
  current_employment_status text check (current_employment_status in ('Employed', 'Unemployed', 'Freelancer', 'Student')),
  current_position text,
  years_of_experience int,
  target_job_titles text[],
  industry_preferences text[],
  skills text[],
  certifications jsonb default '[]', -- [{name, issuer, date}]
  education_background jsonb default '[]', -- override or sync with main profiles
  salary_expectations text,
  availability_start_date date,
  work_authorization_status text,
  willing_to_relocate boolean default false,
  remote_work_preference boolean default false,
  portfolio_link text,
  github_profile text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5.4 Employer Profiles
create table if not exists public.employer_profiles (
  id uuid references public.profiles(id) on delete cascade not null primary key,
  company_name text,
  contact_person_name text,
  contact_email text,
  contact_phone text,
  company_website text,
  industry_sector text,
  company_size text check (company_size in ('1-10', '11-50', '51-200', '201-500', '500+')),
  company_type text check (company_type in ('Startup', 'SME', 'Corporation', 'Non-Profit', 'Government')),
  founded_year int,
  headquarters_location text,
  branch_locations text[],
  company_description text,
  mission_statement text,
  benefits text[],
  social_media_links jsonb default '{}',
  logo_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS on new tables
alter table public.student_profiles enable row level security;
alter table public.faculty_profiles enable row level security;
alter table public.candidate_profiles enable row level security;
alter table public.employer_profiles enable row level security;

-- Policies for Role-Specific Tables
-- (Allow users to insert/update their own, view others based on role rules)

-- Student Policies
create policy "Students can view all student profiles" on student_profiles for select using (true); -- Or restricted?
create policy "Students can update their own profile" on student_profiles for all using (auth.uid() = id);

-- Faculty Policies
create policy "Public view faculty" on faculty_profiles for select using (true);
create policy "Faculty update own" on faculty_profiles for all using (auth.uid() = id);

-- Candidate Policies
create policy "Employers view candidates" on candidate_profiles for select 
using ( (select role from profiles where id = auth.uid()) = 'employer' or auth.uid() = id );
create policy "Candidate update own" on candidate_profiles for all using (auth.uid() = id);

-- Employer Policies
create policy "Public view employers" on employer_profiles for select using (true);
create policy "Employer update own" on employer_profiles for all using (auth.uid() = id);
