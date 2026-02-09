# Remove "Allowed Player Types" Field in App Version Management

This plan outlines the steps to remove the "Allowed Player Types" (開放玩家類型) field from the App Version Management interface and related systems.

## Proposed Changes

### [Backend/Data Layer]

#### [MODIFY] [version.ts](file:///c:/Users/Administrator/Desktop/營運後台/src/types/version.ts)
- Remove `PlayerType` type definition.
- Remove `target_player_types` field from `VersionRecord` and `CreateVersionRequest` interfaces.

#### [MODIFY] [version.ts](file:///c:/Users/Administrator/Desktop/營運後台/src/api/version.ts)
- Update `checkForUpdate` method to remove filtering logic based on `playerTypes`.

#### [MODIFY] [version.ts](file:///c:/Users/Administrator/Desktop/營運後台/src/mocks/version.ts)
- Remove `target_player_types` field from all mock records.

### [Frontend/UI]

#### [MODIFY] [AppVersionManager.vue](file:///c:/Users/Administrator/Desktop/營運後台/src/views/Master/AppVersionManager.vue)
- Remove `target_player_types` from `formModel`.
- Remove `playerTypeOptions` constant.
- Update `openCreate` and `openEdit` functions to remove `target_player_types` assignment.
- Remove the "開放玩家類型" `NFormItem` from the settings modal.

## Verification Plan

### Manual Verification
- [ ] Navigate to "系統設定 > App 版本管理".
- [ ] Click "新增版本":
    - [ ] Verify that the "開放玩家類型" field is no longer present.
- [ ] Click "編輯" on an existing version:
    - [ ] Verify that the "開放玩家類型" field is no longer present.
- [ ] Verify that version listing still works correctly.
