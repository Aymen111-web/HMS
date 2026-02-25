import React, { useState, useEffect } from 'react';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Droplet,
    Shield,
    Camera,
    Loader2,
    CheckCircle,
    Save,
    Lock
} from 'lucide-react';
import { Card, Button, Input, Select } from '../../components/UI';
import { useAuth } from '../../hooks/useAuth';
import { getPatientProfile, updatePatientProfile } from '../../services/patientService';

const PatientProfile = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        age: '',
        gender: '',
        bloodGroup: '',
        emergencyContact: {
            name: '',
            relationship: '',
            phone: ''
        }
    });

    useEffect(() => {
        if (user?.patientId) {
            fetchProfile();
        }
    }, [user]);

    const fetchProfile = async () => {
        try {
            const res = await getPatientProfile(user.patientId);
            if (res.data.success) {
                const data = res.data.data;
                setProfileData({
                    name: data.user?.name || '',
                    email: data.user?.email || '',
                    phone: data.phone || '',
                    address: data.address || '',
                    age: data.age || '',
                    gender: data.gender || 'Male',
                    bloodGroup: data.bloodGroup || '',
                    emergencyContact: data.emergencyContact || {
                        name: '',
                        relationship: '',
                        phone: ''
                    }
                });
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('emergency_')) {
            const field = name.split('_')[1];
            setProfileData(prev => ({
                ...prev,
                emergencyContact: {
                    ...prev.emergencyContact,
                    [field]: value
                }
            }));
        } else {
            setProfileData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await updatePatientProfile(user.patientId, profileData);
            if (res.data.success) {
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            }
        } catch (err) {
            console.error('Error updating profile:', err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
                <Loader2 size={40} className="animate-spin text-blue-600" />
                <p className="text-slate-500 font-medium">Syncing your profile data...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Personal Profile</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage your identity and medical identification</p>
                </div>
                {success && (
                    <div className="flex items-center gap-2 px-6 py-3 bg-emerald-100 text-emerald-700 rounded-2xl font-bold animate-in slide-in-from-top duration-300">
                        <CheckCircle size={20} />
                        Profile updated successfully!
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column: Avatar & Quick Info */}
                <div className="lg:col-span-1 space-y-8">
                    <Card className="text-center p-10 flex flex-col items-center border-slate-100 shadow-xl shadow-slate-200/50">
                        <div className="relative group mb-6">
                            <div className="h-32 w-32 rounded-[2.5rem] bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all cursor-pointer overflow-hidden border-4 border-white shadow-lg">
                                <User size={64} className="transition-transform group-hover:scale-110" />
                            </div>
                            <button type="button" className="absolute bottom-0 right-0 h-10 w-10 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center text-blue-600 hover:bg-slate-50 transition-colors">
                                <Camera size={18} />
                            </button>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 leading-tight mb-1">{profileData.name}</h3>
                        <p className="text-blue-600 font-bold text-sm mb-8">Patient Account</p>

                        <div className="w-full space-y-3">
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest leading-none">Status</span>
                                <Badge variant="success">Verified Profile</Badge>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left">
                                <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Membership</p>
                                <p className="text-sm font-bold text-slate-700">Premium Health Care</p>
                            </div>
                        </div>
                    </Card>

                    <Card title="Security" subtitle="Account protection">
                        <div className="space-y-4">
                            <Button variant="secondary" className="w-full justify-start rounded-xl text-slate-700" type="button">
                                <Lock size={18} className="mr-3 text-slate-400" />
                                Change Password
                            </Button>
                            <Button variant="secondary" className="w-full justify-start rounded-xl text-slate-700" type="button">
                                <Shield size={18} className="mr-3 text-slate-400" />
                                2FA Settings
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Detailed Forms */}
                <div className="lg:col-span-2 space-y-10">
                    <Card title="Personal Information" className="md:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <User size={12} className="text-blue-500" /> Full Name
                                </label>
                                <Input name="name" value={profileData.name} onChange={handleChange} required className="h-14 rounded-2xl bg-slate-50/50 border-slate-100 text-slate-700 font-bold" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <Mail size={12} className="text-blue-500" /> Email Address
                                </label>
                                <Input type="email" name="email" value={profileData.email} onChange={handleChange} required disabled className="h-14 rounded-2xl bg-white border-slate-100 text-slate-400 font-bold" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <Phone size={12} className="text-blue-500" /> Phone Number
                                </label>
                                <Input name="phone" value={profileData.phone} onChange={handleChange} required className="h-14 rounded-2xl bg-slate-50/50 border-slate-100 text-slate-700 font-bold" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <Calendar size={12} className="text-blue-500" /> Current Age
                                </label>
                                <Input type="number" name="age" value={profileData.age} onChange={handleChange} className="h-14 rounded-2xl bg-slate-50/50 border-slate-100 text-slate-700 font-bold" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    Gender Identification
                                </label>
                                <Select name="gender" value={profileData.gender} onChange={handleChange} className="h-14 rounded-2xl bg-slate-50/50 border-slate-100 text-slate-700 font-bold">
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <Droplet size={12} className="text-rose-500" /> Blood Group
                                </label>
                                <Input name="bloodGroup" value={profileData.bloodGroup} onChange={handleChange} placeholder="e.g. O+" className="h-14 rounded-2xl bg-slate-50/50 border-slate-100 text-slate-700 font-bold" />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <MapPin size={12} className="text-blue-500" /> Residential Address
                                </label>
                                <textarea name="address" value={profileData.address} onChange={handleChange} rows="3" className="w-full p-4 rounded-2xl border border-slate-100 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-slate-700 font-bold bg-slate-50/50" placeholder="Street name, City, State, Country"></textarea>
                            </div>
                        </div>
                    </Card>

                    <Card title="Emergency Contact" className="md:p-8 bg-slate-50/30">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Contact Name</label>
                                <Input name="emergency_name" value={profileData.emergencyContact.name} onChange={handleChange} className="h-14 rounded-2xl bg-white border-slate-100 text-slate-700 font-bold shadow-sm" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Relationship</label>
                                <Input name="emergency_relationship" value={profileData.emergencyContact.relationship} onChange={handleChange} className="h-14 rounded-2xl bg-white border-slate-100 text-slate-700 font-bold shadow-sm" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Emergency Phone</label>
                                <Input name="emergency_phone" value={profileData.emergencyContact.phone} onChange={handleChange} className="h-14 rounded-2xl bg-white border-slate-100 text-slate-700 font-bold shadow-sm" />
                            </div>
                        </div>
                    </Card>

                    <div className="flex justify-end gap-4 pt-4">
                        <Button variant="ghost" className="h-14 px-8 rounded-2xl font-bold" type="button" onClick={fetchProfile}>
                            Discard Changes
                        </Button>
                        <Button type="submit" variant="primary" className="h-14 px-12 rounded-2xl font-black text-lg shadow-xl shadow-blue-900/10" disabled={submitting}>
                            {submitting ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                <>
                                    <Save size={20} className="mr-2" />
                                    Save Profile Data
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default PatientProfile;
