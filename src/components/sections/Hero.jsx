import React from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = ({ t, heroImages, heroImageIndex }) => {
    return (
        <header id="section-0" className="relative pt-16 pb-24 md:pt-32 md:pb-40 text-center overflow-hidden">
            {/* Background Slideshow */}
            <div className="absolute inset-0 w-full h-full z-0">
                {heroImages.map((img, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ease-in-out ${index === heroImageIndex ? 'opacity-100' : 'opacity-0'}`}
                        style={{ backgroundImage: `url(${img})` }}
                    />
                ))}
                {/* Overlay */}
                <div className="absolute inset-0 bg-white/85 dark:bg-slate-950/85 backdrop-blur-[1px]"></div>
            </div>

            <div className="max-w-5xl mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 text-green-700 dark:text-green-400 text-xs font-bold tracking-wider uppercase shadow-sm bg-white/80 dark:bg-black/50 backdrop-blur-md">
                        <ShieldCheck size={14} />
                        {t.hero.badge}
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-8 leading-tight tracking-tight drop-shadow-sm">
                        {t.hero.title} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-400">
                            {t.hero.subtitle}
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
                        {t.hero.desc}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <motion.a
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            href="#donasi"
                            className="w-full sm:w-auto bg-green-600 text-white px-10 py-5 rounded-2xl font-black text-xl hover:bg-green-700 hover:shadow-2xl hover:shadow-green-500/30 transition-all flex items-center justify-center gap-3 group"
                        >
                            {t.hero.btn1}
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </motion.a>
                        <motion.a
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            href="#newsletter"
                            className="w-full sm:w-auto bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-10 py-5 rounded-2xl font-black text-xl border-2 border-slate-100 dark:border-slate-800 hover:border-green-600 dark:hover:border-green-600 transition-all flex items-center justify-center"
                        >
                            {t.hero.btn2}
                        </motion.a>
                    </div>
                </motion.div>
            </div>
        </header>
    );
};

export default Hero;
