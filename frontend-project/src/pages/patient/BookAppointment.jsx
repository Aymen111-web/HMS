import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Clock,
    User,
    Stethoscope,
    Loader2,
    CheckCircle,
    AlertCircle,
    ArrowRight
} from 'lucide-react';
import { Card, Button, Input, Select, Badge } from '../../components/UI';
import { useAuth } from '../../hooks/useAuth';
import { getDoctors } from '../../services/doctorService';
import { createAppointment } from '../../services/patientService';
import { useNavigate } from 'react-router-dom';

const BookAppointment = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        doctorId: '',
        date: '',
        time: '',
        type: 'Normal',
        department: '',
        reason: ''
    });

    const departments = [
        'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics',
        'Dermatology', 'Gastroenterology', 'General Medicine', 'Radiology'
    ];

    const timeSlots = [
        '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
        '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
        '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
    ];

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await getDoctors();
                if (res.data.success) {
                    setDoctors(res.data.data);
                }
            } catch (err) {
                console.error('Error fetching doctors:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const appointmentData = {
                patientId: user.patientId,
                doctorId: formData.doctorId,
                date: formData.date,
                time: formData.time,
                isUrgent: formData.type === 'Urgent',
                reason: formData.reason,
                status: 'Pending'
            };

            const res = await createAppointment(appointmentData);
            if (res.data.success) {
                setSuccess(true);
                setTimeout(() => navigate('/patient/appointments'), 2000);
            }
        } catch (err) {
            console.error('Error booking appointment:', err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
                <Loader2 size={40} className="animate-spin text-blue-600" />
                <p className="text-slate-500 font-medium">Checking doctor availability...</p>
            </div>
        );
    }

    if (success) {
        return (
            <div className="h-[80vh] flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
                <div className="h-24 w-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6 shadow-lg shadow-emerald-50">
                    <CheckCircle size={48} />
                </div>
                <h1 className="text-3xl font-black text-slate-900 mb-2">Booking Successful!</h1>
                <p className="text-slate-500 max-w-md mx-auto">
                    Your appointment has been scheduled and is currently pending approval from the doctor.
                </p>
                <div className="mt-8 flex gap-4">
                    <Button variant="primary" onClick={() => navigate('/patient/appointments')}>
                        View My Appointments
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="h-10 w-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
                >
                    <ArrowRight className="rotate-180" size={20} />
                </button>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Schedule Consultation</h1>
                    <p className="text-slate-500 font-medium">Book a time with our expert medical team</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Step 1: Doctor & Department */}
                    <Card title="Select Professional" className="overflow-visible">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Specialization</label>
                                <Select
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    required
                                    className="h-12 rounded-xl"
                                >
                                    <option value="">Select Department</option>
                                    {departments.map(dept => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Consultant</label>
                                <Select
                                    name="doctorId"
                                    value={formData.doctorId}
                                    onChange={handleChange}
                                    required
                                    disabled={!doctors.length}
                                    className="h-12 rounded-xl"
                                >
                                    <option value="">Choose Doctor</option>
                                    {doctors
                                        .filter(d => !formData.department || d.specialization === formData.department)
                                        .map(doctor => (
                                            <option key={doctor._id} value={doctor._id}>
                                                Dr. {doctor.user?.name}
                                            </option>
                                        ))}
                                </Select>
                            </div>
                        </div>
                    </Card>

                    {/* Step 2: Date & Time */}
                    <Card title="Appointment Timing">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Preferred Date</label>
                                <Input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                    className="h-12 rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Preferred Time Slot</label>
                                <Select
                                    name="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    required
                                    className="h-12 rounded-xl"
                                >
                                    <option value="">Select Slot</option>
                                    {timeSlots.map(slot => (
                                        <option key={slot} value={slot}>{slot}</option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                    </Card>

                    {/* Step 3: Additional Info */}
                    <Card title="Consultation Details">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Reason for Visit</label>
                                <textarea
                                    name="reason"
                                    value={formData.reason}
                                    onChange={handleChange}
                                    required
                                    rows="4"
                                    placeholder="Briefly describe your symptoms or reason for the appointment..."
                                    className="w-full p-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-slate-700 bg-slate-50/30"
                                ></textarea>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="space-y-8">
                    {/* Booking Summary Card */}
                    <Card className="sticky top-24 bg-blue-600 border-none text-white overflow-hidden">
                        <div className="relative z-10 space-y-6">
                            <h3 className="text-xl font-black">Booking Summary</h3>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center shrink-0">
                                        <Stethoscope size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-blue-200">Consultant</p>
                                        <p className="font-bold">
                                            {doctors.find(d => d._id === formData.doctorId)?.user?.name ?
                                                `Dr. ${doctors.find(d => d._id === formData.doctorId)?.user?.name}` :
                                                'Not selected'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center shrink-0">
                                        <Calendar size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-blue-200">Scheduled Date</p>
                                        <p className="font-bold">{formData.date || 'Not selected'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center shrink-0">
                                        <Clock size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-blue-200">Time Slot</p>
                                        <p className="font-bold">{formData.time || 'Not selected'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-blue-500/50">
                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-blue-200 font-medium">Appointment Type</span>
                                    <div className="flex p-1 bg-blue-700/50 rounded-lg">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type: 'Normal' })}
                                            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${formData.type === 'Normal' ? 'bg-white text-blue-600 shadow-sm' : 'text-white/70'}`}
                                        >
                                            Normal
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type: 'Urgent' })}
                                            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${formData.type === 'Urgent' ? 'bg-rose-500 text-white shadow-sm' : 'text-white/70'}`}
                                        >
                                            Urgent
                                        </button>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-14 bg-white text-blue-600 hover:bg-blue-50 border-none font-black text-lg rounded-2xl shadow-xl shadow-blue-900/20"
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <Loader2 className="animate-spin" />
                                    ) : (
                                        'Confirm Booking'
                                    )}
                                </Button>
                                <p className="text-[10px] text-center text-blue-200 mt-4 leading-relaxed px-4">
                                    By clicking confirm, you agree to our hospital policy and terms of service.
                                </p>
                            </div>
                        </div>

                        {/* Abstract Background Elements */}
                        <div className="absolute top-0 right-0 h-32 w-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
                        <div className="absolute bottom-0 left-0 h-48 w-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
                    </Card>

                    <div className="p-6 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center text-center gap-2">
                        <AlertCircle className="text-slate-300 mb-2" size={32} />
                        <h5 className="font-bold text-slate-700 text-sm">Need help booking?</h5>
                        <p className="text-xs text-slate-500 leading-relaxed">Call our 24/7 help desk at <br /> <span className="font-bold text-blue-600">+1 (555) 123-4567</span></p>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default BookAppointment;
