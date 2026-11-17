import type { Clock } from '../types';
import type { CacheEntry, CacheLookup, CacheWrite } from './types';


const ttl = 300_000;
export class CatalogCache<T> {
  private entries = new Map<string, CacheEntry<T>>();
  private pending = new Map<string, Promise<T>>();

  constructor(private now: Clock) {}

  prune() {
    const time = this.now();
    for (const [key, entry] of this.entries) {
      if (entry.expires <= time) {
        this.entries.delete(key);
      }
    }
  }

  store({ key, value }: CacheWrite<T>) {
    this.entries.set(key, { value, expires: this.now() + ttl });
  }

  get({ key, load }: CacheLookup<T>): Promise<T> {
    const cached = this.entries.get(key);
    if (cached && this.now() < cached.expires) {
      return Promise.resolve(cached.value);
    }
    const pending = this.pending.get(key);
    if (pending) {
      return pending;
    }
    this.entries.delete(key);
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
