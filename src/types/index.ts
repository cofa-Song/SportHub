
export type SportType = 'BASEBALL' | 'BASKETBALL';
export type MatchStatus = 'PRE' | 'LIVE' | 'FINAL';

export interface TeamInfo {
    name: string;
    logo?: string;
    score: number;
}

export interface Match {
    id: string; // match_id
    sportType: SportType;
    homeTeam: TeamInfo;
    awayTeam: TeamInfo;
    status: MatchStatus;
    matchInfo: string; // Current detail (e.g. "NBA Q4 02:30")
    live_period?: string; // Specific live time/period (e.g. "9局下", "Q4 02:45")
    league: string;
}

export interface Author {
    id: string;
    name: string;
    avatar: string;
    level_tag: string;
}

export interface ArticleDTO {
    id: string;
    title: string;
    cover_url: string; // Changed from coverImage
    category: string;
    author: Author; // Changed from string
    comment_count: number;
    view_count: number;
    share_count: number;
    collect_count: number;
    is_ad: boolean;
    created_at: string; // ISO 8601, Changed from publishedAt
    target_url: string; // e.g., /article/{id}
    excerpt?: string; // Optional, might be needed for UI but not in core DTO list, keeping for compatibility if permissible
}

export interface BannerDTO {
    banner_id: string; // Changed from id
    image_url: string; // Changed from image
    title: string;
    target_url: string; // Changed from link
    type?: 'AD' | 'ARTICLE' | 'NEWS'; // Optional to keep UI logic if needed
}

export interface AdDTO {
    id: string;
    image_url: string; // Changed from image
    target_url: string; // Changed from link
    position: 'TOP' | 'SIDE' | 'BOTTOM';
}

export interface SpecialFeatureDTO extends ArticleDTO {
    // Inherits Article structure as per requirement "Waterfall logic based on articles"
    // But might need specific display fields if different from standard article
    description?: string; // For the Z-pattern text
}

export interface PaginatedResponse<T> {
    data: T[];
    total_pages: number;
    current_page: number;
}

export interface HomeData {
    banners: BannerDTO[];
    hot_picks: ArticleDTO[];
    latest_news: ArticleDTO[];
    featured_topic: ArticleDTO[];
    latest_feed: PaginatedResponse<ArticleDTO>;
    live_stats: Match[];
    ads_top?: AdDTO[]; // Optional, might be separate or part of layout
    ads_bottom?: AdDTO[];
    ads_side?: AdDTO[];
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: number;
}



