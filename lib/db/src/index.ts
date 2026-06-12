// @ts-nocheck
import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";
import pg from "pg";
import * as schema from "./schema";
import { getSupabasePoolConfig } from "./supabase";

const { Pool } = pg;

let poolInstance: pg.Pool | undefined;
let dbInstance: any;

function getPool(): pg.Pool {
  if (!poolInstance) {
    poolInstance = new Pool(getSupabasePoolConfig());
  }

  return poolInstance;
}

function getDb(): any {
  if (!dbInstance) {
    dbInstance = drizzle(getPool(), { schema });
  }

  return dbInstance;
}

export const pool: any = new Proxy({}, {
  get(_target, prop) {
    const value = getPool()[prop as keyof pg.Pool];
    return typeof value === "function" ? value.bind(getPool()) : value;
  },
});

export const db: any = new Proxy({}, {
  get(_target, prop) {
    const value = getDb()[prop as keyof typeof dbInstance];
    return typeof value === "function" ? value.bind(getDb()) : value;
  },
});

export { sql };
export * from "./schema";
export * from "./supabase";
