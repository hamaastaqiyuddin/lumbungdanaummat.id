import React from 'react';
import { X, Moon, Gift } from 'lucide-react';

const RamadhanPlannerPopup = ({ showRamadhanPopup, setShowRamadhanPopup, navigateTo }) => {
    if (!showRamadhanPopup) return null;

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-500">
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden max-w-sm w-full relative animate-in zoom-in-95 duration-300 border border-slate-200 dark:border-slate-800">
                {/* Close Button */}
                <button
                    onClick={() => { setShowRamadhanPopup(false); sessionStorage.setItem('hasSeenRamadhanPopup', 'true'); }}
                    className="absolute top-4 right-4 z-20 p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                    <X size={20} className="text-slate-500" />
                </button>

                <div className="flex flex-col">
                    {/* Header Image */}
                    <div className="relative h-48 bg-green-600 flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581467655410-0c218a3b37d6?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
                        <div className="relative z-10 text-center p-6 text-white">
                            <h3 className="text-yellow-300 font-bold mb-2 uppercase tracking-widest text-xs">Marhaban Ya Ramadhan</h3>
                            <h2 className="text-3xl font-black mb-1">Ramadhan Planner</h2>
                            <p className="text-green-100 text-sm">Siapkan ibadah terbaikmu di bulan suci.</p>
                        </div>
                        <Moon className="absolute -bottom-8 -left-8 text-white/10 w-32 h-32 rotate-12" />
                    </div>
                    <div className="p-8 text-center space-y-6">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto text-green-600 dark:text-green-400 mb-4 animate-bounce">
                            <Gift size={32} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Gratis untuk Anda!</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                                Dapatkan panduan ibadah harian, tracker amalan, dan target khatam Qur'an dalam satu planner digital yang cantik.
                            </p>
                        </div>
                        <button
                            onClick={() => navigateTo('planner')}
                            className="w-full py-4 rounded-xl bg-green-600 text-white font-bold text-lg hover:bg-green-700 hover:shadow-lg hover:shadow-green-500/30 transition-all active:scale-95"
                        >
                            Mau Dong
                        </button>
                        <button
                            onClick={() => { setShowRamadhanPopup(false); sessionStorage.setItem('hasSeenRamadhanPopup', 'true'); }}
                            className="text-slate-400 text-sm hover:text-slate-600 dark:hover:text-slate-300 font-medium"
                        >
                            Nanti saja
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RamadhanPlannerPopup;
