# Admin Whitelist Management Enhancements

This plan outlines the steps to add search functionality and batch status updates ("Access Operation") to the Admin Whitelist Management interface.

## Proposed Changes

### [Frontend/UI]

#### [MODIFY] [AdminWhitelist.vue](file:///c:/Users/Administrator/Desktop/營運後台/src/views/Master/AdminWhitelist.vue)
- **Search Functionality**:
    - Add `searchForm` reactive state with `cidr` and `enabled` fields.
    - Add a search `NForm` section above the table.
    - Update `load` function to perform filtering on the list of IP/netmask and status.
- **Quick Status Toggle & Access Operation**:
    - Add `pendingChanges` reactive state to track status changes made in the list.
    - Update the "狀態" column in `columns` to use `NSwitch`.
    - Add "存取操作" button in the header-extra section, with a count of pending changes.
    - Add a confirmation modal for "存取操作".
    - Implement `handleStatusChange` and `handleBatchSave` functions.

## Verification Plan

### Manual Verification
- [ ] Navigate to "系統設定 > 後台白名單".
- [ ] **Search Verification**:
    - [ ] Enter an IP in the search field and click "查詢" -> verify results are filtered.
    - [ ] Select a status and click "查詢" -> verify results are filtered.
- [ ] **Access Operation Verification**:
    - [ ] Toggle several "狀態" switches in the list -> verify the "存取操作" button shows the correct count.
    - [ ] Click "存取操作" and "取消" -> verify changes are NOT saved.
    - [ ] Click "存取操作" and "確認" -> verify changes ARE saved and the message "存取成功" appears.
- [ ] Verify that adding and editing whitelist entries still works correctly.
