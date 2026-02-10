import React from 'react';
import { AdDTO } from '@/types';

interface AdBannerProps {
    ads?: AdDTO[];
    position: 'TOP' | 'SIDE' | 'BOTTOM';
}

/**
 * AdBanner Component.
 * Unified way to display ads in different positions.
 */
export const AdBanner: React.FC<AdBannerProps> = ({ ads, position }) => {
    // Parent component is responsible for passing the correct filtered ads
    // Since AdDTO no longer has 'position', we rely on the passed 'ads' array
    const relevantAds = ads || [];

    if (relevantAds.length === 0) return null;

    return (
        <div className={`w-full ${position === 'SIDE' ? '' : 'my-12 flex justify-center'}`}>
            {relevantAds.map((ad) => (
                <a
                    key={ad.ad_id}
                    href={ad.target_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block group relative overflow-hidden rounded-[1.5rem] border border-slate-100/50 shadow-sm transition-all hover:shadow-xl hover:border-brand-primary/20 ${position === 'SIDE' ? 'w-full' : 'w-full max-w-[970px] aspect-[970/250]'
                        }`}
                >
                    <img
                        src={ad.image_url}
                        alt="Sponsorship"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 px-2 py-0.5 bg-black/30 backdrop-blur-md rounded text-[9px] font-black text-white uppercase tracking-[0.2em]">
                        {ad.label_text || 'Sponsored'}
                    </div>
                </a>
            ))}
        </div>
    );

};
