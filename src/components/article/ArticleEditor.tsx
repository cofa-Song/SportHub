"use client";

import React, { useState } from 'react';
import {
    Image as ImageIcon,
    Type,
    AlignLeft,
    Tag,
    Layout,
    Send,
    Eye,
    ChevronDown,
    Plus,
    X,
    MessageSquare,
    Save
} from 'lucide-react';
import { SportApi } from '@/services/api';
import { ApiResponse, ArticleDTO } from '@/types';
import { useRouter } from 'next/navigation';

interface ArticleEditorProps {
    onSuccess?: (article: ArticleDTO) => void;
    onSaveDraft?: (draft: ArticleDTO) => void;
    initialData?: Partial<ArticleDTO> & { content?: string };
}

export const ArticleEditor: React.FC<ArticleEditorProps> = ({
    onSuccess,
    onSaveDraft,
    initialData
}) => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSavingDraft, setIsSavingDraft] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);
    const [formData, setFormData] = useState({
        id: initialData?.id || '',
        title: initialData?.title || '',
        excerpt: initialData?.excerpt || '',
        content: initialData?.content || '',
        category: initialData?.category || 'Basketball',
        league: initialData?.league || '全部',
        type: initialData?.type || 'ANALYSIS',
        cover_url: initialData?.cover_url || '',
        tags: initialData?.tags || [] as string[]
    });
    const [newTag, setNewTag] = useState('');

    const categories = ['Basketball', 'Baseball', 'Football', 'Tennis', 'Esports', 'Others'];
    const leagues = ['全部', 'NBA', 'MLB', 'CPBL', 'NPB', 'Premier League', 'Champions League', 'Other'];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddTag = () => {
        if (newTag && !formData.tags.includes(newTag)) {
            setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
            setNewTag('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
    };

    const handleSaveDraft = async () => {
        setIsSavingDraft(true);
        try {
            const response = await SportApi.saveDraft(formData);
            if (response.status === 200) {
                if (!formData.id) {
                    setFormData(prev => ({ ...prev, id: response.data.id }));
                }
                alert('草稿已儲存');
                if (onSaveDraft) onSaveDraft(response.data);
            }
        } catch (error) {
            console.error('Failed to save draft:', error);
            alert('草稿儲存失敗');
        } finally {
            setIsSavingDraft(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.content) {
            alert('請填寫標題與內容');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await SportApi.createArticle(formData);
            if (response.status === 200) {
                // If this was a draft, delete it after publishing
                if (formData.id?.startsWith('draft-')) {
                    await SportApi.deleteDraft(formData.id);
                }
                alert('發表成功！');
                if (onSuccess) {
                    onSuccess(response.data);
                } else {
                    router.push('/profile');
                }
            }
        } catch (error) {
            console.error('Failed to create article:', error);
            alert('發表失敗，請稍後再試');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
            {/* Editor Toolbar */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setPreviewMode(false)}
                        className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${!previewMode ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-slate-500 hover:bg-slate-200'}`}
                    >
                        編輯模式
                    </button>
                    <button
                        onClick={() => setPreviewMode(true)}
                        className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${previewMode ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-slate-500 hover:bg-slate-200'}`}
                    >
                        預覽模式
                    </button>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSaveDraft}
                        disabled={isSavingDraft || isSubmitting}
                        className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-all disabled:opacity-50"
                    >
                        <Save size={18} />
                        {isSavingDraft ? '儲存中...' : '儲存為草稿'}
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || isSavingDraft}
                        className="flex items-center gap-2 px-6 py-2.5 bg-brand-primary text-white rounded-xl text-sm font-black shadow-lg shadow-brand-primary/20 hover:bg-brand-secondary transition-all disabled:opacity-50"
                    >
                        {isSubmitting ? '發佈中...' : (
                            <>
                                <Send size={18} />
                                立即發佈
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="p-8">
                {!previewMode ? (
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Title Section */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">文章標題</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="請輸入引人入勝的標題..."
                                className="w-full text-4xl font-black text-brand-heading border-none focus:ring-0 placeholder:text-slate-200 p-0"
                            />
                        </div>

                        {/* Meta Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-6 border-y border-slate-50">
                            {/* Category */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                                    <Layout size={14} className="text-brand-primary" />
                                    分類
                                </label>
                                <div className="relative">
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full appearance-none bg-slate-50 border-none rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 focus:ring-2 focus:ring-brand-primary/20"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* League */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                                    <Type size={14} className="text-brand-primary" />
                                    聯盟
                                </label>
                                <div className="relative">
                                    <select
                                        name="league"
                                        value={formData.league}
                                        onChange={handleInputChange}
                                        className="w-full appearance-none bg-slate-50 border-none rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 focus:ring-2 focus:ring-brand-primary/20"
                                    >
                                        {leagues.map(league => (
                                            <option key={league} value={league}>{league}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Cover URL */}
                            <div className="lg:col-span-2 space-y-2">
                                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                                    <ImageIcon size={14} className="text-brand-primary" />
                                    封面圖片網址
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="cover_url"
                                        value={formData.cover_url}
                                        onChange={handleInputChange}
                                        placeholder="https://example.com/image.jpg"
                                        className="w-full bg-slate-50 border-none rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 focus:ring-2 focus:ring-brand-primary/20"
                                    />
                                    <ImageIcon size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Excerpt */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
                                <AlignLeft size={14} className="text-brand-primary" />
                                文章摘要
                            </label>
                            <textarea
                                name="excerpt"
                                value={formData.excerpt}
                                onChange={handleInputChange}
                                rows={2}
                                placeholder="簡單描述一下這篇文章，這會顯示在列表頁面..."
                                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-medium text-slate-600 focus:ring-2 focus:ring-brand-primary/20 resize-none"
                            />
                        </div>

                        {/* Content Body */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
                                <MessageSquare size={14} className="text-brand-primary" />
                                文章內容
                            </label>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleInputChange}
                                rows={15}
                                placeholder="開始撰寫您的精彩分析..."
                                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-6 text-lg font-medium text-slate-700 focus:ring-2 focus:ring-brand-primary/20 min-h-[400px]"
                            />
                        </div>

                        {/* Tags */}
                        <div className="space-y-4 pt-4">
                            <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
                                <Tag size={14} className="text-brand-primary" />
                                文章標籤
                            </label>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {formData.tags.map((tag: string) => (
                                    <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-primary/10 text-brand-primary text-xs font-black rounded-lg group">
                                        {tag}
                                        <X
                                            size={12}
                                            className="cursor-pointer hover:text-brand-secondary transition-colors"
                                            onClick={() => handleRemoveTag(tag)}
                                        />
                                    </span>
                                ))}
                            </div>
                            <div className="flex max-w-xs">
                                <input
                                    type="text"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    placeholder="新增標籤..."
                                    className="flex-1 bg-slate-50 border-none rounded-l-xl px-4 py-2 text-sm font-bold text-slate-600 focus:ring-2 focus:ring-brand-primary/20"
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddTag}
                                    className="px-4 bg-brand-primary text-white rounded-r-xl hover:bg-brand-secondary transition-colors"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                        </div>
                    </form>
                ) : (
                    /* Preview Mode */
                    <article className="max-w-3xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Header Image */}
                        {formData.cover_url && (
                            <div className="aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl">
                                <img
                                    src={formData.cover_url}
                                    alt="Preview Cover"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        <div className="space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className="px-3 py-1 bg-brand-primary text-white text-[10px] font-black rounded-lg uppercase tracking-wider">
                                        {formData.category}
                                    </span>
                                    <span className="text-xs font-bold text-slate-400">
                                        {new Date().toLocaleDateString('zh-TW')}
                                    </span>
                                </div>
                                <h1 className="text-5xl font-black text-brand-heading leading-[1.15]">
                                    {formData.title || '（無標題文章）'}
                                </h1>
                                <p className="text-xl text-slate-500 font-medium leading-relaxed italic border-l-4 border-slate-200 pl-6 py-1">
                                    {formData.excerpt || '（無摘要內容）'}
                                </p>
                            </div>

                            <div className="prose prose-lg prose-slate max-w-none">
                                {formData.content ? (
                                    formData.content.split('\n\n').map((para, i) => (
                                        <p key={i} className="text-lg text-slate-600 leading-relaxed mb-6">
                                            {para}
                                        </p>
                                    ))
                                ) : (
                                    <p className="text-slate-300 italic">尚未輸入內容...</p>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-2 pt-12 border-t border-slate-50">
                                {formData.tags.map((tag: string) => (
                                    <span key={tag} className="px-4 py-1.5 bg-slate-100 text-slate-500 text-xs font-black rounded-xl">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </article>
                )}
            </div>
        </div>
    );
};
