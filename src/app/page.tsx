import { HeroBanner } from '@/components/home/HeroBanner';
import { AdBanner } from '@/components/shared/AdBanner';
import { HotArticlesGrid } from '@/components/home/HotArticlesGrid';
import { NewsCarousel } from '@/components/home/NewsCarousel';
import { FeaturedSpecials } from '@/components/home/FeaturedSpecials';
import { MainSectionSplit } from '@/components/home/MainSectionSplit';
import { SportApi } from '@/services/api';

export default async function Home() {
  // SSR Data Fetching
  const response = await SportApi.getHomeData();
  const data = response.data;

  return (
    <div className="container pt-10 mx-auto px-6">
      {/* 1. Banner Carousel (Hero) */}
      <HeroBanner banners={data.banners} />

      {/* 2. Horizontal Ad Section */}
      <AdBanner ads={data.ads_top} position="TOP" />

      {/* 3. Hot Articles Grid (3x2) */}
      <HotArticlesGrid posts={data.hot_picks} />

      {/* 4. Latest News Carousel (4x2) */}
      <NewsCarousel news={data.latest_news} />

      {/* 5. Featured Specials (Zigzag) */}
      <FeaturedSpecials specials={data.featured_topic} />

      {/* 6. Main Content Split (Paginated Articles & Score Sidebar) */}
      <MainSectionSplit
        initialPosts={data.latest_feed.data}
        initialMatches={data.live_stats}
        sideAds={data.ads_side}
      />

      {/* 7. Bottom Ad Section */}
      <AdBanner ads={data.ads_bottom} position="BOTTOM" />
    </div>
  );
}
