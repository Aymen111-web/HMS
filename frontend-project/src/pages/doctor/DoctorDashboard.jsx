import React, { useState, useEffect } from 'react';
import {
    Users,
    Calendar,
    Clock,
    FileText,
    AlertCircle,
    CheckCircle,
    XCircle,
    Eye,
    ChevronRight,
    TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getDoctorStats } from '../../services/dashboardService';
import { getDoctorAppointments, updateAppointment } from '../../services/appointmentService';
import { getDoctor } from '../../services/doctorService';
import { Button, Modal, Badge } from '../../components/UI';

const DoctorDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [doctorProfile, setDoctorProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedApt, setSelectedApt] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                if (!user?.doctorId) {
                    setLoading(false);
                    return;
                }

                const [statsRes, appointmentsRes, doctorRes] = await Promise.all([
                    getDoctorStats(user.doctorId),
                    getDoctorAppointments(user.doctorId),
                    getDoctor(user.doctorId)
                ]);

                setStats(statsRes.data?.data);
                setAppointments(appointmentsRes.data?.data || []);
                setDoctorProfile(doctorRes.data?.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError('Failed to load dashboard data');
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user]);

    const handleUpdateStatus = async (id, status) => {
        try {
            await updateAppointment(id, { status });
            // Refresh dashboard data
            const [statsRes, appointmentsRes] = await Promise.all([
                getDoctorStats(user.doctorId),
                getDoctorAppointments(user.doctorId)
            ]);
            setStats(statsRes.data?.data);
            setAppointments(appointmentsRes.data?.data || []);
            setIsViewModalOpen(false);
        } catch (err) {
            console.error('Error updating status:', err);
        }
    };

    const handleViewDetails = (apt) => {
        setSelectedApt(apt);
        setIsViewModalOpen(true);
    };

    if (loading) return <div className="flex items-center justify-center h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

    const summaryCards = [
        { title: 'Total Patients', value: stats?.totalPatients || 0, icon: Users, color: 'bg-blue-500', trend: '+12%' },
        { title: "Today's Appointments", value: stats?.appointmentsToday || 0, icon: Calendar, color: 'bg-emerald-500', trend: '+5%' },
        { title: 'Upcoming', value: stats?.upcomingAppointments || 0, icon: Clock, color: 'bg-amber-500', trend: 'Next 3 days' },
        { title: 'Pending Reports', value: stats?.pendingReports || 0, icon: FileText, color: 'bg-purple-500', trend: 'Action required' },
        { title: 'Urgent Cases', value: stats?.urgentCases || 0, icon: AlertCircle, color: 'bg-rose-500', trend: 'High Priority' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {error && (
                <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-3 text-rose-600 font-bold">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}
            {/* Header section with Doctor Profile */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-8 justify-between">
                <div className="flex items-center gap-6">
                    <div className="h-20 w-20 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                        {user?.name?.charAt(0)}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Welcome, Dr. {user?.name || 'Doctor'}</h1>
                        <p className="text-slate-500 font-medium">
                            {doctorProfile?.specialization || 'Medical Specialist'} • ID: {String(user?.doctorId || 'N/A').substring(0, 8)}
                        </p>
                        <p className="text-slate-400 text-sm">{user?.email || ''}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl">Edit Profile</Button>
                    <Button variant="primary" className="rounded-xl">Manage Schedule</Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {summaryCards.map((card, idx) => {
                    if (!card || !card.icon) return null;
                    return (
                        <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`${card.color || 'bg-slate-500'} p-3 rounded-2xl text-white shadow-lg shadow-slate-100`}>
                                    <card.icon size={24} />
                                </div>
                                <div className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                                    <TrendingUp size={12} className="mr-1" />
                                    {card.trend}
                                </div>
                            </div>
                            <h3 className="text-slate-500 text-sm font-semibold mb-1">{card.title}</h3>
                            <p className="text-2xl font-bold text-slate-900">{card.value}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Today's Appointments Table */}
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Calendar className="text-blue-600" size={24} />
                            Today's Appointments
                        </h2>
                        <button className="text-blue-600 text-sm font-bold hover:underline flex items-center">
                            View All <ChevronRight size={16} />
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Patient</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Time</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {appointments.length > 0 ? appointments.map((apt) => (
                                    <tr key={apt._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                                                    {apt.patient?.user?.name?.charAt(0)}
                                                </div>
                                                <span className="font-semibold text-slate-700">{apt.patient?.user?.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                                                {apt.time}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${apt.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' :
                                                apt.status === 'Cancelled' ? 'bg-rose-50 text-rose-600' :
                                                    'bg-amber-50 text-amber-600'
                                                }`}>
                                                {apt.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleViewDetails(apt)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                {apt.status === 'Pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleUpdateStatus(apt._id, 'Completed')}
                                                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Mark Completed"
                                                        >
                                                            <CheckCircle size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateStatus(apt._id, 'Cancelled')}
                                                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Cancel"
                                                        >
                                                            <XCircle size={18} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-10 text-center text-slate-400 font-medium">
                                            No appointments scheduled for today
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Urgent Cases Sidebar */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <AlertCircle className="text-rose-500" size={24} />
                        Urgent Cases
                    </h2>
                    <div className="space-y-4">
                        {appointments.filter(a => a.isUrgent).length > 0 ? (
                            appointments.filter(a => a.isUrgent).map(apt => (
                                <div key={apt._id} className="p-4 bg-rose-50 rounded-2xl border border-rose-100 relative group animate-pulse hover:animate-none">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-rose-600 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                                            <div className="h-1.5 w-1.5 rounded-full bg-rose-600"></div>
                                            Emergency
                                        </span>
                                        <span className="text-slate-400 text-xs font-medium">{apt.time}</span>
                                    </div>
                                    <h4 className="font-bold text-slate-900 mb-1">{apt.patient?.user?.name}</h4>
                                    <p className="text-slate-600 text-xs mb-3 line-clamp-2">{apt.reason || 'No details provided'}</p>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        className="w-full h-9 rounded-xl text-xs"
                                        onClick={() => handleViewDetails(apt)}
                                    >
                                        Attend Now
                                    </Button>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10">
                                <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="text-emerald-500" size={32} />
                                </div>
                                <p className="text-slate-500 text-sm font-medium">No urgent cases currently</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* Appointment Detail Modal */}
            <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Consultation Details">
                {selectedApt && (
                    <div className="space-y-6">
                        <div className="bg-slate-50 p-6 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-14 w-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl uppercase">
                                    {selectedApt.patient?.user?.name?.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-slate-900">{selectedApt.patient?.user?.name}</h4>
                                    <p className="text-sm text-slate-500 font-medium">Age: {selectedApt.patient?.age} • {selectedApt.patient?.bloodGroup}</p>
                                </div>
                            </div>
                            <Badge variant={selectedApt.isUrgent ? 'danger' : 'info'}>
                                {selectedApt.isUrgent ? 'EMERGENCY' : 'Routine'}
                            </Badge>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-white border border-slate-100 rounded-xl">
                                <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Reason for Visit</p>
                                <p className="font-bold text-slate-700">{selectedApt.reason || 'No specific reason recorded'}</p>
                            </div>

                            {selectedApt.isUrgent && (
                                <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl">
                                    <p className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                                        <AlertCircle size={16} />
                                        Urgent Case Priority
                                    </p>
                                    <p className="text-xs text-rose-500 mt-1 font-medium">Please attend to this patient immediately. High priority triage marked by front desk.</p>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Button variant="secondary" className="justify-center h-12 rounded-xl" onClick={() => setIsViewModalOpen(false)}>
                                Close
                            </Button>
                            {selectedApt.status === 'Pending' && (
                                <Button
                                    variant="primary"
                                    className="justify-center h-12 rounded-xl"
                                    onClick={() => {
                                        setIsViewModalOpen(false);
                                        navigate('/doctor/prescriptions', { state: { aptId: selectedApt._id, patientId: selectedApt.patient?._id } });
                                    }}
                                >
                                    Start Consultation
                                </Button>
                            )}
                        </div>

                        {selectedApt.status === 'Pending' && (
                            <div className="flex gap-2 pt-2">
                                <Button
                                    variant="danger"
                                    className="flex-1 rounded-xl h-10 text-xs"
                                    onClick={() => handleUpdateStatus(selectedApt._id, 'Cancelled')}
                                >
                                    Cancel Visit
                                </Button>
                                <Button
                                    variant="success"
                                    className="flex-1 rounded-xl h-10 text-xs"
                                    onClick={() => handleUpdateStatus(selectedApt._id, 'Completed')}
                                >
                                    Mark as Arrived
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default DoctorDashboard;
