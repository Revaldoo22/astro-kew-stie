# Fix: Modal Form Tidak Tertutup Setelah Modal Success Ditutup

## Problem
Ketika user mengisi form brosur dan berhasil submit:
1. Modal success muncul ✅
2. User menutup modal success ✅
3. **BUG**: Modal form yang ada di belakang tidak ikut tertutup ❌

Ini menyebabkan user harus menutup modal form secara manual setelah menutup modal success.

## Root Cause
Ada dua modal yang berbeda:
1. **Modal Form** (`brochure-form-modal`) - Modal yang berisi form permintaan brosur
2. **Modal Success** (`brochure-modal`) - Modal yang muncul setelah form berhasil disubmit

Ketika modal success ditutup, hanya modal success yang di-close, sedangkan modal form tetap terbuka di belakangnya.

## Solution Implemented

### 1. Auto-close Modal Form Saat Modal Success Muncul
**File**: `BrochureRequestForm.astro` (line 634-639)

Setelah form berhasil disubmit dan sebelum menampilkan modal success:
```javascript
// Close the parent form modal if it exists
const formModal = document.getElementById("brochure-form-modal");
if (formModal) {
    formModal.classList.add("hidden");
    document.body.style.overflow = ""; // Restore scroll
}

// Show success modal
modal.classList.remove("hidden");
```

### 2. Close Modal Form Saat Modal Success Ditutup
**File**: `BrochureRequestForm.astro` (line 674-683)

Dibuat fungsi `closeSuccessModal()` yang menutup kedua modal:
```javascript
const closeSuccessModal = () => {
    modal.classList.add("hidden");
    
    // Also close the parent form modal if it exists
    const formModal = document.getElementById("brochure-form-modal");
    if (formModal) {
        formModal.classList.add("hidden");
        document.body.style.overflow = ""; // Restore scroll
    }
};
```

Fungsi ini dipanggil saat:
- User klik tombol "Tutup"
- User klik backdrop (area di luar modal)
- User tekan tombol Escape

## Flow Sekarang

### Before Fix ❌
1. User klik "Download Brosur" → Modal form muncul
2. User isi form → Submit
3. Modal success muncul (modal form masih terbuka di belakang)
4. User tutup modal success → **Modal form masih terbuka** ❌

### After Fix ✅
1. User klik "Download Brosur" → Modal form muncul
2. User isi form → Submit
3. Modal form tertutup → Modal success muncul
4. User tutup modal success → **Semua modal tertutup** ✅

## Files Modified
- ✅ `src/components/blog/BrochureRequestForm.astro`

## Testing
Untuk memverifikasi fix:
1. Klik tombol "Download Brosur" di website
2. Isi form dengan data yang valid
3. Klik "KIRIM"
4. Verifikasi modal success muncul dan modal form tertutup
5. Tutup modal success dengan salah satu cara:
   - Klik tombol "Tutup"
   - Klik area di luar modal
   - Tekan tombol Escape
6. Verifikasi semua modal tertutup dan tidak ada modal yang tersisa

## Notes
- Fungsi juga memastikan `document.body.style.overflow` di-restore ke normal untuk mengembalikan scroll
- Fix ini bekerja untuk semua cara menutup modal (button, backdrop, escape key)
