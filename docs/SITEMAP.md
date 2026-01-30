# Sitemap Generation

## Overview
Fungsi `fetchAllContentsForSitemap()` telah ditambahkan ke `BlogApi` untuk mengambil semua content dari semua project yang ada di organisasi.

## Perbedaan dengan `fetchProjects()`

### `fetchProjects()` - Untuk Display Blog
- Hanya mengambil content dari **1 project** (latest atau first)
- Menggunakan pagination (default 10 items per page)
- Digunakan untuk menampilkan blog di halaman utama

### `fetchAllContentsForSitemap()` - Untuk Sitemap
- Mengambil content dari **SEMUA project**
- Mengambil semua halaman (100 items per page untuk efisiensi)
- Menggabungkan semua content dari semua project
- Mengurutkan berdasarkan `createdAt` (terbaru dulu)
- Digunakan untuk generate sitemap.xml

## Cara Penggunaan

### Di Sitemap (sudah dibuat di `src/pages/sitemap.xml.ts`)

```typescript
import { BlogApi } from "@/services/blogApi";

const blogApi = new BlogApi();
const allContents = await blogApi.fetchAllContentsForSitemap();

// allContents berisi array semua content dari semua project
// Format: ProjectContent[]
```

### Di File Lain (jika diperlukan)

```typescript
import { BlogApi } from "@/services/blogApi";

const blogApi = new BlogApi();

// Fetch semua content (published)
const allContents = await blogApi.fetchAllContentsForSitemap();

// Atau dengan status custom
const draftContents = await blogApi.fetchAllContentsForSitemap("draft");
```

## Response Format

```typescript
ProjectContent[] | null

// Contoh:
[
  {
    id: "content-id-1",
    title: "Article Title 1",
    content: "...",
    slug: "article-slug-1",
    metaDescription: "...",
    tags: "tag1,tag2",
    thumbnailUrl: "https://...",
    publishStatus: "published",
    createdAt: "2024-01-01T00:00:00Z"
  },
  // ... more contents from all projects
]
```

## Features

✅ Mengambil content dari **semua project** di organisasi  
✅ Pagination otomatis (100 items per request)  
✅ Error handling per project (jika 1 project error, lanjut ke project berikutnya)  
✅ Rate limit handling  
✅ Sorting otomatis berdasarkan tanggal (terbaru dulu)  
✅ Logging detail untuk debugging  

## Sitemap Access

Setelah deploy, sitemap dapat diakses di:
- **Local**: `http://localhost:4321/sitemap.xml`
- **Production**: `https://kew.stekom.ac.id/sitemap.xml`

## Submit ke Google Search Console

1. Buka [Google Search Console](https://search.google.com/search-console)
2. Pilih property website Anda
3. Klik **Sitemaps** di menu kiri
4. Masukkan URL: `https://kew.stekom.ac.id/sitemap.xml`
5. Klik **Submit**

## Cache

Sitemap di-cache selama 1 jam untuk performa. Jika ada content baru dan ingin update sitemap segera, tunggu 1 jam atau clear cache.
