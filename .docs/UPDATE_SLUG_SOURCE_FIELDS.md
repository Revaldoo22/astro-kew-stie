# Update: Menambahkan Slug dan Source ke Form Brosur

## Perubahan yang Ditambahkan

Menambahkan dua field baru yang dikirim ke Google Sheets saat form brosur disubmit:

### 1. **Slug** (URL Halaman)
- **Tipe**: String
- **Nilai**: URL lengkap halaman saat form disubmit
- **Contoh**: `https://kew.stekom.ac.id/` atau `https://kew.stekom.ac.id/program-studi`
- **Kegunaan**: Tracking dari halaman mana user mengisi form

### 2. **Source** (Sumber)
- **Tipe**: String
- **Nilai**: Hostname dari domain (dinamis)
- **Contoh**: `"kew.stekom.ac.id"`, `"localhost"`, `"www.example.com"`
- **Kegunaan**: Identifikasi domain sumber data, berguna jika form digunakan di multiple domain

## Implementasi

### File: `BrochureRequestForm.astro`

```javascript
// Get current URL for slug and hostname for source
const currentUrl = window.location.href;
const hostname = window.location.hostname;

// Convert data to URL parameters for Google Apps Script
const params = new URLSearchParams();
params.append("fullName", data.fullName as string);
params.append("email", data.email as string);
params.append("phone", data.phone as string);
params.append("address", data.address as string);
params.append("studyProgram", data.studyProgram as string);
params.append("studyMethod", data.studyMethod as string);
params.append("slug", currentUrl);        // ✅ NEW
params.append("source", hostname);        // ✅ NEW (hostname, bukan hardcoded)
```

## Data yang Dikirim ke Google Sheets

Sekarang form mengirim 8 field:

1. **fullName** - Nama lengkap user
2. **email** - Email user
3. **phone** - Nomor HP user
4. **address** - Alamat domisili user
5. **studyProgram** - Jurusan yang dipilih
6. **studyMethod** - Metode perkuliahan yang dipilih
7. **slug** - URL halaman saat form disubmit ✅ NEW
8. **source** - Hostname domain (e.g., "kew.stekom.ac.id") ✅ NEW

## Update Google Apps Script

Pastikan Google Apps Script Anda sudah diupdate untuk menerima parameter `slug` dan `source`:

```javascript
function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  const timestamp = new Date();
  const fullName = e.parameter.fullName || '';
  const email = e.parameter.email || '';
  const phone = e.parameter.phone || '';
  const address = e.parameter.address || '';
  const studyProgram = e.parameter.studyProgram || '';
  const studyMethod = e.parameter.studyMethod || '';
  const slug = e.parameter.slug || '';           // ✅ NEW
  const source = e.parameter.source || '';       // ✅ NEW
  
  sheet.appendRow([
    timestamp,
    fullName,
    email,
    phone,
    address,
    studyProgram,
    studyMethod,
    slug,      // ✅ NEW
    source     // ✅ NEW
  ]);
  
  return ContentService.createTextOutput('Success');
}
```

## Struktur Google Sheets

Update header kolom di Google Sheets:

| Timestamp | Nama Lengkap | Email | No HP | Alamat | Jurusan | Metode | Slug | Source |
|-----------|--------------|-------|-------|--------|---------|--------|------|--------|
| ... | ... | ... | ... | ... | ... | ... | ... | ... |

## Manfaat

### 1. **Tracking Konversi per Halaman**
Dengan field `slug`, Anda bisa menganalisis:
- Halaman mana yang paling banyak menghasilkan konversi
- Apakah homepage lebih efektif dari halaman program studi
- Landing page mana yang perlu dioptimasi

### 2. **Multi-Domain Tracking**
Dengan field `source` (hostname), Anda bisa:
- Membedakan data dari berbagai domain/subdomain
- Tracking jika form yang sama digunakan di multiple website
- Filter data berdasarkan domain tertentu
- Identifikasi sumber traffic secara otomatis

## Contoh Analisis

### Query untuk melihat konversi per halaman:
```sql
SELECT slug, COUNT(*) as total_submissions
FROM brochure_requests
WHERE source = 'kew.stekom.ac.id'
GROUP BY slug
ORDER BY total_submissions DESC
```

### Top 3 halaman dengan konversi tertinggi:
```
https://kew.stekom.ac.id/                    → 150 submissions
https://kew.stekom.ac.id/program-studi       → 89 submissions
https://kew.stekom.ac.id/biaya               → 67 submissions
```

## Files Modified
- ✅ `src/components/blog/BrochureRequestForm.astro`
- ✅ `.docs/BROCHURE_FORM_USAGE.md`

## Testing
1. Buka website di berbagai halaman
2. Isi dan submit form brosur
3. Cek Google Sheets
4. Verifikasi kolom `slug` berisi URL yang benar
5. Verifikasi kolom `source` berisi hostname (e.g., "kew.stekom.ac.id" atau "localhost" jika testing lokal)

## Notes
- Field `slug` akan selalu berisi URL lengkap termasuk query parameters jika ada
- Field `source` menggunakan `window.location.hostname` untuk mendapatkan domain secara dinamis
- Saat testing di localhost, `source` akan berisi "localhost"
- Saat production, `source` akan berisi "kew.stekom.ac.id"
- Pastikan Google Apps Script sudah diupdate sebelum testing
