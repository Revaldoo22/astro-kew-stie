import { BlogApi } from "@/services/blogApi";
import type { APIRoute } from "astro";

import { slugify } from "@/utils/slug";

export const GET: APIRoute = async () => {
  const blogApi = new BlogApi();
  const projects = await blogApi.fetchAllProjects();
  const baseUrl = "https://kew.stekom.ac.id";

  let projectSitemaps = "";

  if (projects && projects.length > 0) {
    // Sort projects to be consistent with sitemap-[project] logic
    const sortedProjects = [...projects].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });

    projectSitemaps = sortedProjects.map((project) => `
  <sitemap>
    <loc>${baseUrl}/sitemap-${slugify(project.name)}.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`).join('');
  }

  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Main Static Pages & Categories -->
  <sitemap>
    <loc>${baseUrl}/sitemap-main.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
  
  <!-- Project Sitemaps -->
  ${projectSitemaps}
</sitemapindex>`;

  return new Response(sitemapIndex, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
