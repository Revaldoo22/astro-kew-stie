# Fix: TypeScript Error - openBrochureFormModal

## Problem
The error `Property 'openBrochureFormModal' does not exist on type 'Window & typeof globalThis'` was occurring in multiple files:
- `AboutSection.astro` (line 74)
- `BrochureDownloadButton.astro` (line 30)
- `BrochureRequestFormModal.astro` (line 49)
- `BrochureRequestForm.astro` (line 306)

## Root Cause
The code was trying to call `window.openBrochureFormModal()`, but:
1. This function didn't exist on the `window` object initially
2. TypeScript didn't know about this custom property, causing type errors

## Solution Implemented

### 1. Created Global Type Declaration File
**File**: `src/types/global.d.ts`

This file declares the `openBrochureFormModal` function as a property of the `Window` interface, making TypeScript aware of it across the entire project.

```typescript
declare global {
    interface Window {
        openBrochureFormModal: () => void;
    }
}
```

### 2. Implemented the Function
The actual function is defined in two places:

**A. BrochureRequestForm.astro** (line 298-306)
- Opens the success modal after form submission
- Shows the modal with the download button

**B. BrochureRequestFormModal.astro** (line 49-54)
- Opens the form modal when triggered from buttons
- Prevents background scrolling

### 3. Updated All Calling Files
The following files now properly call the function without TypeScript errors:
- `AboutSection.astro` - "Download Brosur" button
- `BrochureDownloadButton.astro` - Reusable download button component

## How It Works

1. **User clicks "Download Brosur" button** → Calls `window.openBrochureFormModal()`
2. **Function opens the modal** → Either the form modal or success modal
3. **TypeScript is happy** → Because we declared the function in `global.d.ts`

## Files Modified
1. ✅ `src/types/global.d.ts` (created)
2. ✅ `src/components/blog/BrochureRequestForm.astro`
3. ✅ `src/components/blog/BrochureRequestFormModal.astro`
4. ✅ `src/components/home/AboutSection.astro`
5. ✅ `src/components/blog/BrochureDownloadButton.astro`

## Testing
To verify the fix:
1. Check that TypeScript errors are gone in your IDE
2. Click any "Download Brosur" button on the website
3. Verify the modal opens correctly
4. Submit the form and verify the success modal appears

## Notes
- The `tsconfig.json` already includes `src/**/*`, so the new type declaration file is automatically picked up
- No changes to build configuration were needed
- The function is now globally available throughout the application
