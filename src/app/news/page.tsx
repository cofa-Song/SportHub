import React from 'react';
import { SportApi } from '@/services/api';
import { AdBanner } from '@/components/shared/AdBanner';
import { NewsHotGrid } from '@/components/news/NewsHotGrid';
import { FeaturedNewsCards } from '@/components/news/FeaturedNewsCards';
import { NewsList } from '@/components/news/NewsList';

export const metadata = {
    title: 'News Hall | SportHub',
    description: 'Latest sports news, scores, and analysis.',
};

export default async function NewsPage() {
    const response = await SportApi.getNewsData();
    const data = {
        ...response.data,
        hot_news: response.data.hot_news.filter(n => n.type === 'NEWS'),
        featured_news: response.data.featured_news.filter(n => n.type === 'NEWS'),
        latest_news: response.data.latest_news.filter(n => n.type === 'NEWS')
    };

    return (
        <div className="container mx-auto px-6 pb-8">
            {/* 1. Top Horizontal Ad */}
            <AdBanner ads={data.top_ad} position="TOP" />

            {/* 2. Hot News Grid (2x3) */}
            <NewsHotGrid posts={data.hot_news} />

            {/* 3. Featured News (2 items) */}
            <FeaturedNewsCards news={data.featured_news} />

            {/* 4. Latest News List */}
            <NewsList news={data.latest_news} />
        </div>
    );
}
