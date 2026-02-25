import React from 'react';
import {
    Bell,
    Search,
    CircleUserRound,
    Menu,
    Hospital
} from 'lucide-react';

import { useAuth } from '../hooks/useAuth';

const Navbar = ({ onMenuClick }) => {
    const { user } = useAuth();

    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-30 px-4 md:px-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="p-2 hover:bg-slate-100 rounded-lg md:hidden"
                >
                    <Menu size={20} className="text-slate-600" />
                </button>

                <div className="flex items-center gap-2">
                    <div className="bg-blue-600 p-1.5 rounded-lg">
                        <Hospital size={22} className="text-white" />
                    </div>
                    <span className="font-bold text-xl text-slate-800 tracking-tight hidden sm:inline-block">
                        Medi<span className="text-blue-600">Sync</span>
                    </span>
                </div>
            </div>

            <div className="flex-1 max-w-md mx-8 hidden md:block">
                <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search patients, records..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all text-slate-700"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="h-8 w-[1px] bg-slate-200 mx-1 hidden sm:block"></div>

                <div className="flex items-center gap-3 pl-2">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-slate-800 leading-none">{user?.name || 'User'}</p>
                        <p className="text-xs text-slate-500 mt-1">{user?.role || 'Staff'}</p>
                    </div>
                    <button className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 ring-2 ring-white shadow-sm hover:scale-105 transition-transform">
                        <CircleUserRound size={24} />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
