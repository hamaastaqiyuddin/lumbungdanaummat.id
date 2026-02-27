import React from 'react';
import { Gift } from 'lucide-react';

const FloatingRamadhanIcon = ({ onClick, showRamadhanPopup, activePage }) => {
    if (showRamadhanPopup || activePage === 'admin') return null;

    return (
        <button
            onClick={onClick}
            className="fixed bottom-24 right-4 z-50 w-14 h-14 bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-700 hover:scale-110 transition-all animate-bounce"
            aria-label="Ramadhan Planner"
        >
            <Gift size={24} />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
            </span>
        </button>
    );
};

export default FloatingRamadhanIcon;
