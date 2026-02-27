import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 font-sans">
                    <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 text-center border border-red-100 dark:border-red-900/30">
                        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600 dark:text-red-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-4">Waduh, Sesuatu Keliru!</h1>
                        <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                            Terjadi kesalahan teknis yang tidak terduga. Silakan coba segarkan halaman atau kembali ke Beranda.
                        </p>
                        <div className="space-y-3">
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full py-4 bg-green-600 text-white font-black rounded-2xl shadow-xl shadow-green-600/20 hover:bg-green-500 transition-all uppercase tracking-widest text-sm"
                            >
                                Segarkan Halaman
                            </button>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-black rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all uppercase tracking-widest text-sm"
                            >
                                Kembali ke Beranda
                            </button>
                        </div>
                        {process.env.NODE_ENV === 'development' && (
                            <details className="mt-8 text-left text-xs text-red-500 font-mono bg-red-50 dark:bg-red-900/10 p-4 rounded-xl overflow-auto max-h-40">
                                <summary className="cursor-pointer font-bold mb-2">Error Details (Dev Only)</summary>
                                {this.state.error?.toString()}
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
