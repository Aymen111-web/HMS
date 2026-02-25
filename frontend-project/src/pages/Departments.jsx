import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Edit3,
    Trash2,
    Building2,
    Users,
    UserCircle,
    Loader2,
    AlertCircle,
    ChevronRight,
    Building
} from 'lucide-react';
import { Card, Button, Input, Modal, Badge } from '../components/UI';
import { getDepartments, createDepartment, updateDepartment, deleteDepartment, seedDepartments } from '../services/departmentService';
import { getDoctors } from '../services/doctorService';

const Departments = () => {
    const [departments, setDepartments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDept, setEditingDept] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        head: '',
        status: 'Active'
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [deptRes, drRes] = await Promise.all([
                getDepartments(),
                getDoctors()
            ]);
            if (drRes.data.success) setDoctors(drRes.data.data);
            if (deptRes.data.success) {
                if (deptRes.data.data.length === 0) {
                    // Auto-seed standard departments on first visit
                    await seedDepartments();
                    const refetch = await getDepartments();
                    if (refetch.data.success) setDepartments(refetch.data.data);
                } else {
                    setDepartments(deptRes.data.data);
                }
            }
        } catch (err) {
            setError('Failed to fetch department data.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (editingDept) {
                await updateDepartment(editingDept._id, formData);
            } else {
                await createDepartment(formData);
            }
            setIsModalOpen(false);
            setEditingDept(null);
            setFormData({ name: '', description: '', head: '', status: 'Active' });
            fetchData();
        } catch (err) {
            setError('Failed to save department.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this department? All associated data will be affected.')) return;
        try {
            await deleteDepartment(id);
            fetchData();
        } catch (err) {
            setError('Failed to delete department.');
        }
    };

    const filteredDepts = departments.filter(d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Clinical Departments</h1>
                    <p className="text-slate-500 font-medium">Manage hospital specialized divisions and leadership</p>
                </div>
                <Button variant="primary" className="rounded-2xl h-12 px-6 shadow-xl shadow-blue-100" onClick={() => {
                    setEditingDept(null);
                    setFormData({ name: '', description: '', head: '', status: 'Active' });
                    setIsModalOpen(true);
                }}>
                    <Plus size={20} className="mr-2" />
                    Create Department
                </Button>
            </div>

            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-6 items-center">
                <div className="relative flex-1 w-full">
                    <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input
                        placeholder="Search departments..."
                        className="pl-14 h-14 rounded-2xl bg-slate-50 border-none transition-all text-base"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-sm font-bold">
                    <AlertCircle size={20} /> {error}
                </div>
            )}

            {loading && !departments.length ? (
                <div className="py-32 flex flex-col items-center justify-center gap-4 text-slate-400">
                    <Loader2 size={48} className="animate-spin text-blue-600" />
                    <p className="font-bold text-lg">Loading departments...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filteredDepts.map((dept) => (
                        <Card key={dept._id} className="group hover:border-blue-200 transition-all p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 h-32 w-32 bg-blue-50 rounded-full -mr-16 -mt-16 group-hover:bg-blue-600 transition-colors duration-500 opacity-20 group-hover:opacity-10"></div>

                            <div className="relative flex flex-col h-full">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="h-14 w-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                                        <Building2 size={28} />
                                    </div>
                                    <Badge variant={dept.status === 'Active' ? 'success' : 'warning'}>{dept.status}</Badge>
                                </div>

                                <h3 className="text-xl font-black text-slate-900 mb-2 truncate">{dept.name}</h3>
                                <p className="text-sm text-slate-500 font-medium mb-6 line-clamp-2 h-10">{dept.description || 'Specialized medical division providing expert clinical care.'}</p>

                                <div className="space-y-4 py-6 border-y border-slate-50 mb-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                                            <UserCircle size={14} /> Head of Dept
                                        </div>
                                        <span className="text-sm font-bold text-slate-700">{dept.head?.user?.name || 'Unassigned'}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                                            <Users size={14} /> Total Doctors
                                        </div>
                                        <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">{dept.doctorCount || 0}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-auto">
                                    <Button
                                        variant="secondary"
                                        className="h-12 flex-1 rounded-xl bg-slate-50 border-none hover:bg-blue-50 hover:text-blue-600 font-bold"
                                        onClick={() => {
                                            setEditingDept(dept);
                                            setFormData({
                                                name: dept.name,
                                                description: dept.description,
                                                head: dept.head?._id || '',
                                                status: dept.status
                                            });
                                            setIsModalOpen(true);
                                        }}
                                    >
                                        <Edit3 size={16} className="mr-2" /> Edit
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="h-12 w-12 rounded-xl text-slate-300 hover:text-rose-600 hover:bg-rose-50"
                                        onClick={() => handleDelete(dept._id)}
                                    >
                                        <Trash2 size={18} />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                    {filteredDepts.length === 0 && (
                        <div className="col-span-full py-20 bg-white rounded-[3rem] border border-slate-100 flex flex-col items-center justify-center text-slate-400">
                            <Building size={64} className="opacity-10 mb-4" />
                            <p className="font-bold text-xl">No clinics matched your search</p>
                        </div>
                    )}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingDept ? "Update Department" : "New Clinic Creation"}
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Department Name"
                        placeholder="e.g. Cardiology"
                        required
                        className="h-14 rounded-2xl"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700 ml-1">Description</label>
                        <textarea
                            className="w-full h-32 bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-100 outline-none resize-none"
                            placeholder="Describe the department's specialties..."
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 ml-1">Department Head</label>
                            <select
                                className="w-full h-14 bg-slate-50 border-none rounded-2xl px-4 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-100 outline-none"
                                value={formData.head}
                                onChange={e => setFormData({ ...formData, head: e.target.value })}
                            >
                                <option value="">Select Doctor</option>
                                {doctors.map(dr => (
                                    <option key={dr._id} value={dr._id}>Dr. {dr.user?.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 ml-1">Status</label>
                            <select
                                className="w-full h-14 bg-slate-50 border-none rounded-2xl px-4 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-100 outline-none"
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <Button variant="secondary" type="button" className="flex-1 h-14 rounded-2xl font-bold" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button variant="primary" type="submit" className="flex-1 h-14 rounded-2xl font-bold" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin mx-auto" /> : editingDept ? 'Save Changes' : 'Initialize Dept'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Departments;
