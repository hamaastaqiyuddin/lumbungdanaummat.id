import React from 'react';
import { Target, Handshake, Rocket, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const VisiMisi = ({ t }) => {
    return (
        <section id="section-1" className="py-20 bg-emerald-50 dark:bg-slate-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-sm font-bold text-green-600 dark:text-green-400 uppercase tracking-widest mb-2">
                        {t.visimisi.title}
                    </h2>
                    <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">
                        {t.visimisi.visiTitle}
                    </h3>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Visi Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl border-l-8 border-green-600 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 dark:bg-green-900/20 rounded-bl-[100%] transition-transform group-hover:scale-110"></div>
                        <Target className="w-12 h-12 text-green-600 mb-6 relative z-10" />
                        <p className="text-xl md:text-2xl font-serif italic text-slate-700 dark:text-slate-200 leading-relaxed relative z-10">
                            {t.visimisi.visiText}
                        </p>
                    </motion.div>

                    {/* Misi List */}
                    <div className="space-y-6">
                        {t.visimisi.misi.map((m, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="flex gap-4"
                            >
                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-green-600 shadow-md border border-green-100 dark:border-green-900 font-bold">
                                    {idx === 0 ? <Handshake size={20} /> : idx === 1 ? <Rocket size={20} /> : <Users size={20} />}
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{m.title}</h4>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{m.text}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VisiMisi;
