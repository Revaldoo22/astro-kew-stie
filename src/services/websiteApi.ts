import { FetchData } from "@/services/fetchData";
import { CacheUtils } from "@/utils/cacheUtils";
import { CACHE_NAME, CACHE_ENABLE, BEARER_TOKEN_WEB, BASE_URL_WEB, WEBSITE_UUID_WEB } from "@globals/config";
import { hasValue } from "@/utils/helpers/dataHelpers";
import { mapData } from "@/utils/mapper"; 
import { infoWebsiteSchema, slideSchema, infoMenuSchema, pageSchema } from "@/schemas/index";
import type { InfoWebsiteType, SlideType, InfoMenuType, PageType } from "@/types/index";

class WebsiteApi extends FetchData {


  /**
   * Fetch info
   * @param en - Language
   * @returns Info
   */
  async fetchInfo(en = "0") {

    const cacheKey = `${CACHE_NAME}:info:${en}`;

    if (CACHE_ENABLE) {
      const cachedData = await CacheUtils.get(cacheKey);
      if (cachedData) return cachedData;
    }

    const data = await this.fetchData(`/api/v1/website/${WEBSITE_UUID_WEB}/info?en=${en}`, {
        type: "json",
        base_url: BASE_URL_WEB,
        bearer_token: BEARER_TOKEN_WEB
      }
    );

    if (hasValue(data)) {
      
      const mappedData = mapData<InfoWebsiteType>(data, infoWebsiteSchema);

      if (CACHE_ENABLE) {
        await CacheUtils.set(cacheKey, mappedData, "1w");
      }
      return mappedData;
    }

    return data;
  }

  
  /**
   * Fetch menu
   * @returns Menu - Array containing [indonesiaMenu, englishMenu]
   */
  async fetchMenu() {
    
    const cacheKey = `${CACHE_NAME}:menu`;

    if (CACHE_ENABLE) {
      const cachedData = await CacheUtils.get(cacheKey);
      if (cachedData) return cachedData;
    }

    const data = await this.fetchData(`/api/v1/website/${WEBSITE_UUID_WEB}/menu`, {
        type: "json",
        base_url: BASE_URL_WEB,
        bearer_token: BEARER_TOKEN_WEB
      }
    );

    if (hasValue(data)) {
      
      const mappedData = mapData<InfoMenuType>(data, infoMenuSchema);

      if (CACHE_ENABLE) {
        await CacheUtils.set(cacheKey, mappedData, "1w");
      }
      return mappedData;
    }

    return data;
  }

  
  /**
   * Fetch slides
   * @returns Slides - Array containing [indonesiaSlides, englishSlides]
   */
  async fetchSlides() {
    
    const cacheKey = `${CACHE_NAME}:slides`;

    if (CACHE_ENABLE) {
      const cachedData = await CacheUtils.get(cacheKey);
      if (cachedData) return cachedData;
    }

    const data = await this.fetchData(`/api/v1/website/${WEBSITE_UUID_WEB}/slide`, {
        type: "json",
        base_url: BASE_URL_WEB,
        bearer_token: BEARER_TOKEN_WEB
      }
    );

    if (hasValue(data)) {
      
      const mappedData = mapData<SlideType>(data, slideSchema);

      if (CACHE_ENABLE) {
        await CacheUtils.set(cacheKey, mappedData, "1w");
      }
      return mappedData;
    }

    return data;
  }

  async fetchDetailPages(slug: string) {

    const cacheKey = `${CACHE_NAME}:page:detail:${slug}`;

    if (CACHE_ENABLE) {
      const cachedData = await CacheUtils.get(cacheKey);
      if (cachedData) return cachedData;
    }

    const data = await this.fetchData(`/api/v1/pages/${WEBSITE_UUID_WEB}/${slug}`, {
      type: "json",
      base_url: BASE_URL_WEB,
      bearer_token: BEARER_TOKEN_WEB,
    });

    if (hasValue(data)) {
      
      const mappedData = mapData<PageType>(data, pageSchema);

      if (CACHE_ENABLE) {
        await CacheUtils.set(cacheKey, mappedData, "1w");
      }
      return mappedData;
    }

    return null;

  }

}

export { WebsiteApi };
