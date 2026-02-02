# Integrasi Google Spreadsheet untuk Form Permintaan Brosur

## ✅ Yang Sudah Dikerjakan

### 1. **Konfigurasi di `info.ts`**
- ✅ Menambahkan `googleSheetsApiUrl` untuk menyimpan URL Google Apps Script
- ✅ URL default: `https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec`

### 2. **Update Form Component (`BrochureRequestForm.astro`)**
- ✅ Menambahkan loading state pada tombol submit
- ✅ Integrasi API call ke Google Sheets
- ✅ Error handling yang proper
- ✅ User feedback untuk success dan error
- ✅ Validasi form tetap berjalan sebelum submit

### 3. **Update Layout (`Layout.astro`)**
- ✅ Menambahkan meta tag untuk Google Sheets API URL
- ✅ URL dapat diakses oleh form component

### 4. **Dokumentasi Setup**
- ✅ Panduan lengkap setup Google Apps Script di `.docs/GOOGLE_SHEETS_SETUP.md`

---

## 📋 Langkah Selanjutnya (Yang Perlu Anda Lakukan)

### **STEP 1: Setup Google Spreadsheet**

1. **Buat Google Spreadsheet baru**
   - Nama: "Form Permintaan Brosur KEW"
   - Buat header di baris pertama:
     ```
     A1: Timestamp
     B1: Nama Lengkap
     C1: Email
     D1: No HP
     E1: Alamat Domisili
     F1: Pilihan Jurusan
     G1: Metode Perkuliahan
     ```

2. **Buat Google Apps Script**
   - Klik **Extensions** → **Apps Script**
   - Paste kode dari file `.docs/GOOGLE_SHEETS_SETUP.md` (bagian "Langkah 2")
   - Save script

3. **Deploy Apps Script**
   - Klik **Deploy** → **New deployment**
   - Pilih type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Klik **Deploy**
   - **COPY URL** yang muncul (format: `https://script.google.com/macros/s/XXXXXXXX/exec`)

### **STEP 2: Update Konfigurasi**

Buka file `src/_globals/info.ts` dan ganti URL:

```typescript
// Ganti YOUR_SCRIPT_ID dengan URL yang Anda copy dari Google Apps Script
googleSheetsApiUrl: "https://script.google.com/macros/s/XXXXXXXX/exec",
```

### **STEP 3: Test Form**

1. Jalankan aplikasi: `npm run dev`
2. Buka halaman yang ada form brosur
3. Isi form dan submit
4. Cek Google Spreadsheet - data harus masuk otomatis!

---

## 🎯 Fitur yang Sudah Terintegrasi

### **Loading State**
- Tombol berubah menjadi "Mengirim..." dengan spinner saat proses submit
- Tombol disabled selama proses berlangsung

### **Error Handling**
- Jika Google Sheets API belum dikonfigurasi, akan muncul pesan error
- Jika terjadi error saat mengirim, user akan diberi tahu
- Form tidak akan reset jika terjadi error

### **Success Flow**
- Data terkirim ke Google Sheets
- Modal success muncul
- Form direset
- User bisa download brosur

### **Data yang Disimpan**
Setiap submission akan menyimpan:
1. **Timestamp** (otomatis, format WIB)
2. **Nama Lengkap**
3. **Email**
4. **No HP**
5. **Alamat Domisili**
6. **Pilihan Jurusan**
7. **Metode Perkuliahan**

---

## 🔧 Troubleshooting

### **Jika data tidak masuk ke spreadsheet:**
1. Pastikan Apps Script sudah di-deploy dengan benar
2. Cek "Who has access" harus "Anyone"
3. Pastikan URL di `info.ts` sudah benar
4. Cek log di Apps Script (tab "Executions")

### **Jika muncul error "Konfigurasi Google Sheets belum diatur":**
- Pastikan sudah mengganti `YOUR_SCRIPT_ID` dengan URL yang benar di `info.ts`

### **Untuk update script di kemudian hari:**
1. Edit kode di Apps Script
2. Klik **Deploy** → **Manage deployments**
3. Klik icon edit (✏️)
4. Ubah Version menjadi "New version"
5. Klik **Deploy**

---

## 📁 File yang Dimodifikasi

1. ✅ `src/_globals/info.ts` - Konfigurasi API URL
2. ✅ `src/components/blog/BrochureRequestForm.astro` - Form dengan integrasi API
3. ✅ `src/layouts/Layout.astro` - Meta tag untuk API URL
4. ✅ `.docs/GOOGLE_SHEETS_SETUP.md` - Panduan setup lengkap

---

## 🎉 Selesai!

Setelah Anda menyelesaikan STEP 1-3 di atas, form akan otomatis menyimpan semua submission ke Google Spreadsheet Anda!

**Catatan:** Jangan lupa untuk menjaga kerahasiaan URL Google Apps Script Anda, karena siapa saja yang memiliki URL tersebut bisa mengirim data ke spreadsheet Anda.
