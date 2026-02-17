import { BlogApi } from "@/services/blogApi";
import type { APIRoute } from "astro";
import { slugify } from "@/utils/slug";

export const GET: APIRoute = async ({ params }) => {
    const projectParam = params.project;

    // Validate param (it should be a slug string now)
    if (!projectParam) {
        return new Response('Not found', { status: 404 });
    }

    const blogApi = new BlogApi();
    const projects = await blogApi.fetchAllProjects();

    if (!projects || projects.length === 0) {
        return new Response('Not found', { status: 404 });
    }

    // Find the project that matches the slug
    const targetProject = projects.find(p => slugify(p.name) === projectParam);

    if (!targetProject) {
        return new Response('Not found', { status: 404 });
    }

    console.log(`Generating sitemap for project: ${targetProject.name} (Slug: ${projectParam})`);

    // Fetch contents for this project
    const contents = await blogApi.fetchContentsByProject(targetProject);
    const baseUrl = "https://kew.stekom.ac.id";

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Contents for ${targetProject.name} -->
  ${contents && contents.length > 0
            ? contents.map((content) => `
  <url>
    <loc>${baseUrl}/${content.slug}</loc>
    <lastmod>${content.createdAt}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')
            : ''}
</urlset>`;

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
        },
    });
};
