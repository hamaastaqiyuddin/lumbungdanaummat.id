import React, { useState, useEffect } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell
} from 'recharts';
import { TrendingUp, BarChart3 } from 'lucide-react';

const AnalyticsCharts = ({ donationsData, formatCurrency }) => {
    const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains('dark'));
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    const chartColors = {
        grid: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
        text: isDark ? '#94a3b8' : '#64748b',
        tooltipBg: isDark ? '#1e293b' : '#ffffff',
        tooltipBorder: isDark ? '#334155' : '#e2e8f0'
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Donation Trend (Area Chart) */}
            <div className="bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-700/50 shadow-sm transition-all duration-500 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-2xl">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black">Tren Donasi</h3>
                        <p className="text-sm text-slate-500 font-medium">Statistik 7 hari terakhir</p>
                    </div>
                </div>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={donationsData?.reduce((acc, d) => {
                                const date = new Date(d.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
                                const existing = acc.find(item => item.date === date);
                                if (existing) {
                                    existing.amount += Number(d.amount);
                                } else {
                                    acc.push({ date, amount: Number(d.amount) });
                                }
                                return acc;
                            }, []).reverse().slice(-7) || []}
                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartColors.grid} />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: chartColors.text }} />
                            <YAxis hide />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: '1.25rem',
                                    border: `1px solid ${chartColors.tooltipBorder}`,
                                    backgroundColor: chartColors.tooltipBg,
                                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                                    color: isDark ? '#fff' : '#000'
                                }}
                                itemStyle={{ fontWeight: 800 }}
                                cursor={{ stroke: '#16a34a', strokeWidth: 2 }}
                                formatter={(value) => formatCurrency(value)}
                            />
                            <Area type="monotone" dataKey="amount" stroke="#16a34a" strokeWidth={4} fillOpacity={1} fill="url(#colorAmount)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Program Distribution (Bar Chart) */}
            <div className="bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-700/50 shadow-sm transition-all duration-500 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-2xl">
                        <BarChart3 size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black">Distribusi Program</h3>
                        <p className="text-sm text-slate-500 font-medium">Berdasarkan volume donasi</p>
                    </div>
                </div>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={donationsData?.reduce((acc, d) => {
                                const program = d.program_title || 'Lainnya';
                                const existing = acc.find(item => item.name === program);
                                if (existing) {
                                    existing.amount += Number(d.amount);
                                } else {
                                    acc.push({ name: program.substring(0, 15), amount: Number(d.amount) });
                                }
                                return acc;
                            }, []).sort((a, b) => b.amount - a.amount).slice(0, 5) || []}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                        >
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: chartColors.text }} width={80} />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: '1.25rem',
                                    border: `1px solid ${chartColors.tooltipBorder}`,
                                    backgroundColor: chartColors.tooltipBg,
                                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                                    color: isDark ? '#fff' : '#000'
                                }}
                                itemStyle={{ fontWeight: 800 }}
                                cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}
                                formatter={(value) => formatCurrency(value)}
                            />
                            <Bar dataKey="amount" radius={[0, 8, 8, 0]} barSize={20}>
                                {(donationsData || []).map((_entry, index) => (
                                    <Cell key={`cell-${index}`} fill={['#16a34a', '#2563eb', '#ea580c', '#0891b2', '#7c3aed'][index % 5]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsCharts;
