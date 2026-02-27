import React from 'react';

const Impact = ({ t, isDarkMode }) => {
    return (
        <>
            {/* Wide Impact Section */}
            <section className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center gap-12 mb-20">
                        <div className="w-full md:w-5/12">
                            <span className="text-orange-500 font-bold tracking-widest uppercase text-xs md:text-sm mb-4 block">
                                {t.impactSection.tagline}
                            </span>
                            <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
                                {t.impactSection.title}
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl leading-relaxed">
                                {t.impactSection.subtitle}
                            </p>
                        </div>
                        <div className="w-full md:w-7/12 relative">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Indonesia_blank_map.svg/2000px-Indonesia_blank_map.svg.png"
                                alt="Peta Sebaran LDU"
                                className="w-full h-auto object-contain opacity-80 dark:opacity-60"
                                style={{ filter: isDarkMode ? 'invert(1) sepia(1) saturate(0) brightness(1.2)' : 'sepia(1) saturate(2) hue-rotate(-10deg)' }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats - MERGED */}
            <section className="max-w-7xl mx-auto px-4 -mt-20 mb-24 relative z-10">
                <div className="bg-slate-900 dark:bg-black text-white rounded-[2.5rem] p-12 shadow-2xl flex flex-wrap justify-around items-start gap-12">
                    {t.impactSection.stats.map((stat, i) => (
                        <div key={i} className="text-center group flex flex-col items-center">
                            <div className="text-4xl lg:text-5xl font-black mb-2 tracking-tighter text-green-400">
                                {stat.value}
                            </div>
                            <div className="text-slate-400 text-[10px] lg:text-xs uppercase tracking-[0.2em] font-bold mb-2">
                                {stat.label}
                            </div>
                            <p className="hidden md:block text-[10px] text-slate-500 max-w-[150px] leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                {stat.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
};

export default Impact;
