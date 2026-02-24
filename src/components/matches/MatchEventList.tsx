'use client';

import React from 'react';
import { MatchScoreDTO } from '@/types';
import { ScoreCard } from '../shared/ScoreCard';

interface MatchEventListProps {
    matches: MatchScoreDTO[];
    isLoading?: boolean;
}

export const MatchEventList: React.FC<MatchEventListProps> = ({ matches, isLoading }) => {
    if (isLoading) {
        return (
            <div className="bg-transparent gap-[5px] mb-[10px] pb-[10px] flex flex-col xl:rounded-b-[16px]">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="animate-pulse h-[80px] bg-slate-200 rounded-[8px] mt-[5px]" />
                ))}
            </div>
        );
    }

    if (matches.length === 0) {
        return (
            <div className="bg-white rounded-[16px] p-20 text-center border border-slate-100 shadow-sm mt-[5px]">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl text-slate-300">📅</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">暫無賽事數據</h3>
                <p className="text-slate-500 font-medium">請切換日期或篩選條件試試看</p>
            </div>
        );
    }

    return (
        <div className="bg-transparent gap-[5px] mb-[10px] pb-[10px] flex flex-col xl:rounded-b-[16px]">
            {/* hidden element matching HTML structure */}
            <div className="xl:hidden"></div>

            {matches.map((match) => (
                <ScoreCard key={match.match_id} match={match} />
            ))}

            {/* For pagination, you can add it here or in the parent component based on requirements */}
        </div>
    );
};
