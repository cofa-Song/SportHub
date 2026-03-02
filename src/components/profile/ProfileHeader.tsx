'use client';

import React from 'react';
import { Camera, Edit2 } from 'lucide-react';
import { User } from '@/types';

interface ProfileHeaderProps {
    user: User;
    onUpdate: (data: Partial<User>) => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, onUpdate }) => {
    const handleBannerClick = () => {
        // In a real app, this would open a file picker or a modal
        // For mock, we'll just toggle between two predefined images or ask for a placeholder
        const newBanner = user.banner_url
            ? ''
            : 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2069&auto=format&fit=crop';

        onUpdate({ banner_url: newBanner });
    };

    return (
        <div className="relative w-full group mb-8">
            {/* Banner Area */}
            <div
                className="relative w-full h-[240px] md:h-[320px] bg-slate-200 overflow-hidden cursor-pointer"
                onClick={handleBannerClick}
            >
                {user.banner_url ? (
                    <img
                        src={user.banner_url}
                        alt="Profile Banner"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                        <div className="text-slate-400 flex flex-col items-center gap-2">
                            <Camera size={48} strokeWidth={1.5} />
                            <span className="font-bold text-sm">點擊上傳個人化背景圖</span>
                        </div>
                    </div>
                )}

                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-white/90 px-4 py-2 rounded-full flex items-center gap-2 text-slate-700 font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                        <Edit2 size={16} />
                        修改背景圖片
                    </div>
                </div>
            </div>
        </div>
    );
};
