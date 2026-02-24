import React from 'react';
import {
    Search,
    MessageSquare,
    Calendar,
    Star,
    MapPin,
    Stethoscope,
    Filter
} from 'lucide-react';
import { Card, Button, Input, Badge } from '../components/UI';

const DoctorCard = ({ name, specialty, rating, experience, status, availability }) => (
    <Card className="hover:border-blue-200 transition-colors group">
        <div className="flex items-start justify-between mb-4">
            <div className="flex gap-4">
                <div className="h-14 w-14 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <Stethoscope size={28} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{name}</h3>
                    <p className="text-sm text-blue-600 font-medium">{specialty}</p>
                </div>
            </div>
            <Badge variant={status === 'On Duty' ? 'success' : 'warning'}>{status}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50 my-4">
            <div className="flex flex-col">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Experience</span>
                <span className="text-sm font-semibold text-slate-700">{experience} Years</span>
            </div>
            <div className="flex flex-col text-right">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Rating</span>
                <div className="flex items-center justify-end gap-1 text-sm font-semibold text-amber-500">
                    <Star size={14} fill="currentColor" />
                    {rating}
                </div>
            </div>
        </div>

        <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-slate-500 leading-none">
                <Calendar size={16} className="text-slate-400" />
                {availability}
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500 leading-none">
                <MapPin size={16} className="text-slate-400" />
                OPD Floor 2, Room 204
            </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-6">
            <Button variant="secondary" size="sm" className="w-full">
                <MessageSquare size={16} className="mr-2" />
                Message
            </Button>
            <Button variant="primary" size="sm" className="w-full">
                Book Appt
            </Button>
        </div>
    </Card>
);

const Doctors = () => {
    const doctors = [
        { name: 'Dr. Michael Chen', specialty: 'Cardiologist', rating: '4.9', experience: '12', status: 'On Duty', availability: 'Mon - Fri, 09:00 - 17:00' },
        { name: 'Dr. Emily Blunt', specialty: 'Neurologist', rating: '4.8', experience: '8', status: 'On Duty', availability: 'Tue - Sat, 10:00 - 18:00' },
        { name: 'Dr. Sarah Wilson', specialty: 'Pediatrician', rating: '5.0', experience: '15', status: 'In Break', availability: 'Mon - Fri, 08:30 - 16:30' },
        { name: 'Dr. James Moore', specialty: 'Dermatologist', rating: '4.7', experience: '10', status: 'On Duty', availability: 'Wed - Sun, 11:00 - 19:00' },
        { name: 'Dr. Robert Fox', specialty: 'Orthopedic', rating: '4.9', experience: '20', status: 'On Duty', availability: 'Mon - Fri, 09:00 - 17:00' },
        { name: 'Dr. Anna Stone', specialty: 'Gynecologist', rating: '4.8', experience: '11', status: 'On Duty', availability: 'Mon - Thu, 09:00 - 15:00' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Hospital Staff</h1>
                    <p className="text-slate-500">Our specialized medical professionals.</p>
                </div>
                <Button variant="primary">
                    Add New Doctor
                </Button>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input placeholder="Search by name, specialty or staff ID..." className="pl-10 h-10 border-none shadow-none focus:ring-0" />
                </div>
                <div className="h-10 w-[1px] bg-slate-100 hidden md:block"></div>
                <div className="flex gap-2">
                    <Button variant="secondary" size="sm" className="h-10 border-none shadow-none bg-slate-50">
                        <Filter size={18} className="mr-2" />
                        Filter
                    </Button>
                    <select className="px-4 h-10 bg-slate-50 border-none rounded-lg text-sm text-slate-700 outline-none transition-all">
                        <option>All Specialties</option>
                        <option>Cardiology</option>
                        <option>Neurology</option>
                        <option>Pediatrics</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {doctors.map((dr, idx) => (
                    <DoctorCard key={idx} {...dr} />
                ))}
            </div>
        </div>
    );
};

export default Doctors;
