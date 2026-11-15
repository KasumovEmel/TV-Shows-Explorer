import { createHash, randomBytes } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';

import type { Show } from '../generated/routes.schemas';


export const lifetime = 30 * 24 * 3600;

function hash(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

export class FavoritesStore {
  private db: DatabaseSync;

  constructor(
    path: string,
    private now = Date.now,
  ) {
    this.db = new DatabaseSync(path);
    this.db.exec(`PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL;
      CREATE TABLE IF NOT EXISTS sessions(token_hash TEXT PRIMARY KEY, created_at INTEGER NOT NULL, expires_at INTEGER NOT NULL);
      CREATE INDEX IF NOT EXISTS session_expiry ON sessions(expires_at);
      CREATE TABLE IF NOT EXISTS favorites(session_id TEXT NOT NULL REFERENCES sessions(token_hash) ON DELETE CASCADE,
        show_id TEXT NOT NULL, show_snapshot TEXT NOT NULL, added_at INTEGER NOT NULL, PRIMARY KEY(session_id,show_id));`);
    this.prune();
  }

  close() {
    this.db.close();
  }

  ready() {
    this.db.prepare('SELECT token_hash FROM sessions LIMIT 1').get();
  }

  prune() {
    this.db.prepare('DELETE FROM sessions WHERE expires_at <= ?').run(this.now());
  }

  session(cookie?: string): { id: string; token?: string } {
    const time = this.now();
    this.prune();
    if (cookie) {
      const id = hash(cookie);
      if (
        this.db.prepare('SELECT 1 FROM sessions WHERE token_hash=? AND expires_at>?').get(id, time)
      ) {
        return { id };
      }
    }
    const token = randomBytes(32).toString('base64url');
    const id = hash(token);
    this.db.prepare('INSERT INTO sessions VALUES (?,?,?)').run(id, time, time + lifetime * 1000);

    return { id, token };
  }

  list(id: string): Show[] {
    return this.db
      .prepare(
        'SELECT show_snapshot FROM favorites WHERE session_id=? ORDER BY added_at DESC, rowid DESC',
      )
      .all(id)
      .map((row) => JSON.parse(String(row.show_snapshot)) as Show);
  }

  async add(session: string, id: string, load: (id: string) => Promise<Show>) {
    if (
      this.db.prepare('SELECT 1 FROM favorites WHERE session_id=? AND show_id=?').get(session, id)
    ) {
      return;
    }
    const show = await load(id);
    this.db
      .prepare(
        'INSERT INTO favorites SELECT token_hash,?,?,? FROM sessions WHERE token_hash=? AND expires_at>? ON CONFLICT(session_id,show_id) DO NOTHING',
      )
      .run(id, JSON.stringify(show), this.now(), session, this.now());
  }

  remove(session: string, id: string) {
    this.db.prepare('DELETE FROM favorites WHERE session_id=? AND show_id=?').run(session, id);
  }
}
