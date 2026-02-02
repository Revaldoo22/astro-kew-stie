# QUICK FIX: Specify Sheet Name

Jika data tidak muncul, kemungkinan Apps Script menulis ke sheet yang salah.

## UPDATE KODE APPS SCRIPT:

Buka Google Apps Script dan ganti **KEDUA function** (doPost dan doGet) dengan versi ini:

### 1. Update doPost:

Cari baris ini di function `doPost`:
```javascript
const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
```

Ganti dengan (sesuaikan nama sheet Anda):
```javascript
const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
// GANTI 'Sheet1' dengan nama sheet Anda yang sebenarnya
```

### 2. Update doGet:

Cari baris ini di function `doGet`:
```javascript
const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
```

Ganti dengan (sesuaikan nama sheet Anda):
```javascript
const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
// GANTI 'Sheet1' dengan nama sheet Anda yang sebenarnya
```

---

## ATAU: Gunakan Spreadsheet ID Spesifik

Jika masih tidak berhasil, gunakan Spreadsheet ID:

### Cara dapat Spreadsheet ID:
1. Buka spreadsheet Anda
2. Lihat URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
3. Copy `SPREADSHEET_ID` dari URL

### Update kode:

```javascript
// Di AWAL function doPost dan doGet, ganti:
const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

// Dengan:
const ss = SpreadsheetApp.openById('PASTE_SPREADSHEET_ID_DISINI');
const sheet = ss.getSheetByName('Sheet1'); // Ganti Sheet1 dengan nama sheet Anda
```

---

## SETELAH UPDATE:

1. **Save** (Ctrl+S)
2. **Test** dengan `testGetRequest` → Run
3. **Cek spreadsheet** - harus ada data
4. **Deploy ulang** (Deploy → Manage deployments → Edit → New version)
5. **Test dari website**

---

## DEBUGGING:

Jika masih tidak berhasil, kirimkan:
1. **Screenshot Execution log** dari Apps Script
2. **Nama sheet** di spreadsheet Anda (tab di bawah)
3. **Apakah `testGetRequest` berhasil** menambah data?
