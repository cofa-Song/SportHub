'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, Check } from 'lucide-react';
import { format, addDays, startOfDay, isSameDay } from 'date-fns';
import { zhTW } from 'date-fns/locale';

interface DateModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedDate: Date;
    onConfirm: (date: Date) => void;
}

export const DateModal: React.FC<DateModalProps> = ({ isOpen, onClose, selectedDate, onConfirm }) => {
    const [tempDate, setTempDate] = useState(selectedDate);

    // Generate 30 days of options
    const dateOptions = Array.from({ length: 30 }).map((_, i) => addDays(startOfDay(new Date()), i - 7));

    useEffect(() => {
        if (isOpen) {
            setTempDate(selectedDate);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen, selectedDate]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />

            <div className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-2xl font-black text-slate-900 italic">選取日期</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-6 h-6 text-slate-400" />
                    </button>
                </div>

                <div className="p-4 max-h-[400px] overflow-y-auto grid grid-cols-4 gap-2">
                    {dateOptions.map((date) => {
                        const isActive = isSameDay(date, tempDate);
                        const isToday = isSameDay(date, new Date());

                        return (
                            <button
                                key={date.toISOString()}
                                onClick={() => setTempDate(date)}
                                className={`
                                    flex flex-col items-center p-3 rounded-2xl transition-all border
                                    ${isActive
                                        ? 'bg-slate-900 border-slate-900 text-white shadow-xl'
                                        : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'}
                                `}
                            >
                                <span className={`text-[9px] font-bold mb-1 opacity-60`}>
                                    {isToday ? '今天' : format(date, 'EEE', { locale: zhTW })}
                                </span>
                                <span className="text-base font-black tracking-tight">{format(date, 'dd')}</span>
                                <span className="text-[9px] opacity-40">{format(date, 'MM/yy')}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="p-8 border-t border-slate-100 bg-slate-50/50">
                    <div className="text-center mb-4">
                        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mr-2">已選擇</span>
                        <span className="text-lg font-black text-slate-900">{format(tempDate, 'yyyy / MM / dd (EEE)', { locale: zhTW })}</span>
                    </div>
                    <button
                        onClick={() => onConfirm(tempDate)}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-3"
                    >
                        <Check className="w-5 h-5" />
                        確認選取
                    </button>
                </div>
            </div>
        </div>
    );
};
