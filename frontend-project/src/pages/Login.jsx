import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Hospital, Mail, Lock, ArrowRight, Github, AlertCircle } from 'lucide-react';
import { Button, Input } from '../components/UI';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/login', { email, password });
            if (response.data.success) {
                const { user, token } = response.data;
                login(user);
                localStorage.setItem('token', token);

                // Role-based redirection
                const role = user.role?.charAt(0).toUpperCase() + user.role?.slice(1).toLowerCase();
                switch (role) {
                    case 'Admin': navigate('/admin/dashboard'); break;
                    case 'Doctor': navigate('/doctor/dashboard'); break;
                    case 'Patient': navigate('/patient/dashboard'); break;
                    case 'Pharmacist': navigate('/pharmacist/dashboard'); break;
                    default: navigate('/');
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full animate-in fade-in zoom-in-95 duration-500">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-100 mb-6">
                        <Hospital size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">Welcome Back</h1>
                    <p className="text-slate-500 mt-2 font-medium">Please enter your details to sign in</p>
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/60 border border-slate-100">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="relative">
                            <Mail size={18} className="absolute left-3.5 top-[38px] text-slate-400 z-10" />
                            <Input
                                label="Email Address"
                                placeholder="doctor@hospital.com"
                                className="pl-11"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="relative">
                            <Lock size={18} className="absolute left-3.5 top-[38px] text-slate-400 z-10" />
                            <Input
                                label="Password"
                                type="password"
                                placeholder="••••••••"
                                className="pl-11"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="flex items-center justify-between py-2">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-100 transition-all" />
                                <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">Remember me</span>
                            </label>
                            <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">Forgot password?</a>
                        </div>

                        <Button variant="primary" type="submit" className="w-full h-12 text-base" disabled={isLoading}>
                            {isLoading ? 'Signing In...' : 'Sign In'}
                            <ArrowRight size={18} className="ml-2" />
                        </Button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-100"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="bg-white px-4 text-slate-400 font-bold tracking-widest uppercase">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Button variant="secondary" className="h-12" disabled={isLoading}>
                            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4 mr-2" />
                            Google
                        </Button>
                        <Button variant="secondary" className="h-12 text-slate-700" disabled={isLoading}>
                            <Github size={18} className="mr-2" />
                            Github
                        </Button>
                    </div>
                </div>

                <p className="text-center mt-8 text-sm font-medium text-slate-500">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-600 hover:text-blue-700 font-bold transition-colors">Create account</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
