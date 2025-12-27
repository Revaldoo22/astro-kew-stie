/**
 * Global Configuration
 * 
 * This file contains all global configuration constants used throughout the application.
 * Configuration is organized into logical sections for better maintainability.
 */

// ================================
// API Configuration - Portal News
// ================================

/**
 * Bearer token for portal news API authentication
 * Used for authorized access to STEKOM Semarang portal news system
 */
export const BEARER_TOKEN =
  "41|VzuQwGMPJ4W31mm6hoEoyjtiwdjsQiCXt0vdCcZde941339f";
// export const BEARER_TOKEN =
// "26|VBGGMnFzvhCFWBedmMkQd4R6Euksl3myFbL9IoN796d03ff6";

/**
* Base URL for portal news API endpoints
* Points to STIKOM Surabaya's portal news system
*/
export const BASE_URL_POST = "https://portalnews.stekom.ac.id";

/**
* Website UUID for portal news identification
* Unique identifier for this website in the portal news system
*/
export const WEBSITE_UUID = "7c239daa-b116-4169-8edb-ea1171d9ede6";
// export const WEBSITE_UUID = "e940fa9a-1cd6-4619-8183-910d845805ce";


// ================================
// API Configuration - Web Platform
// ================================

/**
 * Bearer token for web platform API authentication
 * Used for authorized access to STIKOM Surabaya's web platform
 */
export const BEARER_TOKEN_WEB =
  "28|UP8WyfQXdqcfon8CnwYdfuvvu9wVmtJU0KQWtCw570dd0f35";

/**
 * Base URL for web platform API endpoints
 * Points to STIKOM Surabaya's web platform system
 */
export const BASE_URL_WEB = "https://web.stekom.ac.id";

/**
 * Website UUID for web platform identification
 * Unique identifier for this website in the web platform system
 */
export const WEBSITE_UUID_WEB = "5a37bc64-10a1-49df-b24e-c2f32c3711b5";

// ================================
// Application Identity
// ================================

/**
 * Application origin domain
 * The primary domain where this application is hosted
 */
export const ORIGIN = "disabilitas.id";

/**
 * Base URL for the application
 * Uses Astro's environment variable for dynamic base URL configuration
 */
export const BASE_URL = import.meta.env.BASE_URL;

/**
 * Short display name for the website
 * Used in UI components, meta tags, and branding
 */
export const SHORT_NAME_WEBSITE = "Disabilitas ID";

// ================================
// Caching Configuration
// ================================

/**
 * Cache identifier name
 * Used for service worker caching and browser cache management
 */
export const CACHE_NAME = "disabilitasid";

/**
 * Global cache enable/disable flag
 * Controls whether caching mechanisms are active across the application
 * Set to false during development, true for production builds
 */
export const CACHE_ENABLE = true;