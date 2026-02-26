## 第二階段：多語系、導航升級與亮色風格轉型

我已經完成了網站的第二階段升級，並新增了開發規範：**所有畫面皆須進行 RWD 響應式優化**。主要改進如下：


### 1. 全站多語系支援 (i18n)
- **支援語言**：繁體中文 (預設)、簡體中文、英文。
- **實作方式**：建立 `LanguageProvider` 封裝全域狀態，並透過 `useTranslation` 鉤子實作動態語系切換。
- **字典管理**：於 `src/lib/i18n/dictionaries` 中模組化管理翻譯字串。

### 2. 進階階層式導航 (Two-level Navigation)
- **一級選單**：首頁、賽事數據、最新消息、賽事分析、作者群。
- **二級選單**：為「賽事數據、最新消息、賽事分析」加入了包含「棒球、籃球、其他」的下拉式選單。
- **技術細節**：使用 Headless 通用邏輯與 Tailwind 動態類別實作，具備平滑的縮放與淡入動畫。

### 3. 亮色風格 (Bright Design) 轉型
- **色彩體系**：全面更新 `globals.css`，將背景設為極簡的 `Slate 50`，並提升 `Emerald 500` (競技綠) 的對比度。
- **組件適配**：`ScoreCard`、`PostCard` 等組件均已完成亮色模式適配，採用簡潔的邊框與層次分明的陰影。

## 第三階段：即時賽事跑馬燈 (Top Live Score Ticker)

為了提供更具動態感的運動數據體驗，我新增了置頂的即時比分跑馬燈：

### 1. 跑馬燈功能實作
- **自動循環**：採用 CSS 動畫實作無縫循環捲動，確保在低效能裝置上也能平滑運作。
- **互動邏輯**：滑鼠懸停 (Hover) 時自動暫停捲動，點擊賽事區塊可直接跳轉至詳情頁。
- **數據同步**：支援每 30 秒自動更新數據，模擬即時賽事流。

### 2. 資料結構標準化
- **Match 類型升級**：為了適配 Go 後端需求，統一了 `match_id`、`sport_type`、`status` (PRE/LIVE/FINAL) 等欄位。
- **多體育項目**：同時支援棒球 (BASEBALL) 與籃球 (BASKETBALL) 的數據格式。

### 3. 佈局動態調整
- **Header 位移**：Header 自動下移 40px 以避開跑馬燈空間，並維持 Fixed 定位。
- **間距優化**：主內容區塊的 `Padding-Top` 已同步調整，確保初始視圖不被遮擋。

## 主要介面成果

### 即時賽事跑馬燈展示
您可以在頁面最頂端看到深色的即時比分條，顯示當前熱門賽事的最新動態。

````carousel
```tsx
// 跑馬燈動畫與暫停邏輯
<div className={`animate-ticker ${isPaused ? 'paused' : ''}`}>
  {/* 賽事資訊 */}
</div>
```
<!-- slide -->
```typescript
// 統一的賽事資料介面
interface Match {
  status: 'PRE' | 'LIVE' | 'FINAL';
  homeTeam: TeamInfo;
  awayTeam: TeamInfo;
  // ...
}
```
````

## 第五階段：佈局細節與頂級頁腳 (Footer & Layout Refinement)

為了讓網站整體更具一致性與高端感，我對全站佈局與 Footer 進行了視覺升級：

### 1. 藝術感深色頁腳 (Premium Dark Footer)
- **配色升級**：將 Footer 底色改為與即時跑馬燈一致的 `brand-heading` 深色調，營造出穩重的專業感。
- **Threads 圖標校正**：修正了 Threads 的 SVG 圖標，採用標準的官方樣式。
- **視覺亮點**：加入了放射狀漸層背景、發光邊框以及動態懸停效果，讓資訊版塊層次更豐富。

### 2. 回滾頂部功能 (Back-to-Top Button)
- **智慧顯示**：當頁面縱向捲動超過 400px 時，按鈕會以 Fade-in 動畫優雅顯現。
- **流暢體驗**：點擊後觸發 `Smooth Scroll` 平滑回滾至頂部，增強長頁面的導覽效率。
- **響應式配置**：在桌面端 (40px) 與行動端 (20px) 具備不同的邊距，確保不遮擋重要內容。

## 主要介面成果

### 深色頁腳與回滾按鈕
展現更具設計感的深色頁腳，以及右下角的動態回滾按鈕。

````carousel
```tsx
// 回滾按鈕的顯示邏輯
useEffect(() => {
  const toggleVisibility = () => {
    setIsVisible(window.scrollY > 400);
  };
  window.addEventListener('scroll', toggleVisibility);
}, []);
```
<!-- slide -->
```tsx
// 深色頁腳的設計細節
<footer className="bg-brand-heading text-white">
  <div className="bg-gradient-to-r from-transparent via-brand-primary to-transparent opacity-50"></div>
  {/* 四欄資訊與社群圖標 */}
</footer>
```
````

## 第六階段：導覽體驗優化與行動端選單 (Header UX & Mobile Navigation)

為了解決桌面端的互動問題並強化行動端的瀏覽體驗，我對 Header 進行了核心重構：

### 1. 導覽列互動修復 (Hover Fix)
- **橋接技術**：在主選單與下拉選單之間新增了透明的「橋接層 (Bridge)」，解決了鼠標移動至子選單時因間距導致選單消失的 Bug。
- **平滑過渡**：優化了 Level 2 選單的淡入與縮放動畫，提供更穩定的視覺回饋。

### 2. 行動端側邊選單 (Mobile SideMenu)
- **手勢互動**：在 `md:hidden` 尺寸下自動切換為漢堡選單，點擊可喚出由右側滑入的 SideMenu。
- **階層式設計**：SideMenu 採用手風琴 (Accordion) 邏輯處理 Level 1 與 Level 2 連結，確保深層內容也能輕鬆觸及。
- **功能整合**：SideMenu 同步整合了多語系切換與「加入 SportHub」按鈕。

### 3. 響應式佈局 (RWD)
- **動態調整**：Header 的 Padding、Logo 大小以及動作按鈕皆針對小螢幕進行了縮放處理，落實「所有畫面皆須優化 RWD」的開發規範。

## 主要介面成果

### 行動端選單與互動展示
展現行動端下的 SideMenu 滑出效果以及桌面端的穩定下拉選單。

````carousel
```tsx
// 橋接層實作以修復 Hover Bug
<div className="absolute top-full pt-4 w-48 transition-all ...">
  <div className="bg-white rounded-xl shadow-xl ...">
    {/* 子選單內容 */}
  </div>
</div>
```
<!-- slide -->
```tsx
// 行動端 SideMenu 結構
<div className={`fixed inset-0 ... ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}>
  <div className="absolute top-0 right-0 w-[80%] h-full bg-white ...">
    {/* 手風琴選單與語系切換 */}
  </div>
</div>
```
````

## 第七階段：技術規範校準 (Technical Specification Alignment)

為了對齊 SportHub 的技術開發規格書，我對全站佈局進行了深度校準與優化：

### 1. 層級管理 (Z-Index Hierarchy)
- **跑馬燈 (Top Ticker)**：提升至 `Z-Index: 1000`，確保全局置頂。
- **導覽列 (Header)**：設為 `Z-Index: 999`。
- **回頂部按鈕 (B2T)**：設為 `Z-Index: 998`。
- **主內容與頁尾**：明確設定為 `relative Z-Index: 1`。

### 2. 資料流與 API 驅動 (Data Flow & API Driven)
- **動態導覽列**：將 Header 的選單配置移轉至 `SportApi.getNavigation()`，實現管理後台即時調整分類的需求。
- **比分欄位擴充**：Ticker 與 Match 資料結構新增了 `live_period` 欄位，精準顯示如「9局下」或「Q4 02:45」等賽事時間。

### 3. 性能與穩定性優化
- **滾動節流 (Throttling)**：為 Header 與 Back-to-Top 的滾動監聽引入了 100ms 節流機制，大幅降低換頁與捲動時的 CPU 負擔。
- **行動端斷點校正**：將 SideMenu 的喚起斷點由 768px (md) 調整至 **1024px (lg)**，以符合規格書對平板與桌面的顯示定義。
- **邊界狀態處理**：
    - **無賽事時**：Ticker 會自動切換為「今日無賽事安排」並提供歷史戰績連結。
    - **連線中**：新增「CONNECTING...」的視覺狀態提示，模擬即時 API 的同步過程。

## 第八階段：首頁內容大改版 (Homepage Content Overhaul)

為了提供豐富且層次分明的內容呈現，我根據您的詳細需求，全方位重構了首頁 (Home)：

### 1. 沉浸式 Banner 輪播 (Hero Banner)
- **多功能整合**：支援廣告、精選文章與最新消息的混合輪播。
- **互動設計**：點擊圖片會開啟 `target="_blank"` 的相關連結，並具備自動播放與導航控制，提升首屏衝擊力。

### 2. 廣告欄位佈局 (Ad Positioning)
- **全站廣告系統**：實作了 `AdBanner` 元件，並在首頁頂部 (Banner 下方)、側邊欄位以及頁面底部精準置入橫版廣告空間。

### 3. 多元內容板塊
- **熱門文章 (3x2 Grid)**：固定顯示 6 篇熱門焦點文章，採用圓潤卡片設計與懸停縮放效果。
- **最新消息 (4x2 Slider)**：實作 2 頁式輪播，每頁顯示 4 張圖文，確保新聞資訊的即時性與易讀性。
- **精選專題 (Zigzag Layout)**：採用「左上、右下」的交錯視覺佈局，針對高質量的深度專題提供大尺寸展示。

### 4. 雙欄主內容區 (Dual Column Section)
- **左側：分頁文章流**：一次顯示 4 篇文章，並實作了底部的分頁切換 (Pagination) 功能，方便用戶探索更多內容。
- **右側：賽事側邊欄**：獨立的即時賽事區塊，一次顯示 3 場最新比分，下方並整合了相關廣告位。

## 主要介面成果

### 首頁結構展示
展現改版後的豐富首頁層次。

````carousel
```tsx
// 3x2 熱門文章網格實作
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {posts.map((post) => (
        <PostCard key={post.id} {...post} />
    ))}
</div>
```
<!-- slide -->
```tsx
// 雙欄佈局結構
<section className="grid grid-cols-1 lg:grid-cols-12 gap-16">
    <div className="lg:col-span-8">{/* 分頁文章 */}</div>
    <aside className="lg:col-span-4">{/* 賽事側欄 + 廣告 */}</aside>
</section>
```
````

## 驗證結果
- [x] **內容層次**：首頁各板塊（Banner、廣告、網格、專題、雙欄）堆疊正確且美觀。
- [x] **互動邏輯**：輪播切換平滑，分頁功能可正常請求下一組文章。
- [x] **外部連結**：Banner 點擊連結正確開啟新分頁 (`target="_blank"`)。
- [x] **RWD 適配**：所有板塊在手機、平板與桌面端皆具備良好的響應式佈局。


