import React, { useState } from 'react';
import { Gift, ArrowRight } from 'lucide-react';

const RamadhanPlanner = ({ t, navigateTo }) => {
    const [ramadhanForm, setRamadhanForm] = useState({ name: '', wa: '', email: '', infaq: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleRamadhanSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        // In real app, redirect to download or sheet
        window.open('https://docs.google.com/spreadsheets/d/1_YOUR_SHEET_ID/export?format=pdf', '_blank');
    };

    return (
        <div className="pt-32 pb-24 min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="max-w-2xl mx-auto px-4">
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-green-100 dark:border-green-900/30">
                    {/* Header Image */}
                    <div className="relative h-48 bg-green-600 flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
                        <div className="relative z-10 text-center p-6 text-white">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                                <Gift className="text-white" size={24} />
                            </div>
                            <h2 className="text-3xl font-black mb-1">Ramadhan Planner</h2>
                            <p className="text-green-100 text-sm">Download panduan ibadah eksklusif Anda</p>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="mb-8 text-center bg-green-50 dark:bg-green-900/20 p-4 rounded-2xl border border-green-100 dark:border-green-800">
                            <p className="text-green-800 dark:text-green-200 font-serif italic text-sm leading-relaxed">
                                "“Ya Allah, semoga Ramadhan ini Engkau jadikan lebih baik dari sebelumnya, dan dengan ikhtiar kecil melalui Ramadhan Planner ini, Engkau mudahkan kami dalam menjaga tilawah, doa, dan amal shalih.”"
                            </p>
                        </div>

                        <form onSubmit={handleRamadhanSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Nama Lengkap</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500 dark:text-white transition-all hover:border-green-300"
                                    placeholder="Nama Anda"
                                    value={ramadhanForm.name}
                                    onChange={(e) => setRamadhanForm({ ...ramadhanForm, name: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">WhatsApp <span className="text-red-500">*</span></label>
                                    <input
                                        required
                                        type="tel"
                                        className="w-full px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500 dark:text-white transition-all hover:border-green-300"
                                        placeholder="08xxx"
                                        value={ramadhanForm.wa}
                                        onChange={(e) => setRamadhanForm({ ...ramadhanForm, wa: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Email <span className="text-slate-400 font-normal text-xs">(Opsional)</span></label>
                                    <input
                                        type="email"
                                        className="w-full px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500 dark:text-white transition-all hover:border-green-300"
                                        placeholder="email@example.com"
                                        value={ramadhanForm.email}
                                        onChange={(e) => setRamadhanForm({ ...ramadhanForm, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-3 flex justify-between items-center">
                                    <span>Sedekah Opsional (Rp)</span>
                                    <span className="text-[10px] font-bold bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 py-1 px-2 rounded-lg">InsyaAllah Pahala Berlipat</span>
                                </label>

                                <div className="grid grid-cols-4 gap-2 mb-3">
                                    {[10000, 50000, 100000, 200000].map((amount) => (
                                        <button
                                            key={amount}
                                            type="button"
                                            onClick={() => setRamadhanForm({ ...ramadhanForm, infaq: amount })}
                                            className={`py-2 px-1 rounded-lg text-xs font-bold border transition-all ${parseInt(ramadhanForm.infaq) === amount
                                                ? 'bg-green-600 text-white border-green-600 shadow-md'
                                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-green-400 hover:text-green-600'
                                                }`}
                                        >
                                            {amount / 1000}k
                                        </button>
                                    ))}
                                </div>

                                <div className="relative group">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold group-focus-within:text-green-500 transition-colors">Rp</span>
                                    <input
                                        type="number"
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500 dark:text-white transition-all hover:border-green-300"
                                        placeholder="0"
                                        value={ramadhanForm.infaq}
                                        onChange={(e) => setRamadhanForm({ ...ramadhanForm, infaq: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-4 rounded-xl bg-green-600 text-white font-bold text-lg hover:bg-green-700 hover:shadow-xl hover:shadow-green-600/20 transition-all active:scale-95 flex items-center justify-center gap-2 group ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? (
                                    <span>Menyimpan Data...</span>
                                ) : (
                                    <>
                                        <span>Download Ramadhan Planner Sekarang</span>
                                        <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RamadhanPlanner;
