"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { AuthorListItemDTO, CreatorStatsDTO, CommentDTO } from '@/types';
import { AuthorCard } from '@/components/article/AuthorCard';
import { NewsList } from '@/components/news/NewsList';
import { ProfileTabs } from '@/components/profile/ProfileTabs';
import { ManagementDashboard } from '@/components/profile/ManagementDashboard';

interface AuthorPublicProfileContentProps {
    authorData: AuthorListItemDTO;
}

export const AuthorPublicProfileContent: React.FC<AuthorPublicProfileContentProps> = ({ authorData }) => {
    const { author, latest_articles, stats: authorStats } = authorData;
    const [activeTab, setActiveTab] = useState('management');

    // Convert author stats to CreatorStatsDTO for the dashboard
    // Since public data might be limited, we combine it with some stable random/mocked values
    const dashboardStats: CreatorStatsDTO = {
        total_articles: latest_articles?.length || 0,
        total_views: authorStats.monthly_views,
        total_collections: Math.floor(authorStats.monthly_views * 0.05), // Deriving from views
        account_days: 180, // Mock
        followers_count: authorStats.followers,
        followed_articles: 10, // Mock
        total_comments: Math.floor(authorStats.monthly_views * 0.01), // Deriving
    };

    // Mock latest comments for this author
    const mockComments: CommentDTO[] = [
        {
            id: 'c1',
            content: '分析得很有深度，受教了！',
            author: { id: 'u1', name: '體育小迷弟', avatar: '', level_tag: '鑽石粉絲' },
            created_at: new Date().toISOString(),
            like_count: 5,
            reply_count: 0,
            is_author: false,
            is_like: false,
            article_id: latest_articles?.[0]?.id || 'a1',
            article_title: latest_articles?.[0]?.title || '精彩文章'
        },
        {
            id: 'c2',
            content: '期待下一篇關於季後賽的預測。',
            author: { id: 'u2', name: '老球迷', avatar: '', level_tag: '黃金會員' },
            created_at: new Date(Date.now() - 86400000).toISOString(),
            like_count: 12,
            reply_count: 2,
            is_author: false,
            is_like: false,
            article_id: latest_articles?.[1]?.id || 'a2',
            article_title: latest_articles?.[1]?.title || '數據分析'
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Banner */}
            <div className="w-full h-64 bg-gradient-to-br from-brand-primary/10 via-slate-100 to-brand-secondary/10 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                    <span className="text-[20rem] font-black text-brand-primary select-none">S</span>
                </div>
                {/* Breadcrumb */}
                <div className="absolute top-8 left-12 z-20">
                    <nav className="flex items-center gap-2 text-xs font-bold text-slate-400">
                        <Link href="/" className="hover:text-brand-primary transition-colors">首頁</Link>
                        <span>/</span>
                        <Link href="/authors" className="hover:text-brand-primary transition-colors">作者群</Link>
                        <span>/</span>
                        <span className="text-slate-600">{author.name}</span>
                    </nav>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 md:px-12 -mt-12 pb-24 relative z-10">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Sidebar: Author Card */}
                    <div className="lg:w-1/3 xl:w-1/4">
                        <AuthorCard
                            isOwner={false}
                            author={{
                                id: author.id,
                                name: author.name,
                                avatar: author.avatar,
                                level_tag: author.level_tag,
                                bio: author.bio
                            }}
                            latestArticles={latest_articles}
                        />
                    </div>

                    {/* Right Main: Tabs & Dashboard */}
                    <div className="lg:w-2/3 xl:w-3/4 flex-1 pt-8 md:pt-12">
                        <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

                        <div className="mt-8">
                            {activeTab === 'management' && (
                                <ManagementDashboard
                                    stats={dashboardStats}
                                    topArticles={latest_articles || []}
                                />
                            )}

                            {activeTab === 'articles' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-8 bg-brand-primary rounded-full"></div>
                                        <h2 className="text-2xl font-black text-brand-heading italic uppercase">所有文章</h2>
                                    </div>
                                    {latest_articles && latest_articles.length > 0 ? (
                                        <NewsList news={latest_articles} />
                                    ) : (
                                        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400 font-bold">
                                            此作者尚無發表文章
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'comments' && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="w-1.5 h-8 bg-brand-primary rounded-full"></div>
                                        <h2 className="text-2xl font-black text-brand-heading italic uppercase">最新讀者留言</h2>
                                    </div>
                                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                                        {mockComments.length > 0 ? (
                                            <div className="space-y-6">
                                                {mockComments.map((comment) => (
                                                    <div key={comment.id} className="pb-6 border-b border-slate-50 last:border-0 last:pb-0">
                                                        <div className="flex gap-4">
                                                            <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden shrink-0">
                                                                <img src={comment.author.avatar || '/SportHub/img/home/db1a163c-c47d-4442-a6b7-2467c0b7ec5c/avatar_user_1770628545803.png'} alt={comment.author.name} className="w-full h-full object-cover" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <span className="font-bold text-slate-700">{comment.author.name}</span>
                                                                    <span className="text-xs text-slate-400 font-bold">{new Date(comment.created_at).toLocaleDateString()}</span>
                                                                </div>
                                                                <p className="text-slate-600 text-sm leading-relaxed mb-3">{comment.content}</p>
                                                                {comment.article_id && (
                                                                    <Link
                                                                        href={`/post/${comment.article_id}`}
                                                                        className="text-[10px] font-black text-brand-primary uppercase tracking-wider bg-brand-primary/5 px-2 py-1 rounded w-fit hover:bg-brand-primary/10 transition-colors inline-block"
                                                                    >
                                                                        於：{comment.article_title || '精選文章'}
                                                                    </Link>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-10 text-slate-400 font-bold">目前尚無留言</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
