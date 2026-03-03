"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/shared/MockAuthProvider';
import { ArticleManagementList } from '@/components/profile/ArticleManagementList';
import { SportApi } from '@/services/api';
import { ArticleDTO, PaginatedResponse } from '@/types';
import {
    ChevronLeft,
    Search,
    Filter,
    ChevronDown,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    Plus,
    LayoutDashboard,
    Activity
} from 'lucide-react';
import Link from 'next/link';

export default function ArticleManagementPage() {
    const { isLoggedIn, setIsAuthModalOpen } = useAuth();
    const router = useRouter();

    // State
    const [articles, setArticles] = useState<ArticleDTO[]>([]);
    const [pagination, setPagination] = useState({ current_page: 1, total_pages: 1 });
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: '全部',
        league: '全部',
        status: '全部',
        query: ''
    });

    const categories = ['全部', 'Basketball', 'Baseball', 'Others'];
    const leagues = ['全部', 'NBA', 'MLB', 'CPBL'];
    const statuses = [
        { label: '所有狀態', value: '全部' },
        { label: '已發佈', value: 'PUBLISHED' },
        { label: '已下架', value: 'ARCHIVED' },
        { label: '草稿', value: 'DRAFT' }
    ];

    const fetchArticles = async (page = 1) => {
        setIsLoading(true);
        try {
            const res = await SportApi.getMyArticles({
                ...filters,
                page
            });
            if (res.status === 200) {
                setArticles(res.data.data);
                setPagination({
                    current_page: res.data.current_page,
                    total_pages: res.data.total_pages
                });
            }
        } catch (error) {
            console.error('Failed to fetch articles:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            fetchArticles(1);
        }
    }, [isLoggedIn, filters.category, filters.league, filters.status]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchArticles(1);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('確定要刪除這篇文章嗎？此動作無法復原。')) return;

        try {
            const res = await SportApi.deleteArticle(id);
            if (res.status === 200) {
                alert('文章已成功刪除');
                fetchArticles(pagination.current_page);
            }
        } catch (error) {
            alert('刪除失敗，請稍後再試');
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'PUBLISHED' ? 'ARCHIVED' : 'PUBLISHED';
        const actionText = newStatus === 'PUBLISHED' ? '發佈' : '下架';

        if (!confirm(`確定要將此文章${actionText}嗎？`)) return;

        // In a real app, this would be an API call like SportApi.updateArticleStatus(id, newStatus)
        // For this mock, we'll just update the local state to show the effect
        setArticles(prev => prev.map(art =>
            art.id === id ? { ...art, status: newStatus as any } : art
        ));

        alert(`文章已成功${actionText}`);
    };

    const handleEdit = (article: ArticleDTO) => {
        router.push(`/post/create?edit=${article.id}`);
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center p-12 bg-white rounded-3xl shadow-xl border border-slate-100 max-w-sm w-full mx-4">
                    <div className="w-20 h-20 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-brand-primary">
                        <LayoutDashboard size={40} />
                    </div>
                    <h2 className="text-2xl font-black text-brand-heading mb-4">需登入會員</h2>
                    <p className="text-slate-500 mb-8">請先登入以管理您的文章作品。</p>
                    <button
                        onClick={() => setIsAuthModalOpen(true)}
                        className="w-full py-4 bg-brand-primary text-white rounded-2xl font-black hover:bg-brand-secondary transition-all"
                    >
                        前往登入
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-28 pb-24">
            <div className="container mx-auto px-4 md:px-12">
                <div className="max-w-6xl mx-auto space-y-10">

                    {/* Page Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-4">
                            <Link href="/profile" className="inline-flex items-center gap-2 text-sm font-black text-slate-400 hover:text-brand-primary transition-colors">
                                <ChevronLeft size={16} />
                                返回個人管理
                            </Link>
                            <h1 className="text-5xl font-black text-brand-heading tracking-tight">
                                我的<span className="text-brand-primary">文章管理</span>
                            </h1>
                        </div>
                        <Link
                            href="/post/create"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-2xl font-black shadow-lg shadow-brand-primary/20 hover:bg-brand-secondary transition-all"
                        >
                            <Plus size={20} />
                            寫新文章
                        </Link>
                    </div>

                    {/* Filter Bar */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            {/* Search */}
                            <form onSubmit={handleSearch} className="lg:col-span-2 relative">
                                <input
                                    type="text"
                                    placeholder="搜尋文章標題..."
                                    value={filters.query}
                                    onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
                                    className="w-full h-12 pl-12 pr-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-600 focus:ring-2 focus:ring-brand-primary/20"
                                />
                                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                                <button type="submit" className="hidden">搜尋</button>
                            </form>

                            {/* Status Filter */}
                            <div className="relative">
                                <select
                                    value={filters.status}
                                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                                    className="w-full h-12 appearance-none bg-slate-50 border-none rounded-2xl pl-10 pr-4 text-sm font-black text-slate-600 focus:ring-2 focus:ring-brand-primary/20"
                                >
                                    {statuses.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                                </select>
                                <Activity size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>

                            {/* Category Filter */}
                            <div className="relative">
                                <select
                                    value={filters.category}
                                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                                    className="w-full h-12 appearance-none bg-slate-50 border-none rounded-2xl pl-10 pr-4 text-sm font-black text-slate-600 focus:ring-2 focus:ring-brand-primary/20"
                                >
                                    {categories.map(cat => <option key={cat} value={cat}>{cat} 分類</option>)}
                                </select>
                                <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>

                            {/* League Filter */}
                            <div className="relative">
                                <select
                                    value={filters.league}
                                    onChange={(e) => setFilters(prev => ({ ...prev, league: e.target.value }))}
                                    className="w-full h-12 appearance-none bg-slate-50 border-none rounded-2xl pl-4 pr-10 text-sm font-black text-slate-600 focus:ring-2 focus:ring-brand-primary/20"
                                >
                                    {leagues.map(l => <option key={l} value={l}>{l === '全部' ? '所有聯盟' : l}</option>)}
                                </select>
                                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Article Table */}
                    <div className="relative min-h-[400px]">
                        {isLoading && (
                            <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[1px] flex items-center justify-center rounded-3xl">
                                <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                        <ArticleManagementList
                            articles={articles}
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                            onToggleStatus={handleToggleStatus}
                        />
                    </div>

                    {/* Pagination */}
                    {pagination.total_pages > 1 && (
                        <div className="flex items-center justify-center gap-2 pt-6">
                            <button
                                disabled={pagination.current_page === 1}
                                onClick={() => fetchArticles(pagination.current_page - 1)}
                                className="w-10 h-10 flex items-center justify-center bg-white rounded-xl border border-slate-100 text-slate-400 hover:text-brand-primary disabled:opacity-30 disabled:pointer-events-none transition-all"
                            >
                                <ChevronLeftIcon size={20} />
                            </button>

                            {[...Array(pagination.total_pages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => fetchArticles(i + 1)}
                                    className={`
                                        w-10 h-10 rounded-xl font-black text-sm transition-all
                                        ${pagination.current_page === i + 1
                                            ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                                            : 'bg-white text-slate-500 border border-slate-100 hover:border-brand-primary hover:text-brand-primary'}
                                    `}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                disabled={pagination.current_page === pagination.total_pages}
                                onClick={() => fetchArticles(pagination.current_page + 1)}
                                className="w-10 h-10 flex items-center justify-center bg-white rounded-xl border border-slate-100 text-slate-400 hover:text-brand-primary disabled:opacity-30 disabled:pointer-events-none transition-all"
                            >
                                <ChevronRightIcon size={20} />
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
