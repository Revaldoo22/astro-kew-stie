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
   * Fetch all projects from organization
   * @returns Array of projects or null
   */
  async fetchAllProjects(): Promise<Project[] | null> {
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
      const projects = data.data as Project[];
      return projects;
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
    // Fetch all projects once
    const projects = await this.fetchAllProjects();

    if (!projects || projects.length === 0) {
      console.warn("No projects available");
      return null;
    }


    // Sort projects by createdAt descending (latest first)
    const sortedProjects = [...projects].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA; // Descending order (newest first)
    });


    // Priority order:
    // 1. LAST project (latest based on createdAt) - tried first
    // 2. FIRST project (first in original array) - only if #1 returns empty/null data
    const latestProject = sortedProjects[0];
    const firstProject = projects[0];

    const projectsToTry = [latestProject];

    // Only add first project if it's different from latest
    if (latestProject.id !== firstProject.id) {
      projectsToTry.push(firstProject);
    } else {
      // If they're the same, try the last project in the original array as fallback
      const lastProjectInArray = projects[projects.length - 1];
      projectsToTry.push(lastProjectInArray);
    }


    // Try each project sequentially until we get valid data
    for (const project of projectsToTry) {

      const endpoint = `public/projects/${project.id}/contents?status=${status}&page=${page}&limit=${limit}`;
      const data = await this.fetchData(API_KEY_SEO_MASTER, endpoint);


      // Handle rate limit response
      if (data === "limit") {
        continue; // Try next project
      }

      // Check if we got valid data with actual content
      if (data && hasValue(data) && data?.data && data.data.length > 0) {
        // Map the data array to ProjectContent type
        const mappedData = data.data.map((item: any) =>
          mapData<ProjectContent>(item, projectSchema) as ProjectContent
        );


        return {
          data: mappedData,
          total: data.total || 0,
          page: data.page || page,
          limit: data.limit || limit,
          totalPages: data.totalPages || 0
        };
      }

      // If data is empty or null, log and try next project
      console.warn(`⚠️ Project ${project.name} returned empty or null data, trying next project...`);
    }

    // If all projects failed to return data
    console.warn("No data returned from any project");
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
   * Fetch all contents from all projects for sitemap generation
   * @param status - Publication status (default: "published")
   * @returns Array of all content from all projects or null
   */
  async fetchAllContentsForSitemap(
    status: string = "published"
  ): Promise<ProjectContent[] | null> {
    // Fetch all projects once
    const projects = await this.fetchAllProjects();

    if (!projects || projects.length === 0) {
      console.warn("No projects available for sitemap");
      return null;
    }


    const allContents: ProjectContent[] = [];

    // Iterate through all projects
    for (const project of projects) {

      try {
        let currentPage = 1;
        let hasMorePages = true;
        const limit = 100; // Fetch 100 items per page for efficiency

        // Fetch all pages for this project
        while (hasMorePages) {
          const endpoint = `public/projects/${project.id}/contents?status=${status}&page=${currentPage}&limit=${limit}`;
          const data = await this.fetchData(API_KEY_SEO_MASTER, endpoint);

          // Handle rate limit response
          if (data === "limit") {
            console.warn(`⚠️ API rate limit reached for project ${project.name}, skipping...`);
            break;
          }

          // Handle null or invalid response
          if (!data || !hasValue(data) || !data?.data) {
            console.warn(`⚠️ No data returned from project ${project.name}`);
            break;
          }

          // If no data in this page, stop pagination
          if (data.data.length === 0) {
            break;
          }

          // Map the data array to ProjectContent type
          const mappedData = data.data.map((item: any) =>
            mapData<ProjectContent>(item, projectSchema) as ProjectContent
          );

          // Add to allContents array
          allContents.push(...mappedData);


          // Check if there are more pages
          const totalPages = data.totalPages || 0;
          if (currentPage >= totalPages) {
            hasMorePages = false;
          } else {
            currentPage++;
          }
        }


      } catch (error) {
        // Continue with next project even if one fails
        continue;
      }
    }

    if (allContents.length === 0) {
      console.warn("No contents found across all projects");
      return null;
    }


    // Sort by createdAt descending (most recent first)
    const sortedContents = allContents.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });

    return sortedContents;
  }

  /**
   * Fetch all contents from a specific project
   * @param project - Project object
   * @param status - Publication status (default: "published")
   * @returns Array of contents from the project
   */
  async fetchContentsByProject(
    project: Project,
    status: string = "published"
  ): Promise<ProjectContent[] | null> {

    try {
      let currentPage = 1;
      let hasMorePages = true;
      const limit = 100; // Fetch 100 items per page for efficiency
      const allContents: ProjectContent[] = [];

      // Fetch all pages for this project
      while (hasMorePages) {
        const endpoint = `public/projects/${project.id}/contents?status=${status}&page=${currentPage}&limit=${limit}`;
        const data = await this.fetchData(API_KEY_SEO_MASTER, endpoint);

        // Handle rate limit response
        if (data === "limit") {
          console.warn(`⚠️ API rate limit reached for project ${project.name}, skipping...`);
          break;
        }

        // Handle null or invalid response
        if (!data || !hasValue(data) || !data?.data) {
          console.warn(`⚠️ No data returned from project ${project.name}`);
          break;
        }

        // If no data in this page, stop pagination
        if (data.data.length === 0) {
          break;
        }

        // Map the data array to ProjectContent type
        const mappedData = data.data.map((item: any) =>
          mapData<ProjectContent>(item, projectSchema) as ProjectContent
        );

        // Add to allContents array
        allContents.push(...mappedData);


        // Check if there are more pages
        const totalPages = data.totalPages || 0;
        if (currentPage >= totalPages) {
          hasMorePages = false;
        } else {
          currentPage++;
        }
      }

      return allContents;

    } catch (error) {
      return null;
    }
  }

}

export { BlogApi };
export type { ProjectsResponse, Category, CategoriesResponse, Project, ProjectsListResponse };
