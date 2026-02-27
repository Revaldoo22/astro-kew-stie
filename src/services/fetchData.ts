import fetch from "node-fetch";

// Define the structure of API responses
interface ApiResponse {
  data?: any[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

class FetchData {
  async fetchData(token: string, endpoint: string): Promise<ApiResponse | "limit" | null> {
    try {
      const baseUrl = 'https://seomaster.stekom.ac.id/api/';

      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: "GET",
        headers: {
          "X-API-Key": token,
        },
      });

      if (!response.ok) {
        if (response.status === 429) return "limit";
        return null;
      }

      const data = await response.json() as ApiResponse;

      // console.log("RAW JSON =>", data);

      return data;
    } catch (error) {
      console.error("Fetch error:", error);
      return null;
    }
  }
}

export { FetchData };
export type { ApiResponse };
