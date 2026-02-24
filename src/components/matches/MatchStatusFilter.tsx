'use client';

import React from 'react';
import { Search } from 'lucide-react';

interface MatchStatusFilterProps {
    activeStatus: string;
    onStatusChange: (status: string) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

const STATUS_OPTIONS = [
    { id: 'all', label: '全部' },
    { id: 'live', label: '進行中' },
    { id: 'upcoming', label: '未開賽' },
    { id: 'finished', label: '已結束' },
];

export const MatchStatusFilter: React.FC<MatchStatusFilterProps> = ({
    activeStatus,
    onStatusChange,
    searchQuery,
    onSearchChange
}) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            {/* Status Pills */}
            <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl w-fit">
                {STATUS_OPTIONS.map((opt) => {
                    const isActive = activeStatus === opt.id;
                    return (
                        <button
                            key={opt.id}
                            onClick={() => onStatusChange(opt.id)}
                            className={`
                                px-6 py-2 rounded-xl text-sm font-bold transition-all
                                ${isActive
                                    ? 'bg-white text-slate-900 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                                }
                            `}
                        >
                            {opt.label}
                        </button>
                    );
                })}
            </div>

            {/* Search Input */}
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-primary transition-colors" />
                <input
                    type="text"
                    placeholder="搜尋聯賽或隊伍..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full md:w-64 pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all shadow-sm"
                />
            </div>
        </div>
    );
};
