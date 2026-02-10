"use client";

import React, { useState } from 'react';
import { ArticleDTO } from '@/types';
import { useTranslation } from '@/lib/i18n/LanguageProvider';


interface NewsCarouselProps {
    news: ArticleDTO[];
}

/**
 * NewsCarousel Component.
 * Displays 4 items per page, 2 pages total (8 items).
 */
export const NewsCarousel: React.FC<NewsCarouselProps> = ({ news }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const { t } = useTranslation();

    if (!news || news.length === 0) return null;

    // chunk into pages of 4
    const pages = [];
    for (let i = 0; i < news.length; i += 4) {
        pages.push(news.slice(i, i + 4));
    }
    // Limit to 2 pages max as per design
    const displayPages = pages.slice(0, 2);


    return (
        <section className="mb-20 overflow-hidden">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-brand-heading uppercase tracking-tighter">
                    {t.sections.news.title}
                </h3>
            </div>


            <div className="relative mb-12">
                <div
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateX(-${currentPage * 100}%)` }}
                >
                    {displayPages.map((page, pIdx) => (
                        <div key={pIdx} className="w-full shrink-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-1">
                            {page.map((item) => (
                                <a
                                    key={item.id}
                                    href={item.target_url || `/post/${item.id}`}
                                    className="group relative block h-[500px] rounded-[2.5rem] overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-brand-primary/20"
                                >
                                    {/* Background Image */}
                                    <img
                                        src={item.cover_url}
                                        alt={item.title}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60"
                                    />

                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10"></div>

                                    {/* Category Label (Top-Left Square) */}
                                    <div className="absolute top-6 left-6 z-20">
                                        <div className="w-12 h-12 flex items-center justify-center border-2 border-brand-primary bg-black/40 backdrop-blur-md">
                                            <span className="text-[10px] font-black text-white text-center leading-tight uppercase tracking-tighter">
                                                {item.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content Overlay (Bottom) */}
                                    <div className="absolute bottom-0 left-0 p-8 z-20 w-full">
                                        <h4 className="text-xl font-black text-white leading-tight group-hover:text-brand-primary transition-colors line-clamp-2 mb-4">
                                            {item.title}
                                        </h4>
                                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                                                {new Date(item.created_at).toLocaleDateString()}
                                            </span>
                                            <svg className="w-5 h-5 text-white/20 group-hover:text-brand-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Centered Pagination Bars */}
            <div className="flex justify-center gap-3">
                {displayPages.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentPage(idx)}
                        className={`h-1.5 rounded-full transition-all duration-500 ${currentPage === idx ? 'w-16 bg-brand-primary shadow-[0_0_10px_rgba(255,59,48,0.5)]' : 'w-8 bg-slate-200 hover:bg-slate-300'
                            }`}
                        aria-label={`Page ${idx + 1}`}
                    />
                ))}
            </div>
        </section>

    );
};
