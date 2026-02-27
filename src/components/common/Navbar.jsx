import React from 'react';
import { Globe, Wallet, ChevronDown, Moon, Sun, Menu, X } from 'lucide-react';

const Navbar = ({
    t,
    lang,
    setLang,
    activePage,
    navigateTo,
    isDarkMode,
    setIsDarkMode,
    isMenuOpen,
    setIsMenuOpen,
    isRTL,
    languages,
    currentLang,
    showLangMenu,
    setShowLangMenu
}) => {
    return (
        <nav className="bg-white/90 dark:bg-slate-950/90 backdrop-blur-lg border-b dark:border-slate-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <div className="flex items-center gap-3">
                        <img
                            src="/assets/images/favicon.png"
                            alt="Logo Lumbung Dana Ummat"
                            className="w-12 h-12 object-contain filter drop-shadow-md hover:scale-105 transition-transform"
                        />
                        <div className="flex flex-col">
                            <span className="text-xl font-black tracking-tight leading-none">
                                Lumbung <span className="text-green-600">Dana</span> Ummat
                            </span>
                        </div>
                    </div>

                    {/* Desktop & Tablet Menu */}
                    <div className="hidden md:flex items-center space-x-3 lg:space-x-8 text-[10px] lg:text-sm font-bold">
                        {t.nav.map((item, idx) => (
                            <a
                                key={idx}
                                href={`#section-${idx}`}
                                onClick={(e) => { if (activePage !== 'home') { e.preventDefault(); navigateTo('home'); } }}
                                className="hover:text-green-600 dark:hover:text-green-400 transition-colors whitespace-nowrap"
                            >
                                {item}
                            </a>
                        ))}

                        <a
                            href="#donasi"
                            className="ml-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full transition-all shadow-md shadow-green-500/20 flex items-center gap-2"
                        >
                            <Wallet size={16} />
                            <span>{t.sedekahBtn}</span>
                        </a>

                        <div className={`flex items-center gap-2 lg:gap-3 ${isRTL ? 'border-r pr-3 lg:pr-6 mr-3 lg:mr-6' : 'border-l pl-3 lg:pl-6 ml-3 lg:ml-6'} dark:border-slate-800`}>
                            <div className="relative">
                                <button
                                    onClick={() => setShowLangMenu(!showLangMenu)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all font-bold text-xs"
                                >
                                    <Globe size={16} className="text-slate-500" />
                                    <span>{currentLang.code.toUpperCase()}</span>
                                    <ChevronDown size={14} />
                                </button>

                                {showLangMenu && (
                                    <div className={`absolute top-full mt-2 ${isRTL ? 'left-0' : 'right-0'} bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-xl shadow-xl overflow-hidden min-w-[160px] z-50`}>
                                        {languages.map((l) => (
                                            <button
                                                key={l.code}
                                                onClick={() => { setLang(l.code); setShowLangMenu(false); }}
                                                className="w-full text-left px-4 py-3 text-xs font-bold hover:bg-green-50 dark:hover:bg-slate-800 flex items-center gap-3"
                                            >
                                                <span className="text-lg">{l.flag}</span>
                                                {l.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => setIsDarkMode(!isDarkMode)}
                                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                            >
                                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-2">
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className="p-2 text-slate-600 dark:text-slate-300"
                        >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button
                            onClick={() => {
                                const nextIndex = (languages.findIndex(l => l.code === lang) + 1) % languages.length;
                                setLang(languages[nextIndex].code);
                            }}
                            className="p-2 text-sm font-bold bg-slate-100 dark:bg-slate-800 rounded-lg"
                        >
                            {currentLang.code.toUpperCase()}
                        </button>

                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
