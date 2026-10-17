import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { DATABASE_URL } from '$app/env/private';
import * as schema from './schema.ts';

const client = new Database(DATABASE_URL);
client.pragma('journal_mode = WAL');
client.pragma('foreign_keys = ON');

export const db = drizzle(client, { schema });
