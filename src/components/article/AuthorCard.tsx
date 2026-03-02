"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Camera, Edit2, FileText, Users, Bookmark, MessageSquare } from 'lucide-react';
import { ArticleDTO, Author, User } from '@/types';
import { useAuth } from '@/components/shared/MockAuthProvider';

interface AuthorCardProps {
    author: Author;
    latestArticles?: ArticleDTO[];
    isMobile?: boolean; // New prop to explicitly handle mobile placement if needed
    isOwner?: boolean;
    onUpdate?: (data: Partial<User>) => void;
}

export const AuthorCard: React.FC<AuthorCardProps> = ({
    author,
    latestArticles,
    isMobile = false,
    isOwner = false,
    onUpdate
}) => {
    const { isLoggedIn } = useAuth();
    const [isFollowed, setIsFollowed] = useState(false);

    // Edit state
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: author.name,
        bio: author.bio || ''
    });

    const handleFollowClick = () => {
        if (!isLoggedIn) {
            alert('請登入會員');
            return;
        }
        setIsFollowed(!isFollowed);
    };

    // Calculate total collections from articles (simulated)
    const totalCollections = latestArticles?.reduce((sum, article) => sum + (article.collect_count || 0), 0) || 0;

    // Mock stats for beauty with larger data
    const stats = {
        articles: latestArticles?.length || 0,
        followers: '1.2k',
        collections: (totalCollections + 520).toLocaleString() // Base + sum
    };

    // Use a more reliable fallback avatar URL
    const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${author.name || 'default'}`;

    const handleSave = () => {
        if (onUpdate) {
            onUpdate({
                name: editForm.name,
                bio: editForm.bio
            });
        }
        setIsEditing(false);
    };

    const handleAvatarEdit = () => {
        if (!isOwner) return;
        // Mock avatar update
        if (onUpdate) {
            onUpdate({
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + Math.random()
            });
        }
    };

    return (
        <div className={`bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden ${isMobile ? 'mb-12' : 'sticky top-24'}`}>
            {/* 1. Header & Avatar Area */}
            <div className={`h-24 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 relative ${isMobile ? 'hidden md:block' : ''}`}>
                <div className="absolute -bottom-10 left-6">
                    <div className="p-1 bg-white rounded-2xl shadow-lg relative group/edit-avatar">
                        <div
                            className={`w-20 h-20 rounded-xl overflow-hidden bg-slate-200 ${isOwner ? 'cursor-pointer' : ''}`}
                            onClick={handleAvatarEdit}
                        >
                            <img
                                src={author.avatar || defaultAvatar}
                                alt={author.name}
                                className="w-full h-full object-cover"
                            />
                            {isOwner && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/edit-avatar:opacity-100 transition-opacity">
                                    <Camera size={24} className="text-white" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Author Info Section */}
            <div className={`${isMobile ? 'pt-6' : 'pt-14'} px-6 pb-6`}>
                <div className="flex items-center gap-4 mb-4">
                    {isMobile && (
                        <div
                            className={`md:hidden w-16 h-16 rounded-xl overflow-hidden bg-slate-200 shadow-md relative group/edit-avatar-mobile ${isOwner ? 'cursor-pointer' : ''}`}
                            onClick={handleAvatarEdit}
                        >
                            <img
                                src={author.avatar || defaultAvatar}
                                alt={author.name}
                                className="w-full h-full object-cover"
                            />
                            {isOwner && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/edit-avatar-mobile:opacity-100 transition-opacity">
                                    <Camera size={16} className="text-white" />
                                </div>
                            )}
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        {isEditing ? (
                            <input
                                type="text"
                                value={editForm.name}
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                className="w-full text-2xl font-black text-brand-heading mb-1 border-b-2 border-brand-primary focus:outline-none p-0 bg-transparent"
                            />
                        ) : (
                            isOwner ? (
                                <h2 className="text-2xl font-black text-slate-800 leading-tight mb-1 truncate">
                                    {author.name}
                                </h2>
                            ) : (
                                <Link href={`/authors/${author.id}`} className="hover:text-brand-primary transition-colors">
                                    <h2 className="text-2xl font-black text-slate-800 leading-tight hover:text-brand-primary mb-1 truncate">
                                        {author.name}
                                    </h2>
                                </Link>
                            )
                        )}
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-brand-primary/10 text-brand-primary">
                            {author.level_tag || '駐站作家'}
                        </span>
                    </div>
                </div>

                {!isOwner ? (
                    <div className={`flex ${isMobile ? 'items-center gap-6' : 'flex-col gap-4'}`}>
                        <button
                            onClick={handleFollowClick}
                            className={`px-8 py-2.5 rounded-xl text-base font-black transition-all duration-300 transform active:scale-95 shadow-sm ${isFollowed
                                ? 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                : 'bg-brand-primary text-white hover:shadow-lg hover:shadow-brand-primary/30 hover:-translate-y-0.5'
                                } ${isMobile ? 'w-full md:w-auto' : 'w-full'}`}
                        >
                            {isFollowed ? '追蹤中' : '+ 追蹤'}
                        </button>
                    </div>
                ) : (
                    <div className={`flex ${isMobile ? 'items-center gap-2' : 'flex-col gap-2'}`}>
                        {isEditing ? (
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 rounded-xl text-sm font-black bg-brand-primary text-white hover:shadow-lg transition-all"
                                >
                                    儲存
                                </button>
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        setEditForm({ name: author.name, bio: author.bio || '' });
                                    }}
                                    className="px-4 py-2 rounded-xl text-sm font-black bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all"
                                >
                                    取消
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black text-brand-primary bg-brand-primary/10 hover:bg-brand-primary/20 transition-all whitespace-nowrap"
                            >
                                <Edit2 size={16} />
                                編輯資料
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Info & Stats Row - Layout change for mobile horizontal */}
            <div className={`flex flex-col px-6 mb-8`}>
                <div className={`text-base text-slate-500 leading-relaxed font-medium mb-6`}>
                    {isEditing ? (
                        <textarea
                            value={editForm.bio}
                            onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                            className="w-full min-h-[100px] border-2 border-brand-primary/20 rounded-xl p-3 focus:outline-none focus:border-brand-primary transition-all bg-slate-50/50"
                            placeholder="分享一下你的故事吧..."
                        />
                    ) : (
                        author.bio || '專注於深入賽事分析與球員動態，帶給讀者最專業的體育觀點。'
                    )}
                </div>

                {/* Stats Box - Enlarged Text */}
                <div className="grid grid-cols-3 gap-4 py-6 px-4 bg-slate-50/50 rounded-2xl">
                    <div className="text-center">
                        <div className="text-2xl font-black text-brand-heading mb-1">{stats.articles}</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">文章</div>
                    </div>
                    <div className="text-center border-x border-slate-200/50">
                        <div className="text-2xl font-black text-brand-heading mb-1">{stats.followers}</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">粉絲</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-black text-brand-heading mb-1">{stats.collections}</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">收藏</div>
                    </div>
                </div>
            </div>

            {/* Latest Articles List */}
            {latestArticles && latestArticles.length > 0 && (
                <div className="px-6 pb-8 border-t border-slate-50 pt-8">
                    <div className="flex justify-between items-center mb-5">
                        <h5 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">最近分析文章</h5>
                        <div className="flex-1 ml-4 h-px bg-slate-100"></div>
                    </div>
                    <ul className="space-y-4">
                        {latestArticles.slice(0, 3).map((article) => (
                            <li key={article.id} className="group">
                                <Link
                                    href={article.target_url || `/post/${article.id}`}
                                    className="flex gap-3 items-start"
                                >
                                    <FileText size={16} className="text-slate-300 mt-0.5 group-hover:text-brand-primary transition-colors shrink-0" />
                                    <span className="text-sm text-slate-600 font-bold leading-snug group-hover:text-brand-primary transition-colors line-clamp-2">
                                        {article.title}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {!isOwner && (
                <div className="px-6 pb-6 pt-6 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-black text-slate-300 uppercase tracking-widest">社群連結</span>
                    <div className="flex gap-3">
                        <button className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-brand-primary/10 hover:text-brand-primary transition-all">
                            <span className="text-[10px] font-black">FB</span>
                        </button>
                        <button className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-brand-primary/10 hover:text-brand-primary transition-all">
                            <span className="text-[10px] font-black">IG</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
