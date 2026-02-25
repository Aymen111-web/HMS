import React, { useState, useEffect } from 'react';
import {
    Search,
    User,
    Calendar,
    FileText,
    Plus,
    Mail,
    Phone,
    MoreVertical,
    ChevronRight,
    Activity,
    Clock,
    Filter
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getDoctorAppointments } from '../../services/appointmentService';
import { Button } from '../../components/UI';
import { useNavigate } from 'react-router-dom';

const DoctorPatients = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedPatient, setSelectedPatient] = useState(null);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                if (!user?.doctorId) {
                    setLoading(false);
                    return;
                }
                const res = await getDoctorAppointments(user.doctorId);
                const aptList = res.data?.data || [];

                const uniquePatientsMap = new Map();
                aptList.forEach(apt => {
                    if (apt.patient && !uniquePatientsMap.has(apt.patient._id)) {
                        uniquePatientsMap.set(apt.patient._id, {
                            ...apt.patient,
                            lastVisit: apt.date,
                            visitCount: 1
                        });
                    } else if (apt.patient) {
                        const existing = uniquePatientsMap.get(apt.patient._id);
                        uniquePatientsMap.set(apt.patient._id, {
                            ...existing,
                            visitCount: existing.visitCount + 1,
                            lastVisit: new Date(apt.date) > new Date(existing.lastVisit) ? apt.date : existing.lastVisit
                        });
                    }
                });

                setPatients(Array.from(uniquePatientsMap.values()));
                setLoading(false);
            } catch (err) {
                console.error('Error fetching patients:', err);
                setLoading(false);
            }
        };

        fetchPatients();
    }, [user]);

    const filteredPatients = patients.filter(p =>
        p.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p._id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="flex items-center justify-center h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Patient Directory</h1>
                    <p className="text-slate-500 font-medium">Manage and view your patient history</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-2xl h-12">
                        <Filter size={18} className="mr-2" />
                        Filter
                    </Button>
                    <Button variant="primary" className="rounded-2xl h-12">
                        <Search size={18} className="mr-2" />
                        Search Globally
                    </Button>
                </div>
            </div>

            <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 mb-8">
                <div className="relative">
                    <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name or Pateint ID..."
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-base font-medium focus:ring-2 focus:ring-blue-100 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPatients.map((patient) => (
                    <div key={patient._id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-6">
                            <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 text-2xl font-bold">
                                {patient.user?.name?.charAt(0)}
                            </div>
                            <button
                                className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
                                onClick={() => { const opts = ['View Prescriptions', 'Book Appointment']; const choice = window.confirm('Go to prescriptions for ' + patient.user?.name + '?'); if (choice) navigate('/doctor/prescriptions', { state: { patientId: patient._id } }); }}
                            >
                                <MoreVertical size={20} />
                            </button>
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 mb-1">{patient.user?.name}</h3>
                        <p className="text-slate-400 font-medium text-sm mb-6 flex items-center gap-2">
                            ID: {patient._id?.substring(0, 8)}
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="p-3 bg-slate-50 rounded-2xl">
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Blood Group</p>
                                <p className="text-sm font-bold text-slate-700">{patient.bloodGroup || 'N/A'}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-2xl">
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Gender</p>
                                <p className="text-sm font-bold text-slate-700">{patient.gender || 'N/A'}</p>
                            </div>
                        </div>

                        <div className="space-y-3 mb-8">
                            <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                                <Mail size={16} className="text-slate-400" />
                                {patient.user?.email}
                            </div>
                            <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                                <Clock size={16} className="text-slate-400" />
                                Last Visit: {new Date(patient.lastVisit).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                                <Activity size={16} className="text-slate-400" />
                                {patient.visitCount} Total Appointments
                            </div>
                        </div>

                        <Button
                            variant="secondary"
                            className="w-full h-12 rounded-2xl text-blue-600 font-bold flex items-center justify-center gap-2 group-hover:bg-blue-600 group-hover:text-white transition-all"
                            onClick={() => navigate('/doctor/prescriptions', { state: { patientId: patient._id } })}
                        >
                            View Medical File <ChevronRight size={18} />
                        </Button>
                    </div>
                ))}

                {filteredPatients.length === 0 && (
                    <div className="col-span-full py-20 bg-slate-50 rounded-3xl text-center border-2 border-dashed border-slate-200">
                        <User className="mx-auto text-slate-300 mb-4" size={48} />
                        <h3 className="text-xl font-bold text-slate-900 mb-1">No patients found</h3>
                        <p className="text-slate-500">Could not find any patients matching your search criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorPatients;
