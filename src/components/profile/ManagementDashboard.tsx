'use client';

import React from 'react';
import { CreatorStatsDTO, ArticleDTO } from '@/types';
import { TrendingUp, FileText, Eye, Heart, Calendar, Users, Bookmark, MessageSquare } from 'lucide-react';

interface ManagementDashboardProps {
    stats: CreatorStatsDTO;
    topArticles: ArticleDTO[];
}

export const ManagementDashboard: React.FC<ManagementDashboardProps> = ({ stats, topArticles }) => {
    const statItems = [
        { label: '發表文章總數', value: stats.total_articles, icon: <FileText className="text-blue-500" />, unit: '篇' },
        { label: '文章被瀏覽量', value: stats.total_views.toLocaleString(), icon: <Eye className="text-purple-500" />, unit: '次' },
        { label: '文章被收藏數', value: stats.total_collections.toLocaleString(), icon: <Heart className="text-red-500" />, unit: '次' },
        { label: '帳號創立天數', value: stats.account_days, icon: <Calendar className="text-emerald-500" />, unit: '天' },
        { label: '追蹤人數', value: stats.followers_count.toLocaleString(), icon: <Users className="text-orange-500" />, unit: '人' },
        { label: '收藏文章', value: stats.followed_articles, icon: <Bookmark className="text-cyan-500" />, unit: '篇' },
        { label: '文章留言', value: stats.total_comments.toLocaleString(), icon: <MessageSquare className="text-indigo-500" />, unit: '則' },
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* 1. Blog Statistics */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-1.5 h-8 bg-brand-primary rounded-full"></div>
                    <h2 className="text-2xl font-black text-brand-heading italic uppercase">部落格統計</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {statItems.map((item, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-slate-50 rounded-lg">
                                    {item.icon}
                                </div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.label}</span>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-black text-slate-800">{item.value}</span>
                                <span className="text-xs font-bold text-slate-400">{item.unit}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 2. Top 10 Articles */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-1.5 h-8 bg-brand-secondary rounded-full"></div>
                    <h2 className="text-2xl font-black text-brand-heading italic uppercase">Top 10 熱門文章</h2>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">排名</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">文章標題</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right">瀏覽量</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right">收藏</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {topArticles.map((article, idx) => (
                                <tr key={article.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <span className={`
                                            inline-flex items-center justify-center w-8 h-8 rounded-full font-black text-sm
                                            ${idx === 0 ? 'bg-yellow-100 text-yellow-600' :
                                                idx === 1 ? 'bg-slate-100 text-slate-600' :
                                                    idx === 2 ? 'bg-orange-100 text-orange-600' : 'text-slate-400'}
                                        `}>
                                            {idx + 1}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <a href={article.target_url} className="font-bold text-slate-700 hover:text-brand-primary transition-colors line-clamp-1">
                                                {article.title}
                                            </a>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase">{article.category}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="font-black text-slate-600">{article.view_count.toLocaleString()}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="font-bold text-slate-400">{article.collect_count}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};
