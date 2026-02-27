import React from 'react';
import { Image as ImageIcon, Maximize2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Gallery = ({ t }) => {
    const galleryImages = [
        { url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop', title: 'Penyaluran Sembako' },
        { url: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=800&auto=format&fit=crop', title: 'Bantuan Pendidikan' },
        { url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800&auto=format&fit=crop', title: 'Pembangunan Sekolah' },
        { url: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=800&auto=format&fit=crop', title: 'Kesehatan Masyarakat' },
        { url: 'https://images.unsplash.com/photo-1541944743827-e04bb645f946?q=80&w=800&auto=format&fit=crop', title: 'Program Ramadhan' },
        { url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop', title: 'Pemberdayaan UMKM' }
    ];

    return (
        <section id="section-3" className="py-24 bg-slate-50 dark:bg-slate-900 overflow-hidden transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-black uppercase tracking-widest mb-4">
                        <ImageIcon size={14} /> {t.gallery?.badge || 'Galeri Kegiatan'}
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">
                        {t.gallery?.title || 'Jejak Kebaikan Anda'}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
                        {t.gallery?.subtitle || 'Dokumentasi kegiatan dan penyaluran donasi dari para donatur Lumbung Dana Ummat.'}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {galleryImages.map((img, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="group relative rounded-[2rem] overflow-hidden aspect-[4/3] bg-slate-200 dark:bg-slate-800 shadow-xl hover:shadow-2xl transition-all duration-500"
                        >
                            <img
                                src={img.url}
                                alt={img.title}
                                loading="lazy"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8 text-white">
                                <Maximize2 className="absolute top-6 right-6 text-white/50 group-hover:text-white transition-colors" size={20} />
                                <h4 className="text-xl font-bold translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    {img.title}
                                </h4>
                                <p className="text-sm text-white/70 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                                    {t.gallery?.readMore || 'Lihat Detail'}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-10 py-5 rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl transition-all border border-slate-200 dark:border-slate-700"
                    >
                        {t.gallery?.viewAll || 'Lihat Galeri Lengkap'}
                    </motion.button>
                </div>
            </div>
        </section>
    );
};

export default Gallery;
