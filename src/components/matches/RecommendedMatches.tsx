'use client';

import React, { useRef, useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Flame, Users } from 'lucide-react';
import { MatchScoreDTO } from '@/types';

interface RecommendedMatchesProps {
    matches: MatchScoreDTO[];
    isLoading?: boolean;
}

export const RecommendedMatches: React.FC<RecommendedMatchesProps> = ({ matches, isLoading }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const onMouseDown = (e: React.MouseEvent) => {
        if (!scrollRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const onMouseUp = () => {
        setIsDragging(false);
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !scrollRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Scroll speed multiplier
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    return (
        <section className="w-screen relative left-1/2 -translate-x-1/2 bg-[#121212] py-8 md:py-12 mb-12">
            <div className="px-[5px] md:px-[10px] xl:px-[80px]">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-2 h-7 bg-brand-primary rounded-full shadow-lg shadow-brand-primary/30" />
                    <h2 className="text-2xl font-black text-white tracking-tight uppercase italic flex items-baseline gap-2">
                        推薦賽事
                        <span className="text-slate-500 text-sm not-italic font-bold tracking-widest opacity-60">RECOMMENDED EVENTS</span>
                    </h2>
                </div>

                <div
                    ref={scrollRef}
                    onMouseDown={onMouseDown}
                    onMouseUp={onMouseUp}
                    onMouseLeave={onMouseUp}
                    onMouseMove={onMouseMove}
                    className={`
                        flex items-stretch gap-6 overflow-x-auto no-scrollbar py-2
                        ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}
                    `}
                >
                    {isLoading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="min-w-[340px] md:min-w-[420px] aspect-[16/9] bg-white/5 animate-pulse rounded-2xl" />
                        ))
                    ) : (
                        matches.map((match) => (
                            <RecommendedMatchCard key={match.match_id} match={match} />
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

const RecommendedMatchCard: React.FC<{ match: MatchScoreDTO }> = ({ match }) => {
    const isLive = match.status === 'LIVE';

    return (
        <div className="min-w-[340px] md:min-w-[420px] aspect-[16/9] bg-[#1E1E1E] rounded-2xl overflow-hidden shadow-2xl transition-all group shrink-0 relative flex flex-col border border-white/[0.03] hover:border-brand-primary/30">
            {/* Header Area */}
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3 p-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 p-1.5 flex items-center justify-center border border-white/10 shadow-inner">
                        {match.league_logo_url ? (
                            <img src={match.league_logo_url} alt={match.league_name} className="w-full h-full object-contain" />
                        ) : (
                            <div className="w-full h-full bg-brand-primary/10 rounded-lg" />
                        )}
                    </div>
                    <div>
                        <div className="text-[15px] font-black text-white leading-tight line-clamp-1">{match.league_name}</div>
                        <div className="text-[11px] text-slate-500 mt-1 font-mono font-bold tracking-tight">
                            {format(new Date(match.match_time), 'yyyy.MM.dd HH:mm')}
                        </div>
                    </div>
                </div>

                {/* Hot/Live Badge */}
                {isLive && (
                    <div className="bg-[#BA1414] px-4 py-2 rounded-bl-3xl shadow-lg">
                        <div className="flex items-center gap-1.5">
                            <Flame className="w-4 h-4 text-[#FFCC22] fill-[#FFCC22]" />
                            <span className="text-[12px] font-black text-[#FFCC22] uppercase tracking-wider">熱播</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Core Match Display */}
            <div className="flex-1 flex items-center justify-between px-6 -mt-2">
                <div className="flex-1 flex flex-col items-center gap-3 text-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center p-3 border border-white/5 group-hover:scale-110 transition-transform shadow-xl">
                        <span className="text-2xl font-black text-white">{match.home_team.name[0]}</span>
                    </div>
                    <span className="text-[13px] font-black text-white truncate w-full px-2">{match.home_team.name}</span>
                </div>

                <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center justify-center bg-black py-3 px-6 rounded-2xl border border-white/10 shadow-inner min-w-[130px]">
                        <div className="text-3xl font-black text-white px-2 tracking-tighter tabular-nums">
                            {isLive ? match.home_team.score : '-'}
                        </div>
                        <div className="text-xl font-black text-brand-primary animate-pulse">:</div>
                        <div className="text-3xl font-black text-white px-2 tracking-tighter tabular-nums">
                            {isLive ? match.away_team.score : '-'}
                        </div>
                    </div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{isLive ? '進行中' : '尚未開始'}</span>
                </div>

                <div className="flex-1 flex flex-col items-center gap-3 text-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center p-3 border border-white/5 group-hover:scale-110 transition-transform shadow-xl">
                        <span className="text-2xl font-black text-white">{match.away_team.name[0]}</span>
                    </div>
                    <span className="text-[13px] font-black text-white truncate w-full px-2">{match.away_team.name}</span>
                </div>
            </div>

            {/* Sub-Footer */}
            <div className="h-12 px-5 flex items-center justify-between bg-black/20 mt-auto border-t border-white/[0.02]">
                <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[11px] font-black text-slate-300">1.2k</span>
                </div>
            </div>
        </div>
    );
};
