"use client";

import React, { useState } from 'react';
import { ArticleDetailDTO } from '@/types';
import { useAuth } from '../shared/MockAuthProvider';

interface InteractionBarProps {
    article: ArticleDetailDTO;
}

export const InteractionBar: React.FC<InteractionBarProps> = ({ article }) => {
    const { isLoggedIn, login } = useAuth();
    const [isCollected, setIsCollected] = useState(false);
    const [showCopyToast, setShowCopyToast] = useState(false);

    const handleCollect = () => {
        if (!isLoggedIn) {
            alert('請先登入');
            login();
            return;
        }
        setIsCollected(!isCollected);
    };

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setShowCopyToast(true);
            setTimeout(() => setShowCopyToast(false), 2000);
        } catch (err) {
            console.error('Failed to copy!', err);
        }
    };

    return (
        <div className="flex items-center justify-between border-t border-b border-slate-100 py-6 mb-10">
            {/* Left: Stats */}
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-slate-500">
                    <span className="text-xl">💬</span>
                    <span className="font-bold">{article.comment_count}</span>
                </div>
                <div
                    onClick={handleCollect}
                    className={`flex items-center gap-2 cursor-pointer transition-colors ${isCollected ? 'text-yellow-500' : 'text-slate-500 hover:text-yellow-500'}`}
                >
                    <span className="text-xl">{isCollected ? '★' : '☆'}</span>
                    <span className="font-bold">{isCollected ? '已收藏' : '收藏'}</span>
                </div>
            </div>

            {/* Right: Share */}
            <div className="relative">
                <button
                    onClick={handleShare}
                    className="flex items-center gap-2 text-slate-500 hover:text-brand-primary transition-colors font-bold"
                >
                    <span className="text-xl">🔗</span>
                    分享文章
                </button>

                {/* Toast */}
                {showCopyToast && (
                    <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-black/80 text-white text-xs rounded-full whitespace-nowrap animate-fade-in-up">
                        成功複製連結！
                    </div>
                )}
            </div>
        </div>
    );
};
