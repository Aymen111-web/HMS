import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Filter,
    Search,
    MoreHorizontal,
    CheckCircle,
    XCircle,
    Clock,
    Plus,
    FileText,
    ChevronLeft,
    ChevronRight,
    MapPin,
    Phone,
    User
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getDoctorAppointments, updateAppointment } from '../../services/appointmentService';
import { Button, Input } from '../../components/UI';

const DoctorAppointments = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All'); // All, Today, Upcoming, Completed, Cancelled
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchAppointments();
    }, [user]);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const res = await getDoctorAppointments(user.doctorId);
            setAppointments(res.data.data || []);
            setFilteredAppointments(res.data.data || []);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching appointments:', err);
            setLoading(false);
        }
    };

    useEffect(() => {
        let result = appointments;

        // Apply Search
        if (searchTerm) {
            result = result.filter(apt =>
                apt.patient?.user?.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply Type Filter
        const today = new Date().setHours(0, 0, 0, 0);
        if (filter === 'Today') {
            result = result.filter(apt => new Date(apt.date).setHours(0, 0, 0, 0) === today);
        } else if (filter === 'Upcoming') {
            result = result.filter(apt => new Date(apt.date).setHours(0, 0, 0, 0) > today);
        } else if (filter === 'Completed') {
            result = result.filter(apt => apt.status === 'Completed');
        } else if (filter === 'Cancelled') {
            result = result.filter(apt => apt.status === 'Cancelled');
        }

        setFilteredAppointments(result);
    }, [filter, searchTerm, appointments]);

    const handleAction = async (id, status) => {
        try {
            await updateAppointment(id, { status });
            fetchAppointments();
        } catch (err) {
            console.error('Error updating appointment:', err);
        }
    };

    if (loading) return <div className="flex items-center justify-center h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

    const filterOptions = ['All', 'Today', 'Upcoming', 'Completed', 'Cancelled'];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Manage Appointments</h1>
                    <p className="text-slate-500 font-medium">Track and update your patient visits</p>
                </div>
                <Button variant="primary" className="rounded-2xl h-12">
                    <Plus size={20} className="mr-2" />
                    New Appointment
                </Button>
            </div>

            {/* Filters and Search */}
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-4 justify-between">
                <div className="flex bg-slate-50 p-1 rounded-2xl w-fit">
                    {filterOptions.map(opt => (
                        <button
                            key={opt}
                            onClick={() => setFilter(opt)}
                            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${filter === opt
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
                <div className="relative flex-1 max-w-md">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search patient name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                </div>
            </div>

            {/* Appointments Grid/List */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAppointments.length > 0 && filteredAppointments.map((apt) => (
                    <div key={apt._id} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all group border-b-4 border-b-blue-500/0 hover:border-b-blue-500">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div className="h-14 w-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl">
                                    {apt.patient?.user?.name?.charAt(0)}
                                </div>
                                <div className={`px-4 py-1.5 rounded-xl text-xs font-bold ${apt.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' :
                                    apt.status === 'Cancelled' ? 'bg-rose-50 text-rose-600' :
                                        'bg-amber-50 text-amber-600'
                                    }`}>
                                    {apt.status}
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mb-1">{apt.patient?.user?.name}</h3>
                            <p className="text-slate-500 font-medium text-sm mb-6 flex items-center gap-2">
                                <FileText size={16} /> Patient ID: {apt.patient?._id?.substring(0, 8)}
                            </p>

                            <div className="space-y-3 mb-8">
                                <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                                    <div className="bg-slate-50 p-2 rounded-lg"><Calendar size={16} /></div>
                                    {new Date(apt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </div>
                                <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                                    <div className="bg-slate-50 p-2 rounded-lg"><Clock size={16} /></div>
                                    {apt.time}
                                </div>
                            </div>

                            <div className="flex gap-2">
                                {apt.status === 'Pending' && (
                                    <>
                                        <button
                                            onClick={() => handleAction(apt._id, 'Completed')}
                                            className="flex-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 py-3 rounded-2xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle size={16} /> Complete
                                        </button>
                                        <button
                                            onClick={() => handleAction(apt._id, 'Cancelled')}
                                            className="flex-1 bg-rose-50 text-rose-600 hover:bg-rose-100 py-3 rounded-2xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                                        >
                                            <XCircle size={16} /> Cancel
                                        </button>
                                    </>
                                )}
                                {apt.status === 'Completed' && (
                                    <button className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 py-3 rounded-2xl text-xs font-bold transition-colors flex items-center justify-center gap-2">
                                        <FileText size={16} /> View Record
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {filteredAppointments.length === 0 && (
                    <div className="col-span-full py-20 bg-white rounded-3xl border border-slate-100 border-dashed text-center">
                        <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Calendar className="text-slate-300" size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No Appointments Found</h3>
                        <p className="text-slate-500 font-medium">Try adjusting your filters or search term</p>
                    </div>
                )}
            </div>

            {/* Pagination Placeholder */}
            {filteredAppointments.length > 0 && (
                <div className="flex justify-between items-center py-4 px-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
                    <p className="text-slate-500 text-sm font-medium">Showing {filteredAppointments.length} results</p>
                    <div className="flex gap-2">
                        <button className="p-2 border border-slate-100 rounded-xl text-slate-400 hover:bg-slate-50"><ChevronLeft size={20} /></button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-100">1</button>
                        <button className="px-4 py-2 hover:bg-slate-50 rounded-xl text-sm font-bold text-slate-600 transition-colors">2</button>
                        <button className="px-4 py-2 hover:bg-slate-50 rounded-xl text-sm font-bold text-slate-600 transition-colors">3</button>
                        <button className="p-2 border border-slate-100 rounded-xl text-slate-400 hover:bg-slate-50"><ChevronRight size={20} /></button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorAppointments;
