import React, { useState, useEffect } from 'react';
import {
    Plus,
    Trash2,
    Save,
    User,
    Clipboard,
    Pill,
    AlertCircle,
    ArrowLeft,
    CheckCircle,
    Loader2
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { createPrescription, getPrescriptionInitData } from '../../services/prescriptionService';
import { Button, Input, Card } from '../../components/UI';

const CreatePrescription = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { appointmentId } = useParams();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        patientId: '',
        patientName: '',
        appointmentId: appointmentId || '',
        diagnosis: '',
        medicines: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
        instructions: ''
    });

    useEffect(() => {
        if (!appointmentId) {
            navigate('/doctor/appointments');
            return;
        }
        fetchInitData();
    }, [appointmentId]);

    const fetchInitData = async () => {
        try {
            setLoading(true);
            const res = await getPrescriptionInitData(appointmentId);
            if (res.data.success) {
                const { patientId, patientName, diagnosis } = res.data.data;
                setFormData(prev => ({
                    ...prev,
                    patientId,
                    patientName,
                    diagnosis: diagnosis || prev.diagnosis
                }));
            }
        } catch (err) {
            console.error('Error fetching init data:', err);
            setError(err.response?.data?.message || 'Failed to fetch appointment data');
        } finally {
            setLoading(false);
        }
    };

    const handleAddMedicine = () => {
        setFormData({
            ...formData,
            medicines: [...formData.medicines, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }]
        });
    };

    const handleRemoveMedicine = (index) => {
        if (formData.medicines.length === 1) return;
        const newMeds = [...formData.medicines];
        newMeds.splice(index, 1);
        setFormData({ ...formData, medicines: newMeds });
    };

    const handleMedicineChange = (index, field, value) => {
        const newMeds = [...formData.medicines];
        newMeds[index][field] = value;
        setFormData({ ...formData, medicines: newMeds });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.diagnosis) {
            setError('Diagnosis is required');
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const res = await createPrescription(formData);
            if (res.data.success) {
                setSuccess(true);
                setTimeout(() => navigate('/doctor/appointments'), 2000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save prescription');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-400">
                <Loader2 className="animate-spin" size={40} />
                <p className="font-bold">Verifying appointment session...</p>
            </div>
        );
    }

    if (error && !formData.patientId) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center p-8 text-center">
                <div className="bg-rose-50 text-rose-600 p-4 rounded-3xl mb-6 flex items-center gap-3 font-bold border border-rose-100">
                    <AlertCircle size={24} />
                    {error}
                </div>
                <Button variant="primary" onClick={() => navigate('/doctor/appointments')}>
                    Back to Appointments
                </Button>
            </div>
        );
    }

    if (success) {
        return (
            <div className="h-[70vh] flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
                <div className="h-24 w-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6 shadow-xl shadow-emerald-50">
                    <CheckCircle size={48} />
                </div>
                <h1 className="text-3xl font-black text-slate-900 mb-2">Prescription Saved!</h1>
                <p className="text-slate-500 max-w-md mx-auto font-medium">
                    The appointment is now completed and the digital prescription has been sent.
                </p>
                <div className="mt-8">
                    <Button variant="primary" onClick={() => navigate('/doctor/appointments')} className="h-12 px-8 rounded-xl">
                        Return to Appointments
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="h-10 w-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Prescribe Medication</h1>
                    <p className="text-slate-500 font-medium mt-1">Locked Session for {formData.patientName}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Diagnosis & Patient */}
                    <Card title="Clinical Consultation Details" className="shadow-sm border-slate-100">
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-1.5">
                                        <User size={14} className="text-blue-600" /> Patient Info
                                    </label>
                                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Medical Recipient</p>
                                            <p className="font-bold text-slate-900">{formData.patientName}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Current Diagnosis <span className="text-rose-500">*</span></label>
                                    <input
                                        type="text"
                                        placeholder="Enter definitive diagnosis..."
                                        className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                        value={formData.diagnosis}
                                        onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Medications */}
                    <Card
                        title={
                            <div className="flex justify-between items-center w-full">
                                <span className="flex items-center gap-2">Medicines Section</span>
                                <button
                                    type="button"
                                    onClick={handleAddMedicine}
                                    className="text-blue-600 text-xs font-black flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                    <Plus size={14} /> Add Medicine
                                </button>
                            </div>
                        }
                    >
                        <div className="space-y-6">
                            {formData.medicines.map((med, index) => (
                                <div key={index} className="px-6 py-8 bg-slate-50/50 rounded-3xl border border-slate-100 space-y-4 relative group">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="h-8 w-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-blue-600 font-black text-xs">
                                            {index + 1}
                                        </div>
                                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Drug Configuration</span>
                                        {formData.medicines.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveMedicine(index)}
                                                className="ml-auto text-rose-500 hover:text-rose-600 p-1.5 hover:bg-rose-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input
                                            label="Medicine Name"
                                            placeholder="Brand or Generic Name"
                                            className="font-bold"
                                            value={med.name}
                                            onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                                            required
                                        />
                                        <Input
                                            label="Dosage"
                                            placeholder="e.g. 1 Tablet"
                                            className="font-bold"
                                            value={med.dosage}
                                            onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <Input
                                            label="Frequency"
                                            placeholder="e.g. 1-1-1"
                                            className="font-bold"
                                            value={med.frequency}
                                            onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                                        />
                                        <Input
                                            label="Duration"
                                            placeholder="e.g. 5 Days"
                                            className="font-bold"
                                            value={med.duration}
                                            onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                                            required
                                        />
                                        <Input
                                            label="Special Instructions"
                                            placeholder="e.g. Empty stomach"
                                            className="font-bold"
                                            value={med.instructions}
                                            onChange={(e) => handleMedicineChange(index, 'instructions', e.target.value)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* General Instructions */}
                    <Card title="Patient Advice & Tips">
                        <textarea
                            className="w-full h-32 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all outline-none"
                            placeholder="Additional notes for the patient..."
                            value={formData.instructions}
                            onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                        ></textarea>
                    </Card>
                </div>

                <div className="space-y-8">
                    <Card className="sticky top-24 bg-slate-900 border-none text-white shadow-2xl overflow-hidden group">
                        <div className="relative z-10 space-y-6">
                            <div className="pb-6 border-b border-white/10">
                                <h3 className="text-xl font-black">Issue Record</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Final Verification</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400 font-bold">Medicines</span>
                                    <span className="font-black">{formData.medicines.length}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400 font-bold">Status</span>
                                    <span className="text-blue-400 font-black uppercase tracking-wider text-[10px]">Draft</span>
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 text-xs font-bold animate-pulse">
                                    {error}
                                </div>
                            )}

                            <div className="pt-4 space-y-3">
                                <Button
                                    type="submit"
                                    className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white border-none font-black text-lg transition-all shadow-xl shadow-blue-900/20"
                                    disabled={submitting}
                                >
                                    {submitting ? <Loader2 className="animate-spin" /> : <><Save size={20} className="mr-2" /> Save & Finalize</>}
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="w-full h-12 text-slate-400 font-bold hover:text-white"
                                    onClick={() => navigate('/doctor/appointments')}
                                >
                                    Cancel Consultation
                                </Button>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-600/20 transition-all"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-600/10 rounded-full blur-3xl -ml-16 -mb-16 group-hover:bg-purple-600/20 transition-all"></div>
                    </Card>
                </div>
            </form>
        </div>
    );
};

export default CreatePrescription;
