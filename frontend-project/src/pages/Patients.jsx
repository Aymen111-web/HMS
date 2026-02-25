import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    UserPlus,
    Download,
    Mail,
    Phone,
    Loader2,
    AlertCircle
} from 'lucide-react';
import { Card, Button, Input, Badge, Modal } from '../components/UI';
import { getPatients, createPatient } from '../services/patientService';

const Patients = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
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
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddPatient = async (e) => {
        e.preventDefault();
        try {
            const response = await createPatient(newPatient);
            if (response.data.success) {
                setIsModalOpen(false);
                fetchPatients();
                setNewPatient({ name: '', email: '', age: '', bloodGroup: '', password: 'password123' });
            }
        } catch (err) {
            setError('Failed to register patient.');
        }
    };

    const filteredPatients = patients.filter(p =>
        p.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.user?.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Patients Management</h1>
                    <p className="text-slate-500">Manage and view all hospital patient records.</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Button variant="secondary" className="flex-1 sm:flex-none" onClick={fetchPatients}>
                        <Download size={18} className="mr-2" />
                        Reload
                    </Button>
                    <Button variant="primary" className="flex-1 sm:flex-none" onClick={() => setIsModalOpen(true)}>
                        <UserPlus size={18} className="mr-2" />
                        Add Patient
                    </Button>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register New Patient">
                <form onSubmit={handleAddPatient} className="space-y-4">
                    <Input label="Full Name" placeholder="Jane Doe" required value={newPatient.name} onChange={e => setNewPatient({ ...newPatient, name: e.target.value })} />
                    <Input label="Email Address" type="email" placeholder="jane@example.com" required value={newPatient.email} onChange={e => setNewPatient({ ...newPatient, email: e.target.value })} />
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Age" type="number" required value={newPatient.age} onChange={e => setNewPatient({ ...newPatient, age: e.target.value })} />
                        <Input label="Blood Group" placeholder="O+" required value={newPatient.bloodGroup} onChange={e => setNewPatient({ ...newPatient, bloodGroup: e.target.value })} />
                    </div>
                    <div className="pt-4 flex gap-3">
                        <Button variant="secondary" type="button" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button variant="primary" type="submit" className="flex-1">Add Patient</Button>
                    </div>
                </form>
            </Modal>

            <Card>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <Input
                            placeholder="Search by name, ID or mobile..."
                            className="pl-10 h-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button variant="secondary" className="h-10">
                            <Filter size={18} className="mr-2" />
                            Filters
                        </Button>
                        <select className="px-4 h-10 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all">
                            <option>Sort by: Newest</option>
                            <option>Sort by: Name</option>
                            <option>Sort by: Status</option>
                        </select>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-medium">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-400">
                        <Loader2 size={40} className="animate-spin text-blue-600" />
                        <p className="font-medium animate-pulse">Loading patient data...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-lg border border-slate-100">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Patient Details</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Demographics</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Joined Date</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredPatients.length > 0 ? filteredPatients.map((patient) => (
                                    <tr key={patient._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm uppercase">
                                                    {(patient.user?.name || 'P').charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-800">{patient.user?.name || 'Unknown'}</p>
                                                    <p className="text-xs text-slate-500 tracking-wider font-mono uppercase">ID: {patient._id.substring(0, 8)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            <span className="block">{patient.bloodGroup || 'N/A'}</span>
                                            <span className="text-xs text-slate-400">{patient.age || 'N/A'} Years Old</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                                    <Phone size={12} className="text-slate-400" />
                                                    {patient.phone || 'N/A'}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                                    <Mail size={12} className="text-slate-400" />
                                                    {patient.user?.email || 'N/A'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                                            {new Date(patient.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={
                                                patient.medicalHistory?.length > 0 ? 'warning' : 'success'
                                            }>
                                                {patient.medicalHistory?.length > 0 ? 'In Treatment' : 'Stable'}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                                                <MoreVertical size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                            <p className="text-lg font-medium">No patients found</p>
                                            <p className="text-sm">Try adjusting your search or add a new patient.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="mt-6 flex flex-col sm:flex-row justify-between items-center bg-slate-50 p-4 rounded-xl gap-4">
                    <p className="text-sm text-slate-500 font-medium">
                        Showing {filteredPatients.length} of {patients.length} patients
                    </p>
                    <div className="flex gap-2">
                        <Button variant="secondary" size="sm" disabled>Previous</Button>
                        <div className="flex items-center gap-1 px-4 text-sm font-semibold text-slate-700">
                            <span className="text-blue-600">1</span>
                            <span className="mx-1">/</span>
                            <span>1</span>
                        </div>
                        <Button variant="secondary" size="sm" disabled>Next</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Patients;
