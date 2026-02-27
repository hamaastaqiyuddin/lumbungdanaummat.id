import React, { useState, useEffect } from 'react';
import {
    LayoutGrid, Heart, Newspaper, Download, LogOut,
    Plus, Edit, Trash2, Save, ChevronRight, Search,
    RefreshCcw, ShieldCheck, Target, Phone, AlertCircle,
    Database, TrendingUp, BarChart3, Settings2, HardDriveUpload
} from 'lucide-react';
const AnalyticsCharts = React.lazy(() => import('./AnalyticsCharts'));
import ErrorBoundary from '../common/ErrorBoundary';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

const AdminDashboard = ({
    programsData,
    setProgramsData,
    newsData,
    setNewsData,
    formatCurrency,
    navigateTo,
    isLoadingData
}) => {
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
    const [adminEmail, setAdminEmail] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [authError, setAuthError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedItem, setSelectedItem] = useState('overview');
    const [donationsData, setDonationsData] = useState([]);
    const [isLoadingDonations, setIsLoadingDonations] = useState(false);
    const [donationFilter, setDonationFilter] = useState('all');
    // ... rest of the state
    const [adminView, setAdminView] = useState('list');
    const [editingProgram, setEditingProgram] = useState(null);
    const [editingProject, setEditingProject] = useState(null);
    const [editingNewsItem, setEditingNewsItem] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [showDeleteModal, setShowDeleteModal] = useState(null);
    const [migrationStatus, setMigrationStatus] = useState({ state: 'idle', progress: 0, message: '' });

    // Initial Auth Check & Session Listener
    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setIsAdminLoggedIn(!!session);
            setIsLoading(false);
        };

        checkSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsAdminLoggedIn(!!session);
            if (!session) {
                setAdminEmail('');
                setAdminPassword('');
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // Fetch Donations
    useEffect(() => {
        if (isAdminLoggedIn && (selectedItem === 'manage-donations' || selectedItem === 'overview')) {
            fetchDonations();
        }
    }, [isAdminLoggedIn, selectedItem]);

    const fetchDonations = async () => {
        if (!isSupabaseConfigured) return;
        setIsLoadingDonations(true);
        try {
            const { data, error } = await supabase
                .from('donations')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setDonationsData(data || []);
        } catch (err) {
            console.error('Error fetching donations:', err);
        } finally {
            setIsLoadingDonations(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setAuthError(null);
        setIsLoading(true);

        if (!isSupabaseConfigured) {
            // Fallback to legacy password if Supabase is not setup
            if (adminPassword === 'LDUber@h2023') {
                setIsAdminLoggedIn(true);
                setAdminPassword('');
                setSelectedItem('overview');
                setIsLoading(false);
            } else {
                setAuthError('Password salah (Mode Lokal)');
                setIsLoading(false);
            }
            return;
        }

        const { error } = await supabase.auth.signInWithPassword({
            email: adminEmail,
            password: adminPassword,
        });

        if (error) {
            setAuthError(error.message);
            setIsLoading(false);
        } else {
            setAdminPassword('');
            setAdminEmail('');
            setSelectedItem('overview');
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setIsAdminLoggedIn(false);
        navigateTo('home');
    };

    const handleDelete = () => {
        if (showDeleteModal.type === 'news') {
            const updated = newsData.filter(n => n.id !== showDeleteModal.id);
            setNewsData(updated);
            localStorage.setItem('ldu_news', JSON.stringify(updated));
        } else if (showDeleteModal.type === 'program') {
            const updated = programsData.filter(p => p.id !== showDeleteModal.id);
            setProgramsData(updated);
            localStorage.setItem('ldu_programs', JSON.stringify(updated));
        } else if (showDeleteModal.type === 'project') {
            const updated = programsData.map(p => p.id === showDeleteModal.parentId
                ? { ...p, projects: p.projects.filter(prj => prj.id !== showDeleteModal.id) }
                : p);
            setProgramsData(updated);
            localStorage.setItem('ldu_programs', JSON.stringify(updated));
        }
        setShowDeleteModal(null);
    };

    const handleFileUpload = async (file, category) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', category);

        try {
            const response = await fetch('/api/upload.php', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            if (data.success) {
                return data.url;
            } else {
                throw new Error(data.error || 'Upload failed');
            }
        } catch (err) {
            console.error('Upload error:', err);
            // Fallback to local preview if API is not yet uploaded/available
            return `/media/${category}/${file.name}`;
        }
    };

    const handleMigration = async () => {
        if (!isSupabaseConfigured) return alert('Konfigurasi Supabase tidak ditemukan!');
        if (!confirm('Apakah Anda yakin ingin memindahkan data lokal ke database cloud Supabase?')) return;

        setMigrationStatus({ state: 'loading', progress: 0, message: 'Menyiapkan data...' });

        try {
            // 1. Get Local Data
            const localPrograms = JSON.parse(localStorage.getItem('ldu_programs')) || programsData;
            const localNews = JSON.parse(localStorage.getItem('ldu_news')) || newsData;
            const localDonations = JSON.parse(localStorage.getItem('ldu_donations')) || donationsData;

            setMigrationStatus({ state: 'loading', progress: 10, message: 'Membersihkan data lama...' });

            // 2. Migrate Programs & Projects
            for (let i = 0; i < localPrograms.length; i++) {
                const prog = localPrograms[i];
                const cleanProg = { ...prog };
                delete cleanProg.projects;

                setMigrationStatus({
                    state: 'loading',
                    progress: 10 + Math.round((i / localPrograms.length) * 40),
                    message: `Memindahkan Program: ${prog.title}...`
                });

                // Upsert Program
                const { data: pData, error: pError } = await supabase
                    .from('programs')
                    .upsert({
                        id: typeof prog.id === 'string' && prog.id.includes('.') ? undefined : prog.id,
                        title: prog.title,
                        description: prog.desc, // Map desc -> description
                        image: prog.image
                    })
                    .select();

                if (pError) throw pError;
                const progId = pData[0].id;

                // Upsert Projects for this program
                if (prog.projects && prog.projects.length > 0) {
                    const projectsToInsert = prog.projects.map(prj => ({
                        program_id: progId,
                        title: prj.title,
                        image: prj.image,
                        target: prj.target,
                        collected: prj.collected,
                        days_left: prj.daysLeft || prj.days_left || 0
                    }));

                    const { error: prjError } = await supabase
                        .from('projects')
                        .insert(projectsToInsert);

                    if (prjError) throw prjError;
                }
            }

            // 3. Migrate News
            setMigrationStatus({ state: 'loading', progress: 60, message: 'Memindahkan Berita...' });
            const newsToInsert = localNews.map(n => ({
                title: n.title,
                date: n.date,
                image: n.image,
                snippet: n.snippet,
                content: n.content
            }));
            const { error: nError } = await supabase.from('news').insert(newsToInsert);
            if (nError) throw nError;

            // 4. Migrate Donations
            setMigrationStatus({ state: 'loading', progress: 80, message: 'Memindahkan Riwayat Donasi...' });
            const donationsToInsert = localDonations.map(d => {
                // Ensure date format or just pass string
                return {
                    donor_name: d.name || d.donor_name || 'Hamba Allah',
                    amount: Number(d.amount),
                    program_id: d.program_id,
                    project_id: d.project_id,
                    status: d.status || 'Success',
                    created_at: d.date || d.created_at || new Date().toISOString()
                };
            });
            if (donationsToInsert.length > 0) {
                const { error: dError } = await supabase.from('donations').insert(donationsToInsert);
                if (dError) throw dError;
            }

            setMigrationStatus({ state: 'success', progress: 100, message: 'Migrasi Selesai! Data cloud sekarang sinkron.' });
            setTimeout(() => window.location.reload(), 3000); // Reload to fetch fresh data
        } catch (err) {
            console.error('Migration Error:', err);
            setMigrationStatus({ state: 'error', progress: 0, message: `Error: ${err.message}` });
        }
    };

    if (isLoading && !isAdminLoggedIn) {
        return (
            <div className="pt-32 pb-24 min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
            </div>
        );
    }

    if (!isAdminLoggedIn) {
        return (
            <div className="min-h-screen bg-[#f8f9fa] dark:bg-slate-900 flex items-center justify-center p-6 transition-colors duration-300">
                <div className="max-w-md w-full animate-in fade-in zoom-in duration-500">
                    <div className="bg-white dark:bg-slate-800 p-12 rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-700/50 relative overflow-hidden">
                        {/* Decorative Background */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full -mr-16 -mt-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-500/5 rounded-full -ml-12 -mb-12"></div>

                        <div className="text-center mb-10 relative">
                            <div className="w-20 h-20 bg-green-600 rounded-3xl flex items-center justify-center mx-auto text-white shadow-xl shadow-green-600/30 mb-8 border-4 border-white dark:border-slate-800 group hover:rotate-6 transition-transform">
                                <ShieldCheck size={40} />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">Admin Portal</h2>
                            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">Lumbung Dana Ummat</p>
                        </div>

                        {!isSupabaseConfigured && (
                            <div className="mb-8 p-6 rounded-3xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 text-amber-800 dark:text-amber-200 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
                                <div className="flex items-center gap-2 mb-2 font-black uppercase text-[10px] tracking-widest text-amber-600">
                                    <AlertCircle size={14} /> Dev Mode
                                </div>
                                <p className="text-xs leading-relaxed font-medium opacity-80">
                                    Supabase belum dikonfigurasi. Menggunakan kredensial lokal.
                                </p>
                            </div>
                        )}

                        {authError && (
                            <div className="mb-6 px-5 py-4 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-black flex items-center gap-3 border border-red-100 dark:border-red-800 animate-in shake duration-300">
                                <AlertCircle size={20} />
                                {authError}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-5 relative">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-4">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-transparent focus:border-green-500 focus:bg-white dark:focus:bg-slate-700 outline-none transition-all font-bold text-sm"
                                    value={adminEmail}
                                    onChange={(e) => setAdminEmail(e.target.value)}
                                    placeholder="admin@ldu.id"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-4">Account Password</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-transparent focus:border-green-500 focus:bg-white dark:focus:bg-slate-700 outline-none transition-all font-bold text-sm"
                                    value={adminPassword}
                                    onChange={(e) => setAdminPassword(e.target.value)}
                                    placeholder="••••••••"
                                />
                            </div>
                            <button
                                disabled={isLoading}
                                className="w-full py-4 bg-green-600 text-white font-black rounded-2xl hover:bg-green-700 transition-all active:scale-95 shadow-2xl shadow-green-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-sm uppercase tracking-widest mt-4"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>Sign In <ChevronRight size={18} /></>
                                )}
                            </button>
                        </form>
                    </div>
                    <p className="text-center mt-10 text-xs font-bold text-slate-400 uppercase tracking-widest">
                        &copy; 2026 Yayasan LDU. All Rights Reserved.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f9fa] dark:bg-slate-900 leading-normal flex font-sans transition-colors duration-300">
            {/* Sidebar */}
            <aside className="w-72 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 hidden lg:flex flex-col fixed h-screen z-30">
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-10 group cursor-pointer" onClick={() => navigateTo('home')}>
                        <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-600/30 group-hover:scale-105 transition-transform">
                            <ShieldCheck size={24} />
                        </div>
                        <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">AdminLDU</span>
                    </div>

                    <nav className="space-y-1.5">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 ml-4">Main Menu</p>
                        <SidebarButton
                            active={selectedItem === 'overview'}
                            onClick={() => setSelectedItem('overview')}
                            icon={<LayoutGrid size={18} />}
                            label="Dashboard"
                        />
                        <SidebarButton
                            active={selectedItem === 'manage-programs'}
                            onClick={() => setSelectedItem('manage-programs')}
                            icon={<Heart size={18} />}
                            label="Programs"
                        />
                        <SidebarButton
                            active={selectedItem === 'manage-news'}
                            onClick={() => setSelectedItem('manage-news')}
                            icon={<Newspaper size={18} />}
                            label="News"
                        />
                        <SidebarButton
                            active={selectedItem === 'manage-donations'}
                            onClick={() => setSelectedItem('manage-donations')}
                            icon={<Database size={18} />}
                            label="Donations DB"
                        />
                        <SidebarButton
                            active={selectedItem === 'maintenance'}
                            onClick={() => setSelectedItem('maintenance')}
                            icon={<Settings2 size={18} />}
                            label="Maintenance"
                        />
                    </nav>

                    <nav className="mt-12 space-y-1.5">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 ml-4">General</p>
                        <button className="w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl font-bold bg-transparent text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white transition-all text-sm">
                            <Plus size={18} /> Settings
                        </button>
                    </nav>
                </div>

                <div className="mt-auto p-6">
                    <div className="bg-slate-50 dark:bg-slate-700/30 rounded-3xl p-6 border border-slate-100 dark:border-slate-700">
                        <h4 className="font-black text-sm mb-2">Butuh Bantuan?</h4>
                        <p className="text-xs text-slate-500 mb-4">Hubungi tim technical support LDU.</p>
                        <button className="w-full py-2.5 bg-green-600 text-white rounded-xl text-xs font-black shadow-lg shadow-green-600/20 hover:bg-green-700 transition-all">
                            Kontak Support
                        </button>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-5 py-3.5 mt-4 rounded-2xl font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all text-sm"
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 lg:ml-72 flex flex-col min-h-screen">
                {/* Top Header */}
                <header className="h-20 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 px-8 flex items-center justify-between sticky top-0 z-20">
                    <div className="flex items-center gap-4 flex-1 max-w-xl">
                        <div className="relative w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search here..."
                                className="w-full pl-12 pr-4 py-2.5 bg-slate-100 dark:bg-slate-700/50 rounded-2xl border-none focus:ring-2 focus:ring-green-500 outline-none text-sm transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all">
                            <Plus size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
                        </button>
                        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700"></div>
                        <div className="flex items-center gap-3 cursor-pointer group">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-black leading-none mb-1">Admin LDU</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase">{isSupabaseConfigured ? 'Super Admin' : 'Local Mode'}</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 font-black text-xs ring-2 ring-white dark:ring-slate-800 shadow-md">
                                LD
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-8">
                    <div className="mb-10">
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white capitalize">
                            {selectedItem === 'overview' ? 'Dashboard Overview' : selectedItem.replace('-', ' ')}
                        </h1>
                        <p className="text-slate-500 font-medium">Selamat datang kembali, kelola data yayasan Anda di sini.</p>
                    </div>

                    {isLoadingData ? (
                        <div className="py-20 flex flex-col items-center justify-center bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700/50 shadow-sm animate-pulse">
                            <div className="w-16 h-16 border-4 border-green-100 dark:border-green-900/30 border-t-green-600 rounded-full animate-spin mb-4"></div>
                            <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Memuat Data Panel...</p>
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {selectedItem === 'overview' && (() => {
                                const allSubProjects = programsData.flatMap(p => p.projects || []);
                                const totalTarget = allSubProjects.reduce((acc, p) => acc + (p.target || 0), 0);

                                // Use live donations data if from Supabase, otherwise fallback to project summary
                                const liveDonated = donationsData.reduce((acc, d) => acc + (Number(d.amount) || 0), 0);
                                const totalCollected = liveDonated > 0 ? liveDonated : allSubProjects.reduce((acc, p) => acc + (p.collected || 0), 0);

                                const fulfillmentRate = totalTarget > 0 ? Math.round((totalCollected / totalTarget) * 100) : 0;

                                return (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            <OverviewCard
                                                title="Total Donasi Terkumpul"
                                                value={formatCurrency(totalCollected)}
                                                icon={<Heart size={24} />}
                                                color="green"
                                                subtitle={`Dari ${allSubProjects.length} Sub-Project aktif`}
                                            />
                                            <OverviewCard
                                                title="Tingkat Pemenuhan"
                                                value={`${fulfillmentRate}%`}
                                                icon={<Target size={24} />}
                                                color="blue"
                                                subtitle={`Target: ${formatCurrency(totalTarget)}`}
                                            />
                                            <OverviewCard
                                                title="Update Berita"
                                                value={newsData.length}
                                                icon={<Newspaper size={24} />}
                                                color="orange"
                                                subtitle="Total artikel diterbitkan"
                                            />
                                        </div>

                                        <ErrorBoundary>
                                            <React.Suspense fallback={<div className="h-64 flex items-center justify-center bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200 dark:border-slate-700 animate-pulse">Memuat Analitik...</div>}>
                                                <AnalyticsCharts donationsData={donationsData} formatCurrency={formatCurrency} />
                                            </React.Suspense>
                                        </ErrorBoundary>

                                        <div className="bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-700/50 shadow-sm">
                                            <div className="flex items-center justify-between mb-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-2xl">
                                                        <LayoutGrid size={24} />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-black">Ringkasan Fundraising</h3>
                                                        <p className="text-sm text-slate-500 font-medium">Progress pengumpulan dana program utama</p>
                                                    </div>
                                                </div>
                                                <button className="text-green-600 font-black text-sm hover:underline">Lihat Semua</button>
                                            </div>
                                            <div className="space-y-8">
                                                {programsData.slice(0, 3).map(prog => {
                                                    const progTarget = prog.projects?.reduce((acc, p) => acc + (p.target || 0), 0) || 0;
                                                    const progCollected = prog.projects?.reduce((acc, p) => acc + (p.collected || 0), 0) || 0;
                                                    const progRate = progTarget > 0 ? (progCollected / progTarget) * 100 : 0;

                                                    return (
                                                        <div key={prog.id} className="group">
                                                            <div className="flex justify-between items-center mb-3">
                                                                <span className="font-black text-slate-700 dark:text-slate-200 group-hover:text-green-600 transition-colors uppercase text-xs tracking-wider">{prog.title}</span>
                                                                <span className="text-sm font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">{Math.round(progRate)}%</span>
                                                            </div>
                                                            <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-700/50 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                                                                <div
                                                                    className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-1000 ease-out"
                                                                    style={{ width: `${Math.min(progRate, 100)}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}

                            {selectedItem === 'manage-programs' && adminView === 'edit-program' && (
                                <ProgramForm
                                    editingProgram={editingProgram}
                                    editForm={editForm}
                                    setEditForm={setEditForm}
                                    setAdminView={setAdminView}
                                    setEditingProgram={setEditingProgram}
                                    programsData={programsData}
                                    setProgramsData={setProgramsData}
                                    handleFileUpload={handleFileUpload}
                                />
                            )}

                            {selectedItem === 'manage-programs' && adminView === 'edit-project' && editingProject && (
                                <ProjectForm
                                    editingProject={editingProject}
                                    editForm={editForm}
                                    setEditForm={setEditForm}
                                    setAdminView={setAdminView}
                                    setEditingProject={setEditingProject}
                                    programsData={programsData}
                                    setProgramsData={setProgramsData}
                                    formatCurrency={formatCurrency}
                                    handleFileUpload={handleFileUpload}
                                />
                            )}

                            {selectedItem === 'manage-programs' && adminView === 'list' && (
                                <ProgramList
                                    programsData={programsData}
                                    setEditForm={setEditForm}
                                    setEditingProgram={setEditingProgram}
                                    setEditingProject={setEditingProject}
                                    setAdminView={setAdminView}
                                    setShowDeleteModal={setShowDeleteModal}
                                    formatCurrency={formatCurrency}
                                />
                            )}

                            {selectedItem === 'manage-news' && adminView === 'edit-news' && (
                                <NewsForm
                                    editingNewsItem={editingNewsItem}
                                    editForm={editForm}
                                    setEditForm={setEditForm}
                                    setAdminView={setAdminView}
                                    setEditingNewsItem={setEditingNewsItem}
                                    newsData={newsData}
                                    setNewsData={setNewsData}
                                    programsData={programsData}
                                    handleFileUpload={handleFileUpload}
                                />
                            )}

                            {selectedItem === 'manage-news' && adminView === 'list' && (
                                <NewsList
                                    newsData={newsData}
                                    setEditForm={setEditForm}
                                    setEditingNewsItem={setEditingNewsItem}
                                    setAdminView={setAdminView}
                                    setShowDeleteModal={setShowDeleteModal}
                                />
                            )}

                            {selectedItem === 'manage-donations' && (
                                <DonationList
                                    donationsData={donationsData}
                                    isLoading={isLoadingDonations}
                                    formatCurrency={formatCurrency}
                                    programsData={programsData}
                                />
                            )}

                            {selectedItem === 'maintenance' && (
                                <div className="bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-700/50 shadow-sm animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-3xl">
                                            <HardDriveUpload size={32} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black">Pusat Migrasi Data</h3>
                                            <p className="text-slate-500 font-medium">Sinkronkan data lokal Anda ke Cloud Database Supabase.</p>
                                        </div>
                                    </div>

                                    <div className="p-8 rounded-[2rem] bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 space-y-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 font-black text-xs">1</div>
                                            <div>
                                                <p className="font-black text-slate-800 dark:text-white uppercase tracking-wider text-[10px] mb-1">Persiapan</p>
                                                <p className="text-sm text-slate-600 dark:text-slate-400">PASTIKAN Anda telah mengonfigurasi `.env` dengan kredensial Supabase yang benar.</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 font-black text-xs">2</div>
                                            <div>
                                                <p className="font-black text-slate-800 dark:text-white uppercase tracking-wider text-[10px] mb-1">Backup Otomatis</p>
                                                <p className="text-sm text-slate-600 dark:text-slate-400">Data Anda yang ada di browser (LocalStorage) akan disalin ke database cloud secara permanen.</p>
                                            </div>
                                        </div>

                                        <div className="pt-6">
                                            {migrationStatus.state === 'loading' ? (
                                                <div className="space-y-4">
                                                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
                                                        <div className="bg-green-600 h-full transition-all duration-300" style={{ width: `${migrationStatus.progress}%` }}></div>
                                                    </div>
                                                    <p className="text-center font-black text-green-600 animate-pulse text-xs tracking-widest uppercase">{migrationStatus.message}</p>
                                                </div>
                                            ) : migrationStatus.state === 'success' ? (
                                                <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-[1.5rem] flex items-center gap-4 text-green-700 dark:text-green-300">
                                                    <ShieldCheck size={24} />
                                                    <p className="font-black text-sm">{migrationStatus.message}</p>
                                                </div>
                                            ) : migrationStatus.state === 'error' ? (
                                                <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-[1.5rem] space-y-3 text-red-700 dark:text-red-400">
                                                    <div className="flex items-center gap-4">
                                                        <AlertCircle size={24} />
                                                        <p className="font-black text-sm">{migrationStatus.message}</p>
                                                    </div>
                                                    <button onClick={() => setMigrationStatus({ state: 'idle', progress: 0, message: '' })} className="text-[10px] font-black uppercase tracking-widest underline decoration-red-300">Coba Lagi</button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={handleMigration}
                                                    className="w-full py-5 bg-green-600 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-green-600/30 hover:bg-green-700 transition-all active:scale-95 group"
                                                >
                                                    Mulai Migrasi Data ke Cloud <ChevronRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-8 p-6 bg-amber-50 dark:bg-amber-900/10 rounded-[1.5rem] border border-amber-100 dark:border-amber-900/30">
                                        <div className="flex gap-4">
                                            <AlertCircle className="text-amber-600 flex-shrink-0" size={20} />
                                            <p className="text-xs text-amber-800 dark:text-amber-400 font-medium leading-relaxed">
                                                <strong>PERHATIAN:</strong> Proses ini hanya boleh dilakukan sekali untuk sinkronisasi awal. Migrasi ini akan menduplikasi data jika dijalankan berkali-kali tanpa dibersihkan di cloud.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <DeleteModal
                    type={showDeleteModal.type}
                    onClose={() => setShowDeleteModal(null)}
                    onConfirm={handleDelete}
                />
            )}
        </div>
    );
};

// Sub-components
const SidebarButton = ({ active, onClick, icon, label }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl font-bold transition-all text-sm group ${active
            ? 'bg-green-600 text-white shadow-xl shadow-green-600/30 translate-x-1'
            : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white'
            }`}
    >
        <span className={`${active ? 'text-white' : 'text-slate-400 group-hover:text-green-600'}`}>{icon}</span>
        {label}
    </button>
);

const OverviewCard = ({ title, value, icon, color, subtitle, isStatus }) => {
    const colorClasses = {
        red: 'bg-red-50 text-red-600 dark:bg-red-900/20',
        blue: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20',
        orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20',
        green: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20',
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700/50 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all duration-500 group">
            <div className="flex items-start justify-between mb-6">
                <div className={`p-4 rounded-2xl ${colorClasses[color]} group-hover:scale-110 transition-transform duration-500`}>
                    {icon}
                </div>
                <button className="text-slate-300 hover:text-slate-600 transition-colors">
                    <ChevronRight size={20} />
                </button>
            </div>
            <p className="text-sm font-bold text-slate-500 mb-2">{title}</p>
            <h3 className={`font-black tracking-tight ${isStatus ? 'text-2xl text-emerald-600' : 'text-4xl text-slate-900 dark:text-white'}`}>
                {value}
            </h3>
            <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-700/50">
                <p className="text-xs font-bold text-slate-400 leading-relaxed uppercase tracking-wider">{subtitle}</p>
            </div>
        </div>
    );
};

const ProgramForm = ({ editingProgram, editForm, setEditForm, setAdminView, setEditingProgram, programsData, setProgramsData, handleFileUpload }) => {
    const [isUploading, setIsUploading] = useState(false);

    const onFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setIsUploading(true);
        try {
            const url = await handleFileUpload(file, 'programs');
            setEditForm(f => ({ ...f, image: url }));
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-3 mb-8">
                <button onClick={() => { setAdminView('list'); setEditingProgram(null); setEditForm({}); }}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all">
                    <ChevronRight size={20} className="rotate-180" />
                </button>
                <h3 className="text-xl font-black">{editingProgram ? 'Edit Program' : 'Tambah Program Baru'}</h3>
            </div>
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Judul Program <span className="text-red-500">*</span></label>
                    <input type="text" value={editForm.title || ''} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 focus:ring-2 focus:ring-green-500 outline-none transition-all font-semibold"
                        placeholder="Contoh: Sedekah Villa Qur'an" />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Deskripsi Program</label>
                    <textarea rows={3} value={editForm.desc || ''} onChange={e => setEditForm(f => ({ ...f, desc: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 focus:ring-2 focus:ring-green-500 outline-none transition-all resize-none"
                        placeholder="Deskripsi singkat program..." />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Media Gambar Cover</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold mb-1 opacity-50 uppercase">URL Gambar</label>
                            <input type="url" value={editForm.image || ''} onChange={e => setEditForm(f => ({ ...f, image: e.target.value }))}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 focus:ring-2 focus:ring-green-500 outline-none transition-all font-mono text-sm"
                                placeholder="https://images.unsplash.com/..." />
                        </div>
                        <div>
                            <label className="block text-xs font-bold mb-1 opacity-50 uppercase">Atau Upload ke Hostinger</label>
                            <div className="relative">
                                <input type="file" accept="image/*"
                                    onChange={onFileChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 focus:ring-2 focus:ring-green-500 outline-none transition-all text-sm" />
                                {isUploading && (
                                    <div className="absolute top-1/2 right-4 -translate-y-1/2 flex items-center gap-2 text-green-600 font-bold text-[10px] uppercase">
                                        <RefreshCcw size={12} className="animate-spin" /> Uploading...
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {editForm.image && (
                        <div className="mt-3 rounded-xl overflow-hidden h-40 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 relative group">
                            <img src={editForm.image} alt="preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-white font-black text-[10px] uppercase tracking-widest">{editForm.image.startsWith('http') ? 'External Image' : 'Hostinger Hosted'}</span>
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                    <button onClick={() => { setAdminView('list'); setEditingProgram(null); setEditForm({}); }}
                        className="px-6 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all">
                        Batal
                    </button>
                    <button onClick={async () => {
                        if (!editForm.title) return alert('Judul tidak boleh kosong!');
                        setIsUploading(true);
                        try {
                            if (isSupabaseConfigured) {
                                const progToSave = {
                                    title: editForm.title,
                                    description: editForm.desc || '', // Map desc -> description
                                    image: editForm.image
                                };

                                if (editingProgram) {
                                    const { error } = await supabase.from('programs').update(progToSave).eq('id', editingProgram.id);
                                    if (error) throw error;
                                } else {
                                    const { error } = await supabase.from('news').insert([progToSave]); // Wait, programs table
                                    // I should use 'programs' table
                                    const { error: pErr } = await supabase.from('programs').insert([progToSave]);
                                    if (pErr) throw pErr;
                                }
                            }

                            let updated;
                            if (editingProgram) {
                                updated = programsData.map(p => p.id === editingProgram.id ? { ...p, ...editForm } : p);
                            } else {
                                const newProg = { id: Date.now(), title: editForm.title, desc: editForm.desc || '', image: editForm.image || 'https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=800&auto=format&fit=crop', projects: [] };
                                updated = [...programsData, newProg];
                            }
                            setProgramsData(updated);
                            localStorage.setItem('ldu_programs', JSON.stringify(updated));
                            setAdminView('list'); setEditingProgram(null); setEditForm({});
                        } catch (err) {
                            console.error('Save error:', err);
                            alert('Gagal menyimpan program: ' + err.message);
                        } finally {
                            setIsUploading(false);
                        }
                    }}
                        disabled={isUploading}
                        className="px-6 py-3 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 transition-all shadow-md shadow-green-600/20 flex items-center gap-2 disabled:opacity-50">
                        <Save size={18} /> Simpan
                    </button>
                </div>
            </div>
        </div>
    );
};

const ProjectForm = ({ editingProject, editForm, setEditForm, setAdminView, setEditingProject, programsData, setProgramsData, formatCurrency, handleFileUpload }) => {
    const [isUploading, setIsUploading] = useState(false);

    const onFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setIsUploading(true);
        try {
            const url = await handleFileUpload(file, 'projects');
            setEditForm(f => ({ ...f, image: url }));
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-3 mb-8">
                <button onClick={() => { setAdminView('list'); setEditingProject(null); setEditForm({}); }}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all">
                    <ChevronRight size={20} className="rotate-180" />
                </button>
                <h3 className="text-xl font-black">{editingProject.project ? 'Edit Sub-Proyek' : 'Tambah Sub-Proyek Baru'}</h3>
            </div>
            <div className="space-y-6">
                {editingProject.project && (
                    <div>
                        <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">ID Proyek</label>
                        <input type="text" value={editForm.id || ''} readOnly
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-900 font-mono text-sm text-slate-400 cursor-not-allowed" />
                    </div>
                )}
                <div>
                    <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Judul Sub-Proyek <span className="text-red-500">*</span></label>
                    <input type="text" value={editForm.title || ''} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 focus:ring-2 focus:ring-green-500 outline-none transition-all font-semibold"
                        placeholder="Contoh: Pembebasan Tanah untuk KB-TK-SD" />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Media Gambar</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold mb-1 opacity-50 uppercase">URL Gambar</label>
                            <input type="url" value={editForm.image || ''} onChange={e => setEditForm(f => ({ ...f, image: e.target.value }))}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 focus:ring-2 focus:ring-green-500 outline-none transition-all font-mono text-sm"
                                placeholder="https://images.unsplash.com/..." />
                        </div>
                        <div>
                            <label className="block text-xs font-bold mb-1 opacity-50 uppercase">Atau Upload ke Hostinger</label>
                            <div className="relative">
                                <input type="file" accept="image/*"
                                    onChange={onFileChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 focus:ring-2 focus:ring-green-500 outline-none transition-all text-sm" />
                                {isUploading && (
                                    <div className="absolute top-1/2 right-4 -translate-y-1/2 flex items-center gap-2 text-green-600 font-bold text-[10px] uppercase">
                                        <RefreshCcw size={12} className="animate-spin" /> Uploading...
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {editForm.image && (
                        <div className="mt-3 rounded-xl overflow-hidden h-40 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 relative group">
                            <img src={editForm.image} alt="preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-white font-black text-[10px] uppercase tracking-widest">{editForm.image.startsWith('http') ? 'External Image' : 'Hostinger Hosted'}</span>
                            </div>
                        </div>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Target Dana <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">Rp</span>
                            <input type="number" value={editForm.target || ''} onChange={e => setEditForm(f => ({ ...f, target: parseInt(e.target.value) || 0 }))}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 focus:ring-2 focus:ring-green-500 outline-none transition-all font-bold"
                                placeholder="0" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Terkumpul</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">Rp</span>
                            <input type="number" value={editForm.collected || ''} onChange={e => setEditForm(f => ({ ...f, collected: parseInt(e.target.value) || 0 }))}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 focus:ring-2 focus:ring-green-500 outline-none transition-all font-bold"
                                placeholder="0" />
                        </div>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Sisa Hari</label>
                    <input type="number" value={editForm.daysLeft || ''} onChange={e => setEditForm(f => ({ ...f, daysLeft: parseInt(e.target.value) || 0 }))}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 focus:ring-2 focus:ring-green-500 outline-none transition-all font-bold"
                        placeholder="Contoh: 30" />
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                    <button onClick={() => { setAdminView('list'); setEditingProject(null); setEditForm({}); }}
                        className="px-6 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all">
                        Batal
                    </button>
                    <button onClick={async () => {
                        if (!editForm.title || !editForm.target) return alert('Judul dan Target harus diisi!');
                        setIsUploading(true);
                        try {
                            if (isSupabaseConfigured) {
                                const projectToSave = {
                                    program_id: editingProject.parentId,
                                    title: editForm.title,
                                    image: editForm.image,
                                    target: editForm.target,
                                    collected: editForm.collected || 0,
                                    days_left: editForm.daysLeft || 0 // Map daysLeft -> days_left
                                };

                                if (editingProject.project) {
                                    const { error } = await supabase.from('projects').update(projectToSave).eq('id', editingProject.project.id);
                                    if (error) throw error;
                                } else {
                                    const { error } = await supabase.from('projects').insert([projectToSave]);
                                    if (error) throw error;
                                }
                            }

                            const updated = programsData.map(prog => {
                                if (prog.id === editingProject.parentId) {
                                    const updatedProjects = editingProject.project
                                        ? prog.projects.map(p => p.id === editingProject.project.id ? { ...p, ...editForm } : p)
                                        : [...(prog.projects || []), { ...editForm, id: `${prog.id}.${(prog.projects?.length || 0) + 1}` }];
                                    return { ...prog, projects: updatedProjects };
                                }
                                return prog;
                            });
                            setProgramsData(updated);
                            localStorage.setItem('ldu_programs', JSON.stringify(updated));
                            setAdminView('list'); setEditingProject(null); setEditForm({});
                        } catch (err) {
                            console.error('Save error:', err);
                            alert('Gagal menyimpan proyek: ' + err.message);
                        } finally {
                            setIsUploading(false);
                        }
                    }}
                        disabled={isUploading}
                        className="px-6 py-3 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 transition-all shadow-md shadow-green-600/20 flex items-center gap-2 disabled:opacity-50">
                        <Save size={18} /> Simpan
                    </button>
                </div>
            </div>
        </div >
    );
};

const ProgramList = ({ programsData, setEditForm, setEditingProgram, setEditingProject, setAdminView, setShowDeleteModal, formatCurrency }) => (
    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-sm border border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="flex justify-between items-center mb-10">
            <div>
                <h3 className="text-2xl font-black">Kelola Program</h3>
                <p className="text-sm text-slate-500 font-medium">Update data pembangunan dan target dana</p>
            </div>
            <button
                onClick={() => {
                    setEditForm({ title: '', desc: '', image: '' });
                    setEditingProgram(null);
                    setAdminView('edit-program');
                }}
                className="px-6 py-3 bg-green-600 text-white rounded-2xl flex items-center gap-2 font-black hover:bg-green-700 transition-all shadow-xl shadow-green-600/30"
            >
                <Plus size={20} /> Tambah Program
            </button>
        </div>
        <div className="space-y-6">
            {programsData.map(prog => (
                <div key={prog.id} className="border border-slate-100 dark:border-slate-700 rounded-[2rem] p-8 bg-slate-50/30 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-800 transition-all duration-500 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none group">
                    <div className="flex justify-between items-start mb-8">
                        <div className="flex gap-5 items-center">
                            <div className="relative">
                                <img src={prog.image} className="w-16 h-16 rounded-2xl object-cover shadow-md" />
                                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-600 rounded-lg flex items-center justify-center text-white text-[10px] font-black">{prog.projects?.length || 0}</div>
                            </div>
                            <div>
                                <h4 className="font-black text-xl text-slate-900 dark:text-white">{prog.title}</h4>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">ID: {prog.id}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => { setEditForm({ ...prog }); setEditingProgram(prog); setAdminView('edit-program'); }}
                                className="p-3 text-slate-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl border border-slate-200 dark:border-slate-700 transition-all">
                                <Edit size={18} />
                            </button>
                            <button onClick={() => setShowDeleteModal({ type: 'program', id: prog.id })}
                                className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl border border-slate-200 dark:border-slate-700 transition-all">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Sub-Projects</p>
                        {(prog.projects || []).map(prj => (
                            <div key={prj.id} className="flex justify-between items-center bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:translate-x-1 transition-transform">
                                <div className="flex items-center gap-4">
                                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-lg shadow-green-500/50"></div>
                                    <span className="font-bold text-slate-700 dark:text-slate-200">{prj.title}</span>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="text-xs font-black text-green-600">{formatCurrency(prj.collected)}</p>
                                        <p className="text-[10px] text-slate-400 font-bold">TERKUMPUL</p>
                                    </div>
                                    <div className="flex gap-1">
                                        <button onClick={() => { setEditForm({ ...prj }); setEditingProject({ project: prj, parentId: prog.id }); setAdminView('edit-project'); }}
                                            className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Edit size={16} /></button>
                                        <button onClick={() => setShowDeleteModal({ type: 'project', id: prj.id, parentId: prog.id })}
                                            className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button onClick={() => { setEditForm({ title: '', image: '', target: 50000000, collected: 0, daysLeft: 30 }); setEditingProject({ project: null, parentId: prog.id }); setAdminView('edit-project'); }}
                            className="w-full py-4 mt-2 rounded-[1.5rem] border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-400 text-sm font-black flex items-center justify-center gap-3 hover:border-green-500 hover:text-green-600 hover:bg-green-50/30 dark:hover:bg-green-900/10 transition-all">
                            <Plus size={18} /> Tambah Sub-Proyek
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const NewsForm = ({ editingNewsItem, editForm, setEditForm, setAdminView, setEditingNewsItem, newsData, setNewsData, programsData, handleFileUpload }) => {
    const [isUploading, setIsUploading] = useState(false);

    const onFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setIsUploading(true);
        try {
            const url = await handleFileUpload(file, 'news');
            setEditForm(f => ({ ...f, image: url }));
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-3 mb-8">
                <button onClick={() => { setAdminView('list'); setEditingNewsItem(null); setEditForm({}); }}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all">
                    <ChevronRight size={20} className="rotate-180" />
                </button>
                <h3 className="text-xl font-black">{editingNewsItem ? 'Edit Berita' : 'Tambah Berita Baru'}</h3>
            </div>
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Judul Berita <span className="text-red-500">*</span></label>
                    <input type="text" value={editForm.title || ''} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 focus:ring-2 focus:ring-green-500 outline-none transition-all font-semibold"
                        placeholder="Contoh: Penyaluran Bantuan Sembako..." />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Tanggal Terbit</label>
                        <input type="text" value={editForm.date || ''} onChange={e => setEditForm(f => ({ ...f, date: e.target.value }))}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                            placeholder="Contoh: 12 Februari 2026" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Media Gambar Utama</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold mb-1 opacity-50 uppercase">URL Gambar</label>
                            <input type="url" value={editForm.image || ''} onChange={e => setEditForm(f => ({ ...f, image: e.target.value }))}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 focus:ring-2 focus:ring-green-500 outline-none transition-all font-mono text-sm"
                                placeholder="https://images.unsplash.com/..." />
                        </div>
                        <div>
                            <label className="block text-xs font-bold mb-1 opacity-50 uppercase">Atau Upload ke Hostinger</label>
                            <div className="relative">
                                <input type="file" accept="image/*"
                                    onChange={onFileChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 focus:ring-2 focus:ring-green-500 outline-none transition-all text-sm" />
                                {isUploading && (
                                    <div className="absolute top-1/2 right-4 -translate-y-1/2 flex items-center gap-2 text-green-600 font-bold text-[10px] uppercase">
                                        <RefreshCcw size={12} className="animate-spin" /> Uploading...
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {editForm.image && (
                        <div className="mt-3 rounded-xl overflow-hidden h-40 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 relative group">
                            <img src={editForm.image} alt="preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-white font-black text-[10px] uppercase tracking-widest">{editForm.image.startsWith('http') ? 'External Image' : 'Hostinger Hosted'}</span>
                            </div>
                        </div>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Snippet (Ringkasan)</label>
                    <textarea rows={2} value={editForm.snippet || ''} onChange={e => setEditForm(f => ({ ...f, snippet: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 focus:ring-2 focus:ring-green-500 outline-none transition-all resize-none"
                        placeholder="Ringkasan berita..." />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Isi Berita Lengkap</label>
                    <textarea rows={6} value={editForm.content || ''} onChange={e => setEditForm(f => ({ ...f, content: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 focus:ring-2 focus:ring-green-500 outline-none transition-all resize-none"
                        placeholder="Tulis berita lengkap di sini..." />
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                    <button onClick={() => { setAdminView('list'); setEditingNewsItem(null); setEditForm({}); }}
                        className="px-6 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all">
                        Batal
                    </button>
                    <button onClick={async () => {
                        if (!editForm.title) return alert('Judul tidak boleh kosong!');

                        const finalSlug = editForm.slug || editForm.title.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
                        const finalDate = editForm.date || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

                        setIsUploading(true);
                        try {
                            if (isSupabaseConfigured) {
                                const newsToSave = {
                                    title: editForm.title,
                                    date: finalDate,
                                    image: editForm.image,
                                    snippet: editForm.snippet || (editForm.content ? editForm.content.substring(0, 150) : ''),
                                    content: editForm.content,
                                    slug: finalSlug
                                };

                                if (editingNewsItem) {
                                    const { error } = await supabase.from('news').update(newsToSave).eq('id', editingNewsItem.id);
                                    if (error) throw error;
                                } else {
                                    const { error } = await supabase.from('news').insert([newsToSave]);
                                    if (error) throw error;
                                }
                            }

                            // Update local state and storage for immediate feedback/fallback
                            let updated;
                            if (editingNewsItem) {
                                updated = newsData.map(n => n.id === editingNewsItem.id ? { ...n, ...editForm, slug: finalSlug, date: finalDate } : n);
                            } else {
                                const newNews = { id: Date.now(), ...editForm, slug: finalSlug, date: finalDate };
                                updated = [newNews, ...newsData];
                            }
                            setNewsData(updated);
                            localStorage.setItem('ldu_news', JSON.stringify(updated));
                            setAdminView('list'); setEditingNewsItem(null); setEditForm({});
                        } catch (err) {
                            console.error('Save error:', err);
                            alert('Gagal menyimpan berita: ' + err.message);
                        } finally {
                            setIsUploading(false);
                        }
                    }}
                        disabled={isUploading}
                        className="px-6 py-3 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 transition-all shadow-md shadow-green-600/20 flex items-center gap-2 disabled:opacity-50">
                        <Save size={18} /> Simpan
                    </button>
                </div>
            </div>
        </div>
    );
};

const NewsList = ({ newsData, setEditForm, setEditingNewsItem, setAdminView, setShowDeleteModal }) => (
    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 shadow-sm border border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="flex justify-between items-center mb-10">
            <div>
                <h3 className="text-2xl font-black">Manajemen Berita</h3>
                <p className="text-sm text-slate-500 font-medium">Publikasikan update dan laporan penyaluran</p>
            </div>
            <button onClick={() => { setEditForm({ title: '', content: '' }); setEditingNewsItem(null); setAdminView('edit-news'); }}
                className="px-6 py-3 bg-green-600 text-white rounded-2xl flex items-center gap-2 font-black shadow-xl shadow-green-600/30 hover:bg-green-700 transition-all">
                <Plus size={20} /> Tulis Berita
            </button>
        </div>
        <div className="grid grid-cols-1 gap-6">
            {newsData.map(item => (
                <div key={item.id} className="bg-slate-50/50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-3xl p-6 flex gap-6 items-center hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 hover:shadow-lg group">
                    <div className="relative flex-shrink-0">
                        <img src={item.image} className="w-24 h-24 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-2 left-2 px-2 py-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-lg text-[8px] font-black uppercase text-green-600 shadow-sm italic">LD-NEWS</div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-green-600 font-black uppercase tracking-[0.2em] mb-2">{item.date}</p>
                        <h4 className="font-black text-slate-900 dark:text-white text-lg truncate group-hover:text-green-600 transition-colors uppercase leading-tight">{item.title}</h4>
                        <div className="flex gap-4 mt-3 text-slate-400 font-bold text-[10px]">
                            <span className="flex items-center gap-1"><Search size={10} /> {item.slug}</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => { setEditForm({ ...item }); setEditingNewsItem(item); setAdminView('edit-news'); }}
                            className="p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-sm hover:text-indigo-600 hover:shadow-md transition-all">
                            <Edit size={18} />
                        </button>
                        <button onClick={() => setShowDeleteModal({ type: 'news', id: item.id })}
                            className="p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-sm hover:text-red-500 hover:shadow-md transition-all">
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const DeleteModal = ({ type, onClose, onConfirm }) => (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-700 animate-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500"><Trash2 size={28} /></div>
            <h3 className="text-xl font-black text-center mb-2">Konfirmasi Hapus</h3>
            <p className="text-slate-500 text-center text-sm mb-8">
                {type === 'news' && 'Hapus berita ini?'}
                {type === 'program' && 'Hapus program ini dan sub-proyeknya?'}
                {type === 'project' && 'Hapus sub-proyek ini?'}
            </p>
            <div className="flex gap-3">
                <button onClick={onClose} className="flex-1 py-3 rounded-xl font-bold bg-slate-100 dark:bg-slate-700">Batal</button>
                <button onClick={onConfirm} className="flex-1 py-3 rounded-xl font-bold text-white bg-red-500">Ya, Hapus</button>
            </div>
        </div>
    </div>
);

const DonationList = ({ donationsData, isLoading, formatCurrency, programsData }) => {
    const [filter, setFilter] = useState('all');

    const filteredDonations = donationsData.filter(d => {
        if (filter === 'all') return true;
        return d.project_id === filter;
    });

    return (
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 shadow-sm border border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                    <h3 className="text-2xl font-black mb-1">Database Donatur</h3>
                    <p className="text-sm text-slate-500 font-medium">Total {donationsData.length} entri ditemukan</p>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Filter Project</span>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-5 py-3 rounded-2xl border border-slate-100 dark:border-slate-700 dark:bg-slate-900 font-bold text-xs outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
                    >
                        <option value="all">Semua Project</option>
                        {programsData.flatMap(p => p.projects || []).map(prj => (
                            <option key={prj.id} value={prj.id}>{prj.title}</option>
                        ))}
                    </select>
                </div>
            </div>

            {isLoading ? (
                <div className="py-20 text-center">
                    <div className="relative w-16 h-16 mx-auto mb-6">
                        <div className="absolute inset-0 border-4 border-green-100 dark:border-green-900/30 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-green-600 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Menyinkronkan Data...</p>
                </div>
            ) : filteredDonations.length === 0 ? (
                <div className="py-32 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[3rem]">
                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Database className="text-slate-300" size={32} />
                    </div>
                    <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2">Belum Ada Data</h4>
                    <p className="font-medium text-slate-400 text-sm">Tidak ada donasi ditemukan untuk kriteria ini.</p>
                </div>
            ) : (
                <div className="overflow-x-auto -mx-10 px-10">
                    <table className="w-full text-left border-separate border-spacing-y-2">
                        <thead>
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Detail Transaksi</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Profil Donatur</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Target Project</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Jumlah</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDonations.map(don => (
                                <tr key={don.id} className="group transition-all duration-300">
                                    <td className="bg-slate-50/50 dark:bg-slate-900/40 px-6 py-5 rounded-l-[1.5rem] border-y border-l border-slate-100 dark:border-slate-700/50 group-hover:bg-white dark:group-hover:bg-slate-800 group-hover:shadow-md transition-all">
                                        <div className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                                            {new Date(don.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </div>
                                        <div className="text-[10px] text-slate-500 font-bold uppercase mt-1">
                                            Ref ID: {don.id.substring(0, 8)}...
                                        </div>
                                    </td>
                                    <td className="bg-slate-50/50 dark:bg-slate-900/40 px-6 py-5 border-y border-slate-100 dark:border-slate-700/50 group-hover:bg-white dark:group-hover:bg-slate-800 group-hover:shadow-md transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center font-black text-xs uppercase shadow-sm">
                                                {don.full_name?.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-black text-sm text-slate-900 dark:text-white capitalize">{don.full_name}</div>
                                                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold mt-0.5">
                                                    <span className={don.gender === 'pria' ? 'text-blue-500' : 'text-pink-500'}>{don.gender}</span>
                                                    {don.wa_number && (
                                                        <a href={`https://wa.me/${don.wa_number.replace(/\D/g, '')}`} target="_blank" className="hover:text-green-600 transition-colors uppercase">
                                                            • Chat WA
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="bg-slate-50/50 dark:bg-slate-900/40 px-6 py-5 border-y border-slate-100 dark:border-slate-700/50 group-hover:bg-white dark:group-hover:bg-slate-800 group-hover:shadow-md transition-all">
                                        <div className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase leading-relaxed max-w-[150px] truncate" title={don.project_title}>
                                            {don.project_title}
                                        </div>
                                    </td>
                                    <td className="bg-slate-50/50 dark:bg-slate-900/40 px-6 py-5 border-y border-slate-100 dark:border-slate-700/50 group-hover:bg-white dark:group-hover:bg-slate-800 group-hover:shadow-md transition-all font-black text-green-600 text-sm whitespace-nowrap">
                                        {formatCurrency(don.amount)}
                                    </td>
                                    <td className="bg-slate-50/50 dark:bg-slate-900/40 px-6 py-5 rounded-r-[1.5rem] border-y border-r border-slate-100 dark:border-slate-700/50 group-hover:bg-white dark:group-hover:bg-slate-800 group-hover:shadow-md transition-all">
                                        <span className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-lg border ${don.status === 'verified'
                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800'
                                            : 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:border-amber-800'
                                            }`}>
                                            {don.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
