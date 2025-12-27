import { FetchData } from "@/services/fetchData";
import { CacheUtils } from "@/utils/cacheUtils";
import { CACHE_NAME, CACHE_ENABLE, WEBSITE_UUID } from "@globals/config";
import { hasValue, cleanQuery } from "@/utils/helpers/dataHelpers";
import { mapData } from "@/utils/mapper";
import { postListSchema, postDetailSchema, authorPostsSchema } from "@/schemas/index";
import type { PostListType, PostDetailType, PaginatedPostListType, AuthorPostsType } from "@/types/index";

export class PostService extends FetchData {

    protected getBaseApiUrl(): string {
        return `/api/v1/posts/${WEBSITE_UUID}`;
    }


    /**
     * Fetch detail of a specific post
     * @param slug - Post slug identifier
     * @returns Promise<PostDetailType | null> - Post detail object or null if not found
     */

    async fetchDetailPosts(slug: string): Promise<PostDetailType | null> {

        // const cacheKey = `${CACHE_NAME}:posts:detail:${slug}`;

        // if (CACHE_ENABLE) {

        //     const cachedData = await CacheUtils.get(cacheKey);

        //     // Always increment view count for every fetch
        //     const viewData = await CacheUtils.countView(slug, "30d");

        //     if(cachedData) {
        //     //   Check if we should send view count to API (every 10 minutes)
        //       const shouldSendToAPI = await this.shouldSendViewCountToAPI(slug);
              
        //       if(shouldSendToAPI) {
        //         await this.sendViewCountToAPI(cachedData.uuid, viewData.count, slug);
        //       }
        
        //       return cachedData;
        //     }

        // }

        const data = await this.fetchData(`${this.getBaseApiUrl()}/${slug}`);

        if (hasValue(data)) {
            const mappedData = mapData<PostDetailType>(data, postDetailSchema);
            const result = Array.isArray(mappedData) ? mappedData[0] : mappedData;

            // if (CACHE_ENABLE) {
            //     await CacheUtils.set(cacheKey, result, "1w");
            // }
            return result;
        }

        return null;

    }

    /**
     * Check if we should send view count to API (every 10 minutes)
     * @param slug - Slug of the post
     * @returns boolean indicating whether to send to API
     */
    async shouldSendViewCountToAPI(slug: string): Promise<boolean> {
      const lastApiUpdateKey = `${CACHE_NAME}:view:api:last:${slug}`;
      if (CACHE_ENABLE) {
        const lastApiUpdate = await CacheUtils.get(lastApiUpdateKey);
        
        const currentTime = Date.now();
        // const viewMinutesInMs = 10 * 60 * 1000; // 10 minutes in milliseconds
        const viewMinutesInMs = 2 * 60 * 1000; // 2 minutes in milliseconds
        
        // If no previous API update or more than 10 minutes have passed
        if (!lastApiUpdate || (currentTime - lastApiUpdate) > viewMinutesInMs) {
          // Update the last API update timestamp
          await CacheUtils.set(lastApiUpdateKey, currentTime, "30d");
          return true;
        }
        
        return false;
      }
      
      // If cache is disabled, always send to API
      return true;
    }

    /**
     * Fetch list of posts
     * @param query - Query object with endpoint, group, en, and currentPage
     * @returns Promise<PaginatedPostListType> - Paginated post list object
     */
    async fetchListPosts(query: any): Promise<PaginatedPostListType> {
        const pagePart = query.currentPage ? `:page:${query.currentPage}` : "";
        // const cacheKey = `${CACHE_NAME}:posts:list${pagePart}:${cleanQuery(query)}`;

        // if (CACHE_ENABLE) {
        //     const cachedData = await CacheUtils.get(cacheKey);
        //     if (cachedData) return cachedData;
        // }

        const endpoint = typeof query === 'string' ? query : query?.endpoint || '';
        const data = await this.fetchData(`${this.getBaseApiUrl()}/list-posts${endpoint}`);
        
        if (hasValue(data)) {
            const mappedPosts = data.posts.map((post: any) => mapData<PostListType>(post, postListSchema));
            const result = {
                posts: mappedPosts,
                total: data.totalPosts || 0,
                totalPages: data.totalPages || 0,
                currentPage: data.currentPage || 1
            };

            // if (CACHE_ENABLE) {
            //     await CacheUtils.set(cacheKey, result, "1w");
            // }
            return result;
        }

        return {
            posts: [],
            total: 0,
            totalPages: 0,
            currentPage: 1
        };
    }

    /**
     * Fetch latest posts
     * @param query - Query object with endpoint, group, en, and currentPage
     * @returns Promise<PostListType[]> - Array of latest post objects
     */
    async fetchLatestPosts(query: any): Promise<PostListType[]> {
        // const cacheKey = `${CACHE_NAME}:posts:latest:${cleanQuery(query)}`;

        // if (CACHE_ENABLE) {
        //     const cachedData = await CacheUtils.get(cacheKey);
        //     if (cachedData) return cachedData;
        // }

        const endpoint = typeof query === 'string' ? query : query?.endpoint || '';
        const data = await this.fetchData(`${this.getBaseApiUrl()}/latest${endpoint}`);

        if (hasValue(data)) {
            const mappedData = mapData<PostListType>(data, postListSchema);
            const result = Array.isArray(mappedData) ? mappedData : [mappedData];

            // if (CACHE_ENABLE) {
            //     await CacheUtils.set(cacheKey, result, "1w");
            // }
            return result;
        }

        return [];
    }

    /**
     * Fetch recent posts
     * @param query - Query object with endpoint, group, en, and currentPage
     * @returns Promise<PostListType[]> - Array of recent post objects
     */
    async fetchRecentPosts(query: any): Promise<PostListType[]> {
        // const cacheKey = `${CACHE_NAME}:posts:recent:${cleanQuery(query)}`;

        // if (CACHE_ENABLE) {
        //     const cachedData = await CacheUtils.get(cacheKey);
        //     if (cachedData) return cachedData;
        // }

        const endpoint = typeof query === 'string' ? query : query?.endpoint || '';
        const data = await this.fetchData(`${this.getBaseApiUrl()}/recent${endpoint}`);

        if (hasValue(data)) {
            const mappedData = mapData<PostListType>(data, postListSchema);
            const result = Array.isArray(mappedData) ? mappedData : [mappedData];

            // if (CACHE_ENABLE) {
            //     await CacheUtils.set(cacheKey, result, "1w");
            // }
            return result;
        }

        return [];
    }

    /**
     * Fetch popular posts
     * @param query - Query object with endpoint, group, en, and currentPage
     * @returns Promise<PostListType[]> - Array of popular post objects
     */
    async fetchPopularPosts(query: any): Promise<PostListType[]> {
        const cacheKey = `${CACHE_NAME}:posts:popular:${cleanQuery(query)}`;

        if (CACHE_ENABLE) {
            const cachedData = await CacheUtils.get(cacheKey);
            if (cachedData) return cachedData;
        }

        const endpoint = typeof query === 'string' ? query : query?.endpoint || '';
        const data = await this.fetchData(`${this.getBaseApiUrl()}/populer${endpoint}`);

        if (hasValue(data)) {
            const mappedData = mapData<PostListType>(data, postListSchema);
            const result = Array.isArray(mappedData) ? mappedData : [mappedData];

            if (CACHE_ENABLE) {
                await CacheUtils.set(cacheKey, result, "1w");
            }
            return result;
        }

        return [];
    }

    /**
     * Fetch trending posts
     * @param query - Query object with endpoint, group, en, and currentPage
     * @returns Promise<PostListType[]> - Array of trending post objects
     */
    async fetchTrendingPosts(query: any): Promise<PostListType[]> {
        const cacheKey = `${CACHE_NAME}:posts:trending:${cleanQuery(query)}`;

        if (CACHE_ENABLE) {
            const cachedData = await CacheUtils.get(cacheKey);
            if (cachedData) return cachedData;
        }

        const endpoint = typeof query === 'string' ? query : query?.endpoint || '';
        const data = await this.fetchData(`${this.getBaseApiUrl()}/trending${endpoint}`);

        if (hasValue(data)) {
            const mappedData = mapData<PostListType>(data, postListSchema);
            const result = Array.isArray(mappedData) ? mappedData : [mappedData];

            if (CACHE_ENABLE) {
                await CacheUtils.set(cacheKey, result, "1w");
            }
            return result;
        }

        return [];
    }

    /**
     * Fetch author posts
     * @param query - Query object with endpoint, group, en
     * @returns Author posts
     */
    async fetchAuthorPosts(query: any) {
        const cacheKey = `${CACHE_NAME}:posts:author:${cleanQuery(query)}`;

        if (CACHE_ENABLE) {
            const cachedData = await CacheUtils.get(cacheKey);
            if (cachedData) return cachedData;
        }

        const endpoint = typeof query === 'string' ? query : query?.endpoint || '';
        const data = await this.fetchData(`${this.getBaseApiUrl()}/author/${endpoint}`);

        if (hasValue(data)) {
            const mappedData = mapData<AuthorPostsType>(data, authorPostsSchema);
            const result = Array.isArray(mappedData) ? mappedData[0] : mappedData;

            if (CACHE_ENABLE) {
                await CacheUtils.set(cacheKey, result, "1w");
            }
            return result;
        }

        return null;
    }
}