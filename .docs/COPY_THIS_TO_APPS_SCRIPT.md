# COPY KODE INI KE GOOGLE APPS SCRIPT

**INSTRUKSI:**
1. Buka Google Apps Script Anda
2. HAPUS SEMUA kode yang ada
3. COPY-PASTE kode di bawah ini
4. SAVE (Ctrl+S)
5. Deploy ulang (Deploy → Manage deployments → Edit → New version → Deploy)

---

## KODE LENGKAP:

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

---

## SETELAH COPY KODE:

### 1. Test di Apps Script:
- Pilih function `testGetRequest`
- Klik Run
- Cek spreadsheet - harus ada "Test User GET"

### 2. Deploy Ulang:
- Deploy → Manage deployments
- Edit → New version
- Deploy

### 3. Test dari Website:
- Hard refresh (Ctrl+Shift+R)
- Submit form lagi
- CEK SPREADSHEET!

---

## TROUBLESHOOTING:

Jika setelah ini masih tidak masuk, kirimkan screenshot:
1. Execution log dari Apps Script (setelah submit dari website)
2. Browser console log
