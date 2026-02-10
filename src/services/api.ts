import { Match, ArticleDTO, ApiResponse, BannerDTO, AdDTO, HomeData } from '@/types';

/**
 * Base API Service.
 * Modularized for easy expansion and future Go backend integration.
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const ASSET_PATH = '/img/home/db1a163c-c47d-4442-a6b7-2467c0b7ec5c';

// Helper to generate mock articles
const generateArticles = (count: number, prefix: string): ArticleDTO[] => {
    return Array.from({ length: count }).map((_, i) => ({
        id: `${prefix}-${i + 1}`,
        title: i % 2 === 0 ? `NBA 季後賽分析：湖人隊的防守策略轉變 #${i + 1}` : `2026 世界盃預選賽亮點回顧 #${i + 1}`,
        excerpt: '在最近的一系列比賽中，該球隊展現出了全新的聯防體系，並在進攻端保持穩定...',
        cover_url: i % 2 === 0 ? `${ASSET_PATH}/hero_nba_finals_1770628434041.png` : `${ASSET_PATH}/hero_mlb_game_1770628451873.png`,
        author: {
            id: `auth-${i}`,
            name: i % 3 === 0 ? '張大衛' : i % 3 === 1 ? '李小青' : '王教練',
            avatar: '',
            level_tag: 'Official'
        },
        created_at: '2026-02-09T12:00:00Z',
        category: i % 2 === 0 ? 'Basketball' : 'Baseball',
        comment_count: Math.floor(Math.random() * 50),
        view_count: Math.floor(Math.random() * 10000),
        share_count: Math.floor(Math.random() * 500),
        collect_count: Math.floor(Math.random() * 200),
        is_ad: i % 10 === 0,
        target_url: `/post/${prefix}-${i + 1}`
    }));
};

export const SportApi = {
    /**
     * Unified Homepage Endpoint (GET /api/home)
     */
    getHomeData: async (): Promise<ApiResponse<HomeData>> => {
        await delay(500); // Simulate network latency

        const banners: BannerDTO[] = [
            { banner_id: 'b1', image_url: `${ASSET_PATH}/hero_nba_finals_1770628434041.png`, title: 'NBA Finals 2026: The Ultimate Clash', target_url: 'https://nba.com', type: 'ARTICLE' },
            { banner_id: 'b2', image_url: `${ASSET_PATH}/hero_mlb_game_1770628451873.png`, title: 'MLB All-Star Game Voting Opens', target_url: 'https://mlb.com', type: 'NEWS' },
            { banner_id: 'b3', image_url: `${ASSET_PATH}/ad_sports_gear_1770628472549.png`, title: 'Summer Sale: Get 50% Off Gear', target_url: 'https://store.sporthub.com', type: 'AD' },
        ];

        const hotPicks = generateArticles(6, 'hot');
        const latestNews = generateArticles(8, 'news');

        // Special Features - Mix of ad and high share count
        const featuredTopic = generateArticles(2, 'special');
        (featuredTopic[0] as any).title = 'Special: Basketball Evolution';
        (featuredTopic[0] as any).description = 'Exploring the history of the jump shot and its impact on modern play.';
        featuredTopic[0].cover_url = `${ASSET_PATH}/special_basketball_evolution_1770628508648.png`;

        (featuredTopic[1] as any).title = 'Special: The Art of the Curveball';
        (featuredTopic[1] as any).description = 'Physics and finesse: How elite pitchers master the most deceptive pitch in baseball.';
        featuredTopic[1].cover_url = `${ASSET_PATH}/special_baseball_physics_1770628528009.png`;

        const latestFeed = generateArticles(20, 'feed');

        const liveStats: Match[] = [
            { id: '1', sportType: 'BASKETBALL', homeTeam: { name: '湖人', score: 102 }, awayTeam: { name: '勇士', score: 98 }, status: 'LIVE', league: 'NBA', matchInfo: 'LIVE', live_period: 'Q4 02:45' },
            { id: '2', sportType: 'BASEBALL', homeTeam: { name: '道奇', score: 2 }, awayTeam: { name: '洋基', score: 2 }, status: 'LIVE', league: 'MLB', matchInfo: 'LIVE', live_period: '8局下' },
            { id: '3', sportType: 'BASEBALL', homeTeam: { name: '兄弟', score: 0 }, awayTeam: { name: '味全', score: 0 }, status: 'PRE', league: 'CPBL', matchInfo: 'UPCOMING', live_period: '18:35' },
        ];

        const adTop: AdDTO[] = [{ id: 'ad-top', image_url: `${ASSET_PATH}/ad_sports_gear_1770628472549.png`, target_url: 'https://sponsor.com', position: 'TOP' }];
        const adBottom: AdDTO[] = [{ id: 'ad-bottom', image_url: `${ASSET_PATH}/ad_sports_gear_1770628472549.png`, target_url: 'https://sponsor.com', position: 'BOTTOM' }];
        const adSide: AdDTO[] = [{ id: 'ad-side', image_url: `${ASSET_PATH}/ad_energy_drink_sports_1770628488975.png`, target_url: 'https://sponsor.com', position: 'SIDE' }];

        return {
            status: 200,
            data: {
                banners,
                hot_picks: hotPicks,
                latest_news: latestNews,
                featured_topic: featuredTopic,
                latest_feed: {
                    data: latestFeed.slice(0, 5), // Initial load
                    total_pages: 15,
                    current_page: 1
                },
                live_stats: liveStats,
                ads_top: adTop,
                ads_bottom: adBottom,
                ads_side: adSide
            }
        };
    },

    /**
    * Fetch latest blog posts (For pagination in MainSectionSplit).
    * Now returns ArticleDTO.
    */
    getPosts: async (page = 1, limit = 5, category?: string): Promise<ApiResponse<ArticleDTO[]>> => {
        await delay(300);
        const allPosts = generateArticles(30, 'page-load');
        const start = (page - 1) * limit;
        return {
            status: 200,
            data: allPosts.slice(start, start + limit),
        };
    },

    // Legacy method supports removed or adapted if needed, but keeping getMatches for specific widgets if they ask for it separately
    getMatches: async (): Promise<ApiResponse<Match[]>> => {
        await delay(500);
        return {
            status: 200,
            data: [
                { id: '1', sportType: 'BASKETBALL', homeTeam: { name: '湖人', score: 102 }, awayTeam: { name: '勇士', score: 98 }, status: 'LIVE', league: 'NBA', matchInfo: 'LIVE', live_period: 'Q4 02:45' },
                { id: '2', sportType: 'BASEBALL', homeTeam: { name: '道奇', score: 2 }, awayTeam: { name: '洋基', score: 2 }, status: 'LIVE', league: 'MLB', matchInfo: 'LIVE', live_period: '8局下' },
                { id: '3', sportType: 'BASEBALL', homeTeam: { name: '兄弟', score: 0 }, awayTeam: { name: '味全', score: 0 }, status: 'PRE', league: 'CPBL', matchInfo: 'UPCOMING', live_period: '18:35' },
            ],
        };
    },

    // Kept for other components that might need it
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
};
