import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Phone, Mail, Heart, UserPlus, Info, Loader2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

const DonationForm = ({ project, navigateTo, setDonationData }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        gender: 'pria',
        waNumber: '',
        email: '',
        amount: '',
        forSomeoneElse: false,
        someoneElseName: '',
        prayer: ''
    });

    const [presetAmounts] = useState([50000, 100000, 250000, 500000, 1000000]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handlePresetClick = (amount) => {
        setFormData(prev => ({ ...prev, amount: amount.toString() }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.fullName || !formData.waNumber || !formData.amount) {
            alert('Mohon lengkapi data wajib (Nama, WA, dan Nominal)');
            return;
        }

        setIsSubmitting(true);

        try {
            const donationPayload = {
                full_name: formData.fullName,
                gender: formData.gender,
                wa_number: formData.waNumber,
                email: formData.email || null,
                amount: parseInt(formData.amount),
                for_someone_else: formData.forSomeoneElse,
                someone_else_name: formData.forSomeoneElse ? formData.someoneElseName : null,
                prayer: formData.prayer || null,
                project_title: project?.title || 'General',
                project_id: project?.id || null,
                status: 'pending'
            };

            // 1. Save to Supabase
            if (isSupabaseConfigured) {
                const { error } = await supabase
                    .from('donations')
                    .insert([donationPayload]);

                if (error) throw error;
            }

            // 2. Integration with Google Sheet (Placeholder for Webhook)
            // You can replace this URL with your Google Apps Script Web App URL
            const GOOGLE_SHEET_WEBHOOK = import.meta.env.VITE_GOOGLE_SHEET_WEBHOOK;
            if (GOOGLE_SHEET_WEBHOOK) {
                await fetch(GOOGLE_SHEET_WEBHOOK, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(donationPayload)
                });
            }

            setDonationData({ ...formData, projectTitle: project?.title });
            navigateTo('checkout');
        } catch (error) {
            console.error('Error saving donation:', error);
            alert('Gagal menyimpan data donasi. Silakan coba lagi.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="pt-32 pb-20 bg-slate-50 dark:bg-slate-950 min-h-screen">
            <div className="max-w-3xl mx-auto px-4">
                <button
                    onClick={() => navigateTo('project-detail')}
                    className="flex items-center gap-2 text-slate-500 hover:text-green-600 font-bold mb-8 transition-colors"
                >
                    <ArrowLeft size={18} /> Kembali ke Proyek
                </button>

                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="bg-green-600 p-8 text-white relative">
                        <div className="relative z-10 text-center">
                            <h2 className="text-3xl font-black mb-2">Form Sedekah</h2>
                            <p className="opacity-90 font-medium">{project?.title}</p>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
                        {/* 1. Nama Lengkap */}
                        <div className="space-y-4">
                            <label className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                <User size={16} /> Data Diri
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                required
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Nama Lengkap Anda"
                                className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-green-500 outline-none transition-all font-bold text-slate-900 dark:text-white"
                            />

                            <div className="flex gap-4">
                                <label className="flex-1 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="pria"
                                        checked={formData.gender === 'pria'}
                                        onChange={handleChange}
                                        className="hidden peer"
                                    />
                                    <div className="py-4 text-center rounded-2xl border-2 border-slate-100 dark:border-slate-800 peer-checked:border-green-500 peer-checked:bg-green-50 dark:peer-checked:bg-green-900/20 peer-checked:text-green-600 font-bold transition-all text-slate-500">
                                        Pria
                                    </div>
                                </label>
                                <label className="flex-1 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="wanita"
                                        checked={formData.gender === 'wanita'}
                                        onChange={handleChange}
                                        className="hidden peer"
                                    />
                                    <div className="py-4 text-center rounded-2xl border-2 border-slate-100 dark:border-slate-800 peer-checked:border-green-500 peer-checked:bg-green-50 dark:peer-checked:bg-green-900/20 peer-checked:text-green-600 font-bold transition-all text-slate-500">
                                        Wanita
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* 2. WA & Email */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 ml-1">
                                    <Phone size={14} /> Nomor WA
                                </label>
                                <input
                                    type="tel"
                                    name="waNumber"
                                    required
                                    value={formData.waNumber}
                                    onChange={handleChange}
                                    placeholder="0812xxxx"
                                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-green-500 outline-none transition-all font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 ml-1">
                                    <Mail size={14} /> Email (Opsional)
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="email@anda.com"
                                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-green-500 outline-none transition-all font-bold"
                                />
                            </div>
                        </div>

                        {/* 3. Nominal */}
                        <div className="space-y-4">
                            <label className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                <Heart size={16} /> Nominal Sedekah
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {presetAmounts.map(amt => (
                                    <button
                                        key={amt}
                                        type="button"
                                        onClick={() => handlePresetClick(amt)}
                                        className={`py-4 rounded-2xl border-2 font-black transition-all ${formData.amount === amt.toString()
                                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-600'
                                            : 'border-slate-100 dark:border-slate-800 text-slate-500 hover:border-green-200'
                                            }`}
                                    >
                                        Rp {amt.toLocaleString('id-ID')}
                                    </button>
                                ))}
                            </div>
                            <div className="relative">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-400">Rp</span>
                                <input
                                    type="number"
                                    name="amount"
                                    required
                                    value={formData.amount}
                                    onChange={handleChange}
                                    placeholder="Nominal Lainnya..."
                                    className="w-full pl-14 pr-6 py-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-green-500 outline-none transition-all font-black text-xl text-green-600"
                                />
                            </div>
                        </div>

                        {/* 4. Atas Nama Orang Lain */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-700">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    name="forSomeoneElse"
                                    checked={formData.forSomeoneElse}
                                    onChange={handleChange}
                                    className="w-5 h-5 rounded border-slate-300 text-green-600 focus:ring-green-500 transition-all cursor-pointer"
                                />
                                <span className="font-bold text-slate-700 dark:text-slate-300 group-hover:text-green-600 flex items-center gap-2">
                                    <UserPlus size={18} /> Sedekah atas nama orang lain?
                                </span>
                            </label>

                            {formData.forSomeoneElse && (
                                <div className="mt-4 animate-in slide-in-from-top-2 duration-300">
                                    <input
                                        type="text"
                                        name="someoneElseName"
                                        value={formData.someoneElseName}
                                        onChange={handleChange}
                                        placeholder="Ketik Nama (Contoh: Almarhum Ayah Saya)"
                                        className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border-none focus:ring-2 focus:ring-green-500 outline-none transition-all font-bold"
                                    />
                                </div>
                            )}
                        </div>

                        {/* 5. Titip Doa */}
                        <div className="space-y-4">
                            <label className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                Titip Doa
                            </label>
                            <textarea
                                name="prayer"
                                value={formData.prayer}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Tulis doa atau harapan Anda di sini. InsyaAllah akan dibacakan oleh santri pengahafal Al Quran / penerima manfaat..."
                                className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-green-500 outline-none transition-all font-medium text-slate-700 dark:text-slate-300 resize-none h-32"
                            />
                            <div className="flex items-start gap-2 text-[10px] text-slate-400 italic">
                                <Info size={12} className="shrink-0 mt-0.5" />
                                Doa Anda akan disampaikan kepada santri penghafal Quran & Penerima Manfaat.
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-6 bg-green-600 text-white font-black text-xl rounded-3xl hover:bg-green-700 hover:shadow-2xl hover:shadow-green-500/30 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="animate-spin" size={24} /> Memproses...
                                </>
                            ) : (
                                "Lanjutkan Pembayaran"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default DonationForm;
