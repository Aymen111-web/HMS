import React, { useState, useEffect } from 'react';
import {
    ClipboardList,
    CheckCircle,
    XCircle,
    Search,
    FileText,
    User,
    Stethoscope,
    MessageCircle,
    Clock,
    AlertCircle
} from 'lucide-react';
import { Button, Modal, Badge } from '../../components/UI';
import api from '../../services/api';

const PharmacyDashboard = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('PENDING'); // PENDING, APPROVED, REJECTED
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [isDispenseModalOpen, setIsDispenseModalOpen] = useState(false);
    const [notes, setNotes] = useState('');

    useEffect(() => {
        fetchPrescriptions();
    }, [activeTab]);

    const fetchPrescriptions = async () => {
        try {
            setLoading(true);
            let endpoint = '/pharmacy/prescriptions/pending';
            if (activeTab === 'APPROVED') endpoint = '/pharmacy/prescriptions/approved';
            if (activeTab === 'REJECTED') endpoint = '/pharmacy/prescriptions/rejected';

            const res = await api.get(endpoint);
            if (res.data.success) {
                setPrescriptions(res.data.data);
            }
        } catch (err) {
            console.error('Error fetching prescriptions:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        try {
            await api.patch(`/pharmacy/prescriptions/${selectedPrescription._id}/approve`, { notes });
            setIsApproveModalOpen(false);
            setNotes('');
            fetchPrescriptions();
        } catch (err) {
            console.error('Error approving prescription:', err);
        }
    };

    const handleReject = async () => {
        try {
            if (!notes) {
                alert('Please provide a reason for rejection');
                return;
            }
            await api.patch(`/pharmacy/prescriptions/${selectedPrescription._id}/reject`, { rejectionReason: notes });
            setIsRejectModalOpen(false);
            setNotes('');
            fetchPrescriptions();
        } catch (err) {
            console.error('Error rejecting prescription:', err);
        }
    };

    const handleDispense = async () => {
        try {
            await api.patch(`/pharmacy/prescriptions/${selectedPrescription._id}/dispense`);
            setIsDispenseModalOpen(false);
            fetchPrescriptions();
        } catch (err) {
            console.error('Error dispensing prescription:', err);
        }
    };

    const filteredPrescriptions = prescriptions.filter(p =>
        p.patient?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.doctor?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="flex items-center justify-center h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Pharmacy Dashboard</h1>
                    <p className="text-slate-500 font-medium mt-1">Global Medical Fulfillment Hub</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex p-1.5 bg-slate-100 rounded-[2rem] w-fit">
                {[
                    { id: 'PENDING', label: 'Pending Review', icon: Clock },
                    { id: 'APPROVED', label: 'Ready for Pickup', icon: CheckCircle },
                    { id: 'REJECTED', label: 'History & Rejected', icon: XCircle }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-[1.75rem] text-sm font-bold transition-all ${activeTab === tab.id
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                        {tab.id === 'PENDING' && prescriptions.length > 0 && activeTab === 'PENDING' && (
                            <span className="ml-1 px-2 py-0.5 bg-blue-600 text-white text-[10px] rounded-full">
                                {prescriptions.length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
                <div className="relative">
                    <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by patient or doctor name..."
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-100 transition-all font-bold text-slate-700"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Prescription List */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {filteredPrescriptions.length > 0 ? filteredPrescriptions.map((presc) => (
                    <div key={presc._id} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all">
                        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
                                    {presc.patient?.user?.name?.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">{presc.patient?.user?.name}</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                        {new Date(presc.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <Badge
                                variant={
                                    presc.status === 'APPROVED' ? 'success' :
                                        presc.status === 'REJECTED' ? 'danger' :
                                            'warning'
                                }
                            >
                                {presc.status}
                                {presc.dispensed && ' • DISPENSED'}
                            </Badge>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-2xl">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                                        <Stethoscope size={12} /> Prescribed By
                                    </p>
                                    <p className="font-bold text-slate-700 text-sm">Dr. {presc.doctor?.user?.name || 'Staff'}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                                        <FileText size={12} /> Diagnosis
                                    </p>
                                    <p className="font-bold text-slate-700 text-sm truncate" title={presc.diagnosis}>{presc.diagnosis || 'General Consultation'}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3">Medicine List</p>
                                <div className="space-y-2">
                                    {presc.medicines.map((med, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                                                <span className="font-bold text-slate-700 text-sm">{med.name}</span>
                                            </div>
                                            <div className="flex gap-4 text-[11px] font-bold text-slate-400">
                                                <span>{med.dosage}</span>
                                                <span className="text-slate-300">•</span>
                                                <span>{med.duration}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {activeTab === 'REJECTED' && presc.rejectionReason && (
                                <div className="p-4 bg-rose-50 text-rose-700 rounded-2xl border border-rose-100">
                                    <p className="text-[10px] font-black uppercase tracking-widest mb-1">Rejection Reason</p>
                                    <p className="text-sm font-medium">{presc.rejectionReason}</p>
                                </div>
                            )}

                            {activeTab === 'APPROVED' && presc.pharmacyNotes && (
                                <div className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100">
                                    <p className="text-[10px] font-black uppercase tracking-widest mb-1">Pharmacy Notes</p>
                                    <p className="text-sm font-medium">{presc.pharmacyNotes}</p>
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                {activeTab === 'PENDING' && (
                                    <>
                                        <Button
                                            variant="success"
                                            className="flex-1 h-12 rounded-2xl flex items-center justify-center gap-2"
                                            onClick={() => {
                                                setSelectedPrescription(presc);
                                                setIsApproveModalOpen(true);
                                            }}
                                        >
                                            <CheckCircle size={18} /> Approve
                                        </Button>
                                        <Button
                                            variant="danger"
                                            className="flex-1 h-12 rounded-2xl flex items-center justify-center gap-2"
                                            onClick={() => {
                                                setSelectedPrescription(presc);
                                                setIsRejectModalOpen(true);
                                            }}
                                        >
                                            <XCircle size={18} /> Reject
                                        </Button>
                                    </>
                                )}
                                {activeTab === 'APPROVED' && !presc.dispensed && (
                                    <Button
                                        variant="primary"
                                        className="w-full h-12 rounded-2xl flex items-center justify-center gap-2"
                                        onClick={() => {
                                            setSelectedPrescription(presc);
                                            setIsDispenseModalOpen(true);
                                        }}
                                    >
                                        <CheckCircle size={18} /> Mark as Dispensed
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full py-20 text-center bg-white rounded-[32px] border border-slate-100 border-dashed">
                        <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                            {activeTab === 'PENDING' ? <ClipboardList size={40} /> : <FileText size={40} />}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1 font-black">Nothing to show</h3>
                        <p className="text-slate-500 font-medium">Your request returned zero records.</p>
                    </div>
                )}
            </div>

            {/* Approve Modal */}
            <Modal isOpen={isApproveModalOpen} onClose={() => setIsApproveModalOpen(false)} title="Confirm Approval">
                <div className="space-y-4">
                    <div className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl flex items-start gap-3">
                        <AlertCircle className="mt-0.5" size={18} />
                        <p className="text-sm font-medium">Are you sure you want to approve this prescription? The patient will be notified that it is ready for pickup.</p>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Pharmacy Notes (Optional)</label>
                        <textarea
                            className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-100 transition-all text-sm font-medium min-h-[100px]"
                            placeholder="Add pickup instructions or notes for the patient..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setIsApproveModalOpen(false)}>Cancel</Button>
                        <Button variant="success" className="flex-1 rounded-xl" onClick={handleApprove}>Approve & Notify</Button>
                    </div>
                </div>
            </Modal>

            {/* Reject Modal */}
            <Modal isOpen={isRejectModalOpen} onClose={() => setIsRejectModalOpen(false)} title="Reject Prescription">
                <div className="space-y-4">
                    <div className="p-4 bg-rose-50 text-rose-700 rounded-2xl flex items-start gap-3">
                        <AlertCircle className="mt-0.5" size={18} />
                        <p className="text-sm font-medium">Please provide a clear reason for rejection. This will be visible to both the doctor and the patient.</p>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Reason for Rejection (Required)</label>
                        <textarea
                            className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-100 transition-all text-sm font-medium min-h-[120px]"
                            placeholder="e.g., Medicine out of stock, dosage requires clarification..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setIsRejectModalOpen(false)}>Cancel</Button>
                        <Button variant="danger" className="flex-1 rounded-xl" onClick={handleReject}>Confirm Rejection</Button>
                    </div>
                </div>
            </Modal>

            {/* Dispense Modal */}
            <Modal isOpen={isDispenseModalOpen} onClose={() => setIsDispenseModalOpen(false)} title="Confirm Collection">
                <div className="space-y-4">
                    <div className="p-4 bg-blue-50 text-blue-700 rounded-2xl flex items-start gap-3">
                        <AlertCircle className="mt-0.5" size={18} />
                        <p className="text-sm font-medium">Confirm that the patient has collected their medication. This action will mark the prescription as Dispensed.</p>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setIsDispenseModalOpen(false)}>Cancel</Button>
                        <Button variant="primary" className="flex-1 rounded-xl shadow-lg ring-4 ring-blue-50" onClick={handleDispense}>Mark as Dispensed</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default PharmacyDashboard;
