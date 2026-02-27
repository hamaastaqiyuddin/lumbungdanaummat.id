import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useQueryClient } from '@tanstack/react-query'; // Import properly

// Data & Utils
import { languages, translations } from './data/translations';
import { formatCurrency, heroImages } from './utils/helpers';
import { useAppData } from './hooks/useAppData';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import MobileMenu from './components/common/MobileMenu';
import RamadhanPlannerPopup from './components/common/RamadhanPlannerPopup';
import FloatingRamadhanIcon from './components/common/FloatingRamadhanIcon';
import Skeleton from './components/common/Skeleton';
import ErrorBoundary from './components/common/ErrorBoundary';
import DonationTicker from './components/common/DonationTicker';

// Section Components (Lazy Loaded for Optimization)
const Hero = lazy(() => import('./components/sections/Hero'));
const Trust = lazy(() => import('./components/sections/Trust'));
const VisiMisi = lazy(() => import('./components/sections/VisiMisi'));
const Impact = lazy(() => import('./components/sections/Impact'));
const Programs = lazy(() => import('./components/sections/Programs'));
const Projects = lazy(() => import('./components/sections/Projects'));
const News = lazy(() => import('./components/sections/News'));
const Testimonials = lazy(() => import('./components/sections/Testimonials'));
const Newsletter = lazy(() => import('./components/sections/Newsletter'));
const Gallery = lazy(() => import('./components/sections/Gallery'));

// Lazy Loaded Page Components
const RamadhanPlanner = lazy(() => import('./components/pages/RamadhanPlanner'));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));
const NewsDetail = lazy(() => import('./components/pages/NewsDetail'));
const ProjectDetail = lazy(() => import('./components/pages/ProjectDetail'));
const DonationForm = lazy(() => import('./components/pages/DonationForm'));
const CheckoutPage = lazy(() => import('./components/pages/CheckoutPage'));

const App = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [lang, setLang] = useState('id'); // 'id', 'en', 'ar', 'zh', 'ja'
    const [showLangMenu, setShowLangMenu] = useState(false);
    const [activePage, setActivePage] = useState('home');
    const [heroImageIndex, setHeroImageIndex] = useState(0);
    const [showRamadhanPopup, setShowRamadhanPopup] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [donationData, setDonationData] = useState({});

    const qc = useQueryClient(); // Correct placement

    // Dynamic Data via Custom Hook (React Query + Supabase)
    const {
        programsData = [],
        newsData = [],
        isLoading,
        error
    } = useAppData();

    const onDataChange = (key) => {
        qc.invalidateQueries({ queryKey: [key] });
    };

    // URL Routing & Navigation Handler
    const navigateTo = (page, id = null) => {
        setActivePage(page);
        window.scrollTo(0, 0);
        setIsMenuOpen(false); // Close menu on navigate

        if (page === 'planner') {
            window.history.pushState(null, '', '/ramadhanplanner');
            setShowRamadhanPopup(false);
        } else if (page === 'news-detail' && id) {
            // Find item to get its slug if available
            const item = newsData.find(n => n.id === id || n.slug === id);
            const pathId = (item && item.slug) ? item.slug : id;
            window.history.pushState(null, '', `/berita/${pathId}`);
            setSelectedItem(id);
            setShowRamadhanPopup(false);
        } else if (page === 'project-detail' && id) {
            window.history.pushState(null, '', `/project/${id}`);
            setSelectedItem(id);
            setShowRamadhanPopup(false);
        } else if (page === 'admin') {
            window.history.pushState(null, '', '/admin');
            setShowRamadhanPopup(false);
        } else {
            window.history.pushState(null, '', '/');
            setSelectedItem(null);
        }
    };


    // Handle initial load and browser back/forward interactions
    useEffect(() => {
        const handlePopState = () => {
            const path = window.location.pathname;
            const newsMatch = path.match(/^\/(news|berita)\/([\w-]+)$/);
            const projectMatch = path.match(/^\/project\/([\w.-]+)$/);

            if (path === '/ramadhanplanner') {
                setActivePage('planner');
                setShowRamadhanPopup(false);
            } else if (path === '/admin') {
                setActivePage('admin');
                setShowRamadhanPopup(false);
            } else if (newsMatch) {
                setActivePage('news-detail');
                const idOrSlug = newsMatch[2];
                // Check if it's a numeric ID or a slug
                setSelectedItem(isNaN(idOrSlug) ? idOrSlug : parseInt(idOrSlug));
                setShowRamadhanPopup(false);
            } else if (projectMatch) {
                setActivePage('project-detail');
                setSelectedItem(projectMatch[1]);
                setShowRamadhanPopup(false);
            } else {
                setActivePage('home');
                setSelectedItem(null);
            }
        };

        // Check initial URL
        handlePopState();

        // Listen for popstate events
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const isRTL = lang === 'ar';
    const t = translations[lang] || translations['en'];
    const currentLang = languages.find(l => l.code === lang) || languages[0];

    return (
        <div className={`${isDarkMode ? 'dark' : ''} ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
            <ErrorBoundary>
                {/* Inject Font Assistant */}
                <style>
                    {` 
                    @import url('https://fonts.googleapis.com/css2?family=Assistant:wght@200;300;400;500;600;700;800&display=swap');
                    body, .font-sans { font-family: 'Assistant', sans-serif !important; }
                    `}
                </style>

                <Navbar
                    t={t}
                    lang={lang}
                    setLang={setLang}
                    showLangMenu={showLangMenu}
                    setShowLangMenu={setShowLangMenu}
                    isRTL={isRTL}
                    isDarkMode={isDarkMode}
                    setIsDarkMode={setIsDarkMode}
                    isMenuOpen={isMenuOpen}
                    setIsMenuOpen={setIsMenuOpen}
                    navigateTo={navigateTo}
                    activePage={activePage}
                    languages={languages}
                    currentLang={currentLang}
                />

                <main>
                    <Suspense fallback={
                        <div className="pt-32 px-4 max-w-7xl mx-auto space-y-12">
                            <Skeleton className="h-20 w-3/4 mx-auto" />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <Skeleton className="h-64 rounded-3xl" />
                                <Skeleton className="h-64 rounded-3xl" />
                                <Skeleton className="h-64 rounded-3xl" />
                            </div>
                        </div>
                    }>
                        {activePage === 'home' && (
                            <>
                                <Hero t={t} heroImages={heroImages} heroImageIndex={heroImageIndex} />
                                <Trust t={t} />
                                <VisiMisi t={t} />
                                <Impact t={t} isDarkMode={isDarkMode} />
                                <Programs t={t} programsData={programsData} navigateTo={navigateTo} formatCurrency={formatCurrency} loading={isLoading} />
                                <Projects t={t} programsData={programsData} navigateTo={navigateTo} formatCurrency={formatCurrency} loading={isLoading} />
                                <News newsData={newsData} t={t} navigateTo={navigateTo} loading={isLoading} />
                                <Gallery t={t} />
                                <Testimonials t={t} />
                                <Newsletter t={t} />
                            </>
                        )}

                        {activePage === 'planner' && (
                            <RamadhanPlanner t={t} navigateTo={navigateTo} />
                        )}

                        {activePage === 'admin' && (
                            <AdminDashboard
                                programsData={programsData}
                                setProgramsData={() => onDataChange('programs')}
                                newsData={newsData}
                                setNewsData={() => onDataChange('news')}
                                formatCurrency={formatCurrency}
                                navigateTo={navigateTo}
                                isLoadingData={isLoading}
                            />
                        )}

                        {activePage === 'news-detail' && (
                            <NewsDetail
                                newsData={newsData}
                                selectedItem={selectedItem}
                                lang={lang}
                                navigateTo={navigateTo}
                            />
                        )}

                        {activePage === 'project-detail' && (
                            <ProjectDetail
                                programsData={programsData}
                                selectedItem={selectedItem}
                                formatCurrency={formatCurrency}
                                t={t}
                                lang={lang}
                                navigateTo={navigateTo}
                            />
                        )}

                        {activePage === 'donation-form' && (
                            <DonationForm
                                project={programsData.flatMap(p => p.projects).find(p => p.id === selectedItem)}
                                navigateTo={navigateTo}
                                setDonationData={setDonationData}
                            />
                        )}

                        {activePage === 'checkout' && (
                            <CheckoutPage
                                donationData={donationData}
                                navigateTo={navigateTo}
                                formatCurrency={formatCurrency}
                            />
                        )}
                    </Suspense>
                </main>

                <Footer t={t} isRTL={isRTL} />

                <MobileMenu
                    t={t}
                    isMenuOpen={isMenuOpen}
                    setIsMenuOpen={setIsMenuOpen}
                    isRTL={isRTL}
                    navigateTo={navigateTo}
                />

                <RamadhanPlannerPopup
                    showRamadhanPopup={showRamadhanPopup}
                    setShowRamadhanPopup={setShowRamadhanPopup}
                    navigateTo={navigateTo}
                />

                <FloatingRamadhanIcon
                    onClick={() => setShowRamadhanPopup(true)}
                    showRamadhanPopup={showRamadhanPopup}
                    activePage={activePage}
                />

                <DonationTicker />
            </ErrorBoundary>
        </div>
    );
};

export default App;
