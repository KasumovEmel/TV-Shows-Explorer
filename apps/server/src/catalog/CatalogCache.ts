import type { Clock } from '../types';
import type { CacheEntries, CacheLookup, CacheWrite, CatalogCacheOptions } from './types';


const ttl = 300_000;
export class CatalogCache<T> {
  private entries: CacheEntries<T>;
  private now: Clock;
  private pending = new Map<string, Promise<T>>();

  constructor({ entries, now }: CatalogCacheOptions<T>) {
    this.entries = entries;
    this.now = now;
  }

  prune() {
    const time = this.now();
    for (const [key, entry] of Object.entries(this.entries)) {
      if (entry.expires <= time) {
        delete this.entries[key];
      }
    }
  }

  store({ key, value }: CacheWrite<T>) {
    this.entries[key] = { value, expires: this.now() + ttl };
  }

  get({ key, load }: CacheLookup<T>): Promise<T> {
    const cached = this.entries[key];
    if (cached && this.now() < cached.expires) {
      return Promise.resolve(cached.value);
    }
    const pending = this.pending.get(key);
    if (pending) {
      return pending;
    }
    delete this.entries[key];
    const request = load()
      .then((value) => {
        this.store({ key, value });

        return value;
      })
      .finally(() => this.pending.delete(key));
    this.pending.set(key, request);

    return request;
  }
}
