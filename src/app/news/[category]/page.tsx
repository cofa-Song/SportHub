import React from 'react';
import { SportApi } from '@/services/api';
import { AdBanner } from '@/components/shared/AdBanner';
import { NewsHotGrid } from '@/components/news/NewsHotGrid';
import { FeaturedNewsCards } from '@/components/news/FeaturedNewsCards';
import { NewsList } from '@/components/news/NewsList';
import { notFound } from 'next/navigation';

interface NewsCategoryPageProps {
    params: {
        category: string;
    };
}

export async function generateMetadata({ params }: NewsCategoryPageProps) {
    const { category } = await Promise.resolve(params);
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
    return {
        title: `${categoryName} News | SportHub`,
        description: `Latest ${categoryName} news and updates.`,
    };
}

export default async function NewsCategoryPage({ params }: NewsCategoryPageProps) {
    const { category } = await Promise.resolve(params);

    // Validate allowed categories? For now, we trust the API or just pass it through.
    // Ideally, we'd check if specific categories are valid.

    const response = await SportApi.getNewsData(category);

    if (!response || response.status !== 200) {
        notFound();
    }

    const data = response.data;

    return (
        <div className="container mx-auto px-6 py-8">
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
