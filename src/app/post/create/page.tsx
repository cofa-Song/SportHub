"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/shared/MockAuthProvider';
import { ArticleEditor } from '@/components/article/ArticleEditor';
import { ChevronLeft, PenTool, Flame, Zap } from 'lucide-react';
import Link from 'next/link';
import { SportApi } from '@/services/api';
import { ArticleDTO } from '@/types';

export default function CreatePostPage() {
    const { isLoggedIn, setIsAuthModalOpen } = useAuth();
    const router = useRouter();
    const [activeSection, setActiveSection] = React.useState<'edit' | 'drafts'>('edit');
    const [drafts, setDrafts] = React.useState<ArticleDTO[]>([]);
    const [editingDraft, setEditingDraft] = React.useState<ArticleDTO | null>(null);

    const fetchDrafts = async () => {
        const res = await SportApi.getDrafts();
        if (res.status === 200) {
            setDrafts(res.data);
        }
    };

    const fetchArticleForEdit = async (id: string) => {
        const res = await SportApi.getArticleDetail(id);
        if (res.status === 200) {
            setEditingDraft(res.data);
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            fetchDrafts();

            // Check for edit param
            const urlParams = new URLSearchParams(window.location.search);
            const editId = urlParams.get('edit');
            if (editId) {
                fetchArticleForEdit(editId);
            }
        }
    }, [isLoggedIn]);

    const handleEditDraft = (draft: ArticleDTO) => {
        setEditingDraft(draft);
        setActiveSection('edit');
    };

    const handleDeleteDraft = async (id: string) => {
        if (!confirm('確定要刪除此草稿嗎？')) return;
        const res = await SportApi.deleteDraft(id);
        if (res.status === 200) {
            fetchDrafts();
            if (editingDraft?.id === id) {
                setEditingDraft(null);
            }
        }
    };

    const handleSuccess = () => {
        router.push('/profile');
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
                <div className="max-w-md w-full text-center space-y-8 p-12 bg-white rounded-3xl shadow-2xl border border-slate-100">
                    <div className="w-20 h-20 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto text-brand-primary">
                        <PenTool size={40} />
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-3xl font-black text-brand-heading">需先登入會員</h1>
                        <p className="text-slate-500 font-medium">請登入您的帳號以開始撰寫精彩的分析文章。</p>
                    </div>
                    <button
                        onClick={() => setIsAuthModalOpen(true)}
                        className="w-full py-4 bg-brand-primary text-white rounded-2xl font-black shadow-lg shadow-brand-primary/20 hover:bg-brand-secondary transition-all"
                    >
                        登入 / 註冊
                    </button>
                    <Link href="/" className="block text-sm font-bold text-slate-400 hover:text-brand-primary transition-colors">
                        返回首頁
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-28 pb-20">
            <div className="container mx-auto px-4 md:px-12">
                <div className="max-w-5xl mx-auto space-y-8">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-4">
                            <Link href="/profile" className="inline-flex items-center gap-2 text-sm font-black text-slate-400 hover:text-brand-primary transition-colors">
                                <ChevronLeft size={16} />
                                返回個人管理
                            </Link>
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <span className="px-3 py-1 bg-brand-secondary/10 text-brand-secondary text-[10px] font-black rounded-lg uppercase tracking-wider flex items-center gap-1">
                                        <Zap size={10} />
                                        CREATOR STUDIO
                                    </span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                                    <span className="text-sm font-bold text-slate-400">建立新內容</span>
                                </div>
                                <h1 className="text-5xl font-black text-brand-heading tracking-tight">
                                    發表您的<span className="text-brand-primary">觀點</span>
                                </h1>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex p-1 bg-white rounded-2xl border border-slate-100 shadow-sm self-start md:self-auto">
                            <button
                                onClick={() => {
                                    setEditingDraft(null);
                                    setActiveSection('edit');
                                }}
                                className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeSection === 'edit' && !editingDraft ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                撰寫文章
                            </button>
                            <button
                                onClick={() => setActiveSection('drafts')}
                                className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeSection === 'drafts' ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                草稿管理 ({drafts.length})
                            </button>
                        </div>
                    </div>

                    {activeSection === 'edit' ? (
                        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <ArticleEditor
                                key={editingDraft?.id || 'new'}
                                initialData={editingDraft || {}}
                                onSuccess={handleSuccess}
                                onSaveDraft={fetchDrafts}
                            />
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-4">
                            {drafts.length > 0 ? (
                                drafts.map(draft => (
                                    <div key={draft.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between gap-6 group hover:shadow-xl transition-all duration-300">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="px-2 py-0.5 bg-slate-100 text-slate-400 text-[10px] font-black rounded">
                                                    {draft.league || '全部'}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-300 uppercase">
                                                    最後修改：{new Date(draft.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-black text-brand-heading truncate group-hover:text-brand-primary transition-colors">
                                                {draft.title || '（無標題草稿）'}
                                            </h3>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleEditDraft(draft)}
                                                className="px-4 py-2 bg-slate-50 text-slate-500 rounded-xl text-sm font-black hover:bg-brand-primary hover:text-white transition-all"
                                            >
                                                編輯
                                            </button>
                                            <button
                                                onClick={() => draft.id && handleDeleteDraft(draft.id)}
                                                className="px-4 py-2 bg-slate-50 text-slate-300 rounded-xl text-sm font-black hover:bg-red-50 hover:text-red-500 transition-all"
                                            >
                                                刪除
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                                    <p className="text-slate-400 font-bold">目前沒有任何草稿</p>
                                    <button
                                        onClick={() => setActiveSection('edit')}
                                        className="mt-4 text-brand-primary font-black hover:underline"
                                    >
                                        立即開始撰寫
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Footer / Tip */}
                    <div className="text-center">
                        <p className="text-xs font-medium text-slate-400">
                            發佈即代表您同意本站的 <a href="#" className="underline">創作者規範</a> 與 <a href="#" className="underline">內容使用條款</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
