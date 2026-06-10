-- Align the live Supabase schema with the local Drizzle schema used by the app.
-- This is safe to run if the column already exists.

do $$ declare r record; begin for r in select policyname from pg_policies where tablename = 'community_posts' loop execute format('drop policy if exists %I on community_posts', r.policyname); end loop; end $$;
do $$ declare r record; begin for r in select policyname from pg_policies where tablename = 'post_reactions' loop execute format('drop policy if exists %I on post_reactions', r.policyname); end loop; end $$;
do $$ declare r record; begin for r in select policyname from pg_policies where tablename = 'post_comments' loop execute format('drop policy if exists %I on post_comments', r.policyname); end loop; end $$;
do $$ declare r record; begin for r in select policyname from pg_policies where tablename = 'comment_reactions' loop execute format('drop policy if exists %I on comment_reactions', r.policyname); end loop; end $$;
do $$ declare r record; begin for r in select c.conname, rel.relname from pg_constraint c join pg_class rel on rel.oid = c.conrelid where c.contype = 'f' and rel.relname in ('community_posts', 'post_reactions', 'post_comments', 'comment_reactions') loop execute format('alter table %I drop constraint if exists %I', r.relname, r.conname); end loop; end $$;

alter table if exists team_members
  add column if not exists "order" integer not null default 0;

alter table if exists team_members
  add column if not exists created_at timestamp not null default now();

alter table if exists projects
  add column if not exists created_at timestamp not null default now();

alter table if exists donations
  add column if not exists created_at timestamp not null default now();

alter table if exists donations
  add column if not exists stripe_session_id text;

create unique index if not exists donations_stripe_session_id_key on donations (stripe_session_id);

alter table if exists partners
  add column if not exists created_at timestamp not null default now();

alter table if exists events
  add column if not exists created_at timestamp not null default now();

alter table if exists community_members
  add column if not exists joined_at timestamp not null default now();

alter table if exists community_posts
  add column if not exists created_at timestamp not null default now();

alter table if exists community_posts
  alter column author_id type text using author_id::text;

alter table if exists post_reactions
  add column if not exists created_at timestamp not null default now();

alter table if exists post_reactions
  alter column user_id type text using user_id::text;

alter table if exists post_comments
  add column if not exists created_at timestamp not null default now();

alter table if exists post_comments
  alter column author_id type text using author_id::text;

alter table if exists comment_reactions
  add column if not exists created_at timestamp not null default now();

alter table if exists comment_reactions
  alter column user_id type text using user_id::text;

alter table if exists blog_posts
  add column if not exists published_at timestamp not null default now();

alter table if exists contact_submissions
  add column if not exists created_at timestamp not null default now();

alter table if exists newsletter_subscribers
  add column if not exists subscribed_at timestamp not null default now();

alter table if exists newsletter_subscribers
  add column if not exists active boolean not null default true;
