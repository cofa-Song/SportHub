"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/shared/MockAuthProvider';
import { useRouter } from 'next/navigation';
import { SportApi } from '@/services/api';

export default function ModifyProfilePage() {
    const { user, isLoggedIn, updateUser } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Form states
    const [formData, setFormData] = useState({
        name: user?.name || '',
        gender: user?.gender || 'MALE',
        birthday: user?.birthday || '',
        phone: user?.phone || '',
        bio: user?.bio || '',
        fb_link: user?.fb_link || '',
        ig_link: user?.ig_link || '',
        yt_link: user?.yt_link || '',
        oldPassword: '',
        password: '',
        confirmPassword: ''
    });

    const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null);
    const [showPasswords, setShowPasswords] = useState({ old: false, new: false, confirm: false });

    // Binding States
    const [bindingState, setBindingState] = useState<{
        type: 'email' | 'phone' | null,
        step: 'idle' | 'coding' | 'verifying',
        target: string,
        code: string,
        countdown: number
    }>({
        type: null,
        step: 'idle',
        target: '',
        code: '',
        countdown: 0
    });

    useEffect(() => {
        if (!isLoggedIn && !isLoading) {
            router.push('/');
        }
    }, [isLoggedIn, router, isLoading]);

    useEffect(() => {
        if (user) {
            setFormData({
                ...formData,
                name: user.name || '',
                gender: user.gender || 'MALE',
                birthday: user.birthday || '',
                phone: user.phone || '',
                bio: user.bio || '',
                fb_link: user.fb_link || '',
                ig_link: user.ig_link || '',
                yt_link: user.yt_link || '',
            });
            setAvatarPreview(user.avatar || null);
        }
    }, [user]);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            setMessage({ text: '僅支援 2MB 以內之圖片檔', type: 'error' });
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatarPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSendCode = async (type: 'email' | 'phone', target: string) => {
        if (!target) {
            setMessage({ text: `請輸入${type === 'email' ? '電子郵件' : '手機號碼'}`, type: 'error' });
            return;
        }
        setIsLoading(true);
        const res = await SportApi.sendVerificationCode(target, type);
        setIsLoading(false);
        if (res.status === 200) {
            setBindingState({ ...bindingState, type, step: 'coding', target, countdown: 60 });
            setMessage({ text: '驗證碼已發送', type: 'success' });
        } else {
            setMessage({ text: res.message || '發送失敗', type: 'error' });
        }
    };

    const handleVerify = async () => {
        if (!bindingState.code || !bindingState.type) return;
        setIsLoading(true);
        const res = await SportApi.verifyCode(bindingState.target, bindingState.code, bindingState.type);
        setIsLoading(false);
        if (res.status === 200) {
            setMessage({ text: '綁定成功', type: 'success' });
            setBindingState({ ...bindingState, step: 'idle', code: '', countdown: 0 });
            const updatedUser = SportApi.getCurrentUser();
            if (updatedUser) updateUser(updatedUser);
        } else {
            setMessage({ text: res.message || '驗證碼錯誤', type: 'error' });
        }
    };

    const handleSubmit = async (e: React.FormEvent, sector: 'basic' | 'password' | 'full' = 'full') => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ text: '', type: '' });

        // Basic Info sector
        if (sector === 'basic' || sector === 'full') {
            if (formData.name.length < 2 || formData.name.length > 20) {
                setMessage({ text: '名稱限制 2-20 字元', type: 'error' });
                setIsLoading(false);
                return;
            }
            if (formData.bio.length > 300) {
                setMessage({ text: '個人簡介限制 300 字元', type: 'error' });
                setIsLoading(false);
                return;
            }
        }

        // Password sector
        if (sector === 'password' || sector === 'full') {
            if (formData.password) {
                if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/.test(formData.password)) {
                    setMessage({ text: '新密碼需為 8-16 碼，含英文與數字', type: 'error' });
                    setIsLoading(false);
                    return;
                }
                if (formData.password !== formData.confirmPassword) {
                    setMessage({ text: '新密碼與確認密碼不符', type: 'error' });
                    setIsLoading(false);
                    return;
                }
            }
        }

        const updateData: any = {};
        if (sector === 'basic' || sector === 'full') {
            updateData.name = formData.name;
            updateData.gender = formData.gender;
            updateData.birthday = formData.birthday;
            updateData.bio = formData.bio;
            updateData.fb_link = formData.fb_link;
            updateData.ig_link = formData.ig_link;
            updateData.yt_link = formData.yt_link;
            if (avatarPreview) updateData.avatar = avatarPreview;
        }
        if ((sector === 'password' || sector === 'full') && formData.password) {
            updateData.password = formData.password;
        }

        const res = await updateUser(updateData);
        setIsLoading(false);

        if (res.success) {
            setMessage({ text: sector === 'password' ? '密碼修改成功' : '資料更新成功', type: 'success' });
            if (sector === 'password') {
                setFormData({ ...formData, oldPassword: '', password: '', confirmPassword: '' });
            }
        } else {
            setMessage({ text: res.message, type: 'error' });
        }
    };

    const maskInfo = (info: string | undefined, type: 'email' | 'phone') => {
        if (!info) return '';
        if (type === 'phone') {
            return info.replace(/(\d{4})\d{3}(\d{3})/, '$1***$2');
        }
        const [name, domain] = info.split('@');
        return `${name.slice(0, 3)}***@${domain}`;
    };

    if (!isLoggedIn) return null;

    return (
        <main className="min-h-screen pt-32 pb-20 bg-slate-50">
            <div className="container mx-auto px-6 max-w-5xl">
                <div className="mb-10 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 mb-2">帳號設定</h1>
                        <p className="text-slate-400 font-bold text-sm">管理您的個人資訊與帳號安全</p>
                    </div>
                    <button
                        onClick={() => router.push('/')}
                        className="h-12 px-6 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-500 hover:text-brand-primary hover:border-brand-primary/30 transition-all flex items-center gap-2 shadow-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        返回首頁
                    </button>
                </div>

                <form onSubmit={(e) => handleSubmit(e, 'full')} className="space-y-12">
                    {/* Section 1: Basic Profile */}
                    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 p-8 sm:p-12 lg:p-14">
                        <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                            <h2 className="text-xl font-black text-slate-800 flex items-center gap-4">
                                <span className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                </span>
                                基本資料
                            </h2>
                            <button
                                onClick={(e) => handleSubmit(e, 'basic')}
                                disabled={isLoading}
                                className="h-12 px-8 bg-brand-primary text-white text-sm font-black rounded-2xl shadow-lg shadow-brand-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : '儲存基本資料'}
                            </button>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-12">
                            {/* Avatar Column */}
                            <div className="shrink-0 flex flex-col items-center">
                                <label className="relative group cursor-pointer block">
                                    <input type="file" className="hidden" accept="image/png, image/jpeg" onChange={handleAvatarChange} />
                                    <div className="w-36 h-36 rounded-[2.8rem] bg-slate-100 border-4 border-white shadow-2xl shadow-slate-200/80 overflow-hidden relative group cursor-pointer ring-1 ring-slate-100">
                                        {avatarPreview ? (
                                            <img src={avatarPreview} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-brand-primary/10 text-brand-primary text-5xl font-black">
                                                {user?.name?.charAt(0)}
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-brand-heading/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        </div>
                                    </div>
                                </label>
                                <p className="mt-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">支援 JPG/PNG, &lt; 2MB</p>
                            </div>

                            {/* Info Column */}
                            <div className="flex-1 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1 flex justify-between">
                                            名稱 (Username)
                                            <span className={formData.name.length < 2 || formData.name.length > 20 ? 'text-red-500' : 'text-slate-300'}>
                                                {formData.name.length}/20
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary/30 transition-all"
                                            placeholder="2-20 字元"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">性別 (Gender)</label>
                                        <div className="relative">
                                            <select
                                                value={formData.gender}
                                                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary/30 transition-all appearance-none"
                                            >
                                                <option value="MALE">男性風格 (Male)</option>
                                                <option value="FEMALE">女性風格 (Female)</option>
                                                <option value="OTHER">其他 (Other)</option>
                                            </select>
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">生日 (Birthday)</label>
                                        <input
                                            type="date"
                                            max={new Date().toISOString().split('T')[0]}
                                            value={formData.birthday}
                                            onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary/30 transition-all"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">FB 連結</label>
                                            <input
                                                type="text"
                                                value={formData.fb_link}
                                                onChange={(e) => setFormData({ ...formData, fb_link: e.target.value })}
                                                placeholder="https://facebook.com/..."
                                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary/30 transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">IG 連結</label>
                                        <input
                                            type="text"
                                            value={formData.ig_link}
                                            onChange={(e) => setFormData({ ...formData, ig_link: e.target.value })}
                                            placeholder="https://instagram.com/..."
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary/30 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Youtube 連結</label>
                                        <input
                                            type="text"
                                            value={formData.yt_link}
                                            onChange={(e) => setFormData({ ...formData, yt_link: e.target.value })}
                                            placeholder="https://youtube.com/..."
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary/30 transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1 flex justify-between">
                                        個人簡介
                                        <span className={formData.bio.length > 300 ? 'text-red-500' : 'text-slate-300'}>
                                            {formData.bio.length}/300
                                        </span>
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        placeholder="對外展示的簡短介紹..."
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary/30 transition-all resize-none"
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Change Password */}
                    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 p-8 sm:p-12 lg:p-14">
                        <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                            <h2 className="text-xl font-black text-slate-800 flex items-center gap-4">
                                <span className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                </span>
                                修改密碼
                            </h2>
                            <button
                                onClick={(e) => handleSubmit(e, 'password')}
                                disabled={isLoading || !formData.password}
                                className="h-12 px-8 bg-orange-500 text-white text-sm font-black rounded-2xl shadow-lg shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:scale-100"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : '儲存新密碼'}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">目前密碼</label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.old ? "text" : "password"}
                                        value={formData.oldPassword}
                                        onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
                                        placeholder="必填"
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary/30 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswords({ ...showPasswords, old: !showPasswords.old })}
                                        className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-primary transition-colors"
                                    >
                                        {showPasswords.old ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88L4.5 4.5m9.938 3.388a9.461 9.461 0 015.104 4.112 10.133 10.133 0 01-1.947 3.461m-3.32-3.321L20.5 19.5" /></svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">新密碼 (8-16 碼英數)</label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.new ? "text" : "password"}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="必填"
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary/30 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                                        className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-primary transition-colors"
                                    >
                                        {showPasswords.new ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88L4.5 4.5m9.938 3.388a9.461 9.461 0 015.104 4.112 10.133 10.133 0 01-1.947 3.461m-3.32-3.321L20.5 19.5" /></svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">確認新密碼</label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.confirm ? "text" : "password"}
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        placeholder="必填"
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary/30 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                                        className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-primary transition-colors"
                                    >
                                        {showPasswords.confirm ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88L4.5 4.5m9.938 3.388a9.461 9.461 0 015.104 4.112 10.133 10.133 0 01-1.947 3.461m-3.32-3.321L20.5 19.5" /></svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Data Binding */}
                    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 p-8 sm:p-12 lg:p-14">
                        <h2 className="text-xl font-black text-slate-800 mb-10 flex items-center gap-4">
                            <span className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                            </span>
                            資料綁定
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Email Binding Item */}
                            <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col gap-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-slate-400 shadow-sm">
                                            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">電子郵件 (Email)</p>
                                            <p className="text-sm font-black text-slate-800">
                                                {user?.email_verified ? maskInfo(user.email, 'email') : '尚未驗證'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {user?.email_verified && (
                                            <span className="px-4 py-1.5 bg-emerald-50 text-emerald-500 rounded-full text-[10px] font-black uppercase tracking-wider border border-emerald-100">已驗證</span>
                                        )}
                                        {user?.email_verified && bindingState.type !== 'email' && (
                                            <button
                                                onClick={() => setBindingState({ ...bindingState, type: 'email', step: 'idle', target: '' })}
                                                className="text-xs font-black text-brand-primary hover:text-brand-secondary transition-colors"
                                            >
                                                修改
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {(!user?.email_verified || bindingState.type === 'email') && (
                                    <div className="space-y-4 pt-4 border-t border-slate-200/50">
                                        <div className="flex gap-3">
                                            <input
                                                type="email"
                                                disabled={bindingState.type === 'email' && bindingState.step === 'coding'}
                                                value={bindingState.type === 'email' ? bindingState.target : ''}
                                                onChange={(e) => setBindingState({ ...bindingState, type: 'email', target: e.target.value })}
                                                placeholder="輸入新的 Email"
                                                className="flex-1 px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary/30 outline-none transition-all"
                                            />
                                            <button
                                                onClick={() => handleSendCode('email', bindingState.target)}
                                                disabled={isLoading || bindingState.countdown > 0}
                                                className="px-6 bg-brand-primary text-white text-xs font-black rounded-2xl hover:bg-brand-secondary disabled:opacity-50 transition-all whitespace-nowrap"
                                            >
                                                {bindingState.countdown > 0 ? `重新發送 (${bindingState.countdown}s)` : '發送驗證信'}
                                            </button>
                                        </div>
                                        {bindingState.type === 'email' && bindingState.step === 'coding' && (
                                            <div className="flex gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <input
                                                    type="text"
                                                    maxLength={6}
                                                    value={bindingState.code}
                                                    onChange={(e) => setBindingState({ ...bindingState, code: e.target.value })}
                                                    placeholder="輸入 6 位驗證碼"
                                                    className="flex-1 px-5 py-3.5 bg-white border border-brand-primary/20 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary/30 outline-none transition-all"
                                                />
                                                <button
                                                    onClick={handleVerify}
                                                    disabled={isLoading || bindingState.code.length !== 6}
                                                    className="px-8 bg-brand-heading text-white text-xs font-black rounded-2xl hover:bg-black disabled:opacity-50 transition-all"
                                                >
                                                    {isLoading ? '核驗中...' : '確認綁定'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Phone Binding Item */}
                            <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col gap-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-slate-400 shadow-sm">
                                            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M17 1H7c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 19H7V4h10v16zm-5-1c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z" /></svg>
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">手機號碼 (Phone)</p>
                                            <p className="text-sm font-black text-slate-800">
                                                {user?.phone_verified ? maskInfo(user.phone, 'phone') : '尚未驗證'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {user?.phone_verified && (
                                            <span className="px-4 py-1.5 bg-emerald-50 text-emerald-500 rounded-full text-[10px] font-black uppercase tracking-wider border border-emerald-100">已驗證</span>
                                        )}
                                        {user?.phone_verified && bindingState.type !== 'phone' && (
                                            <button
                                                onClick={() => setBindingState({ ...bindingState, type: 'phone', step: 'idle', target: '' })}
                                                className="text-xs font-black text-brand-primary hover:text-brand-secondary transition-colors"
                                            >
                                                修改
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {(!user?.phone_verified || bindingState.type === 'phone') && (
                                    <div className="space-y-4 pt-4 border-t border-slate-200/50">
                                        <div className="flex gap-3">
                                            <input
                                                type="tel"
                                                disabled={bindingState.type === 'phone' && bindingState.step === 'coding'}
                                                value={bindingState.type === 'phone' ? bindingState.target : ''}
                                                onChange={(e) => setBindingState({ ...bindingState, type: 'phone', target: e.target.value })}
                                                placeholder="輸入手機號碼 (09...)"
                                                className="flex-1 px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary/30 outline-none transition-all"
                                            />
                                            <button
                                                onClick={() => handleSendCode('phone', bindingState.target)}
                                                disabled={isLoading || bindingState.countdown > 0}
                                                className="px-6 bg-brand-primary text-white text-xs font-black rounded-2xl hover:bg-brand-secondary disabled:opacity-50 transition-all whitespace-nowrap"
                                            >
                                                {bindingState.countdown > 0 ? `重新發送 (${bindingState.countdown}s)` : '發送驗證碼'}
                                            </button>
                                        </div>
                                        {bindingState.type === 'phone' && bindingState.step === 'coding' && (
                                            <div className="flex gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <input
                                                    type="text"
                                                    maxLength={6}
                                                    value={bindingState.code}
                                                    onChange={(e) => setBindingState({ ...bindingState, code: e.target.value })}
                                                    placeholder="輸入 6 位驗證碼"
                                                    className="flex-1 px-5 py-3.5 bg-white border border-brand-primary/20 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary/30 outline-none transition-all"
                                                />
                                                <button
                                                    onClick={handleVerify}
                                                    disabled={isLoading || bindingState.code.length !== 6}
                                                    className="px-8 bg-brand-heading text-white text-xs font-black rounded-2xl hover:bg-black disabled:opacity-50 transition-all"
                                                >
                                                    {isLoading ? '核驗中...' : '確認綁定'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Feedback Message */}
                    {message.text && (
                        <div className={`p-6 rounded-[2rem] text-sm font-bold flex items-center gap-5 animate-in slide-in-from-top-4 duration-500 shadow-lg ${message.type === 'success' ? 'bg-emerald-50/80 backdrop-blur text-emerald-600 border border-emerald-100' : 'bg-red-50/80 backdrop-blur text-red-600 border border-red-100'}`}>
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${message.type === 'success' ? 'bg-emerald-100' : 'bg-red-100'}`}>
                                {message.type === 'success' ? (
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                )}
                            </div>
                            {message.text}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-6 pt-10">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`flex-[2] min-h-[4.5rem] bg-brand-primary text-white rounded-[2rem] text-lg font-black shadow-2xl shadow-brand-primary/30 hover:bg-brand-secondary transition-all flex items-center justify-center gap-4 transform hover:-translate-y-1.5 active:scale-95 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? (
                                <svg className="animate-spin h-7 w-7 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            ) : (
                                <>
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                    儲存所有變更
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="flex-1 min-h-[4.5rem] bg-slate-100 text-slate-500 rounded-[2rem] font-black hover:bg-slate-200 transition-all active:scale-95 border border-slate-200"
                        >
                            放棄修改並返回
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
