import React, { useState } from 'react';
import {
    Calendar,
    Clock,
    User,
    Stethoscope,
    ChevronLeft,
    ChevronRight,
    Filter,
    Plus
} from 'lucide-react';
import { Card, Button, Badge } from '../components/UI';

const Appointments = () => {
    const [activeTab, setActiveTab] = useState('upcoming');

    const appointments = [
        { id: 1, patient: 'Sarah Johnson', doctor: 'Dr. Michael Chen', date: '2024-03-20', time: '09:00 AM', type: 'Checkup', status: 'Scheduled' },
        { id: 2, patient: 'Robert Smith', doctor: 'Dr. Emily Blunt', date: '2024-03-20', time: '10:30 AM', type: 'Consultation', status: 'Pending' },
        { id: 3, patient: 'Maria Garcia', doctor: 'Dr. Sarah Wilson', date: '2024-03-21', time: '01:15 PM', type: 'Surgeory', status: 'Scheduled' },
        { id: 4, patient: 'David Brown', doctor: 'Dr. James Moore', date: '2024-03-22', time: '11:00 AM', type: 'Follow-up', status: 'Completed' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Appointments</h1>
                    <p className="text-slate-500">Scheduled visits and consultation sessions.</p>
                </div>
                <Button variant="primary">
                    <Plus size={18} className="mr-2" />
                    Schedule New
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <Card className="!p-4">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h3 className="font-bold text-slate-800 text-sm italic">March 2024</h3>
                            <div className="flex gap-1">
                                <button className="p-1 hover:bg-slate-100 rounded text-slate-400"><ChevronLeft size={16} /></button>
                                <button className="p-1 hover:bg-slate-100 rounded text-slate-400"><ChevronRight size={16} /></button>
                            </div>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center mb-2">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                                <span key={day} className="text-[10px] font-bold text-slate-400 uppercase">{day}</span>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                            {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                                <button
                                    key={day}
                                    className={`h-8 text-xs rounded-lg flex items-center justify-center transition-colors
                    ${day === 20 ? 'bg-blue-600 text-white font-bold' : 'hover:bg-slate-50 text-slate-600'}
                    ${[15, 22, 28].includes(day) ? 'relative' : ''}
                  `}
                                >
                                    {day}
                                    {[15, 22, 28].includes(day) && (
                                        <span className="absolute bottom-1 w-1 h-1 bg-blue-400 rounded-full"></span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </Card>

                    <Card title="Analytics" className="!p-4 bg-blue-600 text-white border-none shadow-blue-100">
                        <div className="space-y-4">
                            <div>
                                <p className="text-blue-100 text-xs font-medium uppercase tracking-wider">Today's Total</p>
                                <h4 className="text-2xl font-bold">18 Visits</h4>
                            </div>
                            <div className="flex items-end justify-between">
                                <div className="h-12 w-2 bg-blue-400 rounded-full"></div>
                                <div className="h-16 w-2 bg-blue-400 rounded-full"></div>
                                <div className="h-10 w-2 bg-white rounded-full"></div>
                                <div className="h-14 w-2 bg-blue-400 rounded-full"></div>
                                <div className="h-8 w-2 bg-blue-400 rounded-full"></div>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-3 space-y-4">
                    <div className="flex gap-4 border-b border-slate-200">
                        {['upcoming', 'completed', 'cancelled'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-4 text-sm font-semibold capitalize transition-all relative
                  ${activeTab === tab ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}
                `}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></div>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {appointments.map((appt) => (
                            <Card key={appt.id} className="hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex gap-4">
                                        <div className="h-12 w-12 rounded-full bg-slate-50 flex flex-col items-center justify-center text-slate-800 border border-slate-100">
                                            <span className="text-[10px] uppercase font-bold text-slate-400 leading-none">Mar</span>
                                            <span className="text-lg font-bold leading-none mt-1">{appt.date.split('-')[2]}</span>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-slate-900">{appt.patient}</h4>
                                                <Badge variant="info">{appt.type}</Badge>
                                            </div>
                                            <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                                                <span className="flex items-center gap-1.5 line-clamp-1">
                                                    <Stethoscope size={14} className="text-blue-500" />
                                                    {appt.doctor}
                                                </span>
                                                <span className="flex items-center gap-1.5 whitespace-nowrap">
                                                    <Clock size={14} className="text-blue-500" />
                                                    {appt.time}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 pl-16 md:pl-0">
                                        <Badge variant={appt.status === 'Completed' ? 'success' : 'warning'}>
                                            {appt.status}
                                        </Badge>
                                        <div className="h-8 w-[1px] bg-slate-100 mx-1 hidden md:block"></div>
                                        <Button variant="secondary" size="sm">Details</Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Appointments;
