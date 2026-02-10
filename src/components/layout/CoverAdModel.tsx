"use client";

import React, { useState } from 'react';
import { AdDTO } from '@/types';

interface CoverAdModelProps {
    ad?: AdDTO;
}

/**
 * CoverAdModel Component.
 * Fixed banner ad (Bottom/Side) that can be closed by the user.
 */
export const CoverAdModel: React.FC<CoverAdModelProps> = ({ ad }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);

    if (!ad || !isVisible) return null;

    return (
        <div
            className="fixed bottom-0 left-0 right-0 z-50 transition-all duration-500"
            style={{
                height: isExpanded ? '20vh' : '8vh',
                maxHeight: isExpanded ? '200px' : '100px'
            }}
        >
            {/* Main Ad Container */}
            <div className="relative w-full h-full max-w-screen-2xl mx-auto">
                {/* Ad Content */}
                <a
                    href={ad.target_url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full h-full"
                    onMouseEnter={() => setIsExpanded(true)}
                    onMouseLeave={() => setIsExpanded(false)}
                >
                    <img
                        src={ad.image_url}
                        alt={ad.label_text || 'Advertisement'}
                        className="w-full h-full object-cover"
                    />
                </a>

                {/* Close Button */}
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute left-4 bottom-4 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors z-10"
                    aria-label="Close advertisement"
                >
                    <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                {/* Hover Indicator */}
                {!isExpanded && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none">
                        <div className="animate-bounce">
                            <img
                                src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                                alt=""
                                className="w-12 h-12 opacity-70"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
