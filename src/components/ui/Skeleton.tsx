import React from 'react';

interface SkeletonProps {
    className?: string;
}

/**
 * Skeleton component for loading states.
 * Uses the .skeleton class defined in globals.css.
 */
export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
    return <div className={`skeleton ${className}`} />;
};
