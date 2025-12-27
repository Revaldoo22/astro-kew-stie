import fetch from "node-fetch";
import { CacheUtils } from "@/utils/cacheUtils";
import { BEARER_TOKEN, BASE_URL_POST, ORIGIN } from "@globals/config";

interface OptionsFetchData {
  type?: string;
  base_url?: string;
  bearer_token?: string;
  slug?: string;
}

interface ViewData {
  count: number;
  last_update: number;
}

class FetchData {
  async sendViewCountToAPI(postId: string, count: number, slug?: string) {
    const response = await fetch(`${BASE_URL_POST}/api/v1/posts/update-view-count`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${BEARER_TOKEN}`,
        Origin: ORIGIN,
      },
      body: JSON.stringify({ post_id: postId, count, domain: ORIGIN }),
    });

    if (response.ok) {
      if (slug) {
        await CacheUtils.resetViewCount(slug);
        console.log(
          `View count ${count} successfully sent to API for post ${postId} (slug: ${slug})`
        );
      }
    } else {
      console.error("Failed to send view count:", response.statusText);
    }
  }

  async fetchData(endpoint: string, options?: OptionsFetchData) {
    try {
      const baseUrl = options?.base_url || BASE_URL_POST;
      const bearerToken = options?.bearer_token || BEARER_TOKEN;

      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearerToken}`,
          Origin: ORIGIN,
        },
      });

      if (!response) return [];
      if (response.status === 429) return "limit";

      const data = await response.json() as { success: boolean; data?: any };
      
      // console.log("RAW JSON =>", data);


      return data.success ? data.data : [];
    } catch {
      return null;
    }
  }
}

export { FetchData };
export type { OptionsFetchData };
