"use client";

import React from 'react';
import Link from 'next/link';
import { ArticleDTO } from '@/types';
import { useTranslation } from '@/lib/i18n/LanguageProvider';
import { formatFriendlyDate } from '@/lib/utils/date';

interface AnalysisHotGridProps {
    posts: ArticleDTO[];
}

/**
 * AnalysisHotGrid Component.
 * Horizontal card layout (2 columns) for Analysis Hall hot articles.
 */
export const AnalysisHotGrid: React.FC<AnalysisHotGridProps> = ({ posts }) => {
    const { locale } = useTranslation();

    if (!posts || posts.length === 0) return null;

    return (
        <section className="mb-20">
            <div className="flex items-end justify-between mb-10">
                <div>
                    <span className="text-brand-primary font-black text-xs uppercase tracking-[0.3em] mb-3 block">
                        {locale === 'en' ? 'Trending' : '熱門焦點'}
                    </span>
                    <h3 className="text-4xl font-black text-brand-heading tracking-tighter">
                        熱門分析
                    </h3>
                </div>
            </div>

            {/* 2 Columns Grid with horizontal cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map((post) => (
                    <div key={post.id} className="group">
                        <div className="flex gap-4 h-full">
                            {/* Image Section - Left Side (40% width) */}
                            <div className="w-2/5 flex-shrink-0">
                                <Link
                                    href={post.target_url || `/post/${post.id}`}
                                    className="block relative overflow-hidden rounded-xl aspect-video bg-slate-100"
                                >
                                    <img
                                        src={post.cover_url}
                                        alt={post.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </Link>
                            </div>

                            {/* Content Section - Right Side (60% width) */}
                            <div className="flex-1 flex flex-col justify-between py-1">
                                {/* Date */}
                                <div className="text-xs text-slate-400 font-semibold mb-2 flex items-center gap-2">
                                    <span>
                                        {formatFriendlyDate(post.created_at)}
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                                    <span className="text-brand-primary/80">{post.author.name}</span>
                                </div>

                                {/* Breadcrumb */}
                                <ul className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                                    <li className="flex items-center gap-1.5">
                                        <span className="font-semibold hover:text-brand-primary transition-colors cursor-pointer">
                                            {post.category}
                                        </span>
                                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </li>
                                    <li className="font-semibold text-brand-primary">
                                        熱門分析
                                    </li>
                                </ul>

                                {/* Title */}
                                <h4 className="text-base font-black text-brand-heading leading-tight mb-3 line-clamp-2 group-hover:text-brand-primary transition-colors">
                                    <Link href={post.target_url || `/post/${post.id}`}>
                                        {post.title}
                                    </Link>
                                </h4>

                                {/* Stats */}
                                <div className="flex items-center gap-3 text-[10px] text-slate-400 font-semibold mt-auto">
                                    {/* Views */}
                                    <div className="flex items-center gap-1">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        <span>{post.view_count?.toLocaleString() || 0}</span>
                                    </div>

                                    {/* Comments */}
                                    <div className="flex items-center gap-1">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                        </svg>
                                        <span>{post.comment_count || 0}</span>
                                    </div>

                                    {/* Bookmarks */}
                                    <div className="flex items-center gap-1">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                        </svg>
                                        <span>{post.collect_count || 0}</span>
                                    </div>

                                    {/* Shares */}
                                    <div className="flex items-center gap-1">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                        </svg>
                                        <span>{post.share_count || 0}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
