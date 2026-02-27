import React from 'react';

const Skeleton = ({ className, circle = false }) => {
    return (
        <div
            className={`
        animate-pulse bg-slate-200 dark:bg-slate-700 
        ${circle ? 'rounded-full' : 'rounded-2xl'} 
        ${className}
      `}
        />
    );
};

export default Skeleton;
