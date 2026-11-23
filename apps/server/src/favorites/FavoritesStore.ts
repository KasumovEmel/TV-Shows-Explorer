import { randomBytes } from 'node:crypto';

import { ApiFailure } from '../errors';
import { hashSessionToken } from './logic/helpers/hashSessionToken';
import { sessionLifetimeSeconds } from './session';
import type { Clock } from '../types';
import type {
  FavoriteKey,
  FavoriteSnapshot,
  FavoriteStorage,
  FavoritesStoreOptions,
  SessionStorage,
} from './types';


export class FavoritesStore {
  private sessions: SessionStorage;
  private shows: FavoriteStorage;
  private now: Clock;

  constructor({ storage = {}, sessions = {}, now = Date.now }: FavoritesStoreOptions = {}) {
    this.shows = storage;
    this.sessions = sessions;
    this.now = now;
  }

  ready() {
    return Object.isExtensible(this.sessions) && Object.isExtensible(this.shows);
  }

  prune() {
    const time = this.now();
    for (const [id, session] of Object.entries(this.sessions)) {
      if (session.expires <= time) {
        delete this.sessions[id];
      }
    }
  }

  login(email: string) {
    const token = randomBytes(32).toString('base64url');
    this.sessions[hashSessionToken(token)] = {
      email,
      expires: this.now() + sessionLifetimeSeconds * 1000,
    };

    return token;
  }

  logout(token: string) {
    delete this.sessions[hashSessionToken(token)];
  }

  email(token: string) {
    const session = this.sessions[hashSessionToken(token)];

    return session && session.expires > this.now() ? session.email : null;
  }

  requireEmail(token: string) {
    const email = this.email(token);
    if (!email) {
      throw new ApiFailure({ status: 401, code: 'unauthorized', message: 'Login required' });
    }

    return email;
  }

  list(session: string) {
    return structuredClone(this.shows[this.requireEmail(session)] ?? []);
  }

  count(session: string) {
    return this.shows[this.requireEmail(session)]?.length ?? 0;
  }

  has({ session, id }: FavoriteKey) {
    return this.shows[this.requireEmail(session)]?.some((show) => show.id === id) ?? false;
  }

  insert({ session, show }: FavoriteSnapshot) {
    const email = this.requireEmail(session);
    const items = (this.shows[email] ??= []);
    if (!items.some((item) => item.id === show.id)) {
      items.unshift(structuredClone(show));
    }
  }

  remove({ session, id }: FavoriteKey) {
    const email = this.requireEmail(session);
    if (this.shows[email]) {
      this.shows[email] = this.shows[email].filter((show) => show.id !== id);
    }
  }
}
