# Image Management Interface Modifications

This plan outlines the changes to unify PC/Mobile image uploads into a single field and add a "Display Frequency" dropdown in the Image Management interface.

## Proposed Changes

### [Backend/Data Layer]

#### [MODIFY] [imageConfig.ts](file:///c:/Users/Administrator/Desktop/營運後台/src/types/imageConfig.ts)
- Replace `pcImageUrl` and `mobileImageUrl` with a single `imageUrl: string`.
- Ensure `frequency` is properly typed as mandatory if that's the intention, or keep as optional but always present in UI.

#### [MODIFY] [imageConfig.ts](file:///c:/Users/Administrator/Desktop/營運後台/src/api/imageConfig.ts)
- Update `mockImageConfigs` to use `imageUrl` instead of `pcImageUrl` and `mobileImageUrl`.
- Update `createImageConfig` to handle `imageUrl`.
- Update `updateImageConfig` to handle `imageUrl`.

### [Frontend/UI]

#### [MODIFY] [ImageConfig.vue](file:///c:/Users/Administrator/Desktop/營運後台/src/views/Master/ImageConfig.vue)
- **Data Model**: Update `formModel` to use `imageUrl` instead of `pcImageUrl/mobileImageUrl`.
- **Upload Logic**: Consolidate `handleUploadPC` and `handleUploadMobile` into a single `handleUpload` function.
- **Table Columns**: Update columns to show a single "圖片" preview instead of "預覽 (PC)".
- **Modal Form**:
    - Replace the two upload `NFormItem`s with a single one.
    - Change `frequency` field from `NRadioGroup` to `NSelect`.
    - Remove the `v-if="isPopup"` restriction to make it always visible as per the request, or confirm if it should still be conditional. *Decision: Make it always visible as the user requested it as a "new field" without condition.*
- **Logic**: Remove the code that deletes `frequency` when the type is not `POPUP`.

## Verification Plan

### Manual Verification
- [ ] Navigate to "前台設定 > 圖片管理".
- [ ] Verify the table shows a single "圖片" column.
- [ ] Click "新增":
    - [ ] Verify there is only one "圖片上傳" field.
    - [ ] Verify there is a "顯示頻率" dropdown select with the three correct options.
    - [ ] Upload an image and save -> verify it appears correctly in the list.
- [ ] Edit an existing image:
    - [ ] Verify data loads correctly into the single upload field and frequency select.
    - [ ] Change frequency and save -> verify it's persisted (in mock data).
