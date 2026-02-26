import React from 'react';
import Link from 'next/link';
import { Card } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';
import { ArticleDTO } from '@/types';
import { useTranslation } from '@/lib/i18n/LanguageProvider';

interface PostCardProps {
    post?: ArticleDTO;
    isLoading?: boolean;
}

/**
 * PostCard component for blog post previews.
 */
export const PostCard: React.FC<PostCardProps> = ({ post, isLoading }) => {
    const { t } = useTranslation();

    if (isLoading || !post) {
        return (
            <Card className="flex flex-col gap-4 !p-0 overflow-hidden border-slate-100">
                <Skeleton className="h-48 w-full" />
                <div className="p-6 space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <div className="flex justify-between items-center pt-4">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card className="flex flex-col !p-0 overflow-hidden group border-slate-100">
            {/* Image Container */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={post.cover_url}
                    alt={post.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest rounded shadow-lg border border-white/20">
                        {post.category}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {new Date(post.created_at).toLocaleDateString()}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-brand-primary/20"></span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {post.author.name}
                    </span>
                </div>

                <h3 className="text-xl font-bold mb-3 leading-tight group-hover:text-brand-primary transition-colors line-clamp-2 text-brand-heading">
                    {post.title}
                </h3>

                <p className="text-sm text-slate-500 line-clamp-2 mb-6 leading-relaxed">
                    {post.excerpt}
                </p>

                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link
                        href={post.target_url || `/post/${post.id}`}
                        className="text-xs font-black text-brand-primary uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all"
                    >
                        {t.common.readMore}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </Card>
    );
};
