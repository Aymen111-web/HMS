import React, { useState, useEffect } from 'react';
import { Trash2, Edit3, Eye, UserX, UserCheck, ShieldAlert, History } from 'lucide-react';
import { Card, Button, Input, Badge, Modal } from '../components/UI';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import { getPatients, createPatient, deletePatient } from '../services/patientService';
import { toggleUserStatus } from '../services/adminService';

const Patients = () => {
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('');
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewingPatient, setViewingPatient] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [newPatient, setNewPatient] = useState({
        name: '',
        email: '',
        age: '',
        bloodGroup: '',
        password: 'password123'
    });

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            setLoading(true);
            const response = await getPatients();
            if (response.data.success) {
                setPatients(response.data.data);
            }
        } catch (err) {
            setError('Could not load patients list. Please ensure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddPatient = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await api.post('/auth/register', {
                name: newPatient.name,
                email: newPatient.email,
                password: newPatient.password,
                role: 'Patient',
                age: newPatient.age,
                bloodGroup: newPatient.bloodGroup
            });

            if (response.data.success) {
                setIsModalOpen(false);
                fetchPatients();
                setNewPatient({ name: '', email: '', age: '', bloodGroup: '', password: 'password123' });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register patient.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePatient = async (id) => {
        if (!window.confirm('Are you sure you want to delete this patient record? This action cannot be undone.')) return;
        try {
            await deletePatient(id);
            fetchPatients();
        } catch (err) {
            setError('Failed to delete patient.');
        }
    };

    const handleToggleStatus = async (patient) => {
        try {
            const newStatus = patient.status === 'Blocked' ? 'Active' : 'Blocked';
            await toggleUserStatus(patient.user._id, 'Patient', newStatus);
            fetchPatients();
        } catch (err) {
            setError('Failed to update patient status.');
        }
    };

    const filteredPatients = patients.filter(p =>
        p.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p._id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Patient Registry</h1>
                    <p className="text-slate-500 font-medium">Global database of all hospital patients and medical identities</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <Button variant="secondary" className="rounded-2xl h-12 bg-white" onClick={fetchPatients}>
                        <Download size={20} className="mr-2" />
                        Export Data
                    </Button>
                    <Button variant="primary" className="rounded-2xl h-12 px-6 shadow-xl shadow-blue-100" onClick={() => setIsModalOpen(true)}>
                        <Plus size={20} className="mr-2" />
                        Add New Patient
                    </Button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-6 items-center">
                <div className="relative flex-1 w-full">
                    <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input
                        placeholder="Search by name, ID or clinical status..."
                        className="pl-14 h-14 rounded-2xl bg-slate-50 border-none transition-all text-base"
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
                    <ShieldAlert size={20} /> {error}
                </div>
            )}

            {loading && !patients.length ? (
                <div className="py-32 flex flex-col items-center justify-center gap-4 text-slate-400">
                    <Loader2 size={48} className="animate-spin text-blue-600" />
                    <p className="font-bold text-lg">Loading Patient Database...</p>
                </div>
            ) : (
                <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Patient Details</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contact / Email</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Vitals Summary</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Security Status</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredPatients.map((patient) => (
                                    <tr key={patient._id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-black group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                    {(patient.user?.name || 'P').charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-800">{patient.user?.name || 'Unknown'}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 tracking-tighter uppercase transition-colors">#{patient._id.substring(0, 12)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-0.5">
                                                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                                                    <Phone size={12} className="text-slate-300" /> {patient.phone || '+1 234 567 890'}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                                                    <Mail size={12} className="text-slate-300" /> {patient.user?.email}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-slate-300 uppercase leading-none mb-1">Blood</span>
                                                    <span className="text-sm font-black text-rose-600 underline decoration-rose-200 underline-offset-4">{patient.bloodGroup || 'O+'}</span>
                                                </div>
                                                <div className="h-6 w-[1px] bg-slate-100"></div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-slate-300 uppercase leading-none mb-1">Age</span>
                                                    <span className="text-sm font-black text-slate-700">{patient.age || '25'} Y</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <Badge variant={patient.status === 'Blocked' ? 'warning' : 'success'} className="px-4 py-1.5 rounded-xl font-black uppercase text-[10px] tracking-widest">
                                                {patient.status || 'Active'}
                                            </Badge>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    className="p-3 text-slate-300 hover:text-blue-600 hover:bg-white hover:shadow-md rounded-2xl transition-all"
                                                    onClick={() => {
                                                        setViewingPatient(patient);
                                                        setIsViewModalOpen(true);
                                                    }}
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    className={`p-3 rounded-2xl transition-all ${patient.status === 'Blocked' ? 'text-amber-500 hover:bg-amber-50' : 'text-slate-300 hover:text-rose-600 hover:bg-white hover:shadow-md'}`}
                                                    onClick={() => handleToggleStatus(patient)}
                                                    title={patient.status === 'Blocked' ? 'Unblock Patient' : 'Block Patient'}
                                                >
                                                    {patient.status === 'Blocked' ? <UserCheck size={18} /> : <UserX size={18} />}
                                                </button>
                                                <button
                                                    className="p-3 text-slate-300 hover:text-rose-600 hover:bg-white hover:shadow-md rounded-2xl transition-all"
                                                    onClick={() => handleDeletePatient(patient._id)}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Registration Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register New Patient">
                <form onSubmit={handleAddPatient} className="space-y-6">
                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-3">
                        <div className="h-10 w-10 bg-blue-600 text-white rounded-xl flex items-center justify-center">
                            <UserPlus size={20} />
                        </div>
                        <p className="text-sm font-bold text-blue-800">Assigning a new medical identity to the hospital system.</p>
                    </div>

                    <div className="space-y-4">
                        <Input label="Full Name" placeholder="Jane Doe" required className="h-14 rounded-2xl" value={newPatient.name} onChange={e => setNewPatient({ ...newPatient, name: e.target.value })} />
                        <Input label="Email Address" type="email" placeholder="jane@example.com" required className="h-14 rounded-2xl" value={newPatient.email} onChange={e => setNewPatient({ ...newPatient, email: e.target.value })} />
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Age" type="number" required className="h-14 rounded-2xl" value={newPatient.age} onChange={e => setNewPatient({ ...newPatient, age: e.target.value })} />
                            <Input label="Blood Group" placeholder="O+" required className="h-14 rounded-2xl" value={newPatient.bloodGroup} onChange={e => setNewPatient({ ...newPatient, bloodGroup: e.target.value })} />
                        </div>
                        <Input label="Temporary Access Pass" type="password" className="h-14 rounded-2xl" value={newPatient.password} onChange={e => setNewPatient({ ...newPatient, password: e.target.value })} />
                    </div>

                    <div className="pt-4 flex gap-4">
                        <Button variant="secondary" type="button" className="flex-1 h-14 rounded-2xl font-bold" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button variant="primary" type="submit" className="flex-1 h-14 rounded-2xl font-bold shadow-xl shadow-blue-100" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Confirm Registration'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Details Modal */}
            <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Clinical Identity Profile">
                {viewingPatient && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                            <div className="h-20 w-20 rounded-3xl bg-blue-600 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-blue-100">
                                {viewingPatient.user?.name?.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{viewingPatient.user?.name}</h3>
                                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">Reg Date: {new Date(viewingPatient.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="p-4 bg-white border border-slate-100 rounded-2xl text-center">
                                <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase mb-1">Age</p>
                                <p className="text-lg font-black text-slate-800">{viewingPatient.age}Y</p>
                            </div>
                            <div className="p-4 bg-white border border-slate-100 rounded-2xl text-center">
                                <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase mb-1">Blood</p>
                                <p className="text-lg font-black text-rose-600">{viewingPatient.bloodGroup}</p>
                            </div>
                            <div className="p-4 bg-white border border-slate-100 rounded-2xl text-center">
                                <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase mb-1">Status</p>
                                <p className={`text-xs font-black uppercase ${viewingPatient.status === 'Blocked' ? 'text-rose-600' : 'text-emerald-600'}`}>{viewingPatient.status || 'Active'}</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="p-5 bg-white border border-slate-100 rounded-2xl flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400"><Mail size={18} /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Email Address</p>
                                        <p className="font-bold text-slate-700">{viewingPatient.user?.email}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-xl"><History size={16} /></Button>
                            </div>
                            <div className="p-5 bg-white border border-slate-100 rounded-2xl flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400"><Phone size={18} /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Contact Phone</p>
                                        <p className="font-bold text-slate-700">{viewingPatient.phone || '+1 000 000 0000'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex gap-4">
                            <Button variant="secondary" className="flex-1 h-14 rounded-2xl font-bold" onClick={() => setIsViewModalOpen(false)}>Dismiss</Button>
                            <Button variant="primary" className="flex-1 h-14 rounded-2xl font-bold shadow-xl shadow-blue-100" onClick={() => alert('Editing patient records is enabled in full staff portal.')}>Modify File</Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Patients;
