import React, { useState, useEffect } from 'react';
import {
    Activity,
    Download,
    Calendar,
    User,
    Loader2,
    FileText,
    AlertCircle,
    CheckCircle,
    FlaskConical,
    ChevronRight,
    Search
} from 'lucide-react';
import { Card, Badge, Button, Input } from '../../components/UI';
import { useAuth } from '../../hooks/useAuth';
import { getPatientLabReports } from '../../services/patientService';

const LabReports = () => {
    const { user } = useAuth();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (user?.patientId) {
            fetchReports();
        }
    }, [user]);

    const fetchReports = async () => {
        try {
            const res = await getPatientLabReports(user.patientId);
            if (res.data.success) {
                setReports(res.data.data);
            }
        } catch (err) {
            console.error('Error fetching lab reports:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredReports = reports.filter(r =>
        r.testName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
                <Loader2 size={40} className="animate-spin text-blue-600" />
                <p className="text-slate-500 font-medium">Fetching your clinical lab reports...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Diagnostic Reports</h1>
                    <p className="text-slate-500 font-medium mt-1">Access your laboratory test results and analysis</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-2xl border border-purple-100/50 text-purple-700">
                    <FlaskConical size={18} />
                    <span className="text-xs font-black uppercase tracking-wider">Clinical Lab Data</span>
                </div>
            </div>

            <div className="relative max-w-md">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                    placeholder="Search tests (e.g. Blood, X-Ray)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-12 pl-12 rounded-2xl bg-white border-slate-200"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReports.length > 0 ? (
                    filteredReports.map(report => (
                        <Card key={report._id} className="hover:shadow-2xl hover:shadow-purple-900/5 transition-all group overflow-hidden border-slate-100 p-0">
                            <div className={`p-6 border-b border-slate-50 transition-colors ${report.status === 'Completed' ? 'bg-emerald-50/30' : 'bg-amber-50/30'}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${report.status === 'Completed' ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'}`}>
                                        <FlaskConical size={24} />
                                    </div>
                                    <Badge variant={report.status === 'Completed' ? 'success' : 'warning'}>
                                        {report.status}
                                    </Badge>
                                </div>
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-tight">
                                    {report.testName}
                                </h3>
                                <div className="flex items-center gap-2 mt-2 text-slate-500 font-bold text-xs uppercase tracking-tighter">
                                    <Calendar size={14} />
                                    {new Date(report.date).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                                        <User size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Referred By</p>
                                        <p className="text-sm font-bold text-slate-700">Dr. {report.doctor?.user?.name || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-50">
                                    {report.status === 'Completed' ? (
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-2 text-xs text-slate-500 font-medium">
                                                <CheckCircle size={14} className="text-emerald-500 mt-0.5" />
                                                <span>Final results are ready for download.</span>
                                            </div>
                                            <Button variant="primary" className="w-full rounded-xl py-3 h-12">
                                                <Download size={18} className="mr-2" />
                                                Download Report
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-2 text-xs text-slate-500 font-medium">
                                                <Activity size={14} className="text-amber-500 mt-0.5 animate-pulse" />
                                                <span>Report is currently being processed by the lab.</span>
                                            </div>
                                            <Button variant="outline" className="w-full rounded-xl py-3 h-12 border-slate-200 text-slate-400" disabled>
                                                Processing...
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border border-slate-100 border-dashed">
                        <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FlaskConical size={40} className="text-slate-200" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">No lab reports found</h3>
                        <p className="text-slate-500 max-w-xs mx-auto mt-2 font-medium">
                            Once your medical tests are completed, the results will be uploaded here by our laboratory team.
                        </p>
                    </div>
                )}
            </div>

            {/* Disclaimer */}
            <div className="bg-amber-50 border border-amber-100 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-amber-200">
                    <AlertCircle size={24} />
                </div>
                <div>
                    <h4 className="font-black text-amber-800 uppercase text-sm tracking-tight italic">Medical Disclaimer</h4>
                    <p className="text-amber-700 text-xs font-medium leading-relaxed mt-1">
                        These reports are for informational purposes. Please consult with your physician to correctly interpret the results and determine the appropriate medical course of action. Do not self-diagnose.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LabReports;
