import React from 'react';
import { Award } from 'lucide-react';
import { motion } from 'framer-motion';

const Trust = ({ t }) => {
    return (
        <section className="bg-slate-50 dark:bg-slate-900 py-16">
            <div className="max-w-7xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white dark:bg-slate-950 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md"
                >
                    <div>
                        <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                            <Award className="text-orange-500" /> {t.trust.legalTitle}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">{t.trust.license1}</p>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{t.trust.license2}</p>
                    </div>
                    <div className="flex gap-4 justify-start md:justify-end">
                        <div className="px-6 py-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800">
                            <span className="block text-xs text-green-600 dark:text-green-400 font-bold uppercase">Status</span>
                            <span className="font-black text-slate-900 dark:text-white">Active & Verified</span>
                        </div>
                        <div className="px-6 py-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                            <span className="block text-xs text-blue-600 dark:text-blue-400 font-bold uppercase">Area</span>
                            <span className="font-black text-slate-900 dark:text-white flex items-center gap-2">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/9/9f/Flag_of_Indonesia.svg"
                                    alt="Bendera Indonesia"
                                    loading="lazy"
                                    className="w-5 h-auto rounded shadow-sm border border-black/10"
                                />
                                Indonesia
                            </span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Trust;
