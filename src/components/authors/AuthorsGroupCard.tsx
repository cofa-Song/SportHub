"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { AuthorListItemDTO } from '@/types';
import { useAuth } from '@/components/shared/MockAuthProvider';

interface AuthorsGroupCardProps {
    data: AuthorListItemDTO;
}

export const AuthorsGroupCard: React.FC<AuthorsGroupCardProps> = ({ data }) => {
    const { isLoggedIn } = useAuth();
    const [isFollowed, setIsFollowed] = useState(false);
    const { author, latest_articles } = data;

    const handleFollowClick = () => {
        if (!isLoggedIn) {
            alert('請登入會員');
            return;
        }
        setIsFollowed(!isFollowed);
    };

    const defaultAvatar = '/SportHub/img/home/db1a163c-c47d-4442-a6b7-2467c0b7ec5c/avatar_user_1770628545803.png';
    const latestArticle = latest_articles?.[0];

    return (
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100 flex flex-col overflow-hidden h-full group">
            {/* Top section: Avatar & Basic Info */}
            <div className="flex-1 p-6 flex flex-col items-center text-center relative pt-12">
                {/* Decoration background behind avatar */}
                <div className="absolute top-0 left-0 right-0 h-20 bg-slate-50/50 rounded-t-2xl"></div>

                {/* Avatar */}
                <div className="relative z-10 w-20 h-20 mb-4 mx-auto">
                    <div className="w-full h-full rounded-full border-4 border-white shadow-sm overflow-hidden bg-slate-200">
                        <img
                            src={author.avatar || defaultAvatar}
                            alt={author.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Name & Tag */}
                <h3 className="text-xl font-black text-brand-heading mb-2 group-hover:text-brand-primary transition-colors">
                    {author.name}
                </h3>
                <span className="inline-block px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-full mb-4">
                    {author.level_tag || '駐站作家'}
                </span>

                {/* Bio */}
                <p className="text-sm text-slate-500 mb-6 line-clamp-3 leading-relaxed">
                    {author.bio || '專注於深入賽事分析與球員動態，帶給讀者最專業的體育觀點。'}
                </p>

                {/* Social Icons (Mock) */}
                <div className="flex items-center justify-center gap-2 mb-6 mt-auto">
                    {['fb', 'ig', 'rss'].map((social) => (
                        <button key={social} className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 hover:bg-brand-primary hover:text-white transition-colors flex items-center justify-center shadow-sm">
                            <span className="text-[10px] uppercase font-bold">{social}</span>
                        </button>
                    ))}
                </div>

                {/* Follow Button */}
                <button
                    onClick={handleFollowClick}
                    className={`w-full py-2.5 rounded-xl text-sm font-black transition-all duration-300 ${isFollowed
                        ? 'bg-slate-100 text-slate-500'
                        : 'bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white'
                        }`}
                >
                    {isFollowed ? '已追蹤' : '+ 追蹤作者'}
                </button>
            </div>

            {/* Bottom section: Latest Article (distinct background) */}
            <div className="mt-auto bg-[#fffdf0] border-t border-yellow-100/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                    <span className="bg-[#f0ece1] text-[#b3a886] px-2 py-0.5 rounded text-[10px] font-black tracking-widest uppercase">
                        最新文章
                    </span>
                </div>
                {latestArticle ? (
                    <Link
                        href={latestArticle.target_url || `/post/${latestArticle.id}`}
                        className="text-sm font-bold text-slate-700 hover:text-brand-primary transition-colors line-clamp-2 leading-tight block"
                    >
                        {latestArticle.title}
                    </Link>
                ) : (
                    <span className="text-sm text-slate-400 italic">
                        目前尚無文章
                    </span>
                )}
            </div>
        </div>
    );
};
