/**
 * Cache item data structure.
 * @description Defines the structure for items stored in the cache.
 */
interface CacheItem<T = any> {
  /** Unique key for the cache item */
  key: string
  /** Cached value data */
  value: T
  /** Timestamp when the item expires */
  expiresAt: number
  /** Timestamp when the item was created */
  createdAt: number
}

/**
 * Cache configuration options.
 * @description Defines the configuration parameters for cache behavior.
 */
interface CacheOptions {
  /** Time to live in milliseconds */
  ttl?: number
  /** Maximum number of items in cache */
  maxSize?: number
}

/**
 * Cache management system for data storage.
 * @description Handles caching with expiration and size limits.
 */
class CacheManager {
  /** Internal cache storage */
  private cache: Map<string, CacheItem> = new Map()
  /** Cache configuration options */
  private options: CacheOptions

  /**
   * Creates a new cache manager instance.
   * @description Initializes the cache with the provided options.
   * @param options - Cache configuration options
   */
  constructor(options: CacheOptions = {}) {
    this.options = {
      ttl: 5 * 60 * 1000,
      maxSize: 1000,
      ...options
    }
  }

  /**
   * Stores a value in the cache.
   * @description Adds or updates a cache item with optional custom TTL.
   * @param key - Unique key for the cache item
   * @param value - Value to store in cache
   * @param ttl - Optional custom time to live in milliseconds
   */
  set<T>(key: string, value: T, ttl?: number): void {
    const now = Date.now()
    const expiresAt = now + (ttl || this.options.ttl!)
    if (this.cache.size >= this.options.maxSize!) {
      const oldestKey = this.cache.keys().next().value
      if (oldestKey) {
        this.cache.delete(oldestKey)
      }
    }
    this.cache.set(key, {
      key,
      value,
      expiresAt,
      createdAt: now
    })
  }

  /**
   * Retrieves a value from the cache.
   * @description Gets a cached value if it exists and has not expired.
   * @param key - Key of the cache item to retrieve
   * @returns Cached value or null if not found or expired
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    if (!item) {
      return null
    }
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key)
      return null
    }
    return item.value as T
  }

  /**
   * Removes an item from the cache.
   * @description Deletes the specified cache item.
   * @param key - Key of the cache item to remove
   * @returns True if item was removed, false if not found
   */
  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  /**
   * Clears all items from the cache.
   * @description Removes all cached items.
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Gets the current number of items in cache.
   * @description Returns the total count of cached items.
   * @returns Number of items in cache
   */
  size(): number {
    return this.cache.size
  }

  /**
   * Checks if a key exists in cache and is not expired.
   * @description Determines if the specified key has a valid cached value.
   * @param key - Key to check in cache
   * @returns True if key exists and is not expired, false otherwise
   */
  has(key: string): boolean {
    const item = this.cache.get(key)
    return item ? Date.now() <= item.expiresAt : false
  }
}

/**
 * Exports the CacheManager, CacheItem, and CacheOptions types.
 * @description Exports the CacheManager, CacheItem, and CacheOptions types.
 */
export { CacheManager, type CacheItem, type CacheOptions }
