"use client";

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/LanguageProvider';

/**
 * Artistic Dark Footer.
 * Redesigned for a premium look with dark background and vibrant accents.
 */
export const Footer: React.FC = () => {
    const { t } = useTranslation();

    const socialIcons = [
        {
            name: 'Facebook', id: 'fb', icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
            )
        },
        {
            name: 'Twitter', id: 'tw', icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.04l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            )
        },
        {
            name: 'Instagram', id: 'ig', icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
            )
        },
        {
            name: 'Threads', id: 'threads', icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 448 512"><path d="M331.5 235.1c2.3 24.5-5.1 43.1-20.4 53.3-13.4 8.7-32.1 11.3-48.4 4.1-13.8-6.1-24.1-17.1-24.2-34.4v-1.6c.1-17.1 10.4-28.7 24.2-35.3 16.3-7.7 35.1-5.1 48.4 4.1 15.3 10.7 22.1 27.6 20.4 50ZM448 360V152c0-83.9-68.1-152-152-152H152C68.1 0 0 68.1 0 152v208c0 83.9 68.1 152 152 152h144c83.9 0 152-68.1 152-152ZM192 157.1c3.1-20.5 17.4-34.9 38-34.9 18.6 0 31.9 12.3 35.8 31.3V192h-73.8v-34.9Zm195 204.4c-9.5 45.3-49.3 78.4-95.6 78.4v-16c38.7 0 71.9-27.6 80-65.1h-44.1c-13.3 18.5-35.2 30.6-59.3 30.6-40.4 0-73.1-32.7-73.1-73.1 0-40.4 32.7-73.1 73.1-73.1 24.1 0 46 12.1 59.3 30.6h70.3c-4.4-60.6-55.9-108.4-118-108.4-66.2 0-120 53.8-120 120 0 66.2 53.8 120 120 120 28.5 0 54.4-10 74.5-26.6l10.9 11.8c-24.6 20.4-56.1 32.7-90.5 32.7-73.1 0-132.3-59.2-132.3-132.3s59.2-132.3 132.3-132.3c68.3 0 124.3 52.3 131.6 118.9h2.3c0-6.1.1-12.1.2-18.1H387Zm-3.8 19.3c.7-3.2 1.4-6.4 1.8-9.6h.1l-.1 9.6Z" /></svg>
            )
        }

    ];

    return (
        <footer className="mt-20 py-20 bg-brand-heading text-white overflow-hidden relative border-t border-white/5">
            {/* Decorative gradient overlay */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-primary to-transparent opacity-50"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[400px] bg-brand-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
                    {/* Section 1: Brand & About */}
                    <div className="space-y-8">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-2xl shadow-brand-primary/40 transform group-hover:rotate-12 transition-transform">
                                <span className="text-white font-black text-xl">S</span>
                            </div>
                            <span className="text-2xl font-black tracking-tighter text-white">
                                SPORT<span className="text-brand-primary">HUB</span>
                            </span>
                        </Link>

                        <div className="space-y-6">
                            <h4 className="text-lg font-black text-white/90 underline decoration-brand-primary decoration-4 underline-offset-8">
                                {t.footer.about.title}
                            </h4>
                            <ul className="space-y-4">
                                {['aboutUs', 'becomeAuthor', 'faq', 'announcements'].map((key) => (
                                    <li key={key}>
                                        <Link href={`/${key}`} className="text-sm font-bold text-white/40 hover:text-brand-primary transition-all flex items-center gap-3 group">
                                            <span className="w-1.5 h-1.5 bg-brand-primary/20 rounded-full group-hover:scale-150 group-hover:bg-brand-primary transition-all"></span>
                                            {t.footer.about[key as keyof typeof t.footer.about]}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Section 2: Author Rights */}
                    <div className="space-y-8 lg:mt-16">
                        <h4 className="text-lg font-black text-white/90 flex items-center gap-3">
                            <span className="w-2 h-2 bg-brand-secondary rounded-full animate-pulse"></span>
                            {t.footer.rights.title}
                        </h4>
                        <ul className="space-y-4">
                            {['tos', 'authorTerms'].map((key) => (
                                <li key={key}>
                                    <Link href={`/${key}`} className="text-sm font-bold text-white/40 hover:text-white transition-colors block">
                                        {t.footer.rights[key as keyof typeof t.footer.rights]}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Section 3: Sponsorship */}
                    <div className="space-y-8 lg:mt-16">
                        <h4 className="text-lg font-black text-white/90 flex items-center gap-3">
                            <span className="w-2 h-2 bg-brand-primary rounded-full"></span>
                            {t.footer.sponsorship.title}
                        </h4>
                        <ul className="space-y-4">
                            {['ads', 'support'].map((key) => (
                                <li key={key}>
                                    <Link href={`/${key}`} className="text-sm font-bold text-white/40 hover:text-white transition-colors block">
                                        {t.footer.sponsorship[key as keyof typeof t.footer.sponsorship]}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Section 4: Social & Newsletter */}
                    <div className="space-y-8 lg:mt-16">
                        <h4 className="text-lg font-black text-white/90">{t.footer.follow.title}</h4>
                        <div className="flex gap-4">
                            {socialIcons.map((social) => (
                                <a
                                    key={social.id}
                                    href={`#${social.id}`}
                                    className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:bg-brand-primary hover:text-white hover:border-brand-primary hover:shadow-2xl hover:shadow-brand-primary/40 transition-all duration-300 group"
                                    aria-label={social.name}
                                >
                                    <div className="transform group-hover:scale-110 transition-transform">
                                        {social.icon}
                                    </div>
                                </a>
                            ))}
                        </div>

                        {/* Minimalist Newsletter */}
                        <div className="p-1.5 bg-white/5 border border-white/10 rounded-2xl flex items-center focus-within:border-brand-primary/40 transition-colors">
                            <input
                                type="email"
                                placeholder="Join Newsletter"
                                className="bg-transparent px-4 py-2 text-xs font-bold text-white outline-none flex-1 placeholder:text-white/20"
                            />
                            <button className="bg-brand-primary text-white p-2 rounded-xl hover:bg-brand-primary-dark transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between gap-8 items-center text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                    <p>© 2026 SPORTHUB BLOG. ENGINEERED FOR VICTORY.</p>
                    <div className="flex gap-10">
                        {['Privacy', 'Cookies', 'Sitemap'].map(item => (
                            <Link key={item} href={`/${item.toLowerCase()}`} className="hover:text-brand-primary transition-colors">
                                {item}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};
