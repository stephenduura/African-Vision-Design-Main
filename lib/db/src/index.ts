// @ts-nocheck
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";
import { getSupabasePoolConfig } from "./supabase";

const { Pool } = pg;

let pool;
let dbInstance;

function getPool() {
  if (!pool) {
    pool = new Pool(getSupabasePoolConfig());
  }
  return pool;
}

function getDb() {
  if (!dbInstance) {
    dbInstance = drizzle(getPool(), { schema });
  }
  return dbInstance;
}

export const pool = new Proxy(
  {},
  {
    get(_target, prop) {
      return getPool()[prop];
    },
  },
);

export const db = new Proxy(
  {},
  {
    get(_target, prop) {
      const value = getDb()[prop];
      return typeof value === "function" ? value.bind(getDb()) : value;
    },
  },
);

export { sql } from "drizzle-orm";
export * from "./schema";
export * from "./supabase";
