import React, { useState, useEffect } from 'react';
import {
    Bell,
    Search,
    CircleUserRound,
    Menu,
    Hospital,
    X,
    Check
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

const Navbar = ({ onMenuClick }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        const fetchNotifications = async () => {
            if (user?.id) {
                try {
                    const res = await api.get(`/notifications?userId=${user.id}`);
                    setNotifications(res.data.data);
                } catch (err) {
                    console.error('Error fetching notifications:', err);
                }
            }
        };

        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Check every 30s
        return () => clearInterval(interval);
    }, [user]);

    const markAsRead = async (id) => {
        try {
            await api.patch(`/notifications/${id}/read`);
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (err) {
            console.error('Error marking as read:', err);
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-50 px-4 md:px-8 flex items-center justify-between">
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
                <div className="relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        )}
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="font-bold text-slate-900">Notifications</h3>
                                <button onClick={() => setShowNotifications(false)}><X size={16} className="text-slate-400" /></button>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {notifications.length > 0 ? notifications.map(n => (
                                    <div key={n._id} className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors ${!n.isRead ? 'bg-blue-50/30' : ''}`}>
                                        <div className="flex justify-between items-start mb-1">
                                            <p className={`text-sm font-bold ${!n.isRead ? 'text-blue-600' : 'text-slate-700'}`}>{n.title}</p>
                                            {!n.isRead && (
                                                <button onClick={() => markAsRead(n._id)} className="p-1 hover:bg-blue-100 rounded-full text-blue-600"><Check size={14} /></button>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-500 leading-relaxed">{n.message}</p>
                                        <p className="text-[10px] text-slate-400 mt-2 font-medium">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                )) : (
                                    <div className="p-8 text-center">
                                        <Bell size={32} className="mx-auto text-slate-200 mb-2" />
                                        <p className="text-sm text-slate-400 font-medium">No notifications yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

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
