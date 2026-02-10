import { AdBanner } from '@/components/shared/AdBanner';
import { NewsHotGrid } from '@/components/news/NewsHotGrid';
import { SportApi } from '@/services/api';

export default async function AnalysisCategoryPage({ params }: { params: { category: string } }) {
    const { category } = await params;
    const response = await SportApi.getAnalysisData(category);
    const data = response.data;

    return (
        <div className="min-h-screen bg-slate-50 pt-32">
            <div className="container mx-auto px-6">
                <AdBanner ads={data.top_ad} position="TOP" />

                <section className="mb-24">
                    <div className="mb-12 border-b-4 border-brand-primary pb-4 inline-block">
                        <h2 className="text-3xl font-black text-brand-heading tracking-tight italic uppercase">
                            {category.toUpperCase()} 專業分析
                        </h2>
                    </div>

                    <NewsHotGrid posts={data.latest_news} />
                </section>
            </div>
        </div>
    );
}
