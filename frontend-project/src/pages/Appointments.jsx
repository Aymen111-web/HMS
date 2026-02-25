import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Stethoscope, ChevronLeft, ChevronRight, Filter, Plus, Loader2, AlertCircle, CheckCircle2, XCircle, AlertTriangle, Building2, Search, MoreHorizontal, Trash2 } from 'lucide-react';
import { Card, Button, Badge, Modal, Input } from '../components/UI';
import { getAppointments, createAppointment, updateAppointment, deleteAppointment } from '../services/appointmentService';
import { getDoctors } from '../services/doctorService';
import { getPatients } from '../services/patientService';
import { useLocation } from 'react-router-dom';

const Appointments = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('all');
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Supporting data
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);

    // Modals
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedApt, setSelectedApt] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    // Form
    const [formData, setFormData] = useState({
        patientId: '',
        doctorId: location.state?.doctorId || '',
        date: '',
        time: '09:00',
        isUrgent: false,
        reason: ''
    });

    useEffect(() => {
        fetchData();
        fetchSupportingData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await getAppointments();
            if (response.data.success) {
                setAppointments(response.data.data);
            }
        } catch (err) {
            setError('Failed to sync appointment cluster.');
        } finally {
            setLoading(false);
        }
    };

    const fetchSupportingData = async () => {
        try {
            const [docsRes, patsRes] = await Promise.all([getDoctors(), getPatients()]);
            if (docsRes.data.success) setDoctors(docsRes.data.data);
            if (patsRes.data.success) setPatients(patsRes.data.data);
        } catch (err) {
            console.error('Supporting data sync failed');
        }
    };

    const handleSchedule = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError('');
            const combinedDate = new Date(`${formData.date}T${formData.time}`);
            await createAppointment({
                patientId: formData.patientId,
                doctorId: formData.doctorId,
                date: combinedDate,
                time: formData.time,          // required by model — stored separately
                isUrgent: formData.isUrgent,
                reason: formData.reason
            });
            setIsModalOpen(false);
            setFormData({ patientId: '', doctorId: '', date: '', time: '09:00', isUrgent: false, reason: '' });
            fetchData();
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to confirm reservation.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await updateAppointment(id, { status });
            fetchData();
            setIsDetailsModalOpen(false);
        } catch (err) {
            setError('System failed to commit status update.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Erase this clinical record?')) return;
        try {
            await deleteAppointment(id);
            fetchData();
        } catch (err) {
            setError('Deletion protocol failed.');
        }
    };

    const filteredAppointments = appointments.filter(appt => {
        const matchesSearch = appt.patient?.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appt.doctor?.user?.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTab = activeTab === 'all' || appt.status.toLowerCase() === activeTab.toLowerCase();
        return matchesSearch && matchesTab;
    });

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Appointment Center</h1>
                    <p className="text-slate-500 font-medium">Real-time control tower for hospital scheduling and triage</p>
                </div>
                <Button variant="primary" className="rounded-2xl h-12 px-6 shadow-xl shadow-blue-100" onClick={() => setIsModalOpen(true)}>
                    <Plus size={20} className="mr-2" />
                    New Reservation
                </Button>
            </div>

            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-6 items-center">
                <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto">
                    {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all
                            ${activeTab === tab ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-400 hover:text-slate-600 bg-slate-50'}
                            `}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="relative flex-1 w-full">
                    <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input
                        placeholder="Search doctor or patient identity..."
                        className="pl-14 h-14 rounded-2xl bg-slate-50 border-none transition-all text-base"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-sm font-bold shadow-sm">
                    <AlertTriangle size={20} /> {error}
                </div>
            )}

            {loading && !appointments.length ? (
                <div className="py-32 flex flex-col items-center justify-center gap-4 text-slate-400">
                    <Loader2 size={48} className="animate-spin text-blue-600" />
                    <p className="font-bold text-lg">Syncing Global Schedule...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {filteredAppointments.map((appt) => (
                        <Card key={appt._id} className="group hover:border-blue-200 transition-all p-6 relative overflow-hidden">
                            {appt.isUrgent && (
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-600"></div>
                            )}
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                <div className="flex gap-6 items-center">
                                    <div className="flex flex-col items-center justify-center h-16 w-16 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all group-hover:border-blue-600">
                                        <span className="text-[10px] font-black uppercase text-slate-400 group-hover:text-blue-100 mb-1">
                                            {new Date(appt.date).toLocaleString('default', { month: 'short' })}
                                        </span>
                                        <span className="text-xl font-black leading-none">{new Date(appt.date).getDate()}</span>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <h4 className="text-lg font-black text-slate-800">{appt.patient?.user?.name}</h4>
                                            {appt.isUrgent && <Badge variant="danger" className="animate-pulse px-2 py-0.5 text-[8px]">EMERGENCY</Badge>}
                                        </div>
                                        <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                                            <span className="flex items-center gap-2"><Stethoscope size={14} className="text-blue-500" /> Dr. {appt.doctor?.user?.name}</span>
                                            <span className="flex items-center gap-2"><Clock size={14} className="text-blue-500" /> {appt.time}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Status</p>
                                        <Badge variant={appt.status === 'Completed' ? 'success' : appt.status === 'Cancelled' ? 'danger' : 'warning'} className="rounded-xl px-4">
                                            {appt.status}
                                        </Badge>
                                    </div>
                                    <div className="flex gap-2">
                                        {(appt.status === 'Pending' || appt.status === 'Confirmed') && (
                                            <>
                                                <button
                                                    onClick={() => handleUpdateStatus(appt._id, 'Completed')}
                                                    className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100 shadow-sm"
                                                    title="Complete Visit"
                                                >
                                                    <CheckCircle2 size={20} />
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(appt._id, 'Cancelled')}
                                                    className="h-12 w-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all border border-rose-100 shadow-sm"
                                                    title="Cancel Session"
                                                >
                                                    <XCircle size={20} />
                                                </button>
                                            </>
                                        )}
                                        <button
                                            onClick={() => { setSelectedApt(appt); setIsDetailsModalOpen(true); }}
                                            className="h-12 w-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-white hover:text-blue-600 hover:shadow-md transition-all border border-slate-100"
                                        >
                                            <MoreHorizontal size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                    {filteredAppointments.length === 0 && (
                        <div className="py-24 bg-white rounded-[3rem] border border-slate-100 flex flex-col items-center justify-center text-slate-400">
                            <Calendar size={64} className="opacity-10 mb-6" />
                            <p className="font-black text-xl">Schedule is clear for today</p>
                        </div>
                    )}
                </div>
            )}

            {/* Schedule Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Strategic Resource Allocation">
                <form onSubmit={handleSchedule} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 ml-1">Clinical Patient</label>
                            <select
                                className="w-full h-14 bg-slate-50 border-none rounded-2xl px-4 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                required
                                value={formData.patientId}
                                onChange={e => setFormData({ ...formData, patientId: e.target.value })}
                            >
                                <option value="">Select Identity</option>
                                {patients.map(p => (
                                    <option key={p._id} value={p._id}>{p.user?.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 ml-1">Medical Specialist</label>
                            <select
                                className="w-full h-14 bg-slate-50 border-none rounded-2xl px-4 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                required
                                value={formData.doctorId}
                                onChange={e => setFormData({ ...formData, doctorId: e.target.value })}
                            >
                                <option value="">Select Primary Doctor</option>
                                {doctors.map(d => (
                                    <option key={d._id} value={d._id}>Dr. {d.user?.name} - {d.specialization}</option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Operation Date" type="date" required className="h-14 rounded-2xl" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                            <Input label="Operation Time" type="time" required className="h-14 rounded-2xl" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} />
                        </div>
                        <Input label="Reason for Session" placeholder="Clinical summary..." className="h-14 rounded-2xl" value={formData.reason} onChange={e => setFormData({ ...formData, reason: e.target.value })} />
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <input type="checkbox" id="adm-urgent" className="h-5 w-5 rounded-lg border-slate-200 text-blue-600 focus:ring-0" checked={formData.isUrgent} onChange={e => setFormData({ ...formData, isUrgent: e.target.checked })} />
                            <label htmlFor="adm-urgent" className="font-black text-slate-700 text-sm cursor-pointer">Escalate as Urgent Case</label>
                        </div>
                    </div>
                    <div className="pt-4 flex flex-col gap-3">
                        {error && (
                            <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-2 text-rose-600 text-sm font-bold">
                                <AlertTriangle size={16} />{error}
                            </div>
                        )}
                        <div className="flex gap-4">
                            <Button variant="secondary" type="button" className="flex-1 h-14 rounded-2xl font-bold" onClick={() => setIsModalOpen(false)}>Abort</Button>
                            <Button variant="primary" type="submit" className="flex-1 h-14 rounded-2xl font-bold" disabled={loading}>
                                {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Confirm Reservation'}
                            </Button>
                        </div>
                    </div>
                </form>
            </Modal>

            {/* Details Modal */}
            <Modal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} title="Session Logistics File">
                {selectedApt && (
                    <div className="space-y-6">
                        <div className="p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center gap-6">
                            <div className="h-16 w-16 rounded-3xl bg-blue-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-100">
                                {selectedApt.patient?.user?.name?.charAt(0)}
                            </div>
                            <div>
                                <h4 className="text-xl font-black text-slate-900 tracking-tight">{selectedApt.patient?.user?.name}</h4>
                                <div className="flex gap-2 mt-1">
                                    <Badge variant="info" className="text-[8px] px-2">CONSULTATION</Badge>
                                    <Badge variant={selectedApt.status === 'Completed' ? 'success' : 'warning'} className="text-[8px] px-2">{selectedApt.status}</Badge>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white border border-slate-100 rounded-2xl">
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Doctor In Charge</p>
                                <p className="font-black text-slate-700">Dr. {selectedApt.doctor?.user?.name}</p>
                            </div>
                            <div className="p-4 bg-white border border-slate-100 rounded-2xl">
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Financial Status</p>
                                <p className="font-black text-emerald-600">FULLY BILLED</p>
                            </div>
                        </div>

                        <div className="p-5 bg-white border border-slate-100 rounded-2xl">
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Clinical Objective</p>
                            <p className="text-sm font-bold text-slate-600 leading-relaxed italic">"{selectedApt.reason || 'General routine medical evaluation and diagnostic monitoring.'}"</p>
                        </div>

                        <div className="pt-4 flex gap-3 flex-wrap">
                            {selectedApt.status === 'Pending' && (
                                <Button
                                    variant="primary"
                                    className="flex-1 h-14 rounded-2xl font-bold bg-blue-600"
                                    onClick={() => handleUpdateStatus(selectedApt._id, 'Confirmed')}
                                >
                                    <CheckCircle2 size={18} className="mr-2" /> Confirm Appointment
                                </Button>
                            )}
                            {(selectedApt.status === 'Pending' || selectedApt.status === 'Confirmed') && (
                                <Button
                                    variant="primary"
                                    className="flex-1 h-14 rounded-2xl font-bold bg-emerald-600 border-emerald-600"
                                    onClick={() => handleUpdateStatus(selectedApt._id, 'Completed')}
                                >
                                    <CheckCircle2 size={18} className="mr-2" /> Mark Completed
                                </Button>
                            )}
                            <Button variant="secondary" className="h-14 rounded-2xl font-bold" onClick={() => setIsDetailsModalOpen(false)}>Dismiss</Button>
                            <Button variant="ghost" className="h-14 w-14 rounded-2xl bg-rose-50 text-rose-600" onClick={() => handleDelete(selectedApt._id)}><Trash2 size={20} /></Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Appointments;
