"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { useTranslation } from '@/lib/i18n/LanguageProvider';
import { SportApi } from '@/services/api';
import { useAuth } from '../shared/MockAuthProvider';
import { AuthModal } from '../shared/AuthModal';

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
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const { locale, setLocale, t } = useTranslation();
    const { user, isLoggedIn, logout, isAuthModalOpen, setIsAuthModalOpen } = useAuth();
    const lastScrollCall = useRef(0);
    const userMenuRef = useRef<HTMLDivElement>(null);

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

    // Close user menu on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    type Locale = 'zh-TW' | 'zh-CN' | 'en';

    const toggleMobileDropdown = (key: string) => {
        setMobileExpanded(mobileExpanded === key ? null : key);
    };

    const userMenuItems = [
        { label: '個人首頁', href: '/profile', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
        { label: '發布文章', href: '/post/create', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg> },
        { label: '文章管理', href: '/admin/articles', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg> },
        { label: '後台報告', href: '/admin/reports', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 2v-6m10 10V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2z" /></svg> },
        { label: '修改資料', href: '/profile/edit', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg> },
    ];

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

                        {/* Auth / User Buttons */}
                        <div className="hidden lg:block">
                            {isLoggedIn ? (
                                <div className="relative" ref={userMenuRef}>
                                    <button
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className="flex items-center gap-3 p-1 pr-4 bg-slate-100/50 rounded-full border border-slate-200/50 hover:border-brand-primary/30 transition-all"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white text-xs font-bold overflow-hidden border-2 border-white">
                                            {user?.avatar ? (
                                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                            ) : (
                                                user?.name?.charAt(0) || 'U'
                                            )}
                                        </div>
                                        <span className="text-sm font-bold text-brand-heading truncate max-w-[100px]">
                                            {user?.name}
                                        </span>
                                        <svg className={`w-4 h-4 text-slate-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {/* User Dropdown */}
                                    <div className={`absolute top-full right-0 mt-4 w-56 bg-white rounded-3xl shadow-2xl border border-slate-100 py-3 transition-all duration-300 transform origin-top-right ${isUserMenuOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
                                        {userMenuItems.map((menuItem) => (
                                            <Link
                                                key={menuItem.href}
                                                href={menuItem.href}
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="flex items-center gap-3 px-5 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-brand-primary transition-all"
                                            >
                                                <span className="text-slate-300">{menuItem.icon}</span>
                                                {menuItem.label}
                                            </Link>
                                        ))}
                                        <div className="mt-2 pt-2 border-t border-slate-50">
                                            <button
                                                onClick={() => { logout(); setIsUserMenuOpen(false); }}
                                                className="w-full flex items-center gap-3 px-5 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                                登出
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsAuthModalOpen(true)}
                                    className="px-8 py-2.5 h-11 bg-brand-primary text-white rounded-xl text-xs font-black shadow-lg shadow-brand-primary/20 hover:bg-brand-secondary transition-all flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 11c0 2.209-1.791 4-4 4s-4-1.791-4-4 1.791-4 4-4 4 1.791 4 4zm4.243 4.243l-4.243-4.243-4.243 4.243m4.243 4.243l4.243-4.243" /></svg>
                                    登入 / 註冊
                                </button>
                            )}
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

            {/* Auth Modal */}
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />

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
                        {/* Mobile User Header */}
                        {isLoggedIn && (
                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl mb-8">
                                <div className="w-12 h-12 rounded-xl bg-brand-primary flex items-center justify-center text-white text-lg font-bold overflow-hidden">
                                    {user?.avatar ? <img src={user.avatar} alt={user.name} /> : user?.name?.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-black text-brand-heading truncate">{user?.name}</p>
                                    <p className="text-[10px] font-bold text-slate-400 truncate">{user?.email}</p>
                                </div>
                            </div>
                        )}

                        <nav className="space-y-2">
                            {navItems.map((item) => (
                                <div key={item.key} className="border-b border-slate-50 last:border-0 pb-2">
                                    <div className="flex items-center justify-between">
                                        <Link
                                            href={item.href}
                                            className="text-xl font-black text-brand-heading py-3 block"
                                            onClick={() => setIsMobileMenuOpen(false)}
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
                            {!isLoggedIn ? (
                                <Button
                                    className="w-full h-14 rounded-2xl font-black text-lg"
                                    onClick={() => { setIsAuthModalOpen(true); setIsMobileMenuOpen(false); }}
                                >
                                    {locale === 'en' ? 'JOIN NOW' : '立即加入'}
                                </Button>
                            ) : (
                                <button
                                    onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                                    className="w-full h-14 rounded-2xl font-black text-lg bg-red-50 text-red-500"
                                >
                                    {locale === 'en' ? 'LOGOUT' : '登出'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
