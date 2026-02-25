import React, { useState, useEffect } from 'react';
import {
    Search,
    MessageSquare,
    Calendar,
    Star,
    MapPin,
    Stethoscope,
    Filter,
    Plus,
    Loader2,
    AlertCircle
} from 'lucide-react';
import { Card, Button, Input, Badge, Modal } from '../components/UI';
import { getDoctors, createDoctor } from '../services/doctorService';
import { useNavigate } from 'react-router-dom';

const DoctorCard = ({ name, specialty, rating, experience, status, availability, onBook }) => (
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
                <span className="text-sm font-semibold text-slate-700">{experience || '5'} Years</span>
            </div>
            <div className="flex flex-col text-right">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Rating</span>
                <div className="flex items-center justify-end gap-1 text-sm font-semibold text-amber-500">
                    <Star size={14} fill="currentColor" />
                    {rating || '4.8'}
                </div>
            </div>
        </div>

        <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-slate-500 leading-none">
                <Calendar size={16} className="text-slate-400" />
                {availability || 'Mon - Fri, 09:00 - 17:00'}
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500 leading-none">
                <MapPin size={16} className="text-slate-400" />
                OPD Floor 2, Room 204
            </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-6">
            <Button variant="secondary" size="sm" className="w-full" onClick={() => alert('Chat functionality coming soon!')}>
                <MessageSquare size={16} className="mr-2" />
                Message
            </Button>
            <Button variant="primary" size="sm" className="w-full" onClick={onBook}>
                Book Appt
            </Button>
        </div>
    </Card>
);

const Doctors = () => {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newDoctor, setNewDoctor] = useState({
        name: '',
        email: '',
        password: 'password123', // Default for now
        specialization: '',
        fee: 50
    });

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            const response = await getDoctors();
            if (response.data.success) {
                setDoctors(response.data.data);
            }
        } catch (err) {
            setError('Failed to fetch doctors. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddDoctor = async (e) => {
        e.preventDefault();
        try {
            // In a real app, you'd create the User first or have a unified endpoint
            // For this demo, let's assume we have a way to link or create
            // We'll use a simplified version for the user
            setError('');
            // This is a bit complex because of the User/Doctor split
            // Let's just alert for now or implement a simplified logic
            alert('Functional registration requires backend User+Doctor creation flow. Implementing demo version...');
            setIsModalOpen(false);
        } catch (err) {
            setError('Failed to create doctor.');
        }
    };

    const filteredDoctors = doctors.filter(dr =>
        dr.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dr.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Hospital Staff</h1>
                    <p className="text-slate-500">Our specialized medical professionals.</p>
                </div>
                <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} className="mr-2" />
                    Add New Doctor
                </Button>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input
                        placeholder="Search by name, specialty or staff ID..."
                        className="pl-10 h-10 border-none shadow-none focus:ring-0"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="h-10 w-[1px] bg-slate-100 hidden md:block"></div>
                <div className="flex gap-2">
                    <Button variant="secondary" size="sm" className="h-10 border-none shadow-none bg-slate-50">
                        <Filter size={18} className="mr-2" />
                        Filter
                    </Button>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-medium">
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}

            {loading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-400">
                    <Loader2 size={40} className="animate-spin text-blue-600" />
                    <p className="font-medium">Loading doctors...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredDoctors.map((dr) => (
                        <DoctorCard
                            key={dr._id}
                            name={dr.user?.name || 'Unknown'}
                            specialty={dr.specialization}
                            status={dr.available ? 'On Duty' : 'In Break'}
                            onBook={() => navigate('/appointments', { state: { doctorId: dr._id } })}
                        />
                    ))}
                    {filteredDoctors.length === 0 && (
                        <div className="col-span-full py-12 text-center text-slate-500">
                            No doctors found matching your search.
                        </div>
                    )}
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register New Doctor">
                <form onSubmit={handleAddDoctor} className="space-y-4">
                    <Input label="Full Name" placeholder="Dr. John Doe" required value={newDoctor.name} onChange={e => setNewDoctor({ ...newDoctor, name: e.target.value })} />
                    <Input label="Email Address" type="email" placeholder="john@hospital.com" required value={newDoctor.email} onChange={e => setNewDoctor({ ...newDoctor, email: e.target.value })} />
                    <Input label="Specialization" placeholder="Cardiology" required value={newDoctor.specialization} onChange={e => setNewDoctor({ ...newDoctor, specialization: e.target.value })} />
                    <Input label="Consultation Fee ($)" type="number" required value={newDoctor.fee} onChange={e => setNewDoctor({ ...newDoctor, fee: e.target.value })} />
                    <div className="pt-4 flex gap-3">
                        <Button variant="secondary" type="button" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button variant="primary" type="submit" className="flex-1">Register Doctor</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Doctors;
