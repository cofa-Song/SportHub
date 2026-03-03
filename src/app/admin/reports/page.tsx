"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/shared/MockAuthProvider';
import { SportApi } from '@/services/api';
import { AnalyticsReportDTO } from '@/types';
import { AnalyticsChart } from '@/components/profile/AnalyticsChart';
import {
    ChevronLeft,
    TrendingUp,
    TrendingDown,
    FileText,
    Eye,
    Users,
    Calendar,
    Download,
    LayoutDashboard
} from 'lucide-react';
import Link from 'next/link';

type RangeType = 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';

export default function AnalyticsReportPage() {
    const { isLoggedIn, setIsAuthModalOpen } = useAuth();

    // State
    const [report, setReport] = useState<AnalyticsReportDTO | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [range, setRange] = useState<RangeType>('DAY');

    const ranges = [
        { label: '日', value: 'DAY', desc: '過去 30 天' },
        { label: '週', value: 'WEEK', desc: '過去 3 個月' },
        { label: '月', value: 'MONTH', desc: '過去 1 年' },
        { label: '年', value: 'YEAR', desc: '全部歷史' },
    ];

    const fetchReport = async () => {
        setIsLoading(true);
        try {
            const res = await SportApi.getAnalyticsReport({ range });
            if (res.status === 200) {
                setReport(res.data);
            }
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            fetchReport();
        }
    }, [isLoggedIn, range]);

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center p-12 bg-white rounded-3xl shadow-xl border border-slate-100 max-w-sm w-full mx-4">
                    <div className="w-20 h-20 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-brand-primary">
                        <LayoutDashboard size={40} />
                    </div>
                    <h2 className="text-2xl font-black text-brand-heading mb-4">需登入會員</h2>
                    <p className="text-slate-500 mb-8">請先登入以查看您的數據報表。</p>
                    <button
                        onClick={() => setIsAuthModalOpen(true)}
                        className="w-full py-4 bg-brand-primary text-white rounded-2xl font-black hover:bg-brand-secondary transition-all"
                    >
                        前往登入
                    </button>
                </div>
            </div>
        );
    }

    const StatCard = ({ title, value, trend, icon: Icon, color }: any) => (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
            <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-slate-50 rounded-full group-hover:scale-150 transition-transform duration-700 opacity-50`} />
            <div className="relative z-10 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-2xl ${color.bg} ${color.text}`}>
                        <Icon size={24} />
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-black ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {trend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {Math.abs(trend)}%
                    </div>
                </div>
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
                    <h3 className="text-3xl font-black text-brand-heading">
                        {value?.toLocaleString()}
                    </h3>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 pt-28 pb-24">
            <div className="container mx-auto px-4 md:px-12">
                <div className="max-w-6xl mx-auto space-y-10">

                    {/* Page Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-4">
                            <Link href="/profile" className="inline-flex items-center gap-2 text-sm font-black text-slate-400 hover:text-brand-primary transition-colors">
                                <ChevronLeft size={16} />
                                返回個人管理
                            </Link>
                            <h1 className="text-5xl font-black text-brand-heading tracking-tight">
                                數據<span className="text-brand-primary">報表中心</span>
                            </h1>
                        </div>
                        <button className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-600 border border-slate-100 rounded-2xl font-black shadow-sm hover:border-brand-primary hover:text-brand-primary transition-all">
                            <Download size={20} />
                            匯出 CSV
                        </button>
                    </div>

                    {/* Summary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard
                            title="總發文數量"
                            value={report?.summary.total_posts}
                            trend={report?.summary.posts_trend}
                            icon={FileText}
                            color={{ bg: 'bg-blue-50', text: 'text-blue-500' }}
                        />
                        <StatCard
                            title="總瀏覽次數"
                            value={report?.summary.total_views}
                            trend={report?.summary.views_trend}
                            icon={Eye}
                            color={{ bg: 'bg-purple-50', text: 'text-purple-500' }}
                        />
                        <StatCard
                            title="訂閱總數"
                            value={report?.summary.total_followers_growth}
                            trend={report?.summary.followers_trend}
                            icon={Users}
                            color={{ bg: 'bg-orange-50', text: 'text-orange-500' }}
                        />
                    </div>

                    {/* Main Chart Card */}
                    <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                        <div className="p-8 md:p-10 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-black text-brand-heading flex items-center gap-2">
                                    綜合指標分析
                                    <span className="text-xs px-2 py-1 bg-slate-100 text-slate-400 rounded-lg">PRO</span>
                                </h2>
                                <p className="text-sm font-bold text-slate-400">同時觀測發文、流量與訂閱總數的交互關係</p>
                            </div>

                            {/* Range Quick Select */}
                            <div className="flex bg-slate-50 p-1.5 rounded-2xl">
                                {ranges.map((r) => (
                                    <button
                                        key={r.value}
                                        onClick={() => setRange(r.value as RangeType)}
                                        className={`px-5 py-2.5 text-xs font-black rounded-[14px] transition-all ${range === r.value
                                            ? 'bg-white text-brand-primary shadow-sm ring-1 ring-slate-100'
                                            : 'text-slate-400 hover:text-slate-600'
                                            }`}
                                        title={r.desc}
                                    >
                                        {r.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-8 md:p-10">
                            <div className="relative min-h-[400px]">
                                {isLoading && (
                                    <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[1px] flex items-center justify-center">
                                        <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
                                {report && (
                                    <AnalyticsChart data={report.chart_data} />
                                )}
                            </div>
                        </div>

                        {/* Chart Footer Info */}
                        <div className="bg-slate-50/50 p-8 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-slate-50">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-brand-primary shadow-sm">
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">當前週期</p>
                                    <p className="text-sm font-black text-slate-700">{ranges.find(r => r.value === range)?.desc}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8">
                                <div className="text-right border-r border-slate-200 pr-8">
                                    <p className="text-[10px] font-black text-purple-500 uppercase tracking-widest">最高流量</p>
                                    <p className="text-sm font-black text-brand-heading">
                                        {report ? Math.max(...report.chart_data.map(d => d.views)).toLocaleString() : 0}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">平均訂閱</p>
                                    <p className="text-sm font-black text-brand-heading">
                                        {report ? Math.floor(report.chart_data.reduce((sum, d) => sum + d.followers, 0) / report.chart_data.length).toLocaleString() : 0}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
