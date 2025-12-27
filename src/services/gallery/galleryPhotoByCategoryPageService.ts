import { GalleryApi } from '@/services/index';
import { hasValue } from '@/utils/helpers/dataHelpers';
import { getPaginationParams, buildPaginationQuery } from '@/utils/helpers/paginationHelpers';
import { PaginatedGalleryPhotoByCategoryListType, GalleryPhotoByCategoryType } from '@/types/index';

export interface GalleryPhotoByCategoryPageData {
    galleryPhotoByCategoryList: PaginatedGalleryPhotoByCategoryListType;
    isEmptyGalleryPhotoByCategoryList: boolean;
}

export interface GalleryPhotoByCategoryQueryParams {
    page?: string;
    limit?: number;
    group?: string;
    en?: number;
}

/**
 * Gallery Photo By Category Page Service - Business logic layer for gallery photo by category page data management
 * Handles data fetching, pagination, and state management for gallery photo by category pages
 */
export class GalleryPhotoByCategoryPageService {
    private galleryApiService: GalleryApi;

    constructor() {
        this.galleryApiService = new GalleryApi();
    }

    /**
     * Fetch complete event page data with pagination
     * @param url - Astro URL object containing search parameters
     * @param limit - Number of events per page (default: 12)
     * @param group - Event group filter (default: '')
     * @param en - Language flag (default: 0)
     * @param year - Year filter (default: '')
     * @returns Promise<EventPageData>
     */
    async fetchGalleryPhotoByCategoryPageData(
        url: URL, 
        slug: string,
        limit: number = 12, 
        en: number = 0,
    ): Promise<GalleryPhotoByCategoryPageData> {
        // Get pagination parameters using library
        const paginationParams = getPaginationParams(url, limit);
        
        // Build query for event list
        const query = this.buildGalleryPhotoByCategoryQuery(paginationParams, en);

        // Fetch event list data
        const galleryPhotoByCategoryListData = await this.galleryApiService.fetchListGalleryPhotoByCategory(slug, query);

        let isEmptyGalleryPhotoByCategoryList = true;
        let galleryPhotoByCategoryList: PaginatedGalleryPhotoByCategoryListType = {
            gallery: [],
            total: 0,
            totalPages: 0,
            currentPage: paginationParams.currentPage
        };

        if (hasValue(galleryPhotoByCategoryListData) && galleryPhotoByCategoryListData.gallery.length > 0) {
            isEmptyGalleryPhotoByCategoryList = false;
            // Ensure currentPage from API matches URL
            galleryPhotoByCategoryList = {
                ...galleryPhotoByCategoryListData,
                currentPage: paginationParams.currentPage // Override with currentPage from URL
            };
        }

        return {
            galleryPhotoByCategoryList,
            isEmptyGalleryPhotoByCategoryList
        };
    }

    /**
     * Build query object for event API
     * @param paginationParams - Pagination parameters
     * @param group - Event group (optional)
     * @param en - Language flag (default: 0)
     * @returns Query object for API
     */
    private buildGalleryPhotoByCategoryQuery(
        paginationParams: { currentPage: number; skip: number; limit: number },
        en: number = 0
    ) {
        const additionalParams: Record<string, any> = { en };
        
        return {
            endpoint: buildPaginationQuery(paginationParams, additionalParams),
            currentPage: paginationParams.currentPage,
        };
    }

}

// Export singleton instance for convenience
export const galleryPhotoByCategoryPageService = new GalleryPhotoByCategoryPageService();

