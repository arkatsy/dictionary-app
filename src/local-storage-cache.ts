type StorageOpts = {
  key: string;
  limit: number;
};

export default class LocalStorageCache {
  key: string;
  limit: number;
  cache: Map<string, any>;

  constructor({ key, limit }: StorageOpts) {
    this.key = key;
    this.limit = limit;
    const stored = localStorage.getItem(key);

    this.cache = stored ? new Map(JSON.parse(stored)) : new Map();
  }

  push(word: string, data: any) {
    if (this.cache.has(word)) return;

    this.cache.set(word, data);
    if (this.cache.size > this.limit) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    localStorage.setItem(this.key, JSON.stringify(Array.from(this.cache.entries())));
  }

  get(word?: string) {
    return word ? this.cache.get(word) : null;
  }

  clear() {
    localStorage.removeItem(this.key);
  }
}
