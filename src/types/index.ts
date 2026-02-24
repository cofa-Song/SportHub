/**
 * 全站標準化組件數據規格
 * Standardized Component Data Specifications
 */

// ============================================================================
// 1. 廣告組件規格 (Ad Banner DTO)
// ============================================================================

/**
 * 廣告 DTO - 統一全站廣告（Banner、橫版廣告、側欄廣告）的資料格式
 * 強制追蹤商業數據
 */
export interface AdDTO {
    ad_id: string;                      // 廣告唯一識別碼（用於點擊紀錄）
    image_url: string;                  // 廣告圖片 CDN 連結
    target_url: string;                 // 點擊跳轉連結 (預設 _blank)
    label_text: string;                 // 顯示字樣 (預設為 "贊助" 或 "廣告")
    campaign_id: string;                // 廣告活動 ID（用於後端廣告成效歸戶）
    track_impression_url: string;       // 曝光追蹤連結（當組件出現在視窗時，前端發送請求給 Go）
    track_click_url: string;            // 點擊追蹤連結（當用戶點擊時，由 Go 紀錄點擊次數）
}

// ============================================================================
// 2. 賽事比分組件規格 (Match Score DTO)
// ============================================================================

export type SportType = 'BASEBALL' | 'BASKETBALL' | 'FOOTBALL' | 'TENNIS' | 'ESPORTS' | 'OTHERS';
export type MatchStatus = 'PRE' | 'LIVE' | 'FINAL';

/**
 * 隊伍資訊
 */
export interface TeamInfo {
    name: string;           // 隊伍名稱
    logo_url: string;       // 隊伍 Logo URL
    score: number;          // 比分
}

/**
 * 賽事比分 DTO - 統一跑馬燈 (Ticker) 與側邊欄 (Live Widget) 的比分數據
 * 支援不同競技項目的狀態顯示
 */
export interface MatchScoreDTO {
    match_id: string;               // 賽事唯一 ID
    sport_type: SportType;          // 運動類型：BASEBALL, BASKETBALL
    league_name: string;            // 聯盟名稱 (e.g., "MLB", "CPBL", "NBA")
    league_logo_url: string;        // 聯盟 Logo URL
    status: MatchStatus;            // PRE (預報), LIVE (進行中), FINAL (完賽)
    match_time: string;             // 賽事開始時間 (ISO 8601 DateTime)
    home_team: TeamInfo;            // 主隊資訊
    away_team: TeamInfo;            // 客隊資訊
    current_period: string;         // 進度說明 (e.g., "5局下", "第3節 08:30", "已結束")
    is_live: boolean;               // 是否正處於 Live 狀態（用於 UI 閃爍標記）
    target_url: string;             // 點擊後的數據詳情頁路徑
}

// ============================================================================
// 3. 文章卡片規格 (Article DTO)
// ============================================================================

/**
 * 作者資訊
 */
export interface Author {
    id: string;             // 作者 ID
    name: string;           // 作者名稱
    avatar: string;         // 作者頭像 URL
    level_tag: string;      // 作者等級/標籤 (e.g., "Official", "Expert")
}

/**
 * 文章 DTO - 統一全站（新聞、文章、廣告文）的資料格式
 */
export interface ArticleDTO {
    id: string;                 // 文章唯一 ID
    title: string;              // 文章標題
    cover_url: string;          // 封面圖 CDN 連結
    category: string;           // 競技類別
    author: Author;             // 作者資訊
    comment_count: number;      // 總評論數
    view_count: number;         // 總瀏覽次數
    share_count: number;        // 總轉發次數
    collect_count: number;      // 總收藏次數
    type: 'NEWS' | 'ANALYSIS' | 'AD'; // 文章類型：新聞、分析(文章)、廣告
    created_at: string;         // 生成時間 (ISO 8601 DateTime)
    target_url: string;         // 跳轉路徑
    excerpt?: string;           // 摘要（選填，用於卡片預覽）
    source?: string;            // 文章來源 (僅 type='NEWS' 時有值, e.g., "聯合新聞網")
}

// ============================================================================
// Legacy/Compatibility Types
// ============================================================================

/**
 * @deprecated 使用 MatchScoreDTO 替代
 * 保留用於向後兼容
 */
export interface Match extends Omit<MatchScoreDTO, 'match_id' | 'sport_type' | 'league_name' | 'match_time' | 'home_team' | 'away_team' | 'current_period' | 'is_live'> {
    id: string;
    sportType: SportType;
    homeTeam: TeamInfo;
    awayTeam: TeamInfo;
    matchInfo: string;
    live_period?: string;
    league: string;
}

/**
 * Banner DTO - 用於輪播 Banner
 */
export interface BannerDTO {
    banner_id: string;          // Banner 唯一識別碼
    image_url: string;          // 圖片 URL
    title: string;              // 標題
    target_url: string;         // 跳轉連結
    type?: 'AD' | 'ARTICLE' | 'NEWS';   // Banner 類型（選填）
}

/**
 * 特殊專題 DTO - 繼承文章 DTO
 */
export interface SpecialFeatureDTO extends ArticleDTO {
    description?: string;       // 專題描述（用於 Z 字型布局）
}

// ============================================================================
// API Response Types
// ============================================================================

/**
 * 分頁響應
 */
export interface PaginatedResponse<T> {
    data: T[];
    total_pages: number;
    current_page: number;
}

/**
 * 首頁數據
 */
export interface HomeData {
    banners: BannerDTO[];
    hot_picks: ArticleDTO[];
    latest_news: ArticleDTO[];
    featured_topic: ArticleDTO[];
    latest_feed: PaginatedResponse<ArticleDTO>;
    live_stats: MatchScoreDTO[];        // 使用新的 MatchScoreDTO
    ads_top?: AdDTO[];
    ads_bottom?: AdDTO[];
    ads_side?: AdDTO[];
}

/**
 * 新聞頁數據
 */
export interface NewsData {
    top_ad: AdDTO[];
    hot_news: ArticleDTO[];
    featured_news: ArticleDTO[];
    latest_news: ArticleDTO[];
    bottom_ad?: AdDTO[];
}

/**
 * 評論 DTO
 */
export interface CommentDTO {
    id: string;
    content: string;
    author: Author;
    created_at: string;
    like_count: number;
    reply_count: number;
    is_author: boolean;
    is_like: boolean;
    replies?: CommentDTO[];
}

/**
 * 文章詳情 DTO - 繼承文章 DTO，增加內文與更多詳情
 */
export interface ArticleDetailDTO extends ArticleDTO {
    content: string;            // 完整文章內容 (HTML or Markdown)
    tags: string[];             // 標籤
    related_articles: ArticleDTO[]; // 相關文章
    author_latest_articles?: ArticleDTO[]; // 作者最新文章 (用於分析文側邊欄)
    comments: CommentDTO[];     // 評論列表
}

/**
 * API 統一響應格式
 */
export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: number;
}
