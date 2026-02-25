import React, { useState, useEffect } from 'react';
import {
    Users,
    CalendarCheck,
    Activity,
    Clock,
    ChevronRight,
    Loader2,
    AlertCircle,
    DollarSign,
    ArrowUpRight,
    Zap,
    Globe,
    Stethoscope
} from 'lucide-react';
import { Card, Button, Badge } from '../components/UI';
import { getAdminAnalytics } from '../services/adminService';
import { getRecentActivities } from '../services/dashboardService';
import { useNavigate } from 'react-router-dom';


const StatCard = ({ title, value, icon: Icon, trend, color, prefix = "" }) => (
    <Card className="relative overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-none bg-white shadow-sm ring-1 ring-slate-100">
        <div className={`absolute top-0 right-0 p-6 opacity-5 -mr-2 -mt-2 transition-transform group-hover:scale-110`}>
            <Icon size={100} />
        </div>
        <div className="relative">
            <div className={`h-12 w-12 rounded-2xl ${color} bg-opacity-10 text-${color.split('-')[1]}-600 flex items-center justify-center mb-4`}>
                <Icon size={24} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{title}</p>
            <div className="flex items-baseline gap-2 mt-2">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">{prefix}{value}</h3>
                {trend && (
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {trend}
                    </span>
                )}
            </div>
        </div>
    </Card>
);

const SimpleBarChart = ({ data, color = "blue" }) => {
    if (!data || data.length === 0) return <div className="h-40 flex items-center justify-center text-slate-400 italic">No historical data found</div>;
    const max = Math.max(...data.map(d => d.count)) || 1;
    return (
        <div className="h-48 flex items-end gap-3 px-4 pt-6">
            {data.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                    <div
                        className={`w-full bg-${color}-500/10 group-hover:bg-${color}-500 transition-all rounded-t-xl relative`}
                        style={{ height: `${(d.count / max) * 100}%` }}
                    >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-slate-900 text-white text-[10px] font-black py-1.5 px-3 rounded-xl whitespace-nowrap z-20 transition-all scale-75 group-hover:scale-100">
                            {d.count} UNITS
                        </div>
                    </div>
                    <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest truncate w-full text-center">{d.name}</span>
                </div>
            ))}
        </div>
    );
};

const Dashboard = () => {
    const navigate = useNavigate();
    const [analytics, setAnalytics] = useState(null);
    const [recentAppointments, setRecentAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [analyticsRes, recentRes] = await Promise.all([
                getAdminAnalytics(),
                getRecentActivities()
            ]);
            if (analyticsRes.data.success) setAnalytics(analyticsRes.data.data);
            if (recentRes.data.success) setRecentAppointments(recentRes.data.data);
        } catch (err) {
            setError('Global Intelligence Sync Failed.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="h-[80vh] flex flex-col items-center justify-center gap-6">
                <div className="relative">
                    <Loader2 size={64} className="animate-spin text-blue-600" />
                    <Activity size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-400 animate-pulse" />
                </div>
                <p className="font-black text-slate-400 uppercase tracking-[0.3em] text-xs">Authenticating Intelligence...</p>
            </div>
        );
    }

    const { summary, charts } = analytics || {};

    return (
        <div className="space-y-10 pb-16">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">System Live</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Executive Dashboard</h1>
                    <p className="text-slate-500 font-medium mt-1">Global Command Hub • HMS Enterprise v4.0</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <Button
                        variant="secondary"
                        className="flex-1 md:flex-none rounded-2xl h-14 bg-white border-none shadow-sm font-bold"
                        onClick={() => navigate('/admin/billing')}
                    >
                        Financials
                    </Button>
                    <Button
                        variant="primary"
                        className="flex-1 md:flex-none rounded-2xl h-14 px-8 shadow-2xl shadow-blue-100 font-black tracking-wide"
                        onClick={() => {
                            setIsGeneratingReport(true);
                            setTimeout(() => { setIsGeneratingReport(false); alert('Cloud Intelligence Report Generated.'); }, 1500);
                        }}
                    >
                        {isGeneratingReport ? <Loader2 className="animate-spin" /> : <Zap size={20} className="mr-2" />}
                        Run Intelligence
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                <StatCard title="Total Capacity" value={summary?.totalPatients || 0} icon={Users} trend="+18% YoY" color="bg-blue-600" />
                <StatCard title="Medical Staff" value={summary?.totalDoctors || 0} icon={Stethoscope} color="bg-indigo-600" />
                <StatCard title="Active Flux" value={summary?.totalAppointments || 0} icon={CalendarCheck} color="bg-purple-600" />
                <StatCard title="Real-time Ops" value={summary?.todayAppointments || 0} icon={Clock} trend="HIGH" color="bg-amber-600" />
                <StatCard title="Critical Alert" value={summary?.urgentCases || 0} icon={AlertCircle} color="bg-rose-600" />
                <StatCard title="Equity Pool" value={summary?.revenue?.toLocaleString() || '0'} prefix="$" icon={DollarSign} trend="+2.4k" color="bg-emerald-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 rounded-[3rem] p-8 border-none ring-1 ring-slate-100 shadow-sm" title="Clinical Volatility" subtitle="Unit flow visualization last 7 days">
                    <SimpleBarChart data={charts?.appointmentsTrend} color="blue" />
                </Card>

                <Card className="rounded-[3rem] p-8 border-none ring-1 ring-slate-100 shadow-sm" title="Sector Analytics">
                    <div className="space-y-6 mt-6">
                        {charts?.departmentStats?.map((dept, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{dept.name}</span>
                                    <span className="text-xs font-black text-slate-900">{dept.count} Units</span>
                                </div>
                                <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full bg-blue-600 rounded-full transition-all duration-1000 delay-${i * 100}`}
                                        style={{ width: `${(dept.count / (summary?.totalDoctors || 1)) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button variant="ghost" className="w-full mt-8 rounded-2xl group text-blue-600 font-black uppercase text-[10px] tracking-widest" onClick={() => navigate('/admin/departments')}>
                        Examine Sectors <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <Card className="lg:col-span-3 rounded-[3rem] border-none ring-1 ring-slate-100 shadow-sm" title="Real-time Activity Stream">
                    <div className="overflow-x-auto mt-4 px-2">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-50">
                                    <th className="px-4 py-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Patient Node</th>
                                    <th className="px-4 py-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Consultant</th>
                                    <th className="px-4 py-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Time Dimension</th>
                                    <th className="px-4 py-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Protocol</th>
                                    <th className="px-4 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {recentAppointments.map((app) => (
                                    <tr key={app._id} className="group hover:bg-slate-50/50 transition-all">
                                        <td className="px-4 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 text-xs font-black">
                                                    {app.patient?.user?.name?.charAt(0)}
                                                </div>
                                                <span className="text-sm font-black text-slate-800">{app.patient?.user?.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-5 font-bold text-slate-500 text-xs">Dr. {app.doctor?.user?.name}</td>
                                        <td className="px-4 py-5 tabular-nums text-xs font-black text-slate-700">{app.time}</td>
                                        <td className="px-4 py-5">
                                            <Badge variant={app.status === 'Completed' ? 'success' : app.status === 'Cancelled' ? 'danger' : 'warning'} className="px-3">
                                                {app.status}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-5 text-right">
                                            <button className="h-8 w-8 rounded-lg hover:bg-white hover:shadow-md text-slate-300 hover:text-blue-600 transition-all flex items-center justify-center" onClick={() => navigate('/admin/appointments')}>
                                                <ArrowUpRight size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                <div className="space-y-6">
                    <Card title="Quick Deploy" className="rounded-[3rem] border-none ring-1 ring-slate-100 shadow-sm overflow-hidden">
                        <div className="space-y-3 mt-4">
                            <button className="w-full p-4 rounded-2xl bg-slate-50 hover:bg-blue-600 hover:text-white transition-all text-left group" onClick={() => navigate('/admin/patients')}>
                                <p className="text-xs font-black uppercase tracking-widest opacity-60 group-hover:opacity-100">Identity</p>
                                <p className="font-black text-sm">Register Patient</p>
                            </button>
                            <button className="w-full p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-600 hover:text-white transition-all text-left group" onClick={() => navigate('/admin/appointments')}>
                                <p className="text-xs font-black uppercase tracking-widest opacity-60 group-hover:opacity-100">Operation</p>
                                <p className="font-black text-sm">Flash Appointment</p>
                            </button>
                        </div>
                    </Card>

                    <div className="p-8 rounded-[3rem] bg-slate-900 text-white relative overflow-hidden group">
                        <Globe size={120} className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform" />
                        <div className="relative">
                            <h4 className="text-xl font-black italic">Network Pulse</h4>
                            <p className="text-slate-400 text-xs mt-2 leading-relaxed">System-wide monitoring enabled. No critical faults detected across nodes.</p>
                            <Button variant="primary" className="mt-6 w-full h-12 rounded-xl bg-white text-slate-900 border-none hover:bg-blue-600 hover:text-white" onClick={() => alert('Infrastructure Integrity: 100%')}>
                                Global Audit
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
