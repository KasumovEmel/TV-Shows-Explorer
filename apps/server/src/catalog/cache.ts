const ttl = 300_000;
export class CatalogCache<T> {
  private entries = new Map<string, { value: T; expires: number }>();
  private pending = new Map<string, Promise<T>>();

  constructor(private now: () => number) {}

  prune() {
    const time = this.now();
    for (const [key, entry] of this.entries) {
      if (entry.expires <= time) {
        this.entries.delete(key);
      }
    }
  }

  store(key: string, value: T) {
    this.entries.set(key, { value, expires: this.now() + ttl });
  }

  get(key: string, load: () => Promise<T>): Promise<T> {
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
        this.store(key, value);

        return value;
      })
      .finally(() => this.pending.delete(key));
    this.pending.set(key, request);

    return request;
  }
}
