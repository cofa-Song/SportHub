'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Construction, Rocket, Clock } from 'lucide-react';

export default function ComingSoonPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-primary/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-brand-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="max-w-2xl w-full bg-white rounded-[2.5rem] p-10 md:p-16 shadow-2xl shadow-slate-200/50 border border-slate-100 relative z-10 animate-in fade-in zoom-in duration-700">
                {/* Icon Container */}
                <div className="w-24 h-24 bg-brand-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-10 rotate-3 hover:rotate-0 transition-transform duration-500">
                    <Construction className="w-12 h-12 text-brand-primary" />
                </div>

                {/* Text Content */}
                <h1 className="text-4xl md:text-5xl font-black text-brand-heading mb-6 tracking-tight italic uppercase">
                    功能開發中 <span className="text-brand-primary">Coming Soon</span>
                </h1>

                <p className="text-lg text-slate-500 font-medium leading-relaxed mb-12">
                    我們正在全力打造這個功能，致力於為您提供最專業、最流暢的體育競技體驗。
                    <br className="hidden md:block" />
                    請稍候片刻，更多精彩內容即將上線！
                </p>

                {/* Status Indicator */}
                <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
                        <Rocket className="w-4 h-4 text-brand-secondary" />
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">正在趕工中</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
                        <Clock className="w-4 h-4 text-brand-primary" />
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">預計近期上線</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black rounded-2xl transition-all group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        返回上一頁
                    </button>
                    <Link
                        href="/"
                        className="w-full sm:w-auto flex items-center justify-center px-8 py-4 bg-brand-primary text-white font-black rounded-2xl shadow-lg shadow-brand-primary/20 hover:shadow-xl hover:shadow-brand-primary/30 hover:-translate-y-1 transition-all"
                    >
                        回到首頁
                    </Link>
                </div>
            </div>

            {/* Footer Brand */}
            <div className="mt-12 opacity-30 select-none">
                <span className="text-2xl font-black italic tracking-tighter text-slate-400">SPORTHUB</span>
            </div>
        </div>
    );
}
