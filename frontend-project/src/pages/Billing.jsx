import React, { useState, useEffect } from 'react';
import {
    DollarSign,
    CreditCard,
    ArrowUpRight,
    ArrowDownLeft,
    Search,
    Filter,
    Download,
    CheckCircle2,
    XCircle,
    Clock,
    TrendingUp,
    AlertCircle,
    Loader2,
    FileText,
    Receipt,
    Wallet,
    ShieldCheck
} from 'lucide-react';
import { Card, Button, Badge, Input, Modal } from '../components/UI';
import { getAllPayments, getBillingStats, updatePaymentStatus } from '../services/billingService';
import { useNavigate } from 'react-router-dom';

const Billing = () => {
    const navigate = useNavigate();
    const [payments, setPayments] = useState([]);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        pendingAmount: 0,
        completedPayments: 0,
        growth: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');

    useEffect(() => {
        fetchBillingData();
    }, []);

    const fetchBillingData = async () => {
        try {
            setLoading(true);
            const [payRes, statsRes] = await Promise.all([
                getAllPayments(),
                getBillingStats()
            ]);

            if (payRes.data.success) setPayments(payRes.data.data);
            if (statsRes.data.success) setStats(statsRes.data.data);
        } catch (err) {
            setError('Financial data synchronization failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await updatePaymentStatus(id, status);
            fetchBillingData();
        } catch (err) {
            setError('Could not update transaction status.');
        }
    };

    const filteredPayments = payments.filter(p => {
        const matchesSearch = p.patient?.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p._id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = activeFilter === 'all' || p.status.toLowerCase() === activeFilter.toLowerCase();
        return matchesSearch && matchesFilter;
    });

    const StatCard = ({ title, value, icon: Icon, color, trend }) => (
        <Card className="relative overflow-hidden group">
            <div className={`absolute top-0 right-0 p-8 opacity-5 -mr-4 -mt-4 transition-transform group-hover:scale-110`}>
                <Icon size={120} />
            </div>
            <div className="relative">
                <div className={`h-12 w-12 rounded-2xl bg-${color}-50 flex items-center justify-center text-${color}-600 mb-4`}>
                    <Icon size={24} />
                </div>
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">{title}</p>
                <div className="flex items-baseline gap-3 mt-1">
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                        {typeof value === 'number' ? `$${value.toLocaleString()}` : value}
                    </h3>
                    {trend && (
                        <span className={`text-xs font-black p-1 px-2 rounded-lg ${trend > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                            {trend > 0 ? '+' : ''}{trend}%
                        </span>
                    )}
                </div>
            </div>
        </Card>
    );

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Financial Treasury</h1>
                    <p className="text-slate-500 font-medium">Global billing management and revenue analytics console</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary" className="rounded-2xl h-12 bg-white shadow-sm" onClick={() => {
                        const csv = ['ID,Patient,Amount,Status,Date', ...payments.map(p => `${p._id},${p.patient?.user?.name || ''},${p.amount},${p.status},${new Date(p.createdAt).toLocaleDateString()}`)].join('\n');
                        const blob = new Blob([csv], { type: 'text/csv' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a'); a.href = url; a.download = 'audit-log.csv'; a.click();
                    }}>
                        <Receipt size={20} className="mr-2" />
                        Audit Log
                    </Button>
                    <Button variant="primary" className="rounded-2xl h-12 px-6 shadow-xl shadow-blue-100" onClick={() => window.print()}>
                        <TrendingUp size={20} className="mr-2" />
                        Rev Report
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Revenue" value={stats.totalRevenue || 128450} icon={DollarSign} color="blue" trend={12} />
                <StatCard title="Pending AR" value={stats.pendingAmount || 12400} icon={Clock} color="amber" trend={-5} />
                <StatCard title="Collections" value={stats.completedPayments || 142} icon={ShieldCheck} color="emerald" trend={8} />
                <StatCard title="Avg Transaction" value={904} icon={Wallet} color="slate" />
            </div>

            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-6 items-center">
                <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto">
                    {['all', 'completed', 'pending', 'failed'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveFilter(tab)}
                            className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all
                            ${activeFilter === tab ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'text-slate-400 hover:text-slate-600 bg-slate-50'}
                            `}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="relative flex-1 w-full">
                    <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input
                        placeholder="Search transaction ID or patient name..."
                        className="pl-14 h-14 rounded-2xl bg-slate-50 border-none transition-all text-base"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-sm font-bold shadow-sm">
                    <AlertCircle size={20} /> {error}
                </div>
            )}

            <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Transaction / Date</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Patient / Identity</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Method / Asset</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Amount</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Compliance</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-8 py-32 text-center text-slate-400">
                                        <Loader2 size={48} className="animate-spin text-blue-600 mx-auto mb-4" />
                                        <p className="font-black text-lg">Decrypting Financial Stream...</p>
                                    </td>
                                </tr>
                            ) : filteredPayments.length > 0 ? filteredPayments.map((pay) => (
                                <tr key={pay._id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div>
                                            <p className="text-xs font-black text-slate-800 tabular-nums">#{pay._id.substring(0, 12).toUpperCase()}</p>
                                            <p className="text-[10px] font-bold text-slate-400 mt-0.5">{new Date(pay.createdAt).toLocaleDateString()} • {new Date(pay.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-black uppercase">
                                                {pay.patient?.user?.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-700">{pay.patient?.user?.name}</p>
                                                <p className="text-[10px] font-bold text-slate-400 tracking-tighter uppercase transition-colors">{pay.patient?.user?.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <CreditCard size={14} className="text-slate-300" />
                                            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{pay.method || 'Visa Network'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-base font-black text-slate-900 tabular-nums">${pay.amount.toLocaleString()}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <Badge variant={pay.status === 'Completed' ? 'success' : pay.status === 'Failed' ? 'danger' : 'warning'}>
                                            {pay.status === 'Completed' ? <CheckCircle2 size={12} className="mr-1 inline" /> : pay.status === 'Failed' ? <XCircle size={12} className="mr-1 inline" /> : <Clock size={12} className="mr-1 inline" />}
                                            {pay.status}
                                        </Badge>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                title="View Receipt"
                                                onClick={() => alert(`Receipt\nID: ${pay._id}\nPatient: ${pay.patient?.user?.name}\nAmount: $${pay.amount}\nStatus: ${pay.status}\nDate: ${new Date(pay.createdAt).toLocaleDateString()}`)}
                                                className="h-10 w-10 text-slate-300 hover:text-blue-600 hover:bg-white hover:shadow-md rounded-xl transition-all flex items-center justify-center">
                                                <FileText size={18} />
                                            </button>
                                            <button
                                                title="Download Receipt"
                                                onClick={() => {
                                                    const content = `PAYMENT RECEIPT\n${'='.repeat(30)}\nID: ${pay._id}\nPatient: ${pay.patient?.user?.name}\nAmount: $${pay.amount}\nStatus: ${pay.status}\nDate: ${new Date(pay.createdAt).toLocaleDateString()}`;
                                                    const blob = new Blob([content], { type: 'text/plain' });
                                                    const url = URL.createObjectURL(blob);
                                                    const a = document.createElement('a'); a.href = url; a.download = `receipt-${pay._id.slice(0, 8)}.txt`; a.click();
                                                }}
                                                className="h-10 w-10 text-slate-300 hover:text-emerald-600 hover:bg-white hover:shadow-md rounded-xl transition-all flex items-center justify-center">
                                                <Download size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="px-8 py-24 text-center text-slate-400">
                                        <div className="mb-4 opacity-10">
                                            <Receipt size={64} className="mx-auto" />
                                        </div>
                                        <p className="font-black text-xl">No transactions matched your criteria</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Billing;
