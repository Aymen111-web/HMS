import React, { useState, useEffect } from 'react';
import {
    Calendar,
    FileText,
    Activity,
    Clock,
    User,
    TrendingUp,
    ChevronRight,
    Loader2,
    AlertCircle,
    Download,
    CreditCard
} from 'lucide-react';
import { Card, Button, Badge } from '../../components/UI';
import { useAuth } from '../../hooks/useAuth';
import { getPatientStats } from '../../services/dashboardService';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <Card className="relative overflow-hidden group hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-2">{value}</h3>
                {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
            </div>
            <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
                <Icon size={24} />
            </div>
        </div>
    </Card>
);

const PatientDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user?.patientId) {
            fetchDashboardData();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const res = await getPatientStats(user.patientId);
            if (res.data.success) {
                setStats(res.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch patient dashboard data', err);
            setError('Could not load dashboard data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="h-[80vh] flex flex-col items-center justify-center gap-4 text-slate-400">
                <Loader2 size={40} className="animate-spin text-blue-600" />
                <p className="font-medium">Loading your health dashboard...</p>
            </div>
        );
    }

    if (!user?.patientId) {
        return (
            <div className="h-[80vh] flex flex-col items-center justify-center gap-4 text-slate-400">
                <AlertCircle size={40} className="text-amber-500" />
                <p className="font-medium">Patient profile not found. Please contact administration.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Health Overview</h1>
                    <p className="text-slate-500 mt-1">Hello, {user.name}. Welcome to your medical portal.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => navigate('/patient/appointments')}>
                        <Calendar size={18} className="mr-2" />
                        My Appointments
                    </Button>
                    <Button variant="primary" onClick={() => navigate('/patient/book-appointment')}>
                        <Activity size={18} className="mr-2" />
                        Book Appointment
                    </Button>
                </div>
            </div>

            {error && (
                <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-3 text-rose-600 font-bold">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Upcoming"
                    value={stats?.upcomingAppointments || 0}
                    icon={Calendar}
                    color="bg-blue-100"
                    subtitle="Scheduled visits"
                />
                <StatCard
                    title="Prescriptions"
                    value={stats?.totalPrescriptions || 0}
                    icon={FileText}
                    color="bg-emerald-100"
                    subtitle="Active medications"
                />
                <StatCard
                    title="Lab Reports"
                    value={stats?.labReports || 0}
                    icon={Activity}
                    color="bg-purple-100"
                    subtitle="Recent test results"
                />
                <StatCard
                    title="Payments"
                    value={`$${stats?.pendingPayments || 0}`}
                    icon={CreditCard}
                    color="bg-amber-100"
                    subtitle="Pending dues"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Next Appointment Card */}
                <Card title="Next Appointment" subtitle="Your upcoming consultation" className="lg:col-span-2">
                    {stats?.nextAppointment ? (
                        <div className="flex flex-col md:flex-row items-center gap-8 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors">
                            <div className="h-20 w-20 rounded-2xl bg-blue-600 flex flex-col items-center justify-center text-white shadow-lg shrink-0">
                                <span className="text-xs font-bold uppercase">{new Date(stats.nextAppointment.date).toLocaleString('default', { month: 'short' })}</span>
                                <span className="text-2xl font-black">{new Date(stats.nextAppointment.date).getDate()}</span>
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h4 className="text-xl font-bold text-slate-900">Dr. {stats.nextAppointment.doctor?.user?.name}</h4>
                                <p className="text-blue-600 font-semibold">{stats.nextAppointment.doctor?.specialization || 'Medical Specialist'}</p>
                                <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3 text-sm text-slate-500">
                                    <div className="flex items-center gap-1.5 font-medium">
                                        <Clock size={16} className="text-slate-400" />
                                        {stats.nextAppointment.time}
                                    </div>
                                    <div className="flex items-center gap-1.5 font-medium">
                                        <Badge variant="info">Upcoming</Badge>
                                    </div>
                                </div>
                            </div>
                            <Button variant="outline" className="shrink-0" onClick={() => navigate('/patient/appointments')}>
                                View Details
                            </Button>
                        </div>
                    ) : (
                        <div className="py-12 text-center">
                            <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Calendar className="text-slate-300" size={32} />
                            </div>
                            <p className="text-slate-500 font-medium">No upcoming appointments found</p>
                            <Button variant="ghost" className="mt-4 text-blue-600 font-bold" onClick={() => navigate('/patient/book-appointment')}>
                                Book one today
                            </Button>
                        </div>
                    )}
                </Card>

                {/* Quick Profile Summary */}
                <Card title="Your Profile" subtitle="Member information">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                                <User size={32} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900">{user.name}</h4>
                                <p className="text-slate-500 text-sm">Patient ID: {user.patientId.substring(0, 8)}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Blood Group</p>
                                <p className="text-lg font-bold text-slate-800">B+</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Age</p>
                                <p className="text-lg font-bold text-slate-800">28 Yrs</p>
                            </div>
                        </div>

                        <Button variant="secondary" className="w-full justify-center rounded-xl" onClick={() => navigate('/patient/profile')}>
                            Update Personal Info
                        </Button>
                    </div>
                </Card>
            </div>

            {/* Recent Prescriptions & Records Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card title="Medications" subtitle="Your active prescriptions">
                    <div className="space-y-4">
                        {[1, 2].map(i => (
                            <div key={i} className="flex items-center justify-between p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 hover:border-emerald-200 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800">Amoxicillin 500mg</p>
                                        <p className="text-xs text-slate-500">Twice a day • After meals</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" className="text-emerald-600 opactiy-0 group-hover:opacity-100">
                                    <Download size={16} />
                                </Button>
                            </div>
                        ))}
                        <Button variant="ghost" className="w-full text-blue-600 font-bold" onClick={() => navigate('/patient/prescriptions')}>
                            View All Prescriptions <ChevronRight size={16} className="ml-1" />
                        </Button>
                    </div>
                </Card>

                <Card title="Quick Links" subtitle="Handy resources">
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => navigate('/patient/lab-reports')}
                            className="p-6 bg-purple-50 rounded-3xl border border-purple-100 text-left hover:shadow-md transition-all group"
                        >
                            <div className="h-12 w-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
                                <Activity size={24} />
                            </div>
                            <h5 className="font-bold text-slate-900">Lab Results</h5>
                            <p className="text-xs text-slate-500 mt-1">View and download your test reports</p>
                        </button>
                        <button
                            onClick={() => navigate('/patient/records')}
                            className="p-6 bg-blue-50 rounded-3xl border border-blue-100 text-left hover:shadow-md transition-all group"
                        >
                            <div className="h-12 w-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                                <FileText size={24} />
                            </div>
                            <h5 className="font-bold text-slate-900">Medical Hist.</h5>
                            <p className="text-xs text-slate-500 mt-1">Access your consultation records</p>
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default PatientDashboard;
