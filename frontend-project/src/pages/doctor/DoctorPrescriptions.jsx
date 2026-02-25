import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    FileText,
    Download,
    Printer,
    ChevronRight,
    Calendar,
    User,
    Pill,
    MoreHorizontal,
    Trash2
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import prescriptionService from '../../services/prescriptionService';
import { getDoctorAppointments } from '../../services/appointmentService';
import { Button, Input } from '../../components/UI';

const DoctorPrescriptions = () => {
    const { user } = useAuth();
    const [prescriptions, setPrescriptions] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // New Prescription State
    const [newPrescription, setNewPrescription] = useState({
        patient: '',
        appointment: '',
        medicines: [{ name: '', dosage: '', duration: '', instructions: '' }],
        notes: ''
    });

    useEffect(() => {
        fetchData();
    }, [user]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [prescRes, apptRes] = await Promise.all([
                prescriptionService.getDoctorPrescriptions(user.doctorId),
                getDoctorAppointments(user.doctorId)
            ]);
            setPrescriptions(prescRes.data);
            setAppointments(apptRes.data.filter(a => a.status !== 'Completed' && a.status !== 'Cancelled'));
            setLoading(false);
        } catch (err) {
            console.error('Error fetching data:', err);
            setLoading(false);
        }
    };

    const handleAddMedicine = () => {
        setNewPrescription({
            ...newPrescription,
            medicines: [...newPrescription.medicines, { name: '', dosage: '', duration: '', instructions: '' }]
        });
    };

    const handleRemoveMedicine = (index) => {
        const meds = [...newPrescription.medicines];
        meds.splice(index, 1);
        setNewPrescription({ ...newPrescription, medicines: meds });
    };

    const handleMedicineChange = (index, field, value) => {
        const meds = [...newPrescription.medicines];
        meds[index][field] = value;
        setNewPrescription({ ...newPrescription, medicines: meds });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...newPrescription,
                doctor: user.doctorId
            };
            await prescriptionService.create(payload);
            setShowModal(false);
            setNewPrescription({
                patient: '',
                appointment: '',
                medicines: [{ name: '', dosage: '', duration: '', instructions: '' }],
                notes: ''
            });
            fetchData();
        } catch (err) {
            console.error('Error creating prescription:', err);
        }
    };

    const filteredPrescriptions = prescriptions.filter(p =>
        p.patient?.user?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="flex items-center justify-center h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Digital Prescriptions</h1>
                    <p className="text-slate-500 font-medium">Issue and manage patient medications</p>
                </div>
                <Button variant="primary" className="rounded-2xl h-12 px-8" onClick={() => setShowModal(true)}>
                    <Plus size={20} className="mr-2" />
                    Create New Prescription
                </Button>
            </div>

            <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1">
                    <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by patient name..."
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-100 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="rounded-xl h-11"><Printer size={18} className="mr-2" /> Print All</Button>
                    <Button variant="outline" className="rounded-xl h-11"><Download size={18} className="mr-2" /> Export</Button>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50/50">
                            <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Prescription ID</th>
                            <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Patient</th>
                            <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                            <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Medicines</th>
                            <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredPrescriptions.map((presc) => (
                            <tr key={presc._id} className="hover:bg-slate-50/30 transition-colors group">
                                <td className="px-8 py-5 font-bold text-blue-600 text-sm">#{presc._id.substring(0, 8)}</td>
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 text-xs font-bold">
                                            {presc.patient?.user?.name.charAt(0)}
                                        </div>
                                        <span className="font-bold text-slate-700">{presc.patient?.user?.name}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <span className="text-sm font-medium text-slate-500 flex items-center gap-2">
                                        <Calendar size={14} className="text-slate-400" />
                                        {new Date(presc.date).toLocaleDateString()}
                                    </span>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex -space-x-2">
                                        {presc.medicines.slice(0, 3).map((m, i) => (
                                            <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-blue-50 flex items-center justify-center text-blue-600" title={m.name}>
                                                <Pill size={14} />
                                            </div>
                                        ))}
                                        {presc.medicines.length > 3 && (
                                            <div className="h-8 w-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-slate-400 text-[10px] font-bold">
                                                +{presc.medicines.length - 3}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Printer size={18} /></button>
                                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Download size={18} /></button>
                                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><ChevronRight size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Create Prescription Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
                    <div className="relative bg-white rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-2xl font-bold text-slate-900">New Digital Prescription</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors"><MoreHorizontal size={24} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Select Appointment</label>
                                    <select
                                        className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-100"
                                        required
                                        onChange={(e) => {
                                            const appt = appointments.find(a => a._id === e.target.value);
                                            setNewPrescription({
                                                ...newPrescription,
                                                appointment: e.target.value,
                                                patient: appt?.patient?._id
                                            });
                                        }}
                                    >
                                        <option value="">Select an appointment</option>
                                        {appointments.map(a => (
                                            <option key={a._id} value={a._id}>{a.patient?.user?.name} - {new Date(a.date).toLocaleDateString()}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Date</label>
                                    <input type="text" disabled value={new Date().toLocaleDateString()} className="w-full p-4 bg-slate-100 border-none rounded-2xl text-sm font-medium text-slate-400" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                        <Pill className="text-blue-600" size={20} /> Medicines
                                    </h3>
                                    <button type="button" onClick={handleAddMedicine} className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:underline">
                                        <Plus size={16} /> Add Medicine
                                    </button>
                                </div>

                                {newPrescription.medicines.map((med, index) => (
                                    <div key={index} className="p-6 bg-slate-50 rounded-[24px] space-y-4 relative group">
                                        {newPrescription.medicines.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveMedicine(index)}
                                                className="absolute -top-2 -right-2 h-8 w-8 bg-white text-rose-500 rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-rose-50"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Input
                                                label="Medicine Name"
                                                placeholder="e.g. Paracetamol"
                                                required
                                                value={med.name}
                                                onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                                            />
                                            <Input
                                                label="Dosage"
                                                placeholder="e.g. 500mg"
                                                required
                                                value={med.dosage}
                                                onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Input
                                                label="Duration"
                                                placeholder="e.g. 5 days"
                                                required
                                                value={med.duration}
                                                onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                                            />
                                            <Input
                                                label="Instructions"
                                                placeholder="e.g. After meal"
                                                value={med.instructions}
                                                onChange={(e) => handleMedicineChange(index, 'instructions', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Additional Notes</label>
                                <textarea
                                    className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-100 h-32"
                                    placeholder="Any additional advice for the patient..."
                                    value={newPrescription.notes}
                                    onChange={(e) => setNewPrescription({ ...newPrescription, notes: e.target.value })}
                                ></textarea>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button type="button" variant="outline" className="flex-1 h-14 rounded-2xl" onClick={() => setShowModal(false)}>Cancel</Button>
                                <Button type="submit" variant="primary" className="flex-1 h-14 rounded-2xl shadow-xl shadow-blue-100">Save & Finalize</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorPrescriptions;
