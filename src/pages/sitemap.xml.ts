import { BlogApi } from "@/services/blogApi";
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
    const blogApi = new BlogApi();

    // Fetch all contents from all projects
    const allContents = await blogApi.fetchAllContentsForSitemap();

    const baseUrl = "https://kew.stekom.ac.id";

    // Generate XML sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Blog Index -->
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Blog Posts -->
  ${allContents && allContents.length > 0
            ? allContents.map((content) => `
  <url>
    <loc>${baseUrl}/blog/${content.slug}</loc>
    <lastmod>${content.createdAt}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')
            : ''}
</urlset>`;

    // Return XML response
    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        },
    });
};
