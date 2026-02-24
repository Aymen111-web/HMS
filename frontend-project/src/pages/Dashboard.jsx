import React from 'react';
import {
    Users,
    UserRound,
    CalendarCheck,
    Activity,
    TrendingUp,
    Clock,
    ChevronRight
} from 'lucide-react';
import { Card, Button, Badge } from '../components/UI';

const StatCard = ({ title, value, icon: Icon, trend, color }) => (
    <Card className="relative overflow-hidden group hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-2">{value}</h3>
                {trend && (
                    <div className="flex items-center gap-1 mt-2 text-emerald-600">
                        <TrendingUp size={16} />
                        <span className="text-sm font-medium">{trend}</span>
                    </div>
                )}
            </div>
            <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
                <Icon size={24} />
            </div>
        </div>
    </Card>
);

const Dashboard = () => {
    const recentAppointments = [
        { id: 1, patient: 'Sarah Johnson', doctor: 'Dr. Michael Chen', time: '09:00 AM', status: 'Confirmed' },
        { id: 2, patient: 'Robert Smith', doctor: 'Dr. Emily Blunt', time: '10:30 AM', status: 'Pending' },
        { id: 3, patient: 'Maria Garcia', doctor: 'Dr. Sarah Wilson', time: '01:15 PM', status: 'Completed' },
        { id: 4, patient: 'David Brown', doctor: 'Dr. James Moore', time: '02:45 PM', status: 'Confirmed' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Hospital Overview</h1>
                    <p className="text-slate-500 mt-1">Welcome back. Here's what's happening today.</p>
                </div>
                <div className="hidden sm:block">
                    <Button variant="primary">
                        <Activity size={18} className="mr-2" />
                        Generate Report
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Patients"
                    value="1,284"
                    icon={Users}
                    trend="+12% this month"
                    color="bg-blue-100"
                />
                <StatCard
                    title="Active Doctors"
                    value="48"
                    icon={UserRound}
                    trend="None available"
                    color="bg-emerald-100"
                />
                <StatCard
                    title="Appointments"
                    value="64"
                    icon={CalendarCheck}
                    trend="8 new today"
                    color="bg-purple-100"
                />
                <StatCard
                    title="Emergency"
                    value="3"
                    icon={Clock}
                    color="bg-rose-100"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card title="Appointment Schedule" subtitle="Today's scheduled visits" className="lg:col-span-2">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                <tr className="border-b border-slate-100">
                                    <th className="pb-4">Patient</th>
                                    <th className="pb-4">Consultant</th>
                                    <th className="pb-4">Time</th>
                                    <th className="pb-4">Status</th>
                                    <th className="pb-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {recentAppointments.map((app) => (
                                    <tr key={app.id} className="group hover:bg-slate-50 transition-colors">
                                        <td className="py-4 font-medium text-slate-800">{app.patient}</td>
                                        <td className="py-4 text-slate-600">{app.doctor}</td>
                                        <td className="py-4 text-slate-600">{app.time}</td>
                                        <td className="py-4">
                                            <Badge variant={
                                                app.status === 'Confirmed' ? 'info' :
                                                    app.status === 'Completed' ? 'success' : 'warning'
                                            }>
                                                {app.status}
                                            </Badge>
                                        </td>
                                        <td className="py-4 text-right">
                                            <button className="p-1 hover:bg-slate-200 rounded text-slate-400 group-hover:text-slate-600">
                                                <ChevronRight size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Button variant="ghost" className="w-full mt-4 text-blue-600 hover:text-blue-700">
                        View All Appointments
                    </Button>
                </Card>

                <Card title="Quick Actions">
                    <div className="space-y-3">
                        <Button variant="secondary" className="w-full justify-start text-left h-auto p-4 flex-col items-start gap-1">
                            <span className="font-semibold text-slate-800">New Registration</span>
                            <span className="text-xs text-slate-500 font-normal">Add a new patient to the system</span>
                        </Button>
                        <Button variant="secondary" className="w-full justify-start text-left h-auto p-4 flex-col items-start gap-1">
                            <span className="font-semibold text-slate-800">Schedule Visit</span>
                            <span className="text-xs text-slate-500 font-normal">Book an appointment for a patient</span>
                        </Button>
                        <Button variant="secondary" className="w-full justify-start text-left h-auto p-4 flex-col items-start gap-1 text-red-600">
                            <span className="font-semibold">Urgent Case</span>
                            <span className="text-xs text-slate-500 font-normal">Process emergency patient recording</span>
                        </Button>
                    </div>

                    <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <h4 className="text-sm font-semibold text-blue-800">Support Center</h4>
                        <p className="text-xs text-blue-600 mt-1">Need help with the system?</p>
                        <Button variant="primary" size="sm" className="mt-3 w-full">Contact Admin</Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
