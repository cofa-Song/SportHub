# OPE-303 Tag and Type Configuration Management

## Overview
This feature provides a configuration console for game types and marketing tags, managing the rate calculation logic that affects game turnover counting.

## 1. Data Models (`src/types/game.ts`)

### GameType
- `id`: string
- `name`: string (read-only, backend defined)
- `code`: string
- `rate`: number (editable, 0-1000%)
- `updated_at`: string

### MarketingTagConfig
- `id`: string
- `name`: string
- `tag_type`: 'SYSTEM' | 'CUSTOM'
- `has_rate`: boolean (toggle for custom rate)
- `rate`: number (only if has_rate = true)
- `status`: 'ACTIVE' | 'DISABLED'
- `description`: string
- `games_using`: number (count of games using this tag)
- `created_at`: string
- `updated_at`: string

### Request Types
- `GameTypeUpdateRequest`: { rate: number }
- `MarketingTagCreateRequest`: { name, has_rate, rate?, description }
- `MarketingTagUpdateRequest`: { name?, has_rate?, rate?, status?, description? }

## 2. API Service (`src/api/config.ts`)

### configApi
- `getGameTypes()`: Fetch all game types
- `updateGameType(id, data)`: Update type rate
- `getMarketingTags()`: Fetch all marketing tags
- `createMarketingTag(data)`: Create custom tag
- `updateMarketingTag(id, data)`: Update tag config
- `deleteMarketingTag(id)`: Delete tag (with validation)

### Business Logic
- System tags (HOT, NEW) cannot be deleted
- Tags with games_using > 0 cannot be deleted
- Rate priority: Manual > Tag > Type

## 3. UI Components

### [NEW] [GameTypeConfig.vue](file:///c:/Users/Administrator/Desktop/營運後台/src/views/Master/GameTypeConfig.vue)
- Table showing all game types
- Inline edit for rate adjustment
- No "Add Type" button (backend-only)

### [NEW] [MarketingTagConfig.vue](file:///c:/Users/Administrator/Desktop/營運後台/src/views/Master/MarketingTagConfig.vue)
- Table with SYSTEM vs CUSTOM tags
- Add/Edit/Delete for custom tags
- Status toggle (enable/disable)
- Delete validation (check games_using)

## 4. Integration
- Update `OPE-302` to fetch types/tags from config
- Ensure rate calculation respects priority logic

## 5. Verification (AC1-AC6)
- Type rate changes reflect in game list
- NEW tag auto-expires after 60 days
- Custom tag rate overrides type rate
- Delete protection when tags in use
- Disable tag removes it from games
- No "Add Type" button visible
