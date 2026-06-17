import { existsSync, readFileSync } from "fs";
import path from "path";

function loadLocalEnv(): void {
  const envPath = path.resolve(process.cwd(), "..", ".env");
  if (!existsSync(envPath)) {
    return;
  }

  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }
    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex <= 0) {
      continue;
    }
    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadLocalEnv();

const {
  db,
  blogPostsTable,
  commentReactionsTable,
  communityMembersTable,
  communityPostsTable,
  contactSubmissionsTable,
  donationsTable,
  eventsTable,
  newsletterSubscribersTable,
  partnersTable,
  postCommentsTable,
  postReactionsTable,
  projectsTable,
  teamMembersTable,
  sql,
} = await import("@workspace/db");
const { BLOG_POST_SEEDS } = await import("@workspace/db/seed/blogPosts");
const { COMMUNITY_COMMENT_REACTION_SEEDS, COMMUNITY_COMMENT_SEEDS, COMMUNITY_REACTION_SEEDS } =
  await import("@workspace/db/seed/communityReactions");
const { COMMUNITY_MEMBER_SEEDS } = await import("@workspace/db/seed/communityMembers");
const { COMMUNITY_POST_SEEDS } = await import("@workspace/db/seed/communityPosts");
const { CONTACT_SUBMISSION_SEEDS } = await import("@workspace/db/seed/contactSubmissions");
const { DONATION_SEEDS } = await import("@workspace/db/seed/donations");
const { EVENT_SEEDS } = await import("@workspace/db/seed/events");
const { NEWSLETTER_SUBSCRIBER_SEEDS } = await import("@workspace/db/seed/newsletterSubscribers");
const { PARTNER_SEEDS } = await import("@workspace/db/seed/partners");
const { EXTRA_EVENT_SEEDS, EXTRA_PROJECT_SEEDS } = await import("@workspace/db/seed/projectVariants");
const { PROJECT_SEEDS } = await import("@workspace/db/seed/projects");
const { TEAM_ROSTER } = await import("@workspace/db/seed/teamRoster");

const TEAM_SEED_LOCK_KEY = 727274001;
const CONTENT_SEED_LOCK_KEY = 727274002;

async function ensureCompatibilitySchema(): Promise<void> {
  await db.transaction(async (tx: any) => {
    await tx.execute(
      sql`create table if not exists newsletter_subscribers (
        id serial primary key,
        email text not null unique,
        name text,
        subscribed_at timestamp not null default now(),
        active boolean not null default true
      )`,
    );
    await tx.execute(sql`alter table if exists newsletter_subscribers add column if not exists id serial`);
    await tx.execute(sql`alter table if exists newsletter_subscribers add column if not exists email text`);
    await tx.execute(sql`alter table if exists newsletter_subscribers add column if not exists name text`);
    await tx.execute(sql`alter table if exists newsletter_subscribers add column if not exists subscribed_at timestamp not null default now()`);
    await tx.execute(sql`alter table if exists newsletter_subscribers add column if not exists active boolean not null default true`);
    await tx.execute(
      sql`create table if not exists community_posts (
        id serial primary key,
        author_id text not null,
        author_name text not null,
        author_image_url text,
        content text not null,
        image_url text,
        created_at timestamp not null default now()
      )`,
    );
    await tx.execute(sql`alter table if exists community_posts add column if not exists id serial`);
    await tx.execute(sql`alter table if exists community_posts add column if not exists author_id text`);
    await tx.execute(sql`alter table if exists community_posts add column if not exists author_name text`);
    await tx.execute(sql`alter table if exists community_posts add column if not exists author_image_url text`);
    await tx.execute(sql`alter table if exists community_posts add column if not exists content text`);
    await tx.execute(sql`alter table if exists community_posts add column if not exists image_url text`);
    await tx.execute(sql`alter table if exists community_posts add column if not exists created_at timestamp not null default now()`);
    await tx.execute(
      sql`create table if not exists post_reactions (
        id serial primary key,
        post_id integer not null references community_posts(id) on delete cascade,
        user_id text not null,
        type text not null,
        created_at timestamp not null default now()
      )`,
    );
    await tx.execute(sql`alter table if exists post_reactions add column if not exists id serial`);
    await tx.execute(sql`alter table if exists post_reactions add column if not exists post_id integer`);
    await tx.execute(sql`alter table if exists post_reactions add column if not exists user_id text`);
    await tx.execute(sql`alter table if exists post_reactions add column if not exists type text`);
    await tx.execute(sql`alter table if exists post_reactions add column if not exists created_at timestamp not null default now()`);
    await tx.execute(
      sql`create table if not exists post_comments (
        id serial primary key,
        post_id integer not null references community_posts(id) on delete cascade,
        author_id text not null,
        author_name text not null,
        author_image_url text,
        content text not null,
        created_at timestamp not null default now()
      )`,
    );
    await tx.execute(sql`alter table if exists post_comments add column if not exists id serial`);
    await tx.execute(sql`alter table if exists post_comments add column if not exists post_id integer`);
    await tx.execute(sql`alter table if exists post_comments add column if not exists author_id text`);
    await tx.execute(sql`alter table if exists post_comments add column if not exists author_name text`);
    await tx.execute(sql`alter table if exists post_comments add column if not exists author_image_url text`);
    await tx.execute(sql`alter table if exists post_comments add column if not exists content text`);
    await tx.execute(sql`alter table if exists post_comments add column if not exists created_at timestamp not null default now()`);
    await tx.execute(
      sql`create table if not exists comment_reactions (
        id serial primary key,
        comment_id integer not null references post_comments(id) on delete cascade,
        user_id text not null,
        type text not null,
        created_at timestamp not null default now()
      )`,
    );
    await tx.execute(sql`alter table if exists comment_reactions add column if not exists id serial`);
    await tx.execute(sql`alter table if exists comment_reactions add column if not exists comment_id integer`);
    await tx.execute(sql`alter table if exists comment_reactions add column if not exists user_id text`);
    await tx.execute(sql`alter table if exists comment_reactions add column if not exists type text`);
    await tx.execute(sql`alter table if exists comment_reactions add column if not exists created_at timestamp not null default now()`);

    await tx.execute(
      sql`do $$ declare r record; begin for r in select policyname from pg_policies where tablename = 'community_posts' loop execute format('drop policy if exists %I on community_posts', r.policyname); end loop; end $$;`,
    );
    await tx.execute(
      sql`do $$ declare r record; begin for r in select policyname from pg_policies where tablename = 'post_reactions' loop execute format('drop policy if exists %I on post_reactions', r.policyname); end loop; end $$;`,
    );
    await tx.execute(
      sql`do $$ declare r record; begin for r in select policyname from pg_policies where tablename = 'post_comments' loop execute format('drop policy if exists %I on post_comments', r.policyname); end loop; end $$;`,
    );
    await tx.execute(
      sql`do $$ declare r record; begin for r in select policyname from pg_policies where tablename = 'comment_reactions' loop execute format('drop policy if exists %I on comment_reactions', r.policyname); end loop; end $$;`,
    );
    await tx.execute(
      sql`do $$ declare r record; begin for r in select c.conname, rel.relname from pg_constraint c join pg_class rel on rel.oid = c.conrelid where c.contype = 'f' and rel.relname in ('community_posts', 'post_reactions', 'post_comments', 'comment_reactions') loop execute format('alter table %I drop constraint if exists %I', r.relname, r.conname); end loop; end $$;`,
    );

    await tx.execute(
      sql`alter table if exists team_members add column if not exists "order" integer not null default 0`,
    );
    await tx.execute(
      sql`alter table if exists team_members add column if not exists created_at timestamp not null default now()`,
    );
    await tx.execute(
      sql`alter table if exists projects add column if not exists created_at timestamp not null default now()`,
    );
    await tx.execute(
      sql`alter table if exists donations add column if not exists created_at timestamp not null default now()`,
    );
    await tx.execute(
      sql`alter table if exists donations add column if not exists stripe_session_id text`,
    );
    await tx.execute(
      sql`create unique index if not exists donations_stripe_session_id_key on donations (stripe_session_id)`,
    );
    await tx.execute(
      sql`alter table if exists partners add column if not exists created_at timestamp not null default now()`,
    );
    await tx.execute(
      sql`alter table if exists events add column if not exists created_at timestamp not null default now()`,
    );
    await tx.execute(
      sql`alter table if exists community_members add column if not exists joined_at timestamp not null default now()`,
    );
    await tx.execute(
      sql`alter table if exists community_posts add column if not exists created_at timestamp not null default now()`,
    );
    await tx.execute(
      sql`alter table if exists community_posts alter column author_id type text using author_id::text`,
    );
    await tx.execute(
      sql`alter table if exists post_reactions add column if not exists created_at timestamp not null default now()`,
    );
    await tx.execute(
      sql`alter table if exists post_reactions alter column user_id type text using user_id::text`,
    );
    await tx.execute(
      sql`alter table if exists post_comments add column if not exists created_at timestamp not null default now()`,
    );
    await tx.execute(
      sql`alter table if exists post_comments alter column author_id type text using author_id::text`,
    );
    await tx.execute(
      sql`alter table if exists comment_reactions add column if not exists created_at timestamp not null default now()`,
    );
    await tx.execute(
      sql`alter table if exists comment_reactions alter column user_id type text using user_id::text`,
    );
    await tx.execute(
      sql`alter table if exists blog_posts add column if not exists published_at timestamp not null default now()`,
    );
    await tx.execute(
      sql`alter table if exists contact_submissions add column if not exists created_at timestamp not null default now()`,
    );
    await tx.execute(
      sql`alter table if exists newsletter_subscribers add column if not exists subscribed_at timestamp not null default now()`,
    );
    await tx.execute(
      sql`alter table if exists newsletter_subscribers add column if not exists active boolean not null default true`,
    );
  });
}

async function seedTeamRoster(): Promise<void> {
  await db.transaction(async (tx: any) => {
    await tx.execute(sql`SELECT pg_advisory_xact_lock(${TEAM_SEED_LOCK_KEY})`);
    await tx.delete(teamMembersTable);
    await tx.insert(teamMembersTable).values(TEAM_ROSTER);
  });
}

async function seedContentTables(): Promise<void> {
  await db.transaction(async (tx: any) => {
    await tx.execute(sql`SELECT pg_advisory_xact_lock(${CONTENT_SEED_LOCK_KEY})`);
    await tx.delete(contactSubmissionsTable);
    await tx.delete(communityPostsTable);
    await tx.delete(postReactionsTable);
    await tx.delete(postCommentsTable);
    await tx.delete(commentReactionsTable);
    await tx.delete(communityMembersTable);
    await tx.delete(newsletterSubscribersTable);
    await tx.delete(donationsTable);
    await tx.delete(blogPostsTable);
    await tx.delete(eventsTable);
    await tx.delete(partnersTable);
    await tx.delete(projectsTable);

    const projects = await tx.insert(projectsTable).values([...PROJECT_SEEDS, ...EXTRA_PROJECT_SEEDS]).returning();
    const projectIdByTitle = new Map(projects.map((project: any) => [project.title, project.id]));

    await tx.insert(partnersTable).values(PARTNER_SEEDS);
    await tx.insert(eventsTable).values([...EVENT_SEEDS, ...EXTRA_EVENT_SEEDS]);
    await tx.insert(blogPostsTable).values(BLOG_POST_SEEDS);
    await tx.insert(communityMembersTable).values(COMMUNITY_MEMBER_SEEDS);
    await tx.insert(newsletterSubscribersTable).values(NEWSLETTER_SUBSCRIBER_SEEDS);

    const communityPosts = await tx.insert(communityPostsTable).values(COMMUNITY_POST_SEEDS).returning();
    const postIdByIndex = new Map(communityPosts.map((post: any, index: number) => [index, post.id]));

    await tx.insert(postCommentsTable).values(
      COMMUNITY_COMMENT_SEEDS.map((comment) => ({
        postId: postIdByIndex.get(comment.postIndex) ?? communityPosts[0]?.id ?? null,
        authorId: comment.authorId,
        authorName: comment.authorName,
        authorImageUrl: comment.authorImageUrl,
        content: comment.content,
      })),
    );

    const insertedComments = await tx
      .select({ id: postCommentsTable.id })
      .from(postCommentsTable)
      .orderBy(postCommentsTable.id);
    const commentIdByIndex = new Map(
      insertedComments.slice(0, COMMUNITY_COMMENT_SEEDS.length).map((comment: any, index: number) => [index, comment.id]),
    );

    await tx.insert(postReactionsTable).values(
      COMMUNITY_REACTION_SEEDS.map((reaction) => ({
        postId: postIdByIndex.get(reaction.postIndex) ?? communityPosts[0]?.id ?? null,
        userId: reaction.userId,
        type: reaction.type,
      })),
    );

    await tx.insert(commentReactionsTable).values(
      COMMUNITY_COMMENT_REACTION_SEEDS.map((reaction) => ({
        commentId: commentIdByIndex.get(reaction.commentIndex) ?? insertedComments[0]?.id ?? null,
        userId: reaction.userId,
        type: reaction.type,
      })),
    );

    await tx.insert(donationsTable).values(
      DONATION_SEEDS.map(({ projectTitle, data }) => ({
        ...data,
        projectId: projectTitle ? projectIdByTitle.get(projectTitle) ?? null : null,
      })),
    );
    await tx.insert(contactSubmissionsTable).values(CONTACT_SUBMISSION_SEEDS);
  });
}

async function main(): Promise<void> {
  // await ensureCompatibilitySchema();
  await seedTeamRoster();
  await seedContentTables();
  console.log(
    `Supabase seed completed: ${TEAM_ROSTER.length} team members, ${PROJECT_SEEDS.length + EXTRA_PROJECT_SEEDS.length} projects, ${PARTNER_SEEDS.length} partners, ${EVENT_SEEDS.length + EXTRA_EVENT_SEEDS.length} events, ${BLOG_POST_SEEDS.length} blog posts, ${COMMUNITY_MEMBER_SEEDS.length} community members, ${COMMUNITY_POST_SEEDS.length} community posts, ${COMMUNITY_COMMENT_SEEDS.length} community comments, ${COMMUNITY_REACTION_SEEDS.length} post reactions, ${COMMUNITY_COMMENT_REACTION_SEEDS.length} comment reactions, ${NEWSLETTER_SUBSCRIBER_SEEDS.length} newsletter subscribers, ${DONATION_SEEDS.length} donations, ${CONTACT_SUBMISSION_SEEDS.length} contact submissions`,
  );
}

main().catch((error) => {
  console.error("Supabase seed failed:", error);
  process.exitCode = 1;
});
