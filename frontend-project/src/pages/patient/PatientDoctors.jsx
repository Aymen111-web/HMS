import React, { useState, useEffect } from 'react';
import { Search, Stethoscope, Building2, Phone, Mail, CalendarPlus, Loader2, AlertCircle, ChevronRight } from 'lucide-react';
import { Button, Badge } from '../../components/UI';
import { getDoctors } from '../../services/doctorService';
import { useNavigate } from 'react-router-dom';

const PatientDoctors = () => {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDept, setSelectedDept] = useState('All');

    useEffect(() => {
        getDoctors()
            .then(res => { if (res.data.success) setDoctors(res.data.data); })
            .catch(() => setError('Unable to load doctors.'))
            .finally(() => setLoading(false));
    }, []);

    const departments = ['All', ...new Set(
        doctors.map(d => d.department?.name || d.specialization || 'General').filter(Boolean)
    )];

    const filtered = doctors.filter(doc => {
        const name = doc.user?.name || '';
        const dept = doc.department?.name || doc.specialization || 'General';
        return (
            (name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                dept.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (selectedDept === 'All' || dept === selectedDept)
        );
    });

    const avatarColors = ['bg-blue-500', 'bg-purple-500', 'bg-emerald-500', 'bg-rose-500', 'bg-amber-500', 'bg-indigo-500'];
    const getInitials = (name) => (name || '').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Our Medical Team</h1>
                    <p className="text-slate-500 font-medium mt-1">Browse our specialists and book your appointment</p>
                </div>
                <Button variant="primary" className="rounded-2xl h-12 px-6 shadow-xl shadow-blue-100 font-bold"
                    onClick={() => navigate('/patient/book-appointment')}>
                    <CalendarPlus size={20} className="mr-2" />
                    Book Appointment
                </Button>
            </div>

            <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="Search by name or specialty..."
                        className="w-full pl-12 pr-4 h-12 rounded-xl bg-slate-50 border border-slate-100 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 placeholder:text-slate-400"
                        value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
                <div className="flex gap-2 overflow-x-auto w-full lg:w-auto py-1">
                    {departments.slice(0, 6).map(dept => (
                        <button key={dept} onClick={() => setSelectedDept(dept)}
                            className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap uppercase tracking-wide transition-all ${selectedDept === dept ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>
                            {dept}
                        </button>
                    ))}
                </div>
            </div>

            {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-sm font-bold">
                    <AlertCircle size={20} /> {error}
                </div>
            )}

            {loading ? (
                <div className="py-32 flex flex-col items-center justify-center gap-4 text-slate-400">
                    <Loader2 size={48} className="animate-spin text-blue-600" />
                    <p className="font-bold text-lg">Loading specialists...</p>
                </div>
            ) : (
                <>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">
                        {filtered.length} specialist{filtered.length !== 1 ? 's' : ''} available
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filtered.length === 0 ? (
                            <div className="col-span-full py-24 bg-white rounded-3xl border border-slate-100 flex flex-col items-center justify-center text-slate-400">
                                <Stethoscope size={64} className="opacity-10 mb-4" />
                                <p className="font-bold text-xl">No doctors found</p>
                                <p className="text-sm mt-2">Try adjusting your search or filter</p>
                            </div>
                        ) : filtered.map((doc, i) => {
                            const dept = doc.department?.name || doc.specialization || 'General';
                            const name = doc.user?.name || 'Doctor';
                            const email = doc.user?.email || '';
                            return (
                                <div key={doc._id} className="group bg-white rounded-3xl border border-slate-100 p-7 shadow-sm hover:shadow-xl hover:border-blue-100 hover:-translate-y-1 transition-all duration-300 flex flex-col gap-5">
                                    <div className="flex items-center gap-4">
                                        <div className={`h-16 w-16 rounded-2xl ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white text-xl font-black flex-shrink-0`}>
                                            {getInitials(name)}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-black text-slate-900 text-base truncate">Dr. {name}</h3>
                                            <div className="flex items-center gap-1.5 mt-1">
                                                <Building2 size={12} className="text-blue-400 flex-shrink-0" />
                                                <span className="text-xs font-bold text-blue-600 truncate">{dept}</span>
                                            </div>
                                        </div>
                                        <Badge variant={doc.status === 'Inactive' ? 'warning' : 'success'} className="flex-shrink-0">
                                            {doc.status || 'Available'}
                                        </Badge>
                                    </div>
                                    <div className="space-y-2 py-4 border-y border-slate-50">
                                        {email && <div className="flex items-center gap-2"><Mail size={13} className="text-slate-300" /><span className="text-xs font-semibold text-slate-500 truncate">{email}</span></div>}
                                        {doc.phone && <div className="flex items-center gap-2"><Phone size={13} className="text-slate-300" /><span className="text-xs font-semibold text-slate-500">{doc.phone}</span></div>}
                                        <div className="flex items-center gap-2">
                                            <Stethoscope size={13} className="text-slate-300" />
                                            <span className="text-xs font-semibold text-slate-500">{doc.experience ? `${doc.experience} yrs experience` : 'Experienced Specialist'}</span>
                                        </div>
                                    </div>
                                    <Button variant="primary" className="w-full rounded-xl h-11 font-bold transition-all"
                                        onClick={() => navigate('/patient/book-appointment', { state: { doctorId: doc._id } })}>
                                        Book Appointment
                                        <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

export default PatientDoctors;
