'use client';

import React, { useRef } from 'react';
import { Search, Calendar, ChevronLeft, ChevronRight, LayoutGrid, Trophy, Ghost } from 'lucide-react';
import { format, addDays, startOfDay, isSameDay } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { SportType } from '@/types';

interface SearchFilterBarProps {
    onOpenSearch: () => void;
    onOpenDate: () => void;
    selectedDate: Date;
    onDateChange: (date: Date) => void;
    activeSport: string;
    onSportChange: (sport: string) => void;
    activeFilters: { sport: string; league: string };
}

const SPORT_TABS = [
    { id: 'ALL', label: '全部', icon: <LayoutGrid className="w-5 h-5" /> },
    { id: 'BASEBALL' as SportType, label: '棒球', icon: <Trophy className="w-5 h-5" /> },
    { id: 'BASKETBALL' as SportType, label: '籃球', icon: <Trophy className="w-5 h-5 text-orange-500" /> },
    { id: 'FOOTBALL' as SportType, label: '足球', icon: <Trophy className="w-5 h-5 text-emerald-500" /> },
    { id: 'LOL' as SportType, label: 'LOL', icon: <Ghost className="w-5 h-5 text-blue-400" /> },
    { id: 'CSGO' as SportType, label: 'CS2', icon: <Ghost className="w-5 h-5 text-slate-400" /> },
    { id: 'DOTA2' as SportType, label: 'Dota2', icon: <Ghost className="w-5 h-5 text-red-400" /> },
    { id: 'KOG' as SportType, label: '王者榮耀', icon: <Ghost className="w-5 h-5 text-yellow-400" /> },
];

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
    onOpenSearch,
    onOpenDate,
    selectedDate,
    onDateChange,
    activeSport,
    onSportChange,
    activeFilters
}) => {
    const dateScrollRef = useRef<HTMLDivElement>(null);
    const sportScrollRef = useRef<HTMLDivElement>(null);

    const dates = Array.from({ length: 7 }).map((_, i) => addDays(startOfDay(new Date()), i));

    const scroll = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
        if (ref.current) {
            const amount = direction === 'left' ? -200 : 200;
            ref.current.scrollBy({ left: amount, behavior: 'smooth' });
        }
    };

    return (
        <div className="w-full flex flex-col gap-2.5">
            {/* Row 1: Action Buttons (Search & Date) */}
            <div className="bg-slate-900/5 px-2 py-3 md:bg-slate-900/10 md:rounded-t-2xl md:px-3 xl:bg-transparent xl:p-0">
                <div className="flex justify-end gap-2.5">
                    <button
                        onClick={onOpenSearch}
                        className="flex-1 md:flex-none md:w-[200px] h-[42px] px-4 flex items-center gap-2.5 bg-white border border-slate-200 rounded-lg hover:border-brand-primary/30 transition-all group"
                    >
                        <Search className="w-4 h-4 text-slate-400 group-hover:text-brand-primary" />
                        <span className="text-sm font-bold text-slate-500 group-hover:text-brand-primary whitespace-nowrap">搜尋賽事</span>
                    </button>
                    <button
                        onClick={onOpenDate}
                        className="h-[42px] px-4 flex items-center gap-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all shadow-md active:scale-95"
                    >
                        <Calendar className="w-5 h-5 opacity-80" />
                        <span className="text-sm font-bold tracking-tight whitespace-nowrap">日期搜尋</span>
                    </button>
                </div>
            </div>

            {/* Row 2: Quick Date Selector */}
            <div className="bg-white border border-slate-100 rounded-xl flex items-center overflow-hidden shadow-sm">
                <button
                    onClick={() => scroll(dateScrollRef, 'left')}
                    className="h-[60px] w-[40px] flex items-center justify-center hover:bg-slate-50 transition-colors border-r border-slate-100"
                >
                    <ChevronLeft className="w-5 h-5 text-slate-400" />
                </button>

                <div ref={dateScrollRef} className="flex-1 flex overflow-x-auto no-scrollbar scroll-smooth">
                    {dates.map((date) => {
                        const isActive = isSameDay(date, selectedDate);
                        return (
                            <button
                                key={date.toISOString()}
                                onClick={() => onDateChange(date)}
                                className={`
                                    flex-1 min-w-[100px] h-[60px] flex flex-col items-center justify-center transition-all
                                    ${isActive ? 'bg-slate-900 text-brand-primary' : 'bg-white text-slate-400 hover:bg-slate-50'}
                                `}
                            >
                                <span className={`text-sm font-black tracking-tight ${isActive ? 'text-brand-primary' : 'text-slate-400'}`}>
                                    {format(date, 'yyyy.MM.dd')}
                                </span>
                                <span className={`text-xs font-bold mt-0.5 ${isActive ? 'text-brand-primary opacity-80' : 'text-slate-400 opacity-60'}`}>
                                    {format(date, 'EEEE', { locale: zhTW })}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <button
                    onClick={() => scroll(dateScrollRef, 'right')}
                    className="h-[60px] w-[40px] flex items-center justify-center hover:bg-slate-50 transition-colors border-l border-slate-100"
                >
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                </button>
            </div>

            {/* Row 3: Sport Tabs */}
            <div className="bg-white border border-slate-100 rounded-xl flex items-center overflow-hidden shadow-sm md:mt-2 xl:mt-0 xl:bg-slate-50/50">
                <button
                    onClick={() => scroll(sportScrollRef, 'left')}
                    className="h-[50px] w-[40px] flex items-center justify-center hover:bg-slate-50 transition-colors border-r border-slate-100 xl:hidden"
                >
                    <ChevronLeft className="w-5 h-5 text-slate-400" />
                </button>

                <div ref={sportScrollRef} className="flex-1 flex overflow-x-auto no-scrollbar scroll-smooth">
                    {SPORT_TABS.map((tab) => {
                        const isActive = activeSport === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => onSportChange(tab.id)}
                                className={`
                                    min-w-[120px] h-[50px] flex items-center justify-center gap-2.5 px-4 transition-all whitespace-nowrap
                                    ${isActive ? 'bg-slate-900 text-brand-primary' : 'bg-white text-slate-500 hover:bg-slate-50'}
                                    md:flex-1
                                `}
                            >
                                {tab.icon && <div className={isActive ? 'text-brand-primary' : 'text-slate-400'}>{tab.icon}</div>}
                                <span className={`text-[15px] font-black tracking-tight ${isActive ? 'text-brand-primary' : 'text-slate-500'}`}>
                                    {tab.label}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <button
                    onClick={() => scroll(sportScrollRef, 'right')}
                    className="h-[50px] w-[40px] flex items-center justify-center hover:bg-slate-50 transition-colors border-l border-slate-100 xl:hidden"
                >
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                </button>
            </div>
        </div>
    );
};
