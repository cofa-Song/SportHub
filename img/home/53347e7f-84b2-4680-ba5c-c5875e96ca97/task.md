# OPE-603 Manual Deposit/Withdrawal Management

## Planning & Setup
- [x] Explore existing codebase for patterns (Player lookup, Forms, APIs)
- [x] Create Implementation Plan
- [x] Define API endpoints (mock or real interfaces)

## Implementation
- [x] Create `ManualAdjustment.vue` view
    - [x] Player Search Section (ID input, display name/tags)
    - [x] Operation Form (Type, Wallet, Amount, Reason, Note)
    - [x] Dynamic Fields (Proof Image, Rollover Toggle, Multiplier)
- [x] Implement Form Validation & Logic
    - [x] Balance check (frontend validation if data available)
    - [x] "Test Account" warning
    - [x] Offline Deposit proof requirement
- [x] Implement API Integration
    - [x] Player Info Search
    - [x] Submit Adjustment (with double-submit protection)
- [x] Register Route

## Verification
- [x] Verify AC 1: Balance update (Unit/Mock test)
- [x] Verify AC 2: Validations (Required fields)
- [x] Verify AC 3: Rollover logic (Queue generation mock check)
- [x] Verify AC 4: Audit Log (data structure check)
- [x] Verify AC 5: Double-submit protection

# OPE-604 Financial Overview Dashboard

## Planning & Setup
- [x] Check for chart libraries (echarts/chart.js)
- [x] Create Implementation Plan
- [x] Define API `finance.ts` for aggregated data

## Implementation
- [x] Create `FinancialOverview.vue`
    - [x] Filter Bar (Time range, Test account toggle, Refresh button)
    - [x] KPI Cards (Total Deposit, Total Withdraw, Net Revenue, etc.)
    - [x] Charts Section (Deposit Composition, Withdrawal Composition)
    - [x] Alert System (Manual adjustment threshold check)
- [x] Implement Business Logic
    - [x] Auto-refresh (60s)
    - [x] Permission check (Hide Net Revenue for non-managers)
    - [x] Calculations (Net Revenue = Deposit - Withdraw)
- [x] Register Route

## Verification
- [x] Verify AC 1: Test account exclusion
- [x] Verify AC 2: Manual adjustment sum update
- [x] Verify AC 3: Data consistency with other modules
- [x] Verify AC 4: Time range filtering
- [x] Verify AC 5: Permission-based visibility

# OPE-606 Commodity Configuration Management

## Planning & Setup
- [x] Create Implementation Plan
- [x] Define APIs: `badge.ts`, `commodity.ts`

## Implementation
- [x] Create `MarketingBadgeModal` component
    - [x] CRUD for badges
    - [x] Delete protection logic
- [x] Create `CommodityConfig.vue` view
    - [x] List View (Table with columns)
    - [x] Edit/Create Form (Tabs for Basic, Content, Pricing, Rules)
    - [x] Integration with Marketing Badge Modal
- [x] Implement Business Logic
    - [x] iOS Tier warning
    - [x] Product ID validation
    - [x] Conflict detection for limit rules
- [x] Register Route

## Verification
- [x] Verify AC 1: Image upload & preview
- [x] Verify AC 2: Badge CRUD & linkage
- [x] Verify AC 3: VIP experience check (Mock)
- [x] Verify AC 4: Platform ID validation
- [x] Verify AC 5: Rollover rule check

# Post-Implementation Refinement
- [x] Fix Naive UI component resolution warnings in `CommodityConfig.vue`, `ManualAdjustment.vue`, and `FinancialOverview.vue`
- [x] Resolve remaining TypeScript/Lint errors in view components

# OPE-604 Refinement (Financial Dashboard)
- [x] Update `finance.ts` API definition & mock data
- [x] Update `FinancialOverview.vue` with new KPIs and Charts
    - [x] Add `Deposit Conversion Rate`
    - [x] Add `Distribution Composition` Chart (with In Progress segment)
    - [x] Implement Red Flash Alert & Link
- [x] Verify new requirements (Alerts, KPIs)
- [x] Verify new requirements (Alerts, KPIs)

# OPE-701 Todo Audit Center (Dashboard)
- [x] Define `dashboard.ts` API for aggregated stats
- [x] Create `TodoCenter.vue` view
    - [x] Implement Polling & Refresh Logic
    - [x] Implement RBAC Visibility
    - [x] Create KPI Cards (Deposit, Withdraw, Risk, Health, CCU)
    - [x] Implement Navigation with Query Params
- [x] Register Route (replace or add as Home)
- [x] Verification (Permissions, Navigation, Data Accuracy)

# OPE-702 Risk Alert System
- [x] Define `risk.ts` API (Mock Data for Alerts)
- [x] Create `RiskAlertList.vue` view
    - [x] Filter Bar (Status, Type, Level)
    - [x] Alert Table (with badges/tags)
    - [x] Detail Modal (Trigger reason, Action buttons)
    - [x] Action Logic (Dismiss, Restrict, Ban)
- [x] Register Route (`/risk/alerts`)
- [x] Add Menu Item (Risk Management)
- [x] Verification (Mock triggering, Status updates)

# OPE-703 System Health Monitoring
- [x] Define `systemStatus.ts` API (Mock Data for Services)
- [x] Create `SystemStatus.vue` view
    - [x] Status Dashboard (Service Groups: Payment, Game, System)
    - [x] Latency & Last Check Display
    - [x] Auto-Refresh Logic (Heartbeat)
    - [x] Manual "Re-check" Action
- [x] Update Route (Fix existing `system-status` route)
- [x] Update Menu (Ensure visibility for Dev/Ops)
- [x] Verification (Mock disconnect, Dashboard alert sync)

# OPE-704 Realtime Operations Data
- [x] Define `realtime.ts` API (CCU, GGR, Distributions)
- [x] Create `RealtimeDashboard.vue` view
    - [x] KPI Cards (CCU, DAU, GGR, Turnover)
    - [x] Distribution Charts (Provider, Device)
    - [x] Auto-Refresh & Exclude Test Account Logic
- [x] Register Route (`/data-center/realtime`)
- [x] Update Menu (Data Center > Realtime Data)
- [x] Verification (Data updates, Test account exclusion)

# OPE-703 Enhancement: System Health Monitoring Dashboard
- [x] Update `systemStatus.ts` API
    - [x] Add `SystemOverviewStats` interface
    - [x] Add `TrafficPoint` interface
    - [x] Implement `getSystemOverview()` mock
    - [x] Implement `getTrafficTrend()` mock
- [x] Update `SystemStatus.vue` view
    - [x] Add KPI Cards (Server Load, Avg Latency, Errors, QPS)
    - [x] Add Server Load Gauge Chart (ECharts)
    - [x] Add Traffic Trend Line Chart (24h)
    - [x] Integrate with existing auto-refresh
- [x] Verification (Charts render, Data updates)

# Guild Management Enhancement: Member List View
- [x] Update `src/types/guild.ts` with `GuildMember` interface
- [x] Update `src/api/guild.ts` with `getMembers` method
- [x] Update `src/views/Master/GuildManagement.vue`
    - [x] Add "成員名單" button to actions column
    - [x] Create Member List Modal
    - [x] Implement fetch & display logic
- [x] Verification (Modal opens, Data correct, Navigation works)

# Commodity Management Enhancement
- [x] Generate custom placeholder image for commodities
- [x] Update `src/api/commodity.ts` with diverse mock data
- [x] Implement image error handling in `CommodityConfig.vue`
- [x] Update VIP level selection to single-select threshold logic
- [x] Verification (Placeholder appears for broken links, VIP logic works)

# Deposit Orders i18n
- [x] Add translation keys to `src/locales/index.ts` (zhTW, zhCN, enUS)
- [x] Update `src/views/Master/DepositOrders.vue` with `t()` function
- [x] Verification (Language switch works, all labels translated)

# Layout Menu i18n
- [x] Add missing translation keys to `src/locales/index.ts`
- [x] Update `src/views/Master/Layout.vue` menu options to use `t()`
# Dashboard Beautification & Theme Toggle
- [x] Implement Dark/Light mode in `App.vue` (NConfigProvider)
- [x] Add Theme Toggle in `Layout.vue` header
- [x] Refactor `Layout.vue` for premium aesthetics (Glassmorphism, Better Sidebar)
- [x] Update global `style.css` with core design tokens and animations
- [x] Verification (Theme persists, UI looks "vibrant" and "premium")
- [x] Refine Header text contrast for both light and dark modes
- [x] Soften light mode header text for improved aesthetics
