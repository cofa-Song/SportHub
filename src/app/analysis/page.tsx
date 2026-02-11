import React from 'react';
import { SportApi } from '@/services/api';
import { AdBanner } from '@/components/shared/AdBanner';
import { AnalysisHotGrid } from '@/components/analysis/AnalysisHotGrid';
import { FeaturedAnalysisCards } from '@/components/analysis/FeaturedAnalysisCards';
import { AnalysisList } from '@/components/analysis/AnalysisList';

export const metadata = {
    title: '賽事分析 | SportHub',
    description: '深度賽事分析、戰術解讀與比賽預測',
};

export default async function AnalysisPage() {
    const response = await SportApi.getAnalysisData();
    const data = {
        ...response.data,
        hot_news: response.data.hot_news.filter(n => n.type === 'ANALYSIS'),
        featured_news: response.data.featured_news.filter(n => n.type === 'ANALYSIS'),
        latest_news: response.data.latest_news.filter(n => n.type === 'ANALYSIS')
    };

    return (
        <div className="container mx-auto px-6 pb-8">
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
