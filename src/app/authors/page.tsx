"use client";

import React, { useState, useEffect } from 'react';
import { AuthorListItemDTO } from '@/types';
import { SportApi } from '@/services/api';
import { AuthorsGroupCard } from '@/components/authors/AuthorsGroupCard';
import { AuthorsRankingList } from '@/components/authors/AuthorsRankingList';

export default function AuthorsPage() {
    const [authors, setAuthors] = useState<AuthorListItemDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filters & Pagination state
    const [sortBy, setSortBy] = useState<'all' | 'top20'>('all');
    const [category, setCategory] = useState<string>('全部');
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const [debouncedKeyword, setDebouncedKeyword] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 12;

    const categories = ['全部', '籃球', '棒球', '足球', '網球', '綜合'];

    const fetchAuthors = async (page: number, sort: 'all' | 'top20', cat: string, keyword?: string) => {
        setIsLoading(true);
        try {
            const currentLimit = sort === 'top20' ? 20 : limit;
            const res = await SportApi.getAuthorsGroupData(page, currentLimit, sort, cat, keyword);
            if (res.status === 200) {
                setAuthors(res.data.data);
                setTotalPages(res.data.total_pages);
                setCurrentPage(res.data.current_page);
            }
        } catch (error) {
            console.error('Failed to fetch authors:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Pagination logic
    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5; // Show up to 5 page numbers
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = startPage + maxPagesToShow - 1;

        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    // Debounce search keyword
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedKeyword(searchKeyword);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchKeyword]);

    // Refetch when filters or debounced keyword change
    useEffect(() => {
        fetchAuthors(1, sortBy, category, debouncedKeyword);
    }, [sortBy, category, debouncedKeyword]);

    // Refetch when page changes
    useEffect(() => {
        if (currentPage !== 1 || (currentPage === 1 && !isLoading && authors.length > 0)) {
            fetchAuthors(currentPage, sortBy, category, debouncedKeyword);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [currentPage]);

    return (
        <div className="container mx-auto px-6 py-12">
            {/* Page Header */}
            <div className="mb-12 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-black text-brand-heading uppercase tracking-tighter italic mb-4">
                    SportHub作者群
                </h1>
                <p className="text-slate-500 font-medium text-lg">
                    探索各領域的專業專欄作家與獨到見解
                </p>
            </div>

            {/* Controls (Tabs & Filters) */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-12 gap-6">

                {/* Tabs */}
                <div className="flex gap-2 p-1 bg-slate-50 rounded-xl w-full md:w-auto">
                    <button
                        onClick={() => { setSortBy('all'); setCurrentPage(1); }}
                        className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-black transition-all ${sortBy === 'all'
                            ? 'bg-white text-brand-primary shadow-sm'
                            : 'text-slate-500 hover:text-brand-heading'
                            }`}
                    >
                        所有作者
                    </button>
                    <button
                        onClick={() => { setSortBy('top20'); setCurrentPage(1); }}
                        className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-black transition-all ${sortBy === 'top20'
                            ? 'bg-white text-brand-primary shadow-sm'
                            : 'text-slate-500 hover:text-brand-heading'
                            }`}
                    >
                        人氣排行
                    </button>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
                    {/* Search Field */}
                    <div className="relative w-full md:w-64">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="搜尋作者"
                            value={searchKeyword}
                            onChange={(e) => { setSearchKeyword(e.target.value); setCurrentPage(1); }}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-brand-heading placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary/50 transition-all"
                        />
                    </div>

                    {/* Dropdown Filter */}
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap hidden lg:inline">
                            專項運動
                        </span>
                        <select
                            value={category}
                            onChange={(e) => { setCategory(e.target.value); setCurrentPage(1); }}
                            className="flex-1 md:w-40 px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-black text-brand-heading focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary/50 transition-all appearance-none cursor-pointer"
                            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23a1a1aa\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1em' }}
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Author List Grid / Ranking List */}
            {isLoading ? (
                sortBy === 'all' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl h-[420px] shadow-sm border border-slate-50 animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="bg-white rounded-xl h-[120px] shadow-sm border border-slate-50 animate-pulse"></div>
                        ))}
                    </div>
                )
            ) : (
                <>
                    {authors.length > 0 ? (
                        sortBy === 'all' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {authors.map((item) => (
                                    <AuthorsGroupCard
                                        key={item.author.id}
                                        data={item}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {authors.map((item, index) => (
                                    <AuthorsRankingList
                                        key={item.author.id}
                                        data={item}
                                        rank={(currentPage - 1) * limit + index + 1}
                                    />
                                ))}
                            </div>
                        )
                    ) : (
                        <div className="py-32 text-center text-slate-400 font-bold text-lg">
                            沒有找到符合條件的作者
                        </div>
                    )}

                    {/* Pagination */}
                    {sortBy === 'all' && totalPages > 1 && (
                        <div className="flex flex-wrap items-center justify-center gap-2 pt-16 mt-8 border-t border-slate-100">
                            {/* First Page */}
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(1)}
                                className="px-4 py-2 rounded-xl bg-slate-50 text-slate-500 font-bold text-sm hover:bg-brand-primary hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-slate-50 disabled:hover:text-slate-500"
                            >
                                第一頁
                            </button>

                            {/* Previous Page */}
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                className="px-4 py-2 rounded-xl bg-slate-50 text-slate-500 font-bold text-sm hover:bg-brand-primary hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-slate-50 disabled:hover:text-slate-500"
                            >
                                上一頁
                            </button>

                            {/* Page Numbers */}
                            <div className="flex gap-2">
                                {getPageNumbers().map(pageNum => (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`w-10 h-10 rounded-xl font-black text-sm transition-all focus:outline-none ${currentPage === pageNum
                                            ? 'bg-brand-primary text-white shadow-sm'
                                            : 'bg-slate-50 text-brand-heading hover:bg-slate-200'
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                ))}
                            </div>

                            {/* Next Page */}
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                className="px-4 py-2 rounded-xl bg-slate-50 text-slate-500 font-bold text-sm hover:bg-brand-primary hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-slate-50 disabled:hover:text-slate-500"
                            >
                                下一頁
                            </button>

                            {/* Last Page */}
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(totalPages)}
                                className="px-4 py-2 rounded-xl bg-slate-50 text-slate-500 font-bold text-sm hover:bg-brand-primary hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-slate-50 disabled:hover:text-slate-500"
                            >
                                最後一頁
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
