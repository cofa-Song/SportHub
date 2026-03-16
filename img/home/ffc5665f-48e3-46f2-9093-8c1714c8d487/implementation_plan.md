# OPE-605 金流通道管理實作計畫

本功能旨在提供高度靈活的金流通道配置與管控中心，支援動態 API 參數、熔斷機制及針對玩家分層的精確投放。

## 擬議變更

### 1. 數據模型與 API 層
- **[NEW] [paymentChannel.ts](file:///c:/Users/Administrator/Desktop/營運後台/src/types/paymentChannel.ts)**: 
    - 定義 `PaymentChannel` 實體，包含 `limits` (限額), `stats` (今日累計), `target` (分層權限)。
    - 定義 `ChannelStatus`: `OPEN`, `CLOSED`, `MAINTENANCE`, `FUSED` (熔斷)。
- **[NEW] [paymentChannel.ts](file:///c:/Users/Administrator/Desktop/營運後台/src/api/paymentChannel.ts)**: 
    - 封裝 CRUD、狀態切換、與手續費/額度重置 API。

### 2. UI 開發 (Premium Light Tech Edition)
- **[NEW] [PaymentChannels.vue](file:///c:/Users/Administrator/Desktop/營運後台/src/views/Master/PaymentChannels.vue)**:
    - **亮色高端設計**: 延續 OPE-601 的科技美學，使用白色玻璃擬態卡片、精密陰影與微動態效果。
    - **即時監控列表**: 
        - 使用 `NProgress` 展示「今日累計 / 上限」進度。
        - 即時切換狀態與審核模式。
    - **配置彈窗**: 
        - 分組顯示：基礎設定、API 導航、風控策略、投放目標。
        - 加密欄位支援 `input-password` 以保護敏感 Key。

### 3. 選單與國際化
- **[MODIFY] [index.ts](file:///c:/Users/Administrator/Desktop/營運後台/src/locales/index.ts)**: 新增「金流通道管理」相關翻譯。
- **[MODIFY] [Layout.vue](file:///c:/Users/Administrator/Desktop/營運後台/src/views/Master/Layout.vue)**: 將新功能加入導航側欄。

## 核心邏輯處理
- **熔斷機制 (AC 7)**: 介面上根據成功金額比例（80%/95%）自動變色提醒。
- **審核遮蔽 (Control B.2)**: 提供一鍵式開關，同步影響 App 端的支付可用性 API。
- **權限分層 (AC 1/5)**: 多選 VIP 等級與標籤，確保不同玩家看到不同的支付列表。

## 驗證計畫
### 自動化/手動驗證
1. **VIP 隔離測試**: 登入不同等級測試帳號，檢查通道顯示。
2. **限額攔截測試**: 測試新增通道時的數值邊界校驗。
3. **熔斷模擬**: 調整今日累計值超過上限，觀察狀態是否自動轉變為 `FUSED`（模擬效果）。
