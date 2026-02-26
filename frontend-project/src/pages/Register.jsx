import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Hospital, Mail, Lock, User, ShieldCheck, ArrowRight, UserCog, AlertCircle } from 'lucide-react';
import { Button, Input } from '../components/UI';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'Patient'
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const roles = [
        { value: 'Patient', label: 'Patient' },
        { value: 'Doctor', label: 'Doctor' },
        { value: 'Admin', label: 'Administrator' },
        { value: 'Pharmacist', label: 'Pharmacist' }
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }

        setIsLoading(true);
        try {
            const response = await api.post('/auth/register', {
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                password: formData.password,
                role: formData.role
            });

            if (response.data.success) {
                const { user, token } = response.data;
                login(user);
                localStorage.setItem('token', token);

                // Role-based redirection
                switch (user.role) {
                    case 'Admin': navigate('/admin/dashboard'); break;
                    case 'Doctor': navigate('/doctor/dashboard'); break;
                    case 'Patient': navigate('/patient/dashboard'); break;
                    case 'Pharmacist': navigate('/pharmacist/dashboard'); break;
                    default: navigate('/');
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-xl w-full animate-in fade-in zoom-in-95 duration-500">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-100 mb-4">
                        <Hospital size={28} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Hospital Registration</h1>
                    <p className="text-slate-500 mt-1 font-medium text-sm">Join our medical management network</p>
                </div>

                <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-200/60 border border-slate-100">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative">
                                <User size={18} className="absolute left-3.5 top-[38px] text-slate-400 z-10" />
                                <Input
                                    label="First Name"
                                    name="firstName"
                                    placeholder="John"
                                    className="pl-11"
                                    required
                                    value={formData.firstName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="relative">
                                <User size={18} className="absolute left-3.5 top-[38px] text-slate-400 z-10" />
                                <Input
                                    label="Last Name"
                                    name="lastName"
                                    placeholder="Doe"
                                    className="pl-11"
                                    required
                                    value={formData.lastName}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <Mail size={18} className="absolute left-3.5 top-[38px] text-slate-400 z-10" />
                            <Input
                                label="Hospital Email"
                                name="email"
                                type="email"
                                placeholder="staff@hospital.com"
                                className="pl-11"
                                required
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="relative">
                            <UserCog size={18} className="absolute left-3.5 top-[38px] text-slate-400 z-10" />
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Account Role</label>
                                <select
                                    name="role"
                                    className="w-full pl-11 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                                    value={formData.role}
                                    onChange={handleChange}
                                >
                                    {roles.map(role => (
                                        <option key={role.value} value={role.value}>{role.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative">
                                <Lock size={18} className="absolute left-3.5 top-[38px] text-slate-400 z-10" />
                                <Input
                                    label="Password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-11"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="relative">
                                <Lock size={18} className="absolute left-3.5 top-[38px] text-slate-400 z-10" />
                                <Input
                                    label="Confirm Password"
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-11"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <ShieldCheck className="text-blue-600 mt-0.5" size={20} />
                            <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                I agree to the <a href="#" className="underline text-blue-600 font-bold">Privacy Policy</a> and <a href="#" className="underline text-blue-600 font-bold">Security Protocols</a> for medical data handling.
                            </p>
                        </div>

                        <Button variant="primary" type="submit" className="w-full h-12 text-base" disabled={isLoading}>
                            {isLoading ? 'Creating Account...' : 'Register Account'}
                            <ArrowRight size={18} className="ml-2" />
                        </Button>
                    </form>
                </div>

                <p className="text-center mt-8 text-sm font-medium text-slate-500">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 hover:text-blue-700 font-bold transition-colors">Sign in here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
