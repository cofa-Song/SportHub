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


export interface Post {
    id: string;
    title: string;
    excerpt: string;
    coverImage: string;
    author: string;
    publishedAt: string;
    category: string;
    commentsCount?: number;
    viewsCount?: number;
}


export interface Banner {
    id: string;
    image: string;
    title: string;
    link: string;
    type: 'AD' | 'ARTICLE' | 'NEWS';
}

export interface Ad {
    id: string;
    image: string;
    link: string;
    position: 'TOP' | 'SIDE' | 'BOTTOM';
}

export interface SpecialFeature {
    id: string;
    title: string;
    description: string;
    image: string;
    link: string;
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: number;
}


