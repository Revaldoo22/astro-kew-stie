export function hasValue(data: any): boolean {
  if (!data) return false;
  if (Array.isArray(data)) return data.length > 0;
  if (typeof data === "object") return Object.keys(data).length > 0;
  return true; // untuk string/number dsb.
}

export function cleanQuery(query: any): string {
  // Handle both string and object inputs
  const endpoint = typeof query === 'string' ? query : query?.endpoint || '';
  return endpoint.replaceAll("?", "").replaceAll("&", ":").replaceAll("=", ":");
}

/**
 * Validates and sanitizes a slug to prevent security issues and URL problems
 * @param slug - The slug to validate
 * @returns Object with isValid boolean and sanitized slug
 */
export function validateSlug(slug: string): { isValid: boolean; sanitizedSlug: string; errors: string[] } {
  const errors: string[] = [];
  let sanitizedSlug = slug;

  // Check if slug is empty
  if (!slug || slug.trim() === '') {
    errors.push('Slug tidak boleh kosong');
    return { isValid: false, sanitizedSlug: '', errors };
  }

  // Characters that can cause security issues or URL problems
  const dangerousChars = [
    // Path traversal characters
    '../', './', '..\\', '.\\',
    // Script injection characters
    '<', '>', '"', "'", '`',
    // Special characters that can break URLs
    ' ', '\t', '\n', '\r',
    // Characters that can cause encoding issues
    '&', '?', '#', '%', '+', '=',
    // Control characters
    '\x00', '\x01', '\x02', '\x03', '\x04', '\x05', '\x06', '\x07',
    '\x08', '\x0b', '\x0c', '\x0e', '\x0f', '\x10', '\x11', '\x12',
    '\x13', '\x14', '\x15', '\x16', '\x17', '\x18', '\x19', '\x1a',
    '\x1b', '\x1c', '\x1d', '\x1e', '\x1f', '\x7f'
  ];

  // Check for dangerous characters
  for (const char of dangerousChars) {
    if (slug.includes(char)) {
      errors.push(`Slug mengandung karakter berbahaya: "${char}"`);
    }
  }

  // Check for consecutive dots (potential path traversal)
  if (slug.includes('..')) {
    errors.push('Slug tidak boleh mengandung titik berturut-turut (..)');
  }

  // Check for leading/trailing dots
  if (slug.startsWith('.') || slug.endsWith('.')) {
    errors.push('Slug tidak boleh dimulai atau diakhiri dengan titik');
  }

  // Check for reserved filenames (Windows)
  const reservedNames = ['CON', 'PRN', 'AUX', 'NUL', 'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9', 'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'];
  if (reservedNames.includes(slug.toUpperCase())) {
    errors.push('Slug tidak boleh menggunakan nama file yang reserved');
  }

  // Check length
  if (slug.length > 255) {
    errors.push('Slug terlalu panjang (maksimal 255 karakter)');
  }

  // Sanitize the slug if there are errors but we want to provide a cleaned version
  if (errors.length > 0) {
    // Remove dangerous characters
    sanitizedSlug = slug
      .replace(/[<>"'`]/g, '') // Remove script injection chars
      .replace(/[&\?#%+=]/g, '') // Remove URL breaking chars
      .replace(/\.\./g, '') // Remove consecutive dots
      .replace(/^\.+|\.+$/g, '') // Remove leading/trailing dots
      .replace(/[\x00-\x1f\x7f]/g, '') // Remove control characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .toLowerCase()
      .trim();
  }

  return {
    isValid: errors.length === 0,
    sanitizedSlug,
    errors
  };
}

/**
 * Simple slug validation that returns boolean
 * @param slug - The slug to validate
 * @returns boolean indicating if slug is safe
 */
export function isSlugSafe(slug: string): boolean {
  return validateSlug(slug).isValid;
}

/**
 * Cleans HTML entities, tags, and unwanted characters from content
 * @param content - The content string to clean
 * @returns Cleaned content string
 */

export function cleanHTML(input: string): string {
  if (!input) return "";

  // Decode dua kali (mengatasi double-encoded entity)
  const decodeEntities = (str: string) =>
    str
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, " ")
      .replace(/&ndash;/g, "–")
      .replace(/&mdash;/g, "—")
      .replace(/&hellip;/g, "…")
      .replace(/&rsquo;/g, "’")
      .replace(/&lsquo;/g, "‘")
      .replace(/&ldquo;/g, "“")
      .replace(/&rdquo;/g, "”");

  let decoded = decodeEntities(decodeEntities(input));

  // Hapus style/script
  decoded = decoded
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");

  // Hapus bagian "sumber img" beserta link-nya
  decoded = decoded.replace(/sumber\s*img\s*:[\s\S]*?(?=<|$)/gi, "");

  // Hapus semua tag HTML
  decoded = decoded.replace(/<[^>]*>/g, " ");

  // Rapikan spasi
  decoded = decoded.replace(/\s+/g, " ").trim();

  return decoded;
}



/**
 * Formats numbers with K, M suffixes for better readability
 * @param num - The number to format
 * @returns Formatted number string (e.g., "1.2K", "5.3M")
 */
export function formatNumber(num: number | string): string {
  const number = typeof num === 'string' ? parseInt(num, 10) : num;
  
  if (isNaN(number) || number < 0) {
    return '0';
  }

  if (number < 1000) {
    return number.toString();
  }

  if (number < 1000000) {
    const k = number / 1000;
    return k % 1 === 0 ? `${k}K` : `${k.toFixed(1)}K`;
  }

  if (number < 1000000000) {
    const m = number / 1000000;
    return m % 1 === 0 ? `${m}M` : `${m.toFixed(1)}M`;
  }

  const b = number / 1000000000;
  return b % 1 === 0 ? `${b}B` : `${b.toFixed(1)}B`;
}

