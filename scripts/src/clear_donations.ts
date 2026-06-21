import { existsSync, readFileSync } from "fs";
import path from "path";
import { db, donationsTable } from "@workspace/db";

// Programmatic environment loader
function loadLocalEnv() {
  const rootEnv = path.resolve(process.cwd(), "..", ".env");
  const localEnv = path.resolve(process.cwd(), ".env");
  const envPath = existsSync(rootEnv) ? rootEnv : existsSync(localEnv) ? localEnv : null;
  
  if (!envPath) {
    console.warn("Could not locate .env file programmatically.");
    return;
  }

  console.log(`Loading environment from: ${envPath}`);
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

async function run() {
  try {
    console.log("Deleting all records from donations table...");
    const deleted = await db.delete(donationsTable).returning();
    console.log(`Successfully deleted ${deleted.length} seed donation records! Live donation tracking is now reset to 0.`);
  } catch (error) {
    console.error("Failed to delete donations:", error);
  } finally {
    process.exit(0);
  }
}

run();
