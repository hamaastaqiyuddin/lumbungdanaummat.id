import React from 'react';
import { X, Wallet } from 'lucide-react';

const MobileMenu = ({ isMenuOpen, setIsMenuOpen, t, navigateTo }) => {
    if (!isMenuOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] bg-white dark:bg-slate-950 p-8 flex flex-col justify-center animate-in fade-in zoom-in duration-200">
            <button
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-8 right-8 p-2 bg-slate-100 dark:bg-slate-900 rounded-full"
            >
                <X size={24} />
            </button>
            <div className="space-y-4 text-center">
                {t.nav.map((item, i) => (
                    <a
                        key={i}
                        href="#"
                        onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); navigateTo('home'); }}
                        className="block text-2xl font-black text-slate-900 dark:text-white hover:text-green-600 transition-colors tracking-tight"
                    >
                        {item}
                    </a>
                ))}
                <a
                    href="#donasi"
                    onClick={() => setIsMenuOpen(false)}
                    className="inline-flex bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full transition-all shadow-md items-center gap-2 text-xl font-bold mt-4"
                >
                    <Wallet size={20} />
                    <span>{t.sedekahBtn}</span>
                </a>
            </div>
        </div>
    );
};

export default MobileMenu;
