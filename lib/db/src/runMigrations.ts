import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "./index";
import { getSupabaseDatabaseUrl } from "./supabase";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function runDatabaseMigrations() {
  const databaseUrl = getSupabaseDatabaseUrl();
  if (!databaseUrl) {
    throw new Error("SUPABASE_DB_URL or DATABASE_URL environment variable must be set for migrations");
  }

  // Relative to C:\Users\user\Desktop\AFRICAN VISION APP\African-Vision-Design-Main\lib\db\src
  const migrationsFolder = path.resolve(__dirname, "../drizzle-migrations");
  
  await migrate(db, { migrationsFolder });
}
