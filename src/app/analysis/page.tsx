import { AdBanner } from '@/components/shared/AdBanner';
import { NewsHotGrid } from '@/components/news/NewsHotGrid';
import { FeaturedNewsCards } from '@/components/news/FeaturedNewsCards';
import { SportApi } from '@/services/api';

export default async function AnalysisPage() {
    const response = await SportApi.getAnalysisData();
    const data = response.data;

    return (
        <div className="min-h-screen bg-slate-50 pt-32">
            <div className="container mx-auto px-6">
                {/* Top Ad */}
                <AdBanner ads={data.top_ad} position="TOP" />

                {/* Hot Analysis */}
                <NewsHotGrid posts={data.hot_news} />

                {/* Featured Analysis */}
                <FeaturedNewsCards news={data.featured_news} />

                {/* Latest Analysis (Reusing the same grid style for now) */}
                <section className="mt-20 mb-24">
                    <div className="mb-10 text-center">
                        <h2 className="text-4xl font-black text-brand-heading tracking-tighter uppercase italic">
                            最新分析文章
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {data.latest_news.map((item) => (
                            <div key={item.id} className="group cursor-pointer">
                                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden mb-6 shadow-lg">
                                    <img
                                        src={item.cover_url}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-brand-primary px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-widest">
                                            {item.category}
                                        </span>
                                    </div>
                                </div>
                                <h4 className="text-xl font-black text-brand-heading group-hover:text-brand-primary transition-colors line-clamp-2">
                                    {item.title}
                                </h4>
                                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-400">
                                        {new Date(item.created_at).toLocaleDateString()}
                                    </span>
                                    <span className="text-xs font-black text-brand-primary">READ MORE +</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
