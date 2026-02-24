'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { SportApi } from '@/services/api';
import { MatchScoreDTO } from '@/types';
import { MatchEventList } from '@/components/matches/MatchEventList';
import { RecommendedMatches } from '@/components/matches/RecommendedMatches';
import { SearchFilterBar } from '@/components/matches/SearchFilterBar';
import { SearchModal } from '@/components/matches/SearchModal';
import { DateModal } from '@/components/matches/DateModal';

export default function MatchesPage() {
    // UI States
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [isDateModalOpen, setIsDateModalOpen] = useState(false);
    const [isSearchMode, setIsSearchMode] = useState(false);

    // Filter States
    const [sport, setSport] = useState('ALL');
    const [date, setDate] = useState(new Date());
    const [status, setStatus] = useState('all');
    const [searchFilters, setSearchFilters] = useState({ sport: 'ALL', league: 'ALL' });

    // Data States
    const [matches, setMatches] = useState<MatchScoreDTO[]>([]);
    const [recommended, setRecommended] = useState<MatchScoreDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Determine active sport filter
            // Priority: Search Filter > Category Tab
            const activeSport = searchFilters.sport !== 'ALL' ? searchFilters.sport : (sport === 'ALL' ? undefined : sport);
            const activeLeague = searchFilters.league !== 'ALL' ? searchFilters.league : undefined;

            const matchResponse = await SportApi.getMatches(
                activeSport,
                status,
                date.toISOString(),
                activeLeague
            );

            setMatches(matchResponse.data);

            // Only fetch these once or on initial load
            if (recommended.length === 0) {
                const recResponse = await SportApi.getRecommendedMatches();
                setRecommended(recResponse.data);
            }
        } catch (error) {
            console.error('Failed to fetch matches:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [sport, date, status, searchFilters]);

    const handleSearchConfirm = (filters: { sport: string; league: string }) => {
        setSearchFilters(filters);
        setIsSearchMode(true);
        setIsSearchModalOpen(false);
    };

    const handleDateConfirm = (newDate: Date) => {
        setDate(newDate);
        setIsSearchMode(true);
        setIsDateModalOpen(false);
    };

    const handleBack = () => {
        setIsSearchMode(false);
        setSearchFilters({ sport: 'ALL', league: 'ALL' });
        setSport('ALL');
        setDate(new Date());
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-28 pb-20">
            <div className="px-[5px] md:px-[10px] xl:px-[80px] w-full">

                {/* 1. Back Button (Search Mode Only) */}
                {isSearchMode && (
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 mb-6 text-slate-400 hover:text-brand-primary transition-colors font-bold group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        返回
                    </button>
                )}

                {/* 2. Recommended Matches Section */}
                {!isSearchMode && (
                    <RecommendedMatches matches={recommended} isLoading={isLoading && recommended.length === 0} />
                )}

                {/* 3. Unified Search & Filter Section */}
                <div className="mb-10">
                    <SearchFilterBar
                        onOpenSearch={() => setIsSearchModalOpen(true)}
                        onOpenDate={() => setIsDateModalOpen(true)}
                        selectedDate={date}
                        onDateChange={setDate}
                        activeSport={sport}
                        onSportChange={setSport}
                        activeFilters={searchFilters}
                    />
                </div>

                {/* 4. Main Event List */}
                <div className="bg-white/40 backdrop-blur-xl rounded-[40px] p-2 md:p-8 border border-white/40 shadow-xl shadow-slate-200/50">
                    <MatchEventList matches={matches} isLoading={isLoading} />
                </div>
            </div>

            {/* Modals */}
            <SearchModal
                isOpen={isSearchModalOpen}
                onClose={() => setIsSearchModalOpen(false)}
                onSearch={handleSearchConfirm}
            />
            <DateModal
                isOpen={isDateModalOpen}
                onClose={() => setIsDateModalOpen(false)}
                selectedDate={date}
                onConfirm={handleDateConfirm}
            />
        </div>
    );
}
