# Fix: Modal Success Tidak Muncul Setelah Submit Form

## Problem
Setelah user mengisi form brosur dan submit:
1. Form berhasil terkirim ke Google Sheets ✅
2. Modal form tertutup ✅
3. **BUG**: Modal success (download brosur) tidak muncul ❌

## Root Cause

Ada **2 masalah**:

### 1. **Function Override**
Fungsi `window.openBrochureFormModal()` didefinisikan di 2 tempat:

**A. Di `BrochureRequestFormModal.astro` (BENAR):**
```javascript
window.openBrochureFormModal = () => {
    // Membuka modal FORM
    const formModal = document.getElementById("brochure-form-modal");
    formModal.classList.remove("hidden");
};
```

**B. Di `BrochureRequestForm.astro` (SALAH):**
```javascript
window.openBrochureFormModal = () => {
    // Membuka modal SUCCESS (harusnya bukan ini!)
    const modal = document.getElementById("brochure-modal");
    modal.classList.remove("hidden");
};
```

Karena `BrochureRequestForm` di-load setelah `BrochureRequestFormModal`, fungsi yang **SALAH** meng-override fungsi yang **BENAR**!

### 2. **Z-Index Issue**
Modal success (`brochure-modal`) memiliki `z-index: 50`, sama dengan modal form (`brochure-form-modal`). Ini bisa menyebabkan modal success tertutup oleh modal form.

## Solution Implemented

### 1. **Hapus Function Override**
**File**: `BrochureRequestForm.astro`

Menghapus definisi `window.openBrochureFormModal()` yang salah dari `BrochureRequestForm.astro`. Fungsi ini hanya boleh didefinisikan di `BrochureRequestFormModal.astro`.

**Before:**
```javascript
// Di BrochureRequestForm.astro
window.openBrochureFormModal = () => {
    if (modal) {
        modal.classList.remove("hidden"); // ❌ Salah! Ini modal success
    }
};
```

**After:**
```javascript
// Fungsi dihapus dari BrochureRequestForm.astro
// Hanya ada di BrochureRequestFormModal.astro ✅
```

### 2. **Increase Z-Index Modal Success**
**File**: `BrochureRequestForm.astro` (line 208)

Menaikkan z-index modal success agar selalu muncul di atas modal form.

**Before:**
```html
<div id="brochure-modal" class="hidden fixed inset-0 z-50 overflow-y-auto">
```

**After:**
```html
<div id="brochure-modal" class="hidden fixed inset-0 z-[60] overflow-y-auto">
```

## Flow yang Benar

### User Journey:
1. User klik "Download Brosur" → `window.openBrochureFormModal()` dipanggil
2. Fungsi dari `BrochureRequestFormModal.astro` dijalankan
3. Modal **FORM** muncul (id="brochure-form-modal") ✅
4. User isi form → Submit
5. Data terkirim ke Google Sheets
6. Modal form tertutup
7. Modal **SUCCESS** muncul (id="brochure-modal") ✅
8. User klik "Download Brosur" di modal success
9. Brosur terbuka di tab baru

## Struktur Modal

Ada **2 modal** yang berbeda:

### 1. **Modal Form** (`brochure-form-modal`)
- **Lokasi**: `BrochureRequestFormModal.astro`
- **Z-index**: 50
- **Fungsi**: Menampilkan form permintaan brosur
- **Dibuka oleh**: `window.openBrochureFormModal()`

### 2. **Modal Success** (`brochure-modal`)
- **Lokasi**: `BrochureRequestForm.astro`
- **Z-index**: 60 ✅ (lebih tinggi)
- **Fungsi**: Menampilkan tombol download setelah form berhasil
- **Dibuka oleh**: Otomatis setelah form submit berhasil

## Files Modified
- ✅ `src/components/blog/BrochureRequestForm.astro`
  - Hapus function override
  - Naikkan z-index modal success

## Testing
1. Klik tombol "Download Brosur" di website
2. Verifikasi modal form muncul ✅
3. Isi form dengan data valid
4. Submit form
5. Verifikasi modal form tertutup ✅
6. **Verifikasi modal success muncul** ✅
7. Klik "Download Brosur" di modal success
8. Verifikasi brosur terbuka di tab baru ✅

## Notes
- Fungsi `window.openBrochureFormModal()` hanya boleh didefinisikan **SATU KALI** di `BrochureRequestFormModal.astro`
- Modal success harus memiliki z-index lebih tinggi dari modal form
- Jangan pernah override fungsi global yang sudah didefinisikan di komponen lain
