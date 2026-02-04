/**
 * PostgreSQL connection for Neon
 * Set DATABASE_URL to enable (e.g. postgresql://user:pass@host/careers?sslmode=require)
 */
import { Pool } from "pg";

let pool: Pool | null = null;

export function getPool(): Pool | null {
  const url = process.env.DATABASE_URL;
  if (!url || !url.includes("postgresql")) {
    return null;
  }
  if (!pool) {
    pool = new Pool({
      connectionString: url,
      ssl: { rejectUnauthorized: true },
    });
  }
  return pool;
}

export async function query<T = unknown[]>(sql: string, params?: unknown[]): Promise<T> {
  const p = getPool();
  if (!p) throw new Error("Database not configured. Set DATABASE_URL (PostgreSQL connection string).");
  const result = await p.query(sql, params ?? []);
  return result.rows as T;
}
