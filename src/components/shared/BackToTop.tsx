"use client";

import React, { useState, useEffect, useRef } from 'react';

/**
 * Back-to-Top Button component.
 * Z-Index: 998 (Spec Requirement)
 * Displays after scrollY > 400px with Throttle (Spec Requirement).
 */
export const BackToTop: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const lastScrollCall = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const now = Date.now();
            // Throttling to 100ms for performance enhancement
            if (now - lastScrollCall.current < 100) return;
            lastScrollCall.current = now;

            if (window.scrollY > 400) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <button
            onClick={scrollToTop}
            className={`fixed bottom-5 right-5 md:bottom-10 md:right-10 z-[998] p-4 rounded-2xl bg-brand-primary text-white shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 group ${isVisible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-10 pointer-events-none'
                }`}
            aria-label="Back to top"
        >
            <svg
                className="w-6 h-6 transition-transform group-hover:-translate-y-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
            </svg>
        </button>
    );
};
