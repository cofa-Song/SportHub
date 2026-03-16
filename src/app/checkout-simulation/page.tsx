'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/shared/MockAuthProvider';
import { SportApi } from '@/services/api';
import { Loader2, ShieldCheck } from 'lucide-react';

export default function CheckoutSimulationPage() {
    const { isLoggedIn, isLoading: authLoading, updateProfile } = useAuth();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (!authLoading && !isLoggedIn) {
            router.push('/subscription');
        }
    }, [isLoggedIn, authLoading, router]);

    if (authLoading || !isLoggedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="animate-spin text-brand-primary" size={40} />
            </div>
        );
    }

    const handleSimulateSuccess = async () => {
        setIsProcessing(true);
        try {
            const res = await SportApi.mockWebhookPaymentSuccess();
            if (res.status === 200) {
                // 強制觸發 AuthProvider 更新 (雖然 mockWebhook 已更新 localStorage，但需要讓 context 重抓或手動 merge)
                // 這裡我們直接呼叫 updateProfile 來讓 context 吃到最新的值，確保 Navbar 和其他元件更新
                await updateProfile(res.data);
                router.push('/subscription/success');
            } else {
                alert('模擬失敗：' + res.message);
                setIsProcessing(false);
            }
        } catch (error) {
            alert('系統錯誤');
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95 duration-500 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-slate-300">
                    <div className="h-full bg-brand-primary animate-pulse w-2/3 rounded-r-full"></div>
                </div>

                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <ShieldCheck className="w-10 h-10 text-brand-primary" />
                </div>

                <h1 className="text-2xl font-black text-slate-800 mb-2">第三方支付閘道模擬</h1>
                <p className="text-sm text-slate-500 font-bold mb-8">
                    （測試環境）請點擊下方按鈕以模擬使用者完成信用卡付款，並觸發 Webhook 回傳給系統。
                </p>

                <button
                    onClick={handleSimulateSuccess}
                    disabled={isProcessing}
                    className={`w-full py-4 rounded-xl font-black text-lg text-white transition-all shadow-lg flex items-center justify-center gap-2 ${
                        isProcessing 
                            ? 'bg-slate-300 shadow-none cursor-not-allowed' 
                            : 'bg-green-500 hover:bg-green-600 shadow-green-500/30 hover:-translate-y-1 hover:shadow-green-500/50'
                    }`}
                >
                    {isProcessing ? (
                        <>
                            <Loader2 className="animate-spin w-5 h-5" />
                            處理中...
                        </>
                    ) : (
                        '模擬支付成功'
                    )}
                </button>

                <button
                    onClick={() => router.push('/subscription')}
                    disabled={isProcessing}
                    className="mt-4 w-full py-3 rounded-xl font-bold text-sm text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
                >
                    取消並返回
                </button>
            </div>
        </div>
    );
}
