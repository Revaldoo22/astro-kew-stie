# 📋 Cara Menggunakan Brochure Request Form

## 🎯 Flow Baru

### **User Journey:**
1. User klik tombol **"Download Brosur"** (di mana saja di website)
2. Halaman scroll ke **form permintaan brosur**
3. User **isi form** (nama, email, no HP, dll)
4. User klik **"KIRIM"**
5. Data **tersimpan ke Google Sheets** ✅
6. **Popup sukses muncul** dengan tombol "Download Brosur" 🎉
7. User **klik tombol** untuk download/buka brosur
8. Brosur terbuka di tab baru

---

## 🔧 Implementasi

### **1. Komponen yang Tersedia**

#### **A. BrochureRequestForm.astro**
Form utama untuk permintaan brosur. Sudah include:
- ✅ Validasi form
- ✅ Integrasi Google Sheets
- ✅ Auto-open brosur setelah submit
- ✅ Success modal

**Lokasi:** `src/components/blog/BrochureRequestForm.astro`

#### **B. BrochureDownloadButton.astro**
Tombol yang bisa digunakan di halaman mana saja untuk trigger form.

**Lokasi:** `src/components/blog/BrochureDownloadButton.astro`

---

### **2. Cara Menggunakan di Halaman**

#### **Contoh: Halaman Blog**

```astro
---
import Layout from '@layouts/LayoutBlog.astro';
import BrochureRequestForm from '@components/blog/BrochureRequestForm.astro';
import BrochureDownloadButton from '@components/blog/BrochureDownloadButton.astro';
---

<Layout>
    <!-- Hero Section -->
    <section>
        <h1>Informasi PMB</h1>
        <p>Dapatkan brosur lengkap kami!</p>
        
        <!-- Tombol Download Brosur -->
        <BrochureDownloadButton />
    </section>

    <!-- Content -->
    <section>
        <!-- Konten lainnya -->
    </section>

    <!-- Form Section (akan di-scroll ke sini saat tombol diklik) -->
    <section>
        <BrochureRequestForm />
    </section>
</Layout>
```

---

### **3. Konfigurasi**

#### **A. URL Brosur**
Edit di `src/_globals/info.ts`:

```typescript
brosur: {
    pmb: "https://drive.google.com/drive/folders/YOUR_FOLDER_ID",
},
```

#### **B. Google Sheets API**
Edit di `src/_globals/info.ts`:

```typescript
googleSheetsApiUrl: "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec",
```

---

## 📊 Fitur

### **✅ Yang Sudah Ada:**

1. **Form Validation**
   - Nama minimal 5 karakter
   - Email format valid
   - No HP format Indonesia (08xxx atau 62xxx)
   - Alamat minimal 10 karakter
   - Jurusan & metode perkuliahan wajib dipilih

2. **Google Sheets Integration**
   - Data otomatis tersimpan ke spreadsheet
   - Timestamp otomatis (WIB)
   - Tracking URL (slug) - URL halaman saat form disubmit
   - Source identifier - hostname domain (e.g., "kew.stekom.ac.id")
   - Error handling lengkap

3. **Manual Brochure Download**
   - Popup sukses muncul setelah submit
   - User klik tombol untuk download brosur
   - Brosur terbuka di tab baru

4. **Loading States**
   - Button disabled saat submit
   - Loading spinner
   - Error messages

5. **Responsive Design**
   - Mobile-friendly
   - Dark mode support

---

## 🎨 Customization

### **Ubah Warna Tombol**

Edit di `BrochureDownloadButton.astro`:

```astro
<button
    class="... bg-gradient-to-r from-blue-500 to-blue-600 ..."
>
```

### **Ubah Teks Tombol**

```astro
<button>
    <svg>...</svg>
    Unduh Brosur Gratis  <!-- Ganti teks di sini -->
</button>
```

### **Ubah Pesan Success Modal**

Edit di `BrochureRequestForm.astro` (sekitar baris 244):

```astro
<p class="text-center text-gray-600 dark:text-gray-300 mb-6">
    Data Anda telah tersimpan. Brosur akan terbuka di tab baru.
    <!-- Ganti pesan di sini -->
</p>
```

---

## 🐛 Troubleshooting

### **Data Tidak Masuk ke Spreadsheet**

**Cek:**
1. URL Google Sheets API sudah benar di `info.ts`
2. Apps Script sudah di-deploy dengan versi terbaru
3. Lihat Execution log di Google Apps Script

### **Form Tidak Muncul Saat Tombol Diklik**

**Cek:**
- Pastikan `BrochureRequestForm` ada di halaman yang sama
- Pastikan ID form adalah `brochure-form`

---

## 📞 Support

Jika ada masalah, cek:
1. Browser console untuk error
2. Google Apps Script Execution log
3. Network tab untuk request yang gagal

---

## 🚀 Next Steps

Untuk meningkatkan konversi:
1. Tambahkan tombol download di berbagai halaman
2. Buat CTA yang menarik
3. A/B testing warna dan teks tombol
4. Tracking dengan Google Analytics
