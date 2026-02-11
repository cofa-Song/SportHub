"use client";

import React from 'react';
import Link from 'next/link';
import { ArticleDTO } from '@/types';
import { useTranslation } from '@/lib/i18n/LanguageProvider';
import { formatFriendlyDate } from '@/lib/utils/date';

interface AnalysisListProps {
    analysis: ArticleDTO[];
}

export const AnalysisList: React.FC<AnalysisListProps> = ({ analysis }) => {
    const { t } = useTranslation();

    if (!analysis || analysis.length === 0) return null;

    return (
        <section className="mb-20">
            <div className="mb-8 border-b-2 border-slate-50 pb-4">
                <h3 className="text-2xl font-black text-brand-heading uppercase tracking-tighter italic">
                    最新分析
                </h3>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {analysis.map((item) => (
                    <Link
                        key={item.id}
                        href={item.target_url || `/post/${item.id}`}
                        className="group flex flex-col md:flex-row gap-6 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-brand-primary/20 transition-all duration-300"
                    >
                        {/* Image - Widen to reduce right text space */}
                        <div className="w-full md:w-[40%] aspect-[16/9] shrink-0 rounded-xl overflow-hidden relative">
                            <img
                                src={item.cover_url}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute top-3 left-3">
                                <span className="px-3 py-1 bg-white/90 backdrop-blur rounded-full text-[10px] font-black text-brand-heading uppercase tracking-wider">
                                    {item.category}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex flex-col justify-between py-1">
                            <div>
                                <div className="flex items-center gap-2 mb-3 text-xs text-slate-400 font-bold uppercase tracking-wider">
                                    <span>{formatFriendlyDate(item.created_at)}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                                    <span className="text-brand-primary/80">{item.author.name}</span>
                                </div>

                                <h4 className="text-xl font-black text-brand-heading mb-3 leading-snug group-hover:text-brand-primary transition-colors">
                                    {item.title}
                                </h4>
                                <p className="text-slate-500 leading-relaxed line-clamp-2 font-medium">
                                    {item.excerpt}
                                </p>
                            </div>

                            {/* Stats */}
                            <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-4 text-slate-400">
                                    <div className="flex items-center gap-1.5 text-xs font-bold">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        {item.view_count?.toLocaleString() || 0}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs font-bold">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                                        {item.comment_count || 0}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs font-bold">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                                        {item.collect_count || 0}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs font-bold">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                                        {item.share_count || 0}
                                    </div>
                                </div>

                                <div className="hidden md:flex items-center gap-2 text-brand-primary font-black text-xs uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                                    閱讀更多 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="mt-8 flex justify-center">
                <button className="px-8 py-3 rounded-xl bg-slate-100 text-brand-heading text-xs font-black uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-colors">
                    更多分析
                </button>
            </div>
        </section>
    );
};
