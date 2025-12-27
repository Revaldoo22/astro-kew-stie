import { PostApi } from '@/services/index';
import { hasValue } from '@/utils/helpers/dataHelpers';
import { getPaginationParams, buildPaginationQuery } from '@/utils/helpers/paginationHelpers';
import { PaginatedPostListType, PostListType, CategoryType } from '@/types/index';

export interface NewsPageData {
    postList: PaginatedPostListType;
    popularPost: PostListType[];
    trendingPost: PostListType[];
    isEmptyPostList: boolean;
    isEmptyPopularPost: boolean;
    isEmptyTrendingPost: boolean;
}

export interface NewsQueryParams {
    page?: string;
    limit?: number;
    group?: string;
    en?: number;
}

/**
 * News Page Service - Business logic layer for news page data management
 * Handles data fetching, pagination, and state management for news pages
 */
export class PostPageService {
    private postApiService: PostApi;

    constructor() {
        this.postApiService = new PostApi();
    }

    /**
     * Fetch complete news page data including posts and popular content
     * @param url - Astro URL object containing search parameters
     * @param limit - Number of posts per page (default: 30)
     * @returns Promise<NewsPageData>
     */
    async fetchPostPageData(url: URL, limit: number = 25, group: string = 'news', en: number = 0, orderBy: string = 'post_date'): Promise<NewsPageData> {
        // Get pagination parameters using library
        const paginationParams = getPaginationParams(url, limit);
        
        // Build query for post list
        const query = this.buildPostQuery(paginationParams, group, en, orderBy);

        // Fetch post list data
        const postListData = await this.postApiService.fetchListPosts(query);

        let isEmptyPostList = true;
        let postList: PaginatedPostListType = {
            posts: [],
            total: 0,
            totalPages: 0,
            currentPage: paginationParams.currentPage
        };

        if (hasValue(postListData) && postListData.posts.length > 0) {
            isEmptyPostList = false;
            // Ensure currentPage from API matches URL
            postList = {
                ...postListData,
                currentPage: paginationParams.currentPage // Override with currentPage from URL
            };
        }

        // Fetch popular post data
        const popularPostdata = await this.postApiService.fetchPopularPosts(`?limit=6&skip=0&group=${group}&en=${en}`);
        let isEmptyPopularPost = true;
        let popularPost: PostListType[] = [];

        if (hasValue(popularPostdata)) {
            isEmptyPopularPost = false;
            popularPost = popularPostdata;
        }

        // Fetch trending post data
        const trendingPostdata = await this.postApiService.fetchTrendingPosts(`?limit=3&skip=0&group=${group}&en=${en}`);
        let isEmptyTrendingPost = true;
        let trendingPost: PostListType[] = [];
        
        if (hasValue(trendingPostdata)) {
            isEmptyTrendingPost = false;
            trendingPost = trendingPostdata;
        }

        return {
            postList,
            popularPost,
            trendingPost,
            isEmptyPostList,
            isEmptyPopularPost,
            isEmptyTrendingPost
        };
    }


    /**
     * Build query object for post API
     * @param paginationParams - Pagination parameters
     * @param group - Post group (default: 'news')
     * @param en - Language flag (default: 0)
     * @returns Query object for API
     */
    private buildPostQuery(
        paginationParams: { currentPage: number; skip: number; limit: number },
        group: string = 'news',
        en: number = 0,
        orderBy: string = 'post_date'
    ) {
        return {
            "endpoint": `?limit=${paginationParams.limit}&skip=${paginationParams.skip}&group=${group}&en=${en}&order_by=${orderBy}`,
            "currentPage": paginationParams.currentPage,
        } as any;
    }
}

// Export singleton instance for convenience
export const postPageService = new PostPageService();
