import { randomBytes } from 'node:crypto';

import { hashSessionToken } from './logic/helpers/hashSessionToken';
import { sessionLifetimeSeconds } from './session';
import type { Clock } from '../types';
import type {
  FavoriteKey,
  FavoriteSession,
  FavoriteSnapshot,
  FavoriteStorage,
  FavoritesStoreOptions,
} from './types';


export class FavoritesStore {
  private sessions: FavoriteStorage;
  private now: Clock;

  constructor({ storage = {}, now = Date.now }: FavoritesStoreOptions = {}) {
    this.sessions = storage;
    this.now = now;
  }

  ready() {
    return Object.isExtensible(this.sessions);
  }

  prune() {
    const time = this.now();
    for (const [id, session] of Object.entries(this.sessions)) {
      if (session.expires <= time) {
        delete this.sessions[id];
      }
    }
  }

  private activeSession(id: string) {
    const session = this.sessions[id];
    if (session && session.expires > this.now()) {
      return session;
    }
  }

  session(cookie?: string): FavoriteSession {
    if (cookie) {
      const id = hashSessionToken(cookie);
      if (this.activeSession(id)) {
        return { id };
      }
    }
    const token = randomBytes(32).toString('base64url');
    const id = hashSessionToken(token);
    this.sessions[id] = { expires: this.now() + sessionLifetimeSeconds * 1000, shows: [] };

    return { id, token };
  }

  list(id: string) {
    return structuredClone(this.activeSession(id)?.shows ?? []);
  }

  count(cookie?: string) {
    return cookie ? (this.activeSession(hashSessionToken(cookie))?.shows.length ?? 0) : 0;
  }

  has({ session, id }: FavoriteKey) {
    return this.activeSession(session)?.shows.some((show) => show.id === id) ?? false;
  }

  insert({ session, show }: FavoriteSnapshot) {
    const entry = this.activeSession(session);
    if (entry && !entry.shows.some((item) => item.id === show.id)) {
      entry.shows.unshift(structuredClone(show));
    }
  }

  remove({ session, id }: FavoriteKey) {
    const entry = this.activeSession(session);
    if (entry) {
      entry.shows = entry.shows.filter((show) => show.id !== id);
    }
  }
}
