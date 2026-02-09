# 遊戲列表欄位優化 (殺率設定)

優化「遊戲列表」功能，區分「統計殺率」(根據盈虧計算) 與「設置殺率」(手動設定)，並在編輯介面提供設定入口。

## 擬議變更

### 數據模型與 API
#### [MODIFY] [game.ts](file:///c:/Users/Administrator/Desktop/營運後台/src/types/game.ts)
- `Game` 介面新增 `profit_rate: number`。
- `GameUpdateRequest` 介面新增 `profit_rate?: number`。

#### [MODIFY] [game.ts](file:///c:/Users/Administrator/Desktop/營運後台/src/mocks/game.ts)
- 更新 Mock 數據，為現有遊戲新增 `profit_rate` 初始值。

---

### 多語系支持
#### [MODIFY] [index.ts](file:///c:/Users/Administrator/Desktop/營運後台/src/locales/index.ts)
- `game.list.winRate`: "殺率" -> "統計殺率" (zh-TW, zh-CN, en 同步更新)。
- 新增 `game.list.profitRate`: "殺率"。
- 新增 `game.list.setProfitRate`: "設置殺率"。

---

### 介面組件
#### [MODIFY] [GameList.vue](file:///c:/Users/Administrator/Desktop/營運後台/src/views/Master/GameList.vue)
- **列表欄位**：
  - 將原有的「殺率」欄位標題改為「統計殺率」。
  - 在「有效流水比例」右側新增「設置殺率」欄位，顯示 `profit_rate`。
- **編輯彈窗**：
  - 新增「殺率」輸入項 (`NInputNumber`)，允許營運方手動設定。
  - 同步更新編輯表單的初始化與提交邏輯。

## 驗證計畫

### 自動化測試
- 無 (使用 Mock 數據進行手動驗證)。

### 手動驗證
- 進入「遊戲列表」，確認列表標題已更改。
- 點擊「編輯」，在彈窗中修改殺率。
- 提交後確認列表中的「設置殺率」已更新。
