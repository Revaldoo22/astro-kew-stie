# ✅ KODE SUDAH DIUPDATE!

Saya sudah update semua kode Apps Script untuk **explicitly specify sheet name** = `'Sheet1'`

---

## 🚀 LANGKAH ANDA SEKARANG:

### **1. Copy Kode Terbaru**
Buka file: **`.docs/COPY_THIS_TO_APPS_SCRIPT.md`**

Kode sudah diupdate dengan:
```javascript
const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
```

### **2. Paste ke Google Apps Script**
1. Buka Google Apps Script
2. **HAPUS SEMUA kode** yang ada
3. **COPY kode** dari `.docs/COPY_THIS_TO_APPS_SCRIPT.md`
4. **PASTE** ke Apps Script
5. **PENTING:** Jika nama sheet Anda **BUKAN** "Sheet1", ganti di 2 tempat:
   - Di function `doPost` (sekitar baris 8)
   - Di function `doGet` (sekitar baris 83)
   
   Ganti:
   ```javascript
   .getSheetByName('Sheet1')
   ```
   
   Dengan nama sheet Anda, contoh:
   ```javascript
   .getSheetByName('Form Brosur')
   ```

### **3. Save**
Tekan **Ctrl+S** atau klik **Save**

### **4. Test di Apps Script**
1. Pilih function **`testGetRequest`** dari dropdown
2. Klik **Run** ▶️
3. **CEK SPREADSHEET** - harus ada baris baru "Test User GET"

**Apakah berhasil?**
- ✅ **YA** → Lanjut ke step 5
- ❌ **TIDAK** → Lihat error di log, kemungkinan nama sheet salah

### **5. Deploy Ulang**
1. Klik **Deploy** → **Manage deployments**
2. Klik **✏️ Edit** di deployment yang aktif
3. **Version** → **"New version"**
4. Description: "Fix sheet name specification"
5. Klik **Deploy**

### **6. Test dari Website**
1. **Hard refresh** browser (Ctrl+Shift+R)
2. Isi form dan submit
3. **CEK SPREADSHEET** - DATA HARUS MASUK! 🎉

---

## 🔍 Jika Masih Tidak Masuk:

### **Cek Nama Sheet:**
1. Buka spreadsheet Anda
2. Lihat **tab di bawah** - apa nama sheetnya?
3. Jika **BUKAN** "Sheet1", update kode Apps Script sesuai nama yang benar

### **Cek Execution Log:**
1. Buka Apps Script → **Executions** (⚡)
2. Klik execution terakhir
3. Lihat log - harus ada:
   ```
   GET request received
   Parameters: {...}
   Sheet name: Sheet1
   Row data to append: [...]
   Data appended successfully from GET request
   ```

### **Jika Ada Error "Sheet not found":**
Berarti nama sheet Anda bukan "Sheet1". Ganti di kode dengan nama yang benar!

---

## 📊 Perubahan yang Dilakukan:

### **Sebelumnya:**
```javascript
const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
```
❌ Ini mengambil sheet yang sedang aktif/terbuka, bisa salah sheet!

### **Sekarang:**
```javascript
const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');

if (!sheet) {
  throw new Error('Sheet not found!');
}
```
✅ Ini explicitly specify sheet "Sheet1", lebih reliable!

---

## 🎯 Kesimpulan:

File yang sudah diupdate:
- ✅ `.docs/COPY_THIS_TO_APPS_SCRIPT.md`
- ✅ `.docs/GOOGLE_SHEETS_SETUP.md`

**Anda tinggal:**
1. Copy kode dari `.docs/COPY_THIS_TO_APPS_SCRIPT.md`
2. Paste ke Google Apps Script (ganti semua kode lama)
3. Sesuaikan nama sheet jika perlu
4. Save → Test → Deploy → Test dari website

**DATA PASTI MASUK!** 🚀
