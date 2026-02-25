import React, { useState, useEffect } from 'react';
import {
    Calendar,
    FileText,
    Activity,
    Clock,
    User,
    ChevronRight,
    Loader2,
    AlertCircle,
    Download,
    CreditCard,
    RefreshCw
} from 'lucide-react';
import { Card, Button, Badge } from '../../components/UI';
import { useAuth } from '../../hooks/useAuth';
import { getPatientStats } from '../../services/dashboardService';
import { getPatientByUserId } from '../../services/patientService';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <Card className="relative overflow-hidden group hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-2">{value}</h3>
                {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
            </div>
            <div className={`p-3 rounded-xl ${color}`}>
                <Icon size={24} />
            </div>
        </div>
    </Card>
);

const PatientDashboard = () => {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [patientProfile, setPatientProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [healing, setHealing] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user?.patientId) {
            fetchDashboardData(user.patientId);
        } else if (user?.id) {
            // patientId missing — try to heal
            tryHealPatientId();
        } else {
            setLoading(false);
        }
    }, [user?.patientId, user?.id]);

    const tryHealPatientId = async () => {
        setHealing(true);
        try {
            const res = await getPatientByUserId(user.id);
            if (res.data.success) {
                const patientId = res.data.data._id;
                updateUser({ patientId }); // heals localStorage too
                setPatientProfile(res.data.data);
                await fetchDashboardData(patientId);
            }
        } catch (err) {
            setError('Your patient profile could not be found. Please ask the administrator to register you in the system.');
        } finally {
            setHealing(false);
            setLoading(false);
        }
    };

    const fetchDashboardData = async (patientId) => {
        try {
            setLoading(true);
            const [statsRes, profileRes] = await Promise.allSettled([
                getPatientStats(patientId),
                getPatientByUserId(user.id)
            ]);
            if (statsRes.status === 'fulfilled' && statsRes.value.data.success) {
                setStats(statsRes.value.data.data);
            }
            if (profileRes.status === 'fulfilled' && profileRes.value.data.success) {
                setPatientProfile(profileRes.value.data.data);
            }
        } catch (err) {
            setError('Could not load dashboard data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    if (loading || healing) {
        return (
            <div className="h-[80vh] flex flex-col items-center justify-center gap-4 text-slate-400">
                <Loader2 size={40} className="animate-spin text-blue-600" />
                <p className="font-medium">{healing ? 'Looking up your patient profile...' : 'Loading your health dashboard...'}</p>
            </div>
        );
    }

    if (error && !user?.patientId) {
        return (
            <div className="h-[80vh] flex flex-col items-center justify-center gap-6 text-slate-400 max-w-md mx-auto text-center">
                <div className="h-20 w-20 rounded-full bg-amber-50 flex items-center justify-center">
                    <AlertCircle size={40} className="text-amber-500" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Patient Profile Not Found</h2>
                    <p className="text-slate-500 text-sm leading-relaxed">{error}</p>
                </div>
                <Button variant="primary" onClick={tryHealPatientId} className="rounded-xl h-12 px-6">
                    <RefreshCw size={18} className="mr-2" /> Try Again
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Health Overview</h1>
                    <p className="text-slate-500 mt-1">Hello, <span className="font-semibold text-blue-600">{user?.name}</span>. Welcome to your medical portal.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => navigate('/patient/appointments')}>
                        <Calendar size={18} className="mr-2" />
                        My Appointments
                    </Button>
                    <Button variant="primary" onClick={() => navigate('/patient/book-appointment')}>
                        <Activity size={18} className="mr-2" />
                        Book Now
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
                    value={stats?.upcomingAppointments ?? 0}
                    icon={Calendar}
                    color="bg-blue-50 text-blue-600"
                    subtitle="Scheduled visits"
                />
                <StatCard
                    title="Prescriptions"
                    value={stats?.totalPrescriptions ?? 0}
                    icon={FileText}
                    color="bg-emerald-50 text-emerald-600"
                    subtitle="Active medications"
                />
                <StatCard
                    title="Lab Reports"
                    value={stats?.labReports ?? 0}
                    icon={Activity}
                    color="bg-purple-50 text-purple-600"
                    subtitle="Recent test results"
                />
                <StatCard
                    title="Pending Dues"
                    value={`${stats?.pendingPayments ?? 0}`}
                    icon={CreditCard}
                    color="bg-amber-50 text-amber-600"
                    subtitle="Outstanding payments"
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
                                    <Badge variant="info">Upcoming</Badge>
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

                {/* Profile Summary */}
                <Card title="Your Profile" subtitle="Member information">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-black">
                                {user?.name?.charAt(0)}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900">{user?.name}</h4>
                                <p className="text-slate-500 text-sm">{user?.email}</p>
                                {user?.patientId && (
                                    <p className="text-slate-400 text-xs mt-0.5">ID: #{user.patientId.substring(0, 10)}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Blood Group</p>
                                <p className="text-lg font-bold text-slate-800">{patientProfile?.bloodGroup || '—'}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Age</p>
                                <p className="text-lg font-bold text-slate-800">{patientProfile?.age ? `${patientProfile.age} Yrs` : '—'}</p>
                            </div>
                        </div>

                        <Button variant="secondary" className="w-full justify-center rounded-xl" onClick={() => navigate('/patient/profile')}>
                            Update Personal Info
                        </Button>
                    </div>
                </Card>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card title="Medications" subtitle="Your active prescriptions">
                    <div className="space-y-4">
                        {stats?.totalPrescriptions === 0 ? (
                            <div className="py-8 text-center text-slate-400">
                                <FileText size={40} className="mx-auto mb-3 opacity-20" />
                                <p className="font-medium">No active prescriptions</p>
                            </div>
                        ) : (
                            <div className="py-6 text-center text-slate-400">
                                <p className="font-medium text-slate-600">{stats?.totalPrescriptions || 0} prescription(s) on file</p>
                                <p className="text-sm mt-1">View details in the prescriptions section</p>
                            </div>
                        )}
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
                        <button
                            onClick={() => navigate('/patient/payments')}
                            className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 text-left hover:shadow-md transition-all group"
                        >
                            <div className="h-12 w-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
                                <CreditCard size={24} />
                            </div>
                            <h5 className="font-bold text-slate-900">Payments</h5>
                            <p className="text-xs text-slate-500 mt-1">Manage your billing & payments</p>
                        </button>
                        <button
                            onClick={() => navigate('/patient/doctors')}
                            className="p-6 bg-amber-50 rounded-3xl border border-amber-100 text-left hover:shadow-md transition-all group"
                        >
                            <div className="h-12 w-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 mb-4 group-hover:scale-110 transition-transform">
                                <User size={24} />
                            </div>
                            <h5 className="font-bold text-slate-900">Find Doctors</h5>
                            <p className="text-xs text-slate-500 mt-1">Browse available specialists</p>
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default PatientDashboard;
