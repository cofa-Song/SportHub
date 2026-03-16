'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/shared/MockAuthProvider';
import { Loader2, CheckCircle } from 'lucide-react';

export default function SubscriptionSuccessPage() {
    const { isLoggedIn, isLoading: authLoading, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !isLoggedIn) {
            router.push('/');
        }
    }, [isLoggedIn, authLoading, router]);

    if (authLoading || !isLoggedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="animate-spin text-brand-primary" size={40} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl p-10 shadow-xl shadow-brand-primary/5 text-center animate-in zoom-in-95 duration-700">
                
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-in slide-in-from-bottom-5 duration-1000 delay-150 relative">
                    <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20"></div>
                    <CheckCircle className="w-12 h-12 text-green-500" />
                </div>

                <h1 className="text-3xl font-black text-brand-heading mb-4 animate-in slide-in-from-bottom-5 duration-700 delay-300">
                    訂閱成功！
                </h1>
                
                <p className="text-slate-500 font-bold mb-8 animate-in slide-in-from-bottom-5 duration-700 delay-500">
                    感謝您的支持。您的帳號現已升級為無廣告會員，請盡情享受純淨的閱讀體驗。
                </p>

                {user?.subscription_end_date && (
                    <div className="bg-slate-50 rounded-2xl p-4 mb-8 text-sm font-bold text-slate-600 animate-in slide-in-from-bottom-5 duration-700 delay-700">
                        下次扣款日期：{new Date(user.subscription_end_date).toLocaleDateString()}
                    </div>
                )}

                <button
                    onClick={() => router.push('/')}
                    className="w-full py-4 rounded-xl font-black text-lg bg-brand-primary text-white hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-primary/40 transition-all shadow-brand-primary/25 animate-in slide-in-from-bottom-5 duration-700 delay-1000"
                >
                    開始無廣告閱讀
                </button>
            </div>
        </div>
    );
}
