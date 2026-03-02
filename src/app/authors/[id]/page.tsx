import React from 'react';
import { notFound } from 'next/navigation';
import { SportApi } from '@/services/api';
import { AuthorPublicProfileContent } from '@/components/profile/AuthorPublicProfileContent';

export const dynamicParams = false;

export async function generateStaticParams() {
    // We fetch authors to generate all possible paths
    const res = await SportApi.getAuthorsGroupData(1, 100, 'all');
    if (res.status === 200 && res.data.data) {
        return res.data.data.map((item) => ({
            id: item.author.id,
        }));
    }
    return [];
}

interface AuthorPageProps {
    params: Promise<{ id: string }>;
}

export default async function AuthorPublicProfilePage({ params }: AuthorPageProps) {
    const { id: authorId } = await params;

    // Fetch author data on the server
    const res = await SportApi.getAuthorsGroupData(1, 100, 'all');
    let authorData = null;

    if (res.status === 200) {
        authorData = res.data.data.find(a => a.author.id === authorId) || null;
    }

    if (!authorData) {
        return notFound();
    }

    return <AuthorPublicProfileContent authorData={authorData} />;
}
