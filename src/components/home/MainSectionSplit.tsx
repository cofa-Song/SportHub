"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Post, Match } from '@/types';
import { SportApi } from '@/services/api';
import { AdBanner } from './AdBanner';
import { useTranslation } from '@/lib/i18n/LanguageProvider';


/**
 * MainSectionSplit Component.
 * Left: Paginated article feed.
 * Right: Score sidebar + Sidebar Ad.
 */
export const MainSectionSplit: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [matches, setMatches] = useState<Match[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoadingPosts, setIsLoadingPosts] = useState(true);
    const [isLoadingMatches, setIsLoadingMatches] = useState(true);
    const { t } = useTranslation();


    const fetchPosts = async (page: number) => {
        setIsLoadingPosts(true);
        const res = await SportApi.getPosts(page, 5);
        if (res.status === 200) {
            setPosts(res.data);
        }
        setIsLoadingPosts(false);
    };

    useEffect(() => {
        fetchPosts(currentPage);
    }, [currentPage]);

    useEffect(() => {
        const fetchMatches = async () => {
            const res = await SportApi.getMatches(); // Fetches 3 matches
            if (res.status === 200) {
                setMatches(res.data);
            }
            setIsLoadingMatches(false);
        };
        fetchMatches();
    }, []);

    return (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
            {/* Left Column: Articles */}
            <div className="lg:col-span-8 space-y-6">
                <div className="flex items-center justify-between border-b-2 border-slate-50 pb-4 mb-6">
                    <h3 className="text-2xl font-black text-brand-heading uppercase tracking-tighter italic">
                        {t.sections.latestArticles.title}
                    </h3>
                </div>



                {isLoadingPosts ? (
                    <div className="space-y-6">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex gap-6 h-32 bg-slate-50 animate-pulse rounded-3xl"></div>
                        ))}
                    </div>
                ) : (


                    <div className="space-y-6">
                        {posts.map((post) => (
                            <Link
                                key={post.id}
                                href={`/post/${post.id}`}
                                className="group flex flex-col md:flex-row gap-6 pb-6 border-b border-slate-50 last:border-0"
                            >
                                <div className="w-full md:w-48 h-32 shrink-0 rounded-[1.5rem] overflow-hidden shadow-md">

                                    <img
                                        src={post.coverImage}
                                        alt={post.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest">{post.category}</span>
                                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                        <span className="text-[10px] font-bold text-slate-400">{post.publishedAt}</span>
                                    </div>
                                    <h4 className="text-xl font-black text-brand-heading group-hover:text-brand-primary transition-colors leading-tight line-clamp-1">
                                        {post.title}
                                    </h4>
                                    <p className="text-xs text-slate-500 font-medium line-clamp-2">
                                        {post.excerpt}
                                    </p>

                                    <div className="flex items-center justify-between pt-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                                                <span className="text-[9px] font-black text-slate-400">{post.author.charAt(0)}</span>
                                            </div>
                                            <span className="text-xs font-bold text-slate-500">{post.author}</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                                            <div className="flex items-center gap-1.5">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                {post.viewsCount?.toLocaleString() || 0}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                                                {post.commentsCount || 0}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </Link>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                <div className="flex items-center justify-center gap-4 pt-12">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className="px-6 py-3 rounded-2xl bg-slate-100 text-brand-heading font-black text-sm hover:bg-brand-primary hover:text-white transition-all disabled:opacity-30"
                    >
                        PREV
                    </button>
                    <span className="text-lg font-black text-brand-heading px-4">
                        {currentPage}
                    </span>
                    <button
                        onClick={() => setCurrentPage(p => p + 1)}
                        className="px-6 py-3 rounded-2xl bg-slate-100 text-brand-heading font-black text-sm hover:bg-brand-primary hover:text-white transition-all"
                    >
                        NEXT
                    </button>
                </div>
            </div>

            {/* Right Column: Sidebar */}
            <aside className="lg:col-span-4 space-y-12">
                <div className="bg-brand-heading rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 blur-3xl rounded-full"></div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-8 italic relative z-10">
                        {t.sections.liveScores.title}
                    </h3>



                    {isLoadingMatches ? (
                        <div className="space-y-6">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="h-24 bg-white/5 animate-pulse rounded-2xl"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-6 relative z-10">
                            {matches.map((match) => (
                                <div key={match.id} className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-brand-primary/30 transition-all group">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{match.league}</span>
                                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${match.status === 'LIVE' ? 'bg-red-500 text-white animate-pulse' : 'bg-white/10 text-slate-400'}`}>
                                            {match.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex-1 flex flex-col items-center">
                                            <span className="text-xs font-black text-white truncate w-full text-center">{match.homeTeam.name}</span>
                                            <span className="text-2xl font-black text-brand-primary font-mono">{match.homeTeam.score}</span>
                                        </div>
                                        <div className="text-white/10 font-black text-xl italic mt-6">VS</div>
                                        <div className="flex-1 flex flex-col items-center">
                                            <span className="text-xs font-black text-white truncate w-full text-center">{match.awayTeam.name}</span>
                                            <span className="text-2xl font-black text-brand-primary font-mono">{match.awayTeam.score}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <Link
                        href="/matches"
                        className="mt-8 flex items-center justify-center gap-2 py-4 rounded-xl bg-white/5 text-white/40 text-xs font-black uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-all"
                    >
                        View Game Center
                    </Link>
                </div>

                <AdBanner position="SIDE" />
            </aside>
        </section>
    );
};
