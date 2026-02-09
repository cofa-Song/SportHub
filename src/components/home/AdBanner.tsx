"use client";

import React, { useState, useEffect } from 'react';
import { Ad } from '@/types';
import { SportApi } from '@/services/api';

interface AdBannerProps {
    position: 'TOP' | 'SIDE' | 'BOTTOM';
}

/**
 * AdBanner Component.
 * Unified way to display ads in different positions.
 */
export const AdBanner: React.FC<AdBannerProps> = ({ position }) => {
    const [ads, setAds] = useState<Ad[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAds = async () => {
            const res = await SportApi.getAds(position);
            if (res.status === 200) {
                setAds(res.data);
            }
            setIsLoading(false);
        };
        fetchAds();
    }, [position]);

    if (isLoading) {
        return <div className="w-full h-24 bg-slate-50 animate-pulse rounded-2xl"></div>;
    }

    if (ads.length === 0) return null;

    return (
        <div className={`w-full ${position === 'SIDE' ? '' : 'my-12 flex justify-center'}`}>
            {ads.map((ad) => (
                <a
                    key={ad.id}
                    href={ad.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block group relative overflow-hidden rounded-[1.5rem] border border-slate-100/50 shadow-sm transition-all hover:shadow-xl hover:border-brand-primary/20 ${position === 'SIDE' ? 'w-full' : 'w-full max-w-[970px] aspect-[970/250]'
                        }`}
                >
                    <img
                        src={ad.image}
                        alt="Sponsorship"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 px-2 py-0.5 bg-black/30 backdrop-blur-md rounded text-[9px] font-black text-white uppercase tracking-[0.2em]">
                        Sponsored
                    </div>
                </a>
            ))}
        </div>
    );

};
