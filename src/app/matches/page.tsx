import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AdBanner } from '@/components/shared/AdBanner';
import { ScoreCard } from '@/components/shared/ScoreCard';
import { SportApi } from '@/services/api';

export default async function MatchesPage() {
    const response = await SportApi.getMatchesHallData();
    const data = response.data;

    return (
        <div className="min-h-screen bg-slate-50 pt-32">
            <div className="container mx-auto px-6">
                {/* Top Ad */}
                <AdBanner ads={data.top_ad} position="TOP" />

                {/* Live Matches */}
                <section className="mb-16">
                    <div className="mb-8 border-b-4 border-red-500 pb-4 inline-block">
                        <h2 className="text-3xl font-black text-brand-heading tracking-tight italic uppercase">
                            直播中賽事 (Live)
                        </h2>
                    </div>
                    {data.live_matches.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {data.live_matches.map((match) => (
                                <ScoreCard key={match.match_id} match={match} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
                            <span className="text-slate-400 font-bold uppercase tracking-widest">目前無直播賽事</span>
                        </div>
                    )}
                </section>

                {/* Upcoming Matches */}
                <section className="mb-24">
                    <div className="mb-8 border-b-4 border-brand-primary pb-4 inline-block">
                        <h2 className="text-3xl font-black text-brand-heading tracking-tight italic uppercase">
                            即將進行 (Upcoming)
                        </h2>
                    </div>
                    {data.upcoming_matches.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {data.upcoming_matches.map((match) => (
                                <ScoreCard key={match.match_id} match={match} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
                            <span className="text-slate-400 font-bold uppercase tracking-widest">目前無即將進行的賽事</span>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
