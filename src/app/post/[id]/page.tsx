import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SportApi } from '@/services/api';
import { AdBanner } from '@/components/shared/AdBanner';
import { CommentSection } from '@/components/shared/CommentSection';
import { CoverAdModel } from '@/components/layout/CoverAdModel';
import { InteractionBar } from '@/components/news/InteractionBar';

// Helper to inject ads into content
const ContentWithAds = ({ content }: { content: string }) => {
    // Split by double newline to identify paragraphs
    const paragraphs = content.split('\n\n');

    return (
        <div className="article-content text-lg leading-relaxed text-slate-700 space-y-6">
            {paragraphs.map((p, index) => (
                <React.Fragment key={index}>
                    <p>{p}</p>
                    {/* Insert Ad every 3 paragraphs (index 2, 5, 8...) */}
                    {(index + 1) % 3 === 0 && index !== paragraphs.length - 1 && (
                        <div className="my-8 flex justify-center w-full">
                            <div className="w-[300px] h-[250px] bg-slate-100 flex items-center justify-center rounded-lg border border-slate-200">
                                <span className="text-slate-400 font-bold">ADVERTISEMENT</span>
                            </div>
                        </div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

export default async function PostPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const response = await SportApi.getArticleDetail(id);

    if (response.status !== 200 || !response.data) {
        return notFound();
    }

    const article = response.data;

    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            {/* 1. Top Ad (Contained) */}
            <div className="container mx-auto px-4 max-w-4xl mb-8">
                <AdBanner ads={[{
                    ad_id: 'top-ad',
                    image_url: '/img/home/db1a163c-c47d-4442-a6b7-2467c0b7ec5c/ad_sports_gear_1770628472549.png',
                    target_url: '#', label_text: '贊助', campaign_id: 'c1', track_click_url: '', track_impression_url: ''
                }]} position="TOP" />
            </div>

            {/* 2. Hero Image (Full Width with Blur Background) */}
            <div className="relative w-full h-[300px] md:h-[500px] mb-12 overflow-hidden group">
                {/* Background Blur */}
                <div
                    className="absolute inset-0 bg-cover bg-center blur-xl opacity-60 scale-105 transform transition-transform duration-700"
                    style={{ backgroundImage: `url(${article.cover_url})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-50/80 to-transparent" />

                {/* Main Image */}
                <div className="container mx-auto px-4 max-w-4xl h-full flex items-center justify-center relative z-10 py-6">
                    <img
                        src={article.cover_url}
                        alt={article.title}
                        className="w-full h-full rounded-xl shadow-2xl object-cover hover:scale-[1.01] transition-transform duration-500"
                    />
                </div>
            </div>

            {/* 3. Main Content (Contained) */}
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Breadcrumb & Date */}
                <div className="flex items-center justify-between mb-6 text-sm text-slate-500 font-bold">
                    <div className="flex items-center gap-2">
                        <Link href="/" className="hover:text-brand-primary transition-colors">首頁</Link>
                        <span>/</span>
                        <Link href="/news" className="hover:text-brand-primary transition-colors">最新消息</Link>
                        <span>/</span>
                        <span className="text-brand-primary">{article.category}</span>
                    </div>
                    <div>{new Date(article.created_at).toLocaleDateString()}</div>
                </div>

                {/* Title & Stats */}
                <div className="mb-10 text-center">
                    <h1 className="text-3xl md:text-4xl font-black text-brand-heading mb-4 leading-tight">
                        {article.title}
                    </h1>
                    <div className="flex items-center justify-center gap-6 text-slate-400 text-sm font-bold">
                        <span className="flex items-center gap-1">
                            👀 {article.view_count.toLocaleString()} 阅读
                        </span>
                        <span className="flex items-center gap-1">
                            💬 {article.comment_count} 评论
                        </span>
                        <span className="flex items-center gap-1">
                            🔥 {article.collect_count} 收藏
                        </span>
                    </div>
                </div>

                {/* Article Content */}
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 mb-12">
                    <ContentWithAds content={article.content} />
                </div>

                {/* Interaction Bar */}
                <InteractionBar article={article} />

                {/* Comments Section */}
                <CommentSection articleId={article.id} initialComments={article.comments} />

            </div>
        </div>
    );
}
