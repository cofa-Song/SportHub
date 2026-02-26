# implementation_plan.md

## Goal Description
Align the UI of "Article Management" (文章管理) with "Image Management" (圖片管理) to ensure consistency across the administrative portal.
1. Update terminology for images (already planned/done).
2. Align "Add Article" (新增文章) and "Access Operation" (存取操作) buttons in Article Management with the styles and positions used in Image Management.

## User Review Required
> [!NOTE]
> The "Add Article" button will be moved to the card header and its icon will be removed to match the "Add Image" button style.

## Proposed Changes

### Image Management View (Status: Done)
- Terminology updates and dropdown menu implementation.

### Article Management View
#### [MODIFY] [ArticleManager.vue](file:///c:/Users/Administrator/Desktop/營運後台/src/views/Master/ArticleManager.vue)
- **"新增文章" Button**:
    - Move from search form area to `<template #header-extra>` of the main `NCard`.
    - Change button type to `info`.
    - Remove the `AddOutline` icon.
- **"存取操作" Button**:
    - Move from search form to a separate `div` with `class="flex gap-2"` just above the search filters card/area (inside the `NSpace`).
    - This ensures it's always visible and consistently placed like the one in `ImageConfig.vue`.

## Verification Plan

### Manual Verification
1.  Navigate to **前台設定 > 圖片管理** to observe the base UI.
2.  Navigate to **前台設定 > 文章管理**.
3.  Verify the "新增文章" button is now in the top-right header of the card and has a blue (info) color.
4.  Verify the "存取操作" button is now located above the search filters, consistent with the Image Management layout.
