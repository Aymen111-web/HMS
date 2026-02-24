import React, { useState } from 'react';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    UserPlus,
    Download,
    Mail,
    Phone
} from 'lucide-react';
import { Card, Button, Input, Badge } from '../components/UI';

const Patients = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const patients = [
        { id: '1024', name: 'Sarah Johnson', age: 28, gender: 'Female', phone: '+1 234-567-8901', lastVisit: '2024-03-15', status: 'Stable' },
        { id: '1025', name: 'Robert Smith', age: 45, gender: 'Male', phone: '+1 234-567-8902', lastVisit: '2024-03-14', status: 'Critical' },
        { id: '1026', name: 'Maria Garcia', age: 32, gender: 'Female', phone: '+1 234-567-8903', lastVisit: '2024-02-28', status: 'Stable' },
        { id: '1027', name: 'David Brown', age: 56, gender: 'Male', phone: '+1 234-567-8904', lastVisit: '2024-03-10', status: 'Stable' },
        { id: '1028', name: 'Emily Wilson', age: 19, gender: 'Female', phone: '+1 234-567-8905', lastVisit: '2024-03-12', status: 'Recovering' },
        { id: '1029', name: 'James Moore', age: 67, gender: 'Male', phone: '+1 234-567-8906', lastVisit: '2024-03-05', status: 'Stable' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Patients Management</h1>
                    <p className="text-slate-500">Manage and view all hospital patient records.</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Button variant="secondary" className="flex-1 sm:flex-none">
                        <Download size={18} className="mr-2" />
                        Export
                    </Button>
                    <Button variant="primary" className="flex-1 sm:flex-none">
                        <UserPlus size={18} className="mr-2" />
                        Add Patient
                    </Button>
                </div>
            </div>

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

                <div className="overflow-x-auto rounded-lg border border-slate-100">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Patient Details</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Demographics</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Last Visit</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {patients.map((patient) => (
                                <tr key={patient.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm">
                                                {patient.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-800">{patient.name}</p>
                                                <p className="text-xs text-slate-500 tracking-wider font-mono uppercase">ID: {patient.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        <span className="block">{patient.gender}</span>
                                        <span className="text-xs text-slate-400">{patient.age} Years Old</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                                <Phone size={12} className="text-slate-400" />
                                                {patient.phone}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                                <Mail size={12} className="text-slate-400" />
                                                {patient.name.toLowerCase().replace(' ', '.')}@email.com
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                                        {patient.lastVisit}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant={
                                            patient.status === 'Critical' ? 'danger' :
                                                patient.status === 'Recovering' ? 'warning' : 'success'
                                        }>
                                            {patient.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                                            <MoreVertical size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row justify-between items-center bg-slate-50 p-4 rounded-xl gap-4">
                    <p className="text-sm text-slate-500 font-medium">Showing 6 of 124 patients</p>
                    <div className="flex gap-2">
                        <Button variant="secondary" size="sm" disabled>Previous</Button>
                        <div className="flex items-center gap-1 px-4 text-sm font-semibold text-slate-700">
                            <span className="text-blue-600">1</span>
                            <span className="mx-1">/</span>
                            <span>21</span>
                        </div>
                        <Button variant="secondary" size="sm">Next</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Patients;
