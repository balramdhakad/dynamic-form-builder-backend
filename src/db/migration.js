import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "./connection.js";
import { logger } from "../config/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrationsDir = path.join(__dirname, "migrations");

export const runMigrations = async () => {
  const client = await pool.connect();

  try {
    
    await client.query("BEGIN");

    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        run_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    const files = fs.readdirSync(migrationsDir).sort();

    for (const file of files) {
      const result = await client.query(
        "SELECT 1 FROM migrations WHERE name = $1",
        [file]
      );

      if (result.rowCount > 0) continue;

      const sql = fs.readFileSync(
        path.join(migrationsDir, file),
        "utf8"
      );

      await client.query(sql);
      await client.query(
        "INSERT INTO migrations (name) VALUES ($1)",
        [file]
      );
    }

    await client.query("COMMIT");
    logger.info("Migrations completed");
  } catch (err) {
    await client.query("ROLLBACK");
    logger.error("Migration failed:", err);
    process.exit(1);
  } finally {
    client.release();
  }
};