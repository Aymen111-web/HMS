import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const RoleDashboardRedirect = () => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" />;
    }

    const rawRole = user.role || '';
    const role = rawRole.charAt(0).toUpperCase() + rawRole.slice(1).toLowerCase();

    switch (role) {
        case 'Admin': return <Navigate to="/admin/dashboard" replace />;
        case 'Doctor': return <Navigate to="/doctor/dashboard" replace />;
        case 'Patient': return <Navigate to="/patient/dashboard" replace />;
        default:
            console.error('RoleDashboardRedirect: Unknown role:', user.role);
            return <Navigate to="/login" replace />;
    }
};

export default RoleDashboardRedirect;
