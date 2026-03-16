# Walkthrough - Third-party Key Management Modifications

I have modified the "Third-party Key Management" interface according to your requirements.

## Changes Made

### 1. Data Structure Updates
- Removed the `environment` field from `ThirdPartyKey` and `CreateThirdPartyKeyRequest` models.
- Added an optional `proxy` field (string) to the models.
- Cleaned up mock data to match the new structure.

### 2. UI Enhancements
- **List View**: 
    - Removed the "環境" (Environment) column.
    - Added the **"Proxy"** column.
    - Added the **"異常" (Abnormal)** column to display connection or key errors.
    - Changed the "狀態" (Status) column to a **Switch**, allowing for quick toggling.
- **Access Operation (存取操作)**:
    - Added a "存取操作" button in the header.
    - Status changes made in the list are now tracked as **pending changes**.
    - A confirmation modal appears when saving multiple status changes to prevent accidental updates.
- **Form View (Add/Edit)**:
    - Removed the "連線環境" radio buttons.
    - Added a new **"Proxy"** input field.
    - Marked required fields with red asterisks (供應商名稱, API 端點, Merchant ID, API Key).

## Verification Results

### UI Changes
- The environment column is no longer visible in the table.
- The Proxy field is available in the modal when adding or editing a key.

### Code Quality
- Updated type definitions to ensure type safety.
- Adjusted API mock logic to handle the new `proxy` field.
- Cleaned up unused imports and addressed lint warnings.

render_diffs(file:///c:/Users/Administrator/Desktop/營運後台/src/views/Master/ThirdPartyKeys.vue)
render_diffs(file:///c:/Users/Administrator/Desktop/營運後台/src/types/thirdparty.ts)
render_diffs(file:///c:/Users/Administrator/Desktop/營運後台/src/api/thirdparty.ts)
render_diffs(file:///c:/Users/Administrator/Desktop/營運後台/src/mocks/thirdparty.ts)
