"use client";

import React, { useState, useEffect } from 'react';
import { CommentDTO, Author } from '@/types';
import { useAuth } from './MockAuthProvider';
import { SportApi } from '@/services/api';

interface CommentSectionProps {
    articleId: string;
    initialComments: CommentDTO[];
}

export const CommentSection: React.FC<CommentSectionProps> = ({ articleId, initialComments }) => {
    const { isLoggedIn, login, user } = useAuth();
    const [comments, setComments] = useState<CommentDTO[]>(initialComments);
    const [newComment, setNewComment] = useState('');
    const [page, setPage] = useState(1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMoreComments, setHasMoreComments] = useState(true);

    // Submission states
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittingReplyId, setSubmittingReplyId] = useState<string | null>(null);
    const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);

    // States for reply
    const [replyToId, setReplyToId] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState('');

    // States for reply visibility and pagination
    const [expandedCommentIds, setExpandedCommentIds] = useState<Set<string>>(new Set());
    const [replyPageMap, setReplyPageMap] = useState<Record<string, number>>({});

    const handleLoadMore = async () => {
        if (isLoadingMore || !hasMoreComments) return;
        setIsLoadingMore(true);
        try {
            const nextPage = page + 1;
            const res = await SportApi.getComments(articleId, nextPage);
            if (res.status === 200) {
                if (res.data.length === 0) {
                    setHasMoreComments(false);
                } else {
                    const newComments = res.data.map(c => ({
                        ...c,
                        reply_count: c.reply_count || 0,
                        replies: c.replies || [],
                        is_author: c.is_author || false,
                        is_like: c.is_like || false
                    }));
                    setComments([...comments, ...newComments]);
                    setPage(nextPage);
                    if (res.data.length < 10) {
                        setHasMoreComments(false);
                    }
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingMore(false);
        }
    };

    const getCurrentAuthor = (): Author => {
        if (user) {
            return {
                id: user.id,
                name: user.name,
                avatar: user.avatar,
                level_tag: 'Fan'
            };
        }
        return { id: 'u-current', name: 'Demo User', avatar: '', level_tag: 'Fan' };
    };

    const formatCommentTime = (dateString: string) => {
        const commentDate = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - commentDate.getTime()) / (1000 * 60));

        if (diffInMinutes < 60 && diffInMinutes >= 0) {
            return `${Math.max(1, diffInMinutes)}分鐘前`;
        }

        return commentDate.toISOString().split('T')[0];
    };

    const checkRateLimit = () => {
        const now = Date.now();
        if (now - lastSubmitTime < 10000) {
            const remaining = Math.ceil((10000 - (now - lastSubmitTime)) / 1000);
            alert(`請慢一點，冷卻中... (剩餘 ${remaining} 秒)`);
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || isSubmitting) return;
        if (!checkRateLimit()) return;

        setIsSubmitting(true);

        try {
            // Simulate API delay
            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    // Randomly fail for testing? No, user didn't ask for random failure.
                    resolve(true);
                }, 1500);
            });

            const mockComment: CommentDTO = {
                id: `new-${Date.now()}`,
                content: newComment,
                author: getCurrentAuthor(),
                created_at: new Date().toISOString(),
                like_count: 0,
                reply_count: 0,
                is_author: false, // In reality, fetch from backend if user = author
                is_like: false,
                replies: []
            };

            setComments([mockComment, ...comments]);
            setNewComment('');
            setLastSubmitTime(Date.now());
        } catch (error) {
            alert('發送失敗，請再試一次');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLike = (commentId: string) => {
        if (!isLoggedIn) {
            alert('請先登入後按讚');
            return;
        }
        setComments(prev => prev.map(c => {
            if (c.id === commentId) {
                const newLikeState = !c.is_like;
                return {
                    ...c,
                    is_like: newLikeState,
                    like_count: newLikeState ? c.like_count + 1 : c.like_count - 1
                };
            }
            if (c.replies) {
                return {
                    ...c,
                    replies: c.replies.map(r => {
                        if (r.id === commentId) {
                            const newLikeState = !r.is_like;
                            return {
                                ...r,
                                is_like: newLikeState,
                                like_count: newLikeState ? r.like_count + 1 : r.like_count - 1
                            };
                        }
                        return r;
                    })
                };
            }
            return c;
        }));
    };

    const handleReplyClick = (commentId: string) => {
        if (!isLoggedIn) {
            alert('請先登入後回覆');
            return;
        }
        setReplyToId(replyToId === commentId ? null : commentId);
        setReplyContent('');
    };

    const toggleReplies = (commentId: string) => {
        setExpandedCommentIds(prev => {
            const next = new Set(prev);
            if (next.has(commentId)) {
                next.delete(commentId);
            } else {
                next.add(commentId);
                if (!replyPageMap[commentId]) {
                    setReplyPageMap(prevMap => ({ ...prevMap, [commentId]: 1 }));
                }
            }
            return next;
        });
    };

    const loadMoreReplies = (commentId: string) => {
        setReplyPageMap(prev => ({
            ...prev,
            [commentId]: (prev[commentId] || 1) + 1
        }));
    };

    const handleSubmitReply = async (parentId: string) => {
        if (!replyContent.trim() || submittingReplyId) return;
        if (!checkRateLimit()) return;

        setSubmittingReplyId(parentId);

        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            const newReply: CommentDTO = {
                id: `reply-${Date.now()}`,
                content: replyContent,
                author: getCurrentAuthor(),
                created_at: new Date().toISOString(),
                like_count: 0,
                reply_count: 0,
                is_author: false,
                is_like: false
            };

            setComments(prev => prev.map(c => {
                if (c.id === parentId) {
                    return {
                        ...c,
                        reply_count: c.reply_count + 1,
                        replies: [newReply, ...(c.replies || [])] // Specification says "insertion", usually top
                    };
                }
                return c;
            }));

            if (!expandedCommentIds.has(parentId)) {
                toggleReplies(parentId);
            }

            setReplyToId(null);
            setReplyContent('');
            setLastSubmitTime(Date.now());
        } catch (error) {
            alert('發送失敗，請再試一次');
        } finally {
            setSubmittingReplyId(null);
        }
    };

    const LoadingSpinner = ({ size = "h-4 w-4" }) => (
        <svg className={`animate-spin ${size} text-current`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    );

    const renderComment = (comment: CommentDTO, isReply = false) => {
        const isExpanded = expandedCommentIds.has(comment.id);
        const replyPage = replyPageMap[comment.id] || 1;
        const visibleRepliesCount = replyPage * 10;
        const visibleReplies = (comment.replies || []).slice(0, visibleRepliesCount);
        const hasMoreReplies = (comment.replies || []).length > visibleRepliesCount;
        const isThisSubmitting = submittingReplyId === comment.id;

        return (
            <div key={comment.id} className={`${isReply ? 'ml-12 mt-4' : 'mb-6'}`}>
                <div className="flex gap-4">
                    <a href={`/user/${comment.author.id}`} className={`${isReply ? 'w-8 h-8' : 'w-10 h-10'} rounded-full bg-slate-200 flex items-center justify-center shrink-0 overflow-hidden hover:opacity-80 transition-opacity`}>
                        {comment.author.avatar ? (
                            <img src={comment.author.avatar} alt={comment.author.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className={`font-bold text-slate-400 ${isReply ? 'text-xs' : ''}`}>{comment.author.name[0]}</span>
                        )}
                    </a>
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className={`font-bold text-brand-heading ${isReply ? 'text-sm' : ''}`}>{comment.author.name}</span>
                                {comment.is_author && (
                                    <span className="text-[10px] px-2 py-0.5 bg-brand-primary/10 text-brand-primary rounded-full font-bold">
                                        作者
                                    </span>
                                )}
                                {!isReply && !comment.is_author && (
                                    <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full font-bold uppercase">
                                        {comment.author.level_tag}
                                    </span>
                                )}
                            </div>
                            <span className="text-xs text-slate-400">
                                {formatCommentTime(comment.created_at)}
                            </span>
                        </div>
                        <p className={`text-slate-600 leading-relaxed overflow-y-auto max-h-[200px] ${isReply ? 'text-xs' : 'text-sm'}`}>
                            {comment.content}
                        </p>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => handleLike(comment.id)}
                                className={`${comment.is_like ? 'text-brand-primary' : 'text-slate-400'} hover:text-brand-primary text-xs font-bold flex items-center gap-1 transition-colors`}
                            >
                                <span>👍</span> {comment.like_count}
                            </button>
                            {!isReply && (
                                <>
                                    <button
                                        onClick={() => handleReplyClick(comment.id)}
                                        className="text-slate-400 hover:text-brand-heading text-xs font-bold transition-colors"
                                    >
                                        回覆
                                    </button>
                                    {comment.reply_count > 0 && (
                                        <button
                                            onClick={() => toggleReplies(comment.id)}
                                            className="text-slate-400 hover:text-brand-primary text-xs font-bold flex items-center gap-1 transition-colors"
                                        >
                                            <span className="text-sm">💬</span> {comment.reply_count}
                                        </button>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Reply Input Field */}
                        {replyToId === comment.id && (
                            <div className="mt-4 flex flex-col gap-2">
                                <textarea
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    placeholder="輸入回覆內容..."
                                    readOnly={isThisSubmitting}
                                    className={`w-full p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:ring-1 focus:ring-brand-primary outline-none transition-opacity max-h-[120px] ${isThisSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                                    rows={2}
                                />
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => setReplyToId(null)}
                                        disabled={isThisSubmitting}
                                        className="px-3 py-1 text-xs text-slate-500 font-bold hover:text-brand-heading disabled:opacity-50"
                                    >
                                        取消
                                    </button>
                                    <button
                                        onClick={() => handleSubmitReply(comment.id)}
                                        disabled={!replyContent.trim() || isThisSubmitting}
                                        className="px-4 py-1 text-xs bg-brand-primary text-white rounded-full font-bold hover:bg-brand-primary/90 disabled:opacity-70 flex items-center gap-2 min-w-[60px] justify-center pointer-events-auto"
                                        style={isThisSubmitting ? { pointerEvents: 'none' } : {}}
                                    >
                                        {isThisSubmitting ? <LoadingSpinner /> : '發送'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Nested Replies */}
                {!isReply && isExpanded && comment.replies && comment.replies.length > 0 && (
                    <div className="border-l-2 border-slate-100 mt-2">
                        {visibleReplies.map(reply => renderComment(reply, true))}

                        {hasMoreReplies && (
                            <div className="ml-12 mt-4">
                                <button
                                    onClick={() => loadMoreReplies(comment.id)}
                                    className="text-brand-primary text-xs font-bold hover:text-brand-heading transition-colors"
                                >
                                    更多回覆 +
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
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
                                    readOnly={isSubmitting}
                                    className={`w-full h-24 p-4 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-brand-primary/20 resize-none text-brand-heading placeholder:text-slate-400 transition-opacity max-h-[150px] overflow-y-auto ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                                />
                                <div className="flex justify-end mt-3">
                                    <button
                                        type="submit"
                                        disabled={!newComment.trim() || isSubmitting}
                                        className="bg-brand-primary text-white px-6 py-2 rounded-full font-bold hover:bg-brand-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 min-w-[100px] justify-center"
                                        style={isSubmitting ? { pointerEvents: 'none' } : {}}
                                    >
                                        {isSubmitting ? <LoadingSpinner /> : '發送評論'}
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
            {comments.length === 0 ? (
                <div className="text-center py-20 text-slate-400 font-bold bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-100">
                    目前尚無評論
                </div>
            ) : (
                <div className="space-y-6">
                    {comments.map((comment) => renderComment(comment))}
                </div>
            )}

            {/* Load More Main Comments */}
            <div className="mt-10 text-center">
                <button
                    onClick={handleLoadMore}
                    disabled={isLoadingMore || !hasMoreComments}
                    className={`font-bold transition-all items-center gap-2 inline-flex px-8 py-3 rounded-full border-2 ${!hasMoreComments
                            ? 'border-slate-100 text-slate-300 cursor-not-allowed'
                            : 'border-brand-primary/10 text-brand-primary hover:border-brand-primary hover:bg-brand-primary/5'
                        }`}
                >
                    {isLoadingMore ? (
                        <>
                            <LoadingSpinner size="h-5 w-5" />
                            <span>載入中...</span>
                        </>
                    ) : (
                        hasMoreComments ? '更多評論 +' : '沒有更多評論囉'
                    )}
                </button>
            </div>
        </div>
    );
};
