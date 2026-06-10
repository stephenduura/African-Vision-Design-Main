-- Supabase/PostgreSQL schema for the Papi Foundation backend.
-- Mirrors the existing Drizzle schema so API behavior stays unchanged.

create type if not exists team_category as enum ('leadership', 'volunteer', 'ambassador');
create type if not exists partner_type as enum ('company', 'ngo', 'government', 'sponsor');
create type if not exists event_type as enum ('event', 'update', 'press', 'video');
create type if not exists blog_category as enum ('story', 'report', 'press', 'impact');
create type if not exists member_type as enum ('individual', 'organization', 'volunteer');
create type if not exists donation_type as enum ('one-time', 'monthly');
create type if not exists project_status as enum ('ongoing', 'completed', 'upcoming');
create type if not exists reaction_type as enum ('like', 'love', 'celebrate', 'support', 'insightful');

create table if not exists projects (
  id serial primary key,
  title text not null,
  description text not null,
  status project_status not null default 'upcoming',
  country text not null,
  category text not null,
  goal_amount real not null,
  raised_amount real not null default 0,
  image_url text not null,
  before_image_url text,
  after_image_url text,
  beneficiaries integer,
  location text,
  lat real,
  lng real,
  created_at timestamp not null default now()
);

create table if not exists donations (
  id serial primary key,
  amount real not null,
  currency text not null default 'EUR',
  donor_name text not null,
  is_anonymous boolean not null default false,
  project_id integer,
  message text,
  type donation_type not null default 'one-time',
  stripe_session_id text unique,
  created_at timestamp not null default now()
);

create table if not exists team_members (
  id serial primary key,
  name text not null,
  role text not null,
  bio text not null,
  image_url text not null,
  linkedin_url text,
  category team_category not null default 'volunteer',
  "order" integer not null default 0,
  created_at timestamp not null default now()
);

create table if not exists partners (
  id serial primary key,
  name text not null,
  type partner_type not null,
  logo_url text not null,
  website_url text not null,
  country text,
  description text,
  created_at timestamp not null default now()
);

create table if not exists events (
  id serial primary key,
  title text not null,
  description text not null,
  content text,
  type event_type not null default 'event',
  image_url text not null,
  date text not null,
  location text not null,
  video_url text,
  created_at timestamp not null default now()
);

create table if not exists community_members (
  id serial primary key,
  name text not null,
  email text not null unique,
  country text not null,
  member_type member_type not null default 'individual',
  bio text,
  avatar_url text,
  joined_at timestamp not null default now()
);

create table if not exists community_posts (
  id serial primary key,
  author_id text not null,
  author_name text not null,
  author_image_url text,
  content text not null,
  image_url text,
  created_at timestamp not null default now()
);

create table if not exists post_reactions (
  id serial primary key,
  post_id integer not null references community_posts(id) on delete cascade,
  user_id text not null,
  type reaction_type not null,
  created_at timestamp not null default now(),
  constraint uniq_user_post_reaction unique (post_id, user_id)
);

create table if not exists post_comments (
  id serial primary key,
  post_id integer not null references community_posts(id) on delete cascade,
  author_id text not null,
  author_name text not null,
  author_image_url text,
  content text not null,
  created_at timestamp not null default now()
);

create table if not exists comment_reactions (
  id serial primary key,
  comment_id integer not null references post_comments(id) on delete cascade,
  user_id text not null,
  type reaction_type not null,
  created_at timestamp not null default now(),
  constraint uniq_user_comment_reaction unique (comment_id, user_id)
);

create table if not exists blog_posts (
  id serial primary key,
  title text not null,
  excerpt text not null,
  content text not null,
  author text not null,
  category blog_category not null default 'story',
  image_url text not null,
  published_at timestamp not null default now()
);

create table if not exists contact_submissions (
  id serial primary key,
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  phone text,
  created_at timestamp not null default now()
);

create table if not exists newsletter_subscribers (
  id serial primary key,
  email text not null unique,
  name text,
  subscribed_at timestamp not null default now(),
  active boolean not null default true
);

create index if not exists idx_projects_status on projects(status);
create index if not exists idx_projects_country on projects(country);
create index if not exists idx_donations_created_at on donations(created_at desc);
create index if not exists idx_team_members_category on team_members(category);
create index if not exists idx_events_created_at on events(created_at desc);
create index if not exists idx_blog_posts_published_at on blog_posts(published_at desc);
create index if not exists idx_community_posts_created_at on community_posts(created_at desc);
create index if not exists idx_post_comments_created_at on post_comments(created_at desc);
