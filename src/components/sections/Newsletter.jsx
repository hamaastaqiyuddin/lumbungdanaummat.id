import React from 'react';
import { Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const Newsletter = ({ t }) => {
    return (
        <section id="newsletter" className="py-24 px-4 overflow-hidden">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-5xl mx-auto bg-slate-900 dark:bg-slate-800 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl"
            >
                <div className="relative z-10">
                    <Mail className="w-12 h-12 text-green-400 mx-auto mb-6" />
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
                        {t.newsletter.title}
                    </h2>
                    <p className="text-slate-400 mb-10 max-w-lg mx-auto">
                        {t.newsletter.subtitle}
                    </p>

                    <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
                        <input
                            type="email"
                            placeholder={t.newsletter.placeholderEmail}
                            className="flex-grow px-6 py-4 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-green-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-500 transition-colors flex items-center justify-center gap-2"
                        >
                            {t.newsletter.button}
                        </motion.button>
                    </form>
                </div>
            </motion.div>
        </section>
    );
};

export default Newsletter;
