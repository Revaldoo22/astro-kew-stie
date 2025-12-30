import { FetchData } from "@/services/fetchData";
import { hasValue } from "@/utils/helpers/dataHelpers";
import { mapData } from "@/utils/mapper";
import { projectSchema } from "@/schemas/projectSchema";
import type { ProjectContent } from "@/types/blogType";
import { API_KEY_SEO_MASTER, ORGANIZATION_UUID_SEO_MASTER } from "@globals/config";

interface ProjectsResponse {
  data: ProjectContent[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
}

interface CategoriesResponse {
  data: Category[];
  total: number;
}

interface Project {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  categories: Category[];
  createdAt: string;
  updatedAt: string;
}

interface ProjectsListResponse {
  data: Project[];
  total: number;
}

class BlogApi extends FetchData {

  /**
   * Fetch the latest project from organization
   * @returns Latest project ID or null
   */
  async fetchLatestProject(): Promise<string | null> {
    const endpoint = `public/organizations/${ORGANIZATION_UUID_SEO_MASTER}/projects`;

    const data = await this.fetchData(API_KEY_SEO_MASTER, endpoint);

    // Handle rate limit response
    if (data === "limit") {
      console.warn("API rate limit reached");
      return null;
    }

    // Handle null or invalid response
    if (!data) {
      console.warn("No projects data returned from API");
      return null;
    }

    if (hasValue(data) && data?.data && data.data.length > 0) {
      // Return the first (latest) project ID
      const latestProject = data.data[0] as Project;
      console.log('Latest project:', latestProject);
      return latestProject.id;
    }

    return null;
  }

  /**
   * Fetch blog projects/contents
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 10)
   * @param status - Publication status (default: "published")
   * @returns Projects response with data and pagination info
   */
  async fetchProjects(
    page: number = 1,
    limit: number = 10,
    status: string = "published"
  ): Promise<ProjectsResponse | null> {
    // Fetch the latest project ID dynamically
    const projectId = await this.fetchLatestProject();

    if (!projectId) {
      console.warn("No project ID available");
      return null;
    }

    const endpoint = `public/projects/${projectId}/contents?status=${status}&page=${page}&limit=${limit}`;

    const data = await this.fetchData(API_KEY_SEO_MASTER, endpoint);

    // Handle rate limit response
    if (data === "limit") {
      console.warn("API rate limit reached");
      return null;
    }

    // Handle null or invalid response
    if (!data) {
      console.warn("No data returned from API");
      return null;
    }

    // Now TypeScript knows data is ApiResponse type
    if (hasValue(data)) {
      // Map the data array to ProjectContent type
      const mappedData = data?.data?.map((item: any) =>
        mapData<ProjectContent>(item, projectSchema) as ProjectContent
      ) || [];
      console.log('mappedData blog', mappedData);
      return {
        data: mappedData,
        total: data?.total || 0,
        page: data?.page || page,
        limit: data?.limit || limit,
        totalPages: data?.totalPages || 0
      };
    }

    return null;
  }

  /**
   * Fetch single blog content by ID
   * @param contentId - Content ID
   * @returns Single content data or null
   */
  async fetchContentById(contentId: string): Promise<ProjectContent | null> {
    const endpoint = `public/contents/${contentId}`;

    const data = await this.fetchData(API_KEY_SEO_MASTER, endpoint);

    // Handle rate limit response
    if (data === "limit") {
      console.warn("API rate limit reached");
      return null;
    }

    // Handle null or invalid response
    if (!data) {
      console.warn("No content data returned from API");
      return null;
    }

    if (hasValue(data)) {
      // Map the single content to ProjectContent type
      const mappedContent = mapData<ProjectContent>(data, projectSchema) as ProjectContent;
      console.log('Mapped content:', mappedContent);
      return mappedContent;
    }

    return null;
  }

  /**
   * Fetch blog categories
   * @returns Categories response with data
   */
  async fetchCategories(): Promise<CategoriesResponse | null> {
    const endpoint = `public/organizations/${ORGANIZATION_UUID_SEO_MASTER}/categories`;

    const data = await this.fetchData(API_KEY_SEO_MASTER, endpoint);

    // Handle rate limit response
    if (data === "limit") {
      console.warn("API rate limit reached");
      return null;
    }

    // Handle null or invalid response
    if (!data) {
      console.warn("No categories data returned from API");
      return null;
    }

    if (hasValue(data)) {
      console.log('data categories', data);
      return {
        data: data?.data || [],
        total: data?.total || 0
      };
    }

    return null;
  }

  /**
   * Fetch blog posts by category
   * @param categoryId - Category ID
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 10)
   * @param status - Publication status (default: "published")
   * @returns Projects response with data and pagination info
   */
  async fetchProjectsByCategory(
    categoryId: string,
    page: number = 1,
    limit: number = 10,
    status: string = "published"
  ): Promise<ProjectsResponse | null> {
    const endpoint = `public/organizations/${ORGANIZATION_UUID_SEO_MASTER}/categories/${categoryId}/contents?status=${status}&page=${page}&limit=${limit}`;

    const data = await this.fetchData(API_KEY_SEO_MASTER, endpoint);

    // Handle rate limit response
    if (data === "limit") {
      console.warn("API rate limit reached");
      return null;
    }

    // Handle null or invalid response
    if (!data) {
      console.warn("No data returned from API");
      return null;
    }

    // Now TypeScript knows data is ApiResponse type
    if (hasValue(data)) {
      // Map the data array to ProjectContent type
      const mappedData = data?.data?.map((item: any) =>
        mapData<ProjectContent>(item, projectSchema) as ProjectContent
      ) || [];

      console.log('mappedData by category', data);

      return {
        data: mappedData,
        total: data?.total || 0,
        page: data?.page || page,
        limit: data?.limit || limit,
        totalPages: data?.totalPages || 0
      };
    }

    return null;
  }

}

export { BlogApi };
export type { ProjectsResponse, Category, CategoriesResponse, Project, ProjectsListResponse };
