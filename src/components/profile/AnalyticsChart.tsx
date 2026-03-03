"use client";

import React, { useMemo } from 'react';
import {
    ComposedChart,
    Bar,
    Line,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { AnalyticsItemDTO } from '@/types';

interface AnalyticsChartProps {
    data: AnalyticsItemDTO[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/95 backdrop-blur-md p-5 rounded-[24px] shadow-2xl border border-slate-100 min-w-[180px] space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">{label}</p>
                <div className="space-y-2">
                    {payload.map((item: any, index: number) => {
                        const name = item.name === 'views' ? '瀏覽量'
                            : item.name === 'followers' ? '訂閱總數'
                                : '發文數';
                        const unit = item.name === 'views' ? '次' : '人';
                        const color = item.color;

                        return (
                            <div key={index} className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                                    <span className="text-xs font-bold text-slate-500">{name}</span>
                                </div>
                                <span className="text-sm font-black text-brand-heading">
                                    {item.value?.toLocaleString()}
                                    {item.name !== 'posts' && <span className="text-[10px] ml-0.5 opacity-50">{unit}</span>}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
    return null;
};

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ data }) => {
    const [mounted, setMounted] = React.useState(false);
    const chartData = useMemo(() => data, [data]);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="w-full h-[400px] bg-slate-50/50 animate-pulse rounded-[32px]" />;

    return (
        <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <ComposedChart
                    data={chartData}
                    margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                >
                    <defs>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f1f5f9"
                    />
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fontWeight: 'bold', fill: '#94a3b8' }}
                        dy={10}
                        minTickGap={30}
                    />
                    {/* Primary Y-Axis for Views & Subscribers (Left) */}
                    <YAxis
                        yAxisId="left"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fontWeight: 'bold', fill: '#94a3b8' }}
                        tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
                        width={40}
                    />
                    {/* Secondary Y-Axis for Posts (Right) - Independent scale to magnify bars */}
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fontWeight: 'bold', fill: '#cbd5e1' }}
                        width={40}
                        domain={[0, 'auto']}
                    />

                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />

                    <Legend
                        verticalAlign="top"
                        align="right"
                        height={40}
                        iconType="circle"
                        formatter={(value) => {
                            const labels: any = { views: '瀏覽量', followers: '訂閱總數', posts: '發文數' };
                            return <span className="text-xs font-bold text-slate-400 mr-4">{labels[value]}</span>;
                        }}
                    />

                    {/* 1. Posts: Bar (Right Axis - Bottom Layer) */}
                    <Bar
                        yAxisId="right"
                        zIndex={1}
                        dataKey="posts"
                        name="posts"
                        barSize={24}
                        fill="#e2e8f0"
                        radius={[4, 4, 0, 0]}
                        animationDuration={1000}
                    />

                    {/* 2. Views: Area fill (Left Axis - Middle Layer) */}
                    <Area
                        yAxisId="left"
                        zIndex={2}
                        type="monotone"
                        dataKey="views"
                        name="views"
                        stroke="#8b5cf6"
                        strokeWidth={4}
                        fillOpacity={1}
                        fill="url(#colorViews)"
                        animationDuration={1500}
                    />

                    {/* 3. Total Subscribers: Line with Dots (Left Axis - Top Layer) */}
                    <Line
                        yAxisId="left"
                        zIndex={3}
                        type="monotone"
                        dataKey="followers"
                        name="followers"
                        stroke="#f59e0b"
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#f59e0b', strokeWidth: 0 }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                        animationDuration={2000}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
};
