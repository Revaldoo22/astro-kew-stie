# ✅ SOLUSI: Data Tidak Masuk ke Spreadsheet

## 🎯 Masalah yang Ditemukan

**Root Cause:** Mode `no-cors` di fetch request membuat browser tidak bisa mengirim data JSON dengan benar ke Google Apps Script.

**Solusi:** Mengubah dari POST dengan JSON body menjadi GET dengan URL parameters.

---

## 📝 Yang Sudah Diperbaiki

### 1. **Frontend (`BrochureRequestForm.astro`)** ✅
- ❌ Sebelumnya: POST request dengan `no-cors` + JSON body
- ✅ Sekarang: GET request dengan URL parameters
- Data dikirim sebagai query string yang lebih reliable

### 2. **Backend (`Google Apps Script`)** ✅
- ✅ Ditambahkan handler untuk GET request dengan parameters
- ✅ Fungsi `doGet` sekarang bisa menerima data form
- ✅ Tetap support POST untuk backward compatibility

### 3. **Konfigurasi (`info.ts`)** ✅
- ✅ URL sudah diupdate dengan deployment URL yang benar

---

## 🚀 Langkah yang Perlu Anda Lakukan SEKARANG

### **STEP 1: Update Google Apps Script** (PENTING!)

1. Buka Google Apps Script Anda
2. **HAPUS SEMUA KODE** yang ada
3. **COPY kode baru** dari `.docs/GOOGLE_SHEETS_SETUP.md` (sudah saya update)
4. **SAVE** (Ctrl+S)

### **STEP 2: Test di Apps Script**

Sebelum deploy, test dulu:

1. Pilih function **`testGetRequest`** dari dropdown
2. Klik **Run** ▶️
3. Cek spreadsheet - harus ada data "Test User GET"

Jika berhasil, lanjut ke STEP 3.

### **STEP 3: Deploy Ulang**

1. **Deploy** → **Manage deployments**
2. Klik **✏️ Edit** di deployment yang aktif
3. **Version** → **"New version"**
4. Description: "Support GET requests with URL parameters"
5. **Deploy**

### **STEP 4: Test dari Website**

1. Refresh halaman website (hard refresh: Ctrl+Shift+R)
2. Buka browser console (F12)
3. Isi form dan submit
4. Lihat console log - harus ada:
   ```
   Sending to Google Sheets: https://script.google.com/...
   Data to send: {fullName: "...", ...}
   Request URL: https://script.google.com/...?fullName=...&email=...
   Response received: Response {...}
   Data sent to Google Sheets successfully
   ```
5. **CEK SPREADSHEET** - data harus masuk! 🎉

---

## 🔍 Cara Kerja Baru

### **Sebelumnya (TIDAK BEKERJA):**
```javascript
fetch(apiUrl, {
  method: "POST",
  mode: "no-cors",  // ❌ Ini yang bikin masalah
  body: JSON.stringify(data)
})
```

### **Sekarang (BEKERJA):**
```javascript
const params = new URLSearchParams();
params.append('fullName', data.fullName);
// ... dst

const url = `${apiUrl}?${params.toString()}`;
fetch(url, {
  method: "GET",  // ✅ GET request lebih reliable
  redirect: "follow"
})
```

---

## 📊 Debugging

Jika masih belum berhasil, cek:

### **1. Browser Console**
Harus ada log:
- ✅ "Form submitted!"
- ✅ "Data to send: {...}"
- ✅ "Request URL: https://..."
- ✅ "Data sent to Google Sheets successfully"

### **2. Google Apps Script Executions**
1. Buka Apps Script
2. Klik **Executions** (⚡ icon)
3. Klik execution terakhir
4. Harus ada log:
   ```
   GET request received
   Parameters: {fullName: "...", email: "...", ...}
   Sheet name: Sheet1
   Row data to append: [...]
   Data appended successfully from GET request
   ```

### **3. Spreadsheet**
- Cek apakah ada baris baru dengan timestamp terbaru
- Pastikan data sesuai dengan yang diinput

---

## ✨ Kenapa Sekarang Bekerja?

1. **GET request** tidak terblokir CORS seperti POST
2. **URL parameters** lebih sederhana dan reliable
3. **No need for no-cors mode** yang membatasi functionality
4. **Google Apps Script** lebih mudah handle GET parameters

---

## 📞 Jika Masih Bermasalah

Kirimkan screenshot:
1. Browser console saat submit form
2. Google Apps Script Executions log
3. Spreadsheet (untuk cek apakah data masuk)

Dengan info ini saya bisa bantu debug lebih lanjut!
