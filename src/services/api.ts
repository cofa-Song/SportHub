import { Match, Post, ApiResponse, Banner, Ad, SpecialFeature } from '@/types';

/**
 * Base API Service.
 * Modularized for easy expansion and future Go backend integration.
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const ASSET_PATH = '/img/home/db1a163c-c47d-4442-a6b7-2467c0b7ec5c';

export const SportApi = {
    /**
     * Fetch homepage banners.
     */
    getBanners: async (): Promise<ApiResponse<Banner[]>> => {
        await delay(400);
        return {
            status: 200,
            data: [
                { id: 'b1', image: `${ASSET_PATH}/hero_nba_finals_1770628434041.png`, title: 'NBA Finals 2026: The Ultimate Clash', link: 'https://nba.com', type: 'ARTICLE' },
                { id: 'b2', image: `${ASSET_PATH}/hero_mlb_game_1770628451873.png`, title: 'MLB All-Star Game Voting Opens', link: 'https://mlb.com', type: 'NEWS' },
                { id: 'b3', image: `${ASSET_PATH}/ad_sports_gear_1770628472549.png`, title: 'Summer Sale: Get 50% Off Gear', link: 'https://store.sporthub.com', type: 'AD' },
            ]
        };
    },

    /**
     * Fetch ads by position.
     */
    getAds: async (position: 'TOP' | 'SIDE' | 'BOTTOM'): Promise<ApiResponse<Ad[]>> => {
        await delay(300);
        const adImage = position === 'SIDE'
            ? `${ASSET_PATH}/ad_energy_drink_sports_1770628488975.png`
            : `${ASSET_PATH}/ad_sports_gear_1770628472549.png`;

        return {
            status: 200,
            data: [
                { id: `ad-${position}`, image: adImage, link: 'https://sponsor.com', position }
            ]
        };
    },

    /**
     * Fetch special themed projects.
     */
    getSpecials: async (): Promise<ApiResponse<SpecialFeature[]>> => {
        await delay(500);
        return {
            status: 200,
            data: [
                { id: 's1', title: 'Basketball Evolution', description: 'Exploring the history of the jump shot and its impact on modern play.', image: `${ASSET_PATH}/special_basketball_evolution_1770628508648.png`, link: '/special/basketball-evolution' },
                { id: 's2', title: 'The Art of the Curveball', description: 'Physics and finesse: How elite pitchers master the most deceptive pitch in baseball.', image: `${ASSET_PATH}/special_baseball_physics_1770628528009.png`, link: '/special/curveball-art' },
            ]
        };
    },

    /**
     * Fetch current matches for homepage/match center.
     */
    getMatches: async (): Promise<ApiResponse<Match[]>> => {
        await delay(1500);
        return {
            status: 200,
            data: [
                { id: '1', sportType: 'BASKETBALL', homeTeam: { name: '湖人', score: 102 }, awayTeam: { name: '勇士', score: 98 }, status: 'LIVE', league: 'NBA', matchInfo: 'LIVE', live_period: 'Q4 02:45' },
                { id: '2', sportType: 'BASEBALL', homeTeam: { name: '道奇', score: 2 }, awayTeam: { name: '洋基', score: 2 }, status: 'LIVE', league: 'MLB', matchInfo: 'LIVE', live_period: '8局下' },
                { id: '3', sportType: 'BASEBALL', homeTeam: { name: '兄弟', score: 0 }, awayTeam: { name: '味全', score: 0 }, status: 'PRE', league: 'CPBL', matchInfo: 'UPCOMING', live_period: '18:35' },
            ],
        };
    },

    /**
     * Fetch navigation configuration from API (Simulated).
     */
    getNavigation: async (): Promise<ApiResponse<any[]>> => {
        await delay(300);
        return {
            status: 200,
            data: [
                { key: 'home', href: '/' },
                { key: 'liveStats', href: '/matches', hasChildren: true, children: [{ key: 'baseball', href: '/baseball' }, { key: 'basketball', href: '/basketball' }, { key: 'others', href: '/others' }] },
                { key: 'latestNews', href: '/news', hasChildren: true, children: [{ key: 'baseball', href: '/baseball' }, { key: 'basketball', href: '/basketball' }, { key: 'others', href: '/others' }] },
                { key: 'analyses', href: '/analysis', hasChildren: true, children: [{ key: 'baseball', href: '/baseball' }, { key: 'basketball', href: '/basketball' }, { key: 'others', href: '/others' }] },
                { key: 'authors', href: '/authors' },
            ]
        };
    },

    /**
     * Fetch live matches for the Top Ticker.
     */
    getTickerMatches: async (): Promise<ApiResponse<Match[]>> => {
        await delay(500);
        return {
            status: 200,
            data: [
                { id: 't1', sportType: 'BASKETBALL', homeTeam: { name: 'LAL', score: 102 }, awayTeam: { name: 'GSW', score: 98 }, status: 'LIVE', league: 'NBA', matchInfo: 'LIVE', live_period: 'Q4 02:45' },
                { id: 't2', sportType: 'BASEBALL', homeTeam: { name: 'NYY', score: 5 }, awayTeam: { name: 'LAD', score: 3 }, status: 'LIVE', league: 'MLB', matchInfo: 'LIVE', live_period: '8局下' },
                { id: 't3', sportType: 'BASKETBALL', homeTeam: { name: 'BOS', score: 110 }, awayTeam: { name: 'MIA', score: 105 }, status: 'FINAL', league: 'NBA', matchInfo: 'FINAL', live_period: 'FINAL' },
                { id: 't4', sportType: 'BASEBALL', homeTeam: { name: 'Brothers', score: 0 }, awayTeam: { name: 'Monkeys', score: 0 }, status: 'PRE', league: 'CPBL', matchInfo: 'UPCOMING', live_period: '18:35' },
            ],
        };
    },

    /**
     * Fetch latest blog posts.
     */
    getPosts: async (page = 1, limit = 4, category?: string): Promise<ApiResponse<Post[]>> => {
        await delay(800);
        const allPosts = Array.from({ length: 20 }).map((_, i) => ({
            id: `${i + 1}`,
            title: i % 2 === 0 ? `NBA 季後賽分析：湖人隊的防守策略轉變 #${i + 1}` : `2026 世界盃預選賽亮點回顧 #${i + 1}`,
            excerpt: '在最近的一系列比賽中，該球隊展現出了全新的聯防體系，並在進攻端保持穩定...',
            coverImage: i % 2 === 0 ? `${ASSET_PATH}/hero_nba_finals_1770628434041.png` : `${ASSET_PATH}/hero_mlb_game_1770628451873.png`,
            author: i % 3 === 0 ? '張大衛' : i % 3 === 1 ? '李小青' : '王教練',
            publishedAt: '2026-02-09',
            category: i % 2 === 0 ? '籃球' : '足球',
            commentsCount: Math.floor(Math.random() * 50),
            viewsCount: Math.floor(Math.random() * 5000) + 100,
        }));


        let filtered = allPosts;
        if (category) {
            filtered = allPosts.filter(p => p.category === category);
        }

        const start = (page - 1) * limit;
        return {
            status: 200,
            data: filtered.slice(start, start + limit),
        };
    },

    /**
     * Fetch News Items (for the 4x2 slider).
     */
    getNews: async (page = 1, limit = 4): Promise<ApiResponse<Post[]>> => {
        await delay(600);
        const allNews = Array.from({ length: 8 }).map((_, i) => ({
            id: `news-${i + 1}`,
            title: `最新即時消息: 運動界重大快報 #${i + 1}`,
            excerpt: '最新的運動界即時報導，為您帶來第一手的現場消息...',
            coverImage: i % 2 === 0 ? `${ASSET_PATH}/hero_nba_finals_1770628434041.png` : `${ASSET_PATH}/hero_mlb_game_1770628451873.png`,
            author: '體育快報',
            publishedAt: '2026-02-09',
            category: i % 3 === 0 ? '籃球' : i % 3 === 1 ? '棒球' : '其他',
            commentsCount: Math.floor(Math.random() * 20),
            viewsCount: Math.floor(Math.random() * 2000) + 50,
        }));
        const start = (page - 1) * limit;
        return {
            status: 200,
            data: allNews.slice(start, start + limit),
        };
    }

};
