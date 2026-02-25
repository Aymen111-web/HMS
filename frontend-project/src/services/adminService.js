import api from './api';

export const getAdminAnalytics = () => api.get('/admin/analytics');
export const getAllUsers = () => api.get('/admin/users');
export const getActiveUsers = () => api.get('/admin/active-users');
export const toggleUserStatus = (id, role, status) => api.patch(`/admin/users/${id}/status`, { role, status });

// Auth logout — marks user offline in DB
export const logoutUser = (userId) => api.post('/auth/logout', { userId });

const adminService = {
    getAdminAnalytics,
    getAllUsers,
    getActiveUsers,
    toggleUserStatus,
    logoutUser
};

export default adminService;
