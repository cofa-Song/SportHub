"use client";

import React from 'react';
import Link from 'next/link';
import { ArticleDTO } from '@/types';
import { formatFriendlyDate } from '@/lib/utils/date';

interface RelatedArticlesProps {
    articles: ArticleDTO[];
}

export const RelatedArticles: React.FC<RelatedArticlesProps> = ({ articles }) => {
    if (!articles || articles.length === 0) return null;

    // Display only up to 2 articles
    const displayArticles = articles.slice(0, 2);

    return (
        <section className="mb-12 border-t border-slate-100 pt-10">
            <h3 className="text-2xl font-black text-brand-heading mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-brand-primary rounded-full"></span>
                延伸閱讀
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {displayArticles.map((article) => (
                    <Link
                        key={article.id}
                        href={article.target_url || `/post/${article.id}`}
                        className="group flex gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                    >
                        {/* Image */}
                        <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-slate-200">
                            <img
                                src={article.cover_url}
                                alt={article.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex flex-col justify-between py-1">
                            <h4 className="font-bold text-brand-heading leading-snug line-clamp-2 group-hover:text-brand-primary transition-colors">
                                {article.title}
                            </h4>

                            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                                <span>{formatFriendlyDate(article.created_at)}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                <span className="text-brand-primary/80">
                                    {article.type === 'ANALYSIS' ? article.author.name : article.source}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};
