# Article Management Interface Modifications

This plan outlines the changes to remove the "Meta Keywords" field from the SEO optimization options and switch the rich text editor to TinyMCE (free version).

## Proposed Changes

### [Backend/Data Layer]

#### [MODIFY] [article.ts](file:///c:/Users/Administrator/Desktop/營運後台/src/types/article.ts)
- Remove `meta_keywords` from the `seo` object in the `Article` interface.

#### [MODIFY] [article.ts](file:///c:/Users/Administrator/Desktop/營運後台/src/api/article.ts)
- Remove `meta_keywords` from the mock data and any update/create logic.

### [Frontend/UI]

#### [NEW] [TinymceEditor.vue](file:///c:/Users/Administrator/Desktop/營運後台/src/components/TinymceEditor.vue)
- Create a reusable TinyMCE wrapper component using the official TinyMCE CDN.
- This avoids adding heavy dependencies to `package.json` while fulfilling the requirement for the "free version".

#### [MODIFY] [ArticleManager.vue](file:///c:/Users/Administrator/Desktop/營運後台/src/views/Master/ArticleManager.vue)
- Remove the `Meta Keywords` `NFormItem`.
- Replace the existing basic `NInput` textarea with the new `TinymceEditor` component.
- Cleanup the `seo` initial state in `formModel` and `openDrawer`.

## Verification Plan

### Manual Verification
- [ ] Navigate to "前台設定 > 文章管理".
- [ ] Click "新增文章" or "編輯":
    - [ ] **SEO Tab**: Verify "Meta Keywords" field is gone.
    - [ ] **Content Tab**: Verify TinyMCE editor loads correctly and allows rich text editing (bold, italic, etc.).
    - [ ] Save an article -> verify content and SEO fields (excluding keywords) are correctly sent and saved in mock data.
- [ ] Verify the article list still displays correctly.
