import React, { useState, useEffect } from 'react';
import { Trash2, Edit3, MoreVertical, ToggleLeft, ToggleRight, Building2, UserCircle2 } from 'lucide-react';
import { Card, Button, Input, Badge, Modal } from '../components/UI';
import api from '../services/api';
import { getDoctors, createDoctor, deleteDoctor, updateDoctor } from '../services/doctorService';
import { getDepartments } from '../services/departmentService';
import { toggleUserStatus } from '../services/adminService';
import { useNavigate } from 'react-router-dom';

const Doctors = () => {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('table'); // 'grid' or 'table'
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDoctor, setEditingDoctor] = useState(null);
    const [newDoctor, setNewDoctor] = useState({
        name: '',
        email: '',
        password: 'password123',
        specialization: '',
        department: '',
        fee: 50
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [drRes, deptRes] = await Promise.all([
                getDoctors(),
                getDepartments()
            ]);
            if (drRes.data.success) setDoctors(drRes.data.data);
            if (deptRes.data.success) setDepartments(deptRes.data.data);
        } catch (err) {
            setError('Failed to fetch system data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddDoctor = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const endpoint = editingDoctor ? `/doctors/${editingDoctor._id}` : '/auth/register';
            const method = editingDoctor ? 'put' : 'post';

            const payload = editingDoctor ? {
                specialization: newDoctor.specialization,
                department: newDoctor.department,
                fee: newDoctor.fee,
                name: newDoctor.name // If doctorController handles name update
            } : {
                name: newDoctor.name,
                email: newDoctor.email,
                password: newDoctor.password,
                role: 'Doctor',
                specialization: newDoctor.specialization,
                department: newDoctor.department,
                fee: newDoctor.fee
            };

            const response = await api[method](endpoint, payload);

            if (response.data.success) {
                setIsModalOpen(false);
                setEditingDoctor(null);
                fetchData();
                setNewDoctor({ name: '', email: '', password: 'password123', specialization: '', department: '', fee: 50 });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save doctor.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteDoctor = async (id) => {
        if (!window.confirm('Are you sure you want to remove this doctor from the system?')) return;
        try {
            await deleteDoctor(id);
            fetchData();
        } catch (err) {
            setError('Failed to delete doctor.');
        }
    };

    const handleToggleStatus = async (dr) => {
        try {
            const newStatus = dr.status === 'Active' ? 'Inactive' : 'Active';
            await toggleUserStatus(dr.user._id, 'Doctor', newStatus);
            fetchData();
        } catch (err) {
            setError('Failed to update status.');
        }
    };

    const filteredDoctors = doctors.filter(dr =>
        dr.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dr.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dr.department?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Staff Management</h1>
                    <p className="text-slate-500 font-medium">Control medical professionals and clinical assignments</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <Button variant="secondary" className="rounded-2xl h-12 bg-white" onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}>
                        {viewMode === 'table' ? 'Grid View' : 'Table View'}
                    </Button>
                    <Button variant="primary" className="rounded-2xl h-12 px-6 shadow-xl shadow-blue-100" onClick={() => {
                        setEditingDoctor(null);
                        setNewDoctor({ name: '', email: '', password: 'password123', specialization: '', department: '', fee: 50 });
                        setIsModalOpen(true);
                    }}>
                        <Plus size={20} className="mr-2" />
                        Add New Doctor
                    </Button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-6 items-center">
                <div className="relative flex-1 w-full">
                    <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input
                        placeholder="Search by name, specilization, department..."
                        className="pl-14 h-14 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-100 transition-all text-base"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-3 w-full lg:w-auto">
                    <Button variant="secondary" className="flex-1 h-14 rounded-2xl bg-slate-50 border-none hover:bg-slate-100 text-slate-600 font-bold px-8">
                        <Filter size={20} className="mr-2" /> Filters
                    </Button>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-sm font-bold shadow-sm">
                    <AlertCircle size={20} /> {error}
                </div>
            )}

            {loading && !doctors.length ? (
                <div className="py-32 flex flex-col items-center justify-center gap-4 text-slate-400">
                    <Loader2 size={48} className="animate-spin text-blue-600" />
                    <p className="font-bold text-lg">Syncing Staff Database...</p>
                </div>
            ) : viewMode === 'table' ? (
                <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Doctor Profile</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Specialization</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Department</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Operations</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredDoctors.map((dr) => (
                                    <tr key={dr._id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 font-black group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                    {dr.user?.name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-800 text-base">Dr. {dr.user?.name}</p>
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{dr.user?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <Badge variant="info" className="font-bold rounded-xl px-4 py-1.5">{dr.specialization}</Badge>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-slate-600 font-bold">
                                                <Building2 size={16} className="text-slate-300" />
                                                {dr.department?.name || 'Unassigned'}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <button
                                                onClick={() => handleToggleStatus(dr)}
                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold text-xs border transition-all ${dr.status === 'Active'
                                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                    : 'bg-slate-50 text-slate-400 border-slate-100'
                                                    }`}
                                            >
                                                {dr.status === 'Active' ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                                                {dr.status}
                                            </button>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    className="p-3 text-slate-300 hover:text-blue-600 hover:bg-white hover:shadow-md rounded-2xl transition-all"
                                                    onClick={() => {
                                                        setEditingDoctor(dr);
                                                        setNewDoctor({
                                                            name: dr.user?.name,
                                                            email: dr.user?.email,
                                                            specialization: dr.specialization,
                                                            department: dr.department?._id || '',
                                                            fee: dr.fee
                                                        });
                                                        setIsModalOpen(true);
                                                    }}
                                                >
                                                    <Edit3 size={18} />
                                                </button>
                                                <button
                                                    className="p-3 text-slate-300 hover:text-rose-600 hover:bg-white hover:shadow-md rounded-2xl transition-all"
                                                    onClick={() => handleDeleteDoctor(dr._id)}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredDoctors.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="py-20 text-center">
                                            <div className="flex flex-col items-center gap-4 text-slate-300">
                                                <UserCircle2 size={64} className="opacity-20" />
                                                <p className="font-bold text-lg">No medical professionals found</p>
                                                <Button variant="ghost" size="sm" onClick={() => setSearchTerm('')}>Clear Search</Button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {/* Grid cards can be implemented here if needed, but table is priority for Admin */}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingDoctor ? "Update Staff Profile" : "Onboard New Professional"}
            >
                <form onSubmit={handleAddDoctor} className="space-y-6">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                        <div className="h-10 w-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black">
                            {editingDoctor ? 'DR' : 'NEW'}
                        </div>
                        <p className="text-sm font-bold text-slate-700">
                            {editingDoctor ? 'Editing existing staff record' : 'Adding a new medical specialist'}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <Input
                            label="Full Legal Name"
                            placeholder="Dr. John Doe"
                            required
                            className="h-14 rounded-2xl"
                            value={newDoctor.name}
                            onChange={e => setNewDoctor({ ...newDoctor, name: e.target.value })}
                        />
                        {!editingDoctor && (
                            <Input
                                label="Professional Email"
                                type="email"
                                placeholder="john@hospital.com"
                                required
                                className="h-14 rounded-2xl"
                                value={newDoctor.email}
                                onChange={e => setNewDoctor({ ...newDoctor, email: e.target.value })}
                            />
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-slate-700 ml-1">Clinical Department</label>
                                <select
                                    className="w-full h-14 bg-slate-50 border-none rounded-2xl px-4 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-100 outline-none"
                                    required
                                    value={newDoctor.department}
                                    onChange={e => setNewDoctor({ ...newDoctor, department: e.target.value })}
                                >
                                    <option value="">Select Dept</option>
                                    {departments.map(dept => (
                                        <option key={dept._id} value={dept._id}>{dept.name}</option>
                                    ))}
                                </select>
                            </div>
                            <Input
                                label="Specialization"
                                placeholder="e.g. Cardiology"
                                required
                                className="h-14 rounded-2xl"
                                value={newDoctor.specialization}
                                onChange={e => setNewDoctor({ ...newDoctor, specialization: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Consultation Fee ($)"
                                type="number"
                                required
                                className="h-14 rounded-2xl"
                                value={newDoctor.fee}
                                onChange={e => setNewDoctor({ ...newDoctor, fee: e.target.value })}
                            />
                            {!editingDoctor && (
                                <Input
                                    label="Passcode"
                                    type="password"
                                    required
                                    className="h-14 rounded-2xl"
                                    value={newDoctor.password}
                                    onChange={e => setNewDoctor({ ...newDoctor, password: e.target.value })}
                                />
                            )}
                        </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <Button variant="secondary" type="button" className="flex-1 h-14 rounded-2xl font-bold" onClick={() => setIsModalOpen(false)}>Dismiss</Button>
                        <Button variant="primary" type="submit" className="flex-1 h-14 rounded-2xl font-bold shadow-xl shadow-blue-100" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin mx-auto" /> : editingDoctor ? 'Update Staff Member' : 'Complete Registration'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Doctors;
