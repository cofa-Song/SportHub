"use client";

import React, { useState, useEffect } from 'react';
import { SpecialFeature } from '@/types';
import { SportApi } from '@/services/api';
import { useTranslation } from '@/lib/i18n/LanguageProvider';


/**
 * FeaturedSpecials Component.
 * Zigzag layout (Top-Left and Bottom-Right) for high-impact content.
 */
export const FeaturedSpecials: React.FC = () => {
    const [specials, setSpecials] = useState<SpecialFeature[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { t } = useTranslation();


    useEffect(() => {
        const fetchSpecials = async () => {
            const res = await SportApi.getSpecials();
            if (res.status === 200) {
                setSpecials(res.data);
            }
            setIsLoading(false);
        };
        fetchSpecials();
    }, []);

    if (isLoading) {
        return <div className="space-y-20 mb-20">
            <div className="h-96 bg-slate-50 animate-pulse rounded-[3rem]"></div>
            <div className="h-96 bg-slate-50 animate-pulse rounded-[3rem]"></div>
        </div>;
    }

    return (
        <section className="mb-32">
            <div className="mb-12 border-b-2 border-slate-50 pb-6">
                <h3 className="text-3xl font-black text-brand-heading uppercase tracking-tighter italic">
                    {t.sections.specials.title}
                </h3>
            </div>

            <div className="space-y-24">
                {specials.map((special, index) => (
                    <div
                        key={special.id}
                        className={`flex flex-col lg:items-center gap-12 ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                            }`}
                    >
                        {/* Visual Side */}
                        <div className="flex-1 relative group">
                            <div className="absolute -inset-4 bg-brand-primary/5 rounded-[4rem] group-hover:bg-brand-primary/10 transition-colors"></div>
                            <div className="relative h-[450px] rounded-[3.5rem] overflow-hidden shadow-2xl">
                                <img
                                    src={special.image}
                                    alt={special.title}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-brand-heading/60 to-transparent"></div>
                            </div>
                        </div>

                        {/* Text Side */}
                        <div className="flex-1 space-y-8 px-4 lg:px-12">
                            <div>
                                <span className="text-brand-primary font-black text-xs uppercase tracking-[0.4em] mb-4 block">Special Collection</span>
                                <h3 className="text-4xl md:text-5xl font-black text-brand-heading tracking-tighter leading-tight">
                                    {special.title}
                                </h3>
                            </div>
                            <p className="text-lg text-slate-500 font-medium leading-relaxed">
                                {special.description}
                            </p>
                            <a
                                href={special.link}
                                className="inline-flex items-center gap-4 text-brand-heading font-black border-b-4 border-brand-primary pb-2 hover:gap-6 transition-all"
                            >
                                Explore Special <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
