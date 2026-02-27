import React from 'react';
import { Wallet } from 'lucide-react';
import Skeleton from '../common/Skeleton';

const Projects = ({ t, programsData, formatCurrency, navigateTo, loading }) => {
    const allProjects = programsData?.flatMap(prog => prog.projects) || [];

    return (
        <section id="donasi" className="py-24 bg-white dark:bg-slate-950">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider mb-4">
                        {t.programsSection.projectTitle}
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">
                        {t.programsSection.projectSubtitle}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading || !programsData || allProjects.length === 0 ? (
                        [...Array(3)].map((_, i) => (
                            <div key={i} className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 space-y-4">
                                <Skeleton className="h-48 w-full" />
                                <Skeleton className="h-6 w-3/4" />
                                <div className="space-y-2">
                                    <Skeleton className="h-2 w-full" />
                                    <div className="flex justify-between">
                                        <Skeleton className="h-4 w-1/4" />
                                        <Skeleton className="h-4 w-1/4" />
                                    </div>
                                </div>
                                <Skeleton className="h-12 w-full" />
                            </div>
                        ))
                    ) : (
                        allProjects.map((project) => {
                            const progress = Math.min(100, Math.round((project.collected / project.target) * 100));
                            return (
                                <div key={project.id} className="bg-slate-50 dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all duration-300 flex flex-col">
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-900 dark:text-white shadow-sm">
                                            Project
                                        </div>
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col">
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 line-clamp-2">
                                            {project.title}
                                        </h3>

                                        <div className="mt-auto">
                                            <div className="flex justify-between text-xs font-bold mb-2">
                                                <span className="text-green-600 dark:text-green-400">{progress}%</span>
                                                <span className="text-slate-400">{project.daysLeft} {t.programsSection.remaining}</span>
                                            </div>
                                            <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-4">
                                                <div className="h-full bg-green-500 rounded-full" style={{ width: `${progress}%` }}></div>
                                            </div>

                                            <div className="flex justify-between items-end mb-6">
                                                <div>
                                                    <div className="text-[10px] text-slate-400 uppercase font-bold">{t.programsSection.collected}</div>
                                                    <div className="text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(project.collected)}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-[10px] text-slate-400 uppercase font-bold">{t.programsSection.target}</div>
                                                    <div className="text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(project.target)}</div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => navigateTo('project-detail', project.id)}
                                                className="w-full py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:bg-green-600 dark:hover:bg-green-400 hover:text-white transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Wallet size={16} /> {t.programsSection.btnText}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </section>
    );
};

export default Projects;
