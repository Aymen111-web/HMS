import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    UserRound,
    CalendarCheck,
    FileText,
    Settings,
    LogOut,
    AlertCircle,
    X
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Sidebar = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const getBasePath = () => {
        if (!user) return '';
        const role = user.role?.toLowerCase();
        switch (role) {
            case 'admin': return '/admin';
            case 'doctor': return '/doctor';
            case 'patient': return '/patient';
            default: return '';
        }
    };

    const basePath = getBasePath();

    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: `${basePath}/dashboard`, roles: ['Admin', 'Doctor', 'Patient'] },
        { name: 'Appointments', icon: CalendarCheck, path: `${basePath}/appointments`, roles: ['Admin', 'Doctor', 'Patient'] },
        { name: 'Patients', icon: Users, path: `${basePath}/patients`, roles: ['Admin', 'Doctor'] },
        { name: 'Doctors', icon: UserRound, path: `${basePath}/doctors`, roles: ['Admin', 'Patient'] },
        { name: 'Prescriptions', icon: FileText, path: `${basePath}/prescriptions`, roles: ['Doctor', 'Patient'] },
        { name: 'Medical Records', icon: FileText, path: `${basePath}/records`, roles: ['Patient'] },
        { name: 'Lab Reports', icon: FileText, path: `${basePath}/lab-reports`, roles: ['Patient'] },
        { name: 'Payments', icon: FileText, path: `${basePath}/payments`, roles: ['Patient'] },
        { name: 'Urgent Cases', icon: AlertCircle, path: `${basePath}/urgent-cases`, roles: ['Doctor'] },
        { name: 'Reports', icon: FileText, path: `${basePath}/reports`, roles: ['Admin', 'Doctor'] },
    ];

    const normalizedUserRole = user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1).toLowerCase();
    const filteredItems = navItems.filter(item =>
        !item.roles || item.roles.includes(normalizedUserRole)
    );

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const sidebarClasses = `
    fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 
    transform transition-transform duration-300 ease-in-out pt-16
    ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
  `;

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 md:hidden"
                    onClick={onClose}
                ></div>
            )}

            <aside className={sidebarClasses}>
                <div className="flex flex-col h-full bg-white px-4 py-8">
                    <button
                        onClick={onClose}
                        className="md:hidden absolute top-4 right-4 p-1 rounded-full bg-slate-100 text-slate-600 hover:text-slate-900"
                    >
                        <X size={20} />
                    </button>

                    <nav className="flex-1 space-y-1">
                        <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                            Main Navigation
                        </p>
                        {filteredItems.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                  ${isActive
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }
                `}
                            >
                                <item.icon size={20} className="transition-colors" />
                                <span className="font-medium">{item.name}</span>
                            </NavLink>
                        ))}
                    </nav>

                    <div className="pt-6 border-t border-slate-100 space-y-1">
                        <NavLink
                            to="/settings"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                            <Settings size={20} />
                            <span className="font-medium">Settings</span>
                        </NavLink>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-colors mt-1 group"
                        >
                            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
