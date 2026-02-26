"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { SportApi } from '@/services/api';

interface AuthContextType {
    user: User | null;
    isLoggedIn: boolean;
    isAuthModalOpen: boolean;
    setIsAuthModalOpen: (isOpen: boolean) => void;
    login: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
    register: (username: string, password: string, email: string, gender: any) => Promise<{ success: boolean; message: string }>;
    logout: () => void;
    updateUser: (data: Partial<User>) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    // Initial check for logged in user
    useEffect(() => {
        const currentUser = SportApi.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
        }
    }, []);

    const login = async (username: string, password: string) => {
        const res = await SportApi.login(username, password);
        if (res.status === 200) {
            setUser(res.data);
            return { success: true, message: res.message || '登入成功' };
        }
        return { success: false, message: res.message || '登入失敗' };
    };

    const register = async (username: string, password: string, email: string, gender: any) => {
        const res = await SportApi.register({ username, password, email, gender });
        if (res.status === 200) {
            setUser(res.data);
            return { success: true, message: res.message || '註冊成功' };
        }
        return { success: false, message: res.message || '註冊失敗' };
    };

    const logout = () => {
        SportApi.logout();
        setUser(null);
    };

    const updateUser = async (data: Partial<User>) => {
        if (!user) return { success: false, message: '未登入' };
        const res = await SportApi.updateProfile(user.id, data);
        if (res.status === 200) {
            setUser(res.data);
            return { success: true, message: res.message || '更新成功' };
        }
        return { success: false, message: res.message || '更新失敗' };
    };

    return (
        <AuthContext.Provider value={{
            user,
            isLoggedIn: !!user,
            isAuthModalOpen,
            setIsAuthModalOpen,
            login,
            register,
            logout,
            updateUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
