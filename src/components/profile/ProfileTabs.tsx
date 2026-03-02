'use client';

import React, { useState } from 'react';
import { LayoutDashboard, FileText, MessageSquare } from 'lucide-react';

interface ProfileTabsProps {
    onTabChange: (tab: string) => void;
    activeTab: string;
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({ onTabChange, activeTab }) => {
    const tabs = [
        { id: 'management', label: '經營簡報', icon: <LayoutDashboard size={20} /> },
        { id: 'articles', label: '所有文章', icon: <FileText size={20} /> },
        { id: 'comments', label: '最新讀者留言', icon: <MessageSquare size={20} /> },
    ];

    return (
        <div className="flex items-center gap-1 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm mb-8 w-fit">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`
                        flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all duration-300
                        ${activeTab === tab.id
                            ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20 scale-[1.02]'
                            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}
                    `}
                >
                    {tab.icon}
                    {tab.label}
                </button>
            ))}
        </div>
    );
};
