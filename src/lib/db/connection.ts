/**
 * MySQL connection for Amazon RDS
 * Uses SSL when DATABASE_SSL_CA is set (required for RDS)
 */
import mysql from "mysql2/promise";
import { readFileSync } from "fs";
import { existsSync } from "fs";
import { join } from "path";

function getConnectionConfig(): mysql.ConnectionOptions {
  const host = process.env.DATABASE_HOST;
  const user = process.env.DATABASE_USER;
  const password = process.env.DATABASE_PASSWORD;
  const database = process.env.DATABASE_NAME ?? "bpdc";
  const port = parseInt(process.env.DATABASE_PORT ?? "3306", 10);

  const config: mysql.ConnectionOptions = {
    host,
    port,
    user,
    password,
    database,
  };

  // RDS requires SSL; use global-bundle.pem when available
  const sslCaPath =
    process.env.DATABASE_SSL_CA || "/certs/global-bundle.pem" || join(process.cwd(), "certs", "global-bundle.pem");

  if (sslCaPath && existsSync(sslCaPath)) {
    config.ssl = {
      ca: readFileSync(sslCaPath),
      rejectUnauthorized: true,
    };
  } else if (process.env.DATABASE_SSL_CA) {
    // Explicit path given but file missing - warn but don't fail for local dev
    console.warn(`[db] DATABASE_SSL_CA file not found: ${sslCaPath}`);
  }

  return config;
}

let pool: mysql.Pool | null = null;

export function getPool(): mysql.Pool | null {
  if (!process.env.DATABASE_HOST || !process.env.DATABASE_USER || !process.env.DATABASE_PASSWORD) {
    return null;
  }
  if (!pool) {
    pool = mysql.createPool({
      ...getConnectionConfig(),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
}

export async function query<T = mysql.RowDataPacket[]>(
  sql: string,
  params?: unknown[]
): Promise<T> {
  const p = getPool();
  if (!p) throw new Error("Database not configured. Set DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD.");
  const [rows] = await p.execute(sql, params);
  return rows as T;
}
