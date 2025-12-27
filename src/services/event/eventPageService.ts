import { EventApi } from '@/services/index';
import { hasValue } from '@/utils/helpers/dataHelpers';
import { getPaginationParams, buildPaginationQuery } from '@/utils/helpers/paginationHelpers';
import { PaginatedEventListType, EventType } from '@/types/index';

export interface EventPageData {
    eventList: PaginatedEventListType;
    isEmptyEventList: boolean;
}

export interface EventQueryParams {
    page?: string;
    limit?: number;
    group?: string;
    en?: number;
}

/**
 * Event Page Service - Business logic layer for event page data management
 * Handles data fetching, pagination, and state management for event pages
 */
export class EventPageService {
    private eventApiService: EventApi;

    constructor() {
        this.eventApiService = new EventApi();
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
    async fetchEventPageData(
        url: URL, 
        limit: number = 12, 
        group: string = '', 
        en: number = 0,
        year: string = ''
    ): Promise<EventPageData> {
        // Get pagination parameters using library
        const paginationParams = getPaginationParams(url, limit);
        
        // Build query for event list
        const query = this.buildEventQuery(paginationParams, group, en, year);

        // Fetch event list data
        const eventListData = await this.eventApiService.fetchListEvents(query);

        let isEmptyEventList = true;
        let eventList: PaginatedEventListType = {
            events: [],
            total: 0,
            totalPages: 0,
            currentPage: paginationParams.currentPage
        };

        if (hasValue(eventListData) && eventListData.events.length > 0) {
            isEmptyEventList = false;
            // Ensure currentPage from API matches URL
            eventList = {
                ...eventListData,
                currentPage: paginationParams.currentPage // Override with currentPage from URL
            };
        }

        return {
            eventList,
            isEmptyEventList
        };
    }

    /**
     * Build query object for event API
     * @param paginationParams - Pagination parameters
     * @param group - Event group (optional)
     * @param en - Language flag (default: 0)
     * @returns Query object for API
     */
    private buildEventQuery(
        paginationParams: { currentPage: number; skip: number; limit: number },
        group: string = '',
        en: number = 0,
        year: string = ''
    ) {
        const additionalParams: Record<string, any> = { en };
        
        if (group) {
            additionalParams.group = group;
        }

        if (year) {
            additionalParams.year = year;
        }

        return {
            endpoint: buildPaginationQuery(paginationParams, additionalParams),
            currentPage: paginationParams.currentPage,
        };
    }

    /**
     * Fetch event detail by slug
     * @param slug - Event slug identifier
     * @returns Promise<EventType | null>
     */
    async fetchEventDetail(slug: string): Promise<EventType | null> {
        return await this.eventApiService.fetchDetailEvents(slug);
    }
}

// Export singleton instance for convenience
export const eventPageService = new EventPageService();

