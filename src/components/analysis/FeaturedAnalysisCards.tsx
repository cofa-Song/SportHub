"use client";

import React from 'react';
import Link from 'next/link';
import { ArticleDTO } from '@/types';

interface FeaturedAnalysisCardsProps {
    analysis: ArticleDTO[];
}

/**
 * FeaturedAnalysisCards Component.
 * Zigzag alternating layout for featured analysis - inspired by sportsv design.
 */
export const FeaturedAnalysisCards: React.FC<FeaturedAnalysisCardsProps> = ({ analysis }) => {
    if (!analysis || analysis.length === 0) return null;

    return (
        <section className="mb-24">
            <div className="mb-16">
                <h2 className="text-4xl font-black text-brand-heading tracking-tight border-b-4 border-brand-primary pb-4 inline-block">
                    精選分析
                </h2>
            </div>

            <div className="space-y-20">
                {analysis.map((article, index) => {
                    const isEven = index % 2 === 0;

                    return (
                        <div key={article.id} className="relative">
                            <div className={`flex flex-col gap-8 ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                                {/* Image Column */}
                                <div className="lg:w-1/2">
                                    <Link
                                        href={article.target_url || `/post/${article.id}`}
                                        className="block group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500"
                                    >
                                        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                                            <img
                                                src={article.cover_url}
                                                alt={article.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        </div>
                                    </Link>
                                </div>

                                {/* Content Column */}
                                <div className="lg:w-1/2 flex flex-col justify-center">
                                    <div className="space-y-6">
                                        {/* Breadcrumb */}
                                        <ul className="flex items-center gap-2 text-sm text-slate-500">
                                            <li className="flex items-center gap-2">
                                                {article.category}
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                深度分析
                                            </li>
                                        </ul>

                                        {/* Title */}
                                        <h3 className="text-3xl lg:text-4xl font-black text-brand-heading leading-tight hover:text-brand-primary transition-colors">
                                            <Link href={article.target_url || `/post/${article.id}`}>
                                                {article.title}
                                            </Link>
                                        </h3>

                                        {/* Description */}
                                        <p className="text-lg text-slate-600 leading-relaxed">
                                            {article.excerpt}
                                        </p>

                                        {/* Button */}
                                        <div className="pt-4">
                                            <Link
                                                href={article.target_url || `/post/${article.id}`}
                                                className="inline-flex items-center gap-3 px-8 py-4 bg-white border-2 border-brand-primary text-brand-primary font-bold rounded-lg hover:bg-brand-primary hover:text-white transition-all duration-300 shadow-md hover:shadow-xl group"
                                            >
                                                完整分析
                                                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Background Element */}
                            <div
                                className={`hidden lg:block absolute top-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 rounded-full blur-3xl -z-10 ${isEven ? 'right-0 translate-x-32' : 'left-0 -translate-x-32'
                                    }`}
                            ></div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};
