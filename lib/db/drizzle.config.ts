import { defineConfig } from "drizzle-kit";
import path from "path";
import { getSupabaseDatabaseUrl } from "../supabase";

const databaseUrl = getSupabaseDatabaseUrl();

if (!databaseUrl) {
  throw new Error(
    "SUPABASE_DB_URL or DATABASE_URL must be set, ensure the database is provisioned",
  );
}

export default defineConfig({
  schema: "./src/schema/index.ts",
  out: "./drizzle-migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
