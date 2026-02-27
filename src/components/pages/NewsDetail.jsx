import React, { useEffect } from 'react';
import { ArrowRight, Calendar, Heart } from 'lucide-react';

const NewsDetail = ({ newsData, selectedItem, lang, navigateTo }) => {
    const item = newsData.find(n => n.id === selectedItem || n.slug === selectedItem);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!item) {
        return (
            <div className="pt-40 pb-20 text-center">
                <h2 className="text-2xl font-bold">News not found</h2>
                <button onClick={() => navigateTo('home')} className="text-green-600 mt-4 font-bold">Back to Home</button>
            </div>
        );
    }

    return (
        <section className="py-32 bg-white dark:bg-slate-950 animate-in slide-in-from-bottom-4 duration-500 min-h-screen">
            <div className="max-w-4xl mx-auto px-4">
                <button
                    onClick={() => navigateTo('home')}
                    className="flex items-center gap-2 text-slate-500 hover:text-green-600 font-bold mb-8 transition-colors"
                >
                    <ArrowRight className="rotate-180" size={18} /> {lang === 'id' ? 'Kembali' : 'Back'}
                </button>

                <article>
                    <div className="rounded-[2.5rem] overflow-hidden shadow-2xl mb-10 h-[300px] md:h-[500px]">
                        {item.mediaType === 'video' ? (
                            <video src={item.image} controls className="w-full h-full object-cover" />
                        ) : (
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        )}
                    </div>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                            <Calendar size={16} />
                            {item.date}
                        </div>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-8 leading-tight">
                        {item.title}
                    </h1>
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line mb-10">
                            {item.content}
                        </p>
                    </div>

                    {item.ctaProjectId && (
                        <div className="mt-12 p-8 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 text-center animate-in zoom-in duration-500">
                            <h4 className="text-lg font-bold mb-4">Mari Berkontribusi Sekarang</h4>
                            <button
                                onClick={() => navigateTo('project-detail', item.ctaProjectId)}
                                className="inline-flex items-center gap-3 bg-green-600 text-white px-10 py-5 rounded-2xl font-black text-xl hover:bg-green-700 hover:shadow-2xl hover:shadow-green-500/30 transition-all active:scale-95 group"
                            >
                                <Heart size={24} fill="currentColor" className="group-hover:scale-110 transition-transform" />
                                {item.ctaText || 'Bantu Sekarang'}
                            </button>
                        </div>
                    )}
                </article>
            </div>
        </section>
    );
};

export default NewsDetail;
