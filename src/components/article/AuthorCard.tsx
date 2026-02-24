"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArticleDTO, Author } from '@/types';
import { useAuth } from '@/components/shared/MockAuthProvider';

interface AuthorCardProps {
    author: Author;
    latestArticles?: ArticleDTO[];
    isMobile?: boolean; // New prop to explicitly handle mobile placement if needed
}

export const AuthorCard: React.FC<AuthorCardProps> = ({ author, latestArticles, isMobile = false }) => {
    const { isLoggedIn } = useAuth();
    const [isFollowed, setIsFollowed] = useState(false);

    const handleFollowClick = () => {
        if (!isLoggedIn) {
            alert('請登入會員');
            return;
        }
        setIsFollowed(!isFollowed);
    };

    // Calculate total collections from articles (simulated)
    const totalCollections = latestArticles?.reduce((sum, article) => sum + (article.collect_count || 0), 0) || 0;

    // Mock stats for beauty with larger data
    const stats = {
        articles: latestArticles?.length || 0,
        followers: '1.2k',
        collections: (totalCollections + 520).toLocaleString() // Base + sum
    };

    return (
        <div className={`bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden ${isMobile ? 'mb-12' : 'sticky top-24'}`}>
            {/* 1. Card Header with Gradient Background */}
            <div className={`h-20 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 relative ${isMobile ? 'hidden md:block' : ''}`}>
                <div className="absolute -bottom-10 left-6">
                    <div className="p-1 bg-white rounded-2xl shadow-lg">
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-200">
                            <img
                                src={author.avatar || '/img/home/db1a163c-c47d-4442-a6b7-2467c0b7ec5c/avatar_user_1770628545803.png'}
                                alt={author.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Author Info Section */}
            <div className={`${isMobile ? 'pt-6' : 'pt-14'} px-6 pb-6`}>
                <div className={`flex ${isMobile ? 'flex-col md:flex-row md:items-center' : 'flex-col'} justify-between gap-6 mb-8`}>
                    <div className="flex items-center gap-4">
                        {isMobile && (
                            <div className="md:hidden w-16 h-16 rounded-xl overflow-hidden bg-slate-200 shadow-md">
                                <img
                                    src={author.avatar || '/img/home/db1a163c-c47d-4442-a6b7-2467c0b7ec5c/avatar_user_1770628545803.png'}
                                    alt={author.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                        <div>
                            <h4 className="text-2xl font-black text-brand-heading mb-1">{author.name}</h4>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-brand-primary/10 text-brand-primary">
                                {author.level_tag || '駐站作家'}
                            </span>
                        </div>
                    </div>

                    <div className={`flex ${isMobile ? 'items-center gap-6' : 'flex-col gap-4'}`}>
                        <button
                            onClick={handleFollowClick}
                            className={`px-8 py-2.5 rounded-xl text-base font-black transition-all duration-300 transform active:scale-95 shadow-sm ${isFollowed
                                ? 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                : 'bg-brand-primary text-white hover:shadow-lg hover:shadow-brand-primary/30 hover:-translate-y-0.5'
                                } ${isMobile ? 'w-full md:w-auto' : 'w-full'}`}
                        >
                            {isFollowed ? '追蹤中' : '+ 追蹤'}
                        </button>
                    </div>
                </div>

                {/* Info & Stats Row - Layout change for mobile horizontal */}
                <div className={`flex ${isMobile ? 'flex-col md:flex-row gap-8' : 'flex-col'} mb-8`}>
                    <p className={`text-base text-slate-500 leading-relaxed font-medium ${isMobile ? 'md:w-1/2' : ''}`}>
                        {author.bio || '專注於 NBA 與 MLB 賽事分析，擁有超過 10 年的球評經驗。擅長戰術解析與數據建模。'}
                    </p>

                    {/* Stats Box - Enlarged Text */}
                    <div className={`grid grid-cols-3 gap-6 py-6 px-4 bg-slate-50/50 rounded-2xl ${isMobile ? 'md:w-1/2' : ''}`}>
                        <div className="text-center">
                            <div className="text-2xl font-black text-brand-heading mb-1">{stats.articles}</div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">文章</div>
                        </div>
                        <div className="text-center border-x border-slate-200/50">
                            <div className="text-2xl font-black text-brand-heading mb-1">{stats.followers}</div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">粉絲</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-black text-brand-heading mb-1">{stats.collections}</div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">收藏</div>
                        </div>
                    </div>
                </div>

                {/* Latest Articles List */}
                {latestArticles && latestArticles.length > 0 && (
                    <div className="mt-8">
                        <div className="flex justify-between items-center mb-5">
                            <h5 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">最近分析文章</h5>
                            <div className="flex-1 ml-4 h-px bg-slate-100"></div>
                        </div>
                        <ul className={`grid grid-cols-1 ${isMobile ? 'md:grid-cols-2 lg:grid-cols-2' : ''} gap-x-12 gap-y-4`}>
                            {latestArticles.slice(0, isMobile ? 4 : 3).map((article) => (
                                <li key={article.id} className="group">
                                    <Link
                                        href={article.target_url || `/post/${article.id}`}
                                        className="flex gap-3 items-start"
                                    >
                                        <div className="w-2 h-2 rounded-full bg-slate-200 mt-2 group-hover:bg-brand-primary transition-colors shrink-0" />
                                        <span className="text-base text-slate-600 font-bold leading-snug group-hover:text-brand-primary transition-colors line-clamp-1">
                                            {article.title}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Social Share / Like Section */}
                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-black text-slate-300 uppercase tracking-widest">社群連結</span>
                    <div className="flex gap-3">
                        <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-brand-primary/10 hover:text-brand-primary transition-all">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                        </button>
                        <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-brand-primary/10 hover:text-brand-primary transition-all">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.315 2c2.43 0 2.784.012 3.855.064 1.019.046 1.582.21 1.95.355.488.19 1.039.46 1.455.875.415.416.485.967.675 1.455.145.368.31.931.355 1.95.052 1.071.064 1.425.064 3.855s-.012 2.784-.064 3.855c-.046 1.019-.21 1.582-.355 1.95-.19.488-.46 1.039-.875 1.455-.416.415-.967.485-1.455.675-.368.145-.931.31-1.95.355-1.071.052-1.425.064-3.855.064s-2.784-.012-3.855-.064c-1.019-.046-1.582-.21-1.95-.355a3.831 3.831 0 01-1.455-.875 3.831 3.831 0 01-.675-1.455c-.145-.368-.31-.931-.355-1.95-.052-1.071-.064-1.425-.064-3.855s.012-2.784.064-3.855c.046-1.019.21-1.582.355-1.95.19-.488.46-1.039.875-1.455.416-.415.967-.485 1.455-.675.368-.145.931-.31 1.95-.355 1.071-.052 1.425-.064 3.855-.064m0-2c-2.478 0-2.822.013-3.955.065-1.082.049-1.815.221-2.46.472a5.831 5.831 0 00-2.115 1.378 5.831 5.831 0 00-1.378 2.115c-.251.645-.423 1.378-.472 2.46C2.013 9.178 2 9.522 2 12s.013 2.822.065 3.955c.049 1.082.221 1.815.472 2.46a5.831 5.831 0 001.378 2.115 5.831 5.831 0 002.115 1.378c.645.251 1.378.423 2.46.472 1.133.052 1.477.065 3.955.065s2.822-.013 3.955-.065c1.082-.049 1.815-.221 2.46-.472a5.831 5.831 0 002.115-1.378 5.831 5.831 0 001.378-2.115c.251-.645.423-1.378.472-2.46.052-1.133.065-1.477.065-3.955s-.013-2.822-.065-3.955c-.049-1.082-.221-1.815-.472-2.46a5.831 5.831 0 00-1.378-2.115 5.831 5.831 0 00-2.115-1.378c-.645-.251-1.378-.423-2.46-.472-1.133-.052-1.477-.065-3.955-.065z" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
