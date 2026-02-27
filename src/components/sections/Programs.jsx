import React from 'react';
import { ArrowRight } from 'lucide-react';
import Skeleton from '../common/Skeleton';

const Programs = ({ t, programsData, loading }) => {
    return (
        <section className="py-24 bg-slate-50 dark:bg-slate-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight dark:text-white">
                        {t.programsSection.title}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto font-medium">
                        {t.programsSection.subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {loading || !programsData || programsData.length === 0 ? (
                        [...Array(4)].map((_, i) => (
                            <Skeleton key={i} className="h-80" />
                        ))
                    ) : (
                        programsData.map((prog) => (
                            <div key={prog.id} className="group relative overflow-hidden rounded-3xl h-80 shadow-lg cursor-pointer">
                                <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/30 transition-colors z-10" />
                                <img
                                    src={prog.image}
                                    alt={prog.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute bottom-0 left-0 right-0 p-6 z-20 bg-gradient-to-t from-black/80 to-transparent">
                                    <h3 className="text-white font-bold text-xl mb-2">{prog.title}</h3>
                                    <p className="text-slate-200 text-sm opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 duration-300">
                                        {prog.desc}
                                    </p>
                                    <div className="mt-4 flex items-center gap-2 text-green-400 text-sm font-bold opacity-0 group-hover:opacity-100 transition-all delay-100 translate-y-4 group-hover:translate-y-0">
                                        Lihat detail <ArrowRight size={16} />
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default Programs;
