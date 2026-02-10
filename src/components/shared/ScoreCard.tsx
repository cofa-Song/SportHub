import React from 'react';
import { Card } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';
import { MatchScoreDTO } from '@/types';

import { useTranslation } from '@/lib/i18n/LanguageProvider';

interface ScoreCardProps {
    match?: MatchScoreDTO;
    isLoading?: boolean;
}

/**
 * ScoreCard component for displaying real-time or upcoming match data.
 */
export const ScoreCard: React.FC<ScoreCardProps> = ({ match, isLoading }) => {
    const { t } = useTranslation();

    if (isLoading || !match) {
        return (
            <Card className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-12" />
                </div>
                <div className="flex items-center justify-between gap-8">
                    <div className="flex flex-col items-center gap-2">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-8 w-16" />
                    <div className="flex flex-col items-center gap-2">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                </div>
            </Card>
        );
    }

    const isLive = match.status === 'LIVE';

    return (
        <Card className="relative overflow-hidden group border-slate-100">
            {isLive && (
                <div className="absolute top-0 right-0 px-3 py-1 bg-red-500 text-[10px] font-black text-white uppercase tracking-wider rounded-bl-lg animate-pulse">
                    {t.common.live}
                </div>
            )}

            <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-brand-primary opacity-80 uppercase tracking-widest">{match.league_name}</span>
                <span className="text-[10px] font-medium text-slate-400">{match.current_period}</span>
            </div>

            <div className="flex items-center justify-between gap-4">
                {/* Home Team */}
                <div className="flex-1 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <span className="text-lg font-bold text-brand-heading">{match.home_team.name[0]}</span>
                    </div>
                    <span className="text-sm font-bold truncate w-full text-brand-heading">{match.home_team.name}</span>
                </div>

                {/* Score */}
                <div className="flex flex-col items-center justify-center min-w-[80px]">
                    <div className="text-2xl font-black tracking-tighter flex items-center gap-2">
                        <span className={isLive ? 'text-brand-heading' : 'text-slate-300'}>{match.home_team.score}</span>
                        <span className="text-slate-200 text-lg">-</span>
                        <span className={isLive ? 'text-brand-heading' : 'text-slate-300'}>{match.away_team.score}</span>
                    </div>
                    {match.status === 'PRE' && (
                        <span className="text-[10px] font-bold text-brand-primary mt-1 uppercase tracking-widest">
                            {t.common.upcoming}
                        </span>
                    )}
                </div>

                {/* Away Team */}
                <div className="flex-1 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <span className="text-lg font-bold text-brand-heading">{match.away_team.name[0]}</span>
                    </div>
                    <span className="text-sm font-bold truncate w-full text-brand-heading">{match.away_team.name}</span>
                </div>
            </div>
        </Card>
    );
};


