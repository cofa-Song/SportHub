"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Post } from '@/types';
import { SportApi } from '@/services/api';
import { useTranslation } from '@/lib/i18n/LanguageProvider';


/**
 * HotArticlesGrid Component.
 * Fixed 3x2 grid of featured articles.
 */
export const HotArticlesGrid: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { locale, t } = useTranslation();


    useEffect(() => {
        const fetchHotPosts = async () => {
            const res = await SportApi.getPosts(1, 6); // Page 1, limit 6
            if (res.status === 200) {
                setPosts(res.data);
            }
            setIsLoading(false);
        };
        fetchHotPosts();
    }, []);

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-[400px] bg-slate-50 animate-pulse rounded-3xl"></div>
                ))}
            </div>
        );
    }

    return (
        <section className="mb-20">
            <div className="flex items-end justify-between mb-10">
                <div>
                    <span className="text-brand-primary font-black text-xs uppercase tracking-[0.3em] mb-3 block">
                        {locale === 'en' ? 'Trending Now' : locale === 'zh-TW' ? '熱門焦點' : '热门焦点'}
                    </span>
                    <h3 className="text-4xl font-black text-brand-heading tracking-tighter">
                        {t.sections.hotArticles.title}
                    </h3>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                    <Link
                        key={post.id}
                        href={`/post/${post.id}`}
                        className="group flex flex-col h-full bg-white rounded-3xl overflow-hidden border border-slate-100/50 shadow-sm hover:shadow-2xl hover:shadow-brand-primary/10 transition-all duration-500"
                    >
                        <div className="relative h-64 overflow-hidden">
                            <img
                                src={post.coverImage}
                                alt={post.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute top-4 left-4">
                                <span className="px-4 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black text-brand-heading uppercase">
                                    {post.category}
                                </span>
                            </div>
                        </div>
                        <div className="p-8 flex-1 flex flex-col">
                            <h4 className="text-xl font-black text-brand-heading mb-4 leading-snug group-hover:text-brand-primary transition-colors">
                                {post.title}
                            </h4>
                            <p className="text-sm text-slate-400 line-clamp-2 mb-6 font-medium">
                                {post.excerpt}
                            </p>

                            <div className="mt-auto space-y-4">
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
                                <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                                            <span className="text-[8px] font-black text-slate-400">{post.author.charAt(0)}</span>
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{post.author}</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{post.publishedAt}</span>
                                </div>
                            </div>
                        </div>

                    </Link>
                ))}
            </div>
        </section>
    );
};
