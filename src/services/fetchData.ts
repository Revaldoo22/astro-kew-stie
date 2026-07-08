import fetch from "node-fetch";

// Define the structure of API responses
interface ApiResponse {
  data?: any[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

// Batas waktu request ke API supaya route SSR tidak menggantung
// sampai Cloudflare timeout (error 524) ketika API lambat/hang.
const FETCH_TIMEOUT_MS = 15000;

class FetchData {
  async fetchData(token: string, endpoint: string): Promise<ApiResponse | "limit" | null> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
      const baseUrl = 'https://seomaster.stekom.ac.id/api/';

      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: "GET",
        headers: {
          "X-API-Key": token,
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        if (response.status === 429) return "limit";
        return null;
      }

      const data = await response.json() as ApiResponse;

      // console.log("RAW JSON =>", data);

      return data;
    } catch (error) {
      if ((error as Error)?.name === "AbortError") {
        console.error(`Fetch timeout (${FETCH_TIMEOUT_MS}ms): ${endpoint}`);
      } else {
        console.error("Fetch error:", error);
      }
      return null;
    } finally {
      clearTimeout(timeout);
    }
  }
}

export { FetchData };
export type { ApiResponse };
