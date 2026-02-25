import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const RoleDashboardRedirect = () => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" />;
    }

    switch (user.role) {
        case 'Admin':
            return <Navigate to="/admin/dashboard" />;
        case 'Doctor':
            return <Navigate to="/doctor/dashboard" />;
        case 'Patient':
            return <Navigate to="/patient/dashboard" />;
        default:
            return <Navigate to="/login" />;
    }
};

export default RoleDashboardRedirect;
