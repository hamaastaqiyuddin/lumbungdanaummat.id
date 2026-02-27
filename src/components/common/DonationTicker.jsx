import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { formatCurrency } from '../../utils/helpers';

const DonationTicker = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [donations, setDonations] = useState([]);

    const fetchRecentDonations = async () => {
        if (!isSupabaseConfigured) return;
        try {
            const { data, error } = await supabase
                .from('donations')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(10);

            if (error) throw error;
            if (data && data.length > 0) {
                setDonations(data);
                setIsVisible(true);
            }
        } catch (err) {
            console.error('Error fetching ticker donations:', err);
        }
    };

    useEffect(() => {
        fetchRecentDonations();
        const pollInterval = setInterval(fetchRecentDonations, 60000);
        return () => clearInterval(pollInterval);
    }, []);

    useEffect(() => {
        if (donations.length === 0) return;

        const cycleInterval = setInterval(() => {
            setIsVisible(false);
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % donations.length);
                setIsVisible(true);
            }, 600);
        }, 9000);

        return () => clearInterval(cycleInterval);
    }, [donations]);

    if (donations.length === 0) return null;

    const current = donations[currentIndex];

    return (
        <div className="fixed bottom-6 left-6 z-[100] hidden md:block">
            <AnimatePresence mode="wait">
                {isVisible && (
                    <motion.div
                        key={`${currentIndex}-${current.id}`}
                        initial={{ opacity: 0, x: -60, scale: 0.9, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, x: -20, scale: 0.95, filter: 'blur(10px)' }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                        className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-5 max-w-sm"
                    >
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-500/20 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-400 shrink-0 shadow-inner transition-colors">
                            <Heart size={24} fill="currentColor" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1">Donasi Terbaru</div>
                            <div className="text-base font-black text-slate-900 dark:text-white truncate">
                                {current.donor_name || "Hamba Allah"}
                            </div>
                            <div className="text-sm text-green-600 dark:text-green-400 font-bold mb-1.5 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-green-600 dark:bg-green-400 rounded-full animate-pulse" />
                                {formatCurrency(current.amount)}
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate italic bg-slate-100 dark:bg-slate-800/50 px-2.5 py-1.5 rounded-xl inline-block max-w-full">
                                "{current.program_title || "Program LDU"}"
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DonationTicker;
