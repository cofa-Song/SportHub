"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Match } from '@/types';
import { SportApi } from '@/services/api';
import { useTranslation } from '@/lib/i18n/LanguageProvider';

/**
 * Top Live Score Ticker.
 * Z-Index: 1000 (Spec Requirement)
 * Displays real-time scores with auto-scroll and hover-pause.
 */
export const LiveTicker: React.FC = () => {
    const [matches, setMatches] = useState<Match[]>([]);
    const [isPaused, setIsPaused] = useState(false);
    const [isConnecting, setIsConnecting] = useState(true);
    const [error, setError] = useState(false);
    const { t } = useTranslation();
    const scrollRef = useRef<HTMLDivElement>(null);

    const fetchTickerData = async () => {
        try {
            const res = await SportApi.getTickerMatches();
            if (res.status === 200) {
                setMatches(res.data);
                setError(false);
            } else {
                setError(true);
            }
        } catch (err) {
            setError(true);
        } finally {
            setIsConnecting(false);
        }
    };

    useEffect(() => {
        fetchTickerData();
        const interval = setInterval(fetchTickerData, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className="fixed top-0 left-0 right-0 h-10 bg-brand-heading text-white z-[1000] overflow-hidden border-b border-white/5 select-none"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="container mx-auto h-full flex items-center relative">
                <div className="absolute left-0 z-10 h-full flex items-center bg-brand-primary px-4 shadow-2xl">
                    <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                        {t.common.live}
                    </span>
                </div>

                <div className="flex-1 overflow-hidden ml-20 h-full flex items-center">
                    {isConnecting ? (
                        <div className="flex items-center gap-2 px-6 animate-pulse text-[11px] font-bold text-white/40">
                            <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
                            CONNECTING...
                        </div>
                    ) : error || matches.length === 0 ? (
                        <div className="px-6 text-[11px] font-bold text-white/40 flex items-center gap-4">
                            <span>今日無賽事安排 (NO MATCHES TODAY)</span>
                            <Link href="/matches" className="text-brand-primary hover:underline underline-offset-4">查看過往戰績</Link>
                        </div>
                    ) : (
                        <div
                            ref={scrollRef}
                            className={`flex items-center gap-12 whitespace-nowrap h-full px-4 ${isPaused ? '' : 'animate-ticker'}`}
                            style={{ width: 'max-content' }}
                        >
                            {[...matches, ...matches].map((match, idx) => (
                                <Link
                                    key={`${match.id}-${idx}`}
                                    href={`/match/${match.id}`}
                                    className="flex items-center gap-4 hover:text-brand-primary transition-colors h-full px-2 group"
                                >
                                    <span className="text-[10px] font-bold opacity-30 group-hover:opacity-100 transition-opacity uppercase tracking-tighter">
                                        {match.league}
                                    </span>

                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-black">{match.homeTeam.name}</span>
                                        <span className="text-sm font-black text-brand-primary font-mono">{match.homeTeam.score}</span>
                                        <span className="text-white/10">-</span>
                                        <span className="text-sm font-black text-brand-primary font-mono">{match.awayTeam.score}</span>
                                        <span className="text-sm font-black">{match.awayTeam.name}</span>
                                    </div>

                                    <div className="px-2 py-0.5 bg-white/5 rounded text-[9px] font-bold text-slate-500 group-hover:bg-brand-primary group-hover:text-white transition-all">
                                        {match.live_period || match.matchInfo}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
        .animate-ticker {
          animation: ticker 40s linear infinite;
        }
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
        </div>
    );
};
