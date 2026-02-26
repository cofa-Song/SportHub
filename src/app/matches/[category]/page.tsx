import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AdBanner } from '@/components/shared/AdBanner';
import { ScoreCard } from '@/components/shared/ScoreCard';
import { SportApi } from '@/services/api';

export async function generateStaticParams() {
    return [
        { category: 'basketball' },
        { category: 'baseball' },
        { category: 'football' },
        { category: 'tennis' },
        { category: 'esports' }
    ];
}

export default async function MatchCategoryPage({ params }: { params: { category: string } }) {
    const { category } = await params;
    const response = await SportApi.getMatchesHallData(category);
    const data = response.data;

    return (
        <div className="min-h-screen bg-slate-50 pt-32">
            <div className="container mx-auto px-6">
                <AdBanner ads={data.top_ad} position="TOP" />

                <section className="mb-24">
                    <div className="mb-12 border-b-4 border-brand-primary pb-4 inline-block">
                        <h2 className="text-3xl font-black text-brand-heading tracking-tight italic uppercase">
                            {category.toUpperCase()} 賽事數據
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...data.live_matches, ...data.upcoming_matches].map((match) => (
                            <ScoreCard key={match.match_id} match={match} />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
