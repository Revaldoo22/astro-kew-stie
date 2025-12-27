import { PostService } from "./postService";
import { PostCategoryService } from "./categoryService";

/**
 * Unified PostApi class that combines all post services
 * Maintains backward compatibility while using separated services internally
 */
export class PostApi {  
    private postService: PostService;
    private categoryService: PostCategoryService;
  
    constructor() {
      this.postService = new PostService();
      this.categoryService = new PostCategoryService();
    }

    // Detail operations
    async fetchDetailPosts(slug: string) {
      return this.postService.fetchDetailPosts(slug);
    }

    // List operations
    async fetchListPosts(query: any) {
      return this.postService.fetchListPosts(query);
    }

    // Latest operations
    async fetchLatestPosts(query: any) {
      return this.postService.fetchLatestPosts(query);
    }

    // Recent operations
    async fetchRecentPosts(query: any) {
      return this.postService.fetchRecentPosts(query);
    }

    // Popular operations
    async fetchPopularPosts(query: any) {
      return this.postService.fetchPopularPosts(query);
    }

    // Trending operations
    async fetchTrendingPosts(query: any) {
      return this.postService.fetchTrendingPosts(query);
    }

    // Author operations
    async fetchAuthorPosts(query: any) {
      return this.postService.fetchAuthorPosts(query);
    }

    // Category operations
    async fetchListCategories() {
      return this.categoryService.fetchListCategories();
    }

    async fetchCategoryPosts(query: any) {
      return this.categoryService.fetchCategoryPosts(query);
    }

    async fetchListCategoryPosts(query: any) {
      return this.categoryService.fetchListCategoryPosts(query);
    }

}