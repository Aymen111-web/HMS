import React, { useState, useEffect } from 'react';
import {
    FileText,
    Download,
    Search,
    Loader2,
    Calendar,
    User,
    ChevronRight,
    Printer,
    Pill
} from 'lucide-react';
import { Card, Button, Input, Badge } from '../../components/UI';
import { useAuth } from '../../hooks/useAuth';
import { getPatientPrescriptions } from '../../services/patientService';

const PatientPrescriptions = () => {
    const { user } = useAuth();
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (user?.patientId) {
            fetchPrescriptions();
        }
    }, [user]);

    const fetchPrescriptions = async () => {
        try {
            const res = await getPatientPrescriptions(user.patientId);
            if (res.data.success) {
                setPrescriptions(res.data.data);
                if (res.data.data.length > 0) {
                    setSelectedPrescription(res.data.data[0]);
                }
            }
        } catch (err) {
            console.error('Error fetching prescriptions:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredPrescriptions = prescriptions.filter(p =>
        p.doctor?.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.medicines.some(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
                <Loader2 size={40} className="animate-spin text-blue-600" />
                <p className="text-slate-500 font-medium">Loading your medical prescriptions...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Prescriptions</h1>
                <p className="text-slate-500 font-medium mt-1">Access and manage your prescribed medications</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* List of Prescriptions */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="relative">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <Input
                            placeholder="Search medicine or doctor..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-12 pl-12 rounded-2xl bg-white border-slate-200"
                        />
                    </div>

                    <div className="space-y-4">
                        {filteredPrescriptions.length > 0 ? (
                            filteredPrescriptions.map(p => (
                                <div
                                    key={p._id}
                                    onClick={() => setSelectedPrescription(p)}
                                    className={`
                                        p-5 rounded-3xl border transition-all cursor-pointer group
                                        ${selectedPrescription?._id === p._id
                                            ? 'bg-blue-600 border-blue-600 shadow-xl shadow-blue-900/10'
                                            : 'bg-white border-slate-100 hover:border-blue-200 hover:shadow-lg hover:shadow-slate-200/50'}
                                    `}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className={`
                                            h-10 w-10 rounded-xl flex items-center justify-center transition-colors
                                            ${selectedPrescription?._id === p._id ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'}
                                        `}>
                                            <FileText size={20} />
                                        </div>
                                        <p className={`text-[10px] font-black uppercase tracking-wider ${selectedPrescription?._id === p._id ? 'text-blue-100' : 'text-slate-400'}`}>
                                            {new Date(p.date || p.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <h4 className={`font-bold mb-1 transition-colors ${selectedPrescription?._id === p._id ? 'text-white' : 'text-slate-900'}`}>
                                        Dr. {p.doctor?.user?.name}
                                    </h4>
                                    <p className={`text-xs font-semibold mb-3 ${selectedPrescription?._id === p._id ? 'text-blue-100' : 'text-blue-600'}`}>
                                        {p.doctor?.user?.specialization || 'Medical Specialist'}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className={`text-[11px] font-bold ${selectedPrescription?._id === p._id ? 'text-blue-200' : 'text-slate-400'}`}>
                                            {p.medicines.length} Medicines
                                        </span>
                                        <ChevronRight size={16} className={selectedPrescription?._id === p._id ? 'text-white' : 'text-slate-300'} />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-12 text-center bg-white rounded-3xl border border-slate-100 border-dashed">
                                <FileText size={32} className="mx-auto text-slate-200 mb-3" />
                                <p className="text-slate-400 font-medium text-sm">No prescriptions found</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Detailed View */}
                <div className="lg:col-span-2">
                    {selectedPrescription ? (
                        <Card className="p-0 overflow-hidden border-none shadow-2xl shadow-slate-200/50">
                            {/* Header */}
                            <div className="bg-slate-900 p-8 text-white">
                                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white">
                                                <Pill size={24} />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-black tracking-tight">Prescription Details</h2>
                                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                                                    ID: {selectedPrescription._id.substring(0, 12)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" className="bg-white/10 text-white hover:bg-white/20 border-none rounded-xl h-12 px-5">
                                            <Printer size={18} className="mr-2" />
                                            Print
                                        </Button>
                                        <Button variant="primary" className="h-12 px-5 rounded-xl">
                                            <Download size={18} className="mr-2" />
                                            Download PDF
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 pt-8 border-t border-white/10">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center text-blue-400">
                                            <User size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Prescribing Doctor</p>
                                            <p className="font-bold">Dr. {selectedPrescription.doctor?.user?.name}</p>
                                            <p className="text-blue-400 text-xs font-bold">{selectedPrescription.doctor?.user?.specialization || 'General Physician'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center text-emerald-400">
                                            <Calendar size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Prescription Date</p>
                                            <p className="font-bold">{new Date(selectedPrescription.date || selectedPrescription.createdAt).toLocaleDateString('default', { dateStyle: 'long' })}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Medications */}
                            <div className="p-8 space-y-8 bg-white">
                                <div>
                                    <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                                        <Badge variant="success" className="px-3 py-1">Rx</Badge>
                                        Prescribed Medications
                                    </h3>
                                    <div className="overflow-hidden border border-slate-100 rounded-[2rem]">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="bg-slate-50">
                                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Medicine Name</th>
                                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Dosage</th>
                                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Duration</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {selectedPrescription.medicines.map((m, idx) => (
                                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                                        <td className="px-6 py-6">
                                                            <p className="font-bold text-slate-800">{m.name}</p>
                                                            <p className="text-xs text-slate-500 mt-1 italic">{m.instructions || 'Take as directed'}</p>
                                                        </td>
                                                        <td className="px-6 py-6 font-semibold text-slate-600">{m.dosage}</td>
                                                        <td className="px-6 py-6">
                                                            <Badge variant="info" className="font-bold">{m.duration}</Badge>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {selectedPrescription.notes && (
                                    <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100">
                                        <h4 className="text-xs font-black text-amber-700 uppercase tracking-widest mb-2 flex items-center gap-2">
                                            <FileText size={14} />
                                            Doctor's Advice & Notes
                                        </h4>
                                        <p className="text-slate-700 text-sm leading-relaxed font-medium">
                                            {selectedPrescription.notes}
                                        </p>
                                    </div>
                                )}

                                <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                                        <p className="text-xs font-bold uppercase tracking-tighter">Valid until: {new Date(new Date(selectedPrescription.date || selectedPrescription.createdAt).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                                    </div>
                                    <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Electronic Medical Record • HMS Secure</p>
                                </div>
                            </div>
                        </Card>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-3xl border border-slate-100 border-dashed">
                            <Pill size={64} className="text-slate-100 mb-6" />
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Select a prescription</h3>
                            <p className="text-slate-500 max-w-xs mx-auto">Choose a prescription from the list on the left to view detailed information and medications.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientPrescriptions;
