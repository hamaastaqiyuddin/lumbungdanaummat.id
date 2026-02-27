import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import Skeleton from '../common/Skeleton';

const News = ({ t, newsData, navigateTo, loading }) => {
    return (
        <section id="section-2" className="py-24 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-black mb-4 text-slate-900 dark:text-white">
                        {t.news?.title || "Berita"}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400">
                        {t.news?.subtitle || "Kabar terbaru kami."}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {loading || !newsData || newsData.length === 0 ? (
                        [...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white dark:bg-slate-950 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col p-6 space-y-4">
                                <Skeleton className="h-48 w-full" />
                                <Skeleton className="h-4 w-1/3" />
                                <Skeleton className="h-8 w-full" />
                                <Skeleton className="h-16 w-full" />
                            </div>
                        ))
                    ) : (
                        newsData.map((item) => (
                            <div key={item.id} className="bg-white dark:bg-slate-950 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-slate-100 dark:border-slate-800 flex flex-col">
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                                        News
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="text-xs font-bold text-green-600 dark:text-green-400 mb-3 flex items-center gap-2">
                                        <Calendar size={14} />
                                        {item.date}
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-green-600 transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 line-clamp-2">
                                        {item.snippet}
                                    </p>
                                    <a
                                        href="#"
                                        onClick={(e) => { e.preventDefault(); navigateTo('news-detail', item.id); }}
                                        className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white hover:text-green-600 transition-colors mt-auto"
                                    >
                                        {t.news?.readMore || "Baca Selengkapnya"} <ArrowRight size={16} />
                                    </a>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default News;
