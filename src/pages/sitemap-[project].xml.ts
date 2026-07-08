import { BlogApi } from "@/services/blogApi";
import type { APIRoute } from "astro";
import { slugify } from "@/utils/slug";
import { readSitemapCache, saveSitemapCache } from "@/utils/sitemapCache";

export const GET: APIRoute = async ({ params }) => {
    const projectParam = params.project;

    // Validate param (it should be a slug string now)
    if (!projectParam) {
        return new Response('Not found', { status: 404 });
    }

    const cacheKey = `sitemap-project-${projectParam}`;
    const baseUrl = "https://kew.stiestekom.ac.id";

    const blogApi = new BlogApi();
    const projects = await blogApi.fetchAllProjects();

    // API down: jangan 404 (itu bikin Google buang URL). Sajikan cache bila ada.
    if (!projects || projects.length === 0) {
        const cached = await readSitemapCache(cacheKey);
        if (cached) {
            return new Response(cached, {
                headers: {
                    'Content-Type': 'application/xml; charset=utf-8',
                    'Cache-Control': 'public, max-age=3600',
                },
            });
        }
        return new Response('Not found', { status: 404 });
    }

    // Find the project that matches the slug
    const targetProject = projects.find(p => slugify(p.name) === projectParam);

    if (!targetProject) {
        return new Response('Not found', { status: 404 });
    }


    // Fetch contents for this project
    const contents = await blogApi.fetchContentsByProject(targetProject);

    // Konten kosong (mungkin API contents gagal): sajikan cache bila ada.
    if (!contents || contents.length === 0) {
        const cached = await readSitemapCache(cacheKey);
        if (cached) {
            return new Response(cached, {
                headers: {
                    'Content-Type': 'application/xml; charset=utf-8',
                    'Cache-Control': 'public, max-age=3600',
                },
            });
        }
    }

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

    // Simpan hanya bila konten berhasil dimuat.
    if (contents && contents.length > 0) {
        await saveSitemapCache(cacheKey, sitemap);
    }

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
        },
    });
};
