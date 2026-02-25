import React, { useState, useEffect } from 'react';
import {
    CreditCard,
    Download,
    Clock,
    CheckCircle,
    AlertCircle,
    ArrowRight,
    Loader2,
    Calendar,
    Search,
    Receipt,
    History
} from 'lucide-react';
import { Card, Badge, Button, Input, Modal } from '../../components/UI';
import { useAuth } from '../../hooks/useAuth';
import { getPatientPayments } from '../../services/patientService';

const PatientPayments = () => {
    const { user } = useAuth();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('all');
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);

    useEffect(() => {
        if (user?.patientId) {
            fetchPayments();
        }
    }, [user]);

    const fetchPayments = async () => {
        try {
            const res = await getPatientPayments(user.patientId);
            if (res.data.success) {
                setPayments(res.data.data);
            }
        } catch (err) {
            console.error('Error fetching payments:', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = (payment) => {
        setSelectedPayment(payment);
        setIsPaymentModalOpen(true);
    };

    const processPayment = async () => {
        setSubmitting(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            // Update UI
            if (selectedPayment) {
                setPayments(prev => prev.map(p => p._id === selectedPayment._id ? { ...p, status: 'Paid' } : p));
            } else {
                setPayments(prev => prev.map(p => ({ ...p, status: 'Paid' })));
            }
            alert('Payment processed successfully!');
            setIsPaymentModalOpen(false);
        } catch (err) {
            alert('Payment failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDownload = (payment) => {
        alert(`Downloading Invoice #INV-${payment._id.substring(0, 8)}.pdf...`);
    };

    const totalPaid = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);
    const totalPending = payments.filter(p => p.status === 'Pending').reduce((sum, p) => sum + p.amount, 0);

    const filteredPayments = activeTab === 'all'
        ? payments
        : payments.filter(p => p.status.toLowerCase() === activeTab.toLowerCase());

    if (loading) {
        return (
            <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
                <Loader2 size={40} className="animate-spin text-blue-600" />
                <p className="text-slate-500 font-medium">Loading your billing history...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Billing & Payments</h1>
                <p className="text-slate-500 font-medium mt-1">Manage your hospital invoices and payment history</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-blue-600 border-none text-white p-8 overflow-hidden relative group">
                    <div className="relative z-10">
                        <p className="text-blue-100 text-sm font-bold uppercase tracking-wider mb-2">Total Amount Pending</p>
                        <h2 className="text-4xl font-black tracking-tighter">${totalPending.toFixed(2)}</h2>
                        <Button
                            className="mt-6 bg-white text-blue-600 hover:bg-blue-50 border-none font-bold rounded-xl shadow-lg shadow-blue-900/40"
                            onClick={() => {
                                setSelectedPayment(null);
                                setIsPaymentModalOpen(true);
                            }}
                        >
                            Pay All Now <ArrowRight size={16} className="ml-2" />
                        </Button>
                    </div>
                    <CreditCard className="absolute top-1/2 right-[-20px] -translate-y-1/2 h-40 w-40 text-white/5 -rotate-12 transition-transform group-hover:rotate-0" />
                </Card>

                <Card className="bg-white border-slate-100 p-8 flex flex-col justify-between">
                    <div>
                        <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Total Paid (Lifetime)</p>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter">${totalPaid.toFixed(2)}</h2>
                    </div>
                    <div className="flex items-center gap-2 mt-4 text-emerald-600 font-bold text-sm">
                        <CheckCircle size={16} />
                        Successfully processed
                    </div>
                </Card>

                <Card className="bg-slate-900 border-none text-white p-8">
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Last Payment</p>
                    {payments.find(p => p.status === 'Paid') ? (
                        <>
                            <h2 className="text-3xl font-black text-white tracking-tight">
                                ${payments.find(p => p.status === 'Paid').amount.toFixed(2)}
                            </h2>
                            <p className="text-slate-400 text-xs mt-2 font-bold uppercase">
                                On {new Date(payments.find(p => p.status === 'Paid').date).toLocaleDateString()}
                            </p>
                        </>
                    ) : (
                        <p className="text-slate-500 italic mt-4">No payment history yet</p>
                    )}
                </Card>
            </div>

            <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex bg-slate-100/80 p-1.5 rounded-2xl">
                        {['all', 'Pending', 'Paid'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`
                                    px-6 py-2 rounded-xl text-sm font-bold transition-all capitalize
                                    ${activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}
                                `}
                            >
                                {tab === 'all' ? 'All Transactions' : tab}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full md:w-80">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <Input
                            placeholder="Find by ID or amount..."
                            className="pl-12 h-12 rounded-2xl bg-slate-50/50 border-slate-100"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Transaction Details</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Date</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Amount</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredPayments.length > 0 ? (
                                filteredPayments.map(payment => (
                                    <tr key={payment._id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                                    <Receipt size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800">Hospital Consultation</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase">ID: {payment._id.substring(0, 12)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-bold text-slate-600">{new Date(payment.date).toLocaleDateString()}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">{payment.method || 'Not specified'}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-lg font-black text-slate-900">${payment.amount.toFixed(2)}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <Badge variant={payment.status === 'Paid' ? 'success' : 'warning'} className="font-black px-4 py-1.5 rounded-xl">
                                                {payment.status}
                                            </Badge>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    className="h-10 w-10 p-0 rounded-xl hover:bg-white hover:shadow-md"
                                                    onClick={() => handleDownload(payment)}
                                                >
                                                    <Download size={18} className="text-slate-400 group-hover:text-blue-600" />
                                                </Button>
                                                {payment.status === 'Pending' && (
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        className="rounded-xl h-10 px-6 font-bold"
                                                        onClick={() => handlePayment(payment)}
                                                    >
                                                        Pay Now
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <History size={40} className="mx-auto text-slate-200 mb-4" />
                                        <p className="text-slate-400 font-bold">No payment records match your current filter.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100">
                    <h3 className="text-emerald-800 font-black uppercase text-xs tracking-widest mb-4">Payment Methods</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-emerald-100">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-12 bg-slate-900 rounded-md flex items-center justify-center text-white text-[10px] font-black">VISA</div>
                                <span className="text-sm font-bold text-slate-700">•••• •••• •••• 1234</span>
                            </div>
                            <Badge variant="success">Active</Badge>
                        </div>
                        <Button variant="ghost" className="w-full text-emerald-600 font-bold border-2 border-dashed border-emerald-200 h-14 rounded-2xl hover:bg-white">
                            + Add New Method
                        </Button>
                    </div>
                </div>

                <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 flex flex-col items-center justify-center text-center">
                    <Receipt size={40} className="text-slate-300 mb-4" />
                    <h3 className="text-lg font-black text-slate-900">Need Billing Help?</h3>
                    <p className="text-slate-500 text-sm font-medium mt-1 leading-relaxed">
                        If you have questions about your medical insurance coverage or invoice details, contact our finance department.
                    </p>
                    <Button variant="secondary" className="mt-6 rounded-xl">
                        Contact Finance Dept.
                    </Button>
                </div>
            </div>
            {/* Payment Processing Modal */}
            <Modal isOpen={isPaymentModalOpen} onClose={() => !submitting && setIsPaymentModalOpen(false)} title="Secure Checkout">
                <div className="space-y-6">
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col items-center text-center">
                        <div className="h-16 w-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-blue-100">
                            <CreditCard size={32} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                            ${selectedPayment ? selectedPayment.amount.toFixed(2) : totalPending.toFixed(2)}
                        </h3>
                        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">
                            {selectedPayment ? `Invoice #INV-${selectedPayment._id.substring(0, 8)}` : 'Total Pending Balance'}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between group cursor-pointer hover:border-blue-300 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-[10px]">VISA</div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">Standard Charter •••• 1234</p>
                                    <p className="text-xs text-slate-500">Expires 12/26</p>
                                </div>
                            </div>
                            <div className="h-6 w-6 rounded-full border-2 border-blue-600 flex items-center justify-center">
                                <div className="h-3 w-3 bg-blue-600 rounded-full"></div>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between opacity-60">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-[10px]">MC</div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">MasterCard •••• 5678</p>
                                    <p className="text-xs text-slate-500">Expires 08/25</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button
                            variant="secondary"
                            className="flex-1 h-14 rounded-2xl font-bold"
                            onClick={() => setIsPaymentModalOpen(false)}
                            disabled={submitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            className="flex-1 h-14 rounded-2xl font-bold shadow-xl shadow-blue-100"
                            onClick={processPayment}
                            disabled={submitting}
                        >
                            {submitting ? <Loader2 className="animate-spin" /> : `Pay $${selectedPayment ? selectedPayment.amount.toFixed(2) : totalPending.toFixed(2)}`}
                        </Button>
                    </div>

                    <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">
                        🔒 Encrypted 256-bit Secure SSL Transaction
                    </p>
                </div>
            </Modal>
        </div>
    );
};

export default PatientPayments;
