import { MatchScoreDTO, ArticleDTO, ArticleDetailDTO, CommentDTO, ApiResponse, BannerDTO, AdDTO, HomeData, NewsData, SportType, MatchStatus } from '@/types';

/**
 * Base API Service.
 * Modularized for easy expansion and future Go backend integration.
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const ASSET_PATH = '/img/home/db1a163c-c47d-4442-a6b7-2467c0b7ec5c';

// --- Mock Data Arrays ---

const MOCK_NEWS_TITLES = [
    "NBA／詹姆斯大三元領軍 湖人延長賽氣走勇士",
    "MLB／大谷翔平雙響砲 刷新道奇隊史單季全壘打紀錄",
    "中職／鋼龍優質先發封鎖暴力猿 味全龍中止三連敗",
    "NBA／柯瑞單場10記三分彈 勇士大勝太陽25分",
    "PLG／林書豪加盟新北國王 兄弟聯手衝擊總冠軍",
    "日職／佐佐木朗希完全比賽 13K震驚日本球界",
    "WBC／中華隊30人名單出爐 旅外好手全數入列",
    "法網／喬科維奇第23座大滿貫到手 獨居史上第一",
    "世大運／台灣代表團創佳績 累積10金17銀9銅",
    "NBA／文班亞馬首秀驚艷 20分5阻攻展現天賦"
];

const MOCK_ANALYSIS_TITLES = [
    "數據分析：為什麼現代籃球越來越依賴三分球？",
    "戰術解析：湖人隊如何破解區域聯防？",
    "深度報導：從小聯盟到大聯盟——一位投手的奮鬥史",
    "球探報告：2026 選秀大會前五順位預測",
    "運科專欄：投球機制與受傷風險的關聯性研究",
    "薪資空間分析：勇士隊如何在豪華稅壓力下維持競爭力",
    "歷史回顧：90年代公牛王朝的防守哲學",
    "教練視角：如何在關鍵時刻設計最後一擊戰術",
    "數據看球：進階數據如何改變棒球比賽的樣貌",
    "心理素質：頂尖運動員如何面對高壓環境"
];

const MOCK_AUTHORS = [
    { id: 'auth-1', name: '張大衛', level_tag: '資深球評', avatar: '' },
    { id: 'auth-2', name: '李小青', level_tag: '數據專家', avatar: '' },
    { id: 'auth-3', name: '王教練', level_tag: '戰術分析師', avatar: '' },
    { id: 'auth-4', name: '陳運動', level_tag: '專欄作家', avatar: '' },
    { id: 'auth-5', name: 'Sarah Wu', level_tag: '特約記者', avatar: '' },
];

const MOCK_SOURCES = ['聯合新聞網', 'ESPN', 'Yahoo Sports', 'Bleacher Report', '中央社'];

// --- Helper Functions ---

const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const generateArticles = (count: number, prefix: string, options?: { type?: 'NEWS' | 'ANALYSIS' | 'AD', category?: string }): ArticleDTO[] => {
    return Array.from({ length: count }).map((_, i) => {
        // Determine Type
        let type: 'NEWS' | 'ANALYSIS' | 'AD' = options?.type || 'NEWS';
        if (!options?.type) {
            // If type not forced, use prefix or simple logic
            if (prefix.includes('hot') || prefix.includes('news')) type = 'NEWS';
            else if (prefix.includes('analysis') || prefix.includes('special')) type = 'ANALYSIS';
            else type = i % 10 === 0 ? 'AD' : (Math.random() > 0.5 ? 'NEWS' : 'ANALYSIS');
        }

        // Determine Category
        const category = options?.category || (i % 2 === 0 ? 'Basketball' : 'Baseball');

        // Determine Title based on Type
        let title = '';
        if (type === 'NEWS') {
            title = MOCK_NEWS_TITLES[i % MOCK_NEWS_TITLES.length] + (i > 9 ? ` #${i - 9}` : '');
        } else if (type === 'ANALYSIS') {
            title = MOCK_ANALYSIS_TITLES[i % MOCK_ANALYSIS_TITLES.length] + (i > 9 ? ` #${i - 9}` : '');
        } else {
            title = `贊助商廣告：${i + 1}`;
        }

        // Determine Author/Source
        const author = getRandomItem(MOCK_AUTHORS);
        const source = type === 'NEWS' ? getRandomItem(MOCK_SOURCES) : undefined;

        // Determine Cover
        const coverSuffix = category === 'Basketball' ? 'hero_nba_finals_1770628434041.png' : 'hero_mlb_game_1770628451873.png';

        return {
            id: `${prefix}-${i + 1}`,
            title: title,
            excerpt: type === 'ANALYSIS' ? '這是一篇深度分析文章的摘要，探討了相關議題的深層原因與影響...' : '這是一則即時新聞的快訊，為您帶來最新的第一手報導...',
            cover_url: `${ASSET_PATH}/${coverSuffix}`,
            author: author,
            created_at: new Date(Date.now() - Math.floor(Math.random() * 86400000 * 7)).toISOString(), // Last 7 days
            category: category,
            comment_count: Math.floor(Math.random() * 50),
            view_count: Math.floor(Math.random() * 10000),
            share_count: Math.floor(Math.random() * 500),
            collect_count: Math.floor(Math.random() * 200),
            type: type,
            target_url: `/post/${prefix}-${i + 1}`,
            source: source
        };
    });
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
const generateMatches = (count = 10, sport?: SportType): MatchScoreDTO[] => {
    const sports: SportType[] = sport ? [sport] : ['BASKETBALL', 'BASEBALL', 'FOOTBALL', 'TENNIS', 'ESPORTS'];
    const leagues: Record<SportType, string[]> = {
        'BASKETBALL': ['NBA', 'EuroLeague', 'P. LEague+', 'T1 League', 'CBA'],
        'BASEBALL': ['MLB', 'NPB', 'CPBL', 'KBO'],
        'FOOTBALL': ['Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Champions League'],
        'TENNIS': ['ATP Tour', 'WTA Tour', 'Wimbledon', 'US Open'],
        'ESPORTS': ['LoL Worlds', 'LCK', 'LPL', 'VCT', 'The International'],
        'OTHERS': ['UFC', 'Olympic Games', 'F1']
    };

    const teams: Record<SportType, string[]> = {
        'BASKETBALL': ['湖人', '勇士', '塞爾提克', '公鹿', '快艇', '獨行俠'],
        'BASEBALL': ['道奇', '洋基', '中信兄弟', '味全龍', '軟銀', '巨人'],
        'FOOTBALL': ['曼聯', '曼城', '皇馬', '巴薩', '利物浦', '拜仁'],
        'TENNIS': ['喬科維奇', '阿爾卡拉斯', '辛納', '梅德維夫', '納達爾'],
        'ESPORTS': ['T1', 'Gen.G', 'JDG', 'G2', 'Team Liquid', 'Soniqs'],
        'OTHERS': ['選手 A', '選手 B', '選手 C', '選手 D']
    };

    const leagueLogos: Record<string, string> = {
        'NBA': 'https://upload.wikimedia.org/wikipedia/en/thumb/0/03/National_Basketball_Association_logo.svg/105px-National_Basketball_Association_logo.svg.png',
        'MLB': 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a6/Major_League_Baseball_logo.svg/1200px-Major_League_Baseball_logo.svg.png',
        'Premier League': 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Premier_League_Logo.svg/1200px-Premier_League_Logo.svg.png',
        'LoL Worlds': 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a1/League_of_Legends_World_Championship_logo.svg/1200px-League_of_Legends_World_Championship_logo.svg.png',
    };

    return Array.from({ length: count }).map((_, i) => {
        const s = sport || getRandomItem(sports);
        const leagueList = leagues[s] || ['Other League'];
        const league = getRandomItem(leagueList);
        const teamList = teams[s] || ['Team A', 'Team B'];
        const home = teamList[i % teamList.length];
        const away = teamList[(i + 1) % teamList.length];

        const status = i % 3 === 0 ? 'LIVE' : (i % 3 === 1 ? 'PRE' : 'FINAL');

        let period = '未開賽';
        if (status === 'LIVE') {
            period = s === 'BASKETBALL' ? 'Q4 02:45' : (s === 'BASEBALL' ? '8局下' : '75\'');
        } else if (status === 'FINAL') {
            period = '已結束 (02:15:30)';
        }

        return {
            match_id: `${s}-${i}-${Date.now()}`,
            sport_type: s,
            league_name: league,
            league_logo_url: leagueLogos[league] || '',
            status: status,
            match_time: new Date(Date.now() + (i - 2) * 3600000).toISOString(),
            home_team: { name: home, score: status === 'PRE' ? 0 : Math.floor(Math.random() * 10), logo_url: '' },
            away_team: { name: away, score: status === 'PRE' ? 0 : Math.floor(Math.random() * 10), logo_url: '' },
            current_period: period,
            is_live: status === 'LIVE',
            target_url: `/match/${s}-${i}`
        };
    });
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

        // Ensure Hot Picks have a mix but mostly News/Analysis
        const hotPicks = generateArticles(6, 'hot', { type: 'NEWS' });

        // Latest News strictly News
        const latestNews = generateArticles(8, 'news', { type: 'NEWS' });

        // Special Features - Analysis
        const featuredTopic = generateArticles(2, 'special', { type: 'ANALYSIS' });
        featuredTopic[0].title = '專題：籃球的演變與未來';
        featuredTopic[0].category = 'Basketball';
        featuredTopic[0].cover_url = `${ASSET_PATH}/special_basketball_evolution_1770628508648.png`;

        featuredTopic[1].title = '專題：棒球曲球的物理學';
        featuredTopic[1].category = 'Baseball';
        featuredTopic[1].cover_url = `${ASSET_PATH}/special_baseball_physics_1770628528009.png`;

        // Mixed Feed
        const latestFeed = [
            ...generateArticles(6, 'feed-1', { type: 'NEWS' }),
            ...generateArticles(6, 'feed-2', { type: 'ANALYSIS' }),
            ...generateArticles(1, 'feed-ad', { type: 'AD' }),
            ...generateArticles(7, 'feed-3', { type: 'NEWS' })
        ].sort(() => Math.random() - 0.5); // Shuffle

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
    getPosts: async (page = 1, limit = 5, category?: string, type?: 'NEWS' | 'ANALYSIS' | 'AD'): Promise<ApiResponse<ArticleDTO[]>> => {
        await delay(300);
        // Generate a large pool of mixed content
        let allPosts = [
            ...generateArticles(15, 'page-news', { type: 'NEWS', category }),
            ...generateArticles(15, 'page-analysis', { type: 'ANALYSIS', category }),
        ];

        if (type) {
            allPosts = allPosts.filter(p => p.type === type);
        }

        allPosts = allPosts.sort(() => Math.random() - 0.5);

        const start = (page - 1) * limit;
        return {
            status: 200,
            data: allPosts.slice(start, start + limit),
        };
    },

    /**
     * Get Recommended Matches (One per sport, closest to now)
     */
    getRecommendedMatches: async (): Promise<ApiResponse<MatchScoreDTO[]>> => {
        await delay(400);
        const sports: SportType[] = ['FOOTBALL', 'BASKETBALL', 'BASEBALL', 'ESPORTS', 'TENNIS'];
        const matches = sports.map(s => {
            const m = generateMatches(1, s)[0];
            m.status = Math.random() > 0.5 ? 'LIVE' : 'PRE'; // Prioritize active or upcoming
            return m;
        });
        return { status: 200, data: matches };
    },

    /**
     * Unified matches endpoint
     */
    getMatches: async (sport?: string, state?: string, date?: string, league?: string): Promise<ApiResponse<MatchScoreDTO[]>> => {
        await delay(500);
        let matches = generateMatches(30, sport?.toUpperCase() as SportType);

        if (league) {
            matches = matches.filter(m => m.league_name === league);
        }

        if (state && state !== 'all') {
            const statusMap: Record<string, MatchStatus> = {
                'live': 'LIVE',
                'finished': 'FINAL',
                'upcoming': 'PRE'
            };
            const targetStatus = statusMap[state.toLowerCase()];
            if (targetStatus) {
                matches = matches.filter(m => m.status === targetStatus);
            }
        }

        // For simplicity, we just shuffle or filter slightly for date
        if (date) {
            matches = matches.sort(() => Math.random() - 0.5);
        }

        return {
            status: 200,
            data: matches,
        };
    },


    getNavigation: async (): Promise<ApiResponse<any[]>> => {
        await delay(300);
        return {
            status: 200,
            data: [
                { key: 'home', href: '/' },
                { key: 'liveStats', href: '/matches' },
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
        const options = { type: 'NEWS' as const, category: mockCategory };

        const hotNews = generateArticles(6, 'news-hot', options);
        const featuredNews = generateArticles(2, 'news-featured', options);
        (featuredNews[0] as any).description = '獨家報導：本賽季最令人震驚的交易案內幕。';
        (featuredNews[1] as any).description = '深入訪談：從替補到先發的心路歷程。';

        const latestNews = generateArticles(10, 'news-latest', options);
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

        const mockCategory = category ? (category === 'basketball' ? 'Basketball' : category === 'baseball' ? 'Baseball' : undefined) : undefined;
        const options = { type: 'ANALYSIS' as const, category: mockCategory };

        const hotNews = generateArticles(6, 'analysis-hot', options);
        const featuredNews = generateArticles(2, 'analysis-featured', options);
        const latestNews = generateArticles(10, 'analysis-latest', options);

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
            "在此次賽事中，選手們展現了極高的競技水準。無論是進攻端的流暢配合，還是防守端的強硬對抗，都讓觀眾大呼過癮。特別是關鍵時刻的戰術執行，更是決定比賽勝負的分水嶺。",
            "數據顯示，勝利的一方在籃板球和抄截數上都佔據了明顯優勢。這不僅意味著更多的進攻機會，也反映了球隊整體的積極性。教練在賽後訪問中也特別提到了這一點，強調防守是贏球的基石。",
            "另一場焦點戰役中，王牌投手主宰了比賽。他全場送出雙位數的三振，僅被擊出零星安打。這種壓倒性的表現，不僅幫助球隊中止連敗，也讓他成為本週最佳球員的有力競爭者。",
            "不過，比賽中也出現了一些爭議判決。雖然科技輔助執法已經相當普及，但在某些關鍵球的認定上，裁判的主觀判斷依然引發了雙方激烈的討論。這也是未來賽事組織需要持續改進的地方。",
            "對於落敗的一方來說，這場失利或許是個轉機。透過檢討比賽錄像，找出攻守失序的原因，並在接下來的訓練中加以修正，相信他們很快就能重整旗鼓，在下一場比賽中打出應有的水準。",
            "值得關注的是，年輕球員的成長速度令人驚艷。幾位新秀在面對高強度的比賽時，展現出了超越年齡的成熟度。他們的崛起，無疑為聯盟注入了新的活力，也讓未來的比賽更加充滿變數。",
            "總結來說，本週的賽事精彩紛呈，充滿了戲劇性和話題性。隨著賽季進入白熱化階段，各隊的競爭也將更加激烈。身為球迷的我們，只需準備好爆米花，盡情享受這場體育盛宴吧！"
        ].join('\n\n');

        const isAnalysis = id.includes('analysis') || Math.random() > 0.5;
        const type = isAnalysis ? 'ANALYSIS' : 'NEWS';

        const article = generateArticles(1, 'post', { type })[0] as ArticleDetailDTO;
        article.id = id; // Ensure ID matches
        article.content = content;
        article.tags = ['NBA', 'Lakers', 'LeBron', 'Defense', 'Analysis'];
        article.related_articles = generateArticles(3, 'related', { category: article.category });
        if (type === 'ANALYSIS') {
            article.author_latest_articles = generateArticles(5, 'author-latest', { type: 'ANALYSIS', category: article.category });
        }

        article.comments = Array.from({ length: 15 }).map((_, i) => {
            const reply_count = i % 3 === 0 ? 12 : i % 5 === 0 ? 5 : 0;
            return {
                id: `c-${i}`,
                content: i % 2 === 0 ? '這場比賽真的太精彩了！' : '防守確實進步很多，但進攻還要加強。',
                author: { id: `u-${i}`, name: `User ${i + 1}`, avatar: '', level_tag: 'Fan' },
                created_at: new Date(Date.now() - i * 3600000).toISOString(),
                like_count: Math.floor(Math.random() * 50),
                reply_count: reply_count,
                is_author: i === 0, // Mock first comment as author
                is_like: i % 4 === 0,
                replies: Array.from({ length: reply_count }).map((_, j) => ({
                    id: `c-${i}-r-${j}`,
                    content: `這是對評論 #${i + 1} 的第 ${j + 1} 則回覆。`,
                    author: { id: `u-r-${i}-${j}`, name: `Replier ${j + 1}`, avatar: '', level_tag: 'Member' },
                    created_at: new Date(Date.now() - i * 3600000 + (j + 1) * 60000).toISOString(),
                    like_count: Math.floor(Math.random() * 5),
                    reply_count: 0,
                    is_author: false,
                    is_like: false
                }))
            };
        });

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
        const comments = Array.from({ length: 30 }).map((_, i) => {
            const reply_count = (i + page) % 4 === 0 ? 3 : 0;
            return {
                id: `c-more-${page}-${i}`,
                content: `這是第 ${page} 頁的評論 #${i + 1} - 湖人總冠軍！`,
                author: { id: `u-${page}-${i}`, name: `Fan ${page}-${i}`, avatar: '', level_tag: 'Member' },
                created_at: new Date().toISOString(),
                like_count: Math.floor(Math.random() * 20),
                reply_count: reply_count,
                is_author: false,
                is_like: false,
                replies: Array.from({ length: reply_count }).map((_, j) => ({
                    id: `c-more-${page}-${i}-r-${j}`,
                    content: `這是分頁評論的回覆 ${j + 1}`,
                    author: { id: `u-r-more-${page}-${i}-${j}`, name: `User ${j}`, avatar: '', level_tag: 'Fan' },
                    created_at: new Date().toISOString(),
                    like_count: 0,
                    reply_count: 0,
                    is_author: false,
                    is_like: false
                }))
            };
        });

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
