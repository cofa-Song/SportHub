'use client';

import React, { useState, useEffect } from 'react';
import { X, Search, ChevronRight } from 'lucide-react';
import { SportType } from '@/types';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSearch: (filters: { sport: string; league: string }) => void;
}

const CATEGORIES = [
    { id: 'ALL', label: '全部類別' },
    { id: 'BASEBALL', label: '棒球' },
    { id: 'BASKETBALL', label: '籃球' },
    { id: 'FOOTBALL', label: '足球' },
    { id: 'ESPORTS', label: '電競' },
    { id: 'TENNIS', label: '網球' },
];

const LEAGUES: Record<string, string[]> = {
    'BASEBALL': ['MLB', 'NPB', 'CPBL', 'KBO'],
    'BASKETBALL': ['NBA', 'EuroLeague', 'P. LEague+', 'T1 League'],
    'FOOTBALL': ['Premier League', 'La Liga', 'Serie A', 'Bundesliga'],
    'ESPORTS': ['LoL Worlds', 'LCK', 'LPL', 'VCT'],
    'TENNIS': ['ATP Tour', 'WTA Tour', 'Wimbledon'],
};

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSearch }) => {
    const [selectedSport, setSelectedSport] = useState('ALL');
    const [selectedLeague, setSelectedLeague] = useState('ALL');

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const leagues = selectedSport === 'ALL' ? [] : (LEAGUES[selectedSport] || []);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />

            <div className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-2xl font-black text-slate-900 italic">進階搜尋</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-6 h-6 text-slate-400" />
                    </button>
                </div>

                <div className="flex flex-col md:flex-row h-[400px]">
                    {/* Categories Column */}
                    <div className="w-full md:w-1/2 border-r border-slate-100 overflow-y-auto p-4 space-y-2">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-2">競技類別</div>
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => {
                                    setSelectedSport(cat.id);
                                    setSelectedLeague('ALL');
                                }}
                                className={`
                                    w-full flex items-center justify-between px-6 py-4 rounded-2xl font-bold transition-all
                                    ${selectedSport === cat.id
                                        ? 'bg-brand-primary text-white'
                                        : 'hover:bg-slate-50 text-slate-600'}
                                `}
                            >
                                <span>{cat.label}</span>
                                <ChevronRight className={`w-4 h-4 opacity-50 ${selectedSport === cat.id ? 'block' : 'hidden md:block'}`} />
                            </button>
                        ))}
                    </div>

                    {/* Leagues Column */}
                    <div className="w-full md:w-1/2 overflow-y-auto p-4 space-y-2 bg-slate-50/50">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-2">聯賽選擇</div>
                        <button
                            onClick={() => setSelectedLeague('ALL')}
                            className={`
                                w-full text-left px-6 py-4 rounded-2xl font-bold transition-all
                                ${selectedLeague === 'ALL'
                                    ? 'bg-slate-900 text-white shadow-lg'
                                    : 'hover:bg-white text-slate-600 border border-transparent hover:border-slate-200'}
                            `}
                        >
                            全部聯賽
                        </button>
                        {leagues.map((league) => (
                            <button
                                key={league}
                                onClick={() => setSelectedLeague(league)}
                                className={`
                                    w-full text-left px-6 py-4 rounded-2xl font-bold transition-all
                                    ${selectedLeague === league
                                        ? 'bg-slate-900 text-white shadow-lg'
                                        : 'hover:bg-white text-slate-600 border border-transparent hover:border-slate-200'}
                                `}
                            >
                                {league}
                            </button>
                        ))}
                        {leagues.length === 0 && selectedSport !== 'ALL' && (
                            <div className="px-6 py-8 text-center text-slate-400 font-medium italic">
                                該類別暫無聯賽數據
                            </div>
                        )}
                        {selectedSport === 'ALL' && (
                            <div className="px-6 py-8 text-center text-slate-400 font-medium italic">
                                請先選擇競技類別
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-8 bg-white border-t border-slate-100">
                    <button
                        onClick={() => onSearch({ sport: selectedSport, league: selectedLeague })}
                        className="w-full py-4 bg-brand-primary text-white rounded-2xl font-black text-lg shadow-xl shadow-brand-primary/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-3"
                    >
                        <Search className="w-5 h-5" />
                        立即搜尋
                    </button>
                </div>
            </div>
        </div>
    );
};
