import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";
import pg from "pg";
import * as schema from "./schema";
import { getSupabasePoolConfig } from "./supabase";

const { Pool } = pg;

type Database = NodePgDatabase<typeof schema>;

let poolInstance: pg.Pool | undefined;
let dbInstance: Database | undefined;

function getPool(): pg.Pool {
  if (!poolInstance) {
    poolInstance = new Pool(getSupabasePoolConfig());
  }

  return poolInstance;
}

function getDb(): Database {
  if (!dbInstance) {
    dbInstance = drizzle(getPool(), { schema });
  }

  return dbInstance;
}

export const pool = new Proxy({} as pg.Pool, {
  get(_target, prop) {
    const value = getPool()[prop as keyof pg.Pool];
    return typeof value === "function" ? value.bind(getPool()) : value;
  },
}) as pg.Pool;

export const db = new Proxy({} as Database, {
  get(_target, prop) {
    const value = getDb()[prop as keyof Database];
    return typeof value === "function" ? value.bind(getDb()) : value;
  },
}) as Database;

export { sql };
export * from "./schema";
export * from "./supabase";
