import React from 'react';
import { Link } from 'react-router-dom';
import { Hospital, Mail, Lock, User, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button, Input } from '../components/UI';

const Register = () => {
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
                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative">
                                <User size={18} className="absolute left-3.5 top-[38px] text-slate-400 z-10" />
                                <Input label="First Name" placeholder="John" className="pl-11" />
                            </div>
                            <div className="relative">
                                <User size={18} className="absolute left-3.5 top-[38px] text-slate-400 z-10" />
                                <Input label="Last Name" placeholder="Doe" className="pl-11" />
                            </div>
                        </div>

                        <div className="relative">
                            <Mail size={18} className="absolute left-3.5 top-[38px] text-slate-400 z-10" />
                            <Input label="Hospital Email" placeholder="staff@hospital.com" className="pl-11" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative">
                                <Lock size={18} className="absolute left-3.5 top-[38px] text-slate-400 z-10" />
                                <Input label="Password" type="password" placeholder="••••••••" className="pl-11" />
                            </div>
                            <div className="relative">
                                <Lock size={18} className="absolute left-3.5 top-[38px] text-slate-400 z-10" />
                                <Input label="Confirm Password" type="password" placeholder="••••••••" className="pl-11" />
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <ShieldCheck className="text-blue-600 mt-0.5" size={20} />
                            <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                I agree to the <a href="#" className="underline text-blue-600 font-bold">Privacy Policy</a> and <a href="#" className="underline text-blue-600 font-bold">Security Protocols</a> for medical data handling.
                            </p>
                        </div>

                        <Button variant="primary" className="w-full h-12 text-base">
                            Register Account
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
