import React, { useEffect } from 'react';
import { ArrowRight, Heart, ShieldCheck } from 'lucide-react';

const ProjectDetail = ({ programsData, selectedItem, formatCurrency, t, lang, navigateTo }) => {
    const project = programsData.flatMap(p => p.projects).find(p => p.id === selectedItem);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!project) {
        return (
            <div className="pt-40 pb-20 text-center">
                <h2 className="text-2xl font-bold">Project not found</h2>
                <button onClick={() => navigateTo('home')} className="text-green-600 mt-4 font-bold">Back to Home</button>
            </div>
        );
    }

    const progress = Math.min(100, Math.round((project.collected / project.target) * 100));

    return (
        <section className="py-32 bg-white dark:bg-slate-950 animate-in slide-in-from-bottom-4 duration-500 min-h-screen">
            <div className="max-w-6xl mx-auto px-4">
                <button
                    onClick={() => navigateTo('home')}
                    className="flex items-center gap-2 text-slate-500 hover:text-green-600 font-bold mb-8 transition-colors"
                >
                    <ArrowRight className="rotate-180" size={18} /> {lang === 'id' ? 'Kembali' : 'Back'}
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2">
                        <div className="rounded-[2.5rem] overflow-hidden shadow-2xl mb-10 h-[300px] md:h-[500px]">
                            <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-6">
                            {project.title}
                        </h1>
                        <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                                {project.desc || "No description available."}
                            </p>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="sticky top-32 bg-slate-50 dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
                            <div className="mb-8">
                                <div className="flex justify-between text-sm font-bold mb-3">
                                    <span className="text-green-600 dark:text-green-400">{progress}% {t.programsSection.collected}</span>
                                    <span className="text-slate-400">{project.daysLeft} {t.programsSection.remaining}</span>
                                </div>
                                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-6">
                                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${progress}%` }}></div>
                                </div>
                                <div className="space-y-4">
                                    <div className="text-slate-900 dark:text-white">
                                        <div className="text-xs text-slate-400 uppercase font-bold mb-1">{t.programsSection.collected}</div>
                                        <div className="text-2xl font-black">{formatCurrency(project.collected)}</div>
                                    </div>
                                    <div className="text-slate-600 dark:text-slate-400">
                                        <div className="text-xs text-slate-400 uppercase font-bold mb-1">{t.programsSection.target}</div>
                                        <div className="text-xl font-bold">{formatCurrency(project.target)}</div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => navigateTo('donation-form')}
                                className="w-full py-5 rounded-2xl bg-green-600 text-white font-black text-xl hover:bg-green-700 hover:shadow-2xl hover:shadow-green-500/30 transition-all flex items-center justify-center gap-3 active:scale-95 mb-6"
                            >
                                <Heart size={24} fill="currentColor" /> {t.hero.btn1}
                            </button>

                            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                                <ShieldCheck className="text-green-500" size={20} />
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Donasi Anda Aman & Terverifikasi</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProjectDetail;
