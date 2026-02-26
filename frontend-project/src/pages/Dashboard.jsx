import React, { useState, useEffect, useCallback } from 'react';
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
    Stethoscope,
    Wifi,
    WifiOff,
    UserCheck,
    RefreshCw
} from 'lucide-react';
import { Card, Button, Badge } from '../components/UI';
import { getAdminAnalytics, getActiveUsers } from '../services/adminService';
import { getRecentActivities } from '../services/dashboardService';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, trend, color, prefix = "" }) => (
    <Card className="relative overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-none bg-white shadow-sm ring-1 ring-slate-100">
        <div className={`absolute top-0 right-0 p-6 opacity-5 -mr-2 -mt-2 transition-transform group-hover:scale-110`}>
            <Icon size={100} />
        </div>
        <div className="relative">
            <div className={`h-12 w-12 rounded-2xl ${color} bg-opacity-10 flex items-center justify-center mb-4`}>
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
                        className={`w-full bg-blue-500/10 group-hover:bg-blue-500 transition-all rounded-t-xl relative`}
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

// Active user row component
const ActiveUserRow = ({ u, isDoctor }) => {
    const loginTime = u.lastLogin ? new Date(u.lastLogin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—';
    const initial = u.name?.charAt(0)?.toUpperCase();
    return (
        <div className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0">
            <div className={`h-9 w-9 rounded-xl flex items-center justify-center text-white text-sm font-black shrink-0 ${isDoctor ? 'bg-indigo-500' : 'bg-emerald-500'}`}>
                {initial}
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-800 text-sm truncate">{u.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{isDoctor ? (u.profile?.specialization || 'Doctor') : 'Patient'}</p>
            </div>
            <div className="text-right shrink-0">
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
                    {loginTime}
                </span>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const navigate = useNavigate();
    const [analytics, setAnalytics] = useState(null);
    const [recentAppointments, setRecentAppointments] = useState([]);
    const [activeUsers, setActiveUsers] = useState({ doctors: [], patients: [], doctorCount: 0, patientCount: 0, total: 0 });
    const [loading, setLoading] = useState(true);
    const [activeUsersLoading, setActiveUsersLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);
    const [lastRefresh, setLastRefresh] = useState(new Date());

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // Auto-refresh active users every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            fetchActiveUsers();
            setLastRefresh(new Date());
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchActiveUsers = useCallback(async () => {
        setActiveUsersLoading(true);
        try {
            const res = await getActiveUsers();
            if (res.data.success) setActiveUsers(res.data.data);
        } catch (err) {
            console.error('Active users fetch failed:', err.message);
        } finally {
            setActiveUsersLoading(false);
        }
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [analyticsRes, recentRes, activeRes] = await Promise.allSettled([
                getAdminAnalytics(),
                getRecentActivities(),
                getActiveUsers()
            ]);
            if (analyticsRes.status === 'fulfilled' && analyticsRes.value.data.success) {
                setAnalytics(analyticsRes.value.data.data);
            }
            if (recentRes.status === 'fulfilled' && recentRes.value.data.success) {
                setRecentAppointments(recentRes.value.data.data);
            }
            if (activeRes.status === 'fulfilled' && activeRes.value.data.success) {
                setActiveUsers(activeRes.value.data.data);
            }
        } catch (err) {
            setError('Dashboard sync failed.');
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
            {/* Header */}
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
                            setTimeout(() => { setIsGeneratingReport(false); window.print(); }, 1000);
                        }}
                    >
                        {isGeneratingReport ? <Loader2 className="animate-spin" /> : <Zap size={20} className="mr-2" />}
                        Run Intelligence
                    </Button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                <StatCard title="Total Patients" value={summary?.totalPatients || 0} icon={Users} trend="+18% YoY" color="bg-blue-600 text-blue-600" />
                <StatCard title="Medical Staff" value={summary?.totalDoctors || 0} icon={Stethoscope} color="bg-indigo-600 text-indigo-600" />
                <StatCard title="Appointments" value={summary?.totalAppointments || 0} icon={CalendarCheck} color="bg-purple-600 text-purple-600" />
                <StatCard title="Today's Ops" value={summary?.todayAppointments || 0} icon={Clock} trend="HIGH" color="bg-amber-600 text-amber-600" />
                <StatCard title="Critical Alert" value={summary?.urgentCases || 0} icon={AlertCircle} color="bg-rose-600 text-rose-600" />
                <StatCard title="Revenue" value={summary?.revenue?.toLocaleString() || '0'} prefix="$" icon={DollarSign} trend="+2.4k" color="bg-emerald-600 text-emerald-600" />
            </div>

            {/* Active Users Panel (NEW) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Online Doctors count card */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-indigo-500 p-7 text-white shadow-xl shadow-indigo-100">
                    <div className="absolute -right-6 -bottom-6 opacity-10">
                        <Stethoscope size={100} />
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                            <Stethoscope size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Online Doctors</p>
                            <p className="text-4xl font-black">{activeUsers.doctorCount}</p>
                        </div>
                    </div>
                    <p className="text-xs font-semibold opacity-60">Active right now in the system</p>
                </div>

                {/* Online Patients count card */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-500 p-7 text-white shadow-xl shadow-emerald-100">
                    <div className="absolute -right-6 -bottom-6 opacity-10">
                        <Users size={100} />
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                            <UserCheck size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Online Patients</p>
                            <p className="text-4xl font-black">{activeUsers.patientCount}</p>
                        </div>
                    </div>
                    <p className="text-xs font-semibold opacity-60">Active right now in the system</p>
                </div>

                {/* Total active */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 to-slate-700 p-7 text-white shadow-xl shadow-slate-200">
                    <div className="absolute -right-6 -bottom-6 opacity-10">
                        <Wifi size={100} />
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                            <Wifi size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Total Online</p>
                            <p className="text-4xl font-black">{activeUsers.total}</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold opacity-60">
                            Last refresh: {lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <button
                            onClick={() => { fetchActiveUsers(); setLastRefresh(new Date()); }}
                            className="h-7 w-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                            title="Refresh"
                        >
                            {activeUsersLoading
                                ? <Loader2 size={13} className="animate-spin" />
                                : <RefreshCw size={13} />
                            }
                        </button>
                    </div>
                </div>
            </div>

            {/* Active Users Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Active Doctors List */}
                <Card
                    title="Online Doctors"
                    subtitle={`${activeUsers.doctorCount} doctor${activeUsers.doctorCount !== 1 ? 's' : ''} currently logged in`}
                    className="rounded-[2rem] border-none ring-1 ring-slate-100 shadow-sm"
                >
                    {activeUsers.doctors.length === 0 ? (
                        <div className="py-10 flex flex-col items-center gap-3 text-slate-300">
                            <WifiOff size={36} />
                            <p className="font-bold text-sm">No doctors online</p>
                        </div>
                    ) : (
                        <div className="mt-2">
                            {activeUsers.doctors.map(u => (
                                <ActiveUserRow key={u._id} u={u} isDoctor={true} />
                            ))}
                        </div>
                    )}
                </Card>

                {/* Active Patients List */}
                <Card
                    title="Online Patients"
                    subtitle={`${activeUsers.patientCount} patient${activeUsers.patientCount !== 1 ? 's' : ''} currently logged in`}
                    className="rounded-[2rem] border-none ring-1 ring-slate-100 shadow-sm"
                >
                    {activeUsers.patients.length === 0 ? (
                        <div className="py-10 flex flex-col items-center gap-3 text-slate-300">
                            <WifiOff size={36} />
                            <p className="font-bold text-sm">No patients online</p>
                        </div>
                    ) : (
                        <div className="mt-2">
                            {activeUsers.patients.map(u => (
                                <ActiveUserRow key={u._id} u={u} isDoctor={false} />
                            ))}
                        </div>
                    )}
                </Card>
            </div>

            {/* Chart + Department Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 rounded-[3rem] p-8 border-none ring-1 ring-slate-100 shadow-sm" title="Clinical Volatility" subtitle="Appointment flow last 7 days">
                    <SimpleBarChart data={charts?.appointmentsTrend} color="blue" />
                </Card>

                <Card className="rounded-[3rem] p-8 border-none ring-1 ring-slate-100 shadow-sm" title="Sector Analytics">
                    <div className="space-y-6 mt-6">
                        {charts?.departmentStats?.length > 0 ? charts.departmentStats.map((dept, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{dept.name}</span>
                                    <span className="text-xs font-black text-slate-900">{dept.count} Units</span>
                                </div>
                                <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-600 rounded-full transition-all duration-1000"
                                        style={{ width: `${(dept.count / (summary?.totalDoctors || 1)) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        )) : (
                            <p className="text-slate-300 italic text-sm text-center py-8">No department data</p>
                        )}
                    </div>
                    <Button variant="ghost" className="w-full mt-8 rounded-2xl group text-blue-600 font-black uppercase text-[10px] tracking-widest" onClick={() => navigate('/admin/departments')}>
                        Examine Sectors <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </Card>
            </div>

            {/* Recent Activity Stream + Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <Card className="lg:col-span-3 rounded-[3rem] border-none ring-1 ring-slate-100 shadow-sm" title="Real-time Activity Stream">
                    <div className="overflow-x-auto mt-4 px-2">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-50">
                                    <th className="px-4 py-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Patient</th>
                                    <th className="px-4 py-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Doctor</th>
                                    <th className="px-4 py-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Time</th>
                                    <th className="px-4 py-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Status</th>
                                    <th className="px-4 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {recentAppointments.length > 0 ? recentAppointments.map((app) => (
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
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-12 text-center text-slate-300 italic">No recent appointments</td>
                                    </tr>
                                )}
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
                            <button className="w-full p-4 rounded-2xl bg-indigo-50 hover:bg-indigo-600 hover:text-white transition-all text-left group" onClick={() => navigate('/admin/doctors')}>
                                <p className="text-xs font-black uppercase tracking-widest opacity-60 group-hover:opacity-100">Staff</p>
                                <p className="font-black text-sm">Add Doctor</p>
                            </button>
                            <button className="w-full p-4 rounded-2xl bg-amber-50 hover:bg-amber-600 hover:text-white transition-all text-left group" onClick={() => navigate('/admin/pharmacists')}>
                                <p className="text-xs font-black uppercase tracking-widest opacity-60 group-hover:opacity-100">Pharmacy</p>
                                <p className="font-black text-sm">Add Pharmacist</p>
                            </button>
                        </div>
                    </Card>

                    <div className="p-8 rounded-[3rem] bg-slate-900 text-white relative overflow-hidden group">
                        <Globe size={120} className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform" />
                        <div className="relative">
                            <h4 className="text-xl font-black italic">Network Pulse</h4>
                            <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                                {activeUsers.total} user{activeUsers.total !== 1 ? 's' : ''} active now. {activeUsers.doctorCount} doctor{activeUsers.doctorCount !== 1 ? 's' : ''}, {activeUsers.patientCount} patient{activeUsers.patientCount !== 1 ? 's' : ''}.
                            </p>
                            <Button variant="primary" className="mt-6 w-full h-12 rounded-xl bg-white text-slate-900 border-none hover:bg-blue-600 hover:text-white" onClick={() => { fetchActiveUsers(); setLastRefresh(new Date()); }}>
                                Refresh Sessions
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
