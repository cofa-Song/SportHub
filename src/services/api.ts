import {
    MatchScoreDTO, ArticleDTO, ArticleDetailDTO, CommentDTO, ApiResponse,
    BannerDTO, AdDTO, HomeData, NewsData, SportType, MatchStatus,
    AuthorListItemDTO, PaginatedResponse, User, CreatorStatsDTO,
    AnalyticsReportDTO, AnalyticsItemDTO
} from '@/types';
import {
    subDays, subMonths, format, startOfWeek,
    startOfMonth, eachDayOfInterval, eachWeekOfInterval,
    eachMonthOfInterval, subYears
} from 'date-fns';

/**
 * Base API Service.
 * Modularized for easy expansion and future Go backend integration.
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const ASSET_PATH = '/SportHub/img/home/db1a163c-c47d-4442-a6b7-2467c0b7ec5c';

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
    { id: 'auth-1', name: '張大衛', level_tag: '資深球評', avatar: '', bio: '專精於 MLB 與中職賽事分析，擁有超過 15 年的球評經驗與獨到的戰術見解。' },
    { id: 'auth-2', name: '李小青', level_tag: '數據專家', avatar: '', bio: '以進階數據為核心，深入探討 NBA 與各國職籃的戰術趨勢與球員發展空間。' },
    { id: 'auth-3', name: '王教練', level_tag: '戰術分析師', avatar: '', bio: '前職業籃球員，退役後轉任球評，擅長拆解複雜防守陣型與戰術跑位。' },
    { id: 'auth-4', name: '陳運動', level_tag: '專欄作家', avatar: '', bio: '長期關注國際體育賽事與田徑項目，帶您看見賽場背後動人的運動員故事。' },
    { id: 'auth-5', name: 'Sarah Wu', level_tag: '特約記者', avatar: '', bio: '旅居海外多年的駐外記者，為您帶來第一手的大聯盟與歐洲足球賽事現場報導。' },
    { id: 'auth-6', name: '王大力', level_tag: '運動防護員', avatar: '', bio: '專業運動防護與體能訓練，分享最新運動科學知識。' },
    { id: 'auth-7', name: '林編輯', level_tag: '編輯', avatar: '', bio: '聚焦熱門話題，提供最快速、最準確的國內外新聞總結。' },
    { id: 'auth-8', name: 'Jacky Chen', level_tag: '名人堂', avatar: '', bio: '殿堂級體育專欄作家，曾五度獲得年度最佳體育新聞獎。' },
    { id: 'auth-9', name: '阿Ken', level_tag: '新銳作家', avatar: '', bio: '熱愛各種運動裝備評測，帶你找到最適合的戰靴與球具。' },
    { id: 'auth-10', name: '球迷阿龍', level_tag: '熱血球迷', avatar: '', bio: '從死忠球迷視角出發，用最接地氣的文字寫出對球隊的熱愛與期待。' },
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

        // Determine League
        let league = undefined;
        if (category === 'Baseball') {
            league = i % 2 === 0 ? 'MLB' : 'CPBL';
        } else if (category === 'Basketball') {
            league = 'NBA';
        }

        return {
            id: `${prefix}-${i + 1}`,
            title: title,
            excerpt: type === 'ANALYSIS' ? '這是一篇深度分析文章的摘要，探討了相關議題的深層原因與影響...' : '這是一則即時新聞的快訊，為您帶來最新的第一手報導...',
            cover_url: `${ASSET_PATH}/${coverSuffix}`,
            author: author,
            created_at: new Date(Date.now() - Math.floor(Math.random() * 86400000 * 7)).toISOString(), // Last 7 days
            category: category,
            league: league,
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

        const isAnalysis = id.includes('analysis') || id.includes('my-art') || Math.random() > 0.5;
        const type = isAnalysis ? 'ANALYSIS' : 'NEWS';

        const article = generateArticles(1, 'post', { type })[0] as ArticleDetailDTO;
        article.id = id; // Ensure ID matches

        // For our specific mock IDs, we can provide set titles if they are in our list
        if (id.startsWith('my-art-')) {
            const idx = parseInt(id.replace('my-art-', '')) - 1;
            const myTitles = [
                "【深入解析】2026 NBA 總決賽戰力評比：誰能阻擋衛冕軍？",
                "大谷翔平再進化？數據告訴你為什麼他依然是聯盟第一人",
                "中職賽季回顧：味全龍奪冠背後的重建之路",
                "戰術板：現代足球的高位壓迫是如何改變比賽節奏的？",
                "CPBL 潛力新秀觀察清單：下一個王柏融在哪裡？",
                "轉世天才？探討文班亞馬對馬刺隊防守體系的質變",
                "MLB 季後賽預測：為什麼道奇隊今年最有冠軍相？",
                "電競專欄：LoL 世界大賽版本強勢英雄深度分析",
                "網球快訊：網壇新三巨頭時代正式來臨？",
                "心理素質：如何在關鍵的第七場比賽維持高水準表現",
                "【專題報導】那些被傷病帶走的體育天才們",
                "NBA 薪資空間專題：哪些球隊在自由市場大獲全勝？",
                "中職啦啦隊文化：如何成功帶動球場氛圍與產值？",
                "進階數據看球：為什麼這名球員的正負值被嚴重低估？",
                "世界盃資格賽展望：中華男籃的優勢與隱憂分析"
            ];
            if (myTitles[idx]) article.title = myTitles[idx];
        }
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

    /**
     * Get Authors Group Data
     */
    getAuthorsGroupData: async (
        page = 1,
        limit = 12,
        sortBy: 'all' | 'top20' = 'all',
        category?: string,
        keyword?: string
    ): Promise<ApiResponse<PaginatedResponse<AuthorListItemDTO>>> => {
        await delay(500);

        // Generate a larger list by repeating authors for demo pagination purposes
        let authorsList: AuthorListItemDTO[] = [];

        const mockCategory = category && category !== '全部' ?
            (category === '籃球' ? 'Basketball' : category === '棒球' ? 'Baseball' : undefined) : undefined;

        for (let i = 0; i < 48; i++) {
            const baseAuthor = MOCK_AUTHORS[i % MOCK_AUTHORS.length];
            const authorId = `${baseAuthor.id}-dup-${i}`;

            // Filter by keyword if provided
            if (keyword && !baseAuthor.name.toLowerCase().includes(keyword.toLowerCase())) {
                continue;
            }

            // Randomly assign categories if not filtering, or force category if filtering
            const currCategory = mockCategory || (i % 2 === 0 ? 'Basketball' : 'Baseball');

            // Generate some latest articles for this author
            const latestArticles = generateArticles(4, `author-art-${i}`, {
                type: 'ANALYSIS',
                category: currCategory
            });

            // Make up some fake stats based on index (so first few have more)
            const views = Math.floor(Math.random() * 50000) + (50 - i) * 10000;
            const subs = Math.floor(Math.random() * 2000) + (50 - i) * 500;

            authorsList.push({
                author: { ...baseAuthor, id: authorId },
                latest_articles: latestArticles,
                stats: {
                    monthly_views: views,
                    followers: subs
                }
            });
        }

        if (sortBy === 'top20') {
            // Sort by monthly views descending
            authorsList.sort((a, b) => b.stats.monthly_views - a.stats.monthly_views);
        }

        const totalItems = authorsList.length;
        const totalPages = Math.ceil(totalItems / limit);
        const start = (page - 1) * limit;
        const pagedData = authorsList.slice(start, start + limit);

        return {
            status: 200,
            data: {
                data: pagedData,
                current_page: page,
                total_pages: totalPages
            }
        };
    },

    /**
     * Auth Methods
     */
    login: async (username: string, password: string): Promise<ApiResponse<User>> => {
        await delay(800);
        // Test account
        if (username === 'aerixc001' && password === 'Aerixc001') {
            const user: User = {
                id: 'u-preset-1',
                username: 'aerixc001',
                name: 'Aerix 測試員',
                avatar: '',
                email: 'aerixc001@example.com',
                email_verified: true,
                gender: 'MALE',
                birthday: '1995-01-01',
                phone: '0912345678',
                phone_verified: true,
                bio: '哈囉！我是預設的測試帳號。',
                fb_link: 'https://facebook.com/aerix',
                ig_link: 'https://instagram.com/aerix',
                yt_link: 'https://youtube.com/@aerix'
            };
            localStorage.setItem('sporthub_user', JSON.stringify(user));
            return { status: 200, data: user, message: '登入成功' };
        }

        // Check localStorage for registered users
        const stored = localStorage.getItem('sporthub_users_db');
        const users: User[] = stored ? JSON.parse(stored) : [];
        const found = users.find(u => u.username === username && u.password === password);

        if (found) {
            localStorage.setItem('sporthub_user', JSON.stringify(found));
            return { status: 200, data: found, message: '登入成功' };
        }

        return { status: 401, data: null as any, message: '帳號或密碼錯誤' };
    },

    register: async (data: Omit<User, 'id' | 'name' | 'avatar'>): Promise<ApiResponse<User>> => {
        await delay(800);
        const newUser: User = {
            ...data,
            id: `u-${Date.now()}`,
            name: `跑者${Math.floor(Math.random() * 9000) + 1000}`,
            avatar: ''
        };

        // Save to mock DB
        const stored = localStorage.getItem('sporthub_users_db');
        const users: User[] = stored ? JSON.parse(stored) : [];
        users.push(newUser);
        localStorage.setItem('sporthub_users_db', JSON.stringify(users));
        localStorage.setItem('sporthub_user', JSON.stringify(newUser));

        return { status: 200, data: newUser, message: '註冊成功' };
    },

    updateProfile: async (userId: string, data: Partial<User>): Promise<ApiResponse<User>> => {
        await delay(800);
        const current = localStorage.getItem('sporthub_user');
        if (!current) return { status: 401, data: null as any, message: '未登入' };

        const user = JSON.parse(current);
        const updated = { ...user, ...data };
        localStorage.setItem('sporthub_user', JSON.stringify(updated));

        // Update in mock DB as well
        const stored = localStorage.getItem('sporthub_users_db');
        if (stored) {
            let users: User[] = JSON.parse(stored);
            users = users.map(u => u.id === userId ? { ...u, ...data } : u);
            localStorage.setItem('sporthub_users_db', JSON.stringify(users));
        }

        return { status: 200, data: updated, message: '資料更新成功' };
    },

    getCurrentUser: (): User | null => {
        if (typeof window === 'undefined') return null;
        const current = localStorage.getItem('sporthub_user');
        return current ? JSON.parse(current) : null;
    },

    logout: () => {
        localStorage.removeItem('sporthub_user');
    },

    sendVerificationCode: async (target: string, type: 'email' | 'phone'): Promise<ApiResponse<null>> => {
        await delay(1000);
        console.log(`[Mock] Sending verification code to ${target} via ${type}`);
        return { status: 200, data: null, message: '驗證碼已發送' };
    },

    verifyCode: async (target: string, code: string, type: 'email' | 'phone'): Promise<ApiResponse<null>> => {
        await delay(1000);
        if (code === '123456') {
            const current = SportApi.getCurrentUser();
            if (current) {
                if (type === 'email') {
                    current.email = target;
                    current.email_verified = true;
                } else {
                    current.phone = target;
                    current.phone_verified = true;
                }
                localStorage.setItem('sporthub_user', JSON.stringify(current));
            }
            return { status: 200, data: null, message: '綁定成功' };
        }
        return { status: 400, data: null, message: '驗證碼錯誤 or 已過期' };
    },

    /**
     * Subscriptions
     */
    createSubscriptionOrder: async (planType: 'monthly' | 'yearly'): Promise<ApiResponse<{ checkout_url: string }>> => {
        await delay(800);
        const user = SportApi.getCurrentUser();
        if (!user) return { status: 401, data: null as any, message: '未登入' };

        // Mock saving a pending order here if needed
        return {
            status: 200,
            data: { checkout_url: '/checkout-simulation' },
            message: '訂單建立成功，準備跳轉金流'
        };
    },

    mockWebhookPaymentSuccess: async (): Promise<ApiResponse<User>> => {
        await delay(1000);
        const user = SportApi.getCurrentUser();
        if (!user) return { status: 401, data: null as any, message: '未登入' };

        // 模擬剛購買月費
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);

        const updatedData: Partial<User> = {
            is_ad_free: true,
            subscription_status: 'active',
            subscription_end_date: endDate.toISOString()
        };

        return await SportApi.updateProfile(user.id, updatedData);
    },

    cancelSubscription: async (): Promise<ApiResponse<User>> => {
        await delay(800);
        const user = SportApi.getCurrentUser();
        if (!user) return { status: 401, data: null as any, message: '未登入' };

        // 保持 ad_free 權限，僅改變狀態為 canceled
        const updatedData: Partial<User> = {
            subscription_status: 'canceled'
        };

        return await SportApi.updateProfile(user.id, updatedData);
    },

    /**
     * Creator Studio: Get Personal Stats
     */
    getCreatorStats: async (): Promise<ApiResponse<CreatorStatsDTO>> => {
        await delay(600);
        return {
            status: 200,
            data: {
                total_articles: 124,
                total_views: 45800,
                total_collections: 1205,
                account_days: 365,
                followers_count: 850,
                followed_articles: 42,
                total_comments: 312
            }
        };
    },

    /**
     * Creator Studio: Get Top 10 Articles
     */
    getCreatorTopArticles: async (): Promise<ApiResponse<ArticleDTO[]>> => {
        await delay(500);
        const articles = generateArticles(10, 'top-art', { type: 'ANALYSIS' });
        // Sort by view count descending for "Top 10" feel
        articles.sort((a, b) => b.view_count - a.view_count);
        return { status: 200, data: articles };
    },

    /**
     * Creator Studio: Get Latest Comments on user's posts
     */
    getCreatorLatestComments: async (): Promise<ApiResponse<CommentDTO[]>> => {
        await delay(500);
        const comments = Array.from({ length: 5 }).map((_, i) => ({
            id: `creator-c-${i}`,
            content: `這篇文章分析得太到位了！對於${i % 2 === 0 ? '季後賽' : '球員交易'}的看法我也深有同感。`,
            author: { id: `u-fan-${i}`, name: `熱心讀者 ${i + 1}`, avatar: '', level_tag: '鑽石粉絲' },
            created_at: new Date(Date.now() - i * 7200000).toISOString(),
            like_count: Math.floor(Math.random() * 10),
            reply_count: 0,
            is_author: false,
            is_like: false,
            article_id: `top-art-${i + 1}`,
            article_title: MOCK_ANALYSIS_TITLES[i % MOCK_ANALYSIS_TITLES.length]
        }));
        return { status: 200, data: comments };
    },

    /**
     * Creator Studio: Create New Article
     */
    createArticle: async (data: Partial<ArticleDTO>): Promise<ApiResponse<ArticleDTO>> => {
        await delay(1000);
        const user = SportApi.getCurrentUser();
        const newArticle: ArticleDTO = {
            id: `post-new-${Date.now()}`,
            title: data.title || '無標題文章',
            excerpt: data.excerpt || '文章摘要...',
            cover_url: data.cover_url || `${ASSET_PATH}/hero_nba_finals_1770628434041.png`,
            author: {
                id: user?.id || 'u-unknown',
                name: user?.name || '匿名作者',
                avatar: user?.avatar || '',
                level_tag: '駐站作家'
            },
            created_at: new Date().toISOString(),
            category: data.category || 'Basketball',
            league: data.league,
            comment_count: 0,
            view_count: 0,
            share_count: 0,
            collect_count: 0,
            type: data.type || 'ANALYSIS',
            target_url: `/post/post-new-${Date.now()}`
        };

        // In a real mock DB, we'd push this to an array. 
        // For now, we just return it as success.
        return { status: 200, data: newArticle, message: '發表成功' };
    },

    /**
     * Creator Studio: Draft Management
     */
    getDrafts: async (): Promise<ApiResponse<ArticleDTO[]>> => {
        await delay(500);
        if (typeof window === 'undefined') return { status: 200, data: [] };
        const stored = localStorage.getItem('sporthub_drafts');
        if (stored) return { status: 200, data: JSON.parse(stored) };

        // Seed initial drafts for simulation
        const initialDrafts: ArticleDTO[] = [
            {
                id: 'draft-welcome-1',
                title: '【草稿】我的第一篇體育評論：從數據看中職新賽季',
                excerpt: '這是一篇關於中職新賽季的分析草稿...',
                content: '這是在編輯器中儲存的文章內容...',
                cover_url: `${ASSET_PATH}/hero_mlb_game_1770628451873.png`,
                author: { id: 'u-1', name: '測試作者', avatar: '', level_tag: '註站作家' },
                created_at: new Date().toISOString(),
                category: 'Baseball',
                league: 'CPBL',
                comment_count: 0,
                view_count: 0,
                share_count: 0,
                collect_count: 0,
                type: 'ANALYSIS',
                target_url: ''
            },
            {
                id: 'draft-welcome-2',
                title: 'Draft: NBA Playoffs 2026 Predictions',
                excerpt: 'Initial thoughts on who will win...',
                content: 'Starting point for the playoff analysis...',
                cover_url: `${ASSET_PATH}/hero_nba_finals_1770628434041.png`,
                author: { id: 'u-1', name: '測試作者', avatar: '', level_tag: '駐站作家' },
                created_at: new Date(Date.now() - 3600000).toISOString(),
                category: 'Basketball',
                league: 'NBA',
                comment_count: 0,
                view_count: 0,
                share_count: 0,
                collect_count: 0,
                type: 'ANALYSIS',
                target_url: ''
            }
        ];
        return { status: 200, data: initialDrafts };
    },

    saveDraft: async (data: Partial<ArticleDTO>): Promise<ApiResponse<ArticleDTO>> => {
        await delay(800);
        if (typeof window === 'undefined') return { status: 400, data: null as any };

        const stored = localStorage.getItem('sporthub_drafts');
        let drafts: ArticleDTO[] = stored ? JSON.parse(stored) : [];

        const user = SportApi.getCurrentUser();
        const draftId = data.id || `draft-${Date.now()}`;

        const newDraft: ArticleDTO = {
            id: draftId,
            title: data.title || '',
            excerpt: data.excerpt || '',
            content: (data as any).content || '', // Handle content which isn't in ArticleDTO normally
            cover_url: data.cover_url || '',
            author: {
                id: user?.id || 'u-unknown',
                name: user?.name || '匿名作者',
                avatar: user?.avatar || '',
                level_tag: '駐站作家'
            },
            created_at: data.created_at || new Date().toISOString(),
            category: data.category || 'Basketball',
            league: data.league || '全部',
            comment_count: 0,
            view_count: 0,
            share_count: 0,
            collect_count: 0,
            type: data.type || 'ANALYSIS',
            target_url: '#'
        };

        const existingIndex = drafts.findIndex(d => d.id === draftId);
        if (existingIndex >= 0) {
            drafts[existingIndex] = newDraft;
        } else {
            drafts.unshift(newDraft);
        }

        localStorage.setItem('sporthub_drafts', JSON.stringify(drafts));
        return { status: 200, data: newDraft, message: '草稿儲存成功' };
    },

    deleteDraft: async (id: string): Promise<ApiResponse<null>> => {
        await delay(500);
        if (typeof window === 'undefined') return { status: 400, data: null };

        const stored = localStorage.getItem('sporthub_drafts');
        if (stored) {
            let drafts: ArticleDTO[] = JSON.parse(stored);
            drafts = drafts.filter(d => d.id !== id);
            localStorage.setItem('sporthub_drafts', JSON.stringify(drafts));
        }
        return { status: 200, data: null, message: '草稿已刪除' };
    },

    /**
     * Creator Studio: Published Article Management
     */
    getMyArticles: async (params: {
        category?: string,
        league?: string,
        query?: string,
        status?: string,
        page?: number
    }): Promise<ApiResponse<PaginatedResponse<ArticleDTO>>> => {
        await delay(800);
        const user = SportApi.getCurrentUser() || { id: 'u-1', name: '測試作者', avatar: '', level_tag: '駐站作家' };

        // Define a set of specific titles for the creator's portfolio to make it look "real"
        const myTitles = [
            "【深入解析】2026 NBA 總決賽戰力評比：誰能阻擋衛冕軍？",
            "大谷翔平再進化？數據告訴你為什麼他依然是聯盟第一人",
            "中職賽季回顧：味全龍奪冠背後的重建之路",
            "戰術板：現代足球的高位壓迫是如何改變比賽節奏的？",
            "CPBL 潛力新秀觀察清單：下一個王柏融在哪裡？",
            "轉世天才？探討文班亞馬對馬刺隊防守體系的質變",
            "MLB 季後賽預測：為什麼道奇隊今年最有冠軍相？",
            "電競專欄：LoL 世界大賽版本強勢英雄深度分析",
            "網球快訊：網壇新三巨頭時代正式來臨？",
            "心理素質：如何在關鍵的第七場比賽維持高水準表現",
            "【專題報導】那些被傷病帶走的體育天才們",
            "NBA 薪資空間專題：哪些球隊在自由市場大獲全勝？",
            "中職啦啦隊文化：如何成功帶動球場氛圍與產值？",
            "進階數據看球：為什麼這名球員的正負值被嚴重低估？",
            "世界盃資格賽展望：中華男籃的優勢與隱憂分析"
        ];

        // Generate mock data specifically for "Me"
        let myArticles: ArticleDTO[] = myTitles.map((title, idx) => {
            const category = idx % 3 === 0 ? 'Basketball' : idx % 3 === 1 ? 'Baseball' : 'Others';
            const league = category === 'Basketball' ? 'NBA' : category === 'Baseball' ? (idx % 2 === 0 ? 'MLB' : 'CPBL') : undefined;
            const status: 'PUBLISHED' | 'ARCHIVED' | 'DRAFT' = idx === 0 ? 'DRAFT' : idx % 5 === 0 ? 'ARCHIVED' : 'PUBLISHED';

            return {
                id: `my-art-${idx + 1}`,
                title: title,
                excerpt: "這是我撰寫的專業分析文章摘要，內容涵蓋了賽事的關鍵數據與戰術分析...",
                cover_url: `${ASSET_PATH}/${category === 'Basketball' ? 'hero_nba_finals_1770628434041.png' : 'hero_mlb_game_1770628451873.png'}`,
                author: {
                    id: user.id || 'u-1',
                    name: user.name || '測試作者',
                    avatar: user.avatar || '',
                    level_tag: '駐站作家'
                },
                created_at: new Date(Date.now() - (idx * 86400000 * 2)).toISOString(),
                updated_at: new Date(Date.now() - (idx * 3600000 * 2)).toISOString(),
                category: category,
                league: league,
                status: status,
                comment_count: Math.floor(Math.random() * 80) + 10,
                view_count: Math.floor(Math.random() * 20000) + 5000,
                share_count: Math.floor(Math.random() * 100),
                collect_count: Math.floor(Math.random() * 500),
                type: 'ANALYSIS',
                target_url: `/post/my-art-${idx + 1}`,
                source: undefined
            };
        });

        // Apply search/filters
        if (params.query) {
            const q = params.query.toLowerCase();
            myArticles = myArticles.filter((art: ArticleDTO) => art.title.toLowerCase().includes(q));
        }
        if (params.category && params.category !== '全部') {
            myArticles = myArticles.filter((art: ArticleDTO) => art.category === params.category);
        }
        if (params.league && params.league !== '全部') {
            myArticles = myArticles.filter((art: ArticleDTO) => art.league === params.league);
        }
        if (params.status && params.status !== '全部') {
            myArticles = myArticles.filter((art: ArticleDTO) => art.status === params.status);
        }

        const pageSize = 10;
        const page = params.page || 1;
        const totalPages = Math.ceil(myArticles.length / pageSize);
        const start = (page - 1) * pageSize;
        const data = myArticles.slice(start, start + pageSize);

        return {
            status: 200,
            data: {
                data,
                total_pages: totalPages,
                current_page: page
            }
        };
    },

    deleteArticle: async (id: string): Promise<ApiResponse<null>> => {
        await delay(500);
        // In this mock, we just return success
        return { status: 200, data: null, message: '文章已刪除' };
    },

    /**
     * Creator Studio: Analytics Reports
     */
    getAnalyticsReport: async (params: {
        range: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR',
        startDate?: string,
        endDate?: string
    }): Promise<ApiResponse<AnalyticsReportDTO>> => {
        await delay(1000);

        const endDate = params.endDate ? new Date(params.endDate) : new Date();
        let startDate: Date;
        let intervals: Date[] = [];
        let dateFormat = 'MM/dd';

        switch (params.range) {
            case 'DAY':
                startDate = params.startDate ? new Date(params.startDate) : subDays(endDate, 30);
                intervals = eachDayOfInterval({ start: startDate, end: endDate });
                dateFormat = 'MM/dd';
                break;
            case 'WEEK':
                startDate = params.startDate ? new Date(params.startDate) : subMonths(endDate, 3);
                intervals = eachWeekOfInterval({ start: startDate, end: endDate });
                dateFormat = 'MM/dd';
                break;
            case 'MONTH':
                startDate = params.startDate ? new Date(params.startDate) : subYears(endDate, 1);
                intervals = eachMonthOfInterval({ start: startDate, end: endDate });
                dateFormat = 'yyyy/MM';
                break;
            case 'YEAR':
                startDate = params.startDate ? new Date(params.startDate) : subYears(endDate, 5);
                // Simple manually generated years
                for (let i = startDate.getFullYear(); i <= endDate.getFullYear(); i++) {
                    intervals.push(new Date(i, 0, 1));
                }
                dateFormat = 'yyyy';
                break;
            default:
                startDate = subDays(endDate, 30);
                intervals = eachDayOfInterval({ start: startDate, end: endDate });
        }

        let currentFollowers = Math.floor(Math.random() * 500) + 1000;

        const chart_data: AnalyticsItemDTO[] = intervals.map((date, idx) => {
            // Generate some "organic" looking growth
            const baseMultiplier = idx + 1;
            const volatility = Math.random() * 0.5 + 0.5; // 0.5 to 1.0

            const growth = Math.floor(Math.random() * 20) - 2; // -2 to 17
            currentFollowers = Math.max(0, currentFollowers + growth);

            return {
                date: format(date, dateFormat),
                posts: Math.floor(Math.random() * 3), // 0 to 2 posts per interval
                views: Math.floor(baseMultiplier * 500 * volatility) + 100,
                followers: currentFollowers
            };
        });

        return {
            status: 200,
            data: {
                summary: {
                    total_posts: chart_data.reduce((sum, item) => sum + item.posts, 0),
                    total_views: chart_data.reduce((sum, item) => sum + item.views, 0),
                    total_followers_growth: chart_data[chart_data.length - 1].followers,
                    posts_trend: 12.5,
                    views_trend: 24.8,
                    followers_trend: 8.2
                },
                chart_data
            }
        };
    }
};
