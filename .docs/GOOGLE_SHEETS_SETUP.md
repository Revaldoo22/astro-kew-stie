# Setup Google Spreadsheet untuk Form Brosur

## Langkah 1: Buat Google Spreadsheet

1. Buka [Google Sheets](https://sheets.google.com)
2. Buat spreadsheet baru dengan nama: **"Form Permintaan Brosur KEW"**
3. Di Sheet1, buat header di baris pertama:
   - A1: `Timestamp`
   - B1: `Nama Lengkap`
   - C1: `Email`
   - D1: `No HP`
   - E1: `Alamat Domisili`
   - F1: `Pilihan Jurusan`
   - G1: `Metode Perkuliahan`

## Langkah 2: Buat Google Apps Script

1. Di spreadsheet, klik **Extensions** → **Apps Script**
2. Hapus kode default dan paste kode berikut:

```javascript
function doPost(e) {
  try {
    Logger.log('POST request received');
    Logger.log('Request data: ' + JSON.stringify(e));
    
    // Get the active spreadsheet and specify sheet name
    // GANTI 'Sheet1' dengan nama sheet Anda jika berbeda
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
    
    if (!sheet) {
      throw new Error('Sheet not found! Pastikan nama sheet adalah "Sheet1" atau ganti dengan nama yang benar');
    }
    
    Logger.log('Sheet name: ' + sheet.getName());
    
    // Check if postData exists
    if (!e || !e.postData || !e.postData.contents) {
      Logger.log('No postData found');
      throw new Error('No data received');
    }
    
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    Logger.log('Parsed data: ' + JSON.stringify(data));
    
    // Get current timestamp in WIB (GMT+7)
    const timestamp = Utilities.formatDate(
      new Date(), 
      "GMT+7", 
      "yyyy-MM-dd HH:mm:ss"
    );
    
    // Prepare row data
    const rowData = [
      timestamp,
      data.fullName || '',
      data.email || '',
      data.phone || '',
      data.address || '',
      data.studyProgram || '',
      data.studyMethod || ''
    ];
    
    Logger.log('Row data to append: ' + JSON.stringify(rowData));
    
    // Append the data to the sheet
    sheet.appendRow(rowData);
    
    Logger.log('Data appended successfully');
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Data berhasil disimpan',
        timestamp: timestamp
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('Error occurred: ' + error.toString());
    
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle GET requests with URL parameters (from website form)
function doGet(e) {
  try {
    Logger.log('GET request received');
    Logger.log('Parameters: ' + JSON.stringify(e.parameter));
    
    // Check if this is a form submission (has parameters)
    if (e.parameter && e.parameter.fullName) {
      // Get the active spreadsheet and specify sheet name
      // GANTI 'Sheet1' dengan nama sheet Anda jika berbeda
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
      
      if (!sheet) {
        throw new Error('Sheet not found! Pastikan nama sheet adalah "Sheet1" atau ganti dengan nama yang benar');
      }
      
      Logger.log('Sheet name: ' + sheet.getName());
      
      // Get current timestamp in WIB (GMT+7)
      const timestamp = Utilities.formatDate(
        new Date(), 
        "GMT+7", 
        "yyyy-MM-dd HH:mm:ss"
      );
      
      // Prepare row data from URL parameters
      const rowData = [
        timestamp,
        e.parameter.fullName || '',
        e.parameter.email || '',
        e.parameter.phone || '',
        e.parameter.address || '',
        e.parameter.studyProgram || '',
        e.parameter.studyMethod || ''
      ];
      
      Logger.log('Row data to append: ' + JSON.stringify(rowData));
      
      // Append the data to the sheet
      sheet.appendRow(rowData);
      
      Logger.log('Data appended successfully from GET request');
      
      // Return success response
      return ContentService
        .createTextOutput(JSON.stringify({
          status: 'success',
          message: 'Data berhasil disimpan',
          timestamp: timestamp
        }))
        .setMimeType(ContentService.MimeType.JSON);
    } else {
      // Just a test ping
      Logger.log('Test ping received');
      return ContentService
        .createTextOutput(JSON.stringify({
          status: 'ok',
          message: 'API is working',
          timestamp: new Date().toISOString()
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
  } catch (error) {
    Logger.log('Error in doGet: ' + error.toString());
    
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Manual test function - run this to test manually
function testManualSubmit() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        fullName: 'Test User',
        email: 'test@example.com',
        phone: '081234567890',
        address: 'Jl. Test No. 123',
        studyProgram: 'S1 Teknik Informatika (S.Kom.)',
        studyMethod: 'Full Online'
      })
    }
  };
  
  const result = doPost(testData);
  Logger.log('Test result: ' + result.getContent());
}

// Test GET request with parameters
function testGetRequest() {
  const testData = {
    parameter: {
      fullName: 'Test User GET',
      email: 'testget@example.com',
      phone: '081234567890',
      address: 'Jl. Test GET No. 456',
      studyProgram: 'S1 Sistem Informasi (S.Kom.)',
      studyMethod: 'Hybrid'
    }
  };
  
  const result = doGet(testData);
  Logger.log('Test GET result: ' + result.getContent());
}
```

## Langkah 3: Deploy Apps Script

1. Klik **Deploy** → **New deployment**
2. Klik icon ⚙️ (gear) di sebelah "Select type"
3. Pilih **Web app**
4. Atur konfigurasi:
   - **Description**: Form Brosur API
   - **Execute as**: Me (email Anda)
   - **Who has access**: Anyone
5. Klik **Deploy**
6. **PENTING**: Copy **Web app URL** yang muncul
   - Format: `https://script.google.com/macros/s/XXXXXXXX/exec`
7. Klik **Authorize access** dan izinkan akses

## Langkah 4: Test API (Optional)

Buka URL yang Anda copy di browser. Jika berhasil, akan muncul:
```json
{"status":"ok","message":"API is working"}
```

## Langkah 5: Salin URL ke Konfigurasi

Setelah mendapat URL, salin dan simpan untuk digunakan di konfigurasi aplikasi.

---

## Troubleshooting

### Jika data tidak masuk:
1. Pastikan Apps Script sudah di-deploy dengan "Who has access: Anyone"
2. Cek log di Apps Script: **Executions** tab
3. Pastikan header spreadsheet sesuai dengan urutan di langkah 1

### Jika error "Authorization required":
1. Kembali ke Apps Script
2. Deploy ulang dengan **New deployment**
3. Pastikan pilih "Execute as: Me"

### Untuk update script:
1. Edit kode di Apps Script
2. Klik **Deploy** → **Manage deployments**
3. Klik icon ✏️ (edit) di deployment yang aktif
4. Ubah **Version** menjadi "New version"
5. Klik **Deploy**
