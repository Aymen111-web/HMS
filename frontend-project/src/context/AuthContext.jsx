import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem('hms_user');
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (err) {
            console.error('Error parsing user from localStorage', err);
            localStorage.removeItem('hms_user');
            return null;
        }
    });
    const [loading, setLoading] = useState(true);

    // Auto-heal: if a Patient/Doctor user is missing their profile ID, look it up
    useEffect(() => {
        const healMissingProfileId = async () => {
            if (!user) { setLoading(false); return; }

            try {
                if (user.role === 'Patient' && !user.patientId) {
                    const res = await api.get(`/patients/by-user/${user.id}`);
                    if (res.data.success) {
                        const healed = { ...user, patientId: res.data.data._id };
                        setUser(healed);
                        localStorage.setItem('hms_user', JSON.stringify(healed));
                    }
                } else if (user.role === 'Doctor' && !user.doctorId) {
                    const res = await api.get(`/doctors/by-user/${user.id}`);
                    if (res.data.success) {
                        const healed = { ...user, doctorId: res.data.data._id };
                        setUser(healed);
                        localStorage.setItem('hms_user', JSON.stringify(healed));
                    }
                }
            } catch (err) {
                console.warn('Profile ID healing failed:', err.message);
            } finally {
                setLoading(false);
            }
        };

        healMissingProfileId();
    }, []); // only runs once on mount

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('hms_user', JSON.stringify(userData));
    };

    const logout = async () => {
        try {
            // Tell backend to mark user offline — fire-and-forget with userId fallback
            const userId = user?.id;
            await api.post('/auth/logout', { userId });
        } catch (err) {
            // Non-critical — still clear local session even if network fails
            console.warn('Logout backend call failed:', err.message);
        } finally {
            setUser(null);
            localStorage.removeItem('hms_user');
            localStorage.removeItem('hms_token');
        }
    };

    const updateUser = (updates) => {
        const updated = { ...user, ...updates };
        setUser(updated);
        localStorage.setItem('hms_user', JSON.stringify(updated));
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser, isAuthenticated: !!user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
