import { FetchData } from "@/services/fetchData";
import { CacheUtils } from "@/utils/cacheUtils";
import { CACHE_NAME, CACHE_ENABLE, WEBSITE_UUID } from "@globals/config";
import { hasValue, cleanQuery } from "@/utils/helpers/dataHelpers";
import { mapData } from "@/utils/mapper";
import { eventSchema } from "@/schemas/index";
import type { EventType, PaginatedEventListType } from "@/types/index";

export class EventApi extends FetchData {
    protected getBaseApiUrl(): string {
        return `/api/v1/events/${WEBSITE_UUID}`;
    }

    /**
     * Fetch list of events
     * @param query - Query object with endpoint, group, en, and currentPage
     * @returns Promise<PaginatedEventListType> - Paginated event list object
     */
    async fetchListEvents(query: any): Promise<PaginatedEventListType> {
        const pagePart = query.currentPage ? `:page:${query.currentPage}` : "";
        const cacheKey = `${CACHE_NAME}:events:list${pagePart}:${cleanQuery(query)}`;

        if (CACHE_ENABLE) {
            const cachedData = await CacheUtils.get(cacheKey);
            if (cachedData) return cachedData;
        }

        const endpoint = typeof query === 'string' ? query : query?.endpoint || '';
        const data = await this.fetchData(`${this.getBaseApiUrl()}/list-events${endpoint}`);
        
        if (hasValue(data)) {
            const mappedEvents = data.events.map((event: any) => mapData<EventType>(event, eventSchema));
            const result = {
                events: mappedEvents,
                total: data.totalEvents || 0,
                totalPages: data.totalPages || 0,
                currentPage: data.currentPage || 1
            };

            if (CACHE_ENABLE) {
                await CacheUtils.set(cacheKey, result, "1w");
            }
            return result;
        }

        return {
            events: [],
            total: 0,
            totalPages: 0,
            currentPage: 1
        };
    }

    /**
     * Fetch detail of a specific event
     * @param slug - Event slug identifier
     * @returns Promise<EventType | null> - Event detail object or null if not found
     */
    async fetchDetailEvents(slug: string): Promise<EventType | null> {
        const cacheKey = `${CACHE_NAME}:events:detail:${slug}`;

        if (CACHE_ENABLE) {
            const cachedData = await CacheUtils.get(cacheKey);
            if (cachedData) return cachedData;
        }

        const data = await this.fetchData(`${this.getBaseApiUrl()}/${slug}`);

        if (hasValue(data)) {
            const mappedData = mapData<EventType>(data, eventSchema);
            const result = Array.isArray(mappedData) ? mappedData[0] : mappedData;

            if (CACHE_ENABLE) {
                await CacheUtils.set(cacheKey, result, "1w");
            }
            return result;
        }

        return null;
    }

    
    /**
     * Fetch total events grouped by year
     * @returns Promise<Record<string, number> | null> - Object with year as key and event count as value
     */
    async fetchTotalEvents(): Promise<Record<string, number> | null> {
        const cacheKey = `${CACHE_NAME}:events:total`;

        if (CACHE_ENABLE) {
            const cachedData = await CacheUtils.get(cacheKey);
            if (cachedData) return cachedData;
        }

        const data = await this.fetchData(`${this.getBaseApiUrl()}/total`);

        if (hasValue(data)) {
            if (CACHE_ENABLE) {
                await CacheUtils.set(cacheKey, data, "1w");
            }
            return data;
        }

        return null;
    }

}