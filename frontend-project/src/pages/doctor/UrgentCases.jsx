import React, { useState, useEffect } from 'react';
import {
    AlertCircle,
    Search,
    Clock,
    CheckCircle,
    User,
    Phone,
    ChevronRight,
    MapPin,
    Calendar,
    Stethoscope
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getDoctorAppointments, updateAppointment } from '../../services/appointmentService';
import { Button } from '../../components/UI';

const UrgentCases = () => {
    const { user } = useAuth();
    const [urgentCases, setUrgentCases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUrgentCases();
    }, [user]);

    const fetchUrgentCases = async () => {
        try {
            setLoading(true);
            const res = await getDoctorAppointments(user.doctorId);
            // Filter only urgent and not completed/cancelled
            const urgent = res.data.filter(a => a.isUrgent && a.status !== 'Completed' && a.status !== 'Cancelled');
            setUrgentCases(urgent);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching urgent cases:', err);
            setLoading(false);
        }
    };

    const handleTreated = async (id) => {
        try {
            await updateAppointment(id, { status: 'Completed' });
            fetchUrgentCases();
        } catch (err) {
            console.error('Error marking as treated:', err);
        }
    };

    if (loading) return <div className="flex items-center justify-center h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                    <div className="h-10 w-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center">
                        <AlertCircle size={24} />
                    </div>
                    Emergency & Urgent Cases
                </h1>
                <p className="text-slate-500 font-medium mt-2">Immediate care for high-priority patients</p>
            </div>

            {urgentCases.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {urgentCases.map((case_) => (
                        <div key={case_._id} className="bg-white rounded-[32px] overflow-hidden shadow-xl shadow-rose-100/20 border border-rose-100 group">
                            <div className="bg-rose-500 p-6 flex justify-between items-center text-white">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                                        <AlertCircle size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest opacity-80">Priority Status</p>
                                        <h3 className="text-xl font-bold">EMERGENCY</h3>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-bold">
                                    <Clock size={16} />
                                    {case_.time}
                                </div>
                            </div>

                            <div className="p-8">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="h-16 w-16 bg-slate-100 rounded-[20px] flex items-center justify-center text-slate-600 text-2xl font-bold">
                                            {case_.patient?.user?.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="text-2xl font-bold text-slate-900">{case_.patient?.user?.name}</h4>
                                            <p className="text-slate-500 font-medium flex items-center gap-1">
                                                ID: {case_.patient?._id.substring(0, 8)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`px-4 py-2 rounded-xl text-sm font-bold ${case_.status === 'Confirmed' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                                            }`}>
                                            {case_.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-slate-50 rounded-[24px] p-6 mb-8">
                                    <h5 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Patient Reason</h5>
                                    <p className="text-slate-700 font-medium leading-relaxed">
                                        {case_.reason || 'No specific emergency details provided. Patient requires immediate evaluation.'}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                                        <Calendar size={20} className="text-blue-500" />
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Date</p>
                                            <p className="text-sm font-bold text-slate-700">Today</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                                        <Stethoscope size={20} className="text-blue-500" />
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Service</p>
                                            <p className="text-sm font-bold text-slate-700">Emergency Care</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <Button variant="outline" className="flex-1 h-14 rounded-2xl font-bold">
                                        Transfer Case
                                    </Button>
                                    <Button
                                        onClick={() => handleTreated(case_._id)}
                                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-14 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-100"
                                    >
                                        <CheckCircle size={20} /> Mark as Treated
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-[40px] border border-slate-100 p-20 text-center shadow-sm">
                    <div className="h-24 w-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                        <CheckCircle size={48} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">No Urgent Cases</h2>
                    <p className="text-slate-500 font-medium max-w-md mx-auto">
                        There are currently no active emergency or urgent care appointments. All cases are within normal priority.
                    </p>
                </div>
            )}
        </div>
    );
};

export default UrgentCases;
