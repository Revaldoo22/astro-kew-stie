import { promises as fs } from "node:fs";
import path from "node:path";
import os from "node:os";

/**
 * Cache sitemap sederhana berbasis file.
 *
 * Tujuan: ketika API SEO Master lambat/down, endpoint sitemap tetap bisa
 * menyajikan versi XML terakhir yang sukses (bukan sitemap kosong), sehingga
 * Google tetap menerima daftar URL lengkap.
 *
 * Disimpan di direktori temp OS agar tidak bergantung pada writability folder
 * project di server produksi.
 */

const CACHE_DIR = path.join(os.tmpdir(), "kew-sitemap-cache");

function cacheFile(key: string): string {
  // key hanya dipakai untuk nama file; batasi ke karakter aman
  const safe = key.replace(/[^a-z0-9_-]/gi, "_");
  return path.join(CACHE_DIR, `${safe}.xml`);
}

/** Simpan XML sitemap yang berhasil dibuat. Kegagalan tulis di-swallow (best-effort). */
export async function saveSitemapCache(key: string, xml: string): Promise<void> {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
    await fs.writeFile(cacheFile(key), xml, "utf-8");
  } catch {
    // best-effort; jangan sampai gagal cache menggagalkan response
  }
}

/** Ambil XML sitemap dari cache. Return null jika belum ada. */
export async function readSitemapCache(key: string): Promise<string | null> {
  try {
    return await fs.readFile(cacheFile(key), "utf-8");
  } catch {
    return null;
  }
}
