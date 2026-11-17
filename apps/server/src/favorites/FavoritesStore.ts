import { randomBytes } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';

import { hashSessionToken } from './logic/hashSessionToken';
import { sessionLifetimeSeconds } from './session';
import type { Show } from '../generated/routes.schemas';
import type { Clock } from '../types';
import type {
  FavoriteKey,
  FavoriteSession,
  FavoriteSnapshot,
  FavoritesStoreOptions,
} from './types';


export class FavoritesStore {
  private db: DatabaseSync;
  private now: Clock;

  constructor({ path, now = Date.now }: FavoritesStoreOptions) {
    this.now = now;

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

  session(cookie?: string): FavoriteSession {
    const time = this.now();
    this.prune();
    if (cookie) {
      const id = hashSessionToken(cookie);
      if (
        this.db.prepare('SELECT 1 FROM sessions WHERE token_hash=? AND expires_at>?').get(id, time)
      ) {
        return { id };
      }
    }
    const token = randomBytes(32).toString('base64url');
    const id = hashSessionToken(token);
    this.db
      .prepare('INSERT INTO sessions VALUES (?,?,?)')
      .run(id, time, time + sessionLifetimeSeconds * 1000);

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

  count(cookie?: string) {
    if (!cookie) {
      return 0;
    }
    const row = this.db
      .prepare(`SELECT COUNT(*) AS count FROM favorites JOIN sessions ON token_hash=session_id
        WHERE session_id=? AND expires_at>?`)
      .get(hashSessionToken(cookie), this.now())!;

    return Number(row.count);
  }

  has({ session, id }: FavoriteKey) {
    return Boolean(
      this.db.prepare('SELECT 1 FROM favorites WHERE session_id=? AND show_id=?').get(session, id),
    );
  }

  insert({ session, show }: FavoriteSnapshot) {
    this.db
      .prepare(
        'INSERT INTO favorites SELECT token_hash,?,?,? FROM sessions WHERE token_hash=? AND expires_at>? ON CONFLICT(session_id,show_id) DO NOTHING',
      )
      .run(show.id, JSON.stringify(show), this.now(), session, this.now());
  }

  remove({ session, id }: FavoriteKey) {
    this.db.prepare('DELETE FROM favorites WHERE session_id=? AND show_id=?').run(session, id);
  }
}
