'use client';

import React from 'react';
import { format } from 'date-fns';
import { MatchScoreDTO } from '@/types';

interface ScoreCardProps {
    match: MatchScoreDTO;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ match }) => {
    const isLive = match.status === 'LIVE';
    const isFinished = match.status === 'FINAL';
    const isUpcoming = match.status === 'PRE';

    return (
        <div className="gap-[5px] p-[5px] rounded-[8px] cursor-pointer flex-col items-center justify-center bg-white flex hover:bg-slate-50 transition-colors border border-slate-100 shadow-sm mt-[5px]">
            <div className="gap-[5px] flex w-full cursor-pointer items-center">
                <div className="h-full">
                    {isLive && (
                        <div className="bg-red-500/10 px-[10px] rounded-[2px] h-full flex items-center">
                            <span className="font-sans leading-[18px] text-[12px] my-auto font-bold text-red-500 tracking-wider"> LIVE </span>
                        </div>
                    )}
                    {isUpcoming && (
                        <div className="font-sans leading-[22px] text-[14px] text-nowrap text-center font-bold text-slate-800">
                            {format(new Date(match.match_time), 'HH:mm')}
                        </div>
                    )}
                    {isFinished && (
                        <div className="bg-slate-100 font-sans leading-[22px] text-[14px] w-[45px] text-nowrap text-center font-bold text-slate-500 flex items-center justify-center rounded-[2px] h-full px-1">
                            <span className="font-sans leading-[18px] text-[12px] text-slate-400 my-auto font-bold tracking-wider"> END </span>
                        </div>
                    )}
                </div>
                <div className="gap-[5px] flex flex-1 items-center">
                    <div className="size-[20px] flex items-center justify-center bg-slate-50 rounded overflow-hidden">
                        {match.league_logo_url ? (
                            <img className="size-full object-contain" alt={match.league_name} src={match.league_logo_url} title={match.league_name} />
                        ) : (
                            <span className="text-[10px] text-slate-300 font-bold">{match.league_name.charAt(0)}</span>
                        )}
                    </div>
                    <h4 className="font-sans leading-[18px] text-[12px] line-clamp-1 break-all text-slate-700 md:text-[14px] md:leading-[22px] font-bold">
                        {match.league_name}
                    </h4>
                </div>
            </div>

            <div className="grid w-full grid-cols-3 mt-1">
                <div className="gap-[5px] flex items-center py-[4px] justify-between md:justify-end">
                    <div className="font-sans leading-[18px] text-[12px] line-clamp-1 break-all font-black text-slate-900 md:text-[16px] md:leading-[25px]">
                        {match.home_team.name}
                    </div>
                    <div className="size-[30px] rounded-full overflow-hidden bg-slate-100 flex-shrink-0 flex items-center justify-center">
                        <span className="text-slate-500 text-xs font-black">{match.home_team.name[0]}</span>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center">
                    {isUpcoming ? (
                        <div className="font-sans leading-[18px] p-[2px] px-2 rounded-[4px] text-[11px] bg-brand-primary/10 font-bold text-brand-primary">待開賽</div>
                    ) : (
                        <>
                            <div className="gap-[5px] flex items-center justify-center">
                                <div className="font-sans leading-[22px] text-[14px] font-black transition-all duration-500 text-slate-900 xl:text-[16px] xl:leading-[25px] tabular-nums tracking-tighter">{match.home_team.score}</div>
                                <div className="font-sans leading-[22px] text-[14px] font-black transition-all duration-500 text-slate-300 xl:text-[16px] xl:leading-[25px]"> : </div>
                                <div className="font-sans leading-[22px] text-[14px] font-black transition-all duration-500 text-slate-900 xl:text-[16px] xl:leading-[25px] tabular-nums tracking-tighter">{match.away_team.score}</div>
                            </div>
                            {isLive && (
                                <div className="leading-[18px] text-[10px] text-center transition-all duration-500 text-brand-primary font-bold md:text-[12px]">進行中: {match.current_period || ''}</div>
                            )}
                        </>
                    )}
                </div>

                <div className="gap-[5px] flex items-center py-[4px] justify-between md:justify-start">
                    <div className="size-[30px] flex-shrink-0 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center">
                        <span className="text-slate-500 text-xs font-black">{match.away_team.name[0]}</span>
                    </div>
                    <div className="font-sans leading-[18px] text-[12px] line-clamp-1 break-all font-black text-slate-900 md:text-[16px] md:leading-[25px]">
                        {match.away_team.name}
                    </div>
                </div>
            </div>
        </div>
    );
};
