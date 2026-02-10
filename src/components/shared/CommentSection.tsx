"use client";

import React, { useState } from 'react';
import { CommentDTO } from '@/types';
import { useAuth } from './MockAuthProvider';
import { SportApi } from '@/services/api';

interface CommentSectionProps {
    articleId: string;
    initialComments: CommentDTO[];
}

export const CommentSection: React.FC<CommentSectionProps> = ({ articleId, initialComments }) => {
    const { isLoggedIn, login } = useAuth();
    const [comments, setComments] = useState<CommentDTO[]>(initialComments);
    const [newComment, setNewComment] = useState('');
    const [page, setPage] = useState(1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const handleLoadMore = async () => {
        setIsLoadingMore(true);
        try {
            const nextPage = page + 1;
            const res = await SportApi.getComments(articleId, nextPage);
            if (res.status === 200 && res.data.length > 0) {
                setComments([...comments, ...res.data]);
                setPage(nextPage);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingMore(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        // Optimistic update
        const mockComment: CommentDTO = {
            id: `new-${Date.now()}`,
            content: newComment,
            author: { id: 'u-current', name: 'Demo User', avatar: '', level_tag: 'Fan' },
            created_at: new Date().toISOString(),
            like_count: 0
        };

        setComments([mockComment, ...comments]);
        setNewComment('');
    };

    return (
        <div className="mt-12">
            <h3 className="text-2xl font-black text-brand-heading mb-6 tracking-tight flex items-center gap-2">
                評論 <span className="text-sm font-normal text-slate-500">({comments.length})</span>
            </h3>

            {/* Comment Input */}
            <div className="mb-10 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                {isLoggedIn ? (
                    <form onSubmit={handleSubmit}>
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0">
                                <span className="font-bold text-brand-primary">U</span>
                            </div>
                            <div className="flex-1">
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="分享你的看法..."
                                    className="w-full h-24 p-4 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-brand-primary/20 resize-none text-brand-heading placeholder:text-slate-400"
                                />
                                <div className="flex justify-end mt-3">
                                    <button
                                        type="submit"
                                        disabled={!newComment.trim()}
                                        className="bg-brand-primary text-white px-6 py-2 rounded-full font-bold hover:bg-brand-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        發送評論
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-slate-500 mb-4">登入後參與討論</p>
                        <button
                            onClick={login}
                            className="bg-brand-heading text-white px-8 py-2 rounded-full font-bold hover:bg-black transition-colors"
                        >
                            立即登入
                        </button>
                    </div>
                )}
            </div>

            {/* Comment List */}
            <div className="space-y-6">
                {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                            {comment.author.avatar ? (
                                <img src={comment.author.avatar} alt={comment.author.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="font-bold text-slate-400">{comment.author.name[0]}</span>
                            )}
                        </div>
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-brand-heading">{comment.author.name}</span>
                                    <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full font-bold uppercase">
                                        {comment.author.level_tag}
                                    </span>
                                </div>
                                <span className="text-xs text-slate-400">
                                    {new Date(comment.created_at).toLocaleString()}
                                </span>
                            </div>
                            <p className="text-slate-600 leading-relaxed text-sm">
                                {comment.content}
                            </p>
                            <div className="flex items-center gap-4">
                                <button className="text-slate-400 hover:text-brand-primary text-xs font-bold flex items-center gap-1 transition-colors">
                                    <span>👍</span> {comment.like_count}
                                </button>
                                <button className="text-slate-400 hover:text-brand-heading text-xs font-bold transition-colors">
                                    回覆
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Load More */}
            <div className="mt-10 text-center">
                <button
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="text-brand-primary font-bold hover:text-brand-heading transition-colors items-center gap-2 inline-flex"
                >
                    {isLoadingMore ? '載入中...' : '更多評論 +'}
                </button>
            </div>
        </div>
    );
};
