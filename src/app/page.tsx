import { HeroBanner } from '@/components/home/HeroBanner';
import { AdBanner } from '@/components/home/AdBanner';
import { HotArticlesGrid } from '@/components/home/HotArticlesGrid';
import { NewsCarousel } from '@/components/home/NewsCarousel';
import { FeaturedSpecials } from '@/components/home/FeaturedSpecials';
import { MainSectionSplit } from '@/components/home/MainSectionSplit';

export default function Home() {
  return (
    <div className="container mx-auto px-6">
      {/* 1. Banner Carousel (Hero) */}
      <HeroBanner />

      {/* 2. Horizontal Ad Section */}
      <AdBanner position="TOP" />

      {/* 3. Hot Articles Grid (3x2) */}
      <HotArticlesGrid />

      {/* 4. Latest News Carousel (4x2) */}
      <NewsCarousel />

      {/* 5. Featured Specials (Zigzag) */}
      <FeaturedSpecials />

      {/* 6. Main Content Split (Paginated Articles & Score Sidebar) */}
      <MainSectionSplit />

      {/* 7. Bottom Ad Section */}
      <AdBanner position="BOTTOM" />
    </div>
  );
}
