import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Clock,
    User,
    Loader2,
    Search,
    Filter,
    XCircle,
    CheckCircle,
    MoreVertical,
    Download,
    Eye,
    ChevronDown,
    AlertCircle
} from 'lucide-react';
import { Card, Button, Badge, Input } from '../../components/UI';
import { useAuth } from '../../hooks/useAuth';
import { getPatientAppointments, cancelAppointment } from '../../services/patientService';
import { useNavigate } from 'react-router-dom';

const PatientAppointments = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('upcoming'); // upcoming, history, cancelled

    useEffect(() => {
        if (user?.patientId) {
            fetchAppointments();
        }
    }, [user]);

    const fetchAppointments = async () => {
        try {
            const res = await getPatientAppointments(user.patientId);
            if (res.data.success) {
                setAppointments(res.data.data);
            }
        } catch (err) {
            console.error('Error fetching appointments:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (window.confirm('Are you sure you want to cancel this appointment?')) {
            try {
                const res = await cancelAppointment(id);
                if (res.data.success) {
                    fetchAppointments();
                }
            } catch (err) {
                console.error('Error cancelling appointment:', err);
                alert('Failed to cancel appointment. Please try again.');
            }
        }
    };

    const filteredAppointments = appointments.filter(apt => {
        const matchesSearch = apt.doctor?.user?.name.toLowerCase().includes(searchTerm.toLowerCase());
        const aptDate = new Date(apt.date);
        const isPast = aptDate < new Date().setHours(0, 0, 0, 0) || apt.status === 'Completed';

        if (activeTab === 'upcoming') {
            return matchesSearch && !isPast && apt.status !== 'Cancelled';
        } else if (activeTab === 'history') {
            return matchesSearch && (apt.status === 'Completed' || (isPast && apt.status !== 'Cancelled'));
        } else {
            return matchesSearch && apt.status === 'Cancelled';
        }
    });

    if (loading) {
        return (
            <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
                <Loader2 size={40} className="animate-spin text-blue-600" />
                <p className="text-slate-500 font-medium">Retrieving your appointments...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Consultations</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage and track your medical visits</p>
                </div>
                <Button variant="primary" className="rounded-2xl h-12 px-6" onClick={() => navigate('/patient/book-appointment')}>
                    <Calendar size={20} className="mr-2" />
                    Book New Appointment
                </Button>
            </div>

            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
                    <div className="flex bg-slate-100/80 p-1.5 rounded-2xl w-full md:w-auto">
                        {['upcoming', 'history', 'cancelled'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`
                                    px-6 py-2.5 rounded-xl text-sm font-bold transition-all capitalize
                                    ${activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}
                                `}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-80">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <Input
                            placeholder="Search by doctor name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 h-12 rounded-2xl bg-slate-50/50 border-slate-100"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    {filteredAppointments.length > 0 ? (
                        filteredAppointments.map(apt => (
                            <div
                                key={apt._id}
                                className="group p-5 md:p-6 bg-white border border-slate-100 rounded-3xl hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 transition-all"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                                    {/* Date Column */}
                                    <div className="flex lg:flex-col items-center gap-4 lg:gap-1 p-3 lg:p-4 bg-slate-50 rounded-2xl lg:min-w-[100px] group-hover:bg-blue-50 transition-colors">
                                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest lg:mb-1">
                                            {new Date(apt.date).toLocaleString('default', { month: 'short' })}
                                        </span>
                                        <span className="text-3xl font-black text-slate-900 leading-none">
                                            {new Date(apt.date).getDate()}
                                        </span>
                                        <span className="text-xs font-bold text-slate-500 lg:mt-1">
                                            {new Date(apt.date).getFullYear()}
                                        </span>
                                    </div>

                                    {/* Doctor Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Badge variant={
                                                apt.status === 'Confirmed' ? 'info' :
                                                    apt.status === 'Completed' ? 'success' :
                                                        apt.status === 'Cancelled' ? 'danger' : 'warning'
                                            }>
                                                {apt.status}
                                            </Badge>
                                            {apt.isUrgent && (
                                                <Badge variant="danger" className="animate-pulse">Urgent Case</Badge>
                                            )}
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-1 lg:mb-0">Dr. {apt.doctor?.user?.name}</h3>
                                        <p className="text-blue-600 font-semibold text-sm mb-3">{apt.doctor?.user?.specialization || 'Medical Specialist'}</p>

                                        <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-500">
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={16} className="text-slate-400" />
                                                {apt.time}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Eye size={16} className="text-slate-400" />
                                                View Notes
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-3 lg:border-l lg:border-slate-100 lg:pl-6">
                                        {activeTab === 'upcoming' && (
                                            <>
                                                <Button variant="outline" className="h-11 rounded-xl px-4 text-sm font-bold border-slate-200">
                                                    Reschedule
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    className="h-11 rounded-xl px-4 text-sm font-bold text-rose-500 hover:bg-rose-50"
                                                    onClick={() => handleCancel(apt._id)}
                                                >
                                                    Cancel appointment
                                                </Button>
                                            </>
                                        )}
                                        {activeTab === 'history' && (
                                            <Button variant="secondary" className="h-11 rounded-xl px-4 text-sm font-bold">
                                                <Download size={18} className="mr-2" />
                                                Summary
                                            </Button>
                                        )}
                                        {activeTab === 'cancelled' && (
                                            <Button
                                                variant="primary"
                                                className="h-11 rounded-xl px-4 text-sm font-bold"
                                                onClick={() => navigate('/patient/book-appointment')}
                                            >
                                                Book Again
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-20 text-center">
                            <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                <Calendar className="text-slate-200" size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">No appointments found</h3>
                            <p className="text-slate-500 max-w-xs mx-auto mt-1">
                                {searchTerm ? `We couldn't find any appointments matches "${searchTerm}"` :
                                    `You don't have any ${activeTab} appointments at the moment.`}
                            </p>
                            {!searchTerm && activeTab === 'upcoming' && (
                                <Button className="mt-6" variant="primary" onClick={() => navigate('/patient/book-appointment')}>
                                    Schedule your first visit
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Help/Notice Card */}
            <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                            <AlertCircle size={32} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black">Important Notice</h3>
                            <p className="text-blue-100 font-medium">Please arrive at least 15 minutes before your scheduled appointment time.</p>
                        </div>
                    </div>
                    <Button className="bg-white text-blue-600 hover:bg-blue-50 border-none font-bold h-12 px-8 rounded-2xl">
                        View Guidelines
                    </Button>
                </div>
                {/* Abstract decoration */}
                <div className="absolute top-0 right-0 h-64 w-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
            </div>
        </div>
    );
};

export default PatientAppointments;
