# Remove "Last Visit" Field in Admin Whitelist

This plan outlines the steps to remove the "Last Visit" (最後訪問) field from the Admin Whitelist interface and related data structures.

## Proposed Changes

### [Backend/Data Layer]

#### [MODIFY] [whitelist.ts](file:///c:/Users/Administrator/Desktop/營運後台/src/types/whitelist.ts)
- Remove `last_access` field from `WhitelistEntry` interface.

#### [MODIFY] [whitelist.ts](file:///c:/Users/Administrator/Desktop/營運後台/src/mocks/whitelist.ts)
- Remove `last_access` field from all mock records.

### [Frontend/UI]

#### [MODIFY] [AdminWhitelist.vue](file:///c:/Users/Administrator/Desktop/營運後台/src/views/Master/AdminWhitelist.vue)
- Remove the "最後訪問" column definition from the `columns` computed property.

## Verification Plan

### Manual Verification
- [ ] Navigate to "系統設定 > 後台白名單".
- [ ] Verify that the "最後訪問" column is no longer present in the table.
- [ ] Verify that adding and editing whitelist entries still works correctly.
