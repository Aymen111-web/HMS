import React, { useState } from 'react';
import {
    BarChart3,
    PieChart,
    LineChart,
    Download,
    Calendar,
    FileText,
    TrendingUp,
    Users,
    Activity,
    ArrowUpRight,
    Stethoscope,
    Building2,
    DollarSign,
    Filter,
    Clock
} from 'lucide-react';
import { Card, Button, Badge } from '../components/UI';

const Reports = () => {
    const [activeRange, setActiveRange] = useState('This Month');

    const reportCategories = [
        { id: 'clinical', name: 'Clinical Analytics', icon: Activity, color: 'blue' },
        { id: 'financial', name: 'Financial Reports', icon: DollarSign, color: 'emerald' },
        { id: 'operations', name: 'Operational KPIs', icon: Building2, color: 'purple' },
        { id: 'staff', name: 'Staff Performance', icon: Stethoscope, color: 'amber' }
    ];

    const stats = [
        { label: 'Patient Retention', value: '84%', trend: '+4.2%', icon: Users },
        { label: 'Avg Consult Time', value: '18m', trend: '-2m', icon: Clock },
        { label: 'Bed Occupancy', value: '92%', trend: '+1%', icon: Building2 },
        { label: 'Revenue/Patient', value: '$420', trend: '+$18', icon: TrendingUp }
    ];

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Intelligence & Analytics</h1>
                    <p className="text-slate-500 font-medium mt-1">Enterprise reporting and mission-critical data extraction</p>
                </div>
                <div className="flex gap-3 bg-white p-1 rounded-2xl shadow-sm border border-slate-100">
                    {['Quarter', 'Month', 'Week'].map(range => (
                        <button
                            key={range}
                            onClick={() => setActiveRange(range)}
                            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all
                            ${activeRange === range ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}
                            `}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((s, i) => (
                    <Card key={i} className="border-none shadow-sm ring-1 ring-slate-100 p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                <s.icon size={20} />
                            </div>
                            <Badge variant={s.trend.startsWith('+') ? 'success' : 'info'}>{s.trend}</Badge>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                        <h3 className="text-2xl font-black text-slate-900 mt-1">{s.value}</h3>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 rounded-[3rem] p-8" title="Departmental Efficiency Matrix">
                    <div className="h-64 flex items-end gap-6 px-4 pt-10">
                        {[
                            { name: 'Cardio', val: 88, color: 'bg-blue-600' },
                            { name: 'Onco', val: 72, color: 'bg-purple-600' },
                            { name: 'Neuro', val: 95, color: 'bg-emerald-600' },
                            { name: 'Pedia', val: 64, color: 'bg-rose-600' },
                            { name: 'Ortho', val: 82, color: 'bg-amber-600' }
                        ].map((d, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                                <div className="w-full relative">
                                    <div
                                        className={`w-full ${d.color} rounded-t-2xl transition-all duration-1000 origin-bottom`}
                                        style={{ height: `${d.val * 2}px` }}
                                    >
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-slate-900 text-white text-[10px] font-black py-2 px-3 rounded-xl transition-all">
                                            {d.val}%
                                        </div>
                                    </div>
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{d.name}</span>
                            </div>
                        ))}
                    </div>
                </Card>

                <div className="space-y-6">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] px-2">Quick Exports</h3>
                    {reportCategories.map(cat => (
                        <button key={cat.id} className="w-full group p-6 rounded-[2rem] bg-white border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50/50 transition-all text-left flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`h-12 w-12 rounded-2xl bg-${cat.color}-50 text-${cat.color}-600 flex items-center justify-center`}>
                                    <cat.icon size={24} />
                                </div>
                                <div>
                                    <p className="font-black text-slate-800 tracking-tight">{cat.name}</p>
                                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">XLSX, PDF, CSV available</p>
                                </div>
                            </div>
                            <Download size={20} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
                        </button>
                    ))}
                </div>
            </div>

            <Card className="rounded-[3rem] p-8" title="Recent Monthly Activity">
                <div className="overflow-x-auto mt-6">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="text-slate-400 font-black uppercase tracking-widest text-left">
                                <th className="px-4 py-4">Reporting Phase</th>
                                <th className="px-4 py-4">Data Integrity</th>
                                <th className="px-4 py-4">Total Interactions</th>
                                <th className="px-4 py-4">Net Result</th>
                                <th className="px-4 py-4 text-right">Protocol</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 font-bold text-slate-700">
                            {[
                                { date: 'October 2026', integrity: '99.9%', count: '1,420', result: '+$42,800', status: 'Finalized' },
                                { date: 'September 2026', integrity: '100%', count: '1,380', result: '+$38,500', status: 'Finalized' },
                                { date: 'August 2026', integrity: '99.8%', count: '1,450', result: '+$45,200', status: 'Archived' }
                            ].map((row, i) => (
                                <tr key={i} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-4 py-6 font-black">{row.date}</td>
                                    <td className="px-4 py-6">
                                        <div className="flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                                            {row.integrity}
                                        </div>
                                    </td>
                                    <td className="px-4 py-6 text-slate-500 tabular-nums">{row.count} Nodes</td>
                                    <td className="px-4 py-6 text-emerald-600 tabular-nums font-black">{row.result}</td>
                                    <td className="px-4 py-6 text-right">
                                        <Badge variant="secondary" className="bg-slate-100 text-slate-500">{row.status}</Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default Reports;
