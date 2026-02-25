import React, { useState, useEffect } from 'react';
import {
    FileText,
    Calendar,
    User,
    Activity,
    Clock,
    Loader2,
    Shield,
    ChevronRight,
    Search
} from 'lucide-react';
import { Card, Badge, Input } from '../../components/UI';
import { useAuth } from '../../hooks/useAuth';
import { getPatientMedicalRecords } from '../../services/patientService';

const MedicalRecords = () => {
    const { user } = useAuth();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (user?.patientId) {
            fetchRecords();
        }
    }, [user]);

    const fetchRecords = async () => {
        try {
            const res = await getPatientMedicalRecords(user.patientId);
            if (res.data.success) {
                setRecords(res.data.data);
            }
        } catch (err) {
            console.error('Error fetching medical records:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredRecords = records.filter(r =>
        r.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.doctor?.user?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
                <Loader2 size={40} className="animate-spin text-blue-600" />
                <p className="text-slate-500 font-medium">Retrieving your medical history...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Medical History</h1>
                    <p className="text-slate-500 font-medium mt-1">Official records of your past consultations and diagnoses</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-2xl border border-blue-100/50">
                    <Shield size={18} className="text-blue-600" />
                    <span className="text-xs font-black text-blue-700 uppercase tracking-wider">Read-Only Access</span>
                </div>
            </div>

            <div className="relative max-w-md">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                    placeholder="Search diagnoses or doctors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-12 pl-12 rounded-2xl bg-white border-slate-200"
                />
            </div>

            <div className="space-y-6">
                {filteredRecords.length > 0 ? (
                    filteredRecords.map((record, idx) => (
                        <div key={record._id} className="group relative">
                            {/* Vertical line connector */}
                            {idx !== filteredRecords.length - 1 && (
                                <div className="absolute left-[39px] md:left-[47px] top-20 bottom-[-24px] w-0.5 bg-slate-100 hidden md:block"></div>
                            )}

                            <div className="flex gap-6 md:gap-10">
                                {/* Timeline Bullet */}
                                <div className="hidden md:flex flex-col items-center shrink-0">
                                    <div className="h-24 w-24 rounded-3xl bg-white border border-slate-100 shadow-sm flex flex-col items-center justify-center text-slate-900 group-hover:border-blue-200 transition-colors">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                                            {new Date(record.date).toLocaleString('default', { month: 'short' })}
                                        </span>
                                        <span className="text-2xl font-black">{new Date(record.date).getDate()}</span>
                                        <span className="text-xs font-bold text-slate-500 mt-1">{new Date(record.date).getFullYear()}</span>
                                    </div>
                                </div>

                                {/* Content Card */}
                                <Card className="flex-1 hover:shadow-xl hover:shadow-blue-900/5 transition-all md:p-8">
                                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3 md:hidden mb-2">
                                                <Badge variant="info">{new Date(record.date).toLocaleDateString()}</Badge>
                                            </div>
                                            <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                                                {record.diagnosis}
                                            </h3>
                                            <div className="flex items-center gap-2 text-blue-600 font-bold">
                                                <User size={16} />
                                                <span>Dr. {record.doctor?.user?.name}</span>
                                                <span className="text-slate-300 mx-1">•</span>
                                                <span className="text-sm">{record.doctor?.user?.specialization || 'Medical Specialist'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                <Activity size={14} className="text-blue-500" />
                                                Treatment & Procedure
                                            </h4>
                                            <p className="text-slate-700 font-medium leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
                                                {record.treatment || 'No treatment details recorded.'}
                                            </p>
                                        </div>
                                        <div className="space-y-4">
                                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                <FileText size={14} className="text-blue-500" />
                                                Consultation Notes
                                            </h4>
                                            <p className="text-slate-700 font-medium leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
                                                {record.notes || 'No additional notes provided.'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                                        <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={14} />
                                                Visit Time: {record.appointment?.time || 'N/A'}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Activity size={14} />
                                                Case: {record.appointment?.isUrgent ? 'Urgent' : 'Routine'}
                                            </div>
                                        </div>
                                        <button className="text-blue-600 font-black text-sm flex items-center gap-1 hover:underline">
                                            Full Report <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-24 text-center bg-white rounded-[3rem] border border-slate-100 border-dashed">
                        <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FileText size={40} className="text-slate-200" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">No medical records found</h3>
                        <p className="text-slate-500 max-w-xs mx-auto mt-2 font-medium">
                            Your medical history will appear here once you have completed consultations with our doctors.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MedicalRecords;
