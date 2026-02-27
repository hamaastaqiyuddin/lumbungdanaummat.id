import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, QrCode, CreditCard, MessageCircle, Copy, Check } from 'lucide-react';

const CheckoutPage = ({ donationData, navigateTo, formatCurrency }) => {
    const [paymentMethod, setPaymentMethod] = useState('bank');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!donationData.fullName) {
            navigateTo('project-detail');
        }
    }, [donationData, navigateTo]);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleConfirmWhatsApp = () => {
        const message = `Halo Admin LDU,\n\nSaya ingin konfirmasi sedekah:\n` +
            `*Program*: ${donationData.projectTitle}\n` +
            `*Nama*: ${donationData.fullName}\n` +
            `*Nominal*: ${formatCurrency(parseInt(donationData.amount))}\n` +
            `*Metode*: ${paymentMethod === 'bank' ? 'Transfer Bank' : 'QRIS'}\n` +
            `${donationData.forSomeoneElse ? `*Atas Nama*: ${donationData.someoneElseName}\n` : ''}` +
            `${donationData.prayer ? `*Doa*: ${donationData.prayer}\n` : ''}` +
            `\nMohon bantuannya untuk verifikasi. Terima kasih.`;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/6281212345678?text=${encodedMessage}`, '_blank');
    };

    return (
        <section className="pt-32 pb-20 bg-slate-50 dark:bg-slate-950 min-h-screen">
            <div className="max-w-3xl mx-auto px-4">
                <button
                    onClick={() => navigateTo('donation-form')}
                    className="flex items-center gap-2 text-slate-500 hover:text-green-600 font-bold mb-8 transition-colors"
                >
                    <ArrowLeft size={18} /> Kembali ke Form
                </button>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                    {/* Ringkasan */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl">
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                                <CheckCircle2 size={16} /> Ringkasan Sedekah
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Nominal</div>
                                    <div className="text-2xl font-black text-green-600">
                                        {formatCurrency(parseInt(donationData.amount || 0))}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Donatur</div>
                                    <div className="font-bold text-slate-900 dark:text-white">{donationData.fullName}</div>
                                </div>
                                {donationData.forSomeoneElse && (
                                    <div>
                                        <div className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Atas Nama</div>
                                        <div className="font-bold text-slate-700 dark:text-slate-300">{donationData.someoneElseName}</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-green-600/5 dark:bg-green-600/10 rounded-3xl p-6 border border-green-600/20 text-green-700 dark:text-green-400 flex gap-4">
                            <div className="p-2 bg-green-600/20 rounded-xl h-fit italic font-black">?</div>
                            <p className="text-xs font-bold leading-relaxed italic">
                                "Tangan yang memberi lebih baik daripada tangan yang menerima." (Hadits Riwayat Bukhari & Muslim)
                            </p>
                        </div>
                    </div>

                    {/* Pembayaran */}
                    <div className="md:col-span-3">
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 p-8 md:p-10">
                            <h2 className="text-2xl font-black mb-8">Metode Pembayaran</h2>

                            <div className="space-y-3 mb-10">
                                <label className="flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all group overflow-hidden relative"
                                    style={{ borderColor: paymentMethod === 'bank' ? '#16a34a' : 'transparent', backgroundColor: paymentMethod === 'bank' ? '#f0fdf4' : '#f8fafc' }}
                                    onClick={() => setPaymentMethod('bank')}>
                                    <CreditCard size={24} className={paymentMethod === 'bank' ? 'text-green-600' : 'text-slate-400'} />
                                    <div className="flex-1">
                                        <div className={`font-black uppercase tracking-widest text-xs mb-0.5 ${paymentMethod === 'bank' ? 'text-green-600' : 'text-slate-500'}`}>Transfer Bank</div>
                                        <div className="text-sm font-bold opacity-60">BSI, Mandiri, BCA, dll.</div>
                                    </div>
                                    {paymentMethod === 'bank' && <CheckCircle2 className="text-green-600" size={24} />}
                                </label>

                                <label className="flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all group bg-slate-50 dark:bg-slate-800 border-transparent h-fit"
                                    style={{ borderColor: paymentMethod === 'qris' ? '#16a34a' : 'transparent', backgroundColor: paymentMethod === 'qris' ? '#f0fdf4' : '#f8fafc' }}
                                    onClick={() => setPaymentMethod('qris')}>
                                    <QrCode size={24} className={paymentMethod === 'qris' ? 'text-green-600' : 'text-slate-400'} />
                                    <div className="flex-1">
                                        <div className={`font-black uppercase tracking-widest text-xs mb-0.5 ${paymentMethod === 'qris' ? 'text-green-600' : 'text-slate-500'}`}>QRIS</div>
                                        <div className="text-sm font-bold opacity-60">Gopay, OVO, Dana, LinkAja, dll.</div>
                                    </div>
                                    {paymentMethod === 'qris' && <CheckCircle2 className="text-green-600" size={24} />}
                                </label>
                            </div>

                            {paymentMethod === 'bank' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400 mb-10">
                                    <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 relative group overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-4xl italic group-hover:scale-110 transition-transform">BSI</div>
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-8 bg-teal-600 rounded-md flex items-center justify-center text-[10px] font-black text-white italic">BSI</div>
                                            <div className="text-sm font-black">Bank Syariah Indonesia</div>
                                        </div>
                                        <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-xl shadow-inner border border-slate-100 dark:border-slate-800">
                                            <div>
                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">No. Rekening</div>
                                                <div className="text-xl font-black text-green-600">77 888 222 11</div>
                                            </div>
                                            <button onClick={() => handleCopy('7788822211')} className="p-3 text-slate-400 hover:text-green-600 transition-all hover:bg-green-50 rounded-xl">
                                                {copied ? <Check size={18} /> : <Copy size={18} />}
                                            </button>
                                        </div>
                                        <div className="mt-3 text-xs font-bold text-slate-500 text-center">a.n <span className="text-slate-900 dark:text-white uppercase">Yayasan Lumbung Dana Ummat</span></div>
                                    </div>
                                </div>
                            )}

                            {paymentMethod === 'qris' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400 mb-10 text-center">
                                    <div className="p-6 rounded-3xl bg-white dark:bg-white inline-block border-4 border-slate-100 dark:border-slate-100 shadow-xl mx-auto overflow-hidden">
                                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=example_qris_payload" alt="QRIS" className="w-56 h-56 mx-auto mb-4" />
                                        <div className="text-xs font-black text-slate-900 bg-slate-100 py-2 rounded-xl border border-slate-200">SCAN UNTUK BAYAR</div>
                                    </div>
                                    <p className="text-xs font-bold text-slate-400">Silakan scan kode QR di atas menggunakan aplikasi mobile banking atau e-wallet pilihan Anda.</p>
                                </div>
                            )}

                            <button
                                onClick={handleConfirmWhatsApp}
                                className="w-full py-6 bg-green-600 text-white font-black text-xl rounded-3xl hover:bg-green-700 hover:shadow-2xl hover:shadow-green-500/30 transition-all active:scale-95 flex items-center justify-center gap-3"
                            >
                                <MessageCircle size={24} fill="currentColor" /> Konfirmasi ke WA CS
                            </button>
                            <p className="text-xs text-center mt-6 font-bold text-slate-400 italic">
                                *Donasi Anda akan segera diproses setelah bukti transfer dikirimkan via WA CS.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CheckoutPage;
