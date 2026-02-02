# Troubleshooting: Data Tidak Masuk ke Google Spreadsheet

## 🔴 Masalah: Eksekusi berjalan tapi data tidak masuk

Jika Anda melihat log seperti ini di Google Apps Script:
```
14.34.25 Peringatan Eksekusi dimulai
14.34.25 Peringatan Eksekusi selesai
```

Tapi tidak ada data yang masuk, ikuti langkah berikut:

---

## ✅ Solusi Step-by-Step

### **STEP 1: Update Google Apps Script**

1. Buka Google Apps Script Anda
2. **Hapus semua kode** yang ada
3. **Copy-paste** kode baru dari `.docs/GOOGLE_SHEETS_SETUP.md` (yang sudah saya update dengan logging)
4. **Save** (Ctrl+S atau Cmd+S)

### **STEP 2: Test Manual di Apps Script**

Sebelum deploy ulang, test dulu di Apps Script:

1. Di Apps Script, pilih function **`testManualSubmit`** dari dropdown
2. Klik **Run** (▶️)
3. Lihat **Execution log** (View → Logs atau Ctrl+Enter)
4. **Cek spreadsheet** - harus ada data test yang masuk

Jika data test masuk, lanjut ke STEP 3. Jika tidak, ada masalah di spreadsheet/permission.

### **STEP 3: Deploy Ulang**

Karena Anda sudah pernah deploy, kita perlu deploy versi baru:

1. Klik **Deploy** → **Manage deployments**
2. Klik icon **✏️ (Edit)** di deployment yang aktif
3. Ubah **Version** menjadi **"New version"**
4. Tambahkan description: "Added logging and error handling"
5. Klik **Deploy**
6. **COPY URL** yang sama (atau yang baru jika berubah)

### **STEP 4: Update URL di info.ts (Jika Perlu)**

Buka `src/_globals/info.ts` dan pastikan URL sudah benar:

```typescript
googleSheetsApiUrl: "https://script.google.com/macros/s/AKfycbyAco-NbAvvqBTxi1icvElf6Nw9b78iMhlgI2OUjNrKYLAU5yTgWvfckpylGMU0Npk3xg/exec",
```

### **STEP 5: Test dari Website**

1. Buka website Anda (localhost atau production)
2. Buka **Browser Console** (F12 → Console tab)
3. Isi form dan submit
4. Lihat log di console - harus ada:
   ```
   Form submitted!
   Form data: {fullName: "...", email: "...", ...}
   Sending to Google Sheets: https://script.google.com/...
   Data sent to Google Sheets successfully
   ```

### **STEP 6: Cek Log di Google Apps Script**

Setelah submit dari website:

1. Kembali ke Google Apps Script
2. Klik **Executions** (icon ⚡ di sidebar kiri)
3. Klik execution yang baru saja berjalan
4. Lihat **detailed logs** - harus ada:
   ```
   POST request received
   Request data: {...}
   Sheet name: Sheet1
   Parsed data: {...}
   Row data to append: [...]
   Data appended successfully
   ```

---

## 🔍 Kemungkinan Masalah & Solusi

### **Problem 1: "No postData found"**
**Penyebab:** Request tidak mengirim data dengan benar

**Solusi:**
- Pastikan mode fetch adalah `no-cors`
- Cek apakah form data ter-serialize dengan benar

### **Problem 2: "Permission denied"**
**Penyebab:** Apps Script tidak punya akses ke spreadsheet

**Solusi:**
1. Di Apps Script, klik **Run** pada function `testManualSubmit`
2. Akan muncul popup permission - klik **Review permissions**
3. Pilih akun Google Anda
4. Klik **Advanced** → **Go to [Project Name] (unsafe)**
5. Klik **Allow**

### **Problem 3: Data masuk tapi di sheet yang salah**
**Penyebab:** Apps Script menulis ke sheet yang salah

**Solusi:**
Ubah kode di Apps Script untuk specify sheet name:
```javascript
const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
// Ganti 'Sheet1' dengan nama sheet Anda
```

### **Problem 4: CORS Error di Browser Console**
**Penyebab:** Normal untuk `no-cors` mode

**Solusi:**
- Ini normal, abaikan saja
- Yang penting tidak ada error lain
- Cek log di Apps Script untuk memastikan data masuk

---

## 🧪 Test Alternatif: Gunakan Postman/cURL

Jika masih tidak berhasil, test langsung dengan Postman atau cURL:

### **Menggunakan cURL:**
```bash
curl -X POST "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "phone": "081234567890",
    "address": "Jl. Test No. 123",
    "studyProgram": "S1 Teknik Informatika (S.Kom.)",
    "studyMethod": "Full Online"
  }'
```

Jika test ini berhasil, berarti masalah ada di frontend.

---

## 📞 Jika Masih Belum Berhasil

Kirimkan informasi berikut:

1. **Screenshot Execution log** dari Google Apps Script
2. **Screenshot Browser Console** saat submit form
3. **Screenshot Spreadsheet** (untuk memastikan header sudah benar)
4. **URL Apps Script** yang Anda gunakan

Dengan informasi ini saya bisa bantu debug lebih lanjut!
