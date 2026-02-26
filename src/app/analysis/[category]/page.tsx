import React from 'react';
import { SportApi } from '@/services/api';
import { AdBanner } from '@/components/shared/AdBanner';
import { AnalysisHotGrid } from '@/components/analysis/AnalysisHotGrid';
import { FeaturedAnalysisCards } from '@/components/analysis/FeaturedAnalysisCards';
import { AnalysisList } from '@/components/analysis/AnalysisList';

interface AnalysisCategoryPageProps {
    params: {
        category: string;
    };
}

export async function generateStaticParams() {
    return [
        { category: 'baseball' },
        { category: 'basketball' },
        { category: 'others' }
    ];
}

export const metadata = {
    title: '賽事分析 - 分類 | SportHub',
    description: '依分類查看深度賽事分析',
};

export default async function AnalysisCategoryPage({ params }: AnalysisCategoryPageProps) {
    const { category } = await Promise.resolve(params);
    const response = await SportApi.getAnalysisData(category);
    const data = {
        ...response.data,
        hot_news: response.data.hot_news.filter(n => n.type === 'ANALYSIS'),
        featured_news: response.data.featured_news.filter(n => n.type === 'ANALYSIS'),
        latest_news: response.data.latest_news.filter(n => n.type === 'ANALYSIS')
    };

    // Category display names
    const categoryNames: Record<string, string> = {
        baseball: '棒球',
        basketball: '籃球',
        others: '其他運動'
    };

    const displayCategory = categoryNames[category] || category;

    return (
        <div className="container mx-auto px-6 pb-8">
            {/* Category Header */}
            <div className="mb-12 pt-8">
                <div className="inline-block">
                    <h1 className="text-5xl font-black text-brand-heading tracking-tight mb-3">
                        {displayCategory} 分析
                    </h1>
                    <div className="h-2 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full"></div>
                </div>
            </div>

            {/* 1. Top Horizontal Ad */}
            <AdBanner ads={data.top_ad} position="TOP" />

            {/* 2. Hot Analysis Grid (2x3) */}
            <AnalysisHotGrid posts={data.hot_news} />

            {/* 3. Featured Analysis (2 items) */}
            <FeaturedAnalysisCards analysis={data.featured_news} />

            {/* 4. Latest Analysis List */}
            <AnalysisList analysis={data.latest_news} />
        </div>
    );
}
