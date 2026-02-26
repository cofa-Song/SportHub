# 實作計畫 - 競賽 Blog

此計畫概述了使用 Next.js、Go、MySQL 和 Redis 開發競賽部落格平台的流程。

## 建議變更

### 專案結構
我們將採用分層結構：
- `frontend/`: Next.js 應用程式
- `backend/`: Go 應用程式
- `docker-compose.yml`: 用於本地開發服務 (MySQL, Redis)

### 前端 (Next.js)
- **框架**: Next.js 14+ (App Router)
- **樣式**: Tailwind CSS
- **組件庫**: Shadcn/ui (提供高質感介面)
- **狀態管理**: React Query (TanStack Query) 用於 API 獲取，Context API 用於 UI 狀態。
- **即時通訊**: Socket.io-client 或 原生 WebSocket。

### 後端 (Go)
- **框架**: Gin-gonic (熱門且穩定)
- **ORM**: GORM (對接 MySQL)
- **快取**: Go-redis
- **即時通訊**: Gorilla WebSocket

### 資料庫綱要 (Schema)
- **MySQL**:
    - `users`: ID, username, password_hash, role, created_at
    - `competitions`: ID, title, description, start_time, end_time, status
    - `posts`: ID, competition_id, author_id, title, content, created_at
- **Redis**:
    - `score:{competition_id}`: 使用 Hash 或 Sorted Set 存儲即時分數。

## 驗證計畫

### 自動化測試
- Go 單元測試 (業務邏輯)。
- Playwright 或 Cypress 進行前端 E2E 測試。

### 手動驗證
- 驗證跨多個瀏覽器分頁的即時比分更新。
- 檢查行動版與桌面版的響應式設計。
- 測試 JWT 登入/登出流程。
