/**
 * Pagination Helpers - Utility functions for pagination logic
 * Provides reusable pagination calculations and query building
 */

export interface PaginationParams {
    currentPage: number;
    skip: number;
    limit: number;
}

export interface PaginationMeta {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
}

/**
 * Generate pagination parameters from URL
 * @param url - Astro URL object or URLSearchParams
 * @param limit - Number of items per page (default: 30)
 * @returns Object with pagination parameters
 */
export function getPaginationParams(
    url: URL | URLSearchParams, 
    limit: number = 30
): PaginationParams {
    const searchParams = url instanceof URL ? url.searchParams : url;
    const currentPageFromUrl = searchParams.get('page');
    const currentPage = currentPageFromUrl ? parseInt(currentPageFromUrl, 10) : 1;
    
    // Ensure currentPage is at least 1
    const validPage = Math.max(1, currentPage);
    const skip = (validPage - 1) * limit;

    return {
        currentPage: validPage,
        skip,
        limit
    };
}

/**
 * Build query string for pagination
 * @param params - Pagination parameters
 * @param additionalParams - Additional query parameters
 * @returns Query string
 */
export function buildPaginationQuery(
    params: PaginationParams,
    additionalParams: Record<string, any> = {}
): string {
    const queryParts: string[] = [
        `limit=${params.limit}`,
        `skip=${params.skip}`
    ];

    // Add additional parameters
    Object.entries(additionalParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            queryParts.push(`${key}=${encodeURIComponent(value)}`);
        }
    });

    return `?${queryParts.join('&')}`;
}

/**
 * Calculate pagination metadata
 * @param totalItems - Total number of items
 * @param currentPage - Current page number
 * @param limit - Items per page
 * @returns Pagination metadata object
 */
export function calculatePaginationMeta(
    totalItems: number,
    currentPage: number,
    limit: number
): PaginationMeta {
    const totalPages = Math.ceil(totalItems / limit);
    const hasNextPage = currentPage < totalPages;
    const hasPrevPage = currentPage > 1;

    return {
        totalItems,
        totalPages,
        currentPage,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? currentPage + 1 : null,
        prevPage: hasPrevPage ? currentPage - 1 : null
    };
}

/**
 * Get page range for pagination UI
 * @param currentPage - Current page number
 * @param totalPages - Total number of pages
 * @param maxVisible - Maximum number of visible page buttons (default: 5)
 * @returns Array of page numbers to display
 */
export function getPageRange(
    currentPage: number,
    totalPages: number,
    maxVisible: number = 5
): number[] {
    if (totalPages <= maxVisible) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const halfVisible = Math.floor(maxVisible / 2);
    let start = Math.max(1, currentPage - halfVisible);
    let end = Math.min(totalPages, start + maxVisible - 1);

    // Adjust start if we're near the end
    if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

/**
 * Validate pagination parameters
 * @param page - Page number
 * @param limit - Items per page
 * @returns Object with validated parameters and isValid flag
 */
export function validatePaginationParams(
    page: number | string | null,
    limit: number | string | null = 30
): { isValid: boolean; page: number; limit: number; errors: string[] } {
    const errors: string[] = [];
    
    let validPage = 1;
    let validLimit = 30;

    // Validate page
    if (page !== null) {
        const parsedPage = typeof page === 'string' ? parseInt(page, 10) : page;
        if (isNaN(parsedPage) || parsedPage < 1) {
            errors.push('Page number must be a positive integer');
        } else if (parsedPage > 10000) {
            errors.push('Page number too large (max: 10000)');
        } else {
            validPage = parsedPage;
        }
    }

    // Validate limit
    if (limit !== null) {
        const parsedLimit = typeof limit === 'string' ? parseInt(limit, 10) : limit;
        if (isNaN(parsedLimit) || parsedLimit < 1) {
            errors.push('Limit must be a positive integer');
        } else if (parsedLimit > 100) {
            errors.push('Limit too large (max: 100)');
        } else {
            validLimit = parsedLimit;
        }
    }

    return {
        isValid: errors.length === 0,
        page: validPage,
        limit: validLimit,
        errors
    };
}

/**
 * Build pagination URL for a specific page
 * @param baseUrl - Base URL without query params
 * @param page - Target page number
 * @param preserveParams - Other query params to preserve
 * @returns Complete URL string
 */
export function buildPageUrl(
    baseUrl: string,
    page: number,
    preserveParams: Record<string, string> = {}
): string {
    const url = new URL(baseUrl, 'http://dummy.com'); // dummy base for relative URLs
    
    // Add page parameter
    url.searchParams.set('page', page.toString());
    
    // Preserve other parameters
    Object.entries(preserveParams).forEach(([key, value]) => {
        if (key !== 'page' && value) {
            url.searchParams.set(key, value);
        }
    });

    return `${url.pathname}${url.search}`;
}

