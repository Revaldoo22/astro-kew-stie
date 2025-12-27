import { RedisCache, parseDuration } from "cache-flex-lite";
import { CACHE_NAME } from "@globals/config";

// Redis cache configuration
const REDIS_URL = "redis://:a7kq8yvthfp4lgtmmdphpvfvcmsxnnpi@194.238.23.221:10023";

// Create Redis cache instance with error handling
let redisCache: RedisCache;
try {
  redisCache = new RedisCache(REDIS_URL);
  
  // Handle Redis connection errors
  if (redisCache && typeof (redisCache as any).client !== 'undefined') {
    const client = (redisCache as any).client;
    if (client) {
      client.on('error', (err: Error) => {
        console.error('[Redis] Connection error:', err.message);
        // Don't throw, just log the error to prevent unhandled errors
      });
      
      client.on('connect', () => {
        console.log('[Redis] Connected successfully');
      });
      
      client.on('ready', () => {
        console.log('[Redis] Ready to accept commands');
      });
    }
  }
} catch (error) {
  console.error('[Redis] Failed to initialize Redis cache:', error);
  // Create a fallback instance or handle gracefully
  redisCache = new RedisCache(REDIS_URL);
}

export { redisCache };


// Export parseDuration for convenience
export { parseDuration };

// Cache utility functions
export class CacheUtils {
  /**
   * Set data in cache with TTL
   * @param key Cache key
   * @param data Data to cache
   * @param ttl Time to live (e.g., "1h", "30m", "1d")
   */
  static async set(key: string, data: any, ttl: string) {
    try {
      return await redisCache.set(key, data, parseDuration(ttl));
    } catch (error: any) {
      console.error(`[Redis] Error setting key ${key}:`, error.message);
      return null;
    }
  }

  /**
   * Get data from cache
   * @param key Cache key
   */
  static async get(key: string) {
    try {
      return await redisCache.get(key);
    } catch (error: any) {
      console.error(`[Redis] Error getting key ${key}:`, error.message);
      return null;
    }
  }

  static async logStats() {
    try {
      const stats = await redisCache.getStats();

      console.log({
        totalKeys: stats.totalKeys,
        memoryUsage: stats.memoryUsage,
        connectedClients: stats.connectedClients,
        uptime: stats.uptime
      });
    } catch (error: any) {
      console.error('[Redis] Error getting stats:', error.message);
    }
  }

  /**
   * Delete data from cache
   * @param key Cache key
   */
  static async delete(key: string): Promise<number> {
    try {
      const exists = await redisCache.exists(key);
      
      if (!exists) {
        console.log(`⚠️ Redis key not found: ${key}`);
        return 0;
      }
      
      const result = await redisCache.del(key);
      console.log(result);
      if (result > 0) {
        console.log(`✅ Redis key deleted: ${key}`);
      } 
      return result; // tetap number
    } catch (error: any) {
      console.error(`[Redis] Error deleting key ${key}:`, error.message);
      return 0;
    }
  }


  static async deleteByPrefix(prefix: string): Promise<number> {
    try {
      const keys = await redisCache.listKeys(`${prefix}*`);
      if (keys.length > 0) {
        const result = await redisCache.mdel(keys); // hapus semua key
        console.log(`Deleted ${result} keys with prefix: ${prefix}`);
        return result;
      } else {
        console.log(`No keys found with prefix: ${prefix}`);
        return 0;
      }
    } catch (error: any) {
      console.error(`[Redis] Error deleting keys with prefix ${prefix}:`, error.message);
      return 0;
    }
  }


  /**
   * listKey data from cache
   * @param key Cache key
   */
  static async listKeys(prefix: string) {
    return await redisCache.listKeys(prefix);
  }

  /**
   * clearAll data from cache
   * @param key Cache key
   */
  static async clearAll() {
    console.log('succes clear all key redis');
    return await redisCache.clearAll();
  }


  /**
   * Check if key exists in cache
   * @param key Cache key
   */
  static async exists(key: string) {
    try {
      return await redisCache.exists(key);
    } catch (error: any) {
      console.error(`[Redis] Error checking existence of key ${key}:`, error.message);
      return false;
    }
  }

  /**
   * Increment a numeric value in cache
   * @param key Cache key
   * @param incrementBy Amount to increment by (default: 1)
   * @param ttl Time to live (e.g., "1h", "30m", "1d")
   */
  static async increment(key: string, incrementBy: number = 1, ttl?: string) {
    try {
      const currentValue = await redisCache.get(key);
      const newValue = (currentValue || 0) + incrementBy;
      
      if (ttl) {
        await redisCache.set(key, newValue, parseDuration(ttl));
      } else {
        await redisCache.set(key, newValue, parseDuration("1d"));
      }
      
      return newValue;
    } catch (error: any) {
      console.error(`[Redis] Error incrementing key ${key}:`, error.message);
      return 0;
    }
  }

  /**
   * Get numeric value from cache
   * @param key Cache key
   * @returns Numeric value or 0 if not found
   */
  static async getNumber(key: string): Promise<number> {
    try {
      const value = await redisCache.get(key);
      return typeof value === 'number' ? value : 0;
    } catch (error: any) {
      console.error(`[Redis] Error getting number for key ${key}:`, error.message);
      return 0;
    }
  }

  /**
   * Decrement a numeric value in cache
   * @param key Cache key
   * @param decrementBy Amount to decrement by (default: 1)
   * @param ttl Time to live (e.g., "1h", "30m", "1d")
   */
  static async decrement(key: string, decrementBy: number = 1, ttl?: string) {
    try {
      const currentValue = await redisCache.get(key);
      const newValue = Math.max(0, (currentValue || 0) - decrementBy);
      
      if (ttl) {
        await redisCache.set(key, newValue, parseDuration(ttl));
      } else {
        await redisCache.set(key, newValue, parseDuration("1d"));
      }
      
      return newValue;
    } catch (error: any) {
      console.error(`[Redis] Error decrementing key ${key}:`, error.message);
      return 0;
    }
  }

  /**
   * Count views for a specific post/article
   * @param slug Post/article slug
   * @param ttl Time to live (default: "30d")
   */
  static async countView(slug: string, ttl: string = "30d"): Promise<{ count: number; lastUpdate: number }> {
    const redisKey = `${CACHE_NAME}:view:count:${slug}`;
    const timestampKey = `${CACHE_NAME}:view:timestamp:${slug}`;
    
    // Increment count
    const count = await this.increment(redisKey, 1, ttl);
    
    // Update timestamp
    const currentTime = Date.now();
    await this.set(timestampKey, currentTime, ttl);
    
    return { count, lastUpdate: currentTime };
  }

  /**
   * Get view count for a specific post/article
   * @param slug Post/article slug
   */
  static async getViewCount(slug: string): Promise<number> {
    const redisKey = `${CACHE_NAME}:view:count:${slug}`;
    return await this.getNumber(redisKey);
  }

  /**
   * Get last update timestamp for view count
   * @param slug Post/article slug
   */
  static async getViewCountLastUpdate(slug: string): Promise<number> {
    const timestampKey = `${CACHE_NAME}:view:timestamp:${slug}`;
    const timestamp = await this.get(timestampKey);
    return typeof timestamp === 'number' ? timestamp : 0;
  }

  /**
   * Get view count data with timestamp
   * @param slug Post/article slug
   */
  static async getViewCountData(slug: string): Promise<{ count: number; lastUpdate: number }> {
    const count = await this.getViewCount(slug);
    const lastUpdate = await this.getViewCountLastUpdate(slug);
    return { count, lastUpdate };
  }

  /**
   * Count likes for a specific post/article
   * @param slug Post/article slug
   * @param ttl Time to live (default: "30d")
   */
  static async countLike(slug: string, ttl: string = "30d"): Promise<number> {
    const redisKey = `${CACHE_NAME}:like:count:${slug}`;
    return await this.increment(redisKey, 1, ttl);
  }

  /**
   * Get like count for a specific post/article
   * @param slug Post/article slug
   */
  static async getLikeCount(slug: string): Promise<number> {
    const redisKey = `${CACHE_NAME}:like:count:${slug}`;
    return await this.getNumber(redisKey);
  }

  /**
   * Count shares for a specific post/article
   * @param slug Post/article slug
   * @param ttl Time to live (default: "30d")
   */
  static async countShare(slug: string, ttl: string = "30d"): Promise<number> {
    const redisKey = `${CACHE_NAME}:share:count:${slug}`;
    return await this.increment(redisKey, 1, ttl);
  }

  /**
   * Get share count for a specific post/article
   * @param slug Post/article slug
   */
  static async getShareCount(slug: string): Promise<number> {
    const redisKey = `${CACHE_NAME}:share:count:${slug}`;
    return await this.getNumber(redisKey);
  }

  /**
   * Count comments for a specific post/article
   * @param slug Post/article slug
   * @param ttl Time to live (default: "30d")
   */
  static async countComment(slug: string, ttl: string = "30d"): Promise<number> {
    const redisKey = `${CACHE_NAME}:comment:count:${slug}`;
    return await this.increment(redisKey, 1, ttl);
  }

  /**
   * Get comment count for a specific post/article
   * @param slug Post/article slug
   */
  static async getCommentCount(slug: string): Promise<number> {
    const redisKey = `${CACHE_NAME}:comment:count:${slug}`;
    return await this.getNumber(redisKey);
  }

  /**
   * Count daily visitors
   * @param date Date string (YYYY-MM-DD format)
   * @param ttl Time to live (default: "1d")
   */
  static async countDailyVisitor(date: string, ttl: string = "1d"): Promise<number> {
    const redisKey = `${CACHE_NAME}:daily:visitor:${date}`;
    return await this.increment(redisKey, 1, ttl);
  }

  /**
   * Get daily visitor count
   * @param date Date string (YYYY-MM-DD format)
   */
  static async getDailyVisitorCount(date: string): Promise<number> {
    const redisKey = `${CACHE_NAME}:daily:visitor:${date}`;
    return await this.getNumber(redisKey);
  }

  /**
   * Count category views
   * @param category Category name
   * @param ttl Time to live (default: "7d")
   */
  static async countCategoryView(category: string, ttl: string = "7d"): Promise<number> {
    const redisKey = `${CACHE_NAME}:category:view:${category}`;
    return await this.increment(redisKey, 1, ttl);
  }

  /**
   * Get category view count
   * @param category Category name
   */
  static async getCategoryViewCount(category: string): Promise<number> {
    const redisKey = `${CACHE_NAME}:category:view:${category}`;
    return await this.getNumber(redisKey);
  }

  /**
   * Reset view count for a specific post/article
   * @param slug Post/article slug
   */
  static async resetViewCount(slug: string): Promise<void> {
    const redisKey = `${CACHE_NAME}:view:count:${slug}`;
    const timestampKey = `${CACHE_NAME}:view:timestamp:${slug}`;
    const postDetailKey = `${CACHE_NAME}:posts:detail:${slug}`;
    
    await this.delete(redisKey);
    await this.delete(timestampKey);    
    await this.delete(postDetailKey);
  }

  /**
   * Reset count for a specific key
   * @param key Cache key
   */
  static async resetCount(key: string): Promise<void> {
    await redisCache.set(key, 0, parseDuration("1d"));
  }

  /**
   * Get multiple counts at once
   * @param slugs Array of post/article slugs
   * @returns Object with counts for each slug
   */
  static async getMultipleCounts(slugs: string[]): Promise<Record<string, { views: number; likes: number; shares: number; comments: number }>> {
    const counts: Record<string, { views: number; likes: number; shares: number; comments: number }> = {};
    
    for (const slug of slugs) {
      counts[slug] = {
        views: await this.getViewCount(slug),
        likes: await this.getLikeCount(slug),
        shares: await this.getShareCount(slug),
        comments: await this.getCommentCount(slug)
      };
    }
    
    return counts;
  }

}
