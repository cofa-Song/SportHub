import { MatchScoreDTO, ArticleDTO, ArticleDetailDTO, CommentDTO, ApiResponse, BannerDTO, AdDTO, HomeData, NewsData } from '@/types';

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

// Helper for Mock Ads
const createMockAd = (id: string, suffix: string): AdDTO => ({
    ad_id: id,
    image_url: `${ASSET_PATH}/${suffix}`,
    target_url: 'https://sponsor.com',
    label_text: '贊助',
    campaign_id: 'camp-2026-spring',
    track_impression_url: `https://api.sporthub.com/track/imp/${id}`,
    track_click_url: `https://api.sporthub.com/track/click/${id}`
});

// Helper to generate mock matches
const generateMatches = (): MatchScoreDTO[] => [
    {
        match_id: '1', sport_type: 'BASKETBALL',
        home_team: { name: '湖人', score: 102, logo_url: '' },
        away_team: { name: '勇士', score: 98, logo_url: '' },
        status: 'LIVE', league_name: 'NBA', match_time: '2026-02-10T20:00:00Z',
        current_period: 'Q4 02:45', is_live: true, target_url: '/match/1'
    },
    {
        match_id: '2', sport_type: 'BASEBALL',
        home_team: { name: '道奇', score: 2, logo_url: '' },
        away_team: { name: '洋基', score: 2, logo_url: '' },
        status: 'LIVE', league_name: 'MLB', match_time: '2026-02-10T19:30:00Z',
        current_period: '8局下', is_live: true, target_url: '/match/2'
    },
    {
        match_id: '3', sport_type: 'BASEBALL',
        home_team: { name: '兄弟', score: 0, logo_url: '' },
        away_team: { name: '味全', score: 0, logo_url: '' },
        status: 'PRE', league_name: 'CPBL', match_time: '2026-02-11T18:35:00Z',
        current_period: '未開賽', is_live: false, target_url: '/match/3'
    },
];

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

        // Special Features
        const featuredTopic = generateArticles(2, 'special');
        (featuredTopic[0] as any).title = 'Special: Basketball Evolution';
        (featuredTopic[0] as any).description = 'Exploring the history of the jump shot and its impact on modern play.';
        featuredTopic[0].cover_url = `${ASSET_PATH}/special_basketball_evolution_1770628508648.png`;

        (featuredTopic[1] as any).title = 'Special: The Art of the Curveball';
        (featuredTopic[1] as any).description = 'Physics and finesse: How elite pitchers master the most deceptive pitch in baseball.';
        featuredTopic[1].cover_url = `${ASSET_PATH}/special_baseball_physics_1770628528009.png`;

        const latestFeed = generateArticles(20, 'feed');

        const liveStats = generateMatches();

        const adTop = [createMockAd('ad-top', 'ad_sports_gear_1770628472549.png')];
        const adBottom = [createMockAd('ad-bottom', 'ad_sports_gear_1770628472549.png')];
        const adSide = [createMockAd('ad-side', 'ad_energy_drink_sports_1770628488975.png')];

        return {
            status: 200,
            data: {
                banners,
                hot_picks: hotPicks,
                latest_news: latestNews,
                featured_topic: featuredTopic,
                latest_feed: {
                    data: latestFeed.slice(0, 5),
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

    /**
     * Unified matches endpoint
     */
    getMatches: async (): Promise<ApiResponse<MatchScoreDTO[]>> => {
        await delay(500);
        return {
            status: 200,
            data: generateMatches(),
        };
    },


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
     * Unified News Hall Endpoint (GET /api/news?category=...)
     */
    getNewsData: async (category?: string): Promise<ApiResponse<NewsData>> => {
        await delay(500);

        const mockCategory = category ? (category === 'basketball' ? 'Basketball' : category === 'baseball' ? 'Baseball' : undefined) : undefined;

        const getMock = (count: number, prefix: string) => {
            const items = generateArticles(count, prefix);
            if (mockCategory) {
                items.forEach(i => i.category = mockCategory);
            }
            return items;
        }

        const hotNews = getMock(6, 'news-hot');
        const featuredNews = getMock(2, 'news-featured');
        (featuredNews[0] as any).description = 'Exclusive coverage of the season highlights.';
        (featuredNews[1] as any).description = 'In-depth player interviews and analysis.';

        const latestNews = getMock(10, 'news-latest');
        latestNews.forEach((item, idx) => {
            const date = new Date();
            date.setDate(date.getDate() - idx);
            item.created_at = date.toISOString();
        });

        const topAd = [createMockAd('news-top', 'ad_sports_gear_1770628472549.png')];

        return {
            status: 200,
            data: {
                top_ad: topAd,
                hot_news: hotNews,
                featured_news: featuredNews,
                latest_news: latestNews
            }
        };
    },

    /**
     * Matches Hall Data (GET /api/matches?category=...)
     */
    getMatchesHallData: async (category?: string): Promise<ApiResponse<{
        live_matches: MatchScoreDTO[],
        upcoming_matches: MatchScoreDTO[],
        top_ad: AdDTO[]
    }>> => {
        await delay(500);
        const allMatches = generateMatches();
        const topAd = [createMockAd('matches-top', 'ad_sports_gear_1770628472549.png')];

        return {
            status: 200,
            data: {
                live_matches: allMatches.filter(m => m.status === 'LIVE'),
                upcoming_matches: allMatches.filter(m => m.status === 'PRE'),
                top_ad: topAd
            }
        };
    },

    /**
     * Analysis Hall Data (GET /api/analysis?category=...)
     */
    getAnalysisData: async (category?: string): Promise<ApiResponse<NewsData>> => {
        await delay(500);
        // Reuse NewsData structure for Analysis Hall for now
        const items = generateArticles(10, 'analysis');
        if (category) items.forEach(i => i.category = category);

        const hotNews = items.slice(0, 6);
        const featuredNews = items.slice(6, 8);
        const latestNews = items.slice(0, 10);
        const topAd = [createMockAd('analysis-top', 'ad_sports_gear_1770628472549.png')];

        return {
            status: 200,
            data: {
                top_ad: topAd,
                hot_news: hotNews,
                featured_news: featuredNews,
                latest_news: latestNews
            }
        };
    },

    /**
     * Unified Article Detail Endpoint (GET /api/posts/[id])
     */
    getArticleDetail: async (id: string): Promise<ApiResponse<ArticleDetailDTO>> => {
        await delay(500);

        // Generate mock content with multiple paragraphs
        const content = [
            "湖人隊在昨晚的比賽中展現出了令人驚訝的防守強度。這不僅僅是單一球員的表現，而是整個團隊體系的升級。從第一節開始，他們就對持球人進行了高強度的壓迫，迫使對手發生了多次失誤。",
            "進攻端方面，詹姆斯依然是球隊的核心發動機。他在關鍵時刻的兩記三分球穩住了局勢。然而，更值得注意的是戴維斯在內線的統治力，他不僅在進攻端予取予求，更在防守端送出了關鍵的火鍋。",
            "這場比賽的轉捩點出現在第三節中段。當對手試圖反撲時，湖人隊的替補陣容挺身而出。里夫斯的幾次突破分球撕裂了對方的防線，為外線射手創造了極佳的空檔機會。",
            "教練團的調度也功不可沒。在對手改守區域聯防時，教練及時喊出暫停並調整戰術，利用高位擋拆成功破解了對方的防守策略。這種臨場應變能力正是季後賽球隊所需要的。",
            "值得一提的是，新加入的側翼球員在這場比賽中也發揮了重要作用。雖然得分不多，但他對於對方頭號得分手的限制做得非常出色，讓對手全場命中率不足四成。",
            "賽後採訪中，球隊主帥表示：「我們還有很長的路要走，但這場勝利證明了我們的方向是正確的。」他也特別稱讚了幾位年輕球員的拼勁和專注度。",
            "展望下一場比賽，對手擁有全聯盟最強的內線組合，這將是對湖人隊禁區防守的一次重大考驗。球隊需要在籃板保護上做得更好，避免給對手太多的二次進攻機會。",
            "總結來說，這是一場團隊的勝利。每個人都各司其職，並且在關鍵時刻都能夠挺身而出。如果能夠保持這樣的狀態，湖人隊在今年的季後賽中絕對大有可為。",
            "這場比賽也再次證明了防守贏得冠軍的道理。在高強度的對抗中，穩定的防守往往比華麗的進攻更能夠決定比賽的勝負。",
            "最後，我們不能忽視主場球迷的支持。全場震耳欲聾的歡呼聲給了球員們巨大的動力，這也是湖人隊能夠在落後時迅速反超的重要因素之一。"
        ].join('\n\n');

        const article = generateArticles(1, 'post')[0] as ArticleDetailDTO;
        article.content = content;
        article.tags = ['NBA', 'Lakers', 'LeBron', 'Defense'];
        article.related_articles = generateArticles(3, 'related');
        article.comments = Array.from({ length: 15 }).map((_, i) => ({
            id: `c-${i}`,
            content: i % 2 === 0 ? '這場比賽真的太精彩了！' : '防守確實進步很多，但進攻還要加強。',
            author: { id: `u-${i}`, name: `User ${i + 1}`, avatar: '', level_tag: 'Fan' },
            created_at: new Date(Date.now() - i * 3600000).toISOString(),
            like_count: Math.floor(Math.random() * 50)
        }));

        return {
            status: 200,
            data: article
        };
    },

    /**
     * Get Comments (Pagination)
     */
    getComments: async (articleId: string, page = 1): Promise<ApiResponse<CommentDTO[]>> => {
        await delay(500);
        const comments = Array.from({ length: 30 }).map((_, i) => ({
            id: `c-more-${page}-${i}`,
            content: `這是第 ${page} 頁的評論 #${i + 1} - 湖人總冠軍！`,
            author: { id: `u-${page}-${i}`, name: `Fan ${page}-${i}`, avatar: '', level_tag: 'Member' },
            created_at: new Date().toISOString(),
            like_count: Math.floor(Math.random() * 20)
        }));

        const start = (page - 1) * 10;
        return {
            status: 200,
            data: comments.slice(start, start + 10)
        };
    },

    /**
     * Global Ads Endpoint (GET /api/global-ads)
     */
    getGlobalAds: async (): Promise<ApiResponse<{ bottom_ad?: AdDTO[] }>> => {
        await delay(300);

        const bottomAd = [createMockAd('global-bottom-ad', 'ad_sports_gear_1770628472549.png')];
        bottomAd[0].label_text = '全站廣告';

        return {
            status: 200,
            data: {
                bottom_ad: bottomAd
            }
        };
    },
};
