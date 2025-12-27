import { FetchData } from "@/services/fetchData";
import { CacheUtils } from "@/utils/cacheUtils";
import { CACHE_NAME, CACHE_ENABLE, WEBSITE_UUID } from "@globals/config";
import { hasValue, cleanQuery } from "@/utils/helpers/dataHelpers";
import { mapData } from "@/utils/mapper";
import { galleryPhotoCategorySchema, galleryPhotoByCategorySchema, galleryPhotoDetailByCategorySchema } from "@/schemas/index";
import type { GalleryPhotoCategoryType, GalleryPhotoByCategoryType, GalleryPhotoDetailByCategoryType, PaginatedGalleryPhotoByCategoryListType  } from "@/types/index";

export class GalleryApi extends FetchData {
    protected getBaseApiUrl(): string {
        return `/api/v1/gallery/photo/${WEBSITE_UUID}`;
    }    

    /**
     * Fetch list of gallery photo by categories
     * @param query - Query object with endpoint, group, en, and currentPage
     * @returns Promise<PaginatedGalleryPhotoByCategoryListType> - Paginated gallery photo by category list object
     */
    async fetchListGalleryPhotoByCategory(slug: string, query: any): Promise<PaginatedGalleryPhotoByCategoryListType> {
        const pagePart = query.currentPage ? `:page:${query.currentPage}` : "";
        const cacheKey = `${CACHE_NAME}:gallery:photo:by:category:list:${slug}${pagePart}:${cleanQuery(query)}`;

        if (CACHE_ENABLE) {
            const cachedData = await CacheUtils.get(cacheKey);
            if (cachedData) return cachedData;
        }

        const endpoint = typeof query === 'string' ? query : query?.endpoint || '';
        const data = await this.fetchData(`${this.getBaseApiUrl()}/category/${slug}${endpoint}`);
        
        if (hasValue(data)) {
            const mappedGallery = data.gallery.map((gallery: any) => mapData<GalleryPhotoByCategoryType>(gallery, galleryPhotoByCategorySchema));
            const result = {
                gallery: mappedGallery,
                total: data.totalGallery || 0,
                totalPages: data.totalPages || 0,
                currentPage: data.currentPage || 1
            };

            if (CACHE_ENABLE) {
                await CacheUtils.set(cacheKey, result, "1w");
            }
            return result;
        }

        return {
            gallery: [],
            total: 0,
            totalPages: 0,
            currentPage: 1
        };
    }
    
    /**
     * Fetch list of gallery photo categories
     * @returns Promise<GalleryPhotoCategoryType | null> - Gallery photo category object or null if not found
     */
    async fetchGalleryPhotoCategories(): Promise<GalleryPhotoCategoryType | null> {
        const cacheKey = `${CACHE_NAME}:gallery:photo:category`;

        if (CACHE_ENABLE) {
            const cachedData = await CacheUtils.get(cacheKey);
            if (cachedData) return cachedData;
        }

        const data = await this.fetchData(`${this.getBaseApiUrl()}/category`);

        if (hasValue(data)) {
            const mappedData = mapData<GalleryPhotoCategoryType>(data, galleryPhotoCategorySchema);
            const result = Array.isArray(mappedData) ? mappedData[0] : mappedData;

            if (CACHE_ENABLE) {
                await CacheUtils.set(cacheKey, result, "1w");
            }
            return result;
        }

        return null;
    }
    
    /**
     * Fetch list of gallery photo categories
     * @returns Promise<GalleryPhotoCategoryType | null> - Gallery photo category object or null if not found
     */
    async fetchGalleryDetailPhotoCategories(slug: string, category: string): Promise<GalleryPhotoDetailByCategoryType | null> {
        const cacheKey = `${CACHE_NAME}:gallery:photo:detail:category:${category}:${slug}`;

        if (CACHE_ENABLE) {
            const cachedData = await CacheUtils.get(cacheKey);
            if (cachedData) return cachedData;
        }

        const data = await this.fetchData(`${this.getBaseApiUrl()}/category/${category}/${slug}`);

        console.log('data', data);

        if (hasValue(data)) {
            const mappedData = mapData<GalleryPhotoDetailByCategoryType>(data, galleryPhotoDetailByCategorySchema);
            const result = Array.isArray(mappedData) ? mappedData[0] : mappedData;

            if (CACHE_ENABLE) {
                await CacheUtils.set(cacheKey, result, "1w");
            }
            return result;
        }

        return null;
    }


}