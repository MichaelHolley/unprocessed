import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is not set');

const client = new Database(url);
client.pragma('journal_mode = WAL');
client.pragma('foreign_keys = ON');

migrate(drizzle(client), { migrationsFolder: 'drizzle' });
client.close();
