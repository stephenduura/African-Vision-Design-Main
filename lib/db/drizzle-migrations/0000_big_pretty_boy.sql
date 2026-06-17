CREATE TYPE "public"."project_status" AS ENUM('ongoing', 'completed', 'upcoming');--> statement-breakpoint
CREATE TYPE "public"."donation_type" AS ENUM('one-time', 'monthly');--> statement-breakpoint
CREATE TYPE "public"."team_category" AS ENUM('leadership', 'volunteer', 'ambassador');--> statement-breakpoint
CREATE TYPE "public"."partner_type" AS ENUM('company', 'ngo', 'government', 'sponsor');--> statement-breakpoint
CREATE TYPE "public"."event_type" AS ENUM('event', 'update', 'press', 'video');--> statement-breakpoint
CREATE TYPE "public"."member_type" AS ENUM('individual', 'organization', 'volunteer');--> statement-breakpoint
CREATE TYPE "public"."reaction_type" AS ENUM('like', 'love', 'celebrate', 'support', 'insightful');--> statement-breakpoint
CREATE TYPE "public"."blog_category" AS ENUM('story', 'report', 'press', 'impact');--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"status" "project_status" DEFAULT 'upcoming' NOT NULL,
	"country" text NOT NULL,
	"category" text NOT NULL,
	"goal_amount" real NOT NULL,
	"raised_amount" real DEFAULT 0 NOT NULL,
	"image_url" text NOT NULL,
	"before_image_url" text,
	"after_image_url" text,
	"beneficiaries" integer,
	"location" text,
	"lat" real,
	"lng" real,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "donations" (
	"id" serial PRIMARY KEY NOT NULL,
	"amount" real NOT NULL,
	"currency" text DEFAULT 'EUR' NOT NULL,
	"donor_name" text NOT NULL,
	"is_anonymous" boolean DEFAULT false NOT NULL,
	"project_id" integer,
	"message" text,
	"type" "donation_type" DEFAULT 'one-time' NOT NULL,
	"stripe_session_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "donations_stripe_session_id_unique" UNIQUE("stripe_session_id")
);
--> statement-breakpoint
CREATE TABLE "team_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"role" text NOT NULL,
	"bio" text NOT NULL,
	"image_url" text NOT NULL,
	"linkedin_url" text,
	"category" "team_category" DEFAULT 'volunteer' NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "partners" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" "partner_type" NOT NULL,
	"logo_url" text NOT NULL,
	"website_url" text NOT NULL,
	"country" text,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"content" text,
	"type" "event_type" DEFAULT 'event' NOT NULL,
	"image_url" text NOT NULL,
	"date" text NOT NULL,
	"location" text NOT NULL,
	"video_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "community_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"country" text NOT NULL,
	"member_type" "member_type" DEFAULT 'individual' NOT NULL,
	"bio" text,
	"avatar_url" text,
	"joined_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "community_members_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "comment_reactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"comment_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"type" "reaction_type" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "uniq_user_comment_reaction" UNIQUE("comment_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "community_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"author_id" text NOT NULL,
	"author_name" text NOT NULL,
	"author_image_url" text,
	"content" text NOT NULL,
	"image_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "post_comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer NOT NULL,
	"author_id" text NOT NULL,
	"author_name" text NOT NULL,
	"author_image_url" text,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "post_reactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"type" "reaction_type" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "uniq_user_post_reaction" UNIQUE("post_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"excerpt" text NOT NULL,
	"content" text NOT NULL,
	"author" text NOT NULL,
	"category" "blog_category" DEFAULT 'story' NOT NULL,
	"image_url" text NOT NULL,
	"published_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact_submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"phone" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "newsletter_subscribers" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"subscribed_at" timestamp DEFAULT now() NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "newsletter_subscribers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "comment_reactions" ADD CONSTRAINT "comment_reactions_comment_id_post_comments_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."post_comments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_comments" ADD CONSTRAINT "post_comments_post_id_community_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."community_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_reactions" ADD CONSTRAINT "post_reactions_post_id_community_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."community_posts"("id") ON DELETE cascade ON UPDATE no action;