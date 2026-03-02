'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/shared/MockAuthProvider';
import { SportApi } from '@/services/api';
import { User, CreatorStatsDTO, ArticleDTO, CommentDTO } from '@/types';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileTabs } from '@/components/profile/ProfileTabs';
import { ManagementDashboard } from '@/components/profile/ManagementDashboard';
import { AuthorCard } from '@/components/article/AuthorCard';
import { Loader2 } from 'lucide-react';
import { NewsList } from '@/components/news/NewsList';
import Link from 'next/link';
import { CommentSection } from '@/components/shared/CommentSection';

export default function ProfilePage() {
    const { user, isLoggedIn, updateProfile, isLoading: authLoading } = useAuth();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState('management');
    const [stats, setStats] = useState<CreatorStatsDTO | null>(null);
    const [topArticles, setTopArticles] = useState<ArticleDTO[]>([]);
    const [allArticles, setAllArticles] = useState<ArticleDTO[]>([]);
    const [latestComments, setLatestComments] = useState<CommentDTO[]>([]);
    const [loading, setLoading] = useState(true);

    // Filtering state
    const [filters, setFilters] = useState({
        category: 'All',
        league: 'All'
    });

    useEffect(() => {
        if (!authLoading && !isLoggedIn) {
            router.push('/');
        }
    }, [isLoggedIn, authLoading, router]);

    useEffect(() => {
        const fetchCreatorData = async () => {
            if (!user) return;

            setLoading(true);
            try {
                const [statsRes, topRes, allRes, commRes] = await Promise.all([
                    SportApi.getCreatorStats(),
                    SportApi.getCreatorTopArticles(),
                    SportApi.getPosts(1, 10), // Mock all articles
                    SportApi.getCreatorLatestComments()
                ]);

                if (statsRes.status === 200) setStats(statsRes.data);
                if (topRes.status === 200) setTopArticles(topRes.data);
                if (allRes.status === 200) setAllArticles(allRes.data);
                if (commRes.status === 200) setLatestComments(commRes.data);
            } catch (error) {
                console.error('Failed to fetch creator data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (isLoggedIn && user) {
            fetchCreatorData();
        }
    }, [isLoggedIn, user]);

    const handleProfileUpdate = async (data: Partial<User>) => {
        if (!user) return;
        const res = await updateProfile(data);
        if (!res.success) {
            alert(res.message || '更新失敗');
        }
    };

    if (authLoading || (isLoggedIn && !user)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="animate-spin text-brand-primary" size={40} />
            </div>
        );
    }

    if (!isLoggedIn) return null;

    const filteredArticles = allArticles.filter(article => {
        const categoryMatch = filters.category === 'All' || article.category === filters.category;
        const leagueMatch = filters.league === 'All' || article.league === filters.league;
        return categoryMatch && leagueMatch;
    });

    const categories = ['All', 'Baseball', 'Basketball'];
    const leagues = filters.category === 'Baseball'
        ? ['All', 'MLB', 'CPBL']
        : filters.category === 'Basketball'
            ? ['All', 'NBA']
            : ['All'];

    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            {/* 1. Header Area (Full Width) */}
            <ProfileHeader user={user!} onUpdate={handleProfileUpdate} />

            {/* 2. Content Layout (Container) */}
            <div className="container mx-auto px-4 md:px-12 mt-20">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Sidebar: Author Card */}
                    <div className="lg:w-1/3 xl:w-1/4">
                        <AuthorCard
                            isOwner={true}
                            onUpdate={handleProfileUpdate}
                            author={{
                                id: user!.id,
                                name: user!.name,
                                avatar: user!.avatar,
                                level_tag: '創作者',
                                bio: user!.bio
                            }}
                            latestArticles={allArticles.slice(0, 3)}
                        />
                    </div>

                    {/* Right Main Content */}
                    <div className="lg:w-2/3 xl:w-3/4 flex-1">
                        <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

                        <div className="mt-6">
                            {loading ? (
                                <div className="flex justify-center py-20">
                                    <Loader2 className="animate-spin text-brand-primary" size={32} />
                                </div>
                            ) : (
                                <>
                                    {activeTab === 'management' && stats && (
                                        <ManagementDashboard stats={stats} topArticles={topArticles} />
                                    )}

                                    {activeTab === 'articles' && (
                                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-1.5 h-8 bg-brand-primary rounded-full"></div>
                                                    <h2 className="text-2xl font-black text-brand-heading italic uppercase">所有文章</h2>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-2">
                                                    <div className="flex border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                                                        {categories.map(cat => (
                                                            <button
                                                                key={cat}
                                                                onClick={() => setFilters({ ...filters, category: cat, league: 'All' })}
                                                                className={`px-4 py-2 text-xs font-black transition-all ${filters.category === cat ? 'bg-brand-primary text-white' : 'text-slate-400 hover:bg-slate-50'}`}
                                                            >
                                                                {cat === 'All' ? '全部類別' : cat === 'Baseball' ? '棒球' : '籃球'}
                                                            </button>
                                                        ))}
                                                    </div>

                                                    {(filters.category !== 'All') && (
                                                        <div className="flex border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm animate-in slide-in-from-right-4 duration-300">
                                                            {leagues.map(l => (
                                                                <button
                                                                    key={l}
                                                                    onClick={() => setFilters({ ...filters, league: l })}
                                                                    className={`px-4 py-2 text-xs font-black transition-all ${filters.league === l ? 'bg-brand-secondary text-white' : 'text-slate-400 hover:bg-slate-50'}`}
                                                                >
                                                                    {l === 'All' ? '全部聯盟' : l}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <NewsList news={filteredArticles} />
                                            {filteredArticles.length === 0 && (
                                                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400 font-bold">
                                                    沒有符合條件的文章
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
                                                {latestComments.length > 0 ? (
                                                    <div className="space-y-6">
                                                        {latestComments.map((comment) => (
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
                                                                        {comment.article_id ? (
                                                                            <Link
                                                                                href={`/post/${comment.article_id}`}
                                                                                className="text-[10px] font-black text-brand-primary uppercase tracking-wider bg-brand-primary/5 px-2 py-1 rounded w-fit hover:bg-brand-primary/10 transition-colors inline-block"
                                                                            >
                                                                                於：{comment.article_title || '您的文章'}
                                                                            </Link>
                                                                        ) : (
                                                                            <div className="text-[10px] font-black text-brand-primary uppercase tracking-wider bg-brand-primary/5 px-2 py-1 rounded w-fit">
                                                                                來自您的文章
                                                                            </div>
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
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
