"use client";

import React, { useEffect, useState } from 'react';
import { CoverAdModel } from './CoverAdModel';
import { SportApi } from '@/services/api';
import { AdDTO } from '@/types';

/**
 * GetAdFetch Component.
 * Logic container that fetches global ads and passes data to UI components.
 */
export const GetAdFetch: React.FC = () => {
    const [ad, setAd] = useState<AdDTO | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchGlobalAds = async () => {
            try {
                const response = await SportApi.getGlobalAds();
                if (response.status === 200 && response.data.bottom_ad?.[0]) {
                    setAd(response.data.bottom_ad[0]);
                }
            } catch (error) {
                console.error('Failed to fetch global ads:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGlobalAds();
    }, []);

    if (isLoading || !ad) return null;

    return <CoverAdModel ad={ad} />;
};
