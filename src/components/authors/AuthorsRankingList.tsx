"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { AuthorListItemDTO } from '@/types';
import { useAuth } from '@/components/shared/MockAuthProvider';

interface AuthorsRankingListProps {
    data: AuthorListItemDTO;
    rank: number;
}

export const AuthorsRankingList: React.FC<AuthorsRankingListProps> = ({ data, rank }) => {
    const { isLoggedIn } = useAuth();
    const [isFollowed, setIsFollowed] = useState(false);
    const { author, stats } = data;

    const handleFollowClick = () => {
        if (!isLoggedIn) {
            alert('請登入會員');
            return;
        }
        setIsFollowed(!isFollowed);
    };

    const defaultAvatar = '/img/home/db1a163c-c47d-4442-a6b7-2467c0b7ec5c/avatar_user_1770628545803.png';

    // Helper to format numbers like 1,234
    const formatNumber = (num?: number) => {
        if (num === undefined) return '0';
        return new Intl.NumberFormat().format(num);
    };

    // Determine Rank Badge Style
    const getRankStyle = () => {
        if (rank === 1) return 'bg-[#FFD700] text-amber-900 border-[#DAA520] shadow-md'; // Gold
        if (rank === 2) return 'bg-[#E0E0E0] text-gray-700 border-[#BDBDBD] shadow-sm';   // Silver
        if (rank === 3) return 'bg-[#CD7F32] text-orange-950 border-[#A0522D] shadow-sm'; // Bronze
        return 'bg-slate-100 text-slate-500 border-transparent'; // Default
    };

    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100 p-4 sm:p-6 mb-4 flex flex-col sm:flex-row items-center gap-6 group">

            {/* Rank Number */}
            <div className="flex-shrink-0 flex items-center justify-center w-12 h-12">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg border-2 ${getRankStyle()}`}>
                    {rank}
                </div>
            </div>

            {/* Author Info */}
            <div className="flex-1 flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full text-center sm:text-left">
                {/* Avatar */}
                <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full border-2 border-slate-100 shadow-sm overflow-hidden bg-slate-200">
                        <img
                            src={author.avatar || defaultAvatar}
                            alt={author.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Name & Bio */}
                <div className="flex-1 flex flex-col justify-center">
                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                        <h3 className="text-xl font-black text-brand-heading group-hover:text-brand-primary transition-colors">
                            {author.name}
                        </h3>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded">
                            {author.level_tag || '駐站作家'}
                        </span>
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-1">
                        {author.bio || '專注於深入賽事分析與球員動態，帶給讀者最專業的體育觀點。'}
                    </p>
                </div>
            </div>

            {/* Stats (Views & Followers) */}
            <div className="flex-shrink-0 flex items-center gap-6 sm:border-l sm:border-slate-100 sm:pl-6 w-full sm:w-auto overflow-x-auto">
                <div className="flex-1 sm:flex-none text-center sm:text-right">
                    <div className="text-[10px] font-bold text-slate-400 mb-1 tracking-wider uppercase">月總瀏覽</div>
                    <div className="text-lg font-black text-brand-heading">{formatNumber(stats?.monthly_views)}</div>
                </div>
                <div className="flex-1 sm:flex-none text-center sm:text-right">
                    <div className="text-[10px] font-bold text-slate-400 mb-1 tracking-wider uppercase">追蹤人數</div>
                    <div className="text-lg font-black text-brand-heading">{formatNumber(stats?.followers)}</div>
                </div>
            </div>

            {/* Follow Button */}
            <div className="flex-shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
                <button
                    onClick={handleFollowClick}
                    className={`w-full sm:w-24 py-2 sm:py-2.5 rounded-lg text-sm font-black transition-all ${isFollowed
                            ? 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            : 'bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white'
                        }`}
                >
                    {isFollowed ? '已追蹤' : '追蹤'}
                </button>
            </div>

        </div>
    );
};
