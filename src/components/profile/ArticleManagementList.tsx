"use client";

import React from 'react';
import { ArticleDTO } from '@/types';
import {
    Edit3,
    Trash2,
    ExternalLink,
    Eye,
    MessageSquare,
    BarChart2,
    Bookmark,
    Power,
    Shield
} from 'lucide-react';
import Link from 'next/link';

interface ArticleManagementListProps {
    articles: ArticleDTO[];
    onDelete: (id: string) => void;
    onEdit: (article: ArticleDTO) => void;
    onToggleStatus: (id: string, currentStatus: string) => void;
}

export const ArticleManagementList: React.FC<ArticleManagementListProps> = ({
    articles,
    onDelete,
    onEdit,
    onToggleStatus
}) => {
    if (articles.length === 0) {
        return (
            <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <BarChart2 size={32} />
                </div>
                <p className="text-slate-400 font-bold">目前沒有符合條件的文章</p>
                <Link
                    href="/post/create"
                    className="mt-4 inline-block text-brand-primary font-black hover:underline"
                >
                    立即撰寫第一篇分析
                </Link>
            </div>
        );
    }

    const getStatusInfo = (status?: string) => {
        switch (status) {
            case 'PUBLISHED':
                return { label: '已發佈', color: 'bg-green-100 text-green-600', icon: <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> };
            case 'ARCHIVED':
                return { label: '已下架', color: 'bg-slate-100 text-slate-400', icon: <div className="w-1.5 h-1.5 rounded-full bg-slate-400" /> };
            case 'DRAFT':
                return { label: '草稿', color: 'bg-orange-100 text-orange-500', icon: <div className="w-1.5 h-1.5 rounded-full bg-orange-500" /> };
            default:
                return { label: '未知', color: 'bg-slate-100 text-slate-400', icon: null };
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">文章內容</th>
                            <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">狀態</th>
                            <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">分類/聯盟</th>
                            <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">數據統計</th>
                            <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">最後修改</th>
                            <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {articles.map((article) => {
                            const statusInfo = getStatusInfo(article.status);
                            return (
                                <tr key={article.id} className="group hover:bg-slate-50/30 transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                                                <img
                                                    src={article.cover_url || 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&q=80&w=200'}
                                                    alt=""
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-black text-slate-700 truncate group-hover:text-brand-primary transition-colors mb-1">
                                                    {article.title}
                                                </h3>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-1 ${statusInfo.color}`}>
                                                        {statusInfo.icon}
                                                        {statusInfo.label}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        {article.status !== 'DRAFT' && (
                                            <div className="flex justify-center">
                                                <button
                                                    onClick={() => onToggleStatus(article.id, article.status || 'PUBLISHED')}
                                                    className={`
                                                        relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none
                                                        ${article.status === 'PUBLISHED' ? 'bg-brand-primary' : 'bg-slate-200'}
                                                    `}
                                                >
                                                    <span
                                                        className={`
                                                            inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                                                            ${article.status === 'PUBLISHED' ? 'translate-x-6' : 'translate-x-1'}
                                                        `}
                                                    />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="text-xs font-black text-slate-600">{article.category}</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">{article.league || '全部'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center justify-center gap-6">
                                            <div className="flex flex-col items-center">
                                                <div className="flex items-center gap-1 text-slate-600 text-sm font-black">
                                                    <Eye size={14} className="text-slate-300" />
                                                    {article.view_count.toLocaleString()}
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">VIEWS</span>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <div className="flex items-center gap-1 text-slate-600 text-sm font-black">
                                                    <MessageSquare size={14} className="text-slate-300" />
                                                    {article.comment_count}
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">REPLIES</span>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <div className="flex items-center gap-1 text-slate-600 text-sm font-black">
                                                    <Bookmark size={14} className="text-slate-300" />
                                                    {article.collect_count}
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">SAVED</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <span className="text-xs font-bold text-slate-500">
                                            {new Date(article.updated_at || article.created_at).toLocaleString('zh-TW', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2 text-slate-400">
                                            <Link
                                                href={`/post/${article.id}`}
                                                className="p-2 hover:bg-slate-100 hover:text-brand-primary rounded-xl transition-all"
                                                title="預覽"
                                            >
                                                <ExternalLink size={18} />
                                            </Link>
                                            <button
                                                onClick={() => onEdit(article)}
                                                className="p-2 hover:bg-slate-100 hover:text-blue-500 rounded-xl transition-all"
                                                title="編輯"
                                            >
                                                <Edit3 size={18} />
                                            </button>
                                            <button
                                                onClick={() => onDelete(article.id)}
                                                className="p-2 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all"
                                                title="刪除"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
