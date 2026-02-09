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

interface CardProps {
    children: React.ReactNode;
    className?: string;
    isGlass?: boolean;
}

/**
 * Modular Card component for consistent layout.
 */
export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    isGlass = true
}) => {
    return (
        <div className={`rounded-xl p-6 ${isGlass ? 'glass glass-hover' : 'bg-brand-surface'} ${className}`}>
            {children}
        </div>
    );
};
