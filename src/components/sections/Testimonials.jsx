import React from 'react';
import { Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const Testimonials = ({ t }) => {
    return (
        <section className="py-24 bg-white dark:bg-slate-950 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-black mb-4">{t.testimonials.title}</h2>
                    <p className="text-slate-500 dark:text-slate-400">{t.testimonials.subtitle}</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[1, 2, 3].map((item, idx) => (
                        <motion.div
                            key={item}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl relative transition-all hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl border border-transparent hover:border-slate-100 dark:hover:border-slate-700"
                        >
                            <Quote className="absolute top-8 right-8 text-slate-200 dark:text-slate-800 w-10 h-10" />
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                                <div>
                                    <div className="font-bold text-slate-900 dark:text-white">Hamba Allah</div>
                                    <div className="text-xs text-slate-500">Donatur Rutin</div>
                                </div>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                "Alhamdulillah sangat transparan laporannya. Saya bisa melihat langsung progres pembangunan
                                masjid di Nganjuk lewat website ini."
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
