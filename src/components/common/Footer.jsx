import React from 'react';
import { Globe, Mail, Check, Phone } from 'lucide-react';

const Footer = ({ t }) => {
    return (
        <footer className="bg-white dark:bg-slate-950 pt-24 pb-12 border-t border-slate-200 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
                <div className="md:col-span-1 lg:col-span-2">
                    <div className="flex items-center gap-3 mb-6">
                        <img
                            src="/assets/images/favicon.png"
                            alt="Logo Lumbung Dana Ummat"
                            className="w-12 h-12 object-contain filter drop-shadow-md hover:scale-105 transition-transform"
                        />
                        <div className="flex flex-col">
                            <span className="text-xl font-black tracking-tight leading-none dark:text-white">
                                Lumbung <span className="text-green-600">Dana</span> Ummat
                            </span>
                        </div>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8">
                        {t.footer.desc}
                    </p>

                    {/* Maps Preview */}
                    <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 h-48 w-full shadow-sm hover:shadow-md transition-shadow">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3758.998957418972!2d112.05852637476407!3d-7.610530092404623!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7847270cc24c9f%3A0xcbc5095681121fea!2sLumbung%20Dana%20Ummat!5e1!3m2!1sid!2sid!4v1771513368637!5m2!1sid!2sid"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Lumbung Dana Ummat Location"
                        />
                    </div>
                </div>

                <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase text-sm tracking-widest">{t.footer.address}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6 font-medium">
                        {t.footer.addressText}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-green-600 dark:text-green-400 font-bold bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800 w-fit">
                        <Phone size={18} />
                        <span>{t.footer.contact}</span>
                    </div>
                </div>

                <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase text-sm tracking-widest">{t.footer.legal}</h4>
                    <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
                        <li className="flex items-center gap-2">
                            <Check size={14} className="text-green-500" /> SK Kemenkumham
                        </li>
                        <li className="flex items-center gap-2">
                            <Check size={14} className="text-green-500" /> Izin LAZ Kabupaten
                        </li>
                        <li className="flex items-center gap-2">
                            <Check size={14} className="text-green-500" /> Rekomendasi Baznas
                        </li>
                        <li className="flex items-center gap-2">
                            <Check size={14} className="text-green-500" /> Audit Syariah Berkala
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase text-sm tracking-widest">Social Media</h4>
                    <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-green-600 hover:text-white transition-all transform hover:scale-110 cursor-pointer shadow-sm">
                            <Globe size={20} />
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-green-600 hover:text-white transition-all transform hover:scale-110 cursor-pointer shadow-sm">
                            <Mail size={20} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="border-t border-slate-100 dark:border-slate-900 pt-8 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                © 2026 lumbungdanaummat.id. {t.footer.rights}
            </div>
        </footer>
    );
};

export default Footer;
