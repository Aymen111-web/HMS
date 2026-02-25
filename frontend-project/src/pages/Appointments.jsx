import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Clock,
    User,
    Stethoscope,
    ChevronLeft,
    ChevronRight,
    Filter,
    Plus,
    Loader2,
    AlertCircle
} from 'lucide-react';
import { Card, Button, Badge, Modal, Input } from '../components/UI';
import { getAppointments, createAppointment, updateAppointmentStatus } from '../services/appointmentService';
import { getDoctors } from '../services/doctorService';
import { getPatients } from '../services/patientService';
import { useLocation } from 'react-router-dom';

const Appointments = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('upcoming');
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // For new appointment form
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [formData, setFormData] = useState({
        patientId: '',
        doctorId: location.state?.doctorId || '',
        date: '',
        time: '09:00'
    });

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (isModalOpen) {
            fetchDoctorsAndPatients();
        }
    }, [isModalOpen]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await getAppointments();
            if (response.data.success) {
                setAppointments(response.data.data);
            }
        } catch (err) {
            setError('Failed to fetch appointments.');
        } finally {
            setLoading(false);
        }
    };

    const fetchDoctorsAndPatients = async () => {
        try {
            const [docsRes, patsRes] = await Promise.all([getDoctors(), getPatients()]);
            if (docsRes.data.success) setDoctors(docsRes.data.data);
            if (patsRes.data.success) setPatients(patsRes.data.data);
        } catch (err) {
            console.error('Failed to fetch supporting data', err);
        }
    };

    const handleSchedule = async (e) => {
        e.preventDefault();
        try {
            const combinedDate = new Date(`${formData.date}T${formData.time}`);
            const response = await createAppointment({
                patientId: formData.patientId,
                doctorId: formData.doctorId,
                date: combinedDate
            });
            if (response.data.success) {
                setIsModalOpen(false);
                fetchData();
            }
        } catch (err) {
            setError('Failed to schedule appointment.');
        }
    };

    const filteredAppointments = appointments.filter(appt => {
        if (activeTab === 'upcoming') return appt.status === 'Pending' || appt.status === 'Confirmed';
        if (activeTab === 'completed') return appt.status === 'Completed';
        if (activeTab === 'cancelled') return appt.status === 'Cancelled';
        return true;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Appointments</h1>
                    <p className="text-slate-500">Scheduled visits and consultation sessions.</p>
                </div>
                <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} className="mr-2" />
                    Schedule New
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-4 space-y-4">
                    <div className="flex gap-4 border-b border-slate-200">
                        {['upcoming', 'completed', 'cancelled'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-4 text-sm font-semibold capitalize transition-all relative
                                ${activeTab === tab ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}
                                `}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></div>
                                )}
                            </button>
                        ))}
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-medium">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-400">
                            <Loader2 size={40} className="animate-spin text-blue-600" />
                            <p className="font-medium">Loading appointments...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {filteredAppointments.map((appt) => (
                                <Card key={appt._id} className="hover:shadow-md transition-shadow">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex gap-4">
                                            <div className="h-12 w-12 rounded-full bg-slate-50 flex flex-col items-center justify-center text-slate-800 border border-slate-100">
                                                <span className="text-[10px] uppercase font-bold text-slate-400 leading-none">
                                                    {new Date(appt.date).toLocaleString('default', { month: 'short' })}
                                                </span>
                                                <span className="text-lg font-bold leading-none mt-1">
                                                    {new Date(appt.date).getDate()}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-bold text-slate-900">{appt.patient?.user?.name || 'N/A'}</h4>
                                                    <Badge variant="info">Consultation</Badge>
                                                </div>
                                                <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                                                    <span className="flex items-center gap-1.5 line-clamp-1">
                                                        <Stethoscope size={14} className="text-blue-500" />
                                                        {appt.doctor?.user?.name || 'Unknown Doctor'}
                                                    </span>
                                                    <span className="flex items-center gap-1.5 whitespace-nowrap">
                                                        <Clock size={14} className="text-blue-500" />
                                                        {new Date(appt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 pl-16 md:pl-0">
                                            <Badge variant={appt.status === 'Completed' ? 'success' : appt.status === 'Cancelled' ? 'danger' : 'warning'}>
                                                {appt.status}
                                            </Badge>
                                            <div className="h-8 w-[1px] bg-slate-100 mx-1 hidden md:block"></div>
                                            <Button variant="secondary" size="sm" onClick={() => alert('Feature coming soon!')}>Details</Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                            {filteredAppointments.length === 0 && (
                                <div className="py-20 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-200">
                                    No {activeTab} appointments found.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Schedule Appointment">
                <form onSubmit={handleSchedule} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Select Patient</label>
                        <select
                            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                            required
                            value={formData.patientId}
                            onChange={e => setFormData({ ...formData, patientId: e.target.value })}
                        >
                            <option value="">Choose a patient...</option>
                            {patients.map(p => (
                                <option key={p._id} value={p._id}>{p.user?.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Select Doctor</label>
                        <select
                            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                            required
                            value={formData.doctorId}
                            onChange={e => setFormData({ ...formData, doctorId: e.target.value })}
                        >
                            <option value="">Choose a doctor...</option>
                            {doctors.map(d => (
                                <option key={d._id} value={d._id}>{d.user?.name} - {d.specialization}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Date"
                            type="date"
                            required
                            value={formData.date}
                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                        />
                        <Input
                            label="Time"
                            type="time"
                            required
                            value={formData.time}
                            onChange={e => setFormData({ ...formData, time: e.target.value })}
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button variant="secondary" type="button" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button variant="primary" type="submit" className="flex-1">Confirm Schedule</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Appointments;
