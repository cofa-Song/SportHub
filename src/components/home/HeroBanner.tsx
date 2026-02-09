"use client";

import React, { useState, useEffect } from 'react';
import { Banner } from '@/types';
import { SportApi } from '@/services/api';

/**
 * HeroBanner Carousel.
 * DisplaysAds, Featured Articles, and News with external link support.
 */
export const HeroBanner: React.FC = () => {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBanners = async () => {
            const res = await SportApi.getBanners();
            if (res.status === 200) {
                setBanners(res.data);
            }
            setIsLoading(false);
        };
        fetchBanners();
    }, []);

    useEffect(() => {
        if (banners.length === 0) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [banners]);

    if (isLoading) {
        return <div className="w-full h-[400px] md:h-[500px] bg-slate-100 animate-pulse rounded-3xl"></div>;
    }

    if (banners.length === 0) return null;

    return (
        <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-[2.5rem] bg-slate-900 group">
            {banners.map((banner, index) => (
                <a
                    key={banner.id}
                    href={banner.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out transform ${index === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
                        }`}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                    <img
                        src={banner.image}
                        alt={banner.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 p-8 md:p-16 z-20 w-full md:w-2/3">
                        <div className="mb-4">
                            <span className="px-4 py-1.5 bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                                {banner.type}
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tighter">
                            {banner.title}
                        </h2>
                    </div>
                </a>
            ))}

            {/* Pagination Dots */}
            <div className="absolute bottom-8 right-8 md:right-16 z-30 flex gap-3">
                {banners.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-brand-primary w-8' : 'bg-white/30 hover:bg-white/60'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={() => setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1))}
                className="absolute left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-brand-primary"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button
                onClick={() => setCurrentIndex((prev) => (prev + 1) % banners.length)}
                className="absolute right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-brand-primary"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
            </button>
        </div>
    );
};
