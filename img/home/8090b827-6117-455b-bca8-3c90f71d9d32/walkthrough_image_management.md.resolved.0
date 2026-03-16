# Walkthrough - Image Management Modifications

I have modified the "Image Management" interface to simplify the upload process and provide more control over image display frequency.

## Changes Made

### 1. Unified Image Upload
- **UI**: Compressed the previous PC and Mobile upload fields into a single "圖片上傳" field.
- **Preview**: The table now shows a single consolidated "預覽" column.
- **Logic**: Simplified the upload handling logic to support the single `imageUrl` field.

### 2. Display Frequency Dropdown
- **UI**: Replaced the radio button selection for frequency with a more standard **Dropdown Select (NSelect)**.
- **Options**: Added "每次登入、每日一次、永久一次" as the available choices.
- **Global Availability**: This field is now available for all image types, not just popups.

### 3. Data & API Consolidation
- **Type Definitions**: Updated the data structures to use a single `imageUrl`.
- **Mock Service**: Updated mock data and API methods to reflect the field consolidation.

## Verification Results
- The add/edit modal now correctly displays a single upload area and a frequency dropdown.
- Images save and load successfully using the unified `imageUrl` field.
- The list view provides a clear, single-column image preview.

render_diffs(file:///c:/Users/Administrator/Desktop/營運後台/src/views/Master/ImageConfig.vue)
render_diffs(file:///c:/Users/Administrator/Desktop/營運後台/src/types/imageConfig.ts)
render_diffs(file:///c:/Users/Administrator/Desktop/營運後台/src/api/imageConfig.ts)
