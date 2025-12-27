import { FetchData } from "@/services/fetchData";
import { CacheUtils } from "@/utils/cacheUtils";
import { CACHE_NAME, CACHE_ENABLE, WEBSITE_UUID } from "@globals/config";
import { hasValue, cleanQuery } from "@/utils/helpers/dataHelpers";
import { mapData } from "@/utils/mapper";
import { categorySchema, categoryListSchema, postListSchema } from "@/schemas/index";
import type { CategoryType, CategoryListType, PostListType } from "@/types/index";

export class PostCategoryService extends FetchData {
    protected getBaseApiUrl(): string {
        return `/api/v1/posts/${WEBSITE_UUID}`;
    }

    /**
     * Fetch list of categories
     * @returns Promise<CategoryType[]> - Array of category objects
     */
    async fetchListCategories(): Promise<CategoryType[]> {
        const cacheKey = `${CACHE_NAME}:posts:list-categories`;

        if (CACHE_ENABLE) {
            const cachedData = await CacheUtils.get(cacheKey);
            if (cachedData) return cachedData;
        }

        const data = await this.fetchData(`${this.getBaseApiUrl()}/list-category`);
        // console.log(data);

        if (hasValue(data)) {
            const mappedData = mapData<CategoryType>(data, categorySchema);
            const result = Array.isArray(mappedData) ? mappedData : [mappedData];

            if (CACHE_ENABLE) {
                await CacheUtils.set(cacheKey, result, "1w");
            }
            return result;
        }

        return [];
    }

    /**
     * Fetch posts for a specific category
     * @param query - Query object with endpoint or string endpoint
     * @returns Promise<CategoryListType[]> - Array of category post objects
     */
    async fetchCategoryPosts(query: any): Promise<PostListType[]> {
        const cacheKey = `${CACHE_NAME}:posts:${cleanQuery(query)}`;

        if (CACHE_ENABLE) {
            const cachedData = await CacheUtils.get(cacheKey);
            if (cachedData) return cachedData;
        }

        const endpoint = typeof query === 'string' ? query : query?.endpoint || '';
        const data = await this.fetchData(`${this.getBaseApiUrl()}/category${endpoint}`);

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
     * Fetch list of category posts
     * @param query - Query object with endpoint or string endpoint
     * @returns Promise<PostListType[]> - Array of category post objects
     */
    async fetchListCategoryPosts(query: any): Promise<PostListType[]> {
        const cacheKey = `${CACHE_NAME}:posts:list-category-posts:${cleanQuery(query)}`;

        if (CACHE_ENABLE) {
            const cachedData = await CacheUtils.get(cacheKey);
            if (cachedData) return cachedData;
        }

        const endpoint = typeof query === 'string' ? query : query?.endpoint || '';
        const data = await this.fetchData(`${this.getBaseApiUrl()}/list-category-posts${endpoint}`);

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
}