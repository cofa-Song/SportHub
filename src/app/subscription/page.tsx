'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/shared/MockAuthProvider';
import { SportApi } from '@/services/api';
import { Loader2, CheckCircle2 } from 'lucide-react';

export default function SubscriptionPage() {
    const { user, isLoggedIn, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [isSubscribing, setIsSubscribing] = useState(false);
    const [plan, setPlan] = useState<'monthly' | 'yearly'>('monthly');
    const [agreedToTos, setAgreedToTos] = useState(false);

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="animate-spin text-brand-primary" size={40} />
            </div>
        );
    }

    const handleSubscribe = async () => {
        if (!isLoggedIn) {
            alert('請先登入後再進行訂閱');
            return;
        }
        if (!agreedToTos) {
            alert('請先同意服務條款');
            return;
        }

        setIsSubscribing(true);
        try {
            const res = await SportApi.createSubscriptionOrder(plan);
            if (res.status === 200) {
                // 跳轉至模擬金流頁面
                router.push(res.data.checkout_url);
            } else {
                alert(res.message || '發生錯誤');
                setIsSubscribing(false);
            }
        } catch (error) {
            alert('系統錯誤，請重試');
            setIsSubscribing(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-24">
            <div className="container mx-auto px-4 md:px-12">
                <div className="max-w-3xl mx-auto text-center mb-16 animate-in slide-in-from-bottom-5 duration-700">
                    <h1 className="text-4xl md:text-5xl font-black text-brand-heading mb-6 tracking-tight">
                        升級您的閱讀體驗
                    </h1>
                    <p className="text-lg text-slate-500 font-bold max-w-2xl mx-auto">
                        為優質創作者充電！訂閱無廣告方案，享受純淨、不受干擾的閱讀環境，同時支持創作者持續產出精彩內容。
                    </p>
                </div>

                <div className="max-w-md mx-auto animate-in slide-in-from-bottom-10 duration-1000">
                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-brand-primary/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform duration-500"></div>
                        
                        <div className="mb-6 relative z-10">
                            <span className="bg-brand-primary/10 text-brand-primary text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                                付費免除廣告
                            </span>
                            <div className="mt-6 flex flex-col gap-4">
                                <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${plan === 'monthly' ? 'border-brand-primary bg-brand-primary/5' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                                    <div className="flex items-center gap-3">
                                        <input 
                                            type="radio" 
                                            name="plan" 
                                            checked={plan === 'monthly'} 
                                            onChange={() => setPlan('monthly')}
                                            className="w-5 h-5 text-brand-primary focus:ring-brand-primary transition-all border-slate-300"
                                        />
                                        <span className="font-bold text-slate-700">月費方案</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-2xl font-black text-brand-heading">NT$99</span>
                                        <span className="text-xs text-slate-400 font-bold"> / 月</span>
                                    </div>
                                </label>

                                <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${plan === 'yearly' ? 'border-brand-primary bg-brand-primary/5' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                                    <div className="flex items-center gap-3">
                                        <input 
                                            type="radio" 
                                            name="plan" 
                                            checked={plan === 'yearly'} 
                                            onChange={() => setPlan('yearly')}
                                            className="w-5 h-5 text-brand-primary focus:ring-brand-primary transition-all border-slate-300"
                                        />
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-700">年費方案</span>
                                            <span className="text-[10px] font-black text-green-500 uppercase tracking-wider">省下 17%</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-2xl font-black text-brand-heading">NT$990</span>
                                        <span className="text-xs text-slate-400 font-bold"> / 年</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8 relative z-10">
                            {[
                                '完全無廣告的閱讀介面',
                                '支持喜愛的運動專欄作家',
                                '專屬訂閱者徽章 (開發中)',
                                '優先獲得線上活動參與權'
                            ].map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                    <span className="text-slate-600 font-bold text-sm">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <label className="flex items-start gap-2 mb-6 cursor-pointer group">
                            <input 
                                type="checkbox" 
                                checked={agreedToTos} 
                                onChange={(e) => setAgreedToTos(e.target.checked)}
                                className="mt-1 w-4 h-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary transition-all cursor-pointer"
                            />
                            <span className="text-sm text-slate-500 font-bold group-hover:text-slate-700 transition-colors">
                                我已閱讀並同意 <a href="#" className="text-brand-primary hover:underline" onClick={(e) => e.preventDefault()}>服務條款</a> 與 <a href="#" className="text-brand-primary hover:underline" onClick={(e) => e.preventDefault()}>隱私權政策</a>
                            </span>
                        </label>

                        <button
                            onClick={handleSubscribe}
                            disabled={isSubscribing || (!agreedToTos && isLoggedIn)}
                            className={`w-full py-4 rounded-2xl font-black text-lg text-white transition-all duration-300 shadow-lg flex items-center justify-center gap-2 relative z-10 ${
                                isSubscribing || (!agreedToTos && isLoggedIn)
                                    ? 'bg-slate-300 shadow-none cursor-not-allowed' 
                                    : 'bg-brand-primary shadow-brand-primary/25 hover:-translate-y-1 hover:shadow-brand-primary/40'
                            }`}
                        >
                            {isSubscribing ? (
                                <>
                                    <Loader2 className="animate-spin w-5 h-5" />
                                    導向金流中...
                                </>
                            ) : (
                                '立即購買'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
