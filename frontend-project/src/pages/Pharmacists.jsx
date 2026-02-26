import React, { useState, useEffect } from 'react';
import {
    Users,
    Plus,
    Search,
    Mail,
    Phone,
    ShieldCheck,
    Trash2,
    AlertCircle,
    BadgeCheck,
    Calendar
} from 'lucide-react';
import { Button, Modal, Badge, Input } from '../components/UI';
import api from '../services/api';

const Pharmacists = () => {
    const [pharmacists, setPharmacists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedPharmacist, setSelectedPharmacist] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        licenseNumber: '',
        phone: ''
    });

    useEffect(() => {
        fetchPharmacists();
    }, []);

    const fetchPharmacists = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/pharmacists');
            if (res.data.success) {
                setPharmacists(res.data.data);
            }
        } catch (err) {
            console.error('Error fetching pharmacists:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddPharmacist = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/admin/pharmacists', formData);
            if (res.data.success) {
                setIsAddModalOpen(false);
                setFormData({ name: '', email: '', password: '', licenseNumber: '', phone: '' });
                fetchPharmacists();
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Error creating pharmacist');
        }
    };

    const handleDeletePharmacist = async () => {
        try {
            await api.delete(`/admin/pharmacists/${selectedPharmacist._id}`);
            setIsDeleteModalOpen(false);
            fetchPharmacists();
        } catch (err) {
            console.error('Error deleting pharmacist:', err);
        }
    };

    const filteredPharmacists = pharmacists.filter(p =>
        p.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.licenseNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="flex items-center justify-center h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Pharmacist Management</h1>
                    <p className="text-slate-500 font-medium mt-1">Add and manage pharmacist accounts</p>
                </div>
                <Button variant="primary" className="rounded-2xl h-12 shadow-lg shadow-blue-100" onClick={() => setIsAddModalOpen(true)}>
                    <Plus size={20} className="mr-2" />
                    Add Pharmacist
                </Button>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name or license number..."
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-100 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPharmacists.map((pharma) => (
                    <div key={pharma._id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all group relative">
                        <div className="flex justify-between items-start mb-6">
                            <div className="h-16 w-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <ShieldCheck size={32} />
                            </div>
                            <button
                                className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                onClick={() => {
                                    setSelectedPharmacist(pharma);
                                    setIsDeleteModalOpen(true);
                                }}
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 mb-1">{pharma.user?.name}</h3>
                        <div className="flex items-center gap-2 mb-6">
                            <Badge variant="info" className="flex items-center gap-1">
                                <BadgeCheck size={10} /> LIC: {pharma.licenseNumber}
                            </Badge>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                                <Mail size={16} className="text-slate-400" />
                                {pharma.user?.email}
                            </div>
                            <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                                <Phone size={16} className="text-slate-400" />
                                {pharma.phone || 'No phone provided'}
                            </div>
                            <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                                <Calendar size={16} className="text-slate-400" />
                                Joined: {new Date(pharma.user?.createdAt).toLocaleDateString()}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-50">
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Account Status</span>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                                <span className="text-sm font-bold text-slate-600">Active</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Modal */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Pharmacist">
                <form onSubmit={handleAddPharmacist} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                            <Input
                                placeholder="e.g. John Doe"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">License Number</label>
                            <Input
                                placeholder="e.g. PH-123456"
                                required
                                value={formData.licenseNumber}
                                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                        <Input
                            type="email"
                            placeholder="pharmacist@hospital.com"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Password</label>
                        <Input
                            type="password"
                            placeholder="••••••••"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Phone Number</label>
                        <Input
                            placeholder="+1 (555) 000-0000"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="outline" className="flex-1 rounded-xl" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                        <Button type="submit" variant="primary" className="flex-1 rounded-xl">Create Account</Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Modal */}
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Pharmacist">
                <div className="space-y-4 text-center">
                    <div className="h-20 w-20 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                        <Trash2 size={40} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Are you sure?</h3>
                        <p className="text-slate-500 mt-2">This will permanently delete the account for <span className="font-bold text-slate-900">{selectedPharmacist?.user?.name}</span>. This action cannot be undone.</p>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setIsDeleteModalOpen(false)}>Go Back</Button>
                        <Button variant="danger" className="flex-1 rounded-xl" onClick={handleDeletePharmacist}>Yes, Delete Account</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Pharmacists;
