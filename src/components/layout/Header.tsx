"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { useTranslation } from '@/lib/i18n/LanguageProvider';
import { SportApi } from '@/services/api';

/**
 * Technical Spec Optimized Header.
 * Z-Index: 999 (Spec Requirement)
 * Breakpoint for SideMenu: lg (1024px)
 * Logic: API-driven navigation.
 */
export const Header: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
    const [navItems, setNavItems] = useState<any[]>([]);
    const { locale, setLocale, t } = useTranslation();
    const lastScrollCall = useRef(0);

    // Fetch Nav Data
    useEffect(() => {
        const fetchNav = async () => {
            const res = await SportApi.getNavigation();
            if (res.status === 200) {
                setNavItems(res.data);
            }
        };
        fetchNav();
    }, []);

    // Throttled Scroll Listener
    useEffect(() => {
        const handleScroll = () => {
            const now = Date.now();
            if (now - lastScrollCall.current < 100) return; // 100ms throttle
            lastScrollCall.current = now;
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    type Locale = 'zh-TW' | 'zh-CN' | 'en';

    const toggleMobileDropdown = (key: string) => {
        setMobileExpanded(mobileExpanded === key ? null : key);
    };

    return (
        <>
            <header
                className={`fixed top-10 left-0 right-0 z-[999] transition-all duration-300 ${isScrolled ? 'py-2 glass shadow-lg border-b' : 'py-6 bg-transparent'
                    }`}
            >
                <div className="container mx-auto px-6 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group z-[1001]">
                        <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform shadow-xl shadow-brand-primary/20">
                            <span className="text-white font-black text-xl">S</span>
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-glow text-brand-heading">
                            SPORT<span className="text-brand-primary">HUB</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation (Visible on lg+) */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {navItems.map((item) => (
                            <div
                                key={item.key}
                                className="relative group/nav"
                                onMouseEnter={() => item.hasChildren && setActiveDropdown(item.key)}
                                onMouseLeave={() => setActiveDropdown(null)}
                            >
                                <Link
                                    href={item.href}
                                    className={`text-sm font-bold flex items-center gap-1.5 transition-all ${activeDropdown === item.key ? 'text-brand-primary scale-105' : 'text-brand-body hover:text-brand-primary'
                                        }`}
                                >
                                    {t.nav[item.key as keyof typeof t.nav] || item.key}
                                    {item.hasChildren && (
                                        <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${activeDropdown === item.key ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    )}
                                </Link>

                                {/* Dropdown with Bridge Layer */}
                                {item.hasChildren && (
                                    <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-5 w-56 transition-all duration-300 transform origin-top ${activeDropdown === item.key ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
                                        }`}>
                                        <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 overflow-hidden">
                                            {item.children?.map((sub: any) => (
                                                <Link
                                                    key={sub.key}
                                                    href={`${item.href}${sub.href}`}
                                                    className="block px-6 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-brand-primary transition-colors"
                                                >
                                                    {t.nav[sub.key as keyof typeof t.nav] || sub.key}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* Action Area */}
                    <div className="flex items-center gap-4">
                        {/* Search (Spec Requirement) */}
                        <div className="hidden sm:flex items-center w-40 lg:w-48 h-10 px-4 bg-slate-100/50 rounded-xl border border-slate-200/50 text-slate-400 hover:border-brand-primary/30 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            <span className="ml-2 text-xs font-bold">Search...</span>
                        </div>

                        {/* Language (Desktop lg+) */}
                        <div className="hidden lg:flex items-center bg-slate-100/50 rounded-full p-1">
                            {(['zh-TW', 'zh-CN', 'en'] as Locale[]).map((l) => (
                                <button
                                    key={l}
                                    onClick={() => setLocale(l)}
                                    className={`px-3 py-1 text-[10px] font-black rounded-full transition-all uppercase ${locale === l ? 'bg-white text-brand-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                >
                                    {l.split('-')[1] || l}
                                </button>
                            ))}
                        </div>

                        {/* Auth Buttons (Desktop lg+) */}
                        <div className="hidden lg:flex items-center gap-2 ml-2">
                            <button className="px-5 py-2 text-xs font-black text-slate-500 hover:text-brand-primary transition-colors">
                                {t.common.login}
                            </button>
                            <Button className="rounded-xl px-6 py-2 h-10 text-xs font-black shadow-lg shadow-brand-primary/20">
                                {t.common.register}
                            </Button>
                        </div>

                        {/* Hamburger Button (lg:hidden) */}

                        <button
                            className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 focus:outline-none z-[1001]"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <span className={`w-6 h-0.5 bg-brand-heading transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                            <span className={`w-6 h-0.5 bg-brand-heading transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                            <span className={`w-6 h-0.5 bg-brand-heading transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile SideMenu Overlay */}
            <div
                className={`fixed inset-0 z-[1000] transition-opacity duration-300 lg:hidden ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
            >
                <div className="absolute inset-0 bg-brand-heading/60 backdrop-blur-md" onClick={() => setIsMobileMenuOpen(false)}></div>

                <div
                    className={`absolute top-0 right-0 w-[85%] max-w-sm h-full bg-white shadow-2xl transition-transform duration-500 overflow-y-auto ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                        }`}
                >
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="absolute top-6 left-6 p-2 text-slate-400 hover:text-brand-primary transition-all active:scale-95"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                        </svg>
                    </button>

                    <div className="p-8 pt-24 space-y-8">
                        <nav className="space-y-2">
                            {navItems.map((item) => (
                                <div key={item.key} className="border-b border-slate-50 last:border-0 pb-2">
                                    <div className="flex items-center justify-between">
                                        <Link
                                            href={item.href}
                                            className="text-xl font-black text-brand-heading py-3 block"
                                            onClick={() => !item.hasChildren && setIsMobileMenuOpen(false)}
                                        >
                                            {t.nav[item.key as keyof typeof t.nav] || item.key}
                                        </Link>
                                        {item.hasChildren && (
                                            <button
                                                onClick={() => toggleMobileDropdown(item.key)}
                                                className="p-3 text-slate-300"
                                            >
                                                <svg className={`w-6 h-6 transition-transform ${mobileExpanded === item.key ? 'rotate-180 text-brand-primary' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>

                                    {item.hasChildren && mobileExpanded === item.key && (
                                        <div className="mt-2 ml-4 space-y-4 pl-4 border-l-2 border-brand-primary/10">
                                            {item.children?.map((sub: any) => (
                                                <Link
                                                    key={sub.key}
                                                    href={`${item.href}${sub.href}`}
                                                    className="block text-sm font-bold text-slate-400 hover:text-brand-primary"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    {t.nav[sub.key as keyof typeof t.nav] || sub.key}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </nav>

                        <div className="pt-8 border-t border-slate-100 flex flex-col gap-6">
                            <div className="flex gap-2">
                                {(['zh-TW', 'zh-CN', 'en'] as Locale[]).map((l) => (
                                    <button
                                        key={l}
                                        onClick={() => setLocale(l)}
                                        className={`flex-1 py-3 text-xs font-black rounded-xl transition-all ${locale === l
                                            ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                                            : 'bg-slate-50 text-slate-400'
                                            }`}
                                    >
                                        {l === 'en' ? 'EN' : l === 'zh-TW' ? '繁中' : '簡中'}
                                    </button>
                                ))}
                            </div>
                            <Button className="w-full h-14 rounded-2xl font-black text-lg">
                                {locale === 'en' ? 'JOIN NOW' : '立即加入'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
