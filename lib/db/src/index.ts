// @ts-nocheck
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";
import { getSupabasePoolConfig } from "./supabase";

const { Pool } = pg;

export const pool = new Pool(getSupabasePoolConfig());
export const db = drizzle(pool, { schema });

export { sql } from "drizzle-orm";
export * from "./schema";
export * from "./supabase";
